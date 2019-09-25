module.exports = {
	name: 'create',
	alias: ['c', '-c'],
	description: 'Create a new imba project',
	run: async toolbox => {
		toolbox.runCreate(toolbox.parameters.first, toolbox.parameters)
	}
}
