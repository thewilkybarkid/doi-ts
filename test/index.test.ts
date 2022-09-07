import * as O from 'fp-ts/Option'
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

    describe('hasRegistrant', () => {
      test('when the registrant matches', () => {
        fc.assert(
          fc.property(
            fc
              .array(fc.registrant(), { minLength: 1 })
              .chain(registrants => fc.tuple(fc.constant(registrants), fc.doi(fc.constantFrom(...registrants)))),
            ([registrants, doi]) => {
              expect(_.hasRegistrant(...registrants)(doi)).toBe(true)
            },
          ),
        )
      })

      test('when the registrant does not match', () => {
        fc.assert(
          fc.property(fc.array(fc.registrant()), fc.doi(), (registrants, doi) => {
            expect(_.hasRegistrant(...registrants)(doi)).toBe(false)
          }),
        )
      })
    })
  })

  describe('utils', () => {
    describe('parse', () => {
      test('when it contains a DOI', () => {
        fc.assert(
          fc.property(
            fc
              .tuple(
                fc.doi(),
                fc.stringOf(fc.constant(' ')),
                fc.constantFrom(
                  'doi:',
                  'https://doi.org/',
                  'http://doi.org/',
                  'https://dx.doi.org/',
                  'http://dx.doi.org/',
                ),
                fc.stringOf(fc.constant(' ')),
              )
              .map(([doi, whitespaceBefore, prefix, whitespaceAfter]) => [
                doi,
                `${whitespaceBefore}${prefix}${doi}${whitespaceAfter}`,
              ]),
            ([doi, input]) => {
              expect(_.parse(input)).toStrictEqual(O.some(doi))
            },
          ),
        )
      })

      test('when it does not contain a DOI', () => {
        fc.assert(
          fc.property(fc.unicodeString(), input => {
            expect(_.parse(input)).toStrictEqual(O.none)
          }),
        )
      })
    })

    test('getRegistrant', () => {
      fc.assert(
        fc.property(
          fc.registrant().chain(registrant => fc.tuple(fc.constant(registrant), fc.doi(fc.constant(registrant)))),
          ([registrant, doi]) => {
            expect(_.getRegistrant(doi)).toBe(registrant)
          },
        ),
      )
    })
  })
})
