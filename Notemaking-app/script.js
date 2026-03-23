let editIndex = null;
let notes = JSON.parse(localStorage.getItem("notes")) || [];

// Step 1: Select elements
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const addBtn = document.getElementById("addBtn");


function renderNotes() {
    const notesContainer = document.getElementById("notesContainer");
    notesContainer.innerHTML = "";

    notes.forEach((note, index) =>  {
        const noteDiv = document.createElement("div");
        noteDiv.classList.add("note");

        const time = new Date(note.createdAt).toLocaleString();

        noteDiv.innerHTML = `
            <h3>${note.title || "Untitled"}</h3>
            <p>${note.content.substring(0, 100)}</p>
            <small>${time}</small>
            <button class="deleteBtn">Delete</button>
        `;

        const deleteBtn = noteDiv.querySelector(".deleteBtn"); // This selects the delete button within the noteDiv so we can add a click event to it.

        deleteBtn.addEventListener("click", function (e) {
        e.stopPropagation(); // prevents edit click
 
        const confirmDelete = confirm("Delete this note?");  //Asks uder to confirm deletion
        if (!confirmDelete) return;
        
        if (editIndex === index) {
            titleInput.value = "";
            contentInput.value = "";
            editIndex = null;
        }
        notes.splice(index, 1); //removes the only note at that index from the array

        localStorage.setItem("notes", JSON.stringify(notes));
        renderNotes();
});

        noteDiv.addEventListener("click", function () {
        titleInput.value = note.title;
        contentInput.value = note.content;

        editIndex = index;
});

        notesContainer.appendChild(noteDiv);  //adds the noteDiv to the notesContainer so it shows up on the page
    });

}

// Step 2: Add click event
addBtn.addEventListener("click", function () {
    
    const title = titleInput.value;
    const content = contentInput.value;

    if (content.trim() === "") {
        alert("Content cannot be empty!");
        return;
    }

    if (editIndex !== null) {
        // ✏️ Update existing note
        notes[editIndex].title = title;
        notes[editIndex].content = content;
        notes[editIndex].createdAt = new Date();

        editIndex = null; // reset

    } else {
        // ➕ Create new note
        const note = {
            title,
            content,
            createdAt: new Date()
        };

        notes.push(note);
    }

    // Save + render
    localStorage.setItem("notes", JSON.stringify(notes));
    renderNotes();

    // Clear inputs
    titleInput.value = "";
    contentInput.value = "";
});

document.addEventListener("keydown", function (e) {        
    if (e.key === "Enter") {
        addBtn.click();
    }
});

renderNotes();