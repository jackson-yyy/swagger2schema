import { CommonGenerator, GenerateResult, RequestMethod } from "./common";
import Swagger2 from "../types/swagger2";
import { SchemaWithoutReference, Schema } from "../types/schema";

export class Swagger2Generator extends CommonGenerator{

  swagger: Swagger2.Swagger = {
    paths: {},
    definitions: {}
  }
  paths: Record<string, Swagger2.SwaggerPath> = {}
  definitions: Record<string, Swagger2.SwaggerDefinition> = {}

  constructor (swagger: Swagger2.Swagger) {
    super()
    this.swagger = swagger
    this.paths = swagger.paths
    this.definitions = swagger.definitions
  }

  getDefinition (ref: string) {
    if (ref.match(/#\/definitions\/(.*)/)) {
      let def = this.definitions?.[RegExp.$1]
      return def ? this.schemaTransfer(def) : {}
    }
    return null
  }

  // TODO: support restful api
  parametersTransfer (params: Swagger2.SwaggerParameter[], method: RequestMethod): SchemaWithoutReference | undefined {
    let methodInMap = {
      post: 'body',
      get: 'query',
      delete: 'path',
      put: 'path',
      patch: 'path',
    }

    if(method === 'get') {
      let querySchema: Required<Pick<Schema, 'type' | 'properties' | 'required'>> = {
        type: 'object',
        properties: {},
        required: []
      }
      params.filter(param => param.in === 'query').forEach(param => {
        querySchema.properties[param.name] = {
          type: param.type,
          description: param.description,
          items: param.items,
          enum: param.enum,
          $ref: param.$ref
        }
        param.required && querySchema.required.push(param.name)
      })
      return this.schemaTransfer(querySchema)
    }

    if(method === 'post') {
      let param = params.find(param => param.in === methodInMap[method])
      return param?.schema ? this.schemaTransfer(param.schema) : undefined
    }

  }

  responseTransfer (successResponse: Swagger2.SwaggerResponse): SchemaWithoutReference {
    return this.schemaTransfer(successResponse.schema)
  }

  generate () {
    let res: GenerateResult[] = []

    Object.entries(this.paths)
      .filter(([path]) => this.filterPath(path))
      .forEach(([path, pathInfo]) => {
        this.requestMethods.filter(method => pathInfo[method])
          .forEach(method => {
            let pathOperation = pathInfo[method]!
            let parameters = pathOperation.parameters
            let successResponse = pathOperation.responses?.['200']

            res.push({
              path,
              tags: pathInfo[method]!.tags,
              method,
              operationId: pathInfo[method]!.operationId,
              requestSchema: parameters ? this.parametersTransfer(parameters, method) : undefined,
              responseSchema: successResponse ? this.responseTransfer(successResponse) : undefined
            })
        })
      })
    
    return res
  }
}