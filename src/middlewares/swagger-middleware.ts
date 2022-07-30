import SwaggerUI from 'swagger-ui-express'
import YAML from 'yamljs'

const swaggerMiddleware = () => {
  const options = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Folk Soul API Specs',
  }

  const swaggerDocument = YAML.load('./src/config/swagger.yaml')
  return SwaggerUI.setup(swaggerDocument, options)
}

export default swaggerMiddleware
