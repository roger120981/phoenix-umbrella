const webpack = require('webpack');
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const pathHelpers = require('./path.js');
const generateFaviconsPlugin = require('./generate-favicons-plugin');

module.exports = {
    mode: 'development',
    entry: {
        habits: pathHelpers.defaultEntrypointForApp('habits'),
        pluginista: pathHelpers.defaultEntrypointForApp('pluginista'),
        photog: pathHelpers.defaultEntrypointForApp('photog'),
        seren: pathHelpers.defaultEntrypointForApp('seren'),
        booklist: pathHelpers.defaultEntrypointForApp('booklist'),
        bookmarker: pathHelpers.defaultEntrypointForApp('bookmarker'),
        movielist: pathHelpers.defaultEntrypointForApp('movielist'),
        grenadier: pathHelpers.defaultEntrypointForApp('grenadier'),
        blockquote: pathHelpers.defaultEntrypointForApp('blockquote'),
        artour_admin: `${__dirname}/../apps/artour/assets/js/admin/index.js`,
        artour_public: `${__dirname}/../apps/artour/assets/js/public/index.js`,
        startpage_admin: `${__dirname}/../apps/startpage/assets/js/admin/index.js`,
        startpage_public: `${__dirname}/../apps/startpage/assets/js/public/index.js`,
    },
    output: {
        path: path.join(__dirname, '..', 'apps'),
        // for dynamic imports
        chunkFilename: ({ chunk }) => {
            return `assets/${chunk.name}.js`;
        },
        filename: ({ chunk }) => {
            return pathHelpers.outputPathForApp(chunk.name, 'js', chunk.hash);
        },
    },
    resolve: {
        alias: {
            'umbrella-common-js': path.resolve(
                __dirname,
                '../apps/common/assets/js/'
            ),
            'umbrella-common-styles': path.resolve(
                __dirname,
                '../apps/common/assets/css/'
            ),
            'bootstrap-custom': path.resolve(
                __dirname,
                '../apps/common/assets/css/lib/bootstrap/scss'
            ),
            bootstrap: path.resolve(
                __dirname,
                '../node_modules/bootstrap/scss'
            ),
            'photog-styles': path.resolve(
                __dirname,
                '../apps/photog/assets/sass/'
            ),
            'artour-styles': path.resolve(
                __dirname,
                '../apps/artour/assets/css/'
            ),
            'habits-styles': path.resolve(
                __dirname,
                '../apps/habits/assets/css/'
            ),
            'seren-styles': path.resolve(
                __dirname,
                '../apps/seren/assets/sass/'
            ),
        },
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /\.scss$/,
                oneOf: [
                    // this matches `<style module>`
                    {
                        resourceQuery: /module/,
                        use: [
                            'vue-style-loader',
                            {
                                loader: 'css-loader',
                                options: {
                                    url: false,
                                    esModule: false,
                                    modules: {
                                        localIdentName:
                                            '[local]_[hash:base64:8]',
                                    },
                                },
                            },
                            {
                                loader: 'sass-loader',
                            },
                        ],
                    },
                    {
                        use: [
                            'vue-style-loader',
                            {
                                loader: MiniCssExtractPlugin.loader,
                                options: {
                                    esModule: false,
                                },
                            },
                            {
                                loader: 'css-loader',
                                options: {
                                    url: false,
                                    esModule: false,
                                },
                            },
                            'sass-loader',
                        ],
                    },
                ],
            },
        ],
    },
    plugins: [
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: ({ chunk }) => {
                return pathHelpers.outputPathForApp(chunk.name, 'css');
            },
        }),
        generateFaviconsPlugin([
            'artour',
            'blockquote',
            'booklist',
            'bookmarker',
            'grenadier',
            'movielist',
            'photog',
            'seren',
            'startpage',
        ]),
        new webpack.DefinePlugin({
            __VUE_OPTIONS_API__: true,
            __VUE_PROD_DEVTOOLS__: false,
            __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
        }),
    ],
};
