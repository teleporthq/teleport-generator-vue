import { INTERPOLATE_START, INTERPOLATE_END } from '../constants'

export default class GeneralUtils {
  public static interpolateString(
    content: string,
    replace?: string,
    interpolateStart = INTERPOLATE_START,
    interpolateEnd = INTERPOLATE_END,
    replaceWith = ''
  ): string {
    return replace ? `${interpolateStart}${content.replace(replace, replaceWith)}${interpolateEnd}` : `${interpolateStart}${content}${interpolateEnd}`
  }

  public static containsSpecialCharacters(stringToCheck: string): boolean {
    const format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/
    return format.test(stringToCheck)
  }
}
