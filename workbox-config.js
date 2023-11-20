module.exports = {
	globDirectory: 'css/',
	globPatterns: [
		'**/*.css'
	],
	swDest: 'css/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};