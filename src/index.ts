import _cloneDeep = require("lodash.clonedeep")
import _merge = require("lodash.merge")




interface statesPatches
{
	[ stateName: string ]: object
}


export function factory<T>( blueprint: T, states: statesPatches = {} ): ( overrides: Partial<T>, ...stateName: string[] ) => T
{
	return ( overrides, ...stateNames ) => {
		
		const _states = _cloneDeep( states )
		
		const appliedStates = stateNames
			.map( name => _states[ name ] )
			.reduce( ( state, currState ) => _merge( state, currState ), {} )
		
		return _merge( _cloneDeep( blueprint ), appliedStates, overrides )
	}
}