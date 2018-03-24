/*
**  GraphQL-Tools-Types -- Custom Scalar Types for GraphQL-Tools
**  Copyright (c) 2016-2018 Ralf S. Engelschall <rse@engelschall.com>
**
**  Permission is hereby granted, free of charge, to any person obtaining
**  a copy of this software and associated documentation files (the
**  "Software"), to deal in the Software without restriction, including
**  without limitation the rights to use, copy, modify, merge, publish,
**  distribute, sublicense, and/or sell copies of the Software, and to
**  permit persons to whom the Software is furnished to do so, subject to
**  the following conditions:
**
**  The above copyright notice and this permission notice shall be included
**  in all copies or substantial portions of the Software.
**
**  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
**  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
**  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
**  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
**  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
**  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
**  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import * as GraphQL      from "graphql"
import * as GraphQLTools from "graphql-tools"
import GraphQLToolsTypes from "../lib/gtt.js"

let definition = `
    schema {
        query: RootQuery
    }
    scalar Void
    scalar MyInt
    scalar MyFloat
    scalar MyString
    scalar Date
    scalar UUID
    scalar JSON
    scalar Coord
    type RootQuery {
        exampleVoid: Void
        exampleMyInt(num: MyInt): Int
        exampleMyFloat(num: MyFloat): Float
        exampleMyString(str: MyString): String
        exampleDate(date: Date): Date
        exampleUUID(uuid: UUID): UUID
        exampleJSON(json: JSON): JSON
        exampleCoord(coord: Coord): Coord
    }
`
let resolvers = {
    Void:     GraphQLToolsTypes.Void({ name: "MyVoid" }),
    MyInt:    GraphQLToolsTypes.Int({ name: "MyInt", min: 0, max: 100 }),
    MyFloat:  GraphQLToolsTypes.Float({ name: "MyFloat", min: 0.0, max: 100.0 }),
    MyString: GraphQLToolsTypes.String({ name: "MyString", regex: /^(?:foo|bar|quux)$/ }),
    Date:     GraphQLToolsTypes.Date({ name: "MyDate" }),
    UUID:     GraphQLToolsTypes.UUID({ name: "MyUUID" }),
    JSON:     GraphQLToolsTypes.JSON({ name: "MyJSON" }),
    Coord:    GraphQLToolsTypes.JSON({ name: "Coord", struct: "{ x: number, y: number }" }),
    RootQuery: {
        exampleVoid: (root, args, ctx, info) => {
            return {}
        },
        exampleMyInt: (root, args, ctx, info) => {
            return args.num
        },
        exampleMyFloat: (root, args, ctx, info) => {
            return args.num
        },
        exampleMyString: (root, args, ctx, info) => {
            return args.str
        },
        exampleDate: (root, args, ctx, info) => {
            return args.date
        },
        exampleUUID: (root, args, ctx, info) => {
            return args.uuid
        },
        exampleJSON: (root, args, ctx, info) => {
            return args.json
        },
        exampleCoord: (root, args, ctx, info) => {
            return args.coord
        }
    }
}
let schema = GraphQLTools.makeExecutableSchema({
    typeDefs: [ definition ],
    resolvers: resolvers
})
let query = `
    query ($int: MyInt, $float: MyFloat, $string: MyString, $date: Date, $uuid: UUID, $json: JSON, $coord: Coord) {
        exampleVoid,
        int1: exampleMyInt(num: $int),
        int2: exampleMyInt(num: 100),
        float1: exampleMyFloat(num: $float),
        float2: exampleMyFloat(num: 42.7),
        string1: exampleMyString(str: $string)
        string2: exampleMyString(str: "foo")
        date1: exampleDate(date: $date),
        date2: exampleDate(date: "2016-08-16T00:01:02.000Z"),
        uuid1: exampleUUID(uuid: $uuid),
        uuid2: exampleUUID(uuid: "6cbe657c-63e3-11e6-aa83-080027e303e4"),
        json1: exampleJSON(json: $json),
        json2: exampleJSON(json: { foo: "bar", baz: 42, quux: true }),
        coord1: exampleCoord(coord: $coord),
        coord2: exampleCoord(coord: { x: 7, y: 42 })
    }
`
let variables = {
    int:    100,
    float:  42.7,
    string: "foo",
    date:   "2016-08-16T00:01:02.000Z",
    uuid:   "6cbe657c-63e3-11e6-aa83-080027e303e4",
    json:   { foo: "bar", baz: 42, quux: true },
    coord:  { x: 7, y: 42 }
}
GraphQL.graphql(schema, query, null, null, variables).then((result) => {
    /* eslint no-console: off */
    console.log("OK", result)
}).catch((result) => {
    /* eslint no-console: off */
    console.log("ERROR", result)
})

