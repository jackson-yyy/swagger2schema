import { Schema } from "./schema";


namespace Swagger2 {
  export interface Swagger {
    paths: Record<string, SwaggerPath>
    definitions: Record<string, SwaggerDefinition>
  }

   export interface SwaggerPath {
    get?: SwaggerPathOperation;
    post?: SwaggerPathOperation;
    put?: SwaggerPathOperation;
    patch?: SwaggerPathOperation;
    delete?: SwaggerPathOperation;
    // parameters?: SwaggerParameter[];
  }

  export interface SwaggerPathOperation {
    tags?: string[]
    summary?: string
    description?: string
    operationId?: string
    parameters?: SwaggerParameter[]
    responses?: Record<string | number, SwaggerResponse>
  }

  export interface SwaggerParameter extends Partial<Omit<Schema, 'required'>> {
    name: string
    in: 'body' | 'query' | 'path' | 'header' | 'formData'
    description: string
    required: boolean
    schema?: Schema
  }

  export interface SwaggerResponse {
    description: string
    schema: Schema
  }

  export interface SwaggerDefinition extends Schema {

  }
}

export default Swagger2