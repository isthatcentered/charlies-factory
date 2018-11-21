import { factory } from "./index"




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
		test( `I can trigger a registered state`, () => {
			let makeBlueprint = factory( BLUEPRINT, {
				stateOverride: {
					name: "name from state",
				},
			} )
			expect( makeBlueprint( {}, "stateName" ) ).toEqual( {
				...BLUEPRINT,
				name: "name from state",
			} )
		} )
		
		test( `State is deeply merged on top of blueprint`, () => {
			fail( "todo" )
		} )
		
		test( `State is deeply merged on top of overrides`, () => {
			fail( "todo" )
		} )
	} )
} )