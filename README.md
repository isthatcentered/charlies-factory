# Make your tests obvious
Only show the data that matters in your fixtures.

```typescript
// Before: What data do you think matters ? 🤯
const card = {
    title:    "Batman rocks",
    comments: [],
    owner:   {
    	username: "batman",
    	picture: "some-picture-of-batman.png"
    }
} 

// After: It's obvious, it's about the empty comments 🤗
import {factory} from "@isthatcentered/charlies-factory"

const makeCardResource = factory({
	// ...define your defaults 
})

const card = makeCardResource( { comments: [] } )  
```
## How to use
### Basic use with defaults
### Add overrides on make
### Dynamic data