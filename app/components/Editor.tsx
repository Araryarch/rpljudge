import React, { useState } from 'react'
import Editor from '@monaco-editor/react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface LanguageOption {
  label: string
  value: number
  defaultCode: string
}

const languages: LanguageOption[] = [
  {
    label: 'C',
    value: 50,
    defaultCode:
      '#include <stdio.h>\n\nint main() {\n  printf("Hello, World!");\n  return 0;\n}'
  },
  {
    label: 'C++',
    value: 54,
    defaultCode:
      '#include <bits/stdc++.h>\n\nint main() {\n  std::cout << "Hello, World!";\n  return 0;\n}'
  },
  {
    label: 'C#',
    value: 51,
    defaultCode:
      'using System;\nclass Program {\n  static void Main() {\n    Console.WriteLine("Hello, World!");\n  }\n}'
  },
  {
    label: 'Java',
    value: 62,
    defaultCode:
      'class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}'
  },
  { label: 'Python3', value: 71, defaultCode: 'print("Hello, World!")' },
  {
    label: 'Javascript',
    value: 63,
    defaultCode: 'console.log("Hello, World!");'
  }
]

interface CodeEditorProps {
  initialCode?: string
  onSubmit: (code: string, languageId: number) => Promise<void>
}

const useRateLimiter = (limit: number, interval: number) => {
  const [isRateLimited, setIsRateLimited] = useState(false)
  const [lastRequestTime, setLastRequestTime] = useState<number | null>(null)

  const checkRateLimit = () => {
    const currentTime = Date.now()
    if (lastRequestTime && currentTime - lastRequestTime < interval) {
      setIsRateLimited(true)
      setTimeout(() => setIsRateLimited(false), interval)
      return false
    }
    setLastRequestTime(currentTime)
    return true
  }

  return { isRateLimited, checkRateLimit }
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialCode, onSubmit }) => {
  const [code, setCode] = useState<string>(
    initialCode || languages[0].defaultCode
  )
  const [selectedLanguage, setSelectedLanguage] = useState<number>(
    languages[0].value
  )

  const { isRateLimited, checkRateLimit } = useRateLimiter(5, 5000)

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || '')
  }

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLang = languages.find(
      (lang) => lang.value === parseInt(e.target.value)
    )
    if (selectedLang) {
      setSelectedLanguage(selectedLang.value)
      setCode(selectedLang.defaultCode)
    }
  }

  const handleRunCode = async () => {
    if (!checkRateLimit()) {
      toast.warn(
        'You are being rate limited. Please wait before trying again.',
        {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        }
      )
      return
    }

    try {
      await onSubmit(code, selectedLanguage)
    } catch (error) {
      console.error('Error running code:', error)
    }
  }

  return (
    <div className='flex flex-col space-y-4'>
      <select
        onChange={handleLanguageChange}
        value={selectedLanguage}
        className='p-2 border border-mocha-overlay0 bg-mocha-surface1 rounded-md focus:outline-none focus:ring focus:ring-mocha-flamingo text-mocha-text'
      >
        {languages.map((lang) => (
          <option
            className='bg-mocha-surface1 text-mocha-text'
            key={lang.value}
            value={lang.value}
          >
            {lang.label}
          </option>
        ))}
      </select>
      <div className='py-3 px-1 bg-[#1e1e1e] rounded'>
        <Editor
          height='400px'
          language={selectedLanguage === 63 ? 'javascript' : 'cpp'}
          value={code}
          onChange={handleEditorChange}
          theme='vs-dark'
          options={{
            fontSize: 17,
            automaticLayout: true,
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            folding: true,
            quickSuggestions: true,
            formatOnPaste: true,
            formatOnType: true,
            renderWhitespace: 'boundary',
            wordWrap: 'on',
            cursorSmoothCaretAnimation: true,
            cursorBlinking: 'smooth',
            suggestOnTriggerCharacters: true
          }}
        />
      </div>
      <button
        onClick={handleRunCode}
        className={`p-2 ${
          isRateLimited ? 'bg-gray-400 cursor-not-allowed' : 'bg-mocha-mauve'
        } text-mocha-surface0 font-bold rounded-md hover:bg-mocha-sapphire`}
        disabled={isRateLimited}
      >
        {isRateLimited ? 'Please wait...' : 'Run Code'}
      </button>
      <ToastContainer />
    </div>
  )
}

export default CodeEditor
