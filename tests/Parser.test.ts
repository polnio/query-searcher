import { expect, it } from 'vitest'
import {
  BinaryAstNode,
  ProgramAstNode,
  StringAstNode,
  UnaryAstNode
} from '../src/Ast'
import Parser from '../src/Parser'

const parser = new Parser()

it('should parse an empty string', async () => {
  expect(parser.run('')).toStrictEqual(new ProgramAstNode([]))
})
it('should parse a single string', async () => {
  expect(parser.run('Something')).toStrictEqual(
    new ProgramAstNode([new StringAstNode('Something')])
  )
})
it('should do basic filter', async () => {
  expect(parser.run('from:Someone')).toStrictEqual(
    new ProgramAstNode([
      new BinaryAstNode(
        new StringAstNode('from'),
        new StringAstNode('Someone'),
        ':'
      )
    ])
  )
})
it('should do inverted filter', async () => {
  expect(parser.run('not from:Someone')).toStrictEqual(
    new ProgramAstNode([
      new UnaryAstNode(
        new BinaryAstNode(
          new StringAstNode('from'),
          new StringAstNode('Someone'),
          ':'
        ),
        'NOT'
      )
    ])
  )
})
it('should do filter with logic door', async () => {
  expect(parser.run('from:Someone AND object:Something')).toStrictEqual(
    new ProgramAstNode([
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
    ])
  )
})
it('should do filter with sub-logic door', async () => {
  expect(parser.run('from:(Someone OR Another)')).toStrictEqual(
    new ProgramAstNode([
      new BinaryAstNode(
        new StringAstNode('from'),
        new BinaryAstNode(
          new StringAstNode('Someone'),
          new StringAstNode('Another'),
          'OR'
        ),
        ':'
      )
    ])
  )
})
