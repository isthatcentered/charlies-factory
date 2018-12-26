import { ISeed } from "./DynamicSeed"
import _cloneDeep from "lodash.clonedeep"
import _merge from "lodash.merge"
import { DeepPartial } from "./factory"




export class SimpleSeed<T> implements ISeed<T>
{
	private _value: T
	private _merged: ISeed<DeepPartial<T>>[] = []
	
	
	constructor( blueprint: T )
	{
		this._value = _cloneDeep( blueprint )
	}
	
	
	get value()
	{
		this._merged
			.reduce(
				( acc, seed ) => _merge( acc, seed.value ),
				this._value,
			)
		return this._value
	}
	
	
	merge( seed: ISeed<DeepPartial<T>> )
	{
		
		this._merged.push( seed )
		
		return this
	}
}