import { notImplemented } from './utils'

export async function accentuateWord(word: string): Promise<string[]> {
  return Promise.reject([])
}

export async function accentuateSentence(sentence: string): Promise<any[]> {
  return Promise.reject([])
}

export default async function accentuate(
  wordOrSentence: string
): Promise<string> {
  throw notImplemented
}
