// Intersection Types
type Admin = {
	name: string;
	priviledges: string[];
};

type Employee = {
	name: string;
	startDate: Date;
};

// This is an intersection, the &, is the intersection operator
type ElevatedEmployee = Admin & Employee;

const e1: ElevatedEmployee = {
	name: "John",
	priviledges: ["create-server"],
	startDate: new Date()
};

type Combinable = string | number;
type Numeric = number | boolean;
type Universal = Combinable & Numeric;

// TYPE GUARDS
// A common one is the typeof
// FUNCTION OVERLOADS
function add(a: number, b: number): number;
function add(a: string, b: string): string;
function add(a: string, b: number): string;
function add(a: number, b: string): string;
function add(a: Combinable, b: Combinable) {
	if (typeof a === "string" || typeof b === "string") {
		return a.toString() + b.toString();
	}
	return a + b;
}

// With the overloads, js can better infer the types
const r1 = add(2, 3);
const r2 = add(2, "3");
const r3 = add("2", 3);

type UnknownEmployee = Employee | Admin;

// Another typeguard is the in keyword in js
function printEmployeeInfo(emp: UnknownEmployee) {
	if ("priviledges" in emp) {
		console.log("Priviledges: " + emp.priviledges);
	}
	if ("startDate" in emp) {
		console.log("Start Date: " + emp.startDate);
	}
}

class Car {
	drive() {
		console.log("Driving...");
	}
}

class Truck {
	drive() {
		console.log("Driving a truck...");
	}

	loadCargo(amount: number) {
		console.log("Loading cargo..." + amount);
	}
}

type Vehicle = Car | Truck;

const v1 = new Car();
const v2 = new Truck();

// instanceof can be used to check if the object was based on a specific class. However, this cannot be used for interfaces as they are not compiled into javascript nor are they supported.
function useVehicle(vehicle: Vehicle) {
	vehicle.drive();
	if (vehicle instanceof Truck) {
		vehicle.loadCargo(1000);
	}
}

// useVehicle(v1);
// useVehicle(v2);

// DISCRIMINATED UNIONS
interface Bird {
	type: "bird";
	flyingSpeed: number;
}

interface Horse {
	type: "horse";
	runningSpeed: number;
}

type Animal = Bird | Horse;

function moveAnimal(animal: Animal) {
	// In this instance, using in or instanceof is out of the question as interfaces are not compiled to js and we can mispell the variables. Furthermore, there can be countless types of animals and we definately cannot type all that.
	let speed;
	switch (animal.type) {
		case "bird":
			speed = animal.flyingSpeed;
			break;
		case "horse":
			speed = animal.runningSpeed;
	}
	console.log("Moving with speed: " + speed);
}

// TYPE CASTING
// Version 1 typecasting
// const userInputElement = <HTMLInputElement>document.getElementById("user-input");

// Version 2 typecasting
// const userInputElement = document.getElementById(
// 	"user-input"
// )! as HTMLInputElement;

// Version 3 typecasting
const userInputElement = document.getElementById("user-input");

if (userInputElement) {
	(userInputElement as HTMLInputElement).value = "Hi there!";
}

// INDEX TYPES
interface ErrorContainer {
	id: string; // cannot be a number as there is an index type of string
	[prop: string]: string;
}

const errorBag: ErrorContainer = {
	id: "1",
	email: "Not a valid email",
	username: "Must start with a capital character"
};
