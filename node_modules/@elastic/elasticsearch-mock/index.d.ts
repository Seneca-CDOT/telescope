// Licensed to Elasticsearch B.V under one or more agreements.
// Elasticsearch B.V licenses this file to you under the Apache 2.0 License.
// See the LICENSE file in the project root for more information

import { Connection } from '@elastic/elasticsearch'

declare class ClientMock {
  constructor()
  add(pattern: MockPattern, resolver: ResolverFn): ClientMock
  get(pattern: MockPattern): ResolverFn | null
  clear(pattern: Pick<MockPattern, 'method' | 'path'>): ClientMock
  clearAll(): ClientMock
  getConnection(): typeof Connection
}

export declare type ResolverFn = (params: MockPattern) => Record<string, any> | string

export interface MockPattern {
  method: string | string[]
  path: string | string[]
  querystring?: Record<string, string>
  body?: Record<string, any> | Record<string, any>[]
}

export default ClientMock