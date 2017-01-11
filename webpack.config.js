module.exports = {
    entry: `${__dirname}/app/index.js`,
    output: {
        path: `${__dirname}/assets`,
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
}
