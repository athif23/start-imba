const { yellow, gray, cyan, bold } = require('chalk')

module.exports = toolbox => {
	// Create a new imba project
	toolbox.runCreate = async (name, parameters) => {
		const { prompt } = require('enquirer')
		const {	clearConsole, logWithSpinner, stopSpinner, hasGit } = require('../shared-utils')

		const cliVersion = require('../../package.json').version
		const {	print: { warning, info }, filesystem } = toolbox

		const imbaVersion = parameters.options.imbaVersion || ''
		const useNpm = parameters.options.useNpm || false
		const command = useNpm ? 'npm' : 'yarn'

		// CLEAR CONSOLE ----------
		await clearConsole(`🎮 Start Imba v${cliVersion}`)
		info(' ')

		// Check if folder exist
		let createdDirPath = `${filesystem.cwd()}${filesystem.separator}${name}`
		toolbox.checkDirExists(createdDirPath)

		// Start the prompts
		const { project_name, bundler_type, installation, git, css_type } = await toolbox.startAsking(name, parameters)

		if (name === undefined) {
			name = project_name
			createdDirPath = `${filesystem.cwd()}${filesystem.separator}${name}`
		}

		// Check if folder exist again, after name changed
		toolbox.checkDirExists(createdDirPath)

		// CLEAR CONSOLE ----------
		await clearConsole(`🎮 Start Imba v${cliVersion}`)
		info(' ')

		// Generate the template to the target directory
		logWithSpinner(`📁`, `Creating project in ${yellow(createdDirPath)}.`)

		await toolbox.generateTemplate(`${name}`, bundler_type, css_type, imbaVersion)

		stopSpinner()
		if (hasGit() && git) {
			logWithSpinner(`🗃`, `Initializing git repository...`)
			process.chdir(createdDirPath)
			await toolbox.system.run('git init')
		}

		stopSpinner()
		if (installation) {
			// Install all the packages
			info(`🛠 Installing packages. This might take a while...`)
			await toolbox.installPkg(name, createdDirPath, useNpm)
		}

		stopSpinner()
		info('')
		info(`🎉 Successfully created ${yellow(name)} project.`)
		info('')
		info(
			`🏁 Start with the following commands:\n\n` +
				cyan(`   ${gray('$')} cd ${name}/\n`) +
				cyan(`   ${gray('$')} ${command} install\n`) +
				cyan(`   ${gray('$')} ${command === 'npm' ? 'npm run' : 'yarn'} serve\n`)
		)
		info('')
	}

	// Installing packages
	toolbox.installPkg = async (name, dir, useNPM) => {
		const {
			hasYarn,
			installDeps
		} = require('../shared-utils')
		const {
			print: { info }
		} = toolbox
		let command

		if (hasYarn && !useNPM) {
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
				cyan(`   ${gray('$')} ${command === 'npm' ? 'npm run' : 'yarn'} serve`)
		)
		info('')
		process.exit(1)
	}
}