# Make your tests obvious
Only show the data that matters in your fixtures.

```typescript
// Before: What data do you think matters about this card ? 😬
const card = {
    title:    "Batman rocks",
    comments: [],
    owner:   {
    	username: "batman",
    	picture: "some-picture-of-batman.png"
    }
} 

// After: It's obvious, it's about the empty comments 😊
import {factory} from "@isthatcentered/charlies-factory"

const makeCardResource = factory({
	// ...define your defaults 
})

const card = makeCardResource( { comments: [] } )  
```

## Table of content
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Installation](#installation)
- [How to use](#how-to-use)
  - [Basic use](#basic-use)
  - [Overriding default data](#overriding-default-data)
  - [Dynamic data](#dynamic-data)
  - [States](#states)
  - [Generating multiple items at a time](#generating-multiple-items-at-a-time)
- [Give feedback](#give-feedback)
  - [You're enjoying the package ?](#youre-enjoying-the-package-)
  - [Found a bug ?](#found-a-bug-)
  - [Need a new feature ?](#need-a-new-feature-)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation
```bash
npm i @isthatcentered/charlies-factory 
```

## How to use
### Basic use 
At the end of the day, this thing makes objects. 

You set up a default once and it feeds it back to you with a simple function call every time you need it.

Here's how to do that (keep on reading though, basic use is nice but it's intended to be way more usefull/powerfull thant that 😇)

```typescript jsx
import {factory} from "@isthatcentered/charlies-factory"

export const makeCard = factory({
	title:    "Title",
	status: "done",
    comments: [],
    owner:    makeUser(  ), // You can totally nest factories 
})

// Then enjoy the simplicity of it all
const wrapper = shallow(<KanbanCard card={makeCard()} />)
```

### Overriding default data
This is the selling point of this thing. Overrides are what will make your tests obvious by explicitely stating what data matters.

Let's say I want to test how my `<KanbanCard/>` component from earlier behaves when the card has no comments.
```typescript jsx
import { makeCard } from "some-file-where-i-set-up-the-default-as-shown-in-basic-use"

test( `Comment indicator is hidden when card has no comments`, () => {
	const card    = makeCard( { comments: [] } ),
	      wrapper = shallow(<KanbanCard card={card} />)
	
	expect( wrapper.find( CardCommentsIndicator ).props().display ).toBe( false )
} )
```


And just for kicks, here's how the test would look like without charlies-factory. Try to find the data that matters 😳
```typescript jsx
// (This is WITHOUT charlies-factory)
test( `Comment indicator is hidden when card has no comments`, () => {
	const card    = {
            title:    "Batman rocks",
            comments: [],
            owner:   {
                username: "batman",
                picture: "some-picture-of-batman.png"
            }
        },
         wrapper = shallow(<KanbanCard card={card} />)
	
	expect( wrapper.find( CardCommentsIndicator ).props().display ).toBe( false )
} )
```

### Dynamic data
I've shown earlier (see basic use) that you can totally nest factories inside factories. But the way we did this earlier (by providing an object as default), the nested factory will only be executed once and therefore always return the same data. 

You might not want that or might need to compute some data for the defaults.

It's easy, you can actually pass a function as default. 

```typescript
const seedFunction = (generator: FakerStatic) => { // Yes, we give you a data generator (Faker) because we're nice like that but more on that later 😇
	
	const someComputedStuff  = computeMeSomeStuffFromCurrentAppState(appState)
	
	return {
		id: appState.things.length(),
		status: someComputedStuff,
		email: generator.internet.email()
		// ... you get the ide
	} 	
}

const makeThing = factory( seedFunction )

// The function will be executed every time you call the factory 😙
console.log(makeThing()) // {status: "active", email: "whatever.com", ... }
console.log(makeThing()) // {status: "disabled", email: "newEmail.com", ... }   
```

The seed as function also work for the overrides and the states.

**For overrides**
```typescript
const makeThing = factory({id: 0})

const overrides = generator => ({id: generator.random.number()})

console.log(makeThing(overrides)) // {id: 45 } (or whatever number has been generated) 
```

**For states**
```typescript
const states = {
	"discounted": generator => ({
		discount: generator.random.number()
	}),
	"inStock": generator => ({
        stockCount: generator.random.number() // (I'm not doing Faker justice, it can do way much more than generate random numbers)
    })
}
const makeThing = factory({stockCount: 1, discount: 0}, states)

console.log(makeThing({}, "discounted", "inStock")) // {discount: 20, stockCount: 42} 
```

**Dynamic data extravaganza**
```typescript 
// Erh... @todo, sorry. But you get the idea, your factory can have a function as default, for a or every state you define, and for your last minute overrides if you want.
```


(Actually there's not much more to say about the generator. We pass you the amazing [Faker](https://www.npmjs.com/package/faker) package. Enjoy 😀)


### States
You can define default states for the generated objects like `active`, `done` or whatever you fancy.

I haven't had time to add docs for this yet but you can checkout the example right above or the `src/features.spec.ts` for the how to use.

### Generating multiple items at a time
Sometimes, you need a bunch of objects. We got you covered with the `pack` function. Think you want a `pack` of things from the `factory`.

Here's the how to
```typescript
// We provide the loop index in case you need some ID 👮‍
const cards = pack(3, index => makeCard({id: index})) // Remember, you still have acces to overrides
``` 

## Give feedback
### You're enjoying the package ? 
Let me know at [e.peninb@gmail.com](e.peninb@gmail.com) or 🌟the repo.

### Found a bug ?
You 🤟, let me know by [opening an issue](https://github.com/isthatcentered/charlies-factory/issues)

### Need a new feature ?
Nice, [open an issue](https://github.com/isthatcentered/charlies-factory/issues) and let's talk about this ! 👩‍🚀
