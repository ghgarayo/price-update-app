'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function TabelaDePrecos() {
  interface Product {
    code: number
    name: string
    cost_price: number
    sales_price: number
  }

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('http://localhost:3344/products')
        setProducts(response.data)
        setLoading(false)
      } catch (error) {
        console.error('Erro ao buscar dados:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <p>Carregando...</p>
  }

  return (
    <div className="flex flex-col items-center justify-center pt-6 pb-20 text-dark-blue-700 w-[100vw]">
      <h1 className="text-4xl mb-4">Tabela de Preços</h1>
      <table>
        <thead>
          <tr>
            <th className="px-1.5">Código</th>
            <th className="px-1.5">Nome</th>
            <th className="px-1.5">Preço de Custo</th>
            <th className="px-1.5">Preço de Venda</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.code}>
              <td className="px-1.5">{product.code}</td>
              <td className="px-1.5">{product.name}</td>
              <td className="text-end px-1.5">
                R$ {product.cost_price.toFixed(2)}
              </td>
              <td className="text-end px-1.5">
                R$ {product.sales_price.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
