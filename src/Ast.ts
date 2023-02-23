// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default abstract class AstNode {}
export class ProgramAstNode extends AstNode {
  constructor (public body: AstNode[]) {
    super()
  }
}
export class StringAstNode extends AstNode {
  constructor (public value: string) {
    super()
  }
}
export class UnaryAstNode extends AstNode {
  constructor (public right: AstNode, public operator: string) {
    super()
  }
}
export class BinaryAstNode extends AstNode {
  constructor (
    public left: AstNode,
    public right: AstNode,
    public operator: string
  ) {
    super()
  }
}
