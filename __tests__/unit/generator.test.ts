import { Generator } from '@teleporthq/teleport-lib-js'
import TeleportGeneratorVue from '../../src'

describe('TeleportGeneratorVue', () => {
  it('should return a generator', () => {
    const generator = new TeleportGeneratorVue()
    expect(generator).toBeInstanceOf(Generator)
  })
})