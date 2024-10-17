import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { writeFile, mkdir, rm } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

// Tipe untuk request dengan bahasa yang didukung
interface CompileRequest {
  code: string
  language:
    | 'cpp'
    | 'java'
    | 'python'
    | 'javascript'
    | 'ruby'
    | 'go'
    | 'rust'
    | 'c'
  input?: string
}

// Konfigurasi untuk setiap bahasa
interface LanguageConfig {
  fileExtension: string
  compileCommand?: string
  runCommand: string
  filename: string
}

const LANGUAGE_CONFIGS: Record<string, LanguageConfig> = {
  cpp: {
    fileExtension: '.cpp',
    compileCommand: 'g++ {source} -o {output}',
    runCommand: '{output}',
    filename: 'main'
  },
  c: {
    fileExtension: '.c',
    compileCommand: 'gcc {source} -o {output}',
    runCommand: '{output}',
    filename: 'main'
  },
  java: {
    fileExtension: '.java',
    compileCommand: 'javac {source}',
    runCommand: 'java -cp {dir} Main',
    filename: 'Main'
  },
  python: {
    fileExtension: '.py',
    runCommand: 'python {source}',
    filename: 'main'
  },
  javascript: {
    fileExtension: '.js',
    runCommand: 'node {source}',
    filename: 'main'
  },
  ruby: {
    fileExtension: '.rb',
    runCommand: 'ruby {source}',
    filename: 'main'
  },
  go: {
    fileExtension: '.go',
    compileCommand: 'go build -o {output} {source}',
    runCommand: '{output}',
    filename: 'main'
  },
  rust: {
    fileExtension: '.rs',
    compileCommand: 'rustc {source} -o {output}',
    runCommand: '{output}',
    filename: 'main'
  }
}

async function createTempDir(prefix: string): Promise<string> {
  const tempDir = path.join(process.cwd(), 'tmp', prefix + '-' + uuidv4())
  await mkdir(tempDir, { recursive: true })
  return tempDir
}

async function cleanup(directory: string) {
  try {
    await rm(directory, { recursive: true, force: true })
  } catch (error) {
    console.error('Cleanup error:', error)
  }
}

function execCommand(command: string, timeout = 10000): Promise<string> {
  return new Promise((resolve, reject) => {
    const process = exec(
      command,
      {
        timeout,
        maxBuffer: 1024 * 1024 // 1MB buffer
      },
      (error, stdout, stderr) => {
        if (error) {
          reject(new Error(stderr || error.message))
        } else {
          resolve(stdout)
        }
      }
    )

    setTimeout(() => {
      process.kill()
      reject(new Error('Execution timed out'))
    }, timeout)
  })
}

async function compileAndRun(
  language: string,
  code: string,
  tempDir: string
): Promise<string> {
  const config = LANGUAGE_CONFIGS[language]
  if (!config) {
    throw new Error(`Unsupported language: ${language}`)
  }

  const sourcePath = path.join(tempDir, config.filename + config.fileExtension)
  const outputPath = path.join(tempDir, config.filename)

  // Tulis kode ke file
  await writeFile(sourcePath, code)

  // Compile jika diperlukan
  if (config.compileCommand) {
    const compileCmd = config.compileCommand
      .replace('{source}', sourcePath)
      .replace('{output}', outputPath)
      .replace('{dir}', tempDir)

    try {
      await execCommand(compileCmd)
    } catch (error) {
      throw new Error(`Compilation error: ${error.message}`)
    }
  }

  // Jalankan program
  const runCmd = config.runCommand
    .replace('{source}', sourcePath)
    .replace('{output}', outputPath)
    .replace('{dir}', tempDir)

  return await execCommand(runCmd)
}

// Template code untuk setiap bahasa
const CODE_TEMPLATES: Record<string, string> = {
  cpp: `#include <iostream>
int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`,
  c: `#include <stdio.h>
int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
  python: `print("Hello, World!")`,
  javascript: `console.log("Hello, World!");`,
  ruby: `puts "Hello, World!"`,
  go: `package main
import "fmt"
func main() {
    fmt.Println("Hello, World!")
}`,
  rust: `fn main() {
    println!("Hello, World!");
}`
}

export async function POST(req: Request) {
  try {
    const { code, language, input }: CompileRequest = await req.json()

    // Validasi input
    if (!code || !language) {
      return NextResponse.json(
        { error: 'Code and language are required' },
        { status: 400 }
      )
    }

    if (!LANGUAGE_CONFIGS[language]) {
      return NextResponse.json(
        { error: 'Unsupported language' },
        { status: 400 }
      )
    }

    const tempDir = await createTempDir(language)

    try {
      const output = await compileAndRun(language, code, tempDir)
      return NextResponse.json({ output: output.trim() })
    } finally {
      await cleanup(tempDir)
    }
  } catch (error) {
    console.error('Execution error:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
        output: null
      },
      { status: 500 }
    )
  }
}

// Endpoint untuk mendapatkan template code
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const language = searchParams.get('language')

  if (!language || !CODE_TEMPLATES[language]) {
    return NextResponse.json(
      { error: 'Invalid or unsupported language' },
      { status: 400 }
    )
  }

  return NextResponse.json({
    template: CODE_TEMPLATES[language],
    supportedLanguages: Object.keys(LANGUAGE_CONFIGS)
  })
}
