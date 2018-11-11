import _cloneDeep = require("lodash.clonedeep")




export function factory<T>( blueprint: T ): () => T
{
	return () => _cloneDeep( blueprint )
}