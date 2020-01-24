/// <reference path="drag-drop-interfaces.ts" />
/// <reference path="project-model.ts" />

namespace App {
	// Project Type
	// Project State Management

	type Listener<T> = (items: T[]) => void;

	// State Base Class
	abstract class State<T> {
		protected listeners: Listener<T>[] = [];

		addListener(listenerFn: Listener<T>) {
			this.listeners.push(listenerFn);
		}
	}

	class ProjectState extends State<Project> {
		private projects: Project[] = [];
		static instance: ProjectState;

		private constructor() {
			super();
		}
		static getInstance() {
			if (this.instance) {
				return this.instance;
			}
			this.instance = new ProjectState();
			return this.instance;
		}

		addProject(title: string, description: string, people: number) {
			const newProject = new Project(
				Math.random().toString(),
				title,
				description,
				people,
				ProjectStatus.Active
			);
			this.projects.push(newProject);
			for (const listenerFn of this.listeners) {
				listenerFn(this.projects.slice()); // Only copies of the projects are sent to the listeners. Hence preventing weird bugs.
			}
		}

		moveProject(projectId: string, newStatus: ProjectStatus) {
			const project = this.projects.find(project => project.id === projectId);

			if (project && project.status !== newStatus) {
				project.status = newStatus;
				this.updateListeners();
			}
		}

		private updateListeners() {
			for (const listenerFn of this.listeners) {
				listenerFn(this.projects.slice());
			}
		}
	}

	const projectState = ProjectState.getInstance(); // Guarantees we will only ever work with one state for the project.

	// Validation
	interface Validatable {
		value: string | number;
		required?: boolean;
		minLength?: number;
		maxLength?: number;
		min?: number;
		max?: number;
	}

	function validate(validatableInput: Validatable) {
		let isValid = true;

		if (validatableInput.required) {
			isValid =
				isValid && validatableInput.value.toString().trim().length !== 0;
		}

		if (
			validatableInput.minLength != null &&
			typeof validatableInput.value === "string"
		) {
			isValid =
				isValid && validatableInput.value.length >= validatableInput.minLength;
		}

		if (
			validatableInput.maxLength != null &&
			typeof validatableInput.value === "string"
		) {
			isValid =
				isValid && validatableInput.value.length <= validatableInput.maxLength;
		}

		if (
			validatableInput.min != null &&
			typeof validatableInput.value === "number"
		) {
			isValid = isValid && validatableInput.value >= validatableInput.min;
		}

		if (
			validatableInput.max != null &&
			typeof validatableInput.value === "number"
		) {
			isValid = isValid && validatableInput.value <= validatableInput.max;
		}

		return isValid;
	}

	// Autobind Decorator
	function AutoBind(
		_target: any,
		_methodName: string,
		descriptor: PropertyDescriptor
	) {
		const originalMethod = descriptor.value;
		const adjustedDescriptor: PropertyDescriptor = {
			configurable: true,
			get() {
				const boundFn = originalMethod.bind(this);
				return boundFn;
			}
		};
		return adjustedDescriptor;
	}

	// Component Base Class
	abstract class Component<T extends HTMLElement, U extends HTMLElement> {
		templateElement: HTMLTemplateElement;
		hostElement: T;
		element: U;

		constructor(
			templateId: string,
			hostElementId: string,
			insertAtStart?: boolean,
			newElementId?: string
		) {
			this.templateElement = document.getElementById(
				templateId
			)! as HTMLTemplateElement;
			this.hostElement = document.getElementById(hostElementId)! as T;

			const importedNode = document.importNode(
				this.templateElement.content,
				true
			);
			this.element = importedNode.firstElementChild as U;
			if (newElementId) {
				this.element.id = newElementId;
			}

			this.attach(insertAtStart);
		}

		private attach(insertAtBeginning?: boolean) {
			this.hostElement.insertAdjacentElement(
				insertAtBeginning ? "afterbegin" : "beforeend",
				this.element
			);
		}

		abstract configure(): void;

		abstract renderContent(): void;
	}

	// Project Item
	class ProjectItem extends Component<HTMLUListElement, HTMLLIElement>
		implements Draggable {
		private project: Project;

		get persons() {
			if (this.project.numOfPeople === 1) {
				return "1 Person";
			} else {
				return `${this.project.numOfPeople} Persons`;
			}
		}

		constructor(hostId: string, project: Project) {
			super("single-project", hostId, false, project.id);
			this.project = project;

			this.configure();
			this.renderContent();
		}

		@AutoBind
		dragStartHandler(e: DragEvent) {
			e.dataTransfer!.setData("text/plain", this.project.id);
			e.dataTransfer!.effectAllowed = "move";
		}

		@AutoBind
		dragEndHandler(_e: DragEvent) {
			// console.log(e.target);
		}

		configure() {
			this.element.addEventListener("dragstart", this.dragStartHandler);
			this.element.addEventListener("dragend", this.dragEndHandler);
		}

		renderContent() {
			this.element.querySelector("h2")!.textContent = this.project.title;
			this.element.querySelector(
				"h3"
			)!.textContent = `${this.persons} Assigned`;
			this.element.querySelector("p")!.textContent = this.project.description;
		}
	}

