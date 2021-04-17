import { Schema } from "./schema";

export interface Swagger {
  paths: Record<string, SwaggerPath>
  definitions: Record<string, SwaggerDefinition>
}

export interface SwaggerOperation {
  tags: string[]
  summary: string
  description: string
  operationId: string
  parameters: SwaggerParameter[]
  response: Record<string|number, SwaggerResponse>
}

export interface SwaggerParameter extends Partial<Schema> {
  name: string
  in: 'body' | 'query' | 'path' | 'header' | 'formData'
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
  schema: Schema
}

export interface SwaggerDefinition extends Schema{

}

