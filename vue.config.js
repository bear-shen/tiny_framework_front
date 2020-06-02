const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports          = {
    css      : {
        sourceMap: true
    },
    devServer: {
        disableHostCheck: true,
        port            : 8080,
    },
    pages    : {
        index: {
            // # entry for the page
            entry   : 'src/main.js',
            // # the source template
            template: 'public/index.html',
            // # output as dist/index.html
            filename: 'index.html',
            // # when using title option,
            // # template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
            title   : 'from vue.config.js',
        },
        // # when using the entry-only string format,
        // # template is inferred to be `public/subpage.html`
        // # and falls back to `public/index.html` if not found.
        // # Output filename is inferred to be `subpage.html`.
        // subpage: 'src/subpage/main.js'
    },
    /*configureWebpack: (config) => {
     console.info(config);
     console.info(config.plugins);
     }*/
}