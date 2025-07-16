import { describe, expect, it } from 'bun:test'
import { replaceAccents } from 'src/replaceAccents'
import { ACCENT_MAP } from 'src/utils'

describe('utils', () => {
  describe('replaceAcccents', () => {
    it('check if mergeNmembers works as intended', () => {
      const map = [
        ['a', 'b'],
        ['c', 'd'],
      ]
      expect(mergeNmembers(map, 0)).toStrictEqual('ac')
      expect(mergeNmembers(map, 1)).toStrictEqual('bd')
    })
    it('replaces all accented letters to nonaccented', () => {
      const allAsciiAccents = mergeNmembers(ACCENT_MAP, 0)
      const allCombinedAccents = mergeNmembers(ACCENT_MAP, 1)
      expect(replaceAccents(allAsciiAccents)).not.toStrictEqual(allAsciiAccents)
      expect(replaceAccents(allAsciiAccents)).toStrictEqual(allCombinedAccents)
    })
  })
})

function mergeNmembers(arr: string[][], id: number) {
  return arr.map((a) => a[id]).join('')
}
