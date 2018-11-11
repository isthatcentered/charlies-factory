import _cloneDeep = require("lodash.clonedeep")




function factory<T>( blueprint: T ): () => T
{
	return () => _cloneDeep( blueprint )
}


describe( `factory()`, () => {
	describe( `It generates an object from a blueprint`, () => {
		let BLUEPRINT: any,
		    MAKEBLUEPRINT: any
		
		beforeEach( () => {
			BLUEPRINT = { name: "name", address: { city: "city" } }
			MAKEBLUEPRINT = factory( BLUEPRINT )
		} )
		
		test( `Returns an object matching provided blueprint`, () => {
			expect( MAKEBLUEPRINT() ).toEqual( BLUEPRINT )
		} )
		
		test( `Returned object is a copy of the original blueprint`, () => {
			expect( MAKEBLUEPRINT() ).not.toBe( BLUEPRINT )
			expect( MAKEBLUEPRINT().address ).not.toBe( BLUEPRINT.address )
		} )
	} )
	
	describe( `Blueprint can be overriden on make/call`, () => {
		test( `Deeply merges overrides on top of blueprint`, () => {
			fail( "todo" )
		} )
	} )
} )