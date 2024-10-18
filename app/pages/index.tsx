import { useState } from 'react'
import axios from 'axios'
import CodeEditor from '../components/Editor'

const Judge0API =
  'https://ce.judge0.com/submissions?base64_encoded=false&wait=true'

const Home: React.FC = () => {
  const [output, setOutput] = useState<string>('')

  const handleSubmit = async (code: string, languageId: number) => {
    try {
      const response = await axios.post(Judge0API, {
        language_id: languageId,
        source_code: code,
        stdin: ''
      })

      setOutput(response.data.stdout || response.data.stderr || 'No output')
    } catch (error) {
      setOutput('Error executing the code')
    }
  }

  return (
    <div className='min-h-screen p-8 bg-gray-100'>
      <div className='max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md'>
        <h1 className='text-2xl font-bold text-gray-800 mb-4'>
          Code Editor with Multiple Languages
        </h1>
        <p className='text-gray-700 mb-6'>
          <strong>Soal:</strong> Coba cetak &quot;Hello, World!&quot; dengan
          bahasa yang Anda pilih.
        </p>
        <CodeEditor onSubmit={handleSubmit} />
        <div className='mt-6 bg-gray-50 p-4 rounded-lg'>
          <h3 className='text-lg font-semibold text-gray-800'>Output:</h3>
          <pre className='mt-2 p-2 bg-gray-200 rounded-md'>{output}</pre>
        </div>
      </div>
    </div>
  )
}

export default Home
