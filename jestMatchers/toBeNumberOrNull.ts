import { expect } from '@jest/globals'
import type { MatcherFunction } from 'expect'

const toBeNumberOrNull: MatcherFunction<[received: unknown]> =
  function (received) {
    return received === null || typeof received === 'number'
      ? {
          message: () => `expected ${JSON.stringify(received)} to be number or null`,
          pass: true
        }
      : {
          message: () => `expected ${received === undefined ? '*undefined' : 'obj'} to be number or null`,
          pass: false
        }
  }

expect.extend({
  toBeNumberOrNull
})

declare module 'expect' {
  interface AsymmetricMatchers {
    toBeNumberOrNull: () => void
  }
  interface Matchers<R> {
    toBeNumberOrNull: (received: unknown) => R
  }
}
