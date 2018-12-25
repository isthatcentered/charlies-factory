import { ISeed } from "./DynamicSeed"
import _cloneDeep from "lodash.clonedeep"
import { DeepPartial } from "./factory"
import _merge from "lodash.merge"




export class SimpleSeed<T> implements ISeed<T>
{
	value: T
	
	
	constructor( blueprint: T )
	{
		this.value = _cloneDeep( blueprint )
	}
	
	
	merge( seed: ISeed<DeepPartial<T>> )
	{
		this.value = _merge( this.value, seed.value )
		
		return this
	}
}