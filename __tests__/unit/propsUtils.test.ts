import { PropsUtils } from '../../src/utils'
import { PROPS_KEY } from '../../src/constants'
import getFromLocal from './utils/getFromLocal'

const propsData = getFromLocal('propsData/data.json')

describe('props', () => {
  it('should not find props in content', () => {
    const { contentWithoutDynamic } = propsData
    const result = PropsUtils.findPropsFromContent(contentWithoutDynamic, [], {})
    expect(result).toBe('')
  })

  it('should find props in content', () => {
    const { contentWithDynamic } = propsData
    const result = PropsUtils.findPropsFromContent(contentWithDynamic, [], {})
    expect(result.length).toBeGreaterThan(0)
  })

  it('should treat missing content case', () => {
    const hasDynamic = PropsUtils.hasDynamicProp(null)
    expect(hasDynamic).toBe(false)
  })

  it('should not find dynamic prop in content', () => {
    const { contentWithoutDynamic } = propsData
    const hasDynamic = PropsUtils.hasDynamicProp(contentWithoutDynamic)
    expect(hasDynamic).toBe(false)
  })

  it('should find dynamic prop in content', () => {
    const { contentWithDynamic } = propsData
    const hasDynamic = PropsUtils.hasDynamicProp(contentWithDynamic)
    expect(hasDynamic).toBe(true)
  })

  it('should parse children elements treating missing content', () => {
    const result = PropsUtils.parseChildrenElementsForProps(null)
    expect(result).toBe('')
  })

  it('should parse children elements for string with interpolation and no props', () => {
    const content = 'Test'
    const result = PropsUtils.parseChildrenElementsForProps(content, false, false)
    expect(result).toBe(content)
  })

  it('should parse children elements for string with interpolation and with props', () => {
    const content = `${PROPS_KEY}test`
    const result = PropsUtils.parseChildrenElementsForProps(content, false, false)
    expect(result).toBe('{{test}}')
  })

  it('should parse children elements for string with no interpolation and with props', () => {
    const content = `${PROPS_KEY}test`
    const result = PropsUtils.parseChildrenElementsForProps(content, false, true)
    expect(result).toBe('test')
  })

  it('should parse children elements for simple object', () => {
    const { simpleContent } = propsData
    const result = PropsUtils.parseChildrenElementsForProps(simpleContent, false, false)
    expect(result.indexOf(PROPS_KEY)).toBe(-1)
  })

  it('should parse children elements for complex object', () => {
    const { contentWithDynamic } = propsData
    const result = PropsUtils.parseChildrenElementsForProps(contentWithDynamic, false, false)
    expect(result.indexOf(PROPS_KEY)).toBe(-1)
  })

})