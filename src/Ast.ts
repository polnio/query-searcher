// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default abstract class AstNode {}
export class StringAstNode extends AstNode {
  public constructor(public value: string) {
    super()
  }
}
export class UnaryAstNode extends AstNode {
  public constructor(
    public right: AstNode,
    public operator: string,
  ) {
    super()
  }
}
export class BinaryAstNode extends AstNode {
  public constructor(
    public left: AstNode,
    public right: AstNode,
    public operator: string,
  ) {
    super()
  }
}
