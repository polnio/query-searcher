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
  TwoPointsToken,
} from './Token'

const logicalKeywords = {
  AND: () => new LogicalAndToken(),
  OR: () => new LogicalOrToken(),
  XOR: () => new LogicalXorToken(),
  NOT: () => new LogicalNotToken(),
}

const stringSeparators = ["'", '"']

function isAlphaNumeric(str: string): boolean {
  return /^[a-zA-Z0-9]+$/.test(str)
}

export default function lex(query: string): Token[] {
  const tokens = new Array<Token>()
  const queryChars = query.split('')
  while (queryChars.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const char = queryChars.shift()!
    if (char === '(') {
      tokens.push(new OpenParenToken())
    } else if (char === ')') {
      tokens.push(new CloseParenToken())
    } else if (char === ':') {
      tokens.push(new TwoPointsToken())
    } else if (stringSeparators.includes(char)) {
      let string = ''
      while (queryChars.length > 0 && queryChars[0] !== char) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        string += queryChars.shift()!
      }
      queryChars.shift()
      tokens.push(new StringToken(string))
    } else if (isAlphaNumeric(char)) {
      let string = char
      while (queryChars.length > 0 && isAlphaNumeric(queryChars[0])) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        string += queryChars.shift()!
        if (queryChars[0] === '\\' && queryChars[1] === ' ') {
          queryChars.shift()
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          string += queryChars.shift()!
        }
      }
      // console.log(string)
      if (Object.keys(logicalKeywords).includes(string.toUpperCase())) {
        tokens.push(
          logicalKeywords[
            string.toUpperCase() as keyof typeof logicalKeywords
          ](),
        )
      } else {
        tokens.push(new StringToken(string))
      }
    }
  }
  tokens.push(new EndToken())
  return tokens
}
