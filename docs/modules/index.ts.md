---
title: index.ts
nav_order: 1
parent: Modules
---

## index overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [destructors](#destructors)
  - [toUrl](#tourl)
- [instances](#instances)
  - [Eq](#eq)
- [model](#model)
  - [Doi (type alias)](#doi-type-alias)
- [refinements](#refinements)
  - [isDoi](#isdoi)
- [utils](#utils)
  - [getRegistrant](#getregistrant)

---

# destructors

## toUrl

**Signature**

```ts
export declare const toUrl: (doi: Doi) => URL
```

**Example**

```ts
import { Doi, toUrl } from 'doi-ts'

const url = toUrl('10.1000/182' as Doi)

assert.deepStrictEqual(url.href, 'https://doi.org/10.1000/182')
```

Added in v0.1.1

# instances

## Eq

**Signature**

```ts
export declare const Eq: E.Eq<Doi<string>>
```

Added in v0.1.1

# model

## Doi (type alias)

**Signature**

```ts
export type Doi<R extends string = string> = `10.${R}/${string}` & DoiBrand
```

Added in v0.1.0

# refinements

## isDoi

**Signature**

```ts
export declare const isDoi: Refinement<unknown, Doi<string>>
```

Added in v0.1.0

# utils

## getRegistrant

**Signature**

```ts
export declare const getRegistrant: <R extends string = string>(doi: Doi<R>) => R
```

**Example**

```ts
import { Doi, getRegistrant } from 'doi-ts'

const registrant = getRegistrant('10.1000/182' as Doi)

assert.deepStrictEqual(registrant, '1000')
```

Added in v0.1.2
