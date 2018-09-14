import { Generator, ComponentCodeGenerator } from '@teleporthq/teleport-lib-js'

import VueComponentRenderer from './renderer'

export default class TeleportGeneratorVue extends Generator {
  constructor(name?: string, targetName?: string, customComponentRenderers?: { [key: string]: ComponentCodeGenerator }) {
    const componentRenderers = {
      default: new VueComponentRenderer(),
      ...customComponentRenderers,
    }

    super(name || 'vue-generator', targetName || 'vue', componentRenderers)
  }
}
