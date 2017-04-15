/*
**  GraphQL-Tools-Types -- Custom Scalar Types for GraphQL-Tools
**  Copyright (c) 2016-2017 Ralf S. Engelschall <rse@engelschall.com>
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
import * as GraphQLLanguage from "graphql/language"
import { GraphQLError }     from "graphql/error"

/*  Void resolver for GraphQL Tools  */
export default function ResolverVoid (options = {}) {
    let errors = []
    if (!Ducky.validate(options, "{ name: string, value?: any }", errors))
        throw new GraphQLError("[graphql-tools-types] " +
            `invalid parameters: ${errors.join("; ")}`, [])
    if (options.value === undefined)
        options.value = {}
    return {
        /*  serialize value sent as output to the client  */
        __serialize: (/* value */) => {
            return options.value
        },

        /*  parse value received as input from client  */
        __parseValue: (value) => {
            if (typeof value === "object")
                return options.value
            else
                throw new GraphQLError(`[graphql-tools-types] ${options.name}: ` +
                    "invalid Void input value (object expected)", [])
        },

        /*  parse value received as literal in AST  */
        __parseLiteral: (ast) => {
            if (ast.kind !== GraphQLLanguage.Kind.OBJECT)
                throw new GraphQLError(`[graphql-tools-types] ${options.name}: ` +
                    "invalid Void literal (object expected)", [ ast ])
            let value = options.value
            return value
        }
    }
}

