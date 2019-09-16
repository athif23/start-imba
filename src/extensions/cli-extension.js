const { yellow, gray, cyan, bold } = require('chalk')
const execa = require('execa')
const {
	clearConsole,
	logWithSpinner,
	stopSpinner,
	hasGit,
	hasYarn,
	installDeps
} = require('../shared-utils')

module.exports = toolbox => {
	// Generate a template
	toolbox.generateTemplate = async (name, bundler_type) => {
		const { parcelPkg, webpackPkg } = require('../shared-utils/pkg')
		const { filesystem, template } = toolbox
		const path = require('path')

		const parcelTemplatePath = filesystem
			.cwd(__dirname, '../templates/parcel-template')
			.cwd()

		const webpackTemplatePath = filesystem
			.cwd(__dirname, '../templates/webpack-template')
			.cwd()

		const pkg = {
			name,
			version: '0.0.1',
			private: true,
			scripts: {},
			dependencies: {},
			devDependencies: {}
		}

		if (bundler_type === 'parcel') {
			for (let key in parcelPkg) {
				pkg[key] = parcelPkg[key]
			}
		} else {
			for (let key in webpackPkg) {
				pkg[key] = webpackPkg[key]
			}
		}

		// Current user working directory path
		const currentPath = filesystem.cwd()

		// Copy all the template to the user current path
		filesystem.copy(
			bundler_type === 'parcel' ? parcelTemplatePath : webpackTemplatePath,
			`${currentPath}${filesystem.separator}${name}`
		)

		// Generate pkg to package.json
		const filePath = path.join(currentPath, `${name}/package.json`)
		filesystem.dir(path.dirname(filePath))
		filesystem.write(filePath, JSON.stringify(pkg, null, 2))
	}

	// Create a new imba project
	toolbox.runCreate = async (name, parameters) => {
		const cliVersion = require(`../../package.json`).version
		const {
			print: { warning, info },
			filesystem,
			prompt
		} = toolbox

		const askProjectName = {
			type: 'input',
			name: 'project_name',
			message: 'Name of the project?'
		}

		const askBundlerType = {
			type: 'list',
			name: 'bundler_type',
			message: 'Bundler to use?',
			choices: ['webpack', 'parcel']
		}

		const askInstallation = {
			type: 'confirm',
			name: 'installation',
			message: 'Install the project?'
		}

		let listQuestions = [askBundlerType, askInstallation]

		// Clear the console
		await clearConsole(`🎮 Imba CLI v${cliVersion}`)

		if (name === undefined) {
			listQuestions.unshift(askProjectName)
		}

		// Ask the prompt
		const { project_name, bundler_type, installation } = await prompt.ask(
			listQuestions
		)

		if (name === undefined) {
			name = project_name
		}

		// Clear the console again
		await clearConsole(`🎮 Imba CLI v${cliVersion}`)

		const createdDirPath = `${filesystem.cwd()}${filesystem.separator}${name}`

		// Generate the template to the target directory
		logWithSpinner(`📁`, `Creating project in ${yellow(createdDirPath)}.`)

		toolbox.checkDirExists(createdDirPath)
		await toolbox.generateTemplate(name, bundler_type, installation)

		stopSpinner()
		if (hasGit()) {
			logWithSpinner(`🗃`, `Initializing git repository...`)
			process.chdir(createdDirPath)
			await toolbox.system.run('git init')
		}

		stopSpinner()
		if (installation === true) {
			// Install all the packages
			info(`🛠  Installing packages. This might take a while...`)
			await toolbox.installPkg(name, createdDirPath)
		}

		stopSpinner()
		info('')
		info(`🎉 Successfully created ${yellow(name)} project.`)
		info('')
		info(
			`🏁 Start with the following commands:\n\n` +
				cyan(`   ${gray('$')} cd ${name}/\n`) +
				cyan(`   ${gray('$')} yarn install\n`) +
				cyan(`   ${gray('$')} yarn serve\n`)
		)
		info('')
	}

	// Installing packages
	toolbox.installPkg = async (name, dir) => {
		const {
			print: { info }
		} = toolbox
		let command

		if (hasYarn) {
			command = 'yarn'
		} else {
			command = 'npm'
		}

		info('')
		await installDeps(dir, command)

		info('')
		info(`🎉 Hurray!! We successfully created ${yellow(name)} project.`)
		info('')
		info(
			`🏁 Start with the following commands:\n\n` +
				cyan(`   ${gray('$')} cd ${name}\n`) +
				cyan(`   ${gray('$')} yarn serve`)
		)
		info('')
		process.exit(1)
	}

	// Check if directory already exists
	toolbox.checkDirExists = async dir => {
		const {
			print: { warning },
			filesystem,
			prompt
		} = toolbox

		if (filesystem.exists(dir) === 'dir') {
			clearConsole()
			warning('⚠️ This project name already exists ⚠ ')
			warning('')
			process.exit(1)
			return false
		} else {
			return true
		}
	}
}