import { Generator } from '../teleport-lib-js'
import VueComponentGenerator from './generators/component'
import VueProjectGenerator from './generators/project'

export default class TeleportGeneratorVue extends Generator {
  constructor() {
    super('vue-generator', 'vue')

    this.componentGenerator = new VueComponentGenerator(this)
    this.projectGenerator = new VueProjectGenerator(this, this.componentGenerator)
  }

  public generateComponent(component: any, options: any): string {
    return this.componentGenerator.generate(component, options)
  }

  public generateProject(component: any, options: any): string {
    return this.projectGenerator.generate(component, options)
  }
}
