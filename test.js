
import UUID              from "pure-uuid"
import * as GraphQL      from "graphql"
import * as GraphQLTools from "graphql-tools"
import GraphQLToolsTypes from "."

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
    resolvers: resolvers,
})
let query = `
    query ($date: Date, $uuid: UUID, $json: JSON, $coord: Coord) {
        exampleVoid,
        exampleMyInt(num: 100),
        exampleMyFloat(num: 42.7),
        exampleMyString(str: "foo")
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
    date: "2016-08-16T00:01:02.000Z",
    uuid: "6cbe657c-63e3-11e6-aa83-080027e303e4",
    json: { foo: "bar", baz: 42, quux: true },
    coord: { x: 7, y: 42 }
}
GraphQL.graphql(schema, query, null, null, variables).then((result) => {
    console.log("OK", result)
}).catch((result) => {
    console.log("ERROR", result)
})

