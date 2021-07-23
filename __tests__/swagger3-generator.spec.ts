import { Swagger3Generator } from '../src/index';
import { getSwagger } from './data/swagger3';
import { testRequest, testResponse, testTreeSchema } from './utils';

describe('swagger3-generator', () => {

  const generator = new Swagger3Generator(getSwagger())
  const result = generator.generate()


  testRequest(result)
  testResponse(result)
  testTreeSchema(result)
})
