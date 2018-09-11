import { ComponentCodeGenerator, FileSet, Target } from '@teleporthq/teleport-lib-js'
import { Content, ComponentEditableProp, ComponentGeneratorOptions } from '@teleporthq/teleport-lib-js/dist/types'
import styleTransformers from '@teleporthq/teleport-lib-js/dist/transformers/styles'
import { PropsUtils, StylesUtils } from './utils'
import upperFirst from 'lodash/upperFirst'
import flatten from 'lodash/flatten'
const { jsstocss } = styleTransformers

function renderElement(name: string, children?: string, styles?: any, elementStyles?: any, props?: any): string {
  let stylesString: string = ''
  if (elementStyles) {
    const classStyle = Array.isArray(elementStyles) ? elementStyles.join(' ') : elementStyles
    const isDynamicStyle = StylesUtils.isDynamicStyle(styles, classStyle)
    stylesString = isDynamicStyle ? `:style="${classStyle}"` : `class="${classStyle}"`
  }

  const propsString: string = Object.keys(props)
    .map((propName) => `${propName}="${PropsUtils.parseChildrenElementsForProps(props[propName], true)}"`)
    .join(' ')

  children = PropsUtils.parseChildrenElementsForProps(children)

  return !children || !children.length
    ? `<${name} ${stylesString} ${propsString}/>`
    : `<${name} ${stylesString} ${propsString}>
        ${children}
      </${name}>`
}

function generateTemplate(content: any, styles: any, target: Target, options: ComponentGeneratorOptions): any {
  const { source, type, ...props } = content
  let mapping: any = null
  let mappedType: string = type

  if (source !== 'components') {
    mapping = target.map(source, type)
    mappedType = mapping ? mapping.type : type
  }

  const className: any = props.style || null
  const children: any = props.children || null
  delete props.style
  delete props.children

  let childrenTags: any = []
  if (children && children.length) {
    childrenTags = typeof children === 'string' ? children : children.map((child) => generateTemplate(child, styles, target, options))
  }

  // const { props: componentProps, ...otherProps } = props
  // const mappedProps = { ...componentProps, ...otherProps }

  // if (mappedProps.children && Array.isArray(mappedProps.children)) {
  //   childrenTags = mappedProps.children.map((child) => generateTemplate(child, styles, target, options))
  //   delete mappedProps.children
  // }

  if (Array.isArray(childrenTags)) {
    childrenTags = childrenTags.join('')
  }

  return renderElement(mappedType, childrenTags, styles, className, props)
}

function renderTemplate(name: string, template: string, dependenciesData: any, styles: any, props: string): string {
  const { dependenciesString, componentsString } = dependenciesData
  const { dynamicStyles, staticStyles } = StylesUtils.detectDynamicStyle(styles)
  const dynamicStylesString = StylesUtils.generateDynamicStylesData(dynamicStyles)

  const styleContent = jsstocss.stylesheet(staticStyles).css
  const stylesString = styleContent && styleContent.length ? `<style> ${styleContent} </style>` : ''
  const dataString = dynamicStylesString && dynamicStylesString.length ? `data () { return { ${dynamicStylesString} } },` : ''

  return `
    <template>
      ${template}
    </template>

    <script>
    ${dependenciesString}

    export default {
      name: ${JSON.stringify(upperFirst(name))},
      props: { ${props} },
      ${dataString}
      ${componentsString}
    }
    </script>

    ${stylesString}
  `
}

export default class VueComponentCodeGenerator extends ComponentCodeGenerator {
  public render(
    name: string,
    content: Content,
    dependencies: any = {},
    styles: any,
    props: ComponentEditableProp[],
    target: Target,
    options?: ComponentGeneratorOptions
  ): FileSet | null {
    const componentProps = PropsUtils.findPropsFromContent(content, props, styles)
    const dependenciesData = this.getDependenciesData(dependencies)

    const template = generateTemplate(content, styles, target, options)
    const classFileContent = renderTemplate(name, template, dependenciesData, styles, componentProps)

    const result = new FileSet()
    result.addFile(`${upperFirst(name)}.vue`, classFileContent)
    return result
  }

  private getDependenciesData(dependencies: any): object {
    return {
      dependenciesString: this.getDependenciesString(dependencies),
      componentsString: this.getComponentsString(dependencies),
    }
  }

  private getDependenciesString(dependencies: any = {}, options?: ComponentGeneratorOptions): string {
    return Object.keys(dependencies)
      .map((libraryName) => this.renderDependency(libraryName, dependencies[libraryName], options))
      .join('')
  }

  private getComponentsString(dependencies: any = {}): string {
    const types = Object.keys(dependencies).map((libraryName) => dependencies[libraryName])
    const components = flatten(types)
      .map((type) => (typeof type === 'string' ? type : type.type))
      .join('')

    return dependencies && Object.keys(dependencies).length ? `components: {${components}}` : ''
  }
}
