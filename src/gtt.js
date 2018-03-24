/*
**  GraphQL-Tools-Types -- Custom Scalar Types for GraphQL-Tools
**  Copyright (c) 2016-2018 Ralf S. Engelschall <rse@engelschall.com>
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

/*  import the resolver functions  */
import ResolverVoid         from "./gtt-1-void"
import ResolverInt          from "./gtt-2-int"
import ResolverFloat        from "./gtt-3-float"
import ResolverString       from "./gtt-4-string"
import ResolverDate         from "./gtt-5-date"
import ResolverUUID         from "./gtt-6-uuid"
import ResolverJSON         from "./gtt-7-json"

/*  export the resolver functions  */
module.exports = {
    Void:   ResolverVoid,
    Int:    ResolverInt,
    Float:  ResolverFloat,
    String: ResolverString,
    Date:   ResolverDate,
    UUID:   ResolverUUID,
    JSON:   ResolverJSON
}

