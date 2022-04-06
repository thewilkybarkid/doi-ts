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
// refinements
// -------------------------------------------------------------------------------------

/**
 * @category refinements
 * @since 0.1.0
 */
export const isDoi: Refinement<unknown, Doi> = (u): u is Doi =>
  typeof u === 'string' && doiRegex({ exact: true }).test(u)
