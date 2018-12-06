import _cloneDeep = require("lodash.clonedeep")
import _merge = require("lodash.merge")

// Thanks https://github.com/Microsoft/TypeScript/issues/11233#issuecomment-333255187
type DeepPartial<T> = {
	[P in keyof T]?: DeepPartial<T[P]>;
};

interface statesPatches<T>
{
	[ stateName: string ]: primitiveSeed<T>
}

type userDynamicSeed<T> = ( generator: any ) => T

type primitiveSeed<T> = T | userDynamicSeed<T>

type thingMaker<T> = ( overrides?: primitiveSeed<DeepPartial<T>>, ...statesToApply: string[] ) => T


export class Seed<T>
{
	
	private constructor( private _value: primitiveSeed<T> )
	{
	}
	
	
	merge( seed: Seed<T | DeepPartial<T>> )
	{
		return Seed.from( _merge( this.value, seed.value ) )
	}
	
	
	get value()
	{
		return typeof this._value !== "function" ?
		       _cloneDeep( this._value ) :
		       (this._value as userDynamicSeed<T>)( factory.generator )
	}
	
	
	static NullSeed = Seed.from( {} )
	
	
	static from<T>( userSeed: primitiveSeed<T> ): Seed<T>
	{
		return new Seed<T>( userSeed )
	}
}


export function factory<T>( blueprint: primitiveSeed<T>, states: statesPatches<T> = {} ): thingMaker<T>
{
	return ( overrides = {}, ...namesOfStatesToApply ) => {
		
		const _mergedStates = namesOfStatesToApply
			.map( stateName => Seed.from( states[ stateName ] ) )
			.reduce( ( seed, currSeed ) => seed.merge( currSeed ), Seed.NullSeed )
		
		return Seed
			.from( blueprint )
			.merge( _mergedStates )
			.merge( Seed.from( overrides ) )
			.value
	}
}


factory.generator = {
	name: () => "some name",
}