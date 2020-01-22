// Interfaces
// type AddFn = (a: number, b: number) => number;

// let add: AddFn;
// add = (n1: number, n2: number) => {
// 	return n1 + n2;
// };

// console.log(add(1, 2));
// While the above is a better option, interfaces also have their own implementation.
// interface AddFn {
//   (a: number, b: number): number;
// }

interface Named {
	readonly name: string;
	outputName?: string; // this makes the property optional
}

interface Greetable extends Named {
	greet(phrase: string): void;
}

// A class can implement multiple interfaces
/* While you can add a comma and include Named here, it can also be done by extending Named at Greetable if we know that Greetable must have both the greet method and named attribute. Another positive aspect about interfaces is that they can extend more than one interface by adding commas. */
class Person implements Greetable {
	name: string;
	constructor(n: string) {
		this.name = n;
	}

	greet(phrase: string) {
		console.log(`${phrase}, I am ${this.name}`);
	}
}

let user1: Greetable;
user1 = new Person("John");
// Initial implementation using interface
// user1 = {
// 	name: "John",
// 	age: 22,
// 	greet(phrase: string) {
// 		console.log(`${phrase}, I am ${this.name}`);
// 	}
// };

user1.greet("Hi there");
