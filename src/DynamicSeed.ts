import * as Faker from "faker"
import { SeedTemplate } from "./SeedTemplate"
import _cloneDeep from "lodash.clonedeep"
import FakerStatic = Faker.FakerStatic




export class DynamicSeed<T> extends SeedTemplate<T>
{
	
	
	constructor( private _blueprint: ( faker: FakerStatic, id: number ) => T, id: number )
	{
		super( id )
	}
	
	
	clone()
	{
		return new DynamicSeed( this._blueprint, this.id )
	}
	
	
	protected _compile()
	{
		return _cloneDeep( this._blueprint( Faker, this.id ) )
	}
}