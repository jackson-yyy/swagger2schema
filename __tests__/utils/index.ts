import { GenerateResult } from "../../src"

const PetDef = {
  "id": {
    "oneOf": [
      {
        "type": "string",
        allOf: [
          {
            maxLength: 5,
          }, {
            minLength: 2,
          },
        ],
      },
      {
        type: "number",
        anyOf: [
          {
            multipleOf: 5,
          }, {
            multipleOf: 2,
          },
        ],
        not: {
          multipleOf: 3,
        },
      },
    ],
  },
  "category": {
    "type": "object",
    "properties": {
      "id": {
        "type": "integer",
        "format": "int64",
      },
      "name": {
        "type": "string",
      },
    },
    "xml": {
      "name": "Category",
    },
  },
  "name": {
    "type": "string",
    "example": "doggie",
  },
  "photoUrls": {
    "type": "array",
    "xml": {
      "name": "photoUrl",
      "wrapped": true,
    },
    "items": {
      "type": "string",
    },
  },
  "tags": {
    "type": "array",
    "xml": {
      "name": "tag",
      "wrapped": true,
    },
    "items": {
      "type": "object",
      "properties": {
        "id": {
          "type": "integer",
          "format": "int64",
        },
        "name": {
          "type": "string",
        },
      },
      "xml": {
        "name": "Tag",
      },
    },
  },
  "status": {
    "type": "string",
    "description": "pet status in the store",
    "enum": [
      "available",
      "pending",
      "sold",
    ],
  },
} as const

export function testResponse(result: GenerateResult[]): void {
  test('response schema', () => {
    const postRes = result.find(res => res.path === '/pet' && res.method === 'post')
    expect(postRes?.responseSchema).toEqual({
      "type": "array",
      "items": {
        "type": "object",
        "required": [
          "name",
          "photoUrls",
        ],
        "properties": PetDef,
        "xml": {
          "name": "Pet",
        },
      },
    })

  })

}

export function testRequest(result: GenerateResult[]): void {
  test('different request method params', () => {

    const postRes = result.find(res => res.path === '/pet' && res.method === 'post')
    const getRes = result.find(res => res.path === '/pet/findByStatus' && res.method === 'get')
    const putRes = result.find(res => res.path === '/pet' && res.method === 'put')

    // post
    expect(postRes?.requestSchema).toEqual({
      "type": "object",
      "required": [
        "name",
        "photoUrls",
      ],
      "properties": PetDef,
      "xml": {
        "name": "Pet",
      },
    })

    // get
    expect(getRes?.requestSchema).toEqual({
      type: 'object',
      properties: {
        status: {
          type: 'array',
          description: "Status values that need to be considered for filter",
          items: {
            "type": "string",
            "enum": [
              "available",
              "pending",
              "sold",
            ],
            "default": "available",
          },
        },
        name: {
          type: "string",
        },
      },
      required: ['status'],
    })

    // put
    expect(putRes?.requestSchema).toEqual({
      "type": "object",
      "required": [
        "name",
        "photoUrls",
      ],
      "properties": PetDef,
      "xml": {
        "name": "Pet",
      },
    })

  })

}


export function testTreeSchema (result: GenerateResult[]): void {
  test('different request method params', () => {

    const postRes = result.find(res => res.path === '/tree')

    const schema = {
      // definitions: {
      //   Tree: {
      //     type: 'object',
      //     properties: {
      //       id: {
      //         type: 'string',
      //       },
      //       name: {
      //         type: 'string',
      //       },
      //       children: {
      //         type: 'array',
      //         items: {
      //           $ref: "#/definitions/Tree",
      //         },
      //       },
      //     },
      //   },
      // },
      "type": "array",
      "items": {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          name: {
            type: 'string',
          },
          children: {
            type: 'array',
            items: {
              $ref: "#/definitions/Tree",
            },
          },
        },
      },
    }

    expect(postRes?.requestSchema).toEqual(schema)
    expect(postRes?.responseSchema).toEqual(schema)
  })

}
