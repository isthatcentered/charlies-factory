import { Seed } from "./Seed"




describe( `Seed`, () => {
	describe( `.value`, () => {
		test( `Returns a deep copy of the original object`, () => {
			const blueprint = { name: "name" },
			      seed      = Seed.from( blueprint )
			
			expect( seed.value ).not.toBe( blueprint )
			expect( seed.value ).toEqual( blueprint )
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
		let _GENERATOR = Seed.generator
		
		beforeEach( () => Seed.generator = { name: jest.fn( () => "batman" ) } )
		
		afterEach( () => Seed.generator = _GENERATOR )
		
		test( `.value returns an object with the generated data`, () => {
			const blueprint = ( g: any ) => ({ name: g.name() }),
			      seed      = Seed.from( blueprint )
			
			expect( seed.value ).toEqual( { name: "batman" } )
		} )
		
		test( `Generates new data every time .value is called`, () => {
			const blueprint = ( g: any ) => ({ name: g.name() }),
			      seed      = Seed.from( blueprint )
			
			seed.value
			
			seed.value
			
			expect( (Seed.generator as any).name ).toHaveBeenCalledTimes( 2 )
		} )
	} )
} )