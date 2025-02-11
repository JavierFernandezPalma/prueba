const path = require('path'); // Importa módulo path
const HtmlWebpackPlugin = require('html-webpack-plugin'); // Crea archivo HTML
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // Plugin para extraer CSS
const CopyPlugin = require('copy-webpack-plugin'); // Plugin para copiar archivos
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin'); // Minifica CSS
const TerserPlugin = require('terser-webpack-plugin'); // Minifica JS

module.exports = {
    mode: 'production',
    entry: {
        main: './src/mainIndex.js', // Archivo de entrada (que genera bundle.js)
        mainInventarioCert: './src/mainInventarioCert.js', // entrada adicional
        mainValidarXML: './src/mainValidarXML.js' // entrada adicional
      },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true, // limpia la carpeta dist en cada compilación
    },
    resolve: {
        extensions: ['.js'], // Extensiones a resolver
        fallback: {
            stream: require.resolve('stream-browserify'),
            timers: require.resolve('timers-browserify'),
            buffer: require.resolve('buffer/'),
        },
    },
    module: {
        rules: [ // Reglas para archivos
            {
                test: /\.m?js$/, // Archivos JS o MJS
                exclude: /node_modules/, // Excluir node_modules
                use: { loader: 'babel-loader' } // Transpila con Babel
            },
            {
                test: /\.css|.styl$/i, // Archivos CSS o Stylus
                use: [MiniCssExtractPlugin.loader, 'css-loader'] // Procesadores CSS
            },
            {
                test: /\.png/, // Archivos PNG
                type: 'asset/resource' // Gestión de recursos
            }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({ // Configuración del plugin HTML
            inject: true, // Inyecta automáticamente
            template: './public/index.html', // Plantilla HTML
            filename: './index.html', // Archivo HTML de salida
            chunks: ['main']
        }),
        new HtmlWebpackPlugin({
            inject: true,
            template: './public/pages/inventarioCert.html',
            filename: './inventarioCert.html', // Archivo de salida en dist
            chunks: ['mainInventarioCert']
        }),
        new HtmlWebpackPlugin({
            inject: true,
            template: './public/pages/validarXML.html',
            filename: './validarXML.html', // Archivo de salida en dist
            chunks: ['mainValidarXML']
        }),
        new MiniCssExtractPlugin({ // Configuración del plugin CSS
            filename: 'assets/[name].[contenthash].css' // Nombre del archivo CSS con hash
        }),
        new CopyPlugin({ // Configuración del plugin de copiado
            patterns: [
                { from: path.resolve(__dirname, "src", "assets/images"), to: "assets/images" }, // Copia imágenes
                { from: path.resolve(__dirname, "src", "utils/files.json"), to: "utils/files.json" },
                { from: path.resolve(__dirname, "src", "upload"), to: "upload" }
            ]
        }),
    ],
    optimization: {
        minimize: true, // Activa la minimización
        minimizer: [
            new CssMinimizerPlugin(), // Minifica CSS
            new TerserPlugin(), // Minifica JS
        ]
    }
};
