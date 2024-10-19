'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import MonacoEditor from '@monaco-editor/react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Skeleton from 'react-loading-skeleton'

const templates = {
  c: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!");\n    return 0;\n}',
  cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!";\n    return 0;\n}',
  java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
  python: 'print("Hello, World!")',
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
  const [compileTime, setCompileTime] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasCompiled, setHasCompiled] = useState(false)

  const compileCode = async () => {
    setError('')
    setOutput('')
    setLoading(true)

    const inputs = currentQuestion.testCases
      .slice(0, 2)
      .map((tc) => tc.input)
      .join('\n')

    const options = {
      method: 'POST',
      url: 'https://paiza-io.p.rapidapi.com/runners/create',
      params: {
        source_code: code,
        language,
        input: inputs
      },
      headers: {
        'x-rapidapi-key': process.env.NEXT_PUBLIC_APIKEY,
        'x-rapidapi-host': 'paiza-io.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      data: {}
    }

    try {
      setActiveTab('output')

      const response = await axios.request(options)
      const runnerId = response.data.id

      const pollOptions = {
        method: 'GET',
        url: 'https://paiza-io.p.rapidapi.com/runners/get_status',
        params: { id: runnerId },
        headers: {
          'x-rapidapi-key': process.env.NEXT_PUBLIC_APIKEY,
          'x-rapidapi-host': 'paiza-io.p.rapidapi.com'
        }
      }

      let isRunning = true
      while (isRunning) {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        const statusResponse = await axios.request(pollOptions)
        const { status } = statusResponse.data

        if (status === 'completed') {
          isRunning = false
        } else if (status === 'error') {
          throw new Error('An error occurred while running the code.')
        }
      }

      const detailsOptions = {
        method: 'GET',
        url: 'https://paiza-io.p.rapidapi.com/runners/get_details',
        params: { id: runnerId },
        headers: {
          'x-rapidapi-key': process.env.NEXT_PUBLIC_APIKEY,
          'x-rapidapi-host': 'paiza-io.p.rapidapi.com'
        }
      }

      const outputResponse = await axios.request(detailsOptions)
      const resultOutput = outputResponse.data.stdout || 'No output'
      const errorOutput = outputResponse.data.stderr
      const timeTaken = outputResponse.data.time || '0ms'

      setLoading(false)

      if (errorOutput) {
        setError(`Error: ${errorOutput}`)
      } else {
        setOutput(resultOutput)
      }
      setHasCompiled(true)
      setCompileTime(`Completed in ${timeTaken}ms`)

      setResultLines(resultOutput.trim().split('\n'))
    } catch (err) {
      setError('Error compiling code: ' + err.message)
    }

    return true
  }

  const handleSubmit = async () => {
    setActiveTab('output')

    const compileSuccess = await compileCode()

    if (!hasCompiled) {
      setOutput('Please compile your code before submitting.')
      toast.error('Please compile your code before submitting.')
      return
    }

    if (!compileSuccess || error) {
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
            expected: expectedLines[index],
            input: currentQuestion.testCases[index].input
          }
        : {
            isCorrect: false,
            output: line,
            expected: 'No expected output',
            input: 'Unknown'
          }
    )

    const allCorrect = results.every((result) => result.isCorrect)

    if (allCorrect) {
      toast.success('Correct! Your answer matches all expected outputs.')
      setOutput('Congratulations! All test cases passed.\n')
      setResultLines(['Congratulations! All test cases passed.'])
    } else {
      setOutput('')
      results.forEach((result, index) => {
        if (!result.isCorrect) {
          setOutput(
            (prev) =>
              `${prev}Input: ${result.input} Incorrect! Expected ${result.expected}, but got ${result.output}.\n`
          )
        } else {
          setOutput((prev) => `${prev}Input: ${result.input} Correct!\n`)
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
            {loading ? (
              <div className='space-y-2'>
                {Array.from({ length: 1 }).map((_, index) => (
                  <div
                    key={index}
                    className='h-28 bg-mocha-mauve rounded animate-pulse'
                  />
                ))}
              </div>
            ) : error ? (
              <pre className='error-message text-red-500 bg-red-100 p-2 rounded mt-2'>
                {error}
              </pre>
            ) : (
              <pre className='error-message text-mocha-text bg-mocha-surface0 p-2 rounded mt-2 flex justify-between items-center'>
                <h1 className='text-mocha-text'>Output :</h1>
                <p className='text-mocha-rosewater'>{compileTime}</p>
              </pre>
            )}
            {output && (
              <pre
                className={`output-message bg-mocha-surface0 text-mocha-text p-2 flex justify-start items-center rounded mt-2 ${
                  output.includes('Congratulations')
                    ? 'border-2 border-green-500'
                    : output.includes('Incorrect!')
                    ? 'border-2 border-red-500'
                    : output.includes('compile')
                    ? 'border-2 border-yellow-500 text-yellow-500'
                    : ''
                }`}
              >
                {output.split('\n').map((line, index) => {
                  const isIncorrect = line.includes('Incorrect!')
                  const isCorrect = line.includes('Congratulations')
                  const trimmedLine = line.trim()
                  const displayLine =
                    parseInt(trimmedLine) <= 0 ? 'Loading...' : line

                  return (
                    <span
                      key={index}
                      className={
                        isIncorrect
                          ? 'text-red-500'
                          : isCorrect
                          ? 'text-green-500'
                          : ''
                      }
                    >
                      {displayLine}
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
              Compile
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
