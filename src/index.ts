/**
 * @since 0.1.0
 */

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
