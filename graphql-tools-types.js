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

/*  external requirements  */
import UUID                 from "pure-uuid"
import * as GraphQL         from "graphql"
import * as GraphQLLanguage from "graphql/language"
import { GraphQLError }     from "graphql/error"

/*  Void resolver for GraphQL Tools  */
const ResolverVoid = (options = {}) => {
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
                    `invalid Void input value (object expected)`, [])
        },

        /*  parse value received as literal in AST  */
        __parseLiteral: (ast) => {
            if (ast.kind !== GraphQLLanguage.Kind.OBJECT)
                throw new GraphQLError(`[graphql-tools-types] ${options.name}: ` +
                    `invalid Void literal (object expected)`, [ ast ])
            let value = options.value
            return value
        }
    }
}

/*  Integer resolver for GraphQL Tools  */
const ResolverInt = (options = {}) => {
    const validate = (value, ast = null) => {
        if (options.min !== undefined && value < options.min)
            throw new GraphQLError(`[graphql-tools-types] ${options.name}: ` +
                `minimum value is ${options.min}`, ast !== null ? [ ast ] : [])
        if (options.max !== undefined && value > options.max)
            throw new GraphQLError(`[graphql-tools-types] ${options.name}: ` +
                `maximum value is ${options.max}`, ast !== null ? [ ast ] : [])
        if (options.fn !== undefined && !options.fn(value))
            throw new GraphQLError(`[graphql-tools-types] ${options.name}: ` +
                `value not valid`, ast !== null ? [ ast ] : [])
    }
    return {
        /*  serialize value sent as output to the client  */
        __serialize: (value) => {
            return value
        },

        /*  parse value received as input from client  */
        __parseValue: (value) => {
            if (typeof value === "string")
                value = parseInt(value, 10)
            else if (typeof value !== "number")
                throw new GraphQLError(`[graphql-tools-types] ${options.name}: ` +
                    `invalid input value (type "number" expected)`, [])
            validate(value)
            return value
        },

        /*  parse value received as literal in AST  */
        __parseLiteral: (ast) => {
            if (ast.kind !== GraphQLLanguage.Kind.INT)
                throw new GraphQLError(`[graphql-tools-types] ${options.name}: ` +
                    `invalid AST node (kind "INT" expected)`, [ ast ])
            let value = GraphQL.GraphQLInt.parseLiteral(ast)
            validate(value, ast)
            return value
        }
    }
}

/*  Float resolver for GraphQL Tools  */
const ResolverFloat = (options = {}) => {
    const validate = (value, ast) => {
        if (options.min !== undefined && value < options.min)
            throw new GraphQLError(`[graphql-tools-types] ${options.name}: ` +
                `minimum value is ${options.min}`, ast !== null ? [ ast ] : [])
        if (options.max !== undefined && value > options.max)
            throw new GraphQLError(`[graphql-tools-types] ${options.name}: ` +
                `maximum value is ${options.max}`, ast !== null ? [ ast ] : [])
        if (options.fn !== undefined && !options.fn(value))
            throw new GraphQLError(`[graphql-tools-types] ${options.name}: ` +
                `value not valid`, ast !== null ? [ ast ] : [])
    }
    return {
        /*  serialize value sent as output to the client  */
        __serialize: (value) => {
            return value
        },

        /*  parse value received as input from client  */
        __parseValue: (value) => {
            if (typeof value === "string")
                value = parseFloat(value)
            else if (typeof value !== "number")
                throw new GraphQLError(`[graphql-tools-types] ${options.name}: ` +
                    `invalid input value (type "number" expected)`, [])
            validate(value)
            return value
        },

        /*  parse value received as literal in AST  */
        __parseLiteral: (ast) => {
            if (ast.kind !== GraphQLLanguage.Kind.FLOAT)
                throw new GraphQLError(`[graphql-tools-types] ${options.name}: ` +
                    `invalid AST node (kind "FLOAT" expected)`, [ ast ])
            let value = GraphQL.GraphQLFloat.parseLiteral(ast)
            validate(value, ast)
            return value
        }
    }
}

