import { Schema } from "./schema"

export interface Swagger {
  paths: Record<string, SwaggerPath>
  components: SwaggerComponents
}

export interface SwaggerPath {
  description?: string
  summary?: string
  get?: SwaggerOperation
  post?: SwaggerOperation
  put?: SwaggerOperation
  patch?: SwaggerOperation
  delete?: SwaggerOperation
  // parameters?: SwaggerParameter[] | []
}

export interface SwaggerOperation {
  tags: string[]
  summary: string
  description: string
  operationId: string
  parameters: (SwaggerParameter | SwaggerReference)[]
  requestBody: SwaggerRequestBody | SwaggerReference
  response: Record<string|number, SwaggerResponse>
}

export interface SwaggerRequestBody {
  description: string
  required: boolean
  content: Record<string, {
    schema: Schema | SwaggerReference
  }>
}

export interface SwaggerParameter extends Partial<Schema> {
  name: string
  in: 'query' | 'path' | 'header' | 'cookie'
  description: string
  required: boolean
  schema?: Schema | SwaggerReference
}

export interface SwaggerResponse {
  description: string
  content: Record<string, {
    schema: Schema | SwaggerReference
  }>
}

export interface SwaggerComponents{
  schemas: Record<string, Schema>
  parameters: Record<string, SwaggerParameter>
  responses: Record<string, SwaggerResponse>
}


export interface SwaggerReference {
  schema: Schema
}
