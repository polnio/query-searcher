import { expect, it } from 'vitest'
import Searcher from '../src/Searcher'

const interpreter = new Searcher()

const mails = [
  {
    id: 1,
    from: 'Someone',
    to: ['Another'],
    subject: 'test1',
    date: new Date(2013, 1, 1),
    seen: true
  },
  {
    id: 2,
    from: 'Somebody',
    to: ['Some other'],
    subject: 'Something',
    date: new Date(),
    seen: false
  },
  {
    id: 3,
    from: 'Someone other',
    to: ['Somebody'],
    subject: 'Something and Nothing',
    date: new Date(2020, 12, 24),
    seen: false
  }
]
it('should parse an empty string', async () => {
  expect(interpreter.run('', mails)).toStrictEqual(mails)
})
it('should parse a single string', async () => {
  expect(interpreter.run('Something', mails)).toStrictEqual([
    mails[1],
    mails[2]
  ])
})
it('should parse a single string with accents and case', async () => {
  expect(interpreter.run("'sôMething'", mails)).toStrictEqual([
    mails[1],
    mails[2]
  ])
})
it('should do basic filter', async () => {
  expect(interpreter.run('from:Someone', mails)).toStrictEqual([
    mails[0],
    mails[2]
  ])
})
it('should do inverted filter', async () => {
  expect(interpreter.run('not from:Someone', mails)).toStrictEqual([mails[1]])
})
it('should do filter with logic door', async () => {
  expect(
    interpreter.run('from:Someone AND subject:Something', mails)
  ).toStrictEqual([mails[2]])
})
it('should do filter with sub-logic door', async () => {
  expect(interpreter.run('to:(Someone OR Another)', mails)).toStrictEqual([
    mails[0]
  ])
})
