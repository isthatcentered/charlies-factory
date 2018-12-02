import _cloneDeep = require("lodash.clonedeep")
import _merge = require("lodash.merge")

// Thanks https://github.com/Microsoft/TypeScript/issues/11233#issuecomment-333255187
type DeepPartial<T> = {
	[P in keyof T]?: DeepPartial<T[P]>;
};

interface statesPatches<T>
{
	[ stateName: string ]: DeepPartial<T>
}


export function factory<T>( blueprint: T, states: statesPatches<T> = {} ): ( overrides?: DeepPartial<T>, ...stateName: string[] ) => T
{
	return ( overrides = {}, ...stateNames ) => {
		
		const _states = _cloneDeep( states )
		
		const appliedStates = stateNames
			.map( name => _states[ name ] )
			.reduce( ( state, currState ) => _merge( state, currState ), {} )
		
		return _merge( _cloneDeep( blueprint ), appliedStates, overrides )
	}
}