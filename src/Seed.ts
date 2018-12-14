import _cloneDeep = require("lodash.clonedeep")
import _merge = require("lodash.merge")
import { DeepPartial, dynamicSeed, seed } from "./factory"
import * as faker from "faker"




export class Seed<T>
{
	
	private constructor( private _value: seed<T> )
	{
	}
	
	
	merge( seed: Seed<T | DeepPartial<T>> )
	{
		return Seed.from( _merge( this.value, seed.value ) )
	}
	
	
	get value()
	{
		return typeof this._value !== "function" ?
		       _cloneDeep( this._value ) :
		       (this._value as dynamicSeed<T>)( Seed.generator )
	}
	
	
	static NullSeed = Seed.from( {} )
	
	
	static generator = faker
	
	
	static from<T>( userSeed: seed<T> ): Seed<T>
	{
		return new Seed<T>( userSeed )
	}
}