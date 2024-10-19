'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import MonacoEditor from '@monaco-editor/react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const templates = {
  c: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!");\n    return 0;\n}',
  cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!";\n    return 0;\n}',
  java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
  python3: 'print("Hello, World!")',
  php: '<?php\n\necho "Hello, World!";',
  javascript: 'console.log("Hello, World!");\n',
  ruby: 'puts "Hello, World!"',
  go: 'package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}'
}

const questions = [
  {
    title: 'Soal 1',
    description: 'Write a program to print the sum of two numbers.',
    testCases: [
      { input: '1 2', expectedOutput: '3' },
      { input: '3 4', expectedOutput: '7' },
      { input: '5 6', expectedOutput: '11' }
    ]
  }
]

const Compiler = () => {
  const [code, setCode] = useState(templates.c)
  const [language, setLanguage] = useState('c')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [currentQuestion, setCurrentQuestion] = useState(questions[0])
  const [resultLines, setResultLines] = useState([])
  const [activeTab, setActiveTab] = useState('question')

  const compileCode = async () => {
    setError('')
    setOutput('')

    const inputs = currentQuestion.testCases
      .slice(0, 2)
      .map((tc) => tc.input)
      .join('\n')
    const options = {
      method: 'POST',
      url: 'https://jdoodle2.p.rapidapi.com/v1',
      headers: {
        'x-rapidapi-key': process.env.NEXT_PUBLIC_APIKEY,
        'x-rapidapi-host': 'jdoodle2.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      data: {
        language,
        version: 'latest',
        code,
        input: inputs
      }
    }

    try {
      setActiveTab('output')

      const response = await axios.request(options)
      const resultOutput = response.data.output || 'No output'
      setOutput(resultOutput)
      setResultLines(resultOutput.trim().split('\n'))
    } catch (err) {
      setError('Error compiling code: ' + err.message)
    }
  }

  const handleSubmit = async () => {
    setActiveTab('output')
    await compileCode()
    if (error) {
      return
    }

    if (resultLines.length === 0) {
      return
    }

    const expectedLines = currentQuestion.testCases.map((tc) =>
      tc.expectedOutput.trim()
    )

    const results = resultLines.map((line, index) =>
      index < expectedLines.length
        ? {
            isCorrect: line === expectedLines[index],
            output: line,
            expected: expectedLines[index]
          }
        : { isCorrect: false, output: line, expected: 'No expected output' }
    )

    const allCorrect = results.every((result) => result.isCorrect)

    if (allCorrect) {
      toast.success('Correct! Your answer matches all expected outputs.')
      setOutput('')
    } else {
      setOutput('')
      results.forEach((result, index) => {
        if (!result.isCorrect) {
          setOutput(
            (prev) =>
              `${prev}Test Case ${index + 1} Incorrect! Expected ${
                result.expected
              }, but got ${result.output}.\n`
          )
        } else {
          setOutput((prev) => `${prev}Test Case ${index + 1} Correct!\n`)
        }
      })
    }
  }

  useEffect(() => {
    setCode(templates[language])
  }, [language])

  return (
    <div className='containers min-h-screen w-full bg-mocha-base flex'>
      <div className='left-side flex flex-col min-h-screen w-1/2 py-14 pl-10 box-border'>
        <div className='tab-container mb-4 flex gap-2'>
          <button
            onClick={() => setActiveTab('question')}
            className={`tab ${
              activeTab === 'question' ? 'active' : ''
            } bg-mocha-rosewater px-2 py-1 rounded-sm`}
          >
            Soal
          </button>
          <button
            onClick={() => setActiveTab('output')}
            className={`tab ${
              activeTab === 'output' ? 'active' : ''
            } bg-mocha-flamingo px-2 py-1 rounded-sm`}
          >
            Output
          </button>
        </div>
        {activeTab === 'question' && (
          <div className='question'>
            <h1 className='text-2xl text-mocha-mauve font-bold'>
              {currentQuestion.title}
            </h1>
            <h2 className='text-mocha-text'>{currentQuestion.description}</h2>
            <p className='text-mocha-text mt-5'>Test Cases :</p>
            {currentQuestion.testCases.slice(0, 2).map((testCase, index) => (
              <div key={index}>
                <p className='text-mocha-text'>Input {index + 1}:</p>
                <pre className='input-soal text-mocha-text bg-mocha-surface2 p-2 my-2 rounded'>
                  {testCase.input}
                </pre>
                <p className='text-mocha-text'>Expected Output {index + 1}:</p>
                <pre className='output-soal text-mocha-text bg-mocha-surface2 p-2 my-2 rounded'>
                  {testCase.expectedOutput}
                </pre>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'output' && (
          <div className='output'>
            {error ? (
              <pre className='error-message text-red-500 bg-red-100 p-2 rounded mt-2'>
                {error}
              </pre>
            ) : (
              <pre className='error-message text-mocha-text bg-mocha-surface0 p-2 rounded mt-2'>
                {'Output :'}
              </pre>
            )}
            {output && (
              <pre className='output-message bg-mocha-surface0 text-mocha-text p-2 rounded mt-2'>
                {output.split('\n').map((line, index) => {
                  const isIncorrect = line.includes('Incorrect!')
                  const displayLine =
                    parseInt(line.trim()) <= 0 ? 'Loading...' : line

                  return (
                    <span
                      key={index}
                      className={isIncorrect ? 'text-red-500' : ''}
                    >
                      {displayLine}
                      <br />
                    </span>
                  )
                })}
              </pre>
            )}
          </div>
        )}
      </div>
      <div className='answer min-h-screen w-1/2'>
        <div className='editor w-full bg-mocha-base flex justify-start flex-col min-h-screen box-border p-10'>
          <div className='lang-pick flex justify-between w-full items-center'>
            <h1 className='text-mocha-mauve text-2xl font-bold'>Solution</h1>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className='mb-4 p-2 rounded bg-mocha-surface0 text-mocha-rosewater border border-mocha-mauve h-10'
            >
              {Object.keys(templates).map((lang) => (
                <option
                  key={lang}
                  value={lang}
                >
                  {lang.toLowerCase()}
                </option>
              ))}
            </select>
          </div>
          <div className='editor bg-[#1e1e1e] p-2 rounded-md w-full min-h-fit border-2 border-mocha-mauve text-mocha-text'>
            <MonacoEditor
              height='400px'
              language={language}
              value={code}
              theme='vs-dark'
              onChange={(value) => setCode(value)}
              className='rounded-xl'
              options={{
                FontFamily: 'JetBrains Mono',
                selectOnLineNumbers: true,
                automaticLayout: true,
                wordWrap: true,
                fontSize: 16,
                minimap: { enabled: false },
                scrollBeyondLastLine: false
              }}
            />
          </div>
          <div className='compile-button flex gap-2'>
            <button
              onClick={compileCode}
              className='mt-4 bg-mocha-rosewater border-mocha-mauve border-2 text-mocha-base py-2 px-4 rounded-md hover:bg-mocha-peach'
            >
              Run Code
            </button>
            <button
              onClick={handleSubmit}
              className='mt-4 bg-mocha-mauve text-mocha-base py-2 px-4 rounded-md hover:bg-mocha-peach'
            >
              Submit
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default Compiler
