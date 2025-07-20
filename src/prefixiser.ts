export class Prefix {
  readonly prefix: string
  readonly allomorphs: string[]
  private _regex?: RegExp

  public constructor(prefix: string, ...allomorphs: string[]) {
    this.prefix = prefix
    this.allomorphs = allomorphs
  }

  public getRegex(): RegExp {
    if (!!this._regex) {
      return this._regex
    }
    if (this.allomorphs.length === 0) {
      this._regex = new RegExp(`(?<${this.prefix}_${this.prefix}>${this.prefix})?`)
      return this._regex
    }
    const sorted = [this.prefix, ...this.allomorphs].toSorted((a, b) => a.length - b.length)
    const struct = MyTree.FromArray(sorted)

    for (let i = 0; i < sorted.length - 1; i++) {
      const short = sorted[i]!
      for (let j = 1; j < sorted.length; j++) {
        const long = sorted[j]!
        if (short.length < long.length) {
          const groups = getGroups(long, short)
          if (!!groups) {
            struct.getChild(short)!.addChild(struct.removeChild(long)!.name)
          }
        }
      }
    }

    this._regex = new RegExp(struct.makeRegex(this.prefix))
    return this._regex
  }
}

class MyTree {
  public readonly name: string
  public children: MyTree[]

  public constructor(name: string) {
    this.name = name
    this.children = []
  }

  public addChild(name: string) {
    this.children.push(new MyTree(name))
  }

  public removeChild(name: string): MyTree | null {
    const filtered = this.children.find(x => x.name === name)
    if (!!filtered) {
      this.children = this.children.filter(x => x.name !== filtered.name)
      return filtered
    }
    return this.children.map(x => x.removeChild(name)).find(x => x?.name === name) || null;
  }

  public getChild(name: string): MyTree | null {
    const filtered = this.children.find(x => x.name === name)
    if (!!filtered) {
      return filtered
    }
    return this.children.map(x => x.getChild(name)).find(x => x?.name === name) || null;
  }

  public makeRegex(prefix: string, parents: string = ''): string {
    const groups = getGroups(this.name, parents)
    const groupName = !!this.name ? `?<${prefix}_${this.name}>` : ''
    let children = this.children.map(c => c.makeRegex(prefix, this.name)).join('|')
    if (this.children.length > 0) {
      children = `(${children})?`
    }
    if (!!groups && !!groups.b && !!groups.c) {
      return `(${groupName}${groups.c}${children})`
    }
    return `(${groupName}${this.name}${children})?`
  }

  public static FromArray(names: string[]) {
    const newStruct = new MyTree('')
    names.forEach(n => newStruct.addChild(n))
    return newStruct
  }
}

function getGroups(long: string, short: string) {
  return new RegExp(`(?<a>.*)(?<b>${short})(?<c>.*)`).exec(long)?.groups as { a: string, b: string, c: string } | undefined
}


