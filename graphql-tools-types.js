/*
**  GraphQL-Tools-Types -- Custom Types for GraphQL-Tools
**  Copyright (c) 2016 Ralf S. Engelschall <rse@engelschall.com>
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

import UUID                 from "pure-uuid"
import * as GraphQL         from "graphql"
import * as GraphQLLanguage from "graphql/language"

/*  JSON resolver for GraphQL Tools  */
const ResolverJSON = {
    /*  serialize value sent as output to the client  */
    __serialize:  (value) => {
        /*  no-op as JSON is native output format  */
        return value
    },

    /*  parse value received as input from client  */
    __parseValue: (value) => {
        /*  no-op as JSON is native input format  */
        return value
    },

    /*  parse value received as literal in AST  */
    __parseLiteral: (ast) => {
        let result
        try {
            const parseJSONLiteral = (ast) => {
                switch (ast.kind) {
                    case GraphQLLanguage.Kind.BOOLEAN:
                        return GraphQL.GraphQLBoolean.parseLiteral(ast)
                    case GraphQLLanguage.Kind.INT:
                        return GraphQL.GraphQLInt.parseLiteral(ast)
                    case GraphQLLanguage.Kind.STRING:
                        return GraphQL.GraphQLString.parseLiteral(ast)
                    case GraphQLLanguage.Kind.FLOAT:
                        return GraphQL.GraphQLFloat.parseLiteral(ast)
                    case GraphQLLanguage.Kind.LIST:
                        return ast.values.map((astItem) => {
                            return parseJSONLiteral(astItem) /* RECURSION */
                        })
                    case GraphQLLanguage.Kind.ENUM:
                        return String(ast.value)
                    case GraphQLLanguage.Kind.OBJECT: {
                        const value = Object.create(null)
                        ast.fields.forEach((field) => {
                            value[field.name.value] = parseJSONLiteral(field.value) /* RECURSION */
                        })
                        return value
                    }
                    default:
                        return null
                }
            }
            result = parseJSONLiteral(ast)
        }
        catch (ex) {
            throw new Error(`[graphql-tools-types] error parsing JSON: ${ex.toString()}`)
        }
        return result
    }
}

/*  UUID resolver for GraphQL Tools  */
const ResolverUUID = {
    /*  serialize value sent as output to the client  */
    __serialize:  (value) => {
        return value.format()
    },

    /*  parse value received as input from client  */
    __parseValue: (value) => {
        return new UUID(value)
    },

    /*  parse value received as literal in AST  */
    __parseLiteral: (ast) => {
        if (ast.kind !== GraphQLLanguage.Kind.STRING)
            throw new Error(`[graphql-tools-types] invalid UUID literal (string expected)`)
        let value = GraphQL.GraphQLString.parseLiteral(ast)
        return new UUID(value)
    }
}

/*  export the methods  */
module.exports = {
    ResolverJSON: ResolverJSON,
    ResolverUUID: ResolverUUID
}

