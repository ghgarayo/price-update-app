import { FastifyInstance } from 'fastify'
import { knex } from '../db'

export async function productRoutes(app: FastifyInstance) {
  app.get(
    '/products',
    {
      preHandler: [],
    },
    async () => {
      const productList = await knex('products').select('*')
      return productList
    },
  )

  app.get(
    '/products/:id',
    {
      preHandler: [],
    },
    async (req) => {
      const product = await knex('products').select('*')
      const getProductParamsSchema = ''
    },
  )
}
