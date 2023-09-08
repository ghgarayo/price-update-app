'use client'
import React, { ChangeEvent, useState } from 'react'
import axios from 'axios'
import { Button } from './Button'

interface csvData {
  product_code: string
  new_price: number
}

export default function FilePicker() {
  const [csvData, setCSVData] = useState<csvData[]>([])
  const [serverResponse, setServerResponse] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string
  }>({})

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

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',')

      if (row.length >= 2) {
        const productCode = row[0]
        const newPrice = row[1]

        data.push({
          product_code: productCode,
          new_price: parseFloat(newPrice),
        })
      }
    }

    return data
  }

  const validateCSV = () => {
    if (csvData.length > 0) {
      const jsonData = JSON.stringify(csvData)

      axios
        .put('http://localhost:3344/validate-products', jsonData, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          console.log(response.data.errors)

          if (response.status === 200 && response.data.errors) {
            console.log('entrou if')
            setServerResponse('Erro de Validação. Verifique os dados.')
            setValidationErrors(response.data.errors)
          } else if (response.status === 200) {
            console.log('entrou elif')
            setServerResponse('Arquivo Enviado com Sucesso!')
            setValidationErrors({})
          } else {
            console.log('entrou else')
            setServerResponse(response.data)
          }
        })
        .catch((error) => {
          console.error('Error sending data:', error)
          setServerResponse('Erro ao enviar os dados para o servidor.')
        })
    } else {
      setServerResponse('CSV está vazio, verifique e faça o upload novamente!')
      setValidationErrors({})
    }
  }

  const applyChangesToPrices = () => {}

  return (
    <div className="flex flex-col items-center pt-3 text-dark-blue-800 w-screen mb-16">
      <input
        type="file"
        accept=".csv"
        onChange={onFileSelected}
        className="mt-4"
      />

      {csvData.length > 0 ? (
        <>
          <h1 className="text-4xl mt-8 mb-4">
            Tabela de Produtos e Novos Valores de Venda
          </h1>
          <table className="w-[50vw] mb-16">
            <thead>
              <tr>
                <th className="px-1.5">Código do Produto</th>
                <th className="px-1.5">Novo Preço</th>
              </tr>
            </thead>
            <tbody>
              {csvData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <td className="px-1.5 text-center">
                    {!row.product_code
                      ? 'Valor Inválido, verifique o arquivo .csv'
                      : row.product_code}
                  </td>
                  <td className="px-1.5 text-center">
                    {!row.new_price
                      ? 'Valor Inválido, verifique o arquivo .csv'
                      : `R$ ${row.new_price.toFixed(2)}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Button
            title="Validar"
            className="p-auto p-4 rounded border-zinc-700 border hover:bg-zinc-700 text-zinc-700 hover:text-white"
            onClick={validateCSV}
          ></Button>
        </>
      ) : (
        <p>Carregue um arquivo CSV para exibir os dados.</p>
      )}

      {serverResponse && (
        <div className="flex flex-col my-8 items-center justify-center">
          <p className="text-center text-2xl uppercase text-dark-blue-700 my-4">
            Validação:
          </p>

          {Object.keys(validationErrors).length > 0 && (
            <ul className="mb-8">
              {Object.entries(validationErrors).map(([productCode, error]) => (
                <li key={productCode}>{`Produto ${productCode}: ${error}`}</li>
              ))}
            </ul>
          )}
          {Object.keys(validationErrors).length === 0 && (
            <>
              <p className="text-center text-lg text-dark-blue-700 mb-4">
                Todos os produtos foram validados com sucesso! Deseja salvar os
                novos valores?
              </p>
              <Button
                title="Finalizar"
                className="m-auto p-4 rounded border-zinc-700 border hover:bg-zinc-700 text-zinc-700 hover:text-white"
                onClick={applyChangesToPrices}
              ></Button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
