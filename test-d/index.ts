import { expectTypeOf } from 'expect-type'
import { Eq } from 'fp-ts/Eq'
import * as O from 'fp-ts/Option'
import { pipe } from 'fp-ts/function'
import * as _ from '../src'

import Doi = _.Doi
import Option = O.Option

declare const string: string
declare const unknown: unknown
declare const registrantBiorxiv: '1101'
declare const registrantElife: '7554'
declare const doi: Doi
declare const doiBiorxiv: Doi<typeof registrantBiorxiv>
declare const doiElife: Doi<typeof registrantElife>
declare const doiBiorxivOrElife: typeof doiBiorxiv | typeof doiElife

//
// Doi
//

expectTypeOf(doi).toMatchTypeOf(string)
expectTypeOf(string).not.toMatchTypeOf(doi)
expectTypeOf(doiBiorxiv).toMatchTypeOf(doi)
expectTypeOf(doi).not.toMatchTypeOf(doiBiorxiv)
expectTypeOf(doiBiorxiv).not.toMatchTypeOf(doiElife)
expectTypeOf(Doi(string)).toMatchTypeOf(doi)
expectTypeOf(Doi('10.1101/182')).toMatchTypeOf(doiBiorxiv)

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
// hasRegistrant
//

expectTypeOf(pipe(doi, O.fromPredicate(_.hasRegistrant(registrantBiorxiv)))).toEqualTypeOf<Option<typeof doiBiorxiv>>()
expectTypeOf(pipe(doi, O.fromPredicate(_.hasRegistrant(registrantBiorxiv, registrantElife)))).toEqualTypeOf<
  Option<typeof doiBiorxiv | typeof doiElife>
>()

//
// parse
//

expectTypeOf(_.parse(string)).toEqualTypeOf<Option<Doi>>()

//
// getRegistrant
//

expectTypeOf(_.getRegistrant(doi)).toEqualTypeOf(string)
expectTypeOf(_.getRegistrant(doiBiorxiv)).toEqualTypeOf(registrantBiorxiv)
expectTypeOf(_.getRegistrant(doiBiorxivOrElife)).toEqualTypeOf<typeof registrantBiorxiv | typeof registrantElife>()
