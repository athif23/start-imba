const readline = require('readline')
const chalk = require('chalk')

exports.clearConsole = title => {
	if (process.stdout.isTTY) {
		const blank = '\n'.repeat(process.stdout.rows)
		console.log(blank)
		readline.cursorTo(process.stdout, 0, 0)
		readline.clearScreenDown(process.stdout)
		if (title) {
			console.log(chalk.bold.blue(title))
		}
	}
}