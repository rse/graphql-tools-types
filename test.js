
import UUID              from "pure-uuid"
import * as GraphQL      from "graphql"
import * as GraphQLTools from "graphql-tools"
import GraphQLToolsTypes from "."

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

