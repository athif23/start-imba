const { prompt } = require('enquirer');

module.exports = {
  name: 'create',
  alias: ['c'],
  run: async toolbox => {
    toolbox.runCreate(toolbox.parameters.first, toolbox.parameters)
  }
}
