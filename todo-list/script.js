// Step 1: Get elements
const input = document.getElementById("taskInput");
const button = document.querySelector("button");
const list = document.getElementById("taskList");

// Step 2: Create reusable function
function addTask() {       

    const taskText = input.value.trim();

    // Prevent empty tasks
    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    const li = document.createElement("li");

   // Create text
    const span = document.createElement("span");
    span.textContent = taskText;

    span.addEventListener("click", function () {
    span.classList.toggle("completed");      /* Toggle the "completed" class on click to mark task as completed or not */
   });

    li.appendChild(span);

  // Create delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";

  // Add click event to delete button
    deleteBtn.addEventListener("click", function () {
    li.remove();
   });

  // Append button inside li
    li.appendChild(deleteBtn);

    list.appendChild(li);

    input.value = "";

}


// Step 3: Button click
button.addEventListener("click", addTask);

// Step 4: Enter key support
input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        addTask();
    }

});



