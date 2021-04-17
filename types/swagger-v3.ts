import { Schema } from "./schema";

export interface Swagger {
  paths: Record<string, SwaggerPath>
  components: SwaggerComponents
}

export interface SwaggerOperation {
  tags: string[]
  summary: string
  description: string
  operationId: string
  parameters: SwaggerParameter[]
  requestBody: SwaggerRequestBody
  response: Record<string|number, SwaggerResponse>
}

export interface SwaggerRequestBody {
  description: string
  required: boolean
  content: Record<string, {
    schema: Schema
  }>
}

export interface SwaggerParameter extends Partial<Schema> {
  name: string
  in: 'query' | 'path' | 'header' | 'cookie'
  description: string
  required: boolean
  schema?: Schema
}

export interface SwaggerPath {
  get?: SwaggerOperation;
  post?: SwaggerOperation;
  put?: SwaggerOperation;
  patch?: SwaggerOperation;
  delete?: SwaggerOperation;
  // parameters?: SwaggerParameter[] | [];
}

export interface SwaggerResponse {
  description: string
  content: Record<string, {
    schema: Schema
  }>
}

export interface SwaggerComponents{
  schemas: Record<string, Schema>
  parameters: Record<string, SwaggerParameter>
  responses: Record<string, SwaggerResponse>
}

