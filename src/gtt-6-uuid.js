/*
**  GraphQL-Tools-Types -- Custom Scalar Types for GraphQL-Tools
**  Copyright (c) 2016-2021 Dr. Ralf S. Engelschall <rse@engelschall.com>
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

/*  external requirements  */
import Ducky                from "ducky"
import UUID                 from "pure-uuid"
import * as GraphQL         from "graphql"
import * as GraphQLLanguage from "graphql/language"
import { GraphQLError }     from "graphql/error"

/*  UUID resolver for GraphQL Tools  */
export default function ResolverUUID (options = {}) {
    const errors = []
    if (!Ducky.validate(options, "{ name: string, storage?: string, fn?: function }", errors))
        throw new GraphQLError("[graphql-tools-types] " +
            `invalid parameters: ${errors.join("; ")}`, [])
    if (options.storage === undefined)
        options.storage = "binary"
    const validate = (value, ast = null) => {
        if (options.fn !== undefined && !options.fn(value))
            throw new GraphQLError(`[graphql-tools-types] ${options.name}: ` +
                "value not valid", ast !== null ? [ ast ] : [])
    }
    return {
        /*  serialize value sent as output to the client  */
        __serialize: (value) => {
            return (options.storage === "binary" ? value.format() : value)
        },

        /*  parse value received as input from client  */
        __parseValue: (value) => {
            if (typeof value !== "string")
                throw new GraphQLError(`[graphql-tools-types] ${options.name}: ` +
                    "invalid UUID input value (string expected)", [])
            try {
                value = new UUID(value)
            }
            catch (ex) {
                throw new GraphQLError(`[graphql-tools-types] ${options.name}: ` +
                    "invalid UUID string representation", [])
            }
            if (options.storage === "string")
                value = value.format()
            validate(value)
            return value
        },

        /*  parse value received as literal in AST  */
        __parseLiteral: (ast) => {
            if (ast.kind !== GraphQLLanguage.Kind.STRING)
                throw new GraphQLError(`[graphql-tools-types] ${options.name}: ` +
                    "invalid UUID literal (string expected)", [ ast ])
            let value = GraphQL.GraphQLString.parseLiteral(ast)
            try {
                value = new UUID(value)
            }
            catch (ex) {
                throw new GraphQLError(`[graphql-tools-types] ${options.name}: ` +
                    "invalid UUID string representation", [ ast ])
            }
            if (options.storage === "string")
                value = value.format()
            validate(value, ast)
            return value
        }
    }
}

