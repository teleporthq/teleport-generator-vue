import upperFirst = require('lodash/upperFirst')

const renderDependency = (libraryName, types) => {
  return `import ${types.join(', ')} from '${libraryName}'`
}

export default function component(name: string, template: string, dependencies: any = {}, styles, props): any {
  const dependenciesArray = Object.keys(dependencies).map((libraryName) => renderDependency(libraryName, dependencies[libraryName]))

  let propsString = ''
  if (props && props.length > 0) {
    propsString = `props: [${props.join(', ')}],`
  }

  let componentsString = ''
  if (dependencies && Object.keys(dependencies).length > 0) {
    componentsString = `components: {
      ${Object.keys(dependencies)
        .map((librabryName) => dependencies[librabryName])
        .join(', ')}      
    }`
  }

  let stylesString = ''
  if (styles) {
    stylesString = `<style>${styles}</style>`
  }

  return `
    <template>
        ${template}
    </template>
    
    <script>
    ${dependenciesArray.join(``)}
    
    export default {
      name: ${JSON.stringify(upperFirst(name))},
      ${propsString}
      ${componentsString}
    }
    </script>
    
    ${stylesString}
  `
}
