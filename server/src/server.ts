import fastify from 'fastify'
import { env } from './env'
import { productRoutes } from './routes/products'

const app = fastify()

app.register(productRoutes)

app
  .listen({
    port: env.SERVER_PORT,
  })
  .then(function () {
    console.log(`Server running on port: ${env.SERVER_PORT}`)
  })
