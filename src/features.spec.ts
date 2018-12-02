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
} )