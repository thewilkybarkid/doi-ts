/**
 * @since 0.1.0
 */
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
// constructors
// -------------------------------------------------------------------------------------

/**
 * @example
 * import { Doi } from 'doi-ts'
 *
 * const doi = Doi('10.1000/182')
 *
 * assert.deepStrictEqual(doi, '10.1000/182')
 *
 * @category constructors
 * @since 0.1.10
 */
export function Doi<A extends string>(doi: A): A extends `10.${infer R}/${string}` ? Doi<R> : Doi {
  if (!isDoi(doi)) {
    throw new Error('Not a DOI')
  }

  return doi as unknown as A extends `10.${infer R}/${string}` ? Doi<R> : Doi
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
  url.pathname = doi
    .replace(/%/g, '%25')
    .replace(/\/(\.{1,2})\//g, '/$1%2F')
    .replace(/\\/g, '%5C')

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
  typeof u === 'string' && /^10[.][0-9]{2,}(?:[.][0-9]+)*\/\S+$/.test(u) && !u.endsWith('/.') && !u.endsWith('/..')

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
export const parse: (s: string) => Option<Doi> = flow(s.trim, s => {
  if (isDoi(s)) {
    return O.some(s)
  }

  if (s.startsWith('doi:')) {
    return O.fromPredicate(isDoi)(s.substring(4))
  }

  try {
    const url = new URL(s)

    if (!['http:', 'https:'].includes(url.protocol) || !['doi.org', 'dx.doi.org'].includes(url.hostname)) {
      return O.none
    }

    return O.fromPredicate(isDoi)(decodeURIComponent(url.pathname).substring(1))
  } catch {
    return O.fromPredicate(isDoi)(s)
  }
})

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
export const getRegistrant = <T extends Doi = Doi>(doi: T): T extends Doi<infer R> ? R : never =>
  doi.split('/', 1)[0].slice(3) as never
