const API = "https://devtask-ai-backend.onrender.com";

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let chart;

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

  const resultado = await analisarIA(texto);

  tasks.push({
    texto,
    prioridade: resultado.prioridade,
    categoria: resultado.categoria,
    sugestao: resultado.sugestao
  });

  input.value = "";
  salvar();
  render();
}

function removerTask(index) {
  tasks.splice(index, 1);
  salvar();
  render();
}

function atualizarGrafico(alta, media, baixa) {
  const ctx = document.getElementById("grafico");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Alta", "Média", "Baixa"],
      datasets: [{
        data: [alta, media, baixa]
      }]
    }
  });
}

function render() {
  const container = document.getElementById("tasks");
  const search = document.getElementById("search").value.toLowerCase();
  const filter = document.getElementById("filter").value;

  container.innerHTML = "";

  let alta = 0, media = 0, baixa = 0;

  tasks
    .filter((t) =>
      t.texto.toLowerCase().includes(search) &&
      (filter === "all" || t.prioridade === filter)
    )
    .forEach((t, index) => {

      if (t.prioridade === "alta") alta++;
      if (t.prioridade === "media") media++;
      if (t.prioridade === "baixa") baixa++;

      container.innerHTML += `
        <div class="task ${t.prioridade}">
          <h3>${t.texto}</h3>
          <p>Prioridade: ${t.prioridade}</p>
          <p>Categoria: ${t.categoria}</p>
          <p>Sugestão: ${t.sugestao}</p>
          <button onclick="removerTask(${index})">Excluir</button>
        </div>
      `;
    });

  document.getElementById("alta").textContent = alta;
  document.getElementById("media").textContent = media;
  document.getElementById("baixa").textContent = baixa;

  atualizarGrafico(alta, media, baixa);
}

render();
