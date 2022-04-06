import * as _ from '../src'
import * as fc from './fc'

describe('doi-ts', () => {
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
