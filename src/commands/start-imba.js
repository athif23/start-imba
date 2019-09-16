module.exports = {
  name: 'start-imba',
  run: async toolbox => {
  	toolbox.runCreate(toolbox.parameters.first)
  }
}

