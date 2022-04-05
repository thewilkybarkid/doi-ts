import * as _ from '../../src'

declare const doi: _.Doi

//
// Doi
//

const doiToString: string = doi
// $ExpectError
const stringToDoi: _.Doi = 'foo'
