import { StylesUtils } from '../../src/utils'
import { PROPS_KEY } from '../../src/constants'
import getFromLocal from './utils/getFromLocal'

const stylesData = getFromLocal('stylesData/data.json')

describe('Styles Utils', () => {
  it('should not detect dynamic style', () => {
    const { withoutDynamic } = stylesData
    const stylesSize = Object.keys(withoutDynamic).length

    const { dynamicStyles, staticStyles } = StylesUtils.detectDynamicStyle(withoutDynamic)
    expect(Object.keys(dynamicStyles).length).toBe(0)
    expect(Object.keys(staticStyles).length).toBe(stylesSize)
  })

  it('should detect dynamic style only', () => {
    const { dynamicOnly } = stylesData
    const stylesSize = Object.keys(dynamicOnly).length

    const { dynamicStyles, staticStyles } = StylesUtils.detectDynamicStyle(dynamicOnly)
    expect(Object.keys(dynamicStyles).length).toBe(stylesSize)
    expect(Object.keys(staticStyles).length).toBe(0)
  })

  it('should detect dynamic and static style', () => {
    const { withDynamic } = stylesData
    const stylesSize = Object.keys(withDynamic).length

    const { dynamicStyles, staticStyles } = StylesUtils.detectDynamicStyle(withDynamic)
    expect(Object.keys(dynamicStyles).length).toBe(stylesSize - 1)
    expect(Object.keys(staticStyles).length).toBe(stylesSize)
  })

  it('should not find class <x> in styles', () => {
    const { dynamicStyle, staticStyle } = StylesUtils.computeStyleType({}, 'InexistingClass')
    expect(dynamicStyle).toBe(false)
    expect(staticStyle).toBe(false)
  })

  it('should find dynamic style type only in <x> style', () => {
    const { dynamicOnly } = stylesData
    const { dynamicStyle, staticStyle } = StylesUtils.computeStyleType(dynamicOnly, 'test')
    expect(dynamicStyle).toBe(true)
    expect(staticStyle).toBe(false)
  })

  it('should compute static style type only in <x> style', () => {
    const { withoutDynamic } = stylesData
    const { dynamicStyle, staticStyle } = StylesUtils.computeStyleType(withoutDynamic, 'test')
    expect(dynamicStyle).toBe(false)
    expect(staticStyle).toBe(true)
  })

  it('should compute both dynamic and static type in <x> style', () => {
    const { withDynamic } = stylesData
    const { dynamicStyle, staticStyle } = StylesUtils.computeStyleType(withDynamic, 'test')
    expect(dynamicStyle).toBe(true)
    expect(staticStyle).toBe(true)
  })

  it('should generate dynamic style data', () => {
    const { dynamicOnly } = stylesData
    const styleString = StylesUtils.generateDynamicStylesData(dynamicOnly)
    expect(typeof styleString).toBe("string")

    const indexOfProp = styleString.indexOf(PROPS_KEY)
    expect(indexOfProp).toBe(-1)

    Object.keys(dynamicOnly).forEach((key) => {
      const indexOfKey = styleString.indexOf(key)
      expect(indexOfKey).toBeGreaterThan(-1)
    })
  })
})