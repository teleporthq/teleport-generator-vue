import { Content, ComponentEditableProp } from '@teleporthq/teleport-lib-js/dist/types'
import { PROPS_KEY } from '../constants'
import GeneralUtils from './generalUtils'
import upperFirst from 'lodash/upperFirst'

export default class PropsUtils {
  public static findPropsFromContent(content: Content, editableProps: ComponentEditableProp[], styles: any): string {
    const contentString = `${JSON.stringify(content)} ${JSON.stringify(styles)}`
    const children = contentString.split(PROPS_KEY)
    children.shift()

    const editablePropsKeys = Object.keys(editableProps)
    const props = {}

    children.forEach((child) => {
      const prop = child.split('"')[0]
      const isEditableProp = editablePropsKeys.indexOf(prop) >= 0
      const type = isEditableProp ? upperFirst(editableProps[prop].type) : 'String'
      props[prop] = type
    })
    return stringifyProps(props)
  }

  public static hasDynamicProp(content: any): boolean {
    if (!content) {
      return false
    }
    const contentString = JSON.stringify(content)
    return contentString.indexOf(PROPS_KEY) >= 0
  }

  public static parseChildrenElementsForProps(content: any, escapeString?: boolean, noInterpolation?: boolean): string {
    return parseChildrenForProps(content, escapeString, noInterpolation)
  }
}

function parseChildrenForProps(content: any, escapeString?: boolean, noInterpolation?: boolean): string {
  if (!content) {
    return ''
  }
  const interpolationStart = noInterpolation ? '' : undefined
  const interpolationEnd = noInterpolation ? '' : undefined

  if (typeof content === 'string') {
    return content.indexOf(PROPS_KEY) === 0 ? GeneralUtils.interpolateString(content, PROPS_KEY, interpolationStart, interpolationEnd) : content
  }

  Object.keys(content).forEach((contentKey) => {
    const value = content[contentKey]
    if (typeof value !== 'string') {
      return parseChildrenForProps(value)
    }
    if (value.indexOf(PROPS_KEY) === 0) {
      content[contentKey] = GeneralUtils.interpolateString(value, PROPS_KEY, interpolationStart, interpolationEnd)
    }
  })

  content = JSON.stringify(content)
  return escapeString ? content.replace(/"/g, '\\"') : GeneralUtils.interpolateString(content)
}

function stringifyProps(props: any): string {
  return Object.keys(props)
    .map((key) => {
      return `${key}: ${props[key]}`
    })
    .toString()
}
