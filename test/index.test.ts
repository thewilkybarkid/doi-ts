import { test } from '@fast-check/jest'
import { describe, expect } from '@jest/globals'
import * as O from 'fp-ts/Option'
import * as _ from '../src'
import * as fc from './fc'

describe('constructors', () => {
  test.prop([fc.doi()], {
    examples: [
      ['10.0001/journal.pone.000001' as _.Doi],
      ['10.0001/journal/pone.0011111' as _.Doi],
      ['10.1000/456%23789' as _.Doi],
      ['10.0001.112/journal.pone.0011021' as _.Doi],
      ['10.0001/issn.10001' as _.Doi],
      ['10.10.123/456' as _.Doi],
      ['10.1002/(SICI)1096-8644(199808)106:4<483::AID-AJPA4>3.0.CO;2-K' as _.Doi],
      ['10.1002/(SICI)1521-3951(199911)216:1<135::AID-PSSB135>3.0.CO;2-%23' as _.Doi],
      ['10.0000/.a' as _.Doi],
      ['10.0000/..a' as _.Doi],
      ['10.0000/./' as _.Doi],
      ['10.0000/../' as _.Doi],
    ],
  })('with a DOI', doi => {
    expect(_.Doi(doi)).toStrictEqual(doi)
  })

  test.prop(
    [fc.anything().filter(value => !(typeof value === 'string') || /\s/.test(value) || !value.startsWith('10.'))],
    {
      examples: [['10..1000/journal.pone.0011111'], ['1.1/1.1'], ['10/134980'], ['10.0000/.'], ['10.0000/..']],
    },
  )('with a non-DOI', value => {
    expect(() => _.Doi(value as string)).toThrow(new Error('Not a DOI'))
  })
})

describe('destructors', () => {
  test.prop([fc.doi().map(doi => [doi, new URL(`https://doi.org/${encodeURI(doi)}`).href] as const)], {
    examples: [
      [['10.0001/journal/pone.0011111' as _.Doi, 'https://doi.org/10.0001/journal/pone.0011111']],
      [['10.1000/456#789' as _.Doi, 'https://doi.org/10.1000/456%23789']],
      [['10.1000/456%23%23789' as _.Doi, 'https://doi.org/10.1000/456%2523%2523789']],
      [
        [
          '10.1002/(SICI)1521-3951(199911)216:1<135::AID-PSSB135>3.0.CO;2-#' as _.Doi,
          'https://doi.org/10.1002/(SICI)1521-3951(199911)216:1%3C135::AID-PSSB135%3E3.0.CO;2-%23',
        ],
      ],
      [['10.1000/./' as _.Doi, 'https://doi.org/10.1000/.%2F']],
      [['10.1000/../' as _.Doi, 'https://doi.org/10.1000/..%2F']],
      [['10.1000/...' as _.Doi, 'https://doi.org/10.1000/...']],
      [['10.1000/.../' as _.Doi, 'https://doi.org/10.1000/.../']],
      [['10.1000/\\' as _.Doi, 'https://doi.org/10.1000/%5C']],
    ],
  })('toUrl', ([doi, url]) => {
    expect(_.toUrl(doi).href).toStrictEqual(url)
  })
})

describe('instances', () => {
  describe('Eq', () => {
    test.prop([fc.doi()])('with the same DOI', doi => {
      expect(_.Eq.equals(doi, doi)).toBe(true)
    })

    test.prop([fc.doi().map(doi => [doi, doi.toLowerCase() as _.Doi])], {
      examples: [[['10.123/ABC' as _.Doi, '10.123/AbC' as _.Doi]]],
    })('with the same DOI in different cases', ([doi1, doi2]) => {
      expect(_.Eq.equals(doi1, doi2)).toBe(true)
    })

    test.prop([fc.doi(), fc.doi()])('with different DOIs', (doi1, doi2) => {
      expect(_.Eq.equals(doi1, doi2)).toBe(false)
    })
  })
})

