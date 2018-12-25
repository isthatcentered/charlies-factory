import _cloneDeep from "lodash.clonedeep"
import _merge from "lodash.merge"
import { DeepPartial } from "./factory"
import { ISeed } from "./DynamicSeed.spec"




export class SimpleSeed<T> implements ISeed<T>
{
	value: T
	
	
	constructor( blueprint: T )
	{
		this.value = _cloneDeep( blueprint )
	}
	
	
	merge( seed: ISeed<DeepPartial<T>> )
	{
		this.value = _merge( this.value, seed.value )
		
		return this
	}
}

export interface testobject
{
	someKey: string,
	nested: {
		someNestedKey: string,
		someOtherNestedKey: string,
	}
}

describe( `SimpleSeed`, () => {
	let BLUEPRINT: testobject,
	    PARTIAL_BLUEPRINT_OVERRIDE: DeepPartial<testobject>
	
	beforeEach( () => {
		BLUEPRINT = {
			someKey: "someKey",
			nested:  {
				someNestedKey:      "semoeNestedKey",
				someOtherNestedKey: "someOtherNestedKey",
			},
		}
		PARTIAL_BLUEPRINT_OVERRIDE = {
			someKey: "overriden",
			nested:  {
				someOtherNestedKey: "overriden",
			},
		}
	} )
	
	describe( `.value`, () => {
		test( `Returns a deep copy of the original object`, () => {
			const seed = new SimpleSeed( BLUEPRINT )
			
			expect( seed.value ).toEqual( BLUEPRINT )
			expect( seed.value ).not.toBe( BLUEPRINT )
			expect( seed.value.nested ).not.toBe( BLUEPRINT.nested )
		} )
	} )
	
	describe( `merge()`, () => {
		test( `Returns the original seed`, () => {
			const seed = new SimpleSeed( {} )
			
			expect( seed.merge( new SimpleSeed( {} ) ) ).toBe( seed )
		} )
		
		test( `Deeply merges other seed's value`, () => {
			const seed       = new SimpleSeed( BLUEPRINT ),
			      mergedSeed = new SimpleSeed( PARTIAL_BLUEPRINT_OVERRIDE )
			
			seed.merge( mergedSeed )
			
			expect( seed.value ).toEqual( <testobject>{
				...BLUEPRINT,
				...PARTIAL_BLUEPRINT_OVERRIDE,
				nested: {
					...BLUEPRINT.nested,
					...PARTIAL_BLUEPRINT_OVERRIDE.nested,
				},
			} )
		} )
	} )
} )
