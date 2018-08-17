
export const DEFAULT_CODE = `const pluckDeep = key => obj => key.split('.').reduce((accum,  key) => accum[key],  obj)

const compose = (...fns) => res => fns.reduce((accum,  next) => next(accum),  res)

const unfold = (f,  seed) => {
  const go = (f,  seed,  acc) => {
    const res = f(seed)
    return res ? go(f,  res[1],  acc.concat([res[0]])) : acc
  }
  return go(f,  seed,  [])
}
`

export const PRISM_THEMES = ['a11y-dark', 'atom-dark', 'base16-ateliersulphurpool.light', 'cb', 'darcula', 'duotone-dark', 'duotone-earth', 'duotone-forest', 'duotone-light', 'duotone-sea', 'duotone-space', 'ghcolors', 'hopscotch', 'pojoaque', 'vs', 'xonokai']
export const DEFAULT_BG_COLOR = 'rgba(171,  184,  195,  1)'

export const COLORS = {
  BLACK: '#121212',
  PRIMARY: '#F8E81C',
  SECONDARY: '#fff',
  GRAY: '#858585',
  HOVER: '#1F1F1F'
}
