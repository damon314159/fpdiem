/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */

/*
Taken from fp-ts since it just works™
https://github.com/gcanti/fp-ts/blob/master/src/HKT.ts

MIT License

Copyright (c) 2017-present Giulio Canti

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

/**
 * Type defunctionalization (as describe in [Lightweight higher-kinded polymorphism](https://www.cl.cam.ac.uk/~jdy22/papers/lightweight-higher-kinded-polymorphism.pdf))
 *
 */

/**
 * `* -> *` constructors
 */
export interface HKT<URI extends URIS, A> {
  readonly URI: URI;
}

/**
 * `* -> * -> *` constructors
 */
export interface HKT2<URI extends URIS2, E, A> {
  readonly URI: URI;
}

/**
 * `* -> * -> * -> *` constructors
 */
export interface HKT3<URI extends URIS3, R, E, A> {
  readonly URI: URI;
}

/**
 * `* -> * -> * -> * -> *` constructors
 */
export interface HKT4<URI extends URIS4, S, R, E, A> {
  readonly URI: URI;
}

//
// inj: type-level dictionaries for HKTs: URI -> concrete type
//

/**
 * `* -> *` constructors
 */
export interface URItoKind<A> {}

/**
 * `* -> * -> *` constructors
 */
export interface URItoKind2<E, A> {}

/**
 * `* -> * -> * -> *` constructors
 */
export interface URItoKind3<R, E, A> {}

/**
 * `* -> * -> * -> * -> *` constructors
 */
export interface URItoKind4<S, R, E, A> {}

//
// unions of URIs
//

/**
 * `* -> *` constructors
 */
export type URIS = keyof URItoKind<any>;

/**
 * `* -> * -> *` constructors
 */
export type URIS2 = keyof URItoKind2<any, any>;

/**
 * `* -> * -> * -> *` constructors
 */
export type URIS3 = keyof URItoKind3<any, any, any>;

/**
 * `* -> * -> * -> * -> *` constructors
 */
export type URIS4 = keyof URItoKind4<any, any, any, any>;

//
// prj
//

/**
 * `* -> *` constructors
 */
export type Kind<URI extends URIS, A> = URI extends URIS
  ? URItoKind<A>[URI]
  : any;

/**
 * `* -> * -> *` constructors
 */
export type Kind2<URI extends URIS2, E, A> = URI extends URIS2
  ? URItoKind2<E, A>[URI]
  : any;

/**
 * `* -> * -> * -> *` constructors
 */
export type Kind3<URI extends URIS3, R, E, A> = URI extends URIS3
  ? URItoKind3<R, E, A>[URI]
  : any;

/**
 * `* -> * -> * -> * -> *` constructors
 */
export type Kind4<URI extends URIS4, S, R, E, A> = URI extends URIS4
  ? URItoKind4<S, R, E, A>[URI]
  : any;
