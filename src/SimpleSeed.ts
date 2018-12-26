import { ISeed, SeedTemplate } from "./DynamicSeed"
import _cloneDeep from "lodash.clonedeep"




export class SimpleSeed<T> extends SeedTemplate<T> implements ISeed<T>
{
	private _value: T
	
	
	constructor( blueprint: T )
	{
		super()
		this._value = _cloneDeep( blueprint )
	}
	
	
	protected _compile()
	{
		return this._value
	}
}