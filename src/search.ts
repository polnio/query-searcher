import type AstNode from './Ast'
import { BinaryAstNode, StringAstNode, UnaryAstNode } from './Ast'
import lex from './lex'
import parse from './parse'

function slugify (str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, '-')
}

type Input = Record<string, unknown>

function checkStringAstNode<T extends Input> (
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
          checkStringAstNode(_el, astNode, input, keys)
        )
      }
      return false

    default:
      return false
  }
}

function filter<T extends Record<string, unknown>> (
  astNode: AstNode,
  input: T[],
  keys?: string[]
): T[] {
  if (astNode instanceof StringAstNode) {
    if (keys === undefined) {
      return filter(
        astNode,
        input,
        Array.from(new Set(input.map((o) => Object.keys(o)).flat()))
      )
    }
    return input.filter((item) =>
      keys.some((key) => {
        const element = item[key]
        return checkStringAstNode(element, astNode, input, keys)
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
        return filter(astNode.right, input, [astNode.left.value])
      }
      case 'AND': {
        return filter(astNode.left, input, keys).filter((element) =>
          filter(astNode.right, input, keys).includes(element)
        )
      }
      case 'OR': {
        return [
          ...filter(astNode.left, input, keys),
          ...filter(astNode.right, input, keys)
        ]
      }
    }
  }
  if (astNode instanceof UnaryAstNode) {
    switch (astNode.operator) {
      case 'NOT': {
        const filtered = filter(astNode.right, input, keys)
        return input.filter((element) => !filtered.includes(element))
      }
    }
  }
  return []
}

export default function search<T extends Input> (
  query: string,
  input: T[]
): T[] {
  if (query === '') {
    return input
  }
  const tokens = lex(query)
  const tree = parse(tokens)
  if (tree === null) {
    return input
  }
  return filter(tree, input)
}
