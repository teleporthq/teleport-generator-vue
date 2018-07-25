export default function packageRenderer(project: any): any {
  return {
    author: project.userSlug || 'Unknown',
    dependencies: {
      nuxt: '^1.4.0',
      vue: '^2.5.13',
    },
    description: project.description || '',
    license: 'ISC',
    name: project.slug,
    scripts: {
      build: 'nuxt build',
      dev: 'nuxt',
      start: 'nuxt start',
    },
    version: project.version || '0.0.1',
  }
}
