import { Swagger3Generator } from '../src/index';
import { getSwagger } from './data/swagger3';
import { testRequest, testResponse } from './utils';

describe('swagger3-generator', () => {

  let generator = new Swagger3Generator(getSwagger())
  let result = generator.generate()


  testRequest(result)
  testResponse(result)
})
