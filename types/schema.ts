export type SchemaType = 'integer' | 'string' | 'array' | 'number' | 'boolean' | 'object'

export interface Schema {
  enum?: string[];
  type: SchemaType;
  additionalProperties?: Schema;
  properties: Schema;
  items?: {
    type?: SchemaType;
    $ref?: string;
  };
  $ref?: string;
}