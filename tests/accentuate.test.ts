import { describe, it, spyOn, mock, expect, beforeEach } from 'bun:test'
import accentuate, { accentuateSentence, accentuateWord } from 'src/accentuate'

const WORD_ACCENT = 'word_accent'
const TEXT_ACCENT = 'text_accents'
const URL = 'https://kalbu.vdu.lt/ajax-call'
const HEADERS = { 'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8' }
const METHOD = 'POST'

const LONG_TEXT = 'nemaniau, kad ateisi abipusiu wiedru kamu'
const LONG_TEXT_RESPONSE = 'nemaniaũ, kàd ateĩsi abipusiù wiedru kamu'
const LONG_JSON_RESPONSE = { "code": 200, "message": "{\"textParts\":[{\"string\":\"nemaniau\",\"accented\":\"nemaniau\u0303\",\"accentType\":\"ONE\",\"type\":\"WORD\"},{\"string\":\", \",\"type\":\"SEPARATOR\"},{\"string\":\"kad\",\"accented\":\"ka\u0300d\",\"accentType\":\"ONE\",\"type\":\"WORD\"},{\"string\":\" \",\"type\":\"SEPARATOR\"},{\"string\":\"ateisi\",\"accented\":\"atei\u0303si\",\"accentType\":\"ONE\",\"type\":\"WORD\"},{\"string\":\" \",\"type\":\"SEPARATOR\"},{\"string\":\"abipusiu\",\"accented\":\"abipusiu\u0300\",\"accentType\":\"MULTIPLE_VARIANT\",\"type\":\"WORD\"},{\"string\":\" \",\"type\":\"SEPARATOR\"},{\"string\":\"wiedru\",\"type\":\"NON_LT\"},{\"string\":\" \",\"type\":\"SEPARATOR\"},{\"string\":\"kamu\",\"accentType\":\"NONE\",\"type\":\"WORD\"}]}" }
const SINGLE_WORD = 'abipusiu'
const SINGLE_WORD_RESPONSE = ['abipusiù', 'abìpusiu']
const SINGLE_JSON_RESPONSE = { "code": 200, "message": "{\"accentInfo\":[{\"accented\":[\"abipusiu\u0300\",\"abi\u0300pusiu\"],\"information\":[{\"mi\":\"bdv., vyr. g., vns. \u012fnag.\"}]}]}" }

describe('accentuation', () => {
  beforeEach(() => {
    mock.restore()
  })

  describe('accentuateWord', () => {
    it('accentuates the single word', async () => {
      const fetchMock = mockFetch(SINGLE_JSON_RESPONSE)
      const singleReponse = await accentuateWord(SINGLE_WORD)
      expect(singleReponse[0]!.accented).toMatchObject(SINGLE_WORD_RESPONSE)
      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(fetchMock).toHaveBeenCalledWith(URL, {
        headers: HEADERS,
        body: `action=${WORD_ACCENT}&word=${SINGLE_WORD}`,
        method: METHOD,
      })
    })
  })

  describe('accentuateSentence', () => {
    it('accentuates the long text', async () => {
      const fetchMock = mockFetch(LONG_JSON_RESPONSE)
      const longResponse = await accentuateSentence(LONG_TEXT)
      expect(longResponse).toMatchObject(JSON.parse(LONG_JSON_RESPONSE.message).textParts)
      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(fetchMock).toHaveBeenCalledWith(URL, {
        headers: HEADERS,
        body: `action=${TEXT_ACCENT}&body=${LONG_TEXT}`,
        method: METHOD,
      })
    })
  })

  describe('accentuate', () => {
    it('accentuates the long text', async () => {
      mock.module('src/accentuate', () => ({
        default: accentuate,
        accentuateSentence: mock().mockResolvedValue(JSON.parse(LONG_JSON_RESPONSE.message).textParts)
      }))
      const longResponse = await accentuate(LONG_TEXT)
      expect(longResponse).toStrictEqual(LONG_TEXT_RESPONSE)
    })

    it('accentuates the single word', async () => {
      mock.module('src/accentuate', () => ({
        default: accentuate,
        accentuateWord: mock().mockResolvedValue(JSON.parse(SINGLE_JSON_RESPONSE.message).accentInfo)
      }))
      const wordResponse = await accentuate(SINGLE_WORD)
      expect(wordResponse).toStrictEqual(SINGLE_WORD_RESPONSE[0]!)
    })
  })

  describe.if(areExternalCallsEnabled())('real calls', () => {
    it('long text', async () => {
      const res = await accentuate(LONG_TEXT)
      expect(res).toStrictEqual(LONG_TEXT_RESPONSE)
    })
    it('short text', async () => {
      const res = await accentuate(SINGLE_WORD)
      expect(res).toStrictEqual(SINGLE_WORD_RESPONSE[0]!)
    })
  })
})

function mockFetch(data: any) {
  const fetchMock = mock().mockImplementation(() => Promise.resolve({ json: () => Promise.resolve(data) })) as unknown as typeof fetch
  spyOn(global, "fetch").mockImplementation(fetchMock)
  return fetchMock
}

function areExternalCallsEnabled() {
  return !!Bun.env.EXTERNAL_CALLS || Bun.env.EXTERNAL_CALLS === 'true'
}