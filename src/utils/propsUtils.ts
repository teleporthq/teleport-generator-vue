import { Content, ComponentEditableProp } from '@teleporthq/teleport-lib-js/dist/types'
import { PROPS_KEY } from '../constants'
import GeneralUtils from './generalUtils'
import upperFirst from 'lodash/upperFirst'

export default class PropsUtils {
  public static findPropsFromContent(content: Content, editableProps: ComponentEditableProp[], styles: any): string {
    const contentString = `${JSON.stringify(content)} ${JSON.stringify(styles)}`
    const children = contentString.split(PROPS_KEY)
    if (!children.length) {
      return ''
    }
    children.shift()

    const editablePropsKeys = Object.keys(editableProps)
    const props = {}

    children.forEach((child) => {
      const prop = child.split('"')[0]
      const isEditableProp = editablePropsKeys.indexOf(prop) >= 0
      const type = isEditableProp ? upperFirst(editableProps[prop].type) : findPossiblePropType(prop)
      props[prop] = type
    })
    return stringifyProps(props)
  }

  public static parseChildrenElementsForProps(content: any, isStyleObject?: boolean): string {
    return parseChildrenForProps(content, isStyleObject)
  }
}

function parseChildrenForProps(content: any, isStyleObject?: boolean): string {
  if (!content) {
    return ''
  }

  if (typeof content === 'string') {
    return content.indexOf(PROPS_KEY) === 0 ? GeneralUtils.interpolateString(content, PROPS_KEY) : content
  }

  Object.keys(content).forEach((contentKey) => {
    const value = content[contentKey]
    if (typeof value !== 'string') {
      return parseChildrenForProps(value)
    }
    if (value.indexOf(PROPS_KEY) === 0) {
      content[contentKey] = GeneralUtils.interpolateString(value, PROPS_KEY)
    }
  })

  content = JSON.stringify(content)
  return isStyleObject ? content.replace(/"/g, '\\"') : GeneralUtils.interpolateString(content)
}

function findPossiblePropType(prop: string): string {
  if (prop.indexOf('}') >= 0) {
    return 'Object'
  }
  if (prop.indexOf(']') >= 0) {
    return 'Array'
  }
  return 'String'
}

function stringifyProps(props: any): string {
  return Object.keys(props)
    .map((key) => {
      return `${key}: ${props[key]}`
    })
    .toString()
}
