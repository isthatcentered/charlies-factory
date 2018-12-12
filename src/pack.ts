import { partialSeed } from "./factory"




export function pack<T>( quantity: number, thing: ( overrides?: partialSeed<T>, ...statesToApply: string[] ) => T ): Array<T>
{
	return Array.from( { length: quantity }, () => thing() )
}