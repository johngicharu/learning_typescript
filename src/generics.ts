// GENERICS
// A generic type is a type connected to another type, but it has a level of flexibility. For instance, the Array type is a generic. While it does care that it needs some data inside it, it does not care which type of data that should go into the array. For instance, the Array<string>, is basically a generic type, that is an array of strings. It is a type connected to another type to allow typescript to give us better support for the items themselves. In this case, typescript knows that while the type is an array, it is an array of strings. Hence we have better support for each of the items within the array.
// GENERICS: ARRAY
// const names: Array<string> = ["John", "Gicharu"];

// GENERICS: PROMISES
// Another example is of a promise of type Promise<unknown>. However, we can specify what the promise will resolve to. In this case, the promise will eventually returns a string. Therefore, it allows us to use the promise down the line, with extra support while developing.
// const newPromise: Promise<string> = new Promise((resolve, _reject) => {
// 	setTimeout(() => {
// 		resolve("This is done");
// 	}, 2000);
// });

// GENERICS: FUNCTIONS
// In functions, using generics allows typescript to infer that the function is returning an intersection of the two objects. Therefore, this gives better completion support later on and prevents mistpelling.
// Type constraints allow us to limit the types of the generic types
// function merge<T extends object, U extends object>(objA: T, objB: U) {
// 	return Object.assign(objA, objB);
// }

// const mergedObj = merge({ name: "John" }, { age: 22 });
// console.log(mergedObj);

// interface Lengthy {
// 	length: number;
// }

// function countAndDescribe<T extends Lengthy>(element: T): [T, string] {
// 	let descriptionText = "Got no value.";
// 	if (element.length === 1) {
// 		descriptionText = "Got " + element.length + " element.";
// 	} else if (element.length > 1) {
// 		descriptionText = "Got " + element.length + " elements.";
// 	}
// 	return [element, descriptionText];
// }

// console.log(countAndDescribe("Hi there!")); // You can pass strings and arrays

// function extractAndConvert<T extends object, U extends keyof T>(
// 	obj: T,
// 	key: U
// ) {
// 	return obj[key];
// }

// console.log(extractAndConvert({ name: "John" }, "name"));

// Improve flexibility of classes.
// Preventing entry of objects will prevent issues that come up since objects are reference types and while trying to access them and modify them, issues might arise.
// class dataStorage<T extends string | number | boolean> {
// 	private data: T[] = [];

// 	addItem(item: T) {
// 		this.data.push(item);
// 	}

// 	removeElement(item: T) {
// 		this.data.splice(this.data.indexOf(item));
// 	}

// 	getItems() {
// 		return [...this.data];
// 	}
// }

// const textStorage = new dataStorage<string>();
// textStorage.addItem("John");
// textStorage.addItem("Gicharu");
// textStorage.removeElement("Gicharu");
// console.log(textStorage.getItems());

// GENERIC TYPES THAT TYPESCRIPT SHIPS WITH
// Partial - should be turned back to the original type before returning.pp
