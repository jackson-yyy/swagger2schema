import { Swagger2Generator } from '../src/index';
import { getSwagger } from './data/swagger2';
import { testRequest, testResponse } from './utils';

describe('swagger3-generator', () => {

  const generator = new Swagger2Generator(getSwagger())
  const result = generator.generate()


  testRequest(result)
  testResponse(result)
})
