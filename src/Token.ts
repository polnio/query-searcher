export default abstract class Token {
  public constructor(public value: string) {}
}
export abstract class LogicalToken extends Token {}

export class StringToken extends Token {}

export class OpenParenToken extends Token {
  public constructor() {
    super('(')
  }
}
export class CloseParenToken extends Token {
  public constructor() {
    super(')')
  }
}

export class TwoPointsToken extends Token {
  public constructor() {
    super(':')
  }
}
export class LogicalAndToken extends LogicalToken {
  public constructor() {
    super('AND')
  }
}
export class LogicalOrToken extends LogicalToken {
  public constructor() {
    super('OR')
  }
}
export class LogicalXorToken extends LogicalToken {
  public constructor() {
    super('XOR')
  }
}
export class LogicalNandToken extends LogicalToken {
  public constructor() {
    super('NAND')
  }
}
export class LogicalNorToken extends LogicalToken {
  public constructor() {
    super('NOR')
  }
}
export class LogicalXnorToken extends LogicalToken {
  public constructor() {
    super('NXOR')
  }
}
export class LogicalNotToken extends Token {
  public constructor() {
    super('NOT')
  }
}

export class EndToken extends Token {
  public constructor() {
    super('\0')
  }
}
