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
import * as GraphQL         from "graphql"
import * as GraphQLLanguage from "graphql/language"
import { GraphQLError }     from "graphql/error"

/*  Integer resolver for GraphQL Tools  */
export default function ResolverInt (options = {}) {
    const errors = []
    if (!Ducky.validate(options, "{ name: string, min?: number, max?: number, fn?: function }", errors))
        throw new GraphQLError("[graphql-tools-types] " +
            `invalid parameters: ${errors.join("; ")}`, [])
    const validate = (value, ast = null) => {
        if (options.min !== undefined && value < options.min)
            throw new GraphQLError(`[graphql-tools-types] ${options.name}: ` +
                `minimum value is ${options.min}`, ast !== null ? [ ast ] : [])
        if (options.max !== undefined && value > options.max)
            throw new GraphQLError(`[graphql-tools-types] ${options.name}: ` +
                `maximum value is ${options.max}`, ast !== null ? [ ast ] : [])
        if (options.fn !== undefined && !options.fn(value))
            throw new GraphQLError(`[graphql-tools-types] ${options.name}: ` +
                "value not valid", ast !== null ? [ ast ] : [])
    }
    return {
        /*  serialize value sent as output to the client  */
        __serialize: (value) => {
            return value
        },

        /*  parse value received as input from client  */
        __parseValue: (value) => {
            if (typeof value === "string") {
                const re = /^[+-]?\d+$/
                if (!re.test(value))
                    throw new GraphQLError(`[graphql-tools-types] ${options.name}: ` +
                        `invalid input value (matching regular expression "${re}" expected)`, [])
                value = parseInt(value, 10)
            }
            else if (typeof value !== "number")
                throw new GraphQLError(`[graphql-tools-types] ${options.name}: ` +
                    "invalid input value (type \"number\" or \"string\" expected)", [])
            validate(value)
            return value
        },

        /*  parse value received as literal in AST  */
        __parseLiteral: (ast) => {
            if (ast.kind !== GraphQLLanguage.Kind.INT)
                throw new GraphQLError(`[graphql-tools-types] ${options.name}: ` +
                    "invalid AST node (kind \"INT\" expected)", [ ast ])
            const value = GraphQL.GraphQLInt.parseLiteral(ast)
            validate(value, ast)
            return value
        }
    }
}

