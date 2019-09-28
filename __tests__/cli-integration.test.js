const spawn = require('cross-spawn')
const tempy = require('tempy')
const { filesystem } = require('gluegun')

const src = filesystem.path(__dirname, '..')

// This function handles interactive input
const cli = async cmd => {
  return new Promise((resolve, reject) => {
    let stdout = ''
    const proc = spawn('node', [filesystem.path(src, 'bin', 'start-imba'), cmd])

    proc.stdin.setEncoding('utf-8')

    proc.stdout.on('data', data => {
      data = data.toString()
      stdout += data

      // Now simulate interactive key presses

      // Accept webpack
      if (data.includes('bundler')) proc.stdin.write('\n')

      // Accept Normal CSS
      if (data.includes('preprocessor')) proc.stdin.write('\n')

      // No install
      if (data.includes('install the project')) proc.stdin.write('\n')

      // No git
      if (data.includes('initialize git')) proc.stdin.write('\n')
    })

    proc.on('exit', () => resolve(stdout))
  })
}

const APP_NAME = 'test-project'

// make jest more patient
jest.setTimeout(30 * 1000) // 30 seconds per command

const originalDir = process.cwd()

beforeEach(() => {
  const tempDir = tempy.directory()
  process.chdir(tempDir)
})

afterEach(() => {
  process.chdir(originalDir)
})

test('outputs help', async () => {
  const output = await cli('--help')
  expect(output).toContain('Create a new imba project')
})

test('creates a new imba project', async done => {
  // run command
  const output = await cli(APP_NAME)

  // check output
  expect(output).toContain('Successfully created')
  expect(output).toContain(APP_NAME)
  expect(output).toContain('Start with the following commands')

  // jump into project directory
  process.chdir(APP_NAME)

  // check the contents of package.json
  const packageJSON = filesystem.read(`./package.json`)
  expect(typeof packageJSON).toBe('string')
  expect(packageJSON).toContain(APP_NAME)

  // check folders created
  const dirs = filesystem.subdirectories('.')
  expect(dirs).toContain('source')
  const sourceDirs = filesystem.subdirectories('./source')
  expect(sourceDirs).toContain('source/components')
  expect(sourceDirs).toContain('source/controllers')

  done()
})
