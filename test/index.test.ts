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

  describe('instances', () => {
    describe('Eq', () => {
      test('with the same DOI', () => {
        fc.assert(
          fc.property(fc.doi(), doi => {
            expect(_.Eq.equals(doi, doi)).toBe(true)
          }),
        )
      })

      test('with the same DOI in different cases', () => {
        fc.assert(
          fc.property(fc.doi(), doi => {
            expect(_.Eq.equals(doi, doi.toLowerCase() as _.Doi)).toBe(true)
          }),
        )
      })

      test('with different DOIs', () => {
        fc.assert(
          fc.property(fc.doi(), fc.doi(), (doi1, doi2) => {
            expect(_.Eq.equals(doi1, doi2)).toBe(false)
          }),
        )
      })
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
