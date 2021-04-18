import { Schema } from "./schema"

namespace Swagger3 {
  export interface Swagger {
    paths?: Record<string, SwaggerPath>
    components?: SwaggerComponents
  }

  export interface SwaggerPath {
    description?: string
    summary?: string
    get?: SwaggerPathOperation
    post?: SwaggerPathOperation
    put?: SwaggerPathOperation
    patch?: SwaggerPathOperation
    delete?: SwaggerPathOperation
    // parameters?: SwaggerParameter[]
  }

  export interface SwaggerPathOperation {
    tags?: string[]
    summary?: string
    description?: string
    operationId?: string
    parameters?: SwaggerParameter[]
    requestBody?: SwaggerRequestBody
    response?: Record<string | number, SwaggerResponse>
  }

  export interface SwaggerRequestBody {
    description: string
    required: boolean
    content: Record<string, SwaggerRequestBodyContent>
  }

  export interface SwaggerRequestBodyContent {
    schema?: Schema
  }

  export interface SwaggerParameter extends Partial<Omit<Schema, 'required'>> {
    name: string
    in: 'query' | 'path' | 'header' | 'cookie'
    description: string
    required: boolean
    schema?: Schema
  }

  export interface SwaggerResponse {
    description: string
    content: Record<string, SwaggerResponseContent>
  }

  export interface SwaggerResponseContent {
    schema?: Schema
  }

  export interface SwaggerComponents {
    schemas?: Record<string, Schema>
    parameters?: Record<string, Schema>
    responses?: Record<string, Schema>
  }

}

export default Swagger3