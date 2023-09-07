/* eslint-disable camelcase */
import { FastifyRequest } from 'fastify'
import { knex } from '../db'

interface ProductData {
  product_code: string
  new_price: number
}

export async function checkProductAndPrice(request: FastifyRequest) {
  const dados = request.body as ProductData[]

  console.log(dados)

  if (dados.length === 0) {
    console.error('CSV data is empty. Please upload a CSV file first.')
  }

  dados.forEach((item) => {
    if (!item.new_price) {
      console.log(
        `Produto com código ${item.product_code}, não possui preço de venda!`,
      )
    }

    if (!item.product_code) {
      console.log('Existem produtos sem código, verifique o arquivo')
    }
  })

  // try {
  //   await Promise.all(
  //     dados.map(async ({ product_code, new_price }) => {
  //       if (!product_code || !new_price || isNaN(new_price)) {
  //         console.log(
  //           `Produto ${product_code} não possui todos os campos necessários ou contém um preço inválido! Verifique o arquivo.`,
  //         )
  //         return
  //       }

  //       const product = await knex('products')
  //         .where({ code: product_code })
  //         .first()

  //       if (product) {
  //         console.log(`Product with code ${product_code} exists.`)
  //       } else {
  //         console.log(`Product with code ${product_code} does not exist.`)
  //       }
  //     }),
  //   )

  //   console.log('All product checks completed.')
  // } catch (error) {
  //   console.error('Error checking products:', error)
  // } finally {
  //   knex.destroy()
  // }
}
