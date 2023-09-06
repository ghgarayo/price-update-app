import fastify from 'fastify'
import { knex } from './db'

const app = fastify()

app.get('/hello', async () => {
  const test = await knex('products').select('*')
  return test
})

app
  .listen({
    port: 3333,
  })
  .then(function () {
    console.log(`Server running`)
  })
