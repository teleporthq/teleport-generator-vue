import { ComponentCodeGenerator, FileSet, Target } from '@teleporthq/teleport-lib-js'
import VueComponentCodeGenerator from '../../src/renderer'

import getFromLocal from './utils/getFromLocal'

const renderData = getFromLocal('renderer/data.json')

describe('renderer', () => {
  it('should return a renderer', () => {
    const renderer = new VueComponentCodeGenerator()
    expect(renderer).toBeInstanceOf(ComponentCodeGenerator)
  })
  
  it('should return FileSet from component render', () => {
    const renderer = new VueComponentCodeGenerator()
    const target = new Target('vue')
    const { content, dependencies, styles, props } = renderData
    const result = renderer.render('VueComponent', content, dependencies, styles, props, target)
    expect(result).toBeInstanceOf(FileSet)
  })
})
