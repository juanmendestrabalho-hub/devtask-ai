const API = "https://devtask-ai-backend.onrender.com";

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function salvar() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

async function analisarIA(texto) {
  const res = await fetch(`${API}/ia`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ texto })
  });

  const data = await res.json();

  try {
    return JSON.parse(data);
  } catch {
    return {
      prioridade: "media",
      categoria: "Geral",
      sugestao: "-",
      tempo_estimado: "-"
    };
  }
}

async function addTask() {
  const input = document.getElementById("taskInput");
  const texto = input.value;

  if (!texto) return;

  const btn = document.querySelector("button");
  btn.innerText = "...";

  const ia = await analisarIA(texto);

  tasks.push({
    id: Date.now(),
    texto,
    prioridade: ia.prioridade,
    categoria: ia.categoria,
    sugestao: ia.sugestao,
    tempo: ia.tempo_estimado
  });

  input.value = "";
  btn.innerText = "+";

  salvar();
  render();
}

function render() {
  ["alta","media","baixa"].forEach(c => {
    document.getElementById(c).innerHTML = "";
  });

  tasks.forEach(task => {
    const el = document.createElement("div");
    el.className = "task";
    el.draggable = true;
    el.id = task.id;

    el.ondragstart = drag;

    el.innerHTML = `
      <strong>${task.texto}</strong>
      <p>${task.categoria}</p>
      <p>💡 ${task.sugestao}</p>
      <p>⏱ ${task.tempo}</p>
    `;

    document.getElementById(task.prioridade).appendChild(el);
  });

  analytics();
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

function analytics() {
  const total = tasks.length;
  const alta = tasks.filter(t => t.prioridade === "alta").length;

  if (total > 0) {
    console.log("Produtividade:", ((alta / total) * 100).toFixed(1) + "%");
  }
}

render();
