# Make your tests obvious
Only show the data that matters in your fixtures.

```typescript
// Before, What data do you think matters ? 😬
const card = {
    title:    "Title",
    comments: [],
    owner:   {
    	username: "batman",
    	picture: "some-picture.png"
    }
} 

// With charlies-factory we make it obvious, it's about the empty comments 🤗
import {factory} from "@isthatcentered/charlies-factory"
const makeCardResource = factory({
	// ...define your defaults 
})

const card = makeCardResource( { comments: [] } )  
```
