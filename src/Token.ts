export default abstract class Token {
  constructor (public value: string) {}
}
export abstract class LogicalToken extends Token {}

export class StringToken extends Token {}

export class OpenParenToken extends Token {
  constructor () {
    super('(')
  }
}
export class CloseParenToken extends Token {
  constructor () {
    super(')')
  }
}

export class TwoPointsToken extends Token {
  constructor () {
    super(':')
  }
}
export class LogicalAndToken extends LogicalToken {
  constructor () {
    super('AND')
  }
}
export class LogicalOrToken extends LogicalToken {
  constructor () {
    super('OR')
  }
}
export class LogicalXorToken extends LogicalToken {
  constructor () {
    super('XOR')
  }
}
export class LogicalNotToken extends Token {
  constructor () {
    super('NOT')
  }
}

export class EndToken extends Token {
  constructor () {
    super('\0')
  }
}
