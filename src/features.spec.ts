import { pack } from "./pack"
import * as Faker from "faker"
import { factory } from "./factory"
import { seedId } from "./Seed"
import FakerStatic = Faker.FakerStatic




interface testBlueprint
{
	name: string,
	address?: { city: string, street: string }
}

describe( `factory()`, () => {
	let BLUEPRINT: testBlueprint,
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
	
	describe( `Data generator`, () => {
		let SEED: ( generator: FakerStatic, id: seedId ) => testBlueprint
		
		beforeEach( () => {
			SEED = ( faker, id ) => ({ name: faker.name.findName() })
			jest.spyOn( Faker.name, "findName" ).mockReturnValue( "generated by faker" )
		} )
		
		afterEach( () => jest.restoreAllMocks() )
		
		test( `Generates data for blueprint`, () => {
			const makeThing = factory( SEED )
			
			expect( makeThing().name ).toBe( "generated by faker" )
		} )
		
		test( `Generates data for states`, () => {
			const makeThing = factory( BLUEPRINT, { "state1": SEED } )
			
			expect( makeThing( {}, "state1" ).name ).toBe( "generated by faker" )
		} )
		
		test( `Generates data for overrides`, () => {
			const makeThing = factory( BLUEPRINT )
			
			expect( makeThing( SEED ).name ).toBe( "generated by faker" )
		} )
		
		test( `Each generated item has it's own "per factory" made ID`, () => {
			const makeThing      = factory( ( _, id ) => ({ id }) ),
			      makeOtherThing = factory( ( _, id ) => ({ id }) )
			
			expect( makeThing().id ).toBe( 1 )
			expect( makeThing().id ).toBe( 2 )
			expect( makeThing().id ).toBe( 3 )
			expect( makeThing().id ).toBe( 4 )
			
			expect( makeOtherThing().id ).toBe( 1 )
			expect( makeOtherThing().id ).toBe( 2 )
			expect( makeOtherThing().id ).toBe( 3 )
			expect( makeOtherThing().id ).toBe( 4 )
		} )
	} )
	
	describe( `Making multiple objects at a time (packaging)`, () => {
		beforeEach( () => {
			BLUEPRINT = { name: "name" }
			MAKEBLUEPRINT = factory( BLUEPRINT )
		} )
		
		test( `Returns the desired number of objects`, () => {
			const result: testBlueprint[] = pack( 3, _ => MAKEBLUEPRINT() )
			expect( result ).toHaveLength( 3 )
			expect( result[ 0 ].name ).toBe( "name" )
			expect( result[ 1 ].name ).toBe( "name" )
			expect( result[ 2 ].name ).toBe( "name" )
		} )
		
		test( `Passes the iteration index to the function`, () => {
			const spy = jest.fn()
			
			pack( 3, spy )
			
			expect( spy ).toHaveBeenCalledTimes( 3 )
			expect( spy ).toHaveBeenNthCalledWith( 1, 0 )
			expect( spy ).toHaveBeenNthCalledWith( 2, 1 )
			expect( spy ).toHaveBeenNthCalledWith( 3, 2 )
		} )
	} )
} )




