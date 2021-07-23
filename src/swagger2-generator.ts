import { CommonGenerator, GenerateResult, RequestMethod } from "./common"
import Swagger2 from "../types/swagger2"
import { Schema } from "../types/schema"

export class Swagger2Generator extends CommonGenerator{

  swagger: Swagger2.Swagger = {
    paths: {},
    definitions: {},
  }
  paths: Record<string, Swagger2.SwaggerPath> = {}
  definitions: Record<string, Swagger2.SwaggerDefinition> = {}

  constructor (swagger: Swagger2.Swagger) {
    super()
    this.swagger = swagger
    this.paths = swagger.paths || {}
    this.definitions = swagger.definitions || {}
  }

  getDefinition (ref: string, refPath: string[] = []): Schema | null {
    if (ref.match(/#\/definitions\/(.*)/)) {
      if (refPath.includes(ref)) {
        return {
          $ref: ref,
        }
      }
      const def = this.definitions?.[RegExp.$1]
      return def ? this.schemaTransfer(def, [...refPath, ref]) : {}
    }
    return null
  }

  // TODO: support restful api
  parametersTransfer (params: Swagger2.SwaggerParameter[], method: RequestMethod): Schema | undefined {
    const methodInMap = {
      post: 'body',
      get: 'query',
      delete: 'path',
      put: 'body',
      patch: 'path',
    }

    if (method === 'get') {
      const querySchema: Required<Pick<Schema, 'type' | 'properties' | 'required'>> = {
        type: 'object',
        properties: {},
        required: [],
      }
      params.filter(param => param.in === 'query').forEach(param => {
        querySchema.properties[param.name] = {
          type: param.type,
          description: param.description,
          items: param.items,
          enum: param.enum,
          $ref: param.$ref,
        }
        param.required && querySchema.required.push(param.name)
      })
      return this.schemaTransfer(querySchema)
    }

    if (['post', 'put'].includes(method)) {
      const param = params.find(param => param.in === methodInMap[method])
      return param?.schema ? this.schemaTransfer(param.schema) : undefined
    }

  }

  responseTransfer (successResponse: Swagger2.SwaggerResponse): Schema | undefined {
    return successResponse.schema ? this.schemaTransfer(successResponse.schema) : undefined
  }

  generate (): GenerateResult[] {
    const res: GenerateResult[] = []

    Object.entries(this.paths)
      .filter(([path]) => this.filterPath(path))
      .forEach(([path, pathInfo]) => {
        this.requestMethods.filter(method => pathInfo[method])
          .forEach(method => {
            const pathOperation = pathInfo[method]!
            const parameters = pathOperation.parameters
            const successResponse = pathOperation.responses?.['200']

            res.push({
              path,
              tags: pathInfo[method]!.tags,
              method,
              operationId: pathInfo[method]!.operationId,
              requestSchema: parameters ? this.parametersTransfer(parameters, method) : undefined,
              responseSchema: successResponse ? this.responseTransfer(successResponse) : undefined,
            })
          })
      })

    return res
  }
}
