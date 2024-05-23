// The variable (to connect everything in index HTML)
const taskInput = document.querySelector(".task-input input"),
  filters = document.querySelectorAll(".filters span"),
  clearAll = document.querySelector(".clear-btn"),
  taskBox = document.querySelector(".task-box");

// for edit the to do list
let editId,
  isEditTask = false,
  todos = JSON.parse(localStorage.getItem("todo-list"));

// for connecting with property in style.css
filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector("span.active").classList.remove("active");
    btn.classList.add("active");
    showTodo(btn.id);
  });
});

// create function to add list in class (.task-box)
function showTodo(filter) {
  let listTag = "";
  if (todos) {
    todos.forEach((todo, id) => {
      let completed = todo.status == "completed" ? "checked" : "";
      // logical OR operator (||)
      if (filter == todo.status || filter == "all") {
        listTag += `<li class="task">
                <label for="${id}">
                    <input type="checkbox" onclick="updateStatus(this)" id="${id}" ${completed}>
                    <p class="${completed}">${todo.name}</p>
                </label>
                <div class="settings">
                    <i class="uil uil-ellipsis-h" onclick="showMenu(this)"></i>
                    <ul class="task-menu">
                        <li  onclick='editTask(${id}, "${todo.name}")'>
                            <i class="uil uil-pen"></i>Edit
                        </li>
                        <li onclick='editTask(${id}, "${filter}")'>
                            <i class="uil uil-trash"></i>Delete
                        </li>
                    </ul>
                </div>
            </li>`;
      }
    });
  }

  // set the inner HTML of taskbox to either listTag or a message indicating no tasks
  taskBox.innerHTML =
    listTag || `<span>Kamu tidak memiliki tugas apa pun di sini</span>`;

  // check if there any tasks present
  let checkTask = taskBox.querySelectorAll(".task");
  if (!checkTask.length) {
    // if no tasks present, add active class to clear All button
    clearAll.classList.remove("active");
  } else {
    // If tasks present, add active class to clearAll button
    clearAll.classList.add("active");
  }
  // check if the height of taskBox is more than or equal to 265
  if (taskBox.offsetHeight >= 265) {
    // if height is more, add overflow class to taskBox
    taskBox.classList.add("overflow");
  } else {
    // If height is less, remove overflow class from taskBox
    taskBox.classList.remove("overflow");
  }
}
// to show all the lists
showTodo("all");

/* this even listener is triggered when a key  is released in the taskInput element */
taskInput.addEventListener("keyup", (e) => {
  let userTask = taskInput.value.trim();
  if (e.key == "Enter" && userTask) {
    if (!isEditTask) {
      todos = !todos ? [] : todos;
      let taskInfo = { name: userTask, status: "pending" };
      todos.push(taskInfo);
    } else {
      isEditTask = false;
      todos[editId].name = userTask;
    }
    taskInput.value = "";
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(document.querySelector("span.active").id);
  }
});

/* This event listener is triggered when the clearAll element is clicked it clears all the task */
clearAll.addEventListener("click", () => {
  isEditTask = false;
  todos.splice(0,todos.length);
  localStorage.setItem("todo-list",JSON.stringify(todos));
  showTodo();
});

/* displaying a menu associated with a selectedTask */
function showMenu(selectedTask) {
  let menuDiv = selectedTask.parentElement.lastElementChild;
  menuDiv.classList.add("show");
  document.addEventListener("click",(e) => {
    if(e.target.tagName != "I" || e.target != selectedTask) {
      menuDiv.classList.remove("show");
    }
  });
}

/* update the status of a selected task */
function updateStatus(selectedTask){
  let taskName = selectedTask.parentElement.lastElementChild;
  // check if there any tasks present
  if(selectedTask.checked) {
    taskName.classList.add("checked");
    todos[selectedTask.id].status = "completed";
  } else {
    taskName.classList.remove("checked");
    todos[selectedTask.id].status = "pending";
  }
  // update the local storage with the updated todos array
  localStorage.setItem("todo-list",JSON.stringify(todos));
}

function editTask(taskID,textName) {
  editId = taskID;
  isEditTask = true;
  taskInput.value = textName;
  taskInput.focus();
  taskInput.classList.add("active");
}

function deleteTask(deleteID,filter) {
  isEditTask = false;
  todos.splice(deleteID,1);
  localStorage.setItem("todo-list",JSON.stringify(todos));
  showTodo(filter);
}