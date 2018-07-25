import { Generator, FileSet } from '@teleporthq/teleport-lib-js'
import VueComponentGenerator from './generators/component'
import VueProjectGenerator from './generators/project'

export default class TeleportGeneratorVue extends Generator {
  // @todo: can we avoid redeclaring componentGenerator and projectGenerator since they exist on Generator?
  public componentGenerator: VueComponentGenerator
  public projectGenerator: VueProjectGenerator

  constructor() {
    super('vue-generator', 'vue')

    this.componentGenerator = new VueComponentGenerator(this)
    this.projectGenerator = new VueProjectGenerator(this, this.componentGenerator)
  }

  public generateComponent<T, U>(component: T, options: U): FileSet {
    return this.componentGenerator.generate(component, options)
  }

  public generateProject(component: any, options: any): FileSet {
    return this.projectGenerator.generate(component, options)
  }
}
