'use client'

import { useState, useEffect } from 'react'
import MonacoEditor from '@monaco-editor/react'
import { JetBrains_Mono } from 'next/font/google'

const jetbrains = JetBrains_Mono({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap'
})

const LANGUAGES = {
  cpp: {
    name: 'C++',
    template: `#include <iostream>
int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`
  },
  c: {
    name: 'C',
    template: `#include <stdio.h>
int main() {
    printf("Hello, World!\\n");
    return 0;
}`
  },
  java: {
    name: 'Java',
    template: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`
  },
  python: {
    name: 'Python',
    template: `print("Hello, World!")`
  },
  javascript: {
    name: 'JavaScript',
    template: `console.log("Hello, World!");`
  },
  ruby: {
    name: 'Ruby',
    template: `puts "Hello, World!"`
  },
  go: {
    name: 'Go',
    template: `package main
import "fmt"
func main() {
    fmt.Println("Hello, World!")
}`
  },
  rust: {
    name: 'Rust',
    template: `fn main() {
    println!("Hello, World!");
}`
  }
}

export default function Home() {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('cpp')
  const [isCompiling, setIsCompiling] = useState(false)
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    setCode(LANGUAGES[language].template)
  }, [language])

  const handleCompile = async () => {
    setIsCompiling(true)
    setOutput('')
    setError('')

    try {
      const res = await fetch('/api/compile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code, language })
      })

      const data = await res.json()

      if (data.error) {
        setError(data.error)
        return
      }

      setOutput(data.output)
    } catch (error) {
      setError('An error occurred while compiling the code. Please try again.')
    } finally {
      setIsCompiling(false)
    }
  }

  const handleDownload = () => {
    const fileExtensionMap = {
      cpp: 'cpp',
      c: 'c',
      java: 'java',
      python: 'py',
      javascript: 'js',
      ruby: 'rb',
      go: 'go',
      rust: 'rs'
    }

    const file = new Blob([code], { type: 'text/plain' })
    const element = document.createElement('a')
    element.href = URL.createObjectURL(file)
    element.download = `code.${fileExtensionMap[language]}`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault()
        handleCompile()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  })

  return (
    <div
      className={`flex min-h-screen bg-mocha-base p-5 ${jetbrains.className}`}
    >
      <div className='w-1/2 pr-5'>
        <h1 className='text-3xl font-bold mb-5 text-mocha-mauve'>
          Problem Description
        </h1>
        <p className='text-lg mb-4 text-mocha-text'>
          Given you an array, like this:
        </p>
        <pre className='bg-mocha-surface0 text-mocha-text p-4 rounded-lg mb-4'>
          {`["from 1 to 3","from 2 to 6","from -100 to 0"]`}
        </pre>
        <p className='text-lg text-mocha-text mb-4'>
          Find out the maximum range, return by an array:
        </p>
        <pre className='bg-mocha-surface0 text-mocha-text p-4 rounded-lg mb-4'>
          {`findMaxRange(["from 1 to 3","from 2 to 6","from -100 to 0"])`}
          <br />
          {`return: ["from -100 to 0"]`}
        </pre>
        <p className='text-lg text-mocha-text'>
          If more than one element has the maximum range, return them according
          to the order of the original array.
        </p>
      </div>

      <div className='w-1/2'>
        <h1 className='text-3xl font-bold mb-5 text-mocha-mauve'>Solution</h1>

        <div className='mb-4'>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className='border border-purple-800 text-mocha-mauve bg-mocha-base py-2 px-4 rounded'
          >
            {Object.keys(LANGUAGES).map((lang) => (
              <option
                key={lang}
                value={lang}
              >
                {LANGUAGES[lang].name}
              </option>
            ))}
          </select>
        </div>

        <div className={`bg-mocha-surface1 p-4 rounded-lg mb-4`}>
          <MonacoEditor
            height='430px'
            theme='vs-dark'
            language={language}
            value={code}
            onChange={(value) => setCode(value)}
            options={{
              wordWrap: 'on',
              matchBrackets: 'always',
              selectOnLineNumbers: true,
              fontSize: 17,
              fontFamily: 'JetBrains Mono',
              bracketPairColorization: { enabled: true }
            }}
            className='rounded-lg'
          />
        </div>

        <div className='flex justify-between'>
          <div className='first-button flex gap-2'>
            <button
              onClick={handleCompile}
              disabled={isCompiling}
              className={`py-2 px-4 rounded ${
                isCompiling
                  ? 'bg-mocha-mauve text-mocha-surface0'
                  : 'border-2 border-mocha-mauve text-mocha-mauve'
              } `}
            >
              {isCompiling ? 'Compiling...' : 'Run Code'}
            </button>
            <button
              className={`py-2 px-4 rounded ${
                isCompiling
                  ? 'bg-gray-400 text-mocha-mauve'
                  : 'bg-mocha-teal  border-mocha-mauve border-2 text-mocha-surface0'
              }  font-bold`}
            >
              {'Submit'}
            </button>
          </div>
          <button
            onClick={handleDownload}
            className='bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded'
          >
            Download
          </button>
        </div>

        {output && (
          <div className='bg-mocha-surface0 p-4 rounded-lg mt-4'>
            <h2 className='text-lg font-bold text-mocha-mauve'>Output</h2>
            <pre className='text-mocha-text'>{output}</pre>
          </div>
        )}
        {error && (
          <div className='bg-red-600 text-white p-4 rounded-lg mt-4'>
            <h2 className='text-lg font-bold'>Error</h2>
            <pre>{error}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
