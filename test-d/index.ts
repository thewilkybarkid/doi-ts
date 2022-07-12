import { expectTypeOf } from 'expect-type'
import { Eq } from 'fp-ts/Eq'
import * as O from 'fp-ts/Option'
import { pipe } from 'fp-ts/function'
import * as _ from '../src'

import Doi = _.Doi
import Option = O.Option

declare const string: string
declare const unknown: unknown
declare const doi: Doi

//
// Doi
//

expectTypeOf(doi).toMatchTypeOf(string)
expectTypeOf(string).not.toMatchTypeOf(doi)

//
// toUrl
//

expectTypeOf(_.toUrl(doi)).toEqualTypeOf<URL>()

//
// Eq
//

expectTypeOf(_.Eq).toEqualTypeOf<Eq<Doi>>()

//
// isDoi
//

expectTypeOf(pipe(unknown, O.fromPredicate(_.isDoi))).toEqualTypeOf<Option<Doi>>()

//
// getRegistrant
//

expectTypeOf(_.getRegistrant(doi)).toEqualTypeOf(string)
