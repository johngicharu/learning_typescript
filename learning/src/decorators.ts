// // DECORATORS
// /*
//   Decorators make it easier for other developers to work with your code
// */

// // function Logger(constructor: Function) {
// // 	console.log("Logging...");
// // 	console.log(constructor);
// // }

// // @Logger
// // class Person {
// // 	name = "Max";

// // 	constructor() {
// // 		console.log("Creating person object...");
// // 	}
// // }

// // const pers = new Person();
// // console.log(pers);

// // Using decorator factories allows us to pass arguments therefore having more power of what the decorator does internally.
// // function Logger(logString: string) {
// // 	return function(constructor: Function) {
// // 		console.log(logString);
// // 		console.log(constructor);
// // 	};
// // }

// function WithTemplate(template: string, hookId: string) {
// 	console.log("With Template");
// 	return function<T extends { new (...args: any[]): { name: string } }>(
// 		originalConstructor: T
// 	) {
// 		return class extends originalConstructor {
// 			constructor(..._args: any[]) {
// 				super();
// 				console.log("With template decorator");
// 				const hookEl = document.getElementById(hookId);
// 				// When we return a new constructor or rather, class, we can now access properties via the this keyword
// 				// const p = new originalConstructor();
// 				if (hookEl) {
// 					hookEl.innerHTML = template;
// 					hookEl.querySelector("h1")!.textContent = this.name;
// 				}
// 			}
// 		};
// 	};
// }

// // // These decorators are run bottom first. However, the functions themselves are executed in the way js normally executes functions, (top to bottom). The actually decorator functions (returned from within the decorator factories) ar executed bottom up.
// // @Logger("Logging Decorator...")
// @WithTemplate("<h1>My Person Object</h1>", "app")
// class Person {
// 	name = "Max";

// 	constructor() {
// 		console.log("Creating person object...");
// 	}
// }

// // If the decorator returns a new class/constructor function, the decorators only run once the class is instantiated. This is however, in the decorator function only. The surrounding function in the decorator factory runs normally
// // const pers = new Person();
// // console.log(pers);

// // Property Decorator
// function Log(target: any, propertyName: string | Symbol) {
// 	console.log("Property Decorator");
// 	console.log(target, propertyName);
// }

// // Accessor Descriptors
// function Log2(target: any, name: string, descriptor: PropertyDescriptor) {
// 	console.log("Accessor decorator");
// 	console.log(target);
// 	console.log(name);
// 	console.log(descriptor);
// }

// // METHOD DECORATOR
// function Log3(
// 	target: any,
// 	name: string | Symbol,
// 	descriptor: PropertyDescriptor
// ) {
// 	console.log("Method decorator");
// 	console.log(target);
// 	console.log(name);
// 	console.log(descriptor);
// }

// // PARAMETER DECORATOR
// function Log4(target: any, name: string | Symbol, position: number) {
// 	console.log("Parameter decorator");
// 	console.log(target);
// 	console.log(name);
// 	console.log(position);
// }

// class Product {
// 	@Log
// 	title: string;
// 	private _price: number;

// 	@Log2
// 	set price(val: number) {
// 		if (val > 0) {
// 			this._price = val;
// 		} else {
// 			throw new Error("Price must be above 0");
// 		}
// 	}

// 	constructor(t: string, p: number) {
// 		this.title = t;
// 		this._price = p;
// 	}

// 	@Log3
// 	getPriceWithTax(@Log4 tax: number) {
// 		return this._price * (1 * tax);
// 	}
// }

// // Using a decorator to bind a method.
// function AutoBind(
// 	_target: any,
// 	_methodName: string,
// 	descriptor: PropertyDescriptor
// ) {
// 	const originalMethod = descriptor.value;
// 	const adjDescriptor: PropertyDescriptor = {
// 		configurable: true,
// 		enumerable: false,
// 		get() {
// 			const boundFn = originalMethod.bind(this);
// 			return boundFn;
// 		}
// 	};
// 	return adjDescriptor;
// }

// class Printer {
// 	message = "This works!";

// 	@AutoBind
// 	showMessage() {
// 		console.log(this.message);
// 	}
// }

// const p = new Printer();

// const button = document.querySelector("button")!;
// button.addEventListener("click", p.showMessage);

// DECORATORS FOR VALIDATION

// interface ValidatorConfig {
// 	[property: string]: {
// 		[validatableProperty: string]: string[]; // ['required', 'positive']
// 	};
// }

// const registeredValidators: ValidatorConfig = {};

// function Required(target: any, propName: string) {
// 	registeredValidators[target.constructor.name] = {
// 		[propName]: ["required"]
// 	};
// }

// function PositiveNumber(target: any, propName: string) {
// 	registeredValidators[target.constructor.name] = {
// 		...registeredValidators[target.constructor.name],
// 		[propName]: ["positive"]
// 	};
// }

// function validate(obj: any) {
// 	const objValidatorConfig = registeredValidators[obj.constructor.name];
// 	if (!objValidatorConfig) {
// 		return true;
// 	}
// 	let isValid = true;
// 	for (const prop in objValidatorConfig) {
// 		for (const validator of objValidatorConfig[prop]) {
// 			switch (validator) {
// 				case "required":
// 					isValid = isValid && !!obj[prop];
// 				case "positive":
// 					isValid = isValid && obj[prop] > 0;
// 			}
// 		}
// 	}
// 	return isValid;
// }

// class Course {
// 	@Required
// 	title: string;
// 	@PositiveNumber
// 	price: number;

// 	constructor(t: string, p: number) {
// 		this.title = t;
// 		this.price = p;
// 	}
// }

// const courseForm = document.querySelector("form")!;
// courseForm.addEventListener("submit", e => {
// 	e.preventDefault();
// 	const titleEl = document.getElementById("title") as HTMLInputElement;
// 	const priceEl = document.getElementById("price") as HTMLInputElement;

// 	const title = titleEl.value;
// 	const price = +priceEl.value;

// 	const createdCourse = new Course(title, price);
// 	if (!validate(createdCourse)) {
// 		alert("Invalid Input Please try again");
// 		return;
// 	}
// 	console.log(createdCourse);
// });
