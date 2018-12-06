// Thanks https://github.com/Microsoft/TypeScript/issues/11233#issuecomment-333255187
import { Seed, userSeed } from "./Seed"




export type DeepPartial<T> = {
	[P in keyof T]?: DeepPartial<T[P]>;
};

interface statesPatches<T>
{
	[ stateName: string ]: userSeed<T>
}

type thingMaker<T> = ( overrides?: userSeed<DeepPartial<T>>, ...statesToApply: string[] ) => T


export function factory<T>( blueprint: userSeed<T>, states: statesPatches<T> = {} ): thingMaker<T>
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