export default function template(name: string, childrenTags?: string, styles?: string[], props?: any): string {
  let stylesString = ''
  if (styles) {
    if (Array.isArray(styles) && styles.length > 0) {
      stylesString = `class="${styles.join(' ')}"`
    } else {
      stylesString = `class="${styles}"`
    }
  }

  const propsArray = []
  if (props) {
    Object.keys(props).map(propName => {
      const propValue = props[propName]
      propsArray.push(`${propName}="${propValue}"`)
    })
  }
  const propsString = (propsArray.length ? ' ' + propsArray.join(' ') : '')

  if (childrenTags && childrenTags.length > 0) {
    return `
      <${name} ${stylesString} ${propsString}>
        ${childrenTags}
      </${name}>
    `
  } else {
    return `<${name} ${stylesString} ${propsString}/>`
  }
}
