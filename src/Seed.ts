import _merge from "lodash.merge"
import _cloneDeep from "lodash.clonedeep"
import { DeepPartial, dynamicSeed, seed } from "./factory"
import * as faker from "faker"
import FakerStatic = Faker.FakerStatic




export type seedId = number

export class Seed<T>
{
	
	id: seedId
	
	
	private constructor( private _value: seed<T>, id?: seedId )
	{
		this.id = id || Seed.__id++
	}
	
	
	merge( seed: Seed<T | DeepPartial<T>> )
	{
		return Seed.from( _merge( this.value, seed.value ), this.id )
	}
	
	
	get value()
	{
		return typeof this._value !== "function" ?
		       _cloneDeep( this._value ) :
		       (this._value as dynamicSeed<T>)( Seed.generator, this.id )
	}
	
	
	
	private static __id: seedId = 1 // @todo: this is not needed for simple seed
	
	static NullSeed = Seed.from( {} ) // @todo: this belongs to abstract class or dedicated factory
	
	static generator: FakerStatic = faker // @todo: this belongs to dynamic seed
	
	
	static from<T>( userSeed: seed<T>, id?: seedId ): Seed<T>
	{
		return new Seed<T>( userSeed, id )
	}
}