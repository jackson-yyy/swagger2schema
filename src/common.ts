import { Schema, SchemaWithoutReference } from "../types/schema";
import Swagger2 from "../types/swagger2";
import Swagger3 from "../types/swagger3";

type Swagger = Swagger2.Swagger | Swagger3.Swagger
export type RequestMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'

export interface GenerateResult {
    tags?: string[]
    path?: string
    method?: RequestMethod
    operationId?: string
    requestSchema?: SchemaWithoutReference
    responseSchema?: SchemaWithoutReference
}

export class CommonGenerator {

  requestMethods: RequestMethod[] = ['get', 'post', 'put', 'patch', 'delete']

  getDefinition (ref: string): SchemaWithoutReference | null {
    return null
  }

  schemaTransfer (schema: Schema): SchemaWithoutReference {
    if (schema.$ref) {
      return this.getDefinition(schema.$ref) || {}
    }
    if (schema.type === 'array' && schema.items) {
      schema.items = this.schemaTransfer(schema.items)
    }
    if(schema.type === 'object' && schema.properties) {
      let properties = schema.properties
      Object.keys(properties).forEach(propKey => {
        properties[propKey] = this.schemaTransfer(properties[propKey])
      })
    }
    return schema
  }

  filterPath (path: string) {
    return true
  }

  generate (swagger: Swagger): GenerateResult[] {
    return []
  }
}