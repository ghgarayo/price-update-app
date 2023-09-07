'use client'
import React, { ChangeEvent, useState } from 'react';
import { Button } from './Button';

export default function FilePicker() {
  const [csvData, setCSVData] = useState<string[][]>([]);

  function onFileSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target;

    if (!files || !files[0]) {
      return;
    }

    const file = files[0];

    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');

    reader.onload = (e) => {
      if (!e || !e.target || typeof e.target.result !== 'string') {
        return;
      }

      const csvContent = e.target.result as string;
      const parsedCSVData = parseCSV(csvContent);
      setCSVData(parsedCSVData);
    };
  }

  const parseCSV = (csvContent: string) => {
    const lines = csvContent.split('\n');
    const data = [];
    for (let i = 0; i < lines.length; i++) {
      const row = lines[i].split(',');
      data.push(row);
    }
    return data;
  };

  return (
    <div className="flex flex-col items-center pt-6 text-dark-blue-800 w-screen mb-16 h-[60vh]">
      <input type="file" accept=".csv" onChange={onFileSelected} className="mt-4" />

      {csvData.length > 0 ? ( 
        <>
          <h1 className="text-4xl mt-16 mb-4">
            Tabela de Produtos e Novos Valores de Venda
          </h1>
          <table className="w-[50vw]">
            <thead>
              <tr>
                {csvData[0].map((header, index) => (
                  <th key={index} className="px-1.5">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {csvData.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-1.5 text-center">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <Button title="Cadastrar" className="p-auto p-4 rounded border-zinc-700 border hover:bg-zinc-700 text-zinc-700 hover:text-white"></Button>
        </>
      ) : (
        <p>Carregue um arquivo CSV para exibir os dados.</p>
      )}
    </div>
  );
}
