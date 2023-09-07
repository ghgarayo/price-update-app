import { FastifyInstance } from 'fastify'
import { knex } from '../db'
import { checkProductAndPrice } from '../middlewares/check-product-and-price'

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

  app.put(
    '/products',
    {
      preHandler: [],
    },
    async (req, res) => {
      const dados = req.body
      console.log(dados)
    },
  )
}
