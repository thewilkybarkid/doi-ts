/**
 * @since 0.1.0
 */
import doiRegex from 'doi-regex'
import { Refinement } from 'fp-ts/Refinement'

// -------------------------------------------------------------------------------------
// model
// -------------------------------------------------------------------------------------

/**
 * @category model
 * @since 0.1.0
 */
export type Doi = string & DoiBrand

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
export const toUrl: (doi: Doi) => URL = doi => new URL(doi, 'https://doi.org')

// -------------------------------------------------------------------------------------
// refinements
// -------------------------------------------------------------------------------------

/**
 * @category refinements
 * @since 0.1.0
 */
export const isDoi: Refinement<unknown, Doi> = (u): u is Doi =>
  typeof u === 'string' && doiRegex({ exact: true }).test(u)
