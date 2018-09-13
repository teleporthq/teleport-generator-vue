import GeneralUtils from './generalUtils'
import { PROPS_KEY, THIS } from '../constants'

export default class StylesUtils {
  public static detectDynamicStyle(styles: any): any {
    const dynamicStyles = {}
    const staticStyles = {}
    Object.keys(styles).forEach((style) => {
      const { dynamicStyle, staticStyle } = extractDynamicPropsFromStyle(styles[style])
      if (Object.keys(dynamicStyle).length) {
        dynamicStyles[style] = dynamicStyle
      }
      if (Object.keys(staticStyle).length) {
        staticStyles[style] = staticStyle
      }
    })

    return { dynamicStyles, staticStyles }
  }

  public static generateDynamicStylesData(dynamicStyles: any): string {
    return Object.keys(dynamicStyles)
      .map((style) => {
        const styleValue = dynamicStyles[style]

        const dynamicStyle = Object.keys(styleValue)
          .map((styleKey) => {
            const hasProp = styleValue[styleKey] && styleValue[styleKey].length && styleValue[styleKey].indexOf(PROPS_KEY) >= 0
            const isComposedStyleKey = GeneralUtils.containsSpecialCharacters(styleKey)
            const keyString = isComposedStyleKey ? `"${styleKey}"` : styleKey

            return hasProp
              ? `${keyString}: ${GeneralUtils.interpolateString(styleValue[styleKey], PROPS_KEY, '', '', THIS)}`
              : `${keyString}: ${JSON.stringify(styleValue[styleKey])}`
          })
          .toString()

        return `${style}: { ${dynamicStyle} }`
      })
      .toString()
  }

  public static computeStyleType(styles: any, style: any): any {
    let dynamicStyle = false
    let staticStyle = false
    if (!styles[style]) {
      return { dynamicStyle, staticStyle }
    }

    const styleObj = styles[style]
    const styleObjKeys = Object.keys(styleObj)
    for (const styleProp of styleObjKeys) {
      const styleValue = JSON.stringify(styleObj[styleProp])
      const isDynamic = styleValue.indexOf(PROPS_KEY) >= 0
      if (isDynamic) {
        dynamicStyle = true
      } else {
        staticStyle = true
      }
      if (dynamicStyle && staticStyle) {
        break
      }
    }
    return { dynamicStyle, staticStyle }
  }
}

function extractDynamicPropsFromStyle(style: any): any {
  const dynamicStyle = {}
  const staticStyle = {}

  Object.keys(style).forEach((styleKey) => {
    const stylePropIsDynamic = JSON.stringify(style[styleKey]).indexOf(PROPS_KEY) >= 0
    if (stylePropIsDynamic) {
      dynamicStyle[styleKey] = style[styleKey]
    } else {
      staticStyle[styleKey] = style[styleKey]
    }
  })
  return { dynamicStyle, staticStyle }
}
