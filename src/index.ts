import _cloneDeep = require("lodash.clonedeep")
import _merge = require("lodash.merge")

// Thanks https://github.com/Microsoft/TypeScript/issues/11233#issuecomment-333255187
type DeepPartial<T> = {
	[P in keyof T]?: DeepPartial<T[P]>;
};

interface statesPatches<T>
{
	[ stateName: string ]: userSeed<T>
}

type userDynamicSeed<T> = ( generator: any ) => T

type userSeed<T> = T | userDynamicSeed<T>

type thingMaker<T> = ( overrides?: DeepPartial<T>, ...statesToApply: string[] ) => T


class Seed<T> implements Seed<T>
{
	
	private constructor( private _value: userSeed<T> )
	{
	}
	
	
	merge( seed: Seed<T> )
	{
		return Seed.from( _merge( this.value, seed.value ) )
	}
	
	
	get value()
	{
		return typeof this._value !== "function" ?
		       this._value :
		       (this._value as userDynamicSeed<T>)( factory.generator )
	}
	
	
	static from<T>( userSeed: userSeed<T> ): Seed<T>
	{
		return new Seed<T>( userSeed )
	}
}


export function factory<T>( blueprint: userSeed<T>, states: statesPatches<T> = {} ): thingMaker<T>
{
	return ( overrides = {}, ...stateNames ) => {
		
		const _states = _cloneDeep( states )
		
		const appliedStates = stateNames
			.map( name => Seed.from( _states[ name ] ) )
			.reduce( ( seed, currSeed ) => seed.merge( currSeed ), Seed.from( {} ) )
			.value
		
		if ( typeof blueprint !== "function" )
			return _merge( _cloneDeep( blueprint ), appliedStates, overrides )
		else
			return _merge( (blueprint as userDynamicSeed<T>)( factory.generator ), appliedStates, overrides )
	}
}


factory.generator = {
	name: () => "some name",
}