/*  String resolver for GraphQL Tools  */
const ResolverString = (options = {}) => {
    const validate = (value, ast = null) => {
        if (options.min !== undefined && value.length < options.min)
            throw new GraphQLError(`[graphql-tools-types] ${options.name}: ` +
                `minimum length is ${options.min}`, ast !== null ? [ ast ] : [])
        if (options.max !== undefined && value.length > options.max)
            throw new GraphQLError(`[graphql-tools-types] ${options.name}: ` +
                `maximum length is ${options.max}`, ast !== null ? [ ast ] : [])
        if (options.regex !== undefined && !options.regex.test(value))
            throw new GraphQLError(`[graphql-tools-types] ${options.name}: ` +
                `value does not match ${options.regex}`, ast !== null ? [ ast ] : [])
        if (options.fn !== undefined && !options.fn(value))
            throw new GraphQLError(`[graphql-tools-types] ${options.name}: ` +
                `value not valid`, ast !== null ? [ ast ] : [])
    }
    return {
        /*  serialize value sent as output to the client  */
        __serialize: (value) => {
            return value
        },

        /*  parse value received as input from client  */
        __parseValue: (value) => {
            if (typeof value !== "string")
                throw new GraphQLError(`[graphql-tools-types] ${options.name}: ` +
                    `invalid input value (type "string" expected)`, [])
            validate(value)
            return value
        },

        /*  parse value received as literal in AST  */
        __parseLiteral: (ast) => {
            if (ast.kind !== GraphQLLanguage.Kind.STRING)
                throw new GraphQLError(`[graphql-tools-types] ${options.name}: ` +
                    `invalid AST node (kind "STRING" expected)`, [ ast ])
            let value = GraphQL.GraphQLString.parseLiteral(ast)
            validate(value, ast)
            return value
        }
    }
}

/*  Date resolver for GraphQL Tools  */
const ResolverDate = (options = {}) => {
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
                `value not valid`, ast !== null ? [ ast ] : [])
    }
    return {
        /*  serialize value sent as output to the client  */
        __serialize: (value) => {
            return value.toISOString()
        },

        /*  parse value received as input from client  */
        __parseValue: (value) => {
            if (typeof value === "string") {
                let value = new Date(value)
                if (isNaN(value.getTime()))
                    throw new GraphQLError(`[graphql-tools-types] ${options.name}: ` +
                        `invalid Date input value`, [])
                validate(value)
                return value
            }
            else if (typeof value === "object" && value instanceof Date)
                return value
            else
                throw new GraphQLError(`[graphql-tools-types] ${options.name}: ` +
                    `invalid Date input value (string or Date expected)`, [])
        },

        /*  parse value received as literal in AST  */
        __parseLiteral: (ast) => {
            if (ast.kind !== GraphQLLanguage.Kind.STRING)
                throw new GraphQLError(`[graphql-tools-types] ${options.name}: ` +
                    `invalid Date literal (string expected)`, [ ast ])
            let value = GraphQL.GraphQLString.parseLiteral(ast)
            value = new Date(value)
            if (isNaN(value.getTime()))
                throw new GraphQLError(`[graphql-tools-types] ${options.name}: ` +
                    `invalid Date input value`, [])
            validate(value, ast)
            return value
        }
    }
}

/*  UUID resolver for GraphQL Tools  */
const ResolverUUID = (options = {}) => {
    if (options.storage === undefined)
        options.storage = "binary"
    const validate = (value, ast = null) => {
        if (options.fn !== undefined && !options.fn(value))
            throw new GraphQLError(`[graphql-tools-types] ${options.name}: ` +
                `value not valid`, ast !== null ? [ ast ] : [])
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
                    `invalid UUID input value (string expected)`, [])
            try {
                value = new UUID(value)
            }
            catch (ex) {
                throw new GraphQLError(`[graphql-tools-types] ${options.name}: ` +
                    `invalid UUID string representation`, [])
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
                    `invalid UUID literal (string expected)`, [ ast ])
            let value = GraphQL.GraphQLString.parseLiteral(ast)
            try {
                value = new UUID(value)
            }
            catch (ex) {
                throw new GraphQLError(`[graphql-tools-types] ${options.name}: ` +
                    `invalid UUID string representation`, [ ast ])
            }
            if (options.storage === "string")
                value = value.format()
            validate(value, ast)
            return value
        }
    }
}

/*  JSON resolver for GraphQL Tools  */
const ResolverJSON = (options = {}) => {
    return {
        /*  serialize value sent as output to the client  */
        __serialize: (value) => {
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
                        case GraphQLLanguage.Kind.ENUM:
                            return String(ast.value)
                        case GraphQLLanguage.Kind.LIST:
                            return ast.values.map((astItem) => {
                                return parseJSONLiteral(astItem) /* RECURSION */
                            })
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
                throw new GraphQLError(`[graphql-tools-types] ${options.name}: ` +
                    `error parsing JSON: ${ex.toString()}`, [ ast ])
            }
            return result
        }
    }
}

/*  export the methods  */
module.exports = {
    ResolverVoid:   ResolverVoid,
    ResolverInt:    ResolverInt,
    ResolverFloat:  ResolverFloat,
    ResolverString: ResolverString,
    ResolverDate:   ResolverDate,
    ResolverUUID:   ResolverUUID,
    ResolverJSON:   ResolverJSON
}

