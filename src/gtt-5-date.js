/*
**  GraphQL-Tools-Types -- Custom Scalar Types for GraphQL-Tools
**  Copyright (c) 2016-2019 Dr. Ralf S. Engelschall <rse@engelschall.com>
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
import * as GraphQL         from "graphql"
import * as GraphQLLanguage from "graphql/language"
import { GraphQLError }     from "graphql/error"

/*  Date resolver for GraphQL Tools  */
export default function ResolverDate (options = {}) {
    const errors = []
    if (!Ducky.validate(options, "{ name: string, serialization?: string, min?: (string|Date), max?: (string|Date), fn?: function }", errors))
        throw new GraphQLError("[graphql-tools-types] " +
            `invalid parameters: ${errors.join("; ")}`, [])
    if (options.serialization === undefined)
        options.serialization = "string"
    if (typeof options.min === "string")
        options.min = new Date(options.min)
    if (typeof options.max === "string")
        options.max = new Date(options.max)
    const validate = (value, ast = null) => {
        if (options.min !== undefined && value.getTime() < options.min.getTime())
            throw new GraphQLError(`[graphql-tools-types] ${options.name}: ` +
                `minimum date is ${options.min.toISOString()}`, ast !== null ? [ ast ] : [])
        if (options.max !== undefined && value.getTime() > options.max.getTime())
            throw new GraphQLError(`[graphql-tools-types] ${options.name}: ` +
                `maximum date is ${options.max.toISOString()}`, ast !== null ? [ ast ] : [])
        if (options.fn !== undefined && !options.fn(value))
            throw new GraphQLError(`[graphql-tools-types] ${options.name}: ` +
                "value not valid", ast !== null ? [ ast ] : [])
    }
    return {
        /*  serialize value sent as output to the client  */
        __serialize: (value) => {
            return (options.serialization === "string" ? value.toISOString() : value.getTime())
        },

        /*  parse value received as input from client  */
        __parseValue: (value) => {
            if (typeof value === "string" || typeof value === "number") {
                value = new Date(value)
                if (isNaN(value.getTime()))
                    throw new GraphQLError(`[graphql-tools-types] ${options.name}: ` +
                        "invalid Date input value", [])
                validate(value)
                return value
            }
            else if (typeof value === "object" && value instanceof Date)
                return value
            else
                throw new GraphQLError(`[graphql-tools-types] ${options.name}: ` +
                    "invalid Date input value (string or Date expected)", [])
        },

        /*  parse value received as literal in AST  */
        __parseLiteral: (ast) => {
            let value
            if (ast.kind === GraphQLLanguage.Kind.STRING)
                value = GraphQL.GraphQLString.parseLiteral(ast)
            else if (ast.kind === GraphQLLanguage.Kind.INT)
                value = GraphQL.GraphQLInt.parseLiteral(ast)
            else
                throw new GraphQLError(`[graphql-tools-types] ${options.name}: ` +
                    "invalid Date literal (string or number expected)", [ ast ])
            value = new Date(value)
            if (isNaN(value.getTime()))
                throw new GraphQLError(`[graphql-tools-types] ${options.name}: ` +
                    "invalid Date literal (date within valid range expected)", [])
            validate(value, ast)
            return value
        }
    }
}

