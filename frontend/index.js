const API_URL = '/animes';

let listaMidias = [];
let idEmEdicao = null;

const form = document.getElementById('mediaForm');
const notaSelect = document.getElementById('nota');
const btnSubmeter = form.querySelector('button[type="submit"]');
const searchBar = document.getElementById('searchBar');
const themeToggle = document.getElementById('themeToggle');

for (let i = 0; i <= 10; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    notaSelect.appendChild(option);
}

document.addEventListener('DOMContentLoaded', () => {
    buscarMidias();
    
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
        themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
});

async function buscarMidias() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erro ao buscar dados do servidor');
        
        listaMidias = await response.json();
        listaMidias.sort((a, b) => a.titulo.localeCompare(b.titulo));

        renderizarListas(listaMidias);
    } catch (error) {
        console.error("Erro ao carregar a lista:", error);
        alert("Não foi possível conectar à API. Verifique se o seu server.js continua rodando.");
    }
}

form.addEventListener('submit', async function(event) {
    event.preventDefault(); 

    const titulo = document.getElementById('titulo').value;
    const tipo = document.getElementById('tipo').value;
    const nota = document.getElementById('nota').value;
    const status = document.getElementById('status').value;

    const dadosMidia = { titulo, tipo, nota: Number(nota), status };

    try {
        if (idEmEdicao !== null) {
            const response = await fetch(`${API_URL}/${idEmEdicao}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosMidia)
            });

            if (!response.ok) throw new Error('Erro ao atualizar item');

            idEmEdicao = null;
            btnSubmeter.textContent = 'Salvar na Lista';
        } else {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosMidia)
            });

            if (!response.ok) throw new Error('Erro ao salvar item');
        }

        document.getElementById('titulo').value = '';
        searchBar.value = '';
        await buscarMidias();

    } catch (error) {
        console.error("Erro na operação:", error);
        alert("Erro ao salvar os dados no servidor.");
    }
});

async function deletarItem(id) {
    if (!confirm("Tem certeza que deseja deletar este item?")) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Erro ao deletar item');

        if (idEmEdicao === id) {
            idEmEdicao = null;
            btnSubmeter.textContent = 'Salvar na Lista';
            document.getElementById('titulo').value = '';
        }

        await buscarMidias();
    } catch (error) {
        console.error("Erro ao deletar:", error);
        alert("Não foi possível deletar o item no servidor.");
    }
}

function editarItem(id) {
    const item = listaMidias.find(item => item._id === id);
    
    if (item) {
        document.getElementById('titulo').value = item.titulo;
        document.getElementById('tipo').value = item.tipo;
        document.getElementById('nota').value = item.nota;
        document.getElementById('status').value = item.status;
        
        idEmEdicao = id;
        btnSubmeter.textContent = 'Salvar Alterações';
    }
}

searchBar.addEventListener('input', function() {
    const termoBusca = searchBar.value.toLowerCase();
    const listaFiltrada = listaMidias.filter(item => 
        item.titulo.toLowerCase().includes(termoBusca)
    );
    renderizarListas(listaFiltrada);
});

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    
    if (document.body.classList.contains('light-mode')) {
        localStorage.setItem('theme', 'light');
        themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
        localStorage.setItem('theme', 'dark');
        themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
});

function atualizarEstatisticas() {
    document.getElementById('totalMidias').textContent = listaMidias.length;
    
    const assistidos = listaMidias.filter(item => item.status === 'Assistido').length;
    document.getElementById('totalAssistidos').textContent = assistidos;
}

function renderizarListas(dadosParaRenderizar) {
    document.getElementById('listAnime').innerHTML = '';
    document.getElementById('listFilme').innerHTML = '';
    document.getElementById('listSerie').innerHTML = '';
    document.getElementById('listDesenho').innerHTML = '';

    atualizarEstatisticas();

    dadosParaRenderizar.forEach(item => {
        let statusIcon = 'fa-clock'; 
        if (item.status === 'Assistindo') statusIcon = 'fa-play';
        if (item.status === 'Assistido') statusIcon = 'fa-check-double';

        const itemHTML = `
            <div class="media-item">
                <span class="item-title">${item.titulo}</span>
                <div class="item-right-side">
                    <div class="item-details">
                        <span><i class="fa-solid fa-photo-film"></i> ${item.tipo}</span>
                        <span><i class="fa-solid fa-star" style="color: #eab308;"></i> ${item.nota}/10</span>
                        <span><i class="fa-solid ${statusIcon}"></i> ${item.status}</span>
                    </div>
                    <div class="item-actions">
                        <button onclick="editarItem('${item._id}')" class="btn-action btn-edit" title="Editar item"><i class="fa-solid fa-pen"></i></button>
                        <button onclick="deletarItem('${item._id}')" class="btn-action btn-delete" title="Deletar item"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
            </div>
        `;

        if (item.tipo === 'Anime') document.getElementById('listAnime').innerHTML += itemHTML;
        if (item.tipo === 'Filme') document.getElementById('listFilme').innerHTML += itemHTML;
        if (item.tipo === 'Série') document.getElementById('listSerie').innerHTML += itemHTML;
        if (item.tipo === 'Desenho') document.getElementById('listDesenho').innerHTML += itemHTML;
    });
}