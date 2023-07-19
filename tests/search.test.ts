import { expect, it } from 'vitest'
import search from '../src/search'

const mails = [
  {
    id: 1,
    from: 'Someone',
    to: ['Another'],
    subject: 'test1',
    date: new Date(2013, 1, 1),
    seen: true,
  },
  {
    id: 2,
    from: 'Somebody',
    to: ['Some other'],
    subject: 'Something',
    date: new Date(),
    seen: false,
  },
  {
    id: 3,
    from: 'Someone other',
    to: ['Somebody'],
    subject: 'Something and Nothing',
    date: new Date(2020, 12, 24),
    seen: false,
  },
]
it('should parse an empty string', async () => {
  expect(search('', mails)).toStrictEqual(mails)
})
it('should parse a single string', async () => {
  expect(search('Something', mails)).toStrictEqual([mails[1], mails[2]])
})
it('should parse a single string with accents and case', async () => {
  expect(search("'sôMething'", mails)).toStrictEqual([mails[1], mails[2]])
})
it('should do basic filter', async () => {
  expect(search('from:Someone', mails)).toStrictEqual([mails[0], mails[2]])
})
it('should do inverted filter', async () => {
  expect(search('not from:Someone', mails)).toStrictEqual([mails[1]])
})
it('should do filter with logic door', async () => {
  expect(search('from:Someone AND subject:Something', mails)).toStrictEqual([
    mails[2],
  ])
})
it('should do filter with sub-logic door', async () => {
  expect(search('to:(Someone OR Another)', mails)).toStrictEqual([mails[0]])
})
