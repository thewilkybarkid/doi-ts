/**
 * @since 0.1.0
 */
import doiRegex from 'doi-regex'
import * as E from 'fp-ts/Eq'
import * as O from 'fp-ts/Option'
import { Refinement } from 'fp-ts/Refinement'
import { flow } from 'fp-ts/function'
import * as s from 'fp-ts/string'

import Option = O.Option

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @category model
 * @since 0.1.0
 */
export type Doi<R extends string = string> = `10.${R}/${string}` & DoiBrand

interface DoiBrand {
  readonly Doi: unique symbol
}

// -------------------------------------------------------------------------------------
// destructors
// -------------------------------------------------------------------------------------

/**
 * @example
 * import { Doi, toUrl } from 'doi-ts'
 *
 * const url = toUrl('10.1000/182' as Doi)
 *
 * assert.deepStrictEqual(url.href, 'https://doi.org/10.1000/182')
 *
 * @category destructors
 * @since 0.1.1
 */
export const toUrl: (doi: Doi) => URL = doi => {
  const url = new URL('https://doi.org')
  url.pathname = doi.replace(/\/(\.{1,2})\//g, '/$1%2F')

  return url
}

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

/**
 * @category instances
 * @since 0.1.1
 */
export const Eq: E.Eq<Doi> = E.contramap(s.toLowerCase)(s.Eq)

// -------------------------------------------------------------------------------------
// refinements
// -------------------------------------------------------------------------------------

/**
 * @category refinements
 * @since 0.1.0
 */
export const isDoi: Refinement<unknown, Doi> = (u): u is Doi =>
  typeof u === 'string' && doiRegex({ exact: true }).test(u) && !u.endsWith('/.') && !u.endsWith('/..')

/**
 * @category refinements
 * @since 0.1.2
 */
export const hasRegistrant =
  <R extends string>(...registrants: ReadonlyArray<R>): Refinement<Doi, Doi<R>> =>
  (doi): doi is Doi<R> =>
    (registrants as ReadonlyArray<string>).includes(getRegistrant(doi))

// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------

/**
 * @example
 * import { Doi, parse } from 'doi-ts'
 * import * as O from 'fp-ts/Option'
 *
 * assert.deepStrictEqual(parse('https://doi.org/10.1000/182'), O.some('10.1000/182' as Doi))
 * assert.deepStrictEqual(parse('not a DOI'), O.none)
 *
 * @since 0.1.4
 */
export const parse: (s: string) => Option<Doi> = flow(
  s.trim,
  s.replace(/^(?:https?:\/\/(?:dx\.)?doi\.org\/|doi:)?/i, ''),
  O.fromPredicate(isDoi),
)

/**
 * @example
 * import { Doi, getRegistrant } from 'doi-ts'
 *
 * const registrant = getRegistrant('10.1000/182' as Doi)
 *
 * assert.deepStrictEqual(registrant, '1000')
 *
 * @since 0.1.2
 */
export const getRegistrant = <R extends string = string>(doi: Doi<R>): R =>
  doi.split('/', 1)[0].slice(3) as unknown as R
