import type AstNode from './Ast'
import {
  BinaryAstNode,
  ProgramAstNode,
  StringAstNode,
  UnaryAstNode
} from './Ast'
import Parser from './Parser'

function slugify (str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, '-')
}

const parser = new Parser()

export default class Interpreter {
  public run<T extends Record<string, unknown>>(
    query: string,
    input: T[]
  ): T[] {
    const tree = parser.run(query)
    if (query === '') return input
    return this.filter(tree, input)
  }

  private checkStringAstNode<T extends Record<string, unknown>>(
    element: unknown,
    astNode: StringAstNode,
    input: T[],
    keys: string[]
  ): boolean {
    switch (typeof element) {
      case 'undefined':
        return false

      case 'boolean':
        return (
          ['true', 'false'].includes(astNode.value) &&
          element === (astNode.value === 'true')
        )

      case 'string':
        return slugify(element).includes(slugify(astNode.value))

      case 'object':
        if (element instanceof Array) {
          // console.log(element);
          return element.some((_el) =>
            this.checkStringAstNode(_el, astNode, input, keys)
          )
        }
        return false

      default:
        return false
    }
  }

  private filter<T extends Record<string, unknown>>(
    astNode: AstNode,
    input: T[],
    keys?: string[]
  ): T[] {
    // console.log(astNode.constructor.name, JSON.stringify(astNode), keys);
    if (astNode instanceof ProgramAstNode) {
      return this.filter(astNode.body[0], input, keys)
    }
    if (astNode instanceof StringAstNode) {
      if (keys === undefined) {
        return this.filter(
          astNode,
          input,
          Array.from(new Set(input.map((o) => Object.keys(o)).flat()))
        )
      }
      return input.filter((item) =>
        keys.some((key) => {
          const element = item[key]
          return this.checkStringAstNode(element, astNode, input, keys)
        })
      )
    }
    if (astNode instanceof BinaryAstNode) {
      switch (astNode.operator) {
        case ':': {
          if (!(astNode.left instanceof StringAstNode)) {
            throw new Error(
              'Expected string expression, got ' + astNode.left.constructor.name
            )
          }
          return this.filter(astNode.right, input, [astNode.left.value])
        }
        case 'AND': {
          return this.filter(astNode.left, input, keys).filter((element) =>
            this.filter(astNode.right, input, keys).includes(element)
          )
        }
        case 'OR': {
          return [
            ...this.filter(astNode.left, input, keys),
            ...this.filter(astNode.right, input, keys)
          ]
        }
      }
    }
    if (astNode instanceof UnaryAstNode) {
      switch (astNode.operator) {
        case 'NOT': {
          const filtered = this.filter(astNode.right, input, keys)
          return input.filter((element) => !filtered.includes(element))
        }
      }
    }
    return []
  }
}
