import doiRegex from 'doi-regex'
import * as fc from 'fast-check'
import * as _ from '../src'

export * from 'fast-check'

export const doi = (): fc.Arbitrary<_.Doi> =>
  fc
    .tuple(
      fc.stringOf(fc.constantFrom('0', '1', '2', '3', '4', '5', '6', '7', '8', '9'), { minLength: 2 }),
      fc.unicodeString({ minLength: 1 }),
    )
    .map(([prefix, suffix]) => `10.${prefix}/${suffix}` as _.Doi)
    .filter(s => doiRegex({ exact: true }).test(s))
