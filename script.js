document.addEventListener("DOMContentLoaded", function () {
	const noteContainer = document.getElementById("note-container");
	const newNoteButton = document.getElementById("new-note-button");
	const colorForm = document.getElementById("color-form");
	const colorInput = document.getElementById("color-input");

	let noteColor = localStorage.getItem('noteColor') ? localStorage.noteColor : null; // Stores the selected note color from the form.
	let noteIdCounter = localStorage.getItem('noteIdCounter') ? localStorage.noteIdCounter : 0; // Counter for assigning unique IDs to new notes.
	let notes = localStorage.getItem('notes') ? JSON.parse(localStorage.getItem('notes')) : [];
	//Load the notes from the local storage.
	if (notes.length > 0) {
		notes.forEach(note => {
			const noteElement = document.createElement("textarea");
			noteElement.setAttribute("data-note-id", note.id.toString()); // Stores the note ID to its data attribute.
			noteElement.value = note.content; // Sets the note ID as value.
			noteElement.className = "note"; // Sets a CSS class.
			noteElement.style.backgroundColor = noteColor; // Sets the note's background color using the last selected note color.
			noteContainer.appendChild(noteElement); // Appends it to the note container element as its child.
		});
	}

	function saveNotes(notes) {
		localStorage.setItem('notes', JSON.stringify(notes));
	}

	function addNewNote() {
		const id = noteIdCounter;
		const content = `Note ${id}`;

		const note = document.createElement("textarea");
		note.setAttribute("data-note-id", id.toString()); // Stores the note ID to its data attribute.
		note.value = content; // Sets the note ID as value.
		note.className = "note"; // Sets a CSS class.
		note.style.backgroundColor = noteColor; // Sets the note's background color using the last selected note color.
		noteContainer.appendChild(note); // Appends it to the note container element as its child.

		noteIdCounter++; // Increments the counter since the ID is used for this note.
		localStorage.setItem('noteIdCounter', noteIdCounter);

		notes.push({ id, content });
		saveNotes(notes);
	}

	colorForm.addEventListener("submit", function (event) {
		event.preventDefault(); // Prevents the default event.

		const newColor = colorInput.value.trim();  // Removes whitespaces.

		const notes = document.querySelectorAll(".note");
		for (const note of notes) {
			note.style.backgroundColor = newColor;
		}

		colorInput.value = ""; // Clears the color input field after from submission.

		noteColor = newColor; // Updates the stored note color with the new selection.
		localStorage.setItem('noteColor', newColor);
	});

	newNoteButton.addEventListener("click", function () {
		addNewNote();
	});

	document.addEventListener("dblclick", function (event) {
		if (event.target.classList.contains("note")) {
			event.target.remove(); // Removes the clicked note.

			//Delete the note from the saved notes in the local storage.
			let noteIndex = notes.findIndex(note => note.id == event.target.getAttribute("data-note-id"));
			notes.splice(noteIndex, 1);
			saveNotes(notes);
		}
	});

	noteContainer.addEventListener("blur", function (event) {
		if (event.target.classList.contains("note")) {
			//Update the note from the saved notes in the local storage.
			let noteIndex = notes.findIndex(note => note.id == event.target.getAttribute("data-note-id"));
			notes[noteIndex].content = event.target.value;
			saveNotes(notes);
		}
	}, true);

	window.addEventListener("keydown", function (event) {
		/* Ignores key presses made for color and note content inputs. */
		if (event.target.id === "color-input" || event.target.type === "textarea") {
			return;
		}

		/* Adds a new note when the "n" key is pressed. */
		if (event.key === "n" || event.key === "N") {
			addNewNote(); // Adds a new note.
		}
	});
});
