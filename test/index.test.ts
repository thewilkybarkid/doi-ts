import * as _ from '../src'
import * as fc from './fc'

describe('doi-ts', () => {
  describe('destructors', () => {
    test('toUrl', () => {
      fc.assert(
        fc.property(fc.doi(), doi => {
          expect(_.toUrl(doi)).toStrictEqual(new URL(`https://doi.org/${doi}`))
        }),
      )
    })
  })

  describe('refinements', () => {
    describe('isDoi', () => {
      test('with a DOI', () => {
        fc.assert(
          fc.property(fc.doi(), doi => {
            expect(_.isDoi(doi)).toBe(true)
          }),
        )
      })

      test('with a non-DOI', () => {
        fc.assert(
          fc.property(fc.anything(), value => {
            expect(_.isDoi(value)).toBe(false)
          }),
        )
      })
    })
  })
})
