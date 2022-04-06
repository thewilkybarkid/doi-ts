import * as O from 'fp-ts/Option'
import { pipe } from 'fp-ts/function'
import * as _ from '../../src'

declare const unknown: unknown

declare const doi: _.Doi

//
// Doi
//

const doiToString: string = doi
// $ExpectError
const stringToDoi: _.Doi = 'foo'

//
// Eq
//

// $ExpectType Eq<Doi>
_.Eq

//
// isDoi
//

// $ExpectType Option<Doi>
pipe(unknown, O.fromPredicate(_.isDoi))
