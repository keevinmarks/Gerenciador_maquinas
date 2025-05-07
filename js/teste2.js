document.addEventListener('DOMContentLoaded', function() {
    // Array para armazenar os computadores
    let computers = JSON.parse(localStorage.getItem('computers')) || [];
    let editingIndex = null; // Índice do computador sendo editado

    // Elementos do DOM
    const computerForm = document.getElementById('computerForm');
    const computerTable = document.getElementById('computerTable').getElementsByTagName('tbody')[0];
    const addButton = computerForm.querySelector('button[type="submit"]');
    const searchInput = document.getElementById('pesquisa');
    const modelFilter = document.getElementById('vinidobubumguloso');
    const reasonFilter = document.getElementById('edbrock');

    // Inicializar a tabela
    updateTable();

    // Função para adicionar/editar um computador
    computerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const computer = {
            id: document.getElementById('id').value,
            status: document.getElementById('status').value,
            model: document.getElementById('model').value,
            entryDate: document.getElementById('entryDate').value,
            Resp: document.getElementById('Resp').value,
            Setor: document.getElementById('Setor').value,
            pronto: document.getElementById('pronto').value,
            exitDate: document.getElementById('exitDate').value || '-',
            saidamt: document.getElementById('saidamt').value,
            Patrimonio: document.getElementById('Patrimonio').value,
            obs: document.getElementById('obs').value
        };

        if (editingIndex !== null) {
            // Editar computador existente
            computers[editingIndex] = computer;
            editingIndex = null;
            addButton.textContent = 'Adicionar';
        } else {
            // Adicionar novo computador
            computers.push(computer);
        }

        saveToLocalStorage();
        updateTable();
        computerForm.reset();
    });

    // Função para atualizar a tabela
    function updateTable(filteredComputers = null) {
        const data = filteredComputers || computers;
        computerTable.innerHTML = '';

        data.forEach((computer, index) => {
            const row = computerTable.insertRow();
            row.dataset.index = index;

            row.innerHTML = `
                <td>${computer.id}</td>
                <td>${computer.status}</td>
                <td>${computer.model}</td>
                <td>${computer.entryDate}</td>
                <td>${computer.Resp}</td>
                <td>${computer.Setor}</td>
                <td>${computer.pronto}</td>
                <td>${computer.exitDate}</td>
                <td>${computer.saidamt}</td>
                <td>${computer.Patrimonio}</td>
                <td>${computer.obs}</td>
            `;
        });
    }

    // Função de pesquisa
    window.pesquisar = function() {
        const termo = searchInput.value.toLowerCase();
        const filtroModelo = modelFilter.value.toLowerCase();
        const filtroMotivo = reasonFilter.value.toLowerCase();

        const resultados = computers.filter(computer => {
            const id = (computer.id || '').toLowerCase();
            const model = (computer.model || '').toLowerCase();
            const resp = (computer.Resp || '').toLowerCase();
            const setor = (computer.Setor || '').toLowerCase();
            const saidamt = (computer.saidamt || '').toLowerCase();

            const matchTermo =
                id.includes(termo) ||
                model.includes(termo) ||
                resp.includes(termo) ||
                setor.includes(termo);

            const matchModelo = filtroModelo ? model.includes(filtroModelo) : true;
            const matchMotivo = filtroMotivo ? saidamt.includes(filtroMotivo) : true;

            return matchTermo && matchModelo && matchMotivo;
        });

        updateTable(resultados);
    };

    // Função para deletar computador
    window.botaodlt = function() {
        const selectedRow = document.querySelector('#computerTable tbody tr.selected');
        if (!selectedRow) {
            alert('Selecione um computador para deletar');
            return;
        }

        if (confirm('Tem certeza que deseja excluir este computador?')) {
            const index = selectedRow.dataset.index;
            computers.splice(index, 1);
            saveToLocalStorage();
            updateTable();

            // Se estava editando o item deletado, cancela a edição
            if (editingIndex === index) {
                editingIndex = null;
                computerForm.reset();
                addButton.textContent = 'Adicionar';
            }
        }
    };

    // Função para editar computador
    window.botaoedit = function() {
        const selectedRow = document.querySelector('#computerTable tbody tr.selected');
        if (!selectedRow) {
            alert('Selecione um computador para editar');
            return;
        }

        const index = selectedRow.dataset.index;
        const computer = computers[index];

        // Preencher formulário com os dados do computador
        document.getElementById('id').value = computer.id;
        document.getElementById('status').value = computer.status;
        document.getElementById('model').value = computer.model;
        document.getElementById('entryDate').value = computer.entryDate;
        document.getElementById('Resp').value = computer.Resp;
        document.getElementById('Setor').value = computer.Setor;
        document.getElementById('pronto').value = computer.pronto;
        document.getElementById('exitDate').value = computer.exitDate === '-' ? '' : computer.exitDate;
        document.getElementById('saidamt').value = computer.saidamt;
        document.getElementById('Patrimonio').value = computer.Patrimonio;
        document.getElementById('obs').value = computer.obs;

        // Configurar para edição
        editingIndex = index;
        addButton.textContent = 'Salvar Edição';

        // Rolagem suave para o formulário
        computerForm.scrollIntoView({ behavior: 'smooth' });
    };

    // Selecionar linha da tabela
    computerTable.addEventListener('click', function(e) {
        const row = e.target.closest('tr');
        if (!row) return;

        // Remover seleção de todas as linhas
        document.querySelectorAll('#computerTable tbody tr').forEach(r => {
            r.classList.remove('selected');
        });

        // Adicionar seleção à linha clicada
        row.classList.add('selected');
    });

    // Salvar no localStorage
    function saveToLocalStorage() {
        localStorage.setItem('computers', JSON.stringify(computers));
    }
});