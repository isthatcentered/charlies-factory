import { Builder } from "./Builder"




describe( `Builder`, () => {
	describe( `make()`, () => {
		test( `Default`, () => {
			const blueprint = Object.freeze( { key: "key", otherKey: "otherKey" } ),
			      builder   = new Builder( blueprint, {} )
			
			expect( builder.make() ).toEqual( blueprint )
		} )
		
		test( `With overrides`, () => {
			const blueprint = Object.freeze( { key: "key", otherKey: "otherKey" } ),
			      overrides = Object.freeze( { key: "key", otherKey: "otherKey" } ),
			      builder   = new Builder( blueprint, {} )
			
			expect( builder.make( overrides ) ).toEqual( { ...blueprint, ...overrides } )
		} )
		
		test( `With states`, () => {
			const blueprint = Object.freeze( { key: "key", otherKey: "otherKey" } ),
			      states    = Object.freeze( {
				      state1: { key: "overriden_by_state_1" },
				      state2: { otherKey: "overriden_by_state_2" },
			      } ),
			      builder   = new Builder( blueprint, states )
			
			expect( builder.apply( "state1", "state2" ).make() ).toEqual( {
				...blueprint,
				...states.state1,
				...states.state2,
			} )
		} )
		
		test( `Resets triggered states config on make`, () => {
			const blueprint = Object.freeze( { key: "key", otherKey: "otherKey" } ),
			      states    = Object.freeze( {
				      state: { key: "overriden_by_state_1" },
			      } ),
			      builder   = new Builder( blueprint, states )
			
			expect( builder.apply( "state" ).make() ).toEqual( {
				...blueprint,
				...states.state,
			} )
			
			expect( builder.make() ).toEqual( blueprint )
		} )
		
		test( `Attaches an id to each seed`, () => {
			const blueprint = jest.fn().mockReturnValue( {} ), // id is only provided to function seeds
			      builder   = new Builder( blueprint, {} )
			
			builder.make()
			builder.make()
			builder.make()
			builder.make()
			
			expect( blueprint ).toHaveBeenNthCalledWith( 1, expect.anything(), 1 )
			expect( blueprint ).toHaveBeenNthCalledWith( 2, expect.anything(), 2 )
			expect( blueprint ).toHaveBeenNthCalledWith( 3, expect.anything(), 3 )
			expect( blueprint ).toHaveBeenNthCalledWith( 4, expect.anything(), 4 )
		} )
	} )
} )