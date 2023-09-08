/* eslint-disable camelcase */
import {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
  FastifyRequest,
} from 'fastify'
import { knex } from '../db'

export async function productRoutes(app: FastifyInstance) {
  interface Product {
    code: number
    name: string
    cost_price: number
    sales_price: number
  }

  interface ProductDataFromCSV {
    product_code: string
    new_price: number
  }

  interface Pack {
    id: number
    pack_id: number
    product_id: number
    qty: number
  }

  // Rota para listar produtos
  app.get('/products', async () => {
    const productList = await knex('products').select('*')
    return productList
  })

  // Rota para buscar um produto por id
  app.get(
    '/products/:id',
    async (
      req: FastifyRequest<{ Params: { id: string } }>,
      res: FastifyReply,
    ) => {
      const productId = req.params.id

      try {
        const product = await knex('products')
          .where({ code: productId })
          .first()

        if (product) {
          res.status(200).send(product)
        } else {
          res.status(404).send({ message: 'Produto não encontrado' })
        }
      } catch (error) {
        res.status(500).send({
          message: 'Erro ao buscar o produto',
          error: (error as Error).message,
        })
      }
    },
  )

  // Rota para atualizar produtos
  app.put('/products', async (req: FastifyRequest, res: FastifyReply) => {
    const dados = req.body as ProductDataFromCSV[]

    const trx = await knex.transaction() // Inicie uma transação do Knex

    try {
      await Promise.all(
        dados.map(async ({ product_code, new_price }) => {
          const product = await knex('products')
            .where({ code: product_code })
            .first()

          if (!product) {
            throw new Error('Produto não encontrado')
          }

          // Atualize o preço de venda do produto
          await knex('products')
            .transacting(trx)
            .where({ code: product_code })
            .update({
              sales_price: new_price,
            })

          const pack = await knex('packs')
            .where({
              product_id: product_code,
            })
            .first()

          if (pack) {
            // Se houver um pacote, atualize o preço do pacote
            const packToUpdate = await knex('products')
              .where({
                code: pack.pack_id,
              })
              .first()

            // Atualize o preço de venda do pacote
            await knex('products')
              .transacting(trx)
              .where({ code: packToUpdate.code })
              .update({
                sales_price: pack.qty * new_price,
              })
          }
        }),
      )

      await trx.commit() // Commit da transação se tudo ocorrer bem
      res.status(200).send({ message: 'Preços atualizados com sucesso' })
    } catch (error) {
      await trx.rollback() // Rollback da transação em caso de erro
      res.status(500).send({
        message: 'Erro ao atualizar preços',
        error: (error as Error).message,
      })
    }
  })

  // Rota para validar produtos sem atualizar
  app.post(
    '/validate-products',
    async (req: FastifyRequest, res: FastifyReply) => {
      const dados = req.body as ProductDataFromCSV[]
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
