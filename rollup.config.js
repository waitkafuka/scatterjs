import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';
const pkg = require('./package.json');

export default {
    input: './src/index.js',
    output: [{
        file: pkg.main,
        format: 'umd',
        name: 'Scatter',
        plugin: 'scatter'
    }, {
        file: pkg.unpkg,
        format: 'umd',
        name: 'Scatter'
    }, {
        file: pkg.esModule,
        format: 'esm',
        name: 'Scatter'
    }],
    plugins: [
        babel({
            exclude: 'node_modules/**'
        }),

    ]

};