/* eslint-disable camelcase */
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { knex } from '../db'

export async function productRoutes(app: FastifyInstance) {
  interface ProductData {
    product_code: string
    new_price: number
  }

  app.get('/products', async () => {
    const productList = await knex('products').select('*')
    return productList
  })

  app.put(
    '/validate-products',
    async (req: FastifyRequest, res: FastifyReply) => {
      const dados = req.body as ProductData[]
      const errors: { [key: string]: string } = {}

      await Promise.all(
        dados.map(async ({ product_code, new_price }) => {
          const validationError = await validateProduct(product_code, new_price)
          if (validationError) {
            errors[product_code] = validationError
          }
        }),
      )
      res.status(200).send({ errors })
    },
  )

  async function validateProduct(
    productCode: string,
    productNewPrice: number,
  ): Promise<string | undefined> {
    if (
      !productCode ||
      productCode === '' ||
      !productNewPrice ||
      isNaN(productNewPrice) ||
      productNewPrice === -1
    ) {
      return 'Produto não possui todos os campos necessários e/ou campos inválidos'
    }

    const product = await knex('products').where({ code: productCode }).first()

    if (!product) {
      return 'Produto não encontrado'
    }

    if (product.cost_price > productNewPrice) {
      return 'Novo valor de venda é inferior ao preço de custo'
    }

    const maximumPriceAllowed = parseFloat(
      (product.sales_price * 1.1).toFixed(2),
    )
    const priceComparison = maximumPriceAllowed === productNewPrice

    if (!priceComparison) {
      return 'Novo valor de venda sofrerá um aumento diferente de 10%'
    }
  }
}
