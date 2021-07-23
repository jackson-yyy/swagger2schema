import { Schema } from "../types/schema";
import Swagger2 from "../types/swagger2";
import Swagger3 from "../types/swagger3";

type Swagger = Swagger2.Swagger | Swagger3.Swagger
export type RequestMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'

export interface GenerateResult {
    tags?: string[]
    path?: string
    method?: RequestMethod
    operationId?: string
    requestSchema?: Schema
    responseSchema?: Schema
}

export class CommonGenerator {

  requestMethods: RequestMethod[] = ['get', 'post', 'put', 'patch', 'delete']

  rootDefinitions: Record<string, Schema> = {}

  getDefinition (_ref: string, _refPath: string[] = []): Schema | null {
    return null
  }

  schemaTransfer (schema: Schema, refPath: string[] = []): Schema {

    const schemaCopy = { ...schema }

    // 有ref直接去definition拿
    if (schemaCopy.$ref) {
      return this.getDefinition(schemaCopy.$ref, refPath) || {}
    }

    // 处理oneOf, allOf, anyOf， not
    (['oneOf', 'allOf', 'anyOf'] as const).forEach(key => {
      if (schemaCopy[key]) {
        schemaCopy[key] = schemaCopy[key]!.map(schema => this.schemaTransfer(schema, refPath))
      }
    })
    if (schemaCopy.not) {
      schemaCopy.not = this.schemaTransfer(schemaCopy.not, refPath)
    }

    // array类型
    if (schemaCopy.type === 'array' && schemaCopy.items) {
      schemaCopy.items = this.schemaTransfer(schemaCopy.items, refPath)
    }

    // object类型
    if(schema.type === 'object' && schema.properties) {
      const properties = { ...schemaCopy.properties }
      Object.keys(properties).forEach(propKey => {
        properties[propKey] = this.schemaTransfer(properties[propKey], refPath)
      })
      schemaCopy.properties = properties
    }
    return schemaCopy
  }

  filterPath (_path: string): boolean {
    return true
  }

  generate (_swagger: Swagger): GenerateResult[] {
    return []
  }
}
