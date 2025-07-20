import { Prefix } from './prefixiser'

const CASE_INSENSITIVE_UNICODE = 'iv'

export const notImplemented = new Error('Not Implemented!')

export const ACCENT_MAP = [
  ['Ã', 'Ã'],
  ['ã', 'ã'],
  ['ĩ', 'ĩ'],
  ['Ĩ', 'Ĩ'],
  ['ñ', 'ñ'],
  ['Ñ', 'Ñ'],
  ['Õ', 'Õ'],
  ['õ', 'õ'],
  ['Ũ', 'Ũ'],
  ['ũ', 'ũ'],
  ['Á', 'Á'],
  ['á', 'á'],
  ['É', 'É'],
  ['é', 'é'],
  ['í', 'í'],
  ['Í', 'Í'],
  ['ó', 'ó'],
  ['Ó', 'Ó'],
  ['Ú', 'Ú'],
  ['ú', 'ú'],
  ['ý', 'ý'],
  ['Ý', 'Ý'],
  ['à', 'à'],
  ['À', 'À'],
  ['È', 'È'],
  ['è', 'è'],
  ['Ì', 'Ì'],
  ['ì', 'ì'],
  ['ò', 'ò'],
  ['Ò', 'Ò'],
  ['ù', 'ù'],
  ['Ù', 'Ù'],
] as [string, string][]

export const SORTED_PREFIXES = [
  [new Prefix('ne'), new Prefix('te')],
  [new Prefix('be')],
  [
    new Prefix('at', 'ati', 'ato', 'ata'),
    new Prefix('ant', 'anta'),
    new Prefix('ap', 'api', 'apy'),
    new Prefix('į', 'in', 'im'),
    new Prefix('iš'),
    new Prefix('nu', 'nū', 'nuo'),
    new Prefix('pa', 'po'),
    new Prefix('par'),
    new Prefix('per'),
    new Prefix('pra', 'pro'),
    new Prefix('pri', 'prie'),
    new Prefix('su', 'są', 'san', 'sam'),
    new Prefix('už', 'užu', 'užuo', 'ūž'),
  ],
  [new Prefix('si')],
]

export const PREFIXES_REGEX = new RegExp(
  `^${SORTED_PREFIXES.map(
    (list, i) =>
      `(?<prefix_${i}>${list
        .map((prefix) => prefix.getRegex().source)
        .join('|')})`
  ).join('?')}?`,
  CASE_INSENSITIVE_UNICODE
)
