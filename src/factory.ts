import { Seed, seedId } from "./Seed"
import FakerStatic = Faker.FakerStatic




export type dynamicSeed<T> = ( generator: FakerStatic, id: seedId ) => T
export type seed<T> = T | dynamicSeed<T>
export type partialSeed<T> = seed<DeepPartial<T>>
export type DeepPartial<T> = {[P in keyof T]?: DeepPartial<T[P]>}


export function factory<T>(
	blueprint: seed<T>,
	states: { [ name: string ]: partialSeed<T> } = {},
): ( overrides?: partialSeed<T>, ...statesToApply: string[] ) => T
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



function mapStateNamesToSeeds<T>( statesToApply: string[], states: { [ name: string ]: partialSeed<T> } )
{
	return statesToApply
		.map( stateName => Seed.from( states[ stateName ] ) )
		.reduce( ( seed, currSeed ) => seed.merge( currSeed ), Seed.NullSeed )
}