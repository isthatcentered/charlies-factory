import { ISeed, SeedTemplate } from "./SeedTemplate"
import _cloneDeep from "lodash.clonedeep"




export class SimpleSeed<T> extends SeedTemplate<T> implements ISeed<T>
{
	private _value: T
	
	
	constructor( blueprint: T, id: number )
	{
		super( id )
		this._value = _cloneDeep( blueprint )
	}
	
	
	clone()
	{
		return new SimpleSeed( this._value, this.id )
	}
	
	
	protected _compile()
	{
		return this._value
	}
}