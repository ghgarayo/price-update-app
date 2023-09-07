import fastify from 'fastify'
import { env } from './env'
import { productRoutes } from './routes/products'
import { showMethodAndRoute } from './middlewares/show-method-and-route'
import cors from '@fastify/cors'

const app = fastify()

app.register(cors, {
  origin: true, // todas as URLs poderão acessar o backend
})

app.addHook('preHandler', showMethodAndRoute)

app.register(productRoutes)

app
  .listen({
    port: env.SERVER_PORT,
  })
  .then(function () {
    console.log(`Server running on port: ${env.SERVER_PORT}`)
  })
