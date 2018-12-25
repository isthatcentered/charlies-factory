import { DeepPartial } from "./factory"
import _merge from "lodash.merge"
import * as Faker from "faker"
import FakerStatic = Faker.FakerStatic




export interface ISeed<T>
{
	value: T
	merge: ( seed: ISeed<DeepPartial<T>> ) => ISeed<T>
}

export class DynamicSeed<T> implements ISeed<T>
{
	private _merged: any[] = []
	
	
	constructor( private _blueprint: ( faker: FakerStatic, id: number ) => T, public id: number )
	{
	
	}
	
	
	get value(): T
	{
		return this
			._merged
			.reduce(
				( acc, seed ) => _merge( acc, seed.value ),
				this._blueprint( Faker, this.id ),
			)
	}
	
	
	merge( seed: ISeed<DeepPartial<T>> )
	{
		this._merged.push( seed )
		
		return this
	}
}