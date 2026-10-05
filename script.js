const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const filterBtns = document.querySelectorAll(".filter-btn");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");
const markAllBtn = document.getElementById("markAllBtn");

let tasks = [];
let currentFilter = "all";

function addTask(){
     const text = taskInput.value.trim();
     if(text === ""){
        return "";
     }

    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };
    tasks.push(newTask);
    saveTasks();

    applyFilter(); //calling showTasks for actual display of task lists inside ul
    updateCounter();
    taskInput.value = "";
}

addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (event) => {
    if(event.key == "Enter"){
        addTask();
    }
});


function showTasks(filteredTask){
    taskList.innerHTML = "";

    filteredTask.forEach((task)=>{
        const li = document.createElement("li");

        // checkbox
        const checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;

        if(task.completed){
            li.classList.add("completed");
        }

        // completed class
         checkbox.addEventListener('change', () => {
            task.completed = checkbox.checked;

            saveTasks();
              applyFilter();
              updateCounter();
        });

        // task text
        const span = document.createElement("span");
        span.textContent = task.text;

        // delete button
         const dlt = document.createElement("button");
         dlt.textContent = "Delete";
         dlt.classList.add("delete-btn");

        dlt.addEventListener('click', () => {
            tasks = tasks.filter((item) => {
                return item.id !== task.id;
            });

            saveTasks(); 
            applyFilter();
            updateCounter();
        })
 
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(dlt);
        taskList.appendChild(li);   
    });
}

function updateCounter(){
    const activeTasks = tasks.filter((current) => {
        return current.completed == false;
    })
    const count = activeTasks.length;
    taskCount.textContent = count + " task left";
}

function applyFilter(){
    let filteredTask;
    if(currentFilter === "all"){
        filteredTask = tasks;
    }
    else if(currentFilter === "active"){
        filteredTask = tasks.filter((task) => {
            return task.completed === false;
        });
    }
    else if(currentFilter === "completed"){
        filteredTask = tasks.filter((task) => {
            return task.completed === true;
        });
    }
    showTasks(filteredTask);
}
filterBtns.forEach((button) => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;
        filterBtns.forEach((btn) => {
            btn.classList.remove("active");
    });
    button.classList.add("active");
    applyFilter();
    });
});

clearCompletedBtn.addEventListener("click", () => {
    tasks = tasks.filter((task) => {
        return task.completed === false;
    });

    saveTasks();
    applyFilter();
    updateCounter();
});


markAllBtn.addEventListener("click", () => {
    tasks.forEach((task) => {
        task.completed = true;
    });

    saveTasks();
    applyFilter();
    updateCounter();
});


function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = localStorage.getItem("tasks");

    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
}
loadTasks();
applyFilter();
updateCounter();