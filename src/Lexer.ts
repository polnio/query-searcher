import type Token from './Token'
import {
  CloseParenToken,
  EndToken,
  LogicalAndToken,
  LogicalNotToken,
  LogicalOrToken,
  LogicalXorToken,
  OpenParenToken,
  StringToken,
  TwoPointsToken
} from './Token'

const logicalKeywords = {
  AND: () => new LogicalAndToken(),
  OR: () => new LogicalOrToken(),
  XOR: () => new LogicalXorToken(),
  NOT: () => new LogicalNotToken()
}

const stringSeparators = ["'", '"']

class Lexer {
  private isAlphaNumeric (str: string): boolean {
    return /^[a-zA-Z0-9]+$/.test(str)
  }

  public run (query: string): Token[] {
    const tokens = new Array<Token>()
    for (let i = 0; i < query.length; i++) {
      switch (true) {
        case query[i] === '(':
          tokens.push(new OpenParenToken())
          break
        case query[i] === ')':
          tokens.push(new CloseParenToken())
          break
        case query[i] === ':':
          tokens.push(new TwoPointsToken())
          break
        case stringSeparators.includes(query[i]): {
          const start = i
          while (i < query.length && query[i + 1] !== query[start]) {
            i++
          }
          // console.log(query.substring(start + 1, i + 1));
          tokens.push(new StringToken(query.substring(start + 1, i + 1)))
          i++
          break
        }
        case this.isAlphaNumeric(query[i]): {
          const start = i
          while (i < query.length && this.isAlphaNumeric(query[i + 1])) {
            i++
            if (query[i + 1] === '\\' && query[i + 2] === ' ') {
              i += 2
            }
          }
          const word = query.substring(start, i + 1).replace(/\\ /g, ' ')
          if (Object.keys(logicalKeywords).includes(word.toUpperCase())) {
            tokens.push(
              logicalKeywords[
                word.toUpperCase() as keyof typeof logicalKeywords
              ]()
            )
            break
          }
          tokens.push(new StringToken(word))
          break
        }
      }
    }
    tokens.push(new EndToken())
    return tokens
  }
}

export default Lexer
