exports.parcelPkg = {
	scripts: {
		'build': 'parcel build source/index.html -d public/',
		'serve': 'parcel source/index.html -d public/'
	},
	dependencies: {
		'imba': 'github:pushqrdx/imba'
	},
	devDependencies: {
		'sass': '^1.16.1',
		'parcel-bundler': '^1.10.3',
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
	    "imba": "1.4.1",
		"css-loader": "^1.0.1",
	    "extract-text-webpack-plugin": "^4.0.0-beta.0",
	    "normalize-scss": "^7.0.1",
	    "style-loader": "^0.23.1",
	    "webpack-dev-server": "^3.1.10"
	},
	devDependencies: {
		"node-sass": "^4.10.0",
	    "sass-loader": "^7.1.0",
	    "webpack": "^4.26.0",
	    "webpack-cli": "^3.1.2"
	}
}
