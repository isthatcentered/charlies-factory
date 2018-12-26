import { Builder } from "./Builder"




interface testBlueprint
{
	key: string,
	otherKey: string
}

describe( `Builder`, () => {
	let BLUEPRINT: testBlueprint,
	    OVERRIDES: Partial<testBlueprint>,
	    STATES: { [ name: string ]: Partial<testBlueprint> }
	
	beforeEach( () => {
		BLUEPRINT = Object.freeze( { key: "key", otherKey: "otherKey" } )
		OVERRIDES = Object.freeze( { key: "key", otherKey: "otherKey" } )
		STATES = Object.freeze( {
			state1: { key: "overriden_by_state_1" },
			state2: { otherKey: "overriden_by_state_2" },
		} )
	} )
	
	describe( `make()`, () => {
		test( `Default`, () => {
			const builder = new Builder( BLUEPRINT, {} )
			
			expect( builder.make() ).toEqual( BLUEPRINT )
		} )
		
		test( `With overrides`, () => {
			const builder = new Builder( BLUEPRINT, {} )
			
			expect( builder.make( OVERRIDES ) ).toEqual( { ...BLUEPRINT, ...OVERRIDES } )
		} )
		
		test( `With states`, () => {
			const builder = new Builder( BLUEPRINT, STATES )
			
			expect( builder.apply( "state1", "state2" ).make() ).toEqual( {
				...BLUEPRINT,
				...STATES.state1,
				...STATES.state2,
			} )
		} )
		
		test( `Resets triggered states config on make`, () => {
			const builder = new Builder( BLUEPRINT, STATES )
			
			expect( builder.apply( "state1", "state2" ).make() ).toEqual( {
				...BLUEPRINT,
				...STATES.state1,
				...STATES.state2,
			} )
			
			expect( builder.make() ).toEqual( BLUEPRINT )
		} )
		
		test( `Attaches an id to each seed`, () => {
			const spyableBlueprint = jest.fn().mockReturnValue( {} ), // id is only provided to function seeds
			      builder          = new Builder( spyableBlueprint, {} )
			
			builder.make()
			builder.make()
			builder.make()
			builder.make()
			
			expect( spyableBlueprint ).toHaveBeenNthCalledWith( 1, expect.anything(), 1 )
			expect( spyableBlueprint ).toHaveBeenNthCalledWith( 2, expect.anything(), 2 )
			expect( spyableBlueprint ).toHaveBeenNthCalledWith( 3, expect.anything(), 3 )
			expect( spyableBlueprint ).toHaveBeenNthCalledWith( 4, expect.anything(), 4 )
		} )
	} )
} )