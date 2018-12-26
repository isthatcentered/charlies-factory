import { DeepPartial } from "./factory"
import _merge from "lodash.merge"
import * as Faker from "faker"
import FakerStatic = Faker.FakerStatic




export interface ISeed<T>
{
	value: T
	merge: ( seed: ISeed<DeepPartial<T>> ) => ISeed<T>
}

export abstract class SeedTemplate<T> implements ISeed<T>
{
	private _merged: any[] = []
	
	
	get value(): T
	{
		return this
			._merged
			.reduce(
				( acc, seed ) => _merge( acc, seed.value ),
				this._compile(),
			)
	}
	
	
	merge( seed: ISeed<DeepPartial<T>> )
	{
		this._merged.push( seed )
		
		return this
	}
	
	
	protected abstract _compile(): T
}

export class DynamicSeed<T> extends SeedTemplate<T>
{
	
	
	constructor( private _blueprint: ( faker: FakerStatic, id: number ) => T, public id: number )
	{
		super()
	}
	
	
	protected _compile()
	{
		return this._blueprint( Faker, this.id )
	}
}