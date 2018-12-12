import { Seed, userSeed } from "./Seed"
import FakerStatic = Faker.FakerStatic




/**
 *
 * @param {T} blueprint The default object you want the factory to return
 * @param {{[p: string]: ((generator: Faker.FakerStatic) => T) | T}} states
 * @return {thingMaker<T>}
 */
export function factory<T>( blueprint: T, states?: { [ name: string ]: T | (( generator: FakerStatic ) => T) } ): thingMaker<T>

/**
 *
 * @param {(generator: Faker.FakerStatic) => T} blueprint A function that returns the default object you want the factory to return
 * @param {{[p: string]: ((generator: Faker.FakerStatic) => T) | T}} states
 * @return {thingMaker<T>}
 */
export function factory<T>( blueprint: ( generator: FakerStatic ) => T, states?: { [ name: string ]: T | (( generator: FakerStatic ) => T) } ): thingMaker<T>

export function factory<T>( blueprint: T | (( generator: FakerStatic ) => T), states: { [ name: string ]: DeepPartial<T> | (( generator: FakerStatic ) => DeepPartial<T>) } = {} ): thingMaker<T>
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


export function pack<T>( quantity: number, thing: thingMaker<T> ): Array<T>
{
	return Array.from( { length: quantity }, () => thing() )
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