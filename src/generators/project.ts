import * as _ from 'lodash'
import { ProjectGenerator, Generator, RenderResult } from '../../teleport-lib-js'
import TeleportGeneratorReact from '../index'
import packageRenderer from '../renderers/package'
import ReactComponentGenerator from './component'

export default class ReactProjectGenerator extends ProjectGenerator {
  public generator: TeleportGeneratorReact
  public componentGenerator: ReactComponentGenerator

  constructor(generator: TeleportGeneratorReact, componentGenerator: ReactComponentGenerator) {
    super(generator as Generator)
    this.componentGenerator = componentGenerator
  }

  // tslint:disable-next-line:no-shadowed-variable
  public generate(project: any, options: any = {}): RenderResult {
    const { name, components, pages } = project

    const result = new RenderResult()
    result.addFile(
      'package.json',
      packageRenderer(project)
    )

    if (components) {
      Object.keys(components).map(componentName => {
        const component = components[componentName]
        const componentResults = this.componentGenerator.generate(component)
        componentResults.getFileNames().map(fileName => {
          result.addFile(
            `components/${fileName}`,
            componentResults.getContent(fileName)
          )
        })
      })
    }

    if (pages) {
      Object.keys(pages).map(pageName => {
        const page = pages[pageName]
        const pageResults = this.componentGenerator.generate(page)
        pageResults.getFileNames().map(fileName => {
          result.addFile(
            `pages/${fileName}`,
            pageResults.getContent(fileName)
          )
        })
      })
    }

    return result
  }
}
