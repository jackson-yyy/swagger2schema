import { Swagger2Generator } from '../src/index';
import { getSwagger } from './data/swagger2';
import { testRequest, testResponse, testTreeSchema } from './utils';

describe('swagger2-generator', () => {

  const generator = new Swagger2Generator(getSwagger())
  const result = generator.generate()

  testRequest(result)
  testResponse(result)
  testTreeSchema(result)
})
