module.exports={
    entry:'./main.js',
    output:{
        path:'./build',
        filename:'buble.js'
    },
    devServer:{
        inline:true,
        port:3000
    },
    module:{
        loaders:[
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel',

                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                test:/\.json$/,
                exclude:/node_modules/,
                loader:'json-loader'
            },
            {
                test:/\.css$/,
                exclude:/node_modules/,
                loader:'style-loader!css-loader'
            }
        ]
    }
}