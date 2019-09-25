module.exports = toolbox => {
	// Check if directory already exists
	toolbox.checkDirExists = async dir => {
		const {
			clearConsole,
		} = require('../shared-utils')
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

	// Determine which stylesheet user selected
	toolbox.whichCSS = async (css_type) => {
		const { filesystem } = toolbox

		switch(css_type) {
			case 'Normal CSS':
				return {
					package: "",
					webpackLoader: "",
					path: filesystem.cwd(__dirname, '../templates/base-source-template/css').cwd(),
					fileType: 'css',
					regex: `.css$/`
				};
			case 'SASS':
				return {
					package: { 
						'sass-loader': "^8.0.0", 
						"node-sass": "^4.10.0"
					},
					webpackLoader: 'sass-loader',
					path: filesystem.cwd(__dirname, '../templates/base-source-template/sass').cwd(),
					fileType: 'sass',
					regex: `.(sa|sc|c)ss$/`
				};
			case 'SCSS':
				return {
					package: { 
						'sass-loader': "^8.0.0", 
						"node-sass": "^4.10.0"
					},
					webpackLoader: 'sass-loader',
					path: filesystem.cwd(__dirname, '../templates/base-source-template/scss').cwd(),
					fileType: 'scss',
					regex: `.(sa|sc|c)ss$/`
				};
			case 'LESS':
				return {
					package: { 
						'less-loader': "^5.0.0"
					},
					webpackLoader: 'less-loader',
					path: filesystem.cwd(__dirname, '../templates/base-source-template/less').cwd(),
					fileType: 'less',
					regex: `.(le|c)ss$/`
				};
			case 'Stylus':
				return {
					package: { 
						"stylus": "^0.54.5",
						"stylus-loader": "^3.0.2"
					},
					webpackLoader: 'stylus-loader',
					path: filesystem.cwd(__dirname, '../templates/base-source-template/stylus').cwd(),
					fileType: 'styl',
					regex: `.(styl|css)$/`
				};
		}
	}
}