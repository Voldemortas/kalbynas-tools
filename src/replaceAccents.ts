import { ACCENT_MAP } from './utils'

export function replaceAccents(text: string) {
  return ACCENT_MAP.reduce(
    (acc, [toReplace, replaceBy]) => acc.replaceAll(toReplace, replaceBy),
    text
  )
}
