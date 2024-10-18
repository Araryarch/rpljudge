'use client'

import { useState } from 'react'
import CodeEditor from './components/Editor'

export default function Home() {
  const [output, setOutput] = useState<string>('')

  const fetchSubmission = async (code: string, languageId: number) => {
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
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    return await response.json()
  }

  const handleSubmit = async (code: string, languageId: number) => {
    console.log('Kode yang akan dijalankan:', code)
    console.log('Bahasa ID:', languageId)

    try {
      const result = await fetchSubmission(code, languageId)
      const decodedOutput = result.stdout
        ? atob(result.stdout)
        : result.stderr
        ? atob(result.stderr)
        : 'No output'

      setOutput(decodedOutput)
    } catch (error) {
      console.error(error)
      setOutput('Error executing the code: ' + error.message)
    }
  }

  return (
    <div className='min-h-screen p-8 bg-mocha-base flex'>
      <div className='flex w-full'>
        <div className='w-1/3 p-6 bg-mocha-mantle rounded-lg shadow-lg border border-mocha-overlay0 flex flex-col justify-between'>
          <div>
            <h2 className='text-2xl font-bold text-mocha-mauve mb-4'>Soal:</h2>
            <p className='text-mocha-subtext0 mb-2'>
              Buatlah program sederhana yang mencetak &quot;Hello, World!&quot;
              ke layar.
            </p>
            <p className='text-mocha-subtext0'>
              Contoh output:
              <span className='font-semibold text-mocha-text'>
                {' '}
                Hello, World!
              </span>
            </p>
          </div>
        </div>

        <div className='w-2/3 ml-4 p-6 bg-mocha-mantle rounded-lg shadow-lg border border-mocha-overlay0 flex flex-col justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-mocha-mauve mb-4'>
              Code Editor
            </h1>
            <p className='text-mocha-subtext0 mb-4'>
              Tulis dan jalankan kode Anda di bawah ini:
            </p>
            <CodeEditor onSubmit={handleSubmit} />
          </div>

          <div className='mt-6 bg-mocha-surface1 p-4 rounded-lg border border-mocha-overlay0 font-bold'>
            <h3 className='text-lg font-semibold text-mocha-text'>Output:</h3>
            <pre className='mt-2 p-2 rounded-md text-mocha-text'>
              {output || 'No output yet.'}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
