import { Swagger2Generator } from '../src/index';
import { getSwagger } from './data/swagger2';
import { testRequest, testResponse } from './utils';

describe('swagger3-generator', () => {

  let generator = new Swagger2Generator(getSwagger())
  let result = generator.generate()


  testRequest(result)
  testResponse(result)
})
