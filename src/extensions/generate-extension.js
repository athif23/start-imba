// Manually put this code to parcel's index.imba
const parcelWarning = `

# ------------ WARNING: DO NOT TOUCH OR CHANGE!
module:hot.dispose do
	document:body:innerHTML = ''
# ------------ NEEDED FOR PARCEL!
`

module.exports = toolbox => {
	// Generate a template
	toolbox.generateTemplate = async (name, bundler_type, css_type) => {
		const { parcelPkg, webpackPkg } = require('../shared-utils/pkg')
		const { filesystem, template } = toolbox
		const path = require('path')

		const stylesheet_type = await toolbox.whichCSS(css_type)
		const sourceFolderPath = stylesheet_type.path

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
			if (stylesheet_type) {
				webpackPkg['devDependencies'] = { ...webpackPkg['devDependencies'], ...stylesheet_type.package }
			}
			for (let key in webpackPkg) {
				pkg[key] = webpackPkg[key]
			}
		}

		// Current user working directory path
		const currentPath = filesystem.cwd()

		// Copy selected source/ folder
		filesystem.copy(
			sourceFolderPath,
			`${currentPath}${filesystem.separator}${name}`
		)

		// Copy all the template to the user current path except source/ folder
		filesystem.copy(
			bundler_type === 'parcel' ? parcelTemplatePath : webpackTemplatePath,
			`${currentPath}${filesystem.separator}${name}`,
			{ overwrite: true }
		)

		const { separator } = filesystem
		if (bundler_type === 'webpack') {
			const indexFile = currentPath + separator + name + separator + 'source' + separator + 'index.html'
			const webpackConfig = currentPath + separator + name + separator + 'webpack.config.js'

			// Patch index.html
			await toolbox.patching.patch(indexFile, { delete: `<link rel="stylesheet" href="index.${stylesheet_type.fileType}" />` })
			await toolbox.patching.patch(indexFile, { delete: '<script src="./index.imba"></script>' })

			// Patch webpack.config.js
			if (stylesheet_type.webpackLoader !== "") {
				// To handle for 'css' type loader, as we don't add any thing to it.
				await toolbox.patching.patch(webpackConfig, { insert: `, '${stylesheet_type.webpackLoader}'`, after: `'css-loader'` })
			}
			await toolbox.patching.replace(webpackConfig, `".css"`, `".${stylesheet_type.fileType}"`)
			await toolbox.patching.replace(webpackConfig, `index.css"`, `index.${stylesheet_type.fileType}"`)
			await toolbox.patching.replace(webpackConfig, `.css$/`, stylesheet_type.regex)

		} else if (bundler_type === 'parcel') {
			const indexImba = currentPath + separator + name + separator + 'source' + separator + 'index.imba'

			// Patch index.imba
			await toolbox.patching.patch(indexImba, { insert: parcelWarning, after: `Imba.mount <App[state]>` })
		}

		// Generate pkg to package.json
		const filePath = path.join(currentPath, `${name}/package.json`)
		filesystem.dir(path.dirname(filePath))
		filesystem.write(filePath, JSON.stringify(pkg, null, 2))
	}
}