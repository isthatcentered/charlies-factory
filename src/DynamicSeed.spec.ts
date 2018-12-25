import FakerStatic = Faker.FakerStatic
import * as Faker from "faker"




class DynamicSeed<T>
{
	constructor( private blueprint: ( faker: FakerStatic, id: number ) => T, public id: number )
	{
	
	}
	
	
	get value(): T
	{
		return this.blueprint( Faker, this.id )
		
	}
	
	
	merge( merged: DynamicSeed<any> )
	{
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
		
		describe( `Keeps dynamism of merged in seeds`, () => {
			test( `Only calls other seed's value on .value`, () => {
			
			} )
			
			test( `Deeply merges new seed on top of original`, () => {
			
			} )
		} )
	} )
	
	
	function makeDynamicSeed( blueprint = jest.fn(), id: number = 0 )
	{
		return {
			seed: new DynamicSeed( blueprint, id ),
			blueprint,
			id,
		}
	}
} )