import { DeepPartial } from "./factory"
import _merge from "lodash.merge"




export interface ISeed<T>
{
	id: number
	value: T
	merge: ( seed: ISeed<DeepPartial<T>> ) => ISeed<T>
}

export abstract class SeedTemplate<T> implements ISeed<T>
{
	private _merged: any[] = []
	
	
	constructor( public id: number )
	{
	}
	
	
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
