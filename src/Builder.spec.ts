import { AcceptsPrimitivesBuilder, BusinessBuilder } from "./Builder"
import { ISeed } from "./SeedTemplate"
import { DeepPartial } from "./factory"
import { SimpleSeed } from "./SimpleSeed"
import { DynamicSeed } from "./DynamicSeed"




interface testBlueprint
{
	key: string,
	otherKey: string
}



describe( `Builders contract`, () => {
	let BLUEPRINT: testBlueprint,
	    OVERRIDES: DeepPartial<testBlueprint>,
	    STATES: { [ name: string ]: ISeed<DeepPartial<testBlueprint>> },
	    NULLSEED: any
	
	beforeEach( () => {
		BLUEPRINT = Object.freeze( { key: "key", otherKey: "otherKey" } )
		OVERRIDES = Object.freeze( { key: "overriden_by_overrides", otherKey: "overriden_by_overrides" } )
		STATES = {
			state1: makeSeed<DeepPartial<testBlueprint>>( { key: "overriden_by_state_1" } ),
			state2: makeSeed<DeepPartial<testBlueprint>>( { otherKey: "overriden_by_state_2" } ),
		}
		NULLSEED = makeSeed( {} )
	} )
	
	describe( `BusinessBuilder`, () => {
		describe( `Default`, () => {
			test( `Returns result of blueprint`, () => {
				const builder = new BusinessBuilder( makeSeed( BLUEPRINT ), {} )
				
				expect( builder.make( NULLSEED ) ).toEqual( BLUEPRINT )
			} )
		} )
		
		describe( `With overrides`, () => {
			test( `Applies overrides on top of blueprint`, () => {
				const builder = new BusinessBuilder( makeSeed( BLUEPRINT ), {} )
				
				expect( builder.make( makeSeed( OVERRIDES ) ) ).toEqual( {
					...BLUEPRINT,
					...OVERRIDES,
				} )
			} )
		} )
		
		describe( `States`, () => {
			test( `Applies states on top of blueprint`, () => {
				const builder = new BusinessBuilder( makeSeed( BLUEPRINT ), STATES )
				
				expect( builder.apply( "state1", "state2" ).make( NULLSEED ) ).toEqual( {
					...BLUEPRINT,
					...STATES.state1.value,
					...STATES.state2.value,
				} )
			} )
			
			test( `Applies overrides on top of states`, () => {
				const builder = new BusinessBuilder( makeSeed( BLUEPRINT ), STATES )
				
				expect( builder.apply( "state1" ).make( makeSeed( OVERRIDES ) ) ).toEqual( {
					...BLUEPRINT,
					...STATES.state1.value,
					...OVERRIDES,
				} )
			} )
			
			test( `Fails when triggering unexisting state`, () => {
				const builder = new BusinessBuilder( makeSeed( {} ), {} )
				
				expect( () => builder.apply( "UNREGISTERED_STATE_NAME" ) ).toThrow( `trying to use an unregistered "UNREGISTERED_STATE_NAME" state` )
			} )
		} )
		
		describe( `Resets build config after maker`, () => {
			test( `No overrides left active for second build`, () => {
				const builder = new BusinessBuilder( makeSeed( BLUEPRINT ), {} )
				
				expect( builder.make( makeSeed( OVERRIDES ) ) ).toEqual( {
					...BLUEPRINT,
					...OVERRIDES,
				} )
				
				expect( builder.make( NULLSEED ) ).toEqual( BLUEPRINT )
			} )
			
			test( `No states left active for second build`, () => {
				const builder = new BusinessBuilder( makeSeed( BLUEPRINT ), STATES )
				
				expect( builder.apply( "state1", "state2" ).make( NULLSEED ) ).toEqual( {
					...BLUEPRINT,
					...STATES.state1.value,
					...STATES.state2.value,
				} )
				
				expect( builder.make( NULLSEED ) ).toEqual( BLUEPRINT )
			} )
		} )
		
		test( `Attaches an id to each seed`, () => {
			const spyableBlueprint = jest.fn().mockReturnValue( {} ), // id is only provided to function seeds
			      builder          = new BusinessBuilder( new DynamicSeed( spyableBlueprint, 0 ), {} )
			
			builder.make( NULLSEED )
			builder.make( NULLSEED )
			builder.make( NULLSEED )
			builder.make( NULLSEED )
			
			expect( spyableBlueprint ).toHaveBeenNthCalledWith( 1, expect.anything(), 1 )
			expect( spyableBlueprint ).toHaveBeenNthCalledWith( 2, expect.anything(), 2 )
			expect( spyableBlueprint ).toHaveBeenNthCalledWith( 3, expect.anything(), 3 )
			expect( spyableBlueprint ).toHaveBeenNthCalledWith( 4, expect.anything(), 4 )
		} )
	} )
	
	
	function makeSeed<T>( blueprint: T ): ISeed<T>
	{
		return new SimpleSeed( blueprint, 0 )
	}
} )
