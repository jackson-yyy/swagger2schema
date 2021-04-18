export type SchemaType = 'integer' | 'string' | 'array' | 'number' | 'boolean' | 'object'

export interface Schema {
  description?: string
  enum?: string[]
  type?: SchemaType
  additionalProperties?: Record<string, Schema>
  properties?: Record<string, Schema>
  items?: Schema
  $ref?: string
  required?: string[];
}

export interface SchemaWithoutReference extends Omit<Schema, '$ref'> {
  additionalProperties?: Record<string,SchemaWithoutReference>
  properties?: Record<string,SchemaWithoutReference>
  items?: SchemaWithoutReference
}