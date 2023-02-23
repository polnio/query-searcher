# query-searcher

## Description

query-searcher let you search and filter in your JavaScript's objects. It can be an array of mails, db results, or whatever you want.

## Installing

```sh
# with npm
npm install --save query-searcher

# with yarn
yarn add query-searcher

# with pnpm
pnpm add query-searcher
```

## Documentation

The searcher ignores accents and case, so "Something" and "sôMething" return the same result

You can use logic doors like AND, OR, XOR, and NOT.

You can use parenthesis too, in order to manage priorities

You can use simple-quotes and double-quotes to search spaces or logics doors as a text. You can also escape spaces with anti-slashes.

## Examples

```ts
import Searcher from 'query-searcher'

const objectsToFilter = [
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

const searcher = new Searcher()
searcher.run('Something', mails) // second and third items
searcher.run('from:Someone', mails) // first and third items
searcher.run('to:(Someone OR Another)', mails) // first item

```
