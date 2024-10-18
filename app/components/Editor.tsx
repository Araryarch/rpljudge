import React, { useState } from 'react'
import Editor from '@monaco-editor/react'
import { JetBrains_Mono } from 'next/font/google'

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'] // Adjust weights as needed
})

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
      '#include <stdio.h>\nint main() {\n  printf("Hello, World!");\n  return 0;\n}'
  },
  {
    label: 'C++',
    value: 54,
    defaultCode:
      '#include <iostream>\nint main() {\n  std::cout << "Hello, World!";\n  return 0;\n}'
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
  onSubmit: (code: string, languageId: number) => void
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialCode, onSubmit }) => {
  const [code, setCode] = useState<string>(
    initialCode || languages[0].defaultCode
  )
  const [selectedLanguage, setSelectedLanguage] = useState<number>(
    languages[0].value
  )

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

  const handleRunCode = () => {
    onSubmit(code, selectedLanguage)
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
      <div className='p-2 bg-mocha-surface2 rounded'>
        <Editor
          height='400px'
          language={selectedLanguage === 63 ? 'javascript' : 'cpp'}
          value={code}
          onChange={handleEditorChange}
          theme='vs-dark'
          className='border border-mocha-overlay0 rounded-md'
          options={{
            fontSize: 17
          }}
        />
      </div>
      <button
        onClick={handleRunCode}
        className='p-2 bg-mocha-mauve text-mocha-surface0 font-bold rounded-md hover:bg-mocha-sapphire'
      >
        Run Code
      </button>
    </div>
  )
}

export default CodeEditor
