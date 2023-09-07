'use client'
import React, { ChangeEvent, useState } from 'react'
import { Button } from './Button'
import axios from 'axios'

interface csvData {
  product_code: string
  new_price: number
}

export default function FilePicker() {
  const [csvData, setCSVData] = useState<csvData[]>([])
  function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target

    if (!files || !files[0]) {
      return
    }

    const file = files[0]

    const reader = new FileReader()
    reader.readAsText(file, 'UTF-8')

    reader.onload = (e) => {
      if (!e || !e.target || typeof e.target.result !== 'string') {
        return
      }

      const csvContent = e.target.result as string
      const parsedCSVData = parseCSV(csvContent)
      setCSVData(parsedCSVData)
    }
  }

  const parseCSV = (csvContent: string) => {
    const lines = csvContent.split('\n')
    const data = []

    for (let i = 0; i < lines.length; i++) {
      const row = lines[i].split(',')

      // Assuming the first column is product_code and the second is new_price
      if (row.length >= 2) {
        const productCode = row[0].trim()
        const newPrice = parseFloat(row[1].trim())

        if (!isNaN(newPrice)) {
          data.push({ product_code: productCode, new_price: newPrice })
        }
      }
    }

    return data
  }

  const sendDataToServer = () => {
    if (csvData.length > 0) {
      const jsonData = JSON.stringify(csvData)

      axios
        .put('http://localhost:3344/products', jsonData, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          if (response.status === 200) {
            console.log('Arquivo Enviado com sucesso!')
          } else {
            console.error('Erro ao se comunicar com o servidor!')
          }
        })
        .catch((error) => {
          console.error('Error sending data:', error)
        })
    } else {
      console.error('CSV está vazio, verifique e faça o upload novamente!')
    }
  }

  return (
    <div className="flex flex-col items-center pt-6 text-dark-blue-800 w-screen mb-16 h-[60vh]">
      <input
        type="file"
        accept=".csv"
        onChange={onFileSelected}
        className="mt-4"
      />

      {csvData.length > 0 ? (
        <>
          <h1 className="text-4xl mt-16 mb-4">
            Tabela de Produtos e Novos Valores de Venda
          </h1>
          <table className="w-[50vw]">
            <thead>
              <tr>
                <th className="px-1.5">Código do Produto</th>
                <th className="px-1.5">Novo Preço</th>
              </tr>
            </thead>
            <tbody>
              {csvData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="px-1.5 text-center">{row.product_code}</td>
                  <td className="px-1.5 text-center">
                    R$ {row.new_price.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Button
            title="Validar"
            className="p-auto p-4 rounded border-zinc-700 border hover:bg-zinc-700 text-zinc-700 hover:text-white"
            onClick={sendDataToServer}
          ></Button>
        </>
      ) : (
        <p>Carregue um arquivo CSV para exibir os dados.</p>
      )}
    </div>
  )
}
