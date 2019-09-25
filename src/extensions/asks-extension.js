/* 
 *  You can add a new prompt here, but don't to put the prompt 
 *  name to 'listQuestions' variable, also don't forget to return them.
 *  Also, always use 'const' to create the variable
 *
 *        const askSomething = {
 *			 type: 'input',
 *           name: 'something_name',
 *           message: 'What something is this?'
 *        }
 *        const listQuestions = [askSomething]
 *		  const { something_name } = await prompt(listQuestions)
 *
 */

module.exports = toolbox => {
	toolbox.startAsking = async (name) => {
		const { prompt } = require('enquirer')
		const {	filesystem } = toolbox

		const askProjectName = {
			type: 'input',
			name: 'project_name',
			message: `What's the name of your project?`
		}

		const askBundlerType = {
			type: 'select',
			name: 'bundler_type',
			message: 'Which bundler you want to use?',
			initial: 'webpack',
			choices: ['webpack', 'parcel']
		}

		let isSASS = false, css_type;
		const askCSSType = {
			type: 'select',
			name: 'css_type',
			message: 'Which preprocessor you want to use?',
			choices: ['Normal CSS', 'SASS/SCSS', 'LESS', 'Stylus'],
			result: (data) => {
				css_type = data
				if (css_type === 'SASS/SCSS') {
					isSASS = true
				}
			},
			initial: 'Normal CSS'
		}

		const sassSCSS = {
			type: 'select',
			name: 'sass_or_scss',
			message: `Let's be clear, SASS or SCSS?`,
			choices: ['SASS', 'SCSS'],
			skip: () => {
				return !isSASS
			},
			result: (data) => {
				if (isSASS) {
					css_type = data
				}
			}
		}

		const askInstallation = {
			type: 'toggle',
			name: 'installation',
			enabled: 'Yep',
			disabled: 'Nope',
			message: 'Should we install the project immediately?'
		}

		const askGit = {
			type: 'toggle',
			name: 'git',
			enabled: 'Yep',
			disabled: 'Nope',
			message: 'Should we initialize git?'
		}

		// Check if folder exist
		let createdDirPath = `${filesystem.cwd()}${filesystem.separator}${name}`
		toolbox.checkDirExists(createdDirPath)

		// Start the prompts
		let listQuestions = [(!name && askProjectName), askBundlerType, askCSSType, sassSCSS, askInstallation, askGit]
		const { project_name, bundler_type, installation, git } = await prompt(
			listQuestions
		)

		return { project_name, bundler_type, installation, git, css_type }
	}
}