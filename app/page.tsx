'use client'

import { useState } from 'react'
import CodeEditor from './components/Editor'

export default function Home() {
  const [output, setOutput] = useState<string>('') // State untuk menyimpan hasil output dari eksekusi kode

  const handleSubmit = async (code: string, languageId: number) => {
    console.log('Kode yang akan dijalankan:', code)
    console.log('Bahasa ID:', languageId)

    try {
      const response = await fetch(
        'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Key':
              '184ca37c37mshfa094fe16462b0fp180bb8jsn71d98c747e6d',
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
          },
          body: JSON.stringify({
            language_id: languageId,
            source_code: btoa(code), // Mengonversi source code ke base64
            stdin: ''
          })
        }
      )

      const result = await response.json()

      // Mendekode output dari base64
      const decodedOutput = result.stdout
        ? atob(result.stdout)
        : result.stderr
        ? atob(result.stderr)
        : 'No output'

      setOutput(decodedOutput)
    } catch (error) {
      setOutput('Error executing the code')
    }
  }

  return (
    <div className='min-h-screen p-8 bg-gray-100'>
      <div className='max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md'>
        <h1 className='text-2xl font-bold text-gray-800 mb-4'>
          Welcome to the Code Editor!
        </h1>
        <p className='text-gray-700 mb-6'>
          Use the editor below to write and run your code in various programming
          languages.
        </p>

        <CodeEditor onSubmit={handleSubmit} />

        <div className='mt-6 bg-gray-50 p-4 rounded-lg'>
          <h3 className='text-lg font-semibold text-gray-800'>Output:</h3>
          <pre className='mt-2 p-2 bg-gray-200 rounded-md'>
            {output || 'No output yet.'}
          </pre>
        </div>
      </div>
    </div>
  )
}
