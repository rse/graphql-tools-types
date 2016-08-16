
import * as GraphQL      from "graphql"
import * as GraphQLTools from "graphql-tools"
import GraphQLToolsTypes from "." // graphql-tools-types"

let definition = `
    schema {
        query: RootQuery
    }
    scalar JSON
    scalar UUID
    type RootQuery {
        exampleJSON(json1: JSON, json2: JSON): JSON
        exampleUUID(uuid1: UUID, uuid2: UUID): UUID
    }
`
let resolvers = {
    JSON: GraphQLToolsTypes.ResolverJSON,
    UUID: GraphQLToolsTypes.ResolverUUID,
    RootQuery: {
        exampleJSON: (root, args, ctx, info) => {
            return args.json1
        },
        exampleUUID: (root, args, ctx, info) => {
            return args.uuid1
        }
    }
}
let schema = GraphQLTools.makeExecutableSchema({
    typeDefs: [ definition ],
    resolvers: resolvers,
})
let query = `
    query ($json: JSON, $uuid: UUID) {
        exampleJSON(json1: $json, json2: { foo: "bar", baz: 42, quux: true }),
        exampleUUID(uuid1: $uuid, uuid2: "6cbe657c-63e3-11e6-aa83-080027e303e4"),
    }
`
let variables = {
    json: { foo: "bar", baz: 42, quux: true },
    uuid: "6cbe657c-63e3-11e6-aa83-080027e303e4"
}
GraphQL.graphql(schema, query, null, null, variables).then((result) => {
    console.log("OK", result)
}).catch((result) => {
    console.log("ERROR", result)
})

