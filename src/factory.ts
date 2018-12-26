import { SimpleSeed } from "./SimpleSeed"
import { DynamicSeed } from "./DynamicSeed"
import { ISeed } from "./SeedTemplate"
import FakerStatic = Faker.FakerStatic




export type dynamicSeed<T> = ( generator: FakerStatic, id: number ) => T
export type seed<T> = T | dynamicSeed<T>
export type partialSeed<T> = seed<DeepPartial<T>>
export type DeepPartial<T> = {[P in keyof T]?: DeepPartial<T[P]>}

const seedFactory = <T>( blueprint: seed<T>, id: number ): ISeed<T> =>
	typeof blueprint === "function" ?
	new DynamicSeed( blueprint as any, id ) :
	new SimpleSeed( blueprint, id )


export function factory<T>(
	blueprint: seed<T>,
	states: { [ name: string ]: partialSeed<T> } = {},
): ( overrides?: partialSeed<T>, ...statesToApply: string[] ) => T
{
	let currId: number = 1
	
	// @todo: return new builder
	return ( overrides = {}, ...statesToApply: string[] ) => {
		const appliedStates: ISeed<DeepPartial<T>> = mapAppliedStateNamesToSeed( statesToApply, states )
		
		return seedFactory( blueprint, currId++ )
			.merge( appliedStates )
			.merge( seedFactory( overrides, 0 ) )
			.value
	}
}


function mapAppliedStateNamesToSeed<T>(
	names: string[],
	states: { [ name: string ]: partialSeed<T> },
): ISeed<DeepPartial<T>>
{
	return names
		.map( name => seedFactory( states[ name ], 0 ) )
		.reduce(
			( acc, seed ) => acc.merge( seed as any ),
			seedFactory( {}, 0 ),
		)
}
