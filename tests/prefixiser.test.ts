import { describe, expect, it } from 'bun:test'
import { Prefix } from 'src/prefixiser'
import { performExecAndStripUndefined } from './utls.test'

describe('prefixiser', () => {
  describe('Prefix.getRegex()', () => {
    it('gets single prefix regex', () => {
      const per = new Prefix('per').getRegex()
      expect(performExecAndStripUndefined(per, 'perdėti')).toStrictEqual({
        per_per: 'per',
      })
      expect(performExecAndStripUndefined(per, 'įdėti')).toStrictEqual({})
    })
    it('gets prefix for different allomorphs', () => {
      const i = new Prefix('į', 'in', 'im').getRegex()
      expect(performExecAndStripUndefined(i, 'įdėti')).toStrictEqual({ į_į: 'į' })
      expect(performExecAndStripUndefined(i, 'indėlis')).toStrictEqual({
        į_in: 'in',
      })
      expect(performExecAndStripUndefined(i, 'impilas')).toStrictEqual({
        į_im: 'im',
      })
      expect(performExecAndStripUndefined(i, 'perdėti')).toStrictEqual({})
    })
    it('gets prefix for long nested allomorphs', () => {
      const uz = new Prefix('už', 'užu', 'užuo', 'ūž').getRegex()
      expect(performExecAndStripUndefined(uz, 'uždėt')).toStrictEqual({
        už_už: 'už',
      })
      expect(performExecAndStripUndefined(uz, 'užutėkis')).toStrictEqual({
        už_už: 'užu',
        už_užu: 'u',
      })
      expect(performExecAndStripUndefined(uz, 'užuolaida')).toStrictEqual({
        už_už: 'užuo',
        už_užu: 'uo',
        už_užuo: 'o',
      })
      expect(performExecAndStripUndefined(uz, 'nedėti')).toStrictEqual({})
      const neuz = new RegExp(`(ne)${uz.source}`)
      expect(performExecAndStripUndefined(neuz, 'neūžauga')).toStrictEqual({
        už_ūž: 'ūž',
      })
    })
    it('gets prefix for short nested allomorphs', () => {
      const at = new Prefix('at', 'ato', 'ata', 'ati').getRegex()
      expect(performExecAndStripUndefined(at, 'atrinkti')).toStrictEqual({
        at_at: 'at',
      })
      expect(performExecAndStripUndefined(at, 'atidėti')).toStrictEqual({
        at_at: 'ati',
        at_ati: 'i',
      })
      expect(performExecAndStripUndefined(at, 'atolydis')).toStrictEqual({
        at_at: 'ato',
        at_ato: 'o',
      })
      expect(performExecAndStripUndefined(at, 'atatranka')).toStrictEqual({
        at_at: 'ata',
        at_ata: 'a',
      })
      expect(performExecAndStripUndefined(at, 'įdėti')).toStrictEqual({})
    })
  })
})
