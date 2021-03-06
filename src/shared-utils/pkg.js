exports.parcelPkg = {
	scripts: {
		'build': 'parcel build source/index.html -d public/',
		'serve': 'parcel source/index.html -d public/'
	},
	dependencies: {
		'imba': '1.4.7'
	},
	devDependencies: {
		'sass': '^1.16.1',
		'parcel-bundler': '^1.10.3',
		'parcel-plugin-url-loader': '^1.3.1',
		'parcel-plugin-imba': 'github:shreeve/parcel-plugin-imba'
	}
}

exports.webpackPkg = {
	scripts: {
		"serve": "webpack-dev-server --mode=development --content-base public/",
	    "build": "webpack --mode=production",
	    "watch": "webpack --watch --progress --colors --display-modules"
	},
	dependencies: {
	    "imba": "1.4.7",
	    "extract-text-webpack-plugin": "^4.0.0-beta.0",
	    "normalize-scss": "^7.0.1",
	    "webpack-dev-server": "^3.1.10"
	},
	devDependencies: {
		"clean-webpack-plugin": "^3.0.0",
		"html-webpack-plugin": "^3.2.0",
	    "mini-css-extract-plugin": "^0.8.0",
		"html-loader": "^0.5.5",
	    "css-loader": "^3.2.0",
	    "file-loader": "^4.2.0",
	    "style-loader": "^0.23.1",
	    "webpack": "^4.26.0",
	    "webpack-cli": "^3.1.2"
	}
}
