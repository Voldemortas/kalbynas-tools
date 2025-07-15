declare function accentuate(wordOrSentence: string): Promise<string>
declare function accentuateWord(singleWord: string): Promise<AccentInfo>
declare function accentuateSentence(sentence: string): Promise<TextParts[]>

declare type AccentInfo = { accented: string[]; information: { mi?: string }[] }
declare type TextParts =
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
