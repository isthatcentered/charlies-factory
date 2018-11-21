import _cloneDeep = require("lodash.clonedeep")
import _merge = require("lodash.merge")




export function factory<T>( blueprint: T ): ( overrides: Partial<T> ) => T
{
	return ( overrides ) => _merge(_cloneDeep( blueprint ), overrides)
}