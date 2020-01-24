namespace App {
	// Drag and Drop Interfaces
	export interface Draggable {
		// Project Item is here
		dragStartHandler(event: DragEvent): void;
		dragEndHandler(event: DragEvent): void;
	}

	export interface DragTarget {
		// Project list is here
		dragOverHandler(event: DragEvent): void;
		dropHandler(event: DragEvent): void;
		dragLeaveHandler(event: DragEvent): void;
	}
}
