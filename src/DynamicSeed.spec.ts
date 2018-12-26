import FakerStatic = Faker.FakerStatic
import * as Faker from "faker"
import { DeepPartial } from "./factory"
import { testobject } from "./SeedTemplate.spec"
import { SimpleSeed } from "./SimpleSeed"
import { DynamicSeed } from "./DynamicSeed"




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
		test( `Keeps original seed's id`, () => {
			const { seed: orginal } = makeDynamicSeed( undefined, 1 ),
			      { seed: merged }  = makeDynamicSeed( undefined, 2 )
			
			orginal.merge( merged )
			
			expect( orginal.id ).toBe( 1 )
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