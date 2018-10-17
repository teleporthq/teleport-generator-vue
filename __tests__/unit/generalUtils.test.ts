import { GeneralUtils } from '../../src/utils'
import { INTERPOLATE_START, INTERPOLATE_END } from '../../src/constants'

describe('General Utils', () => {
  it('should interpolate string', () => {
    const initialString = 'Test'
    const interpolateStart = 'Test'
    const interpolateEnd = 'Test'
    const result = GeneralUtils.interpolateString(initialString, null, interpolateStart, interpolateEnd)
    expect(result).toBe(`${interpolateStart}${initialString}${interpolateEnd}`)
    expect(result).toBe('TestTestTest')
  })

  it('should interpolate string (with default)', () => {
    const initialString = 'Test'
    const result = GeneralUtils.interpolateString(initialString)
    expect(result).toBe(`${INTERPOLATE_START}${initialString}${INTERPOLATE_END}`)
  })

  it('should interpolate and replace string', () => {
    const initialString = 'Test'
    const replace = 'Test'
    const replaceWith = 'vue'
    const result = GeneralUtils.interpolateString(initialString, replace, undefined, undefined, replaceWith)
    expect(result).toBe(`${INTERPOLATE_START}${replaceWith}${INTERPOLATE_END}`)
  })

  it('should detect special characters', () => {
    const stringToCheck = 'String With Special{*&^}'
    expect(GeneralUtils.containsSpecialCharacters(stringToCheck)).toBe(true)
  })

  it('should NOT detect special characters', () => {
    const stringToCheck = 'ThisStringDoesNotContainSpecialCharacters'
    expect(GeneralUtils.containsSpecialCharacters(stringToCheck)).toBe(false)
  })
})