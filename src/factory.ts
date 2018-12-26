import { Builder } from "./Builder"
import FakerStatic = Faker.FakerStatic




export type dynamicSeed<T> = ( generator: FakerStatic, id: number ) => T
export type seed<T> = T | dynamicSeed<T>
export type partialSeed<T> = seed<DeepPartial<T>>
export type DeepPartial<T> = {[P in keyof T]?: DeepPartial<T[P]>}


export function factory<T>( blueprint: seed<T>, states: { [ name: string ]: partialSeed<T> } = {} ): ( overrides?: partialSeed<T>, ...statesToApply: string[] ) => T
{
	const _builder = new Builder( blueprint, states )
	
	return ( overrides = {}, ...statesToApply: string[] ) => {
		
		return _builder.apply( ...statesToApply ).make( overrides )
	}
}

