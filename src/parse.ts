import type AstNode from './Ast'
import { BinaryAstNode, StringAstNode, UnaryAstNode } from './Ast'
import type Token from './Token'
import {
  CloseParenToken,
  EndToken,
  OpenParenToken,
  StringToken
} from './Token'

/* PRIORITIES:
  - Primary
  - Two Points
  - NOT
  - AND
  - OR
*/

class Parser {
  tokens: Token[] = []
  index: number = 0
  get current (): Token {
    return this.tokens[0]
  }

  public run (tokens: Token[]): AstNode | null {
    if (tokens.length === 0 || tokens[0] instanceof EndToken) {
      return null
    }
    this.tokens = tokens
    this.index = 0
    return this.parse()
  }

  private parseBinary (values: string[], next: () => AstNode): AstNode {
    let left = next()
    while (this.current !== undefined && values.includes(this.current.value)) {
      const operator = this.eat().value
      const right = next()
      left = new BinaryAstNode(left, right, operator)
    }
    return left
  }

  private parseUnary (values: string[], next: () => AstNode): AstNode {
    if (this.current !== undefined && values.includes(this.current.value)) {
      const operator = this.eat().value
      const right = next()
      return new UnaryAstNode(right, operator)
    }
    return next()
  }

  private parse (): AstNode {
    return this.parseAnd()
  }

  private parseAnd (): AstNode {
    return this.parseBinary(['AND'], this.parseOr.bind(this))
  }

  private parseOr (): AstNode {
    return this.parseBinary(['OR'], this.parseNot.bind(this))
  }

  private parseNot (): AstNode {
    return this.parseUnary(['NOT'], this.parseTwoPoints.bind(this))
  }

  private parseTwoPoints (): AstNode {
    return this.parseBinary([':'], this.parsePrimary.bind(this))
  }

  private parsePrimary (): AstNode {
    if (this.current instanceof StringToken) {
      return new StringAstNode(this.eat().value)
    }
    if (this.current instanceof OpenParenToken) {
      this.eat()
      const value = this.parse()
      const closingParen = this.eat()
      if (!(closingParen instanceof CloseParenToken)) {
        throw new Error(
          'Expected closing parentheses, but found ' +
            closingParen.value +
            ' instead.'
        )
      }
      return value
    }
    throw new Error('Unexpected token: ' + this.current.value)
  }

  private eat (): Token {
    if (this.tokens.length === 0) {
      throw new Error('')
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.tokens.shift()!
  }
}

const parser = new Parser()

export default function parse (tokens: Token[]): AstNode | null {
  return parser.run(tokens)
}
