import Lexer from '../src/Lexer'
import {
  CloseParenToken,
  EndToken,
  LogicalAndToken,
  LogicalNotToken,
  LogicalOrToken,
  OpenParenToken,
  StringToken,
  TwoPointsToken
} from '../src/Token'
import { it, expect } from 'vitest'

const lexer = new Lexer()

it('should parse an empty string', async () => {
  expect(lexer.run('')).toStrictEqual([new EndToken()])
})
it('should parse a single string', async () => {
  expect(lexer.run('Something')).toStrictEqual([
    new StringToken('Something'),
    new EndToken()
  ])
})
it('should do basic filter', async () => {
  expect(lexer.run('from:Someone')).toStrictEqual([
    new StringToken('from'),
    new TwoPointsToken(),
    new StringToken('Someone'),
    new EndToken()
  ])
})
it('should do basic filter with string separator', async () => {
  expect(lexer.run('from:"Someone Or Another"')).toStrictEqual([
    new StringToken('from'),
    new TwoPointsToken(),
    new StringToken('Someone Or Another'),
    new EndToken()
  ])
})
it('should do basic filter with space escaping', async () => {
  expect(lexer.run('from:Someone\\ Or\\ Another')).toStrictEqual([
    new StringToken('from'),
    new TwoPointsToken(),
    new StringToken('Someone Or Another'),
    new EndToken()
  ])
})
it('should do inverted filter', async () => {
  expect(lexer.run('not from:Someone')).toStrictEqual([
    new LogicalNotToken(),
    new StringToken('from'),
    new TwoPointsToken(),
    new StringToken('Someone'),
    new EndToken()
  ])
})
it('should do filter with logic door', async () => {
  expect(lexer.run('from:Someone AND object:Something')).toStrictEqual([
    new StringToken('from'),
    new TwoPointsToken(),
    new StringToken('Someone'),
    new LogicalAndToken(),
    new StringToken('object'),
    new TwoPointsToken(),
    new StringToken('Something'),
    new EndToken()
  ])
})
it('should do filter with sub-logic door', async () => {
  expect(lexer.run('from:(Someone OR Another)')).toStrictEqual([
    new StringToken('from'),
    new TwoPointsToken(),
    new OpenParenToken(),
    new StringToken('Someone'),
    new LogicalOrToken(),
    new StringToken('Another'),
    new CloseParenToken(),
    new EndToken()
  ])
})