describe('refinements', () => {
  describe('isDoi', () => {
    test.prop([fc.doi()], {
      examples: [
        ['10.0001/journal.pone.000001' as _.Doi],
        ['10.0001/journal/pone.0011111' as _.Doi],
        ['10.1000/456%23789' as _.Doi],
        ['10.0001.112/journal.pone.0011021' as _.Doi],
        ['10.0001/issn.10001' as _.Doi],
        ['10.10.123/456' as _.Doi],
        ['10.1002/(SICI)1096-8644(199808)106:4<483::AID-AJPA4>3.0.CO;2-K' as _.Doi],
        ['10.1002/(SICI)1521-3951(199911)216:1<135::AID-PSSB135>3.0.CO;2-%23' as _.Doi],
        ['10.0000/.a' as _.Doi],
        ['10.0000/..a' as _.Doi],
        ['10.0000/./' as _.Doi],
        ['10.0000/../' as _.Doi],
      ],
    })('with a DOI', doi => {
      expect(_.isDoi(doi)).toBe(true)
    })

    test.prop(
      [fc.anything().filter(value => !(typeof value === 'string') || /\s/.test(value) || !value.startsWith('10.'))],
      {
        examples: [['10..1000/journal.pone.0011111'], ['1.1/1.1'], ['10/134980'], ['10.0000/.'], ['10.0000/..']],
      },
    )('with a non-DOI', value => {
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
    test.prop(
      [
        fc
          .tuple(
            fc.stringOf(fc.constant(' ')),
            fc.oneof(
              fc.doi().map(doi => [doi, doi]),
              fc.doi().map(doi => [doi, `doi:${doi}`]),
              fc
                .tuple(fc.doi(), fc.constantFrom('https', 'http'), fc.constantFrom('doi.org', 'dx.doi.org'))
                .map(([doi, scheme, host]) => [doi, new URL(`${scheme}://${host}/${encodeURI(doi)}`).href]),
            ),
            fc.stringOf(fc.constant(' ')),
          )
          .map(([whitespaceBefore, [doi, encoded], whitespaceAfter]) => [
            doi,
            `${whitespaceBefore}${encoded}${whitespaceAfter}`,
          ]),
      ],
      {
        examples: [
          [['10.0001/journal/pone.0011111' as _.Doi, 'https://doi.org/10.0001/journal/pone.0011111']],
          [['10.1000/456#789' as _.Doi, 'https://doi.org/10.1000/456%23789']],
          [['10.1000/456%23%23789' as _.Doi, 'https://doi.org/10.1000/456%2523%2523789']],
          [
            [
              '10.1002/(SICI)1521-3951(199911)216:1<135::AID-PSSB135>3.0.CO;2-#' as _.Doi,
              'https://doi.org/10.1002/(SICI)1521-3951(199911)216:1%3C135::AID-PSSB135%3E3.0.CO;2-%23',
            ],
          ],
          [['10.1000/./' as _.Doi, 'https://doi.org/10.1000/.%2F']],
          [['10.1000/../' as _.Doi, 'https://doi.org/10.1000/..%2F']],
          [['10.1000/...' as _.Doi, 'https://doi.org/10.1000/...']],
          [['10.1000/.../' as _.Doi, 'https://doi.org/10.1000/.../']],
          [['10.1000/\\' as _.Doi, 'https://doi.org/10.1000/%5C']],
        ],
      },
    )('when it contains a DOI', ([doi, input]) => {
      expect(_.parse(input)).toStrictEqual(O.some(doi))
    })

    test.prop([fc.unicodeString().filter(value => /\s/.test(value) || !value.startsWith('10.'))], {
      examples: [
        ['dx.doi.org/10.1016/j.neuron.2014.09.004'],
        ['doi.org/10.1016/j.neuron.2014.09.004'],
        ['do:10.1000/journal.pone.0011111'],
        ['doi:10..1000/journal.pone.0011111'],
        ['DO:10.1000/journal.pone.0011111'],
        [':10.1000/journal.pone.0011111'],
        ['httpp://dx.doi.org/10.1016/j.neuron.2014.09.004'],
        ['httpp://doi.org/10.1016/j.neuron.2014.09.004'],
        ['ftp://dx.doi.org/10.1016/j.neuron.2014.09.004'],
        ['ftp://doi.org/10.1016/j.neuron.2014.09.004'],
      ],
    })('when it does not contain a DOI', input => {
      expect(_.parse(input)).toStrictEqual(O.none)
    })
  })

  test.prop([fc.registrant().chain(registrant => fc.tuple(fc.constant(registrant), fc.doi(fc.constant(registrant))))])(
    'getRegistrant',
    ([registrant, doi]) => {
      expect(_.getRegistrant(doi)).toBe(registrant)
    },
  )
})
