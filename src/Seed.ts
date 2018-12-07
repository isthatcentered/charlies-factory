import _cloneDeep = require("lodash.clonedeep")
import _merge = require("lodash.merge")
import { DeepPartial } from "./index"
import * as faker from "faker"



export type userDynamicSeed<T> = ( generator: any ) => T

export type userSimpleSeed<T> = T

export type userSeed<T> = userSimpleSeed<T> | userDynamicSeed<T>

export class Seed<T>
{
	
	private constructor( private _value: userSeed<T> )
	{
	}
	
	
	merge( seed: Seed<T | DeepPartial<T>> ) {
		return Seed.from( _merge( this.value, seed.value ) )
	}
	
	
	get value()
	{
		return typeof this._value !== "function" ?
		       _cloneDeep( this._value ) :
		       (this._value as userDynamicSeed<T>)( Seed.generator )
	}
	
	
	static NullSeed = Seed.from( {} )
	
	
	static generator = faker
	
	
	static from<T>( userSeed: userSeed<T> ): Seed<T>
	{
		return new Seed<T>( userSeed )
	}
}