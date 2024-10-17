'use client'

import { useState, useEffect } from 'react'
import MonacoEditor from '@monaco-editor/react'
import { useMonaco } from '@monaco-editor/react'
import { JetBrains_Mono } from 'next/font/google'

// Load the JetBrains Mono font
const jetbrains = JetBrains_Mono({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap'
})

// Define the languages and their templates
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

const catppuccinTheme = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { background: '1E1E2E' },
    { foreground: 'F5EBD9', token: 'comment' },
    { foreground: 'F5C2E7', token: 'string' },
    { foreground: 'F28FAD', token: 'number' },
    { foreground: 'B9FBC0', token: 'keyword' },
    { foreground: 'FF9D00', token: 'variable' },
    { foreground: '89B9F8', token: 'function' },
    { foreground: 'F8F0E3', token: 'type' }
  ],
  colors: {
    'editor.foreground': '#F5EBD9',
    'editor.background': '#1E1E2E',
    'editorCursor.foreground': '#F5C2E7',
    'editor.lineHighlightBackground': '#2A283E',
    'editor.inactiveSelectionBackground': '#B2A3DA',
    'editorWhitespace.foreground': '#555555',
    'editorIndentGuide.background': '#3B3B4F',
    'editorIndentGuide.activeBackground': '#FF9D00',
    'editorBracketMatch.background': '#2A283E',
    'editorError.foreground': '#FF0000',
    'editorWarning.foreground': '#FFA500',
    'editorInfo.foreground': '#00FFFF'
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

  const monaco = useMonaco()

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme('catppuccin', catppuccinTheme)
      monaco.editor.setTheme('catppuccin')
    }
  }, [monaco])

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

  // Add event listener for Ctrl + S
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault() // Prevent default save dialog
        handleCompile() // Trigger the compile function
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  })

  return (
    <div className={`flex min-h-screen bg-base p-5 ${jetbrains.className}`}>
      <div className='w-1/2 pr-5'>
        <h1 className='text-3xl font-bold mb-5 text-mauve'>
          Problem Description
        </h1>
        <p className='text-lg mb-4 text-text'>Given you an array, like this:</p>
        <pre className='bg-surface0 text-text p-4 rounded-lg mb-4'>
          {`["from 1 to 3","from 2 to 6","from -100 to 0"]`}
        </pre>
        <p className='text-lg text-text mb-4'>
          Find out the maximum range, return by an array:
        </p>
        <pre className='bg-surface0 text-text p-4 rounded-lg mb-4'>
          {`findMaxRange(["from 1 to 3","from 2 to 6","from -100 to 0"])`}
          <br />
          {`return: ["from -100 to 0"]`}
        </pre>
        <p className='text-lg text-text'>
          If more than one element has the maximum range, return them according
          to the order of the original array.
        </p>
      </div>

      <div className='w-1/2'>
        <h1 className='text-3xl font-bold mb-5 text-mauve'>Solution</h1>

        <div className='mb-4'>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className='border border-purple-800 text-mauve bg-base py-2 px-4 rounded'
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

        <div
          className={`bg-surface0 backdrop-blur-xl border border-white/30 p-4 rounded-lg shadow-lg`}
        >
          <MonacoEditor
            height='450px'
            theme='catppuccin'
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

        <div className='mt-4 space-x-4'>
          <button
            onClick={handleCompile}
            disabled={isCompiling}
            className={`py-2 px-4 rounded ${
              isCompiling
                ? 'bg-gray-600'
                : 'border-2 border-purple-800 text-mauve'
            } transition`}
          >
            {isCompiling ? 'Compiling...' : 'Compile'}
          </button>
          <button
            onClick={handleDownload}
            className='py-2 px-4 rounded bg-fuchsia-950 text-text transition'
          >
            Download Code
          </button>
        </div>

        {output && (
          <pre className='mt-4 bg-surface0 text-text p-4 rounded-lg border border-white/30'>
            {output}
          </pre>
        )}

        {error && (
          <pre className='mt-4 bg-red-500 text-white p-4 rounded-lg border border-white/30'>
            {error}
          </pre>
        )}
      </div>
    </div>
  )
}
