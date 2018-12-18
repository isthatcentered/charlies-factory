import { Seed } from "./Seed"
import * as Faker from "faker"
import FakerStatic = Faker.FakerStatic




describe( `Seed`, () => {
	describe( `.value`, () => {
		test( `Returns a deep copy of the original object`, () => {
			const blueprint = { name: "name", address: { street: "street" } },
			      seed      = Seed.from( blueprint )
			
			expect( seed.value ).not.toBe( blueprint )
			expect( seed.value ).toEqual( blueprint )
			expect( seed.value.address ).not.toBe( blueprint.address )
			expect( seed.value.address ).toEqual( blueprint.address )
		} )
	} )
	
	describe( `merge()`, () => {
		test( `Passed seed is deeply merged on top of the source one`, () => {
			const originalSeedValue = { name: "name", address: { street: "street", city: "city" } },
			      mergedInSeedValue = { name: "overriden", address: { city: "overriden" } },
			      originalSeed      = Seed.from( originalSeedValue ),
			      mergedInSeed      = Seed.from( mergedInSeedValue )
			
			expect( originalSeed.merge( mergedInSeed ).value )
				.toEqual( {
					...originalSeedValue,
					...mergedInSeedValue,
					address: {
						...originalSeedValue.address,
						...mergedInSeedValue.address,
					},
				} )
		} )
	} )
	
	describe( `Dynamic seed`, () => {
		let SEED: ( generator: FakerStatic ) => { name: string }
		
		beforeEach( () => {
			SEED = faker => ({ name: faker.name.findName() })
			jest.spyOn( Faker.name, "findName" ).mockReturnValue( "generated by faker" )
		} )
		
		afterEach( () => jest.restoreAllMocks() )
		
		test( `.value returns an object with the generated data`, () => {
			const seed = Seed.from( SEED )
			
			expect( seed.value ).toEqual( { name: "generated by faker" } )
		} )
		
		test( `Generates new data every time .value is called`, () => {
			const seed = Seed.from( SEED )
			
			seed.value
			
			seed.value
			
			expect( Seed.generator.name.findName ).toHaveBeenCalledTimes( 2 )
		} )
	} )
} )