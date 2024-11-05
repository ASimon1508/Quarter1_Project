// Load items from localStorage on page load
document.addEventListener("DOMContentLoaded", loadItems);

function loadItems() {
  const items = JSON.parse(localStorage.getItem("todoItems")) || [];
  items.forEach((item) => {
    addItemToList(item);
  });
}

function newElement() {
  var inputValue = document.getElementById("myInput").value;
  if (inputValue === "") {
    alert("You must write something!");
  } else {
    addItemToList(inputValue);
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
      ev.target.classList.toggle("checked");
    }
  },
  false
);

function addItemToList(value) {
  var li = document.createElement("li");
  var t = document.createTextNode(value);
  li.appendChild(t);

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
  const items = JSON.parse(localStorage.getItem("todoItems")) || [];
  const updatedItems = items.filter((item) => item !== itemToRemove);
  localStorage.setItem("todoItems", JSON.stringify(updatedItems));
}

function saveItems() {
  const items = Array.from(document.querySelectorAll("#myUL li")).map(
    (li) => li.firstChild.textContent
  );
  localStorage.setItem("todoItems", JSON.stringify(items));
}
