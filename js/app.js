const API = "https://devtask-ai-backend.onrender.com";

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function salvar() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

async function analisarIA(texto) {
  const res = await fetch(`${API}/ia`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ texto })
  });

  const data = await res.json();

  try {
    return JSON.parse(data);
  } catch {
    return { prioridade: "media", categoria: "Geral", sugestao: "-" };
  }
}

async function addTask() {
  const input = document.getElementById("taskInput");
  const texto = input.value;

  if (!texto) return;

  const ia = await analisarIA(texto);

  tasks.push({
    id: Date.now(),
    texto,
    prioridade: ia.prioridade,
    categoria: ia.categoria,
    sugestao: ia.sugestao
  });

  input.value = "";
  salvar();
  render();
}

function render() {
  document.getElementById("alta").innerHTML = "";
  document.getElementById("media").innerHTML = "";
  document.getElementById("baixa").innerHTML = "";

  tasks.forEach(task => {
    const el = document.createElement("div");
    el.className = "task";
    el.draggable = true;
    el.id = task.id;

    el.ondragstart = drag;

    el.innerHTML = `
      <strong>${task.texto}</strong>
      <p>${task.categoria}</p>
      <p>${task.sugestao}</p>
    `;

    document.getElementById(task.prioridade).appendChild(el);
  });
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
}

function allowDrop(ev) {
  ev.preventDefault();
}

function drop(ev) {
  ev.preventDefault();
  const id = ev.dataTransfer.getData("text");
  const status = ev.currentTarget.dataset.status;

  tasks = tasks.map(t => {
    if (t.id == id) t.prioridade = status;
    return t;
  });

  salvar();
  render();
}

render();
