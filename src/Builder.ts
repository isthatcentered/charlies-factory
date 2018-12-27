import { ISeed } from "./SeedTemplate"
import { DeepPartial, partialSeed, seed } from "./factory"
import { DynamicSeed } from "./DynamicSeed"
import { SimpleSeed } from "./SimpleSeed"




export interface Builder<T>
{
	make( overrides: any ): T
	
	apply( ...states: string[] ): this
}

export class AcceptsPrimitivesBuilder<T> implements Builder<T>
{
	
	private _builder: BusinessBuilder<T>
	
	
	constructor( blueprint: seed<T>, states: { [ name: string ]: partialSeed<T> } )
	{
		this._builder = new BusinessBuilder<T>( this._makeSeed( blueprint ), this._mapStatesToSeeds( states ) )
	}
	
	
	apply( ...statesNames: string[] ): this
	{
		this._builder.apply( ...statesNames )
		
		return this
	}
	
	
	make( overrides: partialSeed<T> = {} ): T
	{
		return this._builder.make( this._makeSeed( overrides ) )
	}
	
	
	
	private _mapStatesToSeeds( states: { [ name: string ]: partialSeed<T> } ): { [ name: string ]: ISeed<DeepPartial<T>> }
	{
		return Object.keys( states ) // state1, state2 ,...
			.reduce( ( acc, key ) => ({
				...acc, // {state1: {active: true}}
				[ key ]: this._makeSeed( states[ key ] ), // {state2: {discounted: true}}
			}), {} ) // {state1: {active:true}, state2: {discounted: true}, ...}
	}
	
	
	private _makeSeed<T>( blueprint: seed<T>, id: number = 0 ): ISeed<T>
	{
		return typeof blueprint === "function" ?
		       new DynamicSeed( blueprint as any, id ) :
		       new SimpleSeed( blueprint, id )
		
	}
}

export class BusinessBuilder<T> implements Builder<T>
{
	private readonly _blueprint: ISeed<T>
	private readonly _states: { [ p: string ]: ISeed<DeepPartial<T>> }
	private _build!: ISeed<T>
	private _id: number = 1
	
	
	constructor( blueprint: ISeed<T>, states: { [ name: string ]: ISeed<DeepPartial<T>> } )
	{
		this._blueprint = blueprint
		this._states = states
		this._resetBuild()
	}
	
	
	make( overrides: ISeed<DeepPartial<T>> )
	{
		const result = this._build.merge( overrides ).value
		
		this._resetBuild()
		
		return result
	}
	
	
	apply( ...states: string[] ): this
	{
		states.forEach( name => {
			if ( !this._states[ name ] )
				throw new Error( `🤭 Ooops, you are trying to use an unregistered "${name}" state.` )
			else
				this._build.merge( this._states[ name ] )
		} )
		
		return this
	}
	
	
	private _resetBuild()
	{
		this._build = this._blueprint.clone()
		
		this._build.id = this._id
		
		this._id++
	}
}