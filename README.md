# kalbynas-tools

## Instalation

To install this library:

```bash
bun install https://github.com/Voldemortas/kalbynas-tools
```

## Documentation

### Accent Replacement

#### `replaceAccents(string)`

Other functions are working with accents being [combining characters](https://en.wikipedia.org/wiki/Combining_character), however, there also exist accented letters on their own.
This function replaces them all into simple letter + combining character.

```typescript
replaceAccents(text: string): string
const accented = 'lãbas'//l U+00E3 bas
const combined = 'lãbas'//la U+0303 bas
accented === combined//false
replaceAccents(accented) === combined//true
```

### Accentuation

Accentuation provides 3 functions, all of which uses external calls to [kirčiuoklis](https://kalbu.vdu.lt/mokymosi-priemones/kirciuoklis/).

#### `accentuateWord(string)`

Accepts a word and returns the accented word with all possibilities (different meanings or several possible accentuations for the same word).

```typescript
accentuateWord(word: string): Promise<{ accented: string[]; information: { mi?: string }[] }>
await accentuateWord('kėdė')
/*
{
  accented: ["kėdė̃"],
  information: [{mi: "dkt., mot. g., vns. vard."}]
}
*/
await accentuateWord('kėdės')
/*
[
  {
    accented: ["kė̃dės"],
    information: [
      {mi: "dkt., mot. g., dgs. šauksm."},
      {mi: "dkt., mot. g., dgs. vard."}
    ]
  },
  {
    accented: ["kėdė̃s"],
    information: [{mi: "dkt., mot. g., vns. kilm."}]
  }
]
*/
await accentuateWord('abipusis')
/*
  [{
    accented: ["abipùsis", "abìpusis"],
    information: [{mi: "bdv., vyr. g., vns. vard."}]
  }]
*/
```

#### `accentuateSentence(string)`

```typescript
accentuateSentence(sentence: string): Promise<{
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
  }[]>
await accentuateSentence('labas rytas')
/*
[
  {
    string: "labas",
    accented: "lãbas",
    accentType: "MULTIPLE_MEANING",
    type: "WORD"
  },
  {
    string: " ",
    type: "SEPARATOR"
  },
  {
    string: "rytas",
    accented: "rýtas",
    accentType: "ONE",
    type: "WORD"
  }
]
*/
```

#### `accentuate(string)`

Accepts any string (one word or a sentence/phrase) and outputs accentuated version of it

```typescript
accentuate(wordOrSentence: string): Promise<string>
await accentuate('abipusis') // 'abipùsis'
await accentuate('labas rytas') // lãbas rýtas
```

---

This project was created using `bun init` in bun v1.2.17. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

---

© Andrius Simanaitis, 2025
