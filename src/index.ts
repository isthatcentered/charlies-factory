import { Seed, userSeed } from "./Seed"




export function factory<T>( blueprint: userSeed<T>, states: statesMap<T> = {} ): thingMaker<T>
{
	return ( overrides = {}, ...statesToApply: string[] ) => {
		
		const appliedStatesSeed = statesToApply
			.map( stateName => Seed.from( states[ stateName ] ) )
			.reduce( ( seed, currSeed ) => seed.merge( currSeed ), Seed.NullSeed )
		
		return Seed
			.from( blueprint )
			.merge( appliedStatesSeed )
			.merge( Seed.from( overrides ) )
			.value
	}
}


export type DeepPartial<T> = {
	[P in keyof T]?: DeepPartial<T[P]>;
};

export interface statesMap<T>
{
	[ stateName: string ]: userSeed<T>
}

type thingMaker<T> = ( overrides?: userSeed<DeepPartial<T>>, ...statesToApply: string[] ) => T