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

  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);

  document.getElementById("myUL").appendChild(li);

  // Close button functionality
  span.onclick = function () {
    var div = this.parentElement;
    div.remove(); // Remove the item from the DOM
    removeItemFromStorage(value); // Remove from local storage
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

function saveItems() {
  const items = Array.from(document.querySelectorAll("#myUL li")).map((li) => {
    return {
      text: li.firstChild.textContent,
      checked: li.classList.contains("checked"), // Save the checked state
    };
  });
  localStorage.setItem("todoItems", JSON.stringify(items));
}

