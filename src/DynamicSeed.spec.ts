import FakerStatic = Faker.FakerStatic
import * as Faker from "faker"
import { DeepPartial } from "./factory"
import { SimpleSeed, testobject } from "./SimpleSeed.spec"
import _merge from "lodash.merge"




export interface ISeed<T>
{
	value: T
	merge: ( seed: ISeed<DeepPartial<T>> ) => ISeed<T>
}

class DynamicSeed<T> implements ISeed<T>
{
	private _merged: any[] = []
	
	
	constructor( private _blueprint: ( faker: FakerStatic, id: number ) => T, public id: number )
	{
	
	}
	
	
	get value(): T
	{
		return this
			._merged
			.reduce(
				( acc, seed ) => _merge( acc, seed.value ),
				this._blueprint( Faker, this.id ),
			)
	}
	
	
	merge( seed: ISeed<DeepPartial<T>> )
	{
		this._merged.push( seed )
		
		return this
	}
}


describe( `DynamicSeed`, () => {
	describe( `.id`, () => {
		test( `Seed can be instanciated with an id`, () => {
			const ID       = 111,
			      { seed } = makeDynamicSeed( undefined, ID )
			
			expect( seed.id ).toBe( ID )
		} )
	} )
	
	describe( `.value`, () => {
		test( `Generates a new object every time value is read`, () => {
			const { seed, blueprint } = makeDynamicSeed()
			
			expect( blueprint ).not.toHaveBeenCalled()
			
			seed.value
			seed.value
			seed.value
			
			expect( blueprint ).toHaveBeenCalledTimes( 3 )
		} )
		
		test( `Passes faker to blueprint function`, () => {
			const { seed, blueprint } = makeDynamicSeed()
			
			seed.value
			
			expect( blueprint ).toHaveBeenCalledWith( Faker, expect.anything() )
		} )
		
		test( `Passes seed's id to blueprint function`, () => {
			const ID                  = 111,
			      { seed, blueprint } = makeDynamicSeed( undefined, ID )
			
			seed.value
			
			expect( blueprint ).toHaveBeenCalledWith( expect.anything(), ID )
		} )
	} )
	
	describe( `merge()`, () => {
		test( `Returns orginal seed`, () => {
			const { seed: orginal } = makeDynamicSeed(),
			      { seed: merged }  = makeDynamicSeed()
			
			expect( orginal.merge( merged ) ).toBe( orginal )
		} )
		
		test( `Keeps original seed's id`, () => {
			const { seed: orginal } = makeDynamicSeed( undefined, 1 ),
			      { seed: merged }  = makeDynamicSeed( undefined, 2 )
			
			orginal.merge( merged )
			
			expect( orginal.id ).toBe( 1 )
		} )
		
		describe( `Deeply merges new seed on top of original`, () => {
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
			
			test( `With a SimpleSeed`, () => {
				const { seed }   = makeDynamicSeed( () => BLUEPRINT ),
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
			
			test( `With a DynamicSeed`, () => {
				const { seed }             = makeDynamicSeed( () => BLUEPRINT ),
				      { seed: mergedSeed } = makeDynamicSeed( () => PARTIAL_BLUEPRINT_OVERRIDE )
				
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
			
			test( `Keeps dynamisms of merged in seed by only calling .value when asked for it's own value`, () => {
				const { seed: seed1 } = makeDynamicSeed(),
				      { seed: seed2 } = makeDynamicSeed(),
				      spy             = jest.spyOn( seed2, "value", "get" )
				
				seed1.merge( seed2 )
				
				expect( spy ).not.toHaveBeenCalled()
				
				seed1.value
				seed1.value
				seed1.value
				
				expect( spy ).toHaveBeenCalledTimes( 3 )
				
				spy.mockRestore()
			} )
		} )
	} )
	
	
	function makeDynamicSeed<T>( blueprint: ( faker: FakerStatic, id: number ) => T = jest.fn(), id: number = 0 )
	{
		return {
			seed: new DynamicSeed( blueprint, id ),
			blueprint,
			id,
		}
	}
} )