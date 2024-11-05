// Load items from localStorage on page load
document.addEventListener("DOMContentLoaded", loadItems);

function loadItems() {
  const items = JSON.parse(localStorage.getItem("todoItems")) || [];
  items.forEach((item) => {
    addItemToList(item.text, item.checked); // Pass both text and checked state
  });
}

function newElement() {
  var inputValue = document.getElementById("myInput").value;
  if (inputValue === "") {
    alert("You must write something!");
  } else {
    addItemToList(inputValue, false); // New item is not checked initially
    saveItems();
  }
  document.getElementById("myInput").value = "";
}

// Add a "checked" symbol when clicking on a list item
var list = document.querySelector("ul");
list.addEventListener(
  "click",
  function (ev) {
    if (ev.target.tagName === "LI") {
      const li = ev.target;
      li.classList.toggle("checked");

      // Update checked state in localStorage
      updateCheckedState(li.textContent, li.classList.contains("checked"));
      saveItems();
    }
  },
  false
);

function addItemToList(value, isChecked) {
  var li = document.createElement("li");
  var t = document.createTextNode(value);
  li.appendChild(t);

  if (isChecked) {
    li.classList.add("checked"); // If item is checked, add the class
  }

  // Create the close button
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);

  // Create the edit button
  var editButton = document.createElement("BUTTON");
  var editText = document.createTextNode("Edit");
  editButton.className = "edit";
  editButton.appendChild(editText);
  li.appendChild(editButton);

  // Make the list item draggable
  li.setAttribute("draggable", "true");

  // Append to the list
  document.getElementById("List").appendChild(li);

  // Close button functionality
  span.onclick = function () {
    var div = this.parentElement;
    div.remove(); // Remove the item from the DOM
    removeItemFromStorage(value); // Remove from local storage
  };

  // Edit button functionality
  editButton.onclick = function () {
    editItem(li);
  };

  // Add drag events for this item
  li.addEventListener("dragstart", handleDragStart);
  li.addEventListener("dragover", handleDragOver);
  li.addEventListener("drop", handleDrop);
  li.addEventListener("dragend", handleDragEnd);
}

function handleDragStart(event) {
  // Store the dragged element in the drag event's data
  event.dataTransfer.setData("text", event.target.innerText);
  event.target.classList.add("dragging"); // Add a "dragging" class for styling
}

function handleDragOver(event) {
  event.preventDefault(); // This is necessary to allow dropping
}

function handleDrop(event) {
  event.preventDefault(); // Prevent default behavior (open as link)

  const draggedText = event.dataTransfer.getData("text");
  const droppedItem = event.target;

  // If the dropped target is a list item, we need to reorder
  if (droppedItem.tagName === "LI" && draggedText !== droppedItem.innerText) {
    // Find the dragged item in the list
    const draggedItem = [...document.querySelectorAll("ul li")].find(
      (li) => li.innerText === draggedText
    );

    // Insert the dragged item before or after the dropped item
    const parent = droppedItem.parentNode;
    if (
      droppedItem.compareDocumentPosition(draggedItem) &
      Node.DOCUMENT_POSITION_FOLLOWING
    ) {
      parent.insertBefore(draggedItem, droppedItem);
    } else {
      parent.insertBefore(draggedItem, droppedItem.nextSibling);
    }

    draggedItem.classList.add("dropped"); // Add drop animation class
    saveItems(); // Save the new order to localStorage
  }

  // Remove the dragging class
  const allItems = document.querySelectorAll("li");
  allItems.forEach((item) => item.classList.remove("dragging"));
}

function handleDragEnd(event) {
  // Remove the dragging effect when the drag ends
  event.target.classList.remove("dragging");
}

function editItem(li) {
  const currentText = li.firstChild.textContent; // Get the current text of the list item
  const inputField = document.createElement("input"); // Create an input field
  inputField.value = currentText; // Set the current text as the input value

  // Replace the list item text with the input field
  li.firstChild.replaceWith(inputField);

  // Change the "Edit" button to a "Save" button
  const editButton = li.querySelector(".edit");
  editButton.textContent = "Save";
  editButton.className = "save"; // Change button class to "save" to identify it

  // Handle the saving of the edited text
  editButton.onclick = function () {
    const newText = inputField.value;
    if (newText.trim() !== "") {
      li.firstChild.replaceWith(document.createTextNode(newText)); // Replace input with new text

      // Update the text in localStorage
      updateItemText(currentText, newText);

      // Revert button to "Edit"
      editButton.textContent = "Edit";
      editButton.className = "edit";
      editButton.onclick = function () {
        editItem(li); // Restore edit functionality if user clicks "Edit" again
      };
      saveItems(); // Save the updated list to localStorage
    } else {
      alert("Text cannot be empty!");
    }
  };
}

function removeItemFromStorage(itemToRemove) {
  let items = JSON.parse(localStorage.getItem("todoItems")) || [];
  items = items.filter((item) => item.text !== itemToRemove); // Remove item by text
  localStorage.setItem("todoItems", JSON.stringify(items));
}

function updateCheckedState(itemText, isChecked) {
  const items = JSON.parse(localStorage.getItem("todoItems")) || [];
  const item = items.find((item) => item.text === itemText);
  if (item) {
    item.checked = isChecked; // Update the checked state of the item
    localStorage.setItem("todoItems", JSON.stringify(items)); // Save the updated list
  }
}

function updateItemText(oldText, newText) {
  const items = JSON.parse(localStorage.getItem("todoItems")) || [];
  const item = items.find((item) => item.text === oldText);
  if (item) {
    item.text = newText; // Update the text of the item
    localStorage.setItem("todoItems", JSON.stringify(items)); // Save the updated list
  }
}

function saveItems() {
  const items = Array.from(document.querySelectorAll("#List li")).map((li) => {
    return {
      text: li.firstChild.textContent,
      checked: li.classList.contains("checked"), // Save the checked state
    };
  });
  localStorage.setItem("todoItems", JSON.stringify(items));
}