	// Project List Class
	class ProjectList extends Component<HTMLDivElement, HTMLElement>
		implements DragTarget {
		assignedProjects: Project[];

		constructor(private type: "active" | "finished") {
			super("project-list", "app", false, `${type}-projects`);

			this.assignedProjects = [];

			this.configure();
			this.renderContent();
		}

		@AutoBind
		dragOverHandler(e: DragEvent) {
			if (e.dataTransfer && e.dataTransfer.types[0] === "text/plain") {
				e.preventDefault();
				const listEl = this.element.querySelector("ul")!;
				listEl.classList.add("droppable");
			}
		}

		@AutoBind
		dropHandler(e: DragEvent) {
			e.preventDefault();
			const projectId = e.dataTransfer!.getData("text/plain");
			projectState.moveProject(
				projectId,
				this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
			);
		}

		@AutoBind
		dragLeaveHandler(_e: DragEvent) {
			const listEl = this.element.querySelector("ul")!;
			listEl.classList.remove("droppable");
		}

		configure() {
			this.element.addEventListener("dragover", this.dragOverHandler);
			this.element.addEventListener("dragleave", this.dragLeaveHandler);
			this.element.addEventListener("drop", this.dropHandler);
			projectState.addListener((projects: Project[]) => {
				const relevantProjects = projects.filter(project => {
					if (this.type === "active") {
						return project.status === ProjectStatus.Active;
					} else {
						return project.status === ProjectStatus.Finished;
					}
				});
				this.assignedProjects = relevantProjects;
				this.renderProjects();
			});
		}

		renderContent() {
			const listId = `${this.type}-project-list`;
			this.element.querySelector("ul")!.id = listId;
			this.element.querySelector(
				"h2"
			)!.textContent = `${this.type.toUpperCase()} Projects`;
		}

		private renderProjects() {
			const listEl = document.getElementById(
				`${this.type}-project-list`
			)! as HTMLUListElement;
			listEl.innerHTML = "";
			for (const projectItem of this.assignedProjects) {
				new ProjectItem(this.element.querySelector("ul")!.id, projectItem);
			}
		}
	}

	// ProjectInput Class
	class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
		titleInputElement: HTMLInputElement;
		descriptionInputElement: HTMLTextAreaElement;
		peopleInputElement: HTMLInputElement;

		constructor() {
			super("project-input", "app", true, "user-input");

			this.titleInputElement = this.element.querySelector(
				"#title"
			)! as HTMLInputElement;

			this.descriptionInputElement = this.element.querySelector(
				"#description"
			)! as HTMLTextAreaElement;

			this.peopleInputElement = this.element.querySelector(
				"#people"
			)! as HTMLInputElement;

			this.configure();
		}

		configure() {
			this.element.addEventListener("submit", this.submitHandler);
		}

		renderContent() {}

		private gatherUserInput(): [string, string, number] | void {
			const enteredTitle = this.titleInputElement.value;
			const enteredDescription = this.descriptionInputElement.value;
			const enteredPeople = this.peopleInputElement.value;

			const titleValidatable: Validatable = {
				value: enteredTitle,
				required: true
			};

			const descriptionValidatable: Validatable = {
				value: enteredDescription,
				required: true,
				minLength: 5
			};

			const peopleValidatable: Validatable = {
				value: +enteredPeople,
				required: true,
				min: 1,
				max: 5
			};

			if (
				!validate(titleValidatable) ||
				!validate(descriptionValidatable) ||
				!validate(peopleValidatable)
			) {
				alert("Invalid Input, please try again!");
				return;
			} else {
				return [enteredTitle, enteredDescription, +enteredPeople];
			}
		}

		private clearInputs() {
			this.titleInputElement.value = "";
			this.descriptionInputElement.value = "";
			this.peopleInputElement.value = "";
		}

		@AutoBind
		private submitHandler(e: Event) {
			e.preventDefault();
			const userInput = this.gatherUserInput();
			if (Array.isArray(userInput)) {
				const [title, description, people] = userInput;
				projectState.addProject(title, description, people);
			}
			this.clearInputs();
		}
	}

	new ProjectInput();
	new ProjectList("active");
	new ProjectList("finished");
}
