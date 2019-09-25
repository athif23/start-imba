module.exports = {
	name: 'update',
	alias: ['u', '-D'],
	description: 'Update start-imba to latest version',
	run: async toolbox => {
		const { hasYarn } = require('../shared-utils')
		let useNPM = toolbox.parameters.options.useNpm || false
		await toolbox.system.run(`${ hasYarn && !useNPM ? 'yarn global upgrade start-imba' : 'npm update -g start-imba'}`)
	}
}
