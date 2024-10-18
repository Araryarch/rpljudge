'use client'

import { useState } from 'react'
import CodeEditor from './components/Editor'

export default function Home() {
  const [output, setOutput] = useState<string>('')

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
            source_code: btoa(code),
            stdin: ''
          })
        }
      )

      const result = await response.json()

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
    <div className='min-h-screen p-8 bg-mocha-base flex'>
      {/* Soal Section */}
      <div className='w-1/2 p-6 bg-mocha-mantle rounded-lg shadow-md border border-mocha-overlay0'>
        <h2 className='text-2xl font-bold text-mocha-text mb-4'>Soal:</h2>
        <p className='text-mocha-subtext0 mb-2'>
          Buatlah program sederhana yang mencetak "Hello, World!" ke layar.
        </p>
        <p className='text-mocha-subtext0'>
          Contoh output:
          <span className='font-semibold text-mocha-text'> Hello, World!</span>
        </p>
      </div>

      {/* Code Editor Section */}
      <div className='w-1/2 ml-4'>
        <div className='max-w-4xl mx-auto bg-mocha-mantle p-6 rounded-lg shadow-md border border-mocha-overlay0'>
          <h1 className='text-2xl font-bold text-mocha-text mb-4'>
            Code Editor
          </h1>
          <p className='text-mocha-subtext0 mb-6'>
            Tulis dan jalankan kode Anda di bawah ini:
          </p>

          <CodeEditor onSubmit={handleSubmit} />

          <div className='mt-6 bg-mocha-surface1 p-4 rounded-lg'>
            <h3 className='text-lg font-semibold text-mocha-text'>Output:</h3>
            <pre className='mt-2 p-2 bg-mocha-overlay1 rounded-md'>
              {output || 'No output yet.'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
