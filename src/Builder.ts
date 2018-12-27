import { ISeed } from "./SeedTemplate"
import { DeepPartial, partialSeed, seed } from "./factory"
import { DynamicSeed } from "./DynamicSeed"
import { SimpleSeed } from "./SimpleSeed"




export class Builder<T>
{
	private readonly _states: { [ name: string ]: ISeed<DeepPartial<T>> }
	private _build!: ISeed<T>
	private _id: number = 1
	
	
	constructor( private _blueprint: seed<T>, states: { [ name: string ]: partialSeed<T> } )
	{
		this._states = this._mapStatesToSeeds( states )
		
		this._resetBuild()
	}
	
	
	apply( ...statesNames: string[] ): this
	{
		statesNames.forEach( name => {
			if ( !this._states[ name ] )
				console.warn( `🤭 Ooops, you are trying to use an unregistered ${name} state.` )
			else
				this._build.merge( this._states[ name ] )
		} )
		
		return this
	}
	
	
	make( overrides: partialSeed<T> = {} ): T
	{
		this._build.merge( this._makeSeed( overrides ) )
		
		const made = this._build.value
		
		this._resetBuild()
		
		return made
	}
	
	
	private _resetBuild()
	{
		this._build = this._makeSeed( this._blueprint, this._id )
		
		this._id++
	}
	
	
	private _mapStatesToSeeds( states: { [ name: string ]: partialSeed<T> } ): { [ name: string ]: ISeed<DeepPartial<T>> }
	{
		return Object.keys( states ) // state1, state2 ,...
			.reduce( ( acc, key ) => ({
				...acc, // {state1: {active: true}}
				[ key ]: this._makeSeed( states[ key ] ), // {state2: {discounted: true}}
			}), {} ) // {state1: {active:true}, state2: {discounted: true}, ...}
	}
	
	
	private _makeSeed<T>( blueprint: seed<T>, id: number = this._id ): ISeed<T>
	{
		return typeof blueprint === "function" ?
		       new DynamicSeed( blueprint as any, id ) :
		       new SimpleSeed( blueprint, id )
		
	}
}