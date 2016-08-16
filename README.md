
GraphQL-Tools-Types
===================

Custom Types for GraphQL-Tools

<p/>
<img src="https://nodei.co/npm/graphql-tools-types.png?downloads=true&stars=true" alt=""/>

<p/>
<img src="https://david-dm.org/rse/graphql-tools-types.png" alt=""/>

About
-----

This Node.js module provides the custom types JavaScript Object
Notation (JSON), Universally Unique Identifier (UUID) and Date for
[GraphQL Tools](https://github.com/apollostack/graphql-tools),
a collection of handy tools on top of
[GraphQL.js](https://github.com/graphql/graphql-js) for manipulating
[GraphQL](http://graphql.org/) schemas.

Installation
------------

```shell
$ npm install graphql-tools-types
```

Usage
-----

```js
import UUID              from "pure-uuid"
import * as GraphQL      from "graphql"
import * as GraphQLTools from "graphql-tools"
import GraphQLToolsTypes from "graphql-tools-types"

let definition = `
    schema {
        query: RootQuery
    }
    scalar JSON
    scalar UUID
    scalar Date
    type RootQuery {
        exampleJSON(json1: JSON, json2: JSON): JSON
        exampleUUID(uuid1: UUID, uuid2: UUID): UUID
        exampleDate(date1: Date, date2: Date): Date
    }
`
let resolvers = {
    JSON: GraphQLToolsTypes.ResolverJSON,
    UUID: GraphQLToolsTypes.ResolverUUID,
    Date: GraphQLToolsTypes.ResolverDate,
    RootQuery: {
        exampleJSON: (root, args, ctx, info) => {
            return args.json1
        },
        exampleUUID: (root, args, ctx, info) => {
            return args.uuid1
        },
        exampleDate: (root, args, ctx, info) => {
            return args.date1
        }
    }
}
let schema = GraphQLTools.makeExecutableSchema({
    typeDefs: [ definition ],
    resolvers: resolvers,
})
let query = `
    query ($json: JSON, $uuid: UUID, $date: Date) {
        exampleJSON(json1: $json, json2: { foo: "bar", baz: 42, quux: true }),
        exampleUUID(uuid1: $uuid, uuid2: "6cbe657c-63e3-11e6-aa83-080027e303e4"),
        exampleDate(date1: $date, date2: "2016-08-16T00:01:02.000Z")
    }
`
let variables = {
    json: { foo: "bar", baz: 42, quux: true },
    uuid: "6cbe657c-63e3-11e6-aa83-080027e303e4",
    date: "2016-08-16T00:01:02.000Z"
}
GraphQL.graphql(schema, query, null, null, variables).then((result) => {
    console.log("OK", result)
}).catch((result) => {
    console.log("ERROR", result)
})

```

``
$ npm test
OK { data:
   { exampleJSON: { foo: 'bar', baz: 42, quux: true },
     exampleUUID: '6cbe657c-63e3-11e6-aa83-080027e303e4',
     exampleDate: '2016-08-16T00:01:02.000Z' } }
```

License
-------

Copyright (c) 2016 Ralf S. Engelschall (http://engelschall.com/)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

