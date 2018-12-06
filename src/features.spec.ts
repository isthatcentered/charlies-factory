import { factory, Seed } from "./index"




describe( `factory()`, () => {
	let BLUEPRINT: any,
	    MAKEBLUEPRINT: any
	
	beforeEach( () => {
		BLUEPRINT = { name: "name", address: { city: "city", street: "street" } }
		MAKEBLUEPRINT = factory( BLUEPRINT )
	} )
	
	describe( `It generates an object from a blueprint`, () => {
		test( `Returns an object matching provided blueprint`, () => {
			expect( MAKEBLUEPRINT() ).toEqual( BLUEPRINT )
		} )
		
		test( `Returned object is a copy of the original blueprint`, () => {
			expect( MAKEBLUEPRINT() ).not.toBe( BLUEPRINT )
			expect( MAKEBLUEPRINT().address ).not.toBe( BLUEPRINT.address )
		} )
	} )
	
	describe( `Blueprint can be overriden on make/call`, () => {
		let OVERRIDES: any
		beforeEach( () => {
			OVERRIDES = { address: { street: "overriden" } }
		} )
		
		test( `Deeply merges overrides on top of blueprint`, () => {
			expect( MAKEBLUEPRINT( OVERRIDES ) ).toEqual( {
				...BLUEPRINT,
				...OVERRIDES,
				address: {
					...BLUEPRINT.address,
					...OVERRIDES.address,
				},
			} )
		} )
	} )
	
	describe( `Triggering a state`, () => {
		let STATE: any
		beforeEach( () => {
			STATE = {
				name:    "state",
				address: { street: "state" },
			}
			
			MAKEBLUEPRINT = factory( BLUEPRINT, { state: STATE } )
		} )
		
		test( `Triggered state is deeply merged on top of blueprint`, () => {
			expect( MAKEBLUEPRINT( {}, "state" ) ).toEqual( {
				...BLUEPRINT,
				...STATE,
				address: {
					...BLUEPRINT.address,
					...STATE.address,
				},
			} )
		} )
		
		test( `Triggered state is overriden by override`, () => {
			const overrides = {
				address: { street: "overrides" },
			}
			
			expect( MAKEBLUEPRINT( overrides, "state" ) ).toEqual( {
				...BLUEPRINT,
				...STATE,
				address: {
					...BLUEPRINT.address,
					...STATE.address,
					...overrides.address,
				},
			} )
		} )
	} )
	
	describe( `Triggering multiple states`, () => {
		let STATEONE: any,
		    STATETWO: any
		
		beforeEach( () => {
			STATEONE = {
				name:    "stateOne",
				address: { street: "stateOne", city: "stateOne" },
			}
			
			STATETWO = {
				address: { street: "stateTwo" },
			}
			
			MAKEBLUEPRINT = factory( BLUEPRINT, { stateOne: STATEONE, stateTwo: STATETWO } )
		} )
		
		test( `Each step is deeply merged on top of the other in call order`, () => {
			expect( MAKEBLUEPRINT( null, "stateOne", "stateTwo" ) ).toEqual( {
				...BLUEPRINT,
				...STATEONE,
				...STATETWO,
				address: {
					...BLUEPRINT.address,
					...STATEONE.address,
					...STATETWO.address,
				},
			} )
		} )
	} )
	
	describe( `Generating data`, () => {
		let _GENERATOR: any
		beforeEach( () => {
			_GENERATOR = Seed.generator
			
			Seed.generator = { thing: jest.fn() } as any
			
			;(Seed.generator as any).thing.mockReturnValue( "generated" )
		} )
		
		afterEach( () => {
			Seed.generator = _GENERATOR
		} )
		
		
		test( `Generates data`, () => {
			let seed      = ( generator: any ) => ({ name: generator.thing() }),
			    makeThing = factory( seed )
			
			expect( makeThing().name ).toBe( "generated" )
		} )
		
		test( `Generated data for states`, () => {
			let seed      = ( generator: any ) => ({ name: generator.thing() }),
			    makeThing = factory( { name: "name" }, { "state1": seed } )
			
			expect( makeThing( {}, "state1" ).name ).toBe( "generated" )
		} )
		
		test( `Generates different data everytime for states`, () => {
			let seed      = ( generator: any ) => ({ name: generator.thing() }),
			    makeThing = factory( { name: "name" }, { "state1": seed } )
			
			makeThing( {}, "state1" )
			
			makeThing( {}, "state1" )
			
			expect( (Seed.generator as any).thing ).toHaveBeenCalledTimes( 2 )
		} )
		
		test( `Generates data for overrides`, () => {
			let seed      = ( generator: any ) => ({ name: generator.thing() }),
			    makeThing = factory( { name: "name" } )
			
			expect( makeThing( seed ).name ).toBe( "generated" )
		} )
	} )
} )


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