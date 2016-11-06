
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
    type RootQuery {
        exampleVoid: Void
        exampleMyInt(num: MyInt): Int
        exampleMyFloat(num: MyFloat): Float
        exampleMyString(str: MyString): String
        exampleDate(date1: Date, date2: Date): Date
        exampleUUID(uuid1: UUID, uuid2: UUID): UUID
        exampleJSON(json1: JSON, json2: JSON): JSON
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
            return args.date1
        },
        exampleUUID: (root, args, ctx, info) => {
            return args.uuid1
        },
        exampleJSON: (root, args, ctx, info) => {
            return args.json1
        }
    }
}
let schema = GraphQLTools.makeExecutableSchema({
    typeDefs: [ definition ],
    resolvers: resolvers,
})
let query = `
    query ($json: JSON, $uuid: UUID, $date: Date) {
        exampleVoid,
        exampleMyInt(num: 100),
        exampleMyFloat(num: 42.7),
        exampleMyString(str: "foo")
        exampleDate(date1: $date, date2: "2016-08-16T00:01:02.000Z"),
        exampleUUID(uuid1: $uuid, uuid2: "6cbe657c-63e3-11e6-aa83-080027e303e4"),
        exampleJSON(json1: $json, json2: { foo: "bar", baz: 42, quux: true }),
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

