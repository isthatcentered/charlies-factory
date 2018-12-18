import typescript from "rollup-plugin-typescript2"
import pkg from "./package.json"
import babel from "rollup-plugin-babel"


// Thanks https://hackernoon.com/building-and-publishing-a-module-with-typescript-and-rollup-js-faa778c85396
export default {
	input: "src/index.ts",
	output: [
		{
			file: pkg.main,
			format: "cjs",
		},
		{
			file: pkg.module,
			format: "es",
		},
	],
	external: [
		...Object.keys( pkg.dependencies || {} ),
		...Object.keys( pkg.peerDependencies || {} ),
	],
	plugins: [
		typescript( {
			typescript: require( "typescript" ),
			clean: true,
		} ),
		babel( {
			extensions: [ ".js", ".jsx", ".ts", ".tsx" ],
			exclude: "node_modules/**",
		} ),
	],
}
