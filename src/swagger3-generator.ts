import { CommonGenerator, GenerateResult } from "./common"
import Swagger3 from "../types/swagger3"
import { Schema } from "../types/schema"

export class Swagger3Generator extends CommonGenerator{
  swagger: Swagger3.Swagger = {
    paths: {},
    components: {},
  }
  paths: Record<string, Swagger3.SwaggerPath> = {}
  components: Swagger3.SwaggerComponents = {}

  constructor (swagger: Swagger3.Swagger) {
    super()
    this.swagger = swagger
    this.paths = swagger.paths || {}
    this.components = swagger.components || {}
  }

  getDefinition (ref: string, refPath: string[] = []): Schema | null {
    if (ref.match(/#\/components\/(.*)\/(.*)/)) {
      if (refPath.includes(ref)) {
        return {
          $ref: `#/definitions/${RegExp.$2}`,
        }
      }
      const defType = RegExp.$1 as keyof Swagger3.SwaggerComponents
      const def = this.components?.[defType]?.[RegExp.$2]
      return def ? this.schemaTransfer(def, [...refPath, ref]) : {}
    }
    return null
  }

  parametersTransfer (params: Swagger3.SwaggerParameter[]): Schema | undefined {

    const querySchema: Required<Pick<Schema, 'type' | 'properties' | 'required'>> = {
      type: 'object',
      properties: {},
      required: [],
    }
    params.filter(param => param.in === 'query' && param.schema).forEach(param => {
      querySchema.properties[param.name] = {
        ...param.schema!,
        description: param.description,
      }
      param.required && querySchema.required.push(param.name)
    })
    return this.schemaTransfer(querySchema)
  }

  requestBodyTransfer (requestBody: Swagger3.SwaggerRequestBody): Schema | undefined {
    const schema = requestBody.content?.['application/json']?.schema
    return schema ? this.schemaTransfer(schema) : undefined
  }

  responseTransfer (successResponse: Swagger3.SwaggerResponseContent): Schema | undefined {
    return successResponse.schema ? this.schemaTransfer(successResponse.schema): undefined
  }

  generate (): GenerateResult[] {
    const res: GenerateResult[] = []

    Object.entries(this.paths)
      .filter(([path]) => this.filterPath(path))
      .forEach(([path, pathInfo]) => {
        this.requestMethods.filter(method => pathInfo[method])
          .forEach(method => {
            const pathOperation = pathInfo[method]!
            const successResponse = pathOperation.responses?.['200']?.content?.['application/json']

            let requestSchema: Schema | undefined = undefined

            if (pathOperation.parameters && method === 'get') {
              requestSchema = this.parametersTransfer(pathOperation.parameters)
            }

            if (pathOperation.requestBody && ['post', 'put'].includes(method)) {
              requestSchema = this.requestBodyTransfer(pathOperation.requestBody)
            }
            const responseSchema = successResponse ? this.responseTransfer(successResponse) : undefined

            res.push({
              path,
              tags: pathInfo[method]!.tags,
              method,
              operationId: pathInfo[method]!.operationId,
              requestSchema,
              responseSchema,
            })
          })
      })

    return res
  }
}
