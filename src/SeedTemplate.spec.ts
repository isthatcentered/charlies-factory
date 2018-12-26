import { SimpleSeed } from "./SimpleSeed"
import { DeepPartial } from "./factory"
import { DynamicSeed } from "./DynamicSeed"




const seeds = [
	{
		name:     "SimpleSeed",
		makeSeed: ( blueprint: any, id = 0 ) => new SimpleSeed( blueprint, id ),
	},
	{
		name:     "DynamicSeed",
		makeSeed: ( blueprint: any, id = 0 ) => new DynamicSeed( () => blueprint, id ),
	},
]

export interface testobject
{
	someKey: string,
	nested: {
		someNestedKey: string,
		someOtherNestedKey: string,
	}
}

describe( `Seed contracts`, () => {
	seeds.forEach( ( { name, makeSeed } ) =>
		describe( `${ name }`, () => {
			let BLUEPRINT: testobject,
			    PARTIAL_BLUEPRINT_OVERRIDE: DeepPartial<testobject>
			
			beforeEach( () => {
				BLUEPRINT = {
					someKey: "someKey",
					nested:  {
						someNestedKey:      "semoeNestedKey",
						someOtherNestedKey: "someOtherNestedKey",
					},
				}
				PARTIAL_BLUEPRINT_OVERRIDE = {
					someKey: "overriden",
					nested:  {
						someOtherNestedKey: "overriden",
					},
				}
			} )
			
			describe( `.id`, () => {
				test( `Each seed has an id`, () => {
					const ID = 111
					expect( makeSeed( {}, ID ).id ).toBe( ID )
				} )
			} )
			
			describe( `.value`, () => {
				test( `Keeps dynamisms of merged in seed by only calling .value when asked for it's own value`, () => {
					const seed1 = makeSeed( BLUEPRINT ),
					      seed2 = makeSeed( BLUEPRINT ),
					      spy   = jest.spyOn( seed2, "value", "get" )
					
					seed1.merge( seed2 )
					
					expect( spy ).not.toHaveBeenCalled()
					
					seed1.value
					seed1.value
					seed1.value
					
					expect( spy ).toHaveBeenCalledTimes( 3 )
					
					spy.mockRestore()
				} )
				
				test( `Returns a deep copy of the original object`, () => {
					const seed = makeSeed( BLUEPRINT )
					
					expect( seed.value ).toEqual( BLUEPRINT )
					expect( seed.value ).not.toBe( BLUEPRINT )
					expect( seed.value.nested ).not.toBe( BLUEPRINT.nested )
				} )
			} )
			
			describe( `.merge()`, () => {
				test( `Returns the original seed`, () => {
					const seed = makeSeed( BLUEPRINT )
					
					expect( seed.merge( makeSeed( {} ) ) ).toBe( seed )
				} )
				
				test( `Deeply merges other seed's value`, () => {
					const seed       = makeSeed( BLUEPRINT ),
					      mergedSeed = makeSeed( PARTIAL_BLUEPRINT_OVERRIDE )
					
					seed.merge( mergedSeed )
					
					expect( seed.value ).toEqual( <testobject>{
						...BLUEPRINT,
						...PARTIAL_BLUEPRINT_OVERRIDE,
						nested: {
							...BLUEPRINT.nested,
							...PARTIAL_BLUEPRINT_OVERRIDE.nested,
						},
					} )
				} )
			} )
		} ) )
} )
