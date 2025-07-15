const WORD_ACCENT = 'word_accent'
const TEXT_ACCENT = 'text_accents'
const URL = 'https://kalbu.vdu.lt/ajax-call'
const HEADERS = {
  'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
}
const METHOD = 'POST'

export async function accentuateWord(word: string): Promise<AccentInfo[]> {
  const ajaxCall = await fetch(URL, {
    headers: HEADERS,
    body: `action=${WORD_ACCENT}&word=${word}`,
    method: METHOD,
  })

  const jsonResponse = (await ajaxCall.json()) as AjaxResponse
  return (JSON.parse(jsonResponse.message) as WordResponse).accentInfo
}

export async function accentuateSentence(word: string): Promise<TextParts[]> {
  const ajaxCall = await fetch(URL, {
    headers: HEADERS,
    body: `action=${TEXT_ACCENT}&body=${word}`,
    method: METHOD,
  })

  const jsonResponse = (await ajaxCall.json()) as AjaxResponse
  return (JSON.parse(jsonResponse.message) as SentenceResponse).textParts
}

export default async function accentuate(wordOrSentence: string): Promise<string> {
  if (wordOrSentence.split(' ').length === 1) {
    return (await accentuateWord(wordOrSentence))[0]!.accented[0] as string
  }
  return (await accentuateSentence(wordOrSentence))
    .map(({ accented, string }) => accented ?? string)
    .join('')
}

type AjaxResponse = {
  code: number
  message: string
}

export type TextParts =
  | {
    string: string
    accented: string
    type: 'WORD'
    accentType: 'ONE' | 'MULTIPLE_MEANING' | 'MULTIPLE_VARIANT'
  }
  | {
    type: 'WORD'
    string: string
    accentType: 'NONE'
    accented: never
  }
  | {
    string: string
    accented: never
    type: 'SEPARATOR'
    accentType: never
  }
  | {
    type: 'NON_LT'
    string: string
    accentType: never
    accented: never
  }

type SentenceResponse = {
  textParts: TextParts[]
}

export type AccentInfo = { accented: string[]; information: { mi?: string }[] }

type WordResponse = {
  accentInfo: AccentInfo[]
}
