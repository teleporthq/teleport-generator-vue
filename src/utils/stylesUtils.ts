import omit from 'lodash/omit'
import GeneralUtils from './generalUtils'
import { PROPS_KEY, THIS } from '../constants'

export default class StylesUtils {
  public static detectDynamicStyle(styles: any): any {
    const dynamicStyles = Object.keys(styles).reduce((obj, style) => {
      const hasDynamicProp = JSON.stringify(styles[style]).split(PROPS_KEY).length > 1
      if (hasDynamicProp) {
        obj[style] = styles[style]
      }
      return obj
    }, {})

    const staticStyles = omit(styles, Object.keys(dynamicStyles))
    return { dynamicStyles, staticStyles }
  }

  public static generateDynamicStylesData(dynamicStyles: any): string {
    return Object.keys(dynamicStyles)
      .map((style) => {
        const styleValue = dynamicStyles[style]

        const dynamicStyle = Object.keys(styleValue)
          .map((styleKey) => {
            const hasProp = styleValue[styleKey].indexOf(PROPS_KEY) >= 0
            return hasProp
              ? `${styleKey}: ${GeneralUtils.interpolateString(styleValue[styleKey], PROPS_KEY, '', '', THIS)}`
              : `${styleKey}: ${JSON.stringify(styleValue[styleKey])}`
          })
          .toString()

        return `${style}: { ${dynamicStyle} }`
      })
      .toString()
  }

  public static isDynamicStyle(styles: any, style: any): boolean {
    if (!styles[style]) {
      return false
    }
    const stylesString = JSON.stringify(styles[style])
    return stylesString.indexOf(PROPS_KEY) >= 0
  }
}
