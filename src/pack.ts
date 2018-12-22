export function pack<T>( quantity: number, thing: ( index: number ) => T ): Array<T>
{
	return Array.from( { length: quantity }, ( val, ind ) => thing( ind ) )
}