;['installDeps', 'check', 'spinner', 'clearConsole'].forEach(m => {
	Object.assign(exports, require(`./lib/${m}`))
})