import { DeepPartial } from "./factory"
import { SimpleSeed } from "./SimpleSeed"




export interface testobject
{
	someKey: string,
	nested: {
		someNestedKey: string,
		someOtherNestedKey: string,
	}
}

describe( `SimpleSeed`, () => {
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
	
	describe( `.value`, () => {
		test( `Returns a deep copy of the original object`, () => {
			const seed = new SimpleSeed( BLUEPRINT )
			
			expect( seed.value ).toEqual( BLUEPRINT )
			expect( seed.value ).not.toBe( BLUEPRINT )
			expect( seed.value.nested ).not.toBe( BLUEPRINT.nested )
		} )
		
		test( `Keeps dynamisms of merged in seed by only calling .value when asked for it's own value`, () => {
			const seed1 = new SimpleSeed( BLUEPRINT ),
			      seed2 = new SimpleSeed( BLUEPRINT ),
			      spy   = jest.spyOn( seed2, "value", "get" )
			
			seed1.merge( seed2 )
			
			expect( spy ).not.toHaveBeenCalled()
			
			seed1.value
			seed1.value
			seed1.value
			
			expect( spy ).toHaveBeenCalledTimes( 3 )
			
			spy.mockRestore()
		} )
	} )
	
	describe( `merge()`, () => {
		test( `Returns the original seed`, () => {
			const seed = new SimpleSeed( {} )
			
			expect( seed.merge( new SimpleSeed( {} ) ) ).toBe( seed )
		} )
		
		test( `Deeply merges other seed's value`, () => {
			const seed       = new SimpleSeed( BLUEPRINT ),
			      mergedSeed = new SimpleSeed( PARTIAL_BLUEPRINT_OVERRIDE )
			
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
} )
