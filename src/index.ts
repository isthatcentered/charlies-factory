import { Seed, userSeed } from "./Seed"




export function factory<T>( blueprint: userSeed<T>, states: statesMap<T> = {} ): thingMaker<T>
{
	return ( overrides = {}, ...statesToApply: string[] ) => {
		
		const appliedStates = mapStateNamesToSeeds( statesToApply, states )
		
		return Seed
			.from( blueprint )
			.merge( appliedStates )
			.merge( Seed.from( overrides ) )
			.value
	}
}


function mapStateNamesToSeeds<T>( statesToApply: string[], states: statesMap<T> )
{
	return statesToApply
		.map( stateName => Seed.from( states[ stateName ] ) )
		.reduce( ( seed, currSeed ) => seed.merge( currSeed ), Seed.NullSeed )
	
}


export type DeepPartial<T> = {
	[P in keyof T]?: DeepPartial<T[P]>;
};

export interface statesMap<T>
{
	[ stateName: string ]: userSeed<T>
}

type thingMaker<T> = ( overrides?: userSeed<DeepPartial<T>>, ...statesToApply: string[] ) => T