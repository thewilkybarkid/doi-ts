import { test } from '@fast-check/jest'
import { describe, expect } from '@jest/globals'
import * as O from 'fp-ts/Option'
import * as _ from '../src'
import * as fc from './fc'

describe('doi-ts', () => {
  describe('destructors', () => {
    test.prop([fc.doi()])('toUrl', doi => {
      expect(_.toUrl(doi)).toStrictEqual(new URL(`https://doi.org/${doi}`))
    })
  })

  describe('instances', () => {
    describe('Eq', () => {
      test.prop([fc.doi()])('with the same DOI', doi => {
        expect(_.Eq.equals(doi, doi)).toBe(true)
      })

      test.prop([fc.doi()])('with the same DOI in different cases', doi => {
        expect(_.Eq.equals(doi, doi.toLowerCase() as _.Doi)).toBe(true)
      })

      test.prop([fc.doi(), fc.doi()])('with different DOIs', (doi1, doi2) => {
        expect(_.Eq.equals(doi1, doi2)).toBe(false)
      })
    })
  })

  describe('refinements', () => {
    describe('isDoi', () => {
      test.prop([fc.doi()])('with a DOI', doi => {
        expect(_.isDoi(doi)).toBe(true)
      })

      test.prop([fc.anything()])('with a non-DOI', value => {
        expect(_.isDoi(value)).toBe(false)
      })
    })

    describe('hasRegistrant', () => {
      test.prop([
        fc
          .array(fc.registrant(), { minLength: 1 })
          .chain(registrants => fc.tuple(fc.constant(registrants), fc.doi(fc.constantFrom(...registrants)))),
      ])('when the registrant matches', ([registrants, doi]) => {
        expect(_.hasRegistrant(...registrants)(doi)).toBe(true)
      })

      test.prop([fc.array(fc.registrant()), fc.doi()])('when the registrant does not match', (registrants, doi) => {
        expect(_.hasRegistrant(...registrants)(doi)).toBe(false)
      })
    })
  })

  describe('utils', () => {
    describe('parse', () => {
      test.prop([
        fc
          .tuple(
            fc.doi(),
            fc.stringOf(fc.constant(' ')),
            fc.constantFrom('doi:', 'https://doi.org/', 'http://doi.org/', 'https://dx.doi.org/', 'http://dx.doi.org/'),
            fc.stringOf(fc.constant(' ')),
          )
          .map(([doi, whitespaceBefore, prefix, whitespaceAfter]) => [
            doi,
            `${whitespaceBefore}${prefix}${doi}${whitespaceAfter}`,
          ]),
      ])('when it contains a DOI', ([doi, input]) => {
        expect(_.parse(input)).toStrictEqual(O.some(doi))
      })

      test.prop([fc.unicodeString()])('when it does not contain a DOI', input => {
        expect(_.parse(input)).toStrictEqual(O.none)
      })
    })

    test.prop([
      fc.registrant().chain(registrant => fc.tuple(fc.constant(registrant), fc.doi(fc.constant(registrant)))),
    ])('getRegistrant', ([registrant, doi]) => {
      expect(_.getRegistrant(doi)).toBe(registrant)
    })
  })
})
