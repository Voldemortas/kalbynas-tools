import { describe, expect, it } from 'bun:test'
import { PREFIXES_REGEX } from 'src/utils'

describe('utils', () => {
  describe('performExecAndStripUndefined()', () => {
    it('performs exec and strips undefined from groups', () => {
      expect(performExecAndStripUndefined(/a/, 'b')).toStrictEqual({})
      expect(performExecAndStripUndefined(/a/, 'a')).toStrictEqual({})
      expect(performExecAndStripUndefined(/(?<a>a)/, 'a')).toStrictEqual({ a: 'a' })
      expect(performExecAndStripUndefined(/(?<mazda>A)/i, 'a')).toStrictEqual({ mazda: 'a' })
    })
  })
  describe('PREFIXES_REGEX', () => {
    it('parses simple prefix', () => {
      expect(performExecAndStripUndefined(PREFIXES_REGEX, 'nežinau')).toStrictEqual({
        prefix_0: 'ne',
        ne_ne: 'ne'
      })
      expect(performExecAndStripUndefined(PREFIXES_REGEX, 'tedaro')).toStrictEqual({
        prefix_0: 'te',
        te_te: 'te'
      })
    })
    it('parses several prefixes', () => {
      expect(performExecAndStripUndefined(PREFIXES_REGEX, 'nebedaro')).toStrictEqual({
        prefix_0: 'ne',
        ne_ne: 'ne',
        prefix_1: 'be',
        be_be: 'be',
      })
      expect(performExecAndStripUndefined(PREFIXES_REGEX, 'nebesidaro')).toStrictEqual({
        prefix_0: 'ne',
        ne_ne: 'ne',
        prefix_1: 'be',
        be_be: 'be',
        prefix_3: 'si',
        si_si: 'si',
      })
    })
    it('parses several prefixes in a strict order', () => {
      expect(performExecAndStripUndefined(PREFIXES_REGEX, 'tenebedaro')).toStrictEqual({
        prefix_0: 'te',
        te_te: 'te',
      })
      expect(performExecAndStripUndefined(PREFIXES_REGEX, 'nebesisiuva')).toStrictEqual({
        prefix_0: 'ne',
        ne_ne: 'ne',
        prefix_1: 'be',
        be_be: 'be',
        prefix_3: 'si',
        si_si: 'si',
      })
      expect(performExecAndStripUndefined(PREFIXES_REGEX, 'paperdžia')).toStrictEqual({
        prefix_2: 'pa',
        pa_pa: 'pa',
      })
    })
  })
})

export function performExecAndStripUndefined(regex: RegExp, text: string) {
  return Object.entries(regex.exec(text)?.groups ?? {}).reduce(
    (acc, [key, value]) => (!!value ? { ...acc, [key]: value } : acc),
    {}
  )
}
