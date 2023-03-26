import { expect, it } from 'vitest'
import { BinaryAstNode, StringAstNode, UnaryAstNode } from '../src/Ast'
import parse from '../src/parse'
import lex from '../src/lex'

it('should parse an empty string', async () => {
  const tokens = lex('')
  expect(parse(tokens)).toStrictEqual(null)
})
it('should parse a single string', async () => {
  const tokens = lex('Something')
  expect(parse(tokens)).toStrictEqual(new StringAstNode('Something'))
})
it('should do basic filter', async () => {
  const tokens = lex('from:Someone')
  expect(parse(tokens)).toStrictEqual(
    new BinaryAstNode(
      new StringAstNode('from'),
      new StringAstNode('Someone'),
      ':'
    )
  )
})
it('should do inverted filter', async () => {
  const tokens = lex('not from:Someone')
  expect(parse(tokens)).toStrictEqual(
    new UnaryAstNode(
      new BinaryAstNode(
        new StringAstNode('from'),
        new StringAstNode('Someone'),
        ':'
      ),
      'NOT'
    )
  )
})
it('should do filter with logic door', async () => {
  const tokens = lex('from:Someone AND object:Something')
  expect(parse(tokens)).toStrictEqual(
    new BinaryAstNode(
      new BinaryAstNode(
        new StringAstNode('from'),
        new StringAstNode('Someone'),
        ':'
      ),
      new BinaryAstNode(
        new StringAstNode('object'),
        new StringAstNode('Something'),
        ':'
      ),
      'AND'
    )
  )
})
it('should do filter with sub-logic door', async () => {
  const tokens = lex('from:(Someone OR Another)')
  expect(parse(tokens)).toStrictEqual(
    new BinaryAstNode(
      new StringAstNode('from'),
      new BinaryAstNode(
        new StringAstNode('Someone'),
        new StringAstNode('Another'),
        'OR'
      ),
      ':'
    )
  )
})
