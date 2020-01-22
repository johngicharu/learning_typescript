// class Department {
// 	// private name: string; // Public fields an be accessed outside the class
// 	private employees: string[] = []; // Cannot be accessed outside the class (Security measure)
// 	// Readonly prevents you from overwriting a property once it has been initialized. Adds extra type safety for the code therefore allowing you to be extra clear about what you are doing in the code. (Intentions must be clear).
// 	// Protected is similar to private, but it allows access to other classes which extend this class

// 	constructor(private readonly id: string, public name: string) {}

// 	describe(this: Department) {
// 		console.log(`Department ${this.id}: ${this.name}`);
// 	}

// 	addEmployee(employee: string) {
// 		this.employees.push(employee);
// 	}

// 	printEmployeeInfo() {
// 		console.log(this.employees.length);
// 		console.log(this.employees);
// 	}
// }

// class AccountingDepartment extends Department {
// 	private lastReport: string;

// 	get mostRecentReport() {
// 		if (this.lastReport) {
// 			return this.lastReport;
// 		}
// 		throw new Error("No report found");
// 	}

// 	showReports() {
// 		console.log(this.reports);
// 	}

// 	constructor(id: string, private reports: string[]) {
// 		super(id, "Accounting");
// 		this.lastReport = reports[0];
// 	}
// }

// const accountingDept = new AccountingDepartment("d1", ["Finance"]);
// console.log(accountingDept.mostRecentReport);
// // accountingDept.describe();
// // accountingDept.addEmployee("Max");
// // accountingDept.addEmployee("Manu");
// // accountingDept.employees[2] = "Anna";
// // accountingDept.printEmployeeInfo();

// class ITDepartment extends Department {
// 	constructor(id: string, public admins: string[]) {
// 		super(id, "IT"); // Calls the constructor of the parent class inside the child.
// 		this.admins = admins;
// 	}
// }

// const itDepartment = new ITDepartment("d2", ["Jdev"]);
// // itDepartment.describe();
// // console.log(itDepartment);
