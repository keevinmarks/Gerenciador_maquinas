document.addEventListener('DOMContentLoaded', function() {
    let computers = [];
    let editingIndex = null;

    const computerForm = document.getElementById('computerForm');
    const computerTable = document.getElementById('computerTable').getElementsByTagName('tbody')[0];
    const addButton = computerForm.querySelector('button[type="submit"]');

    updateTable();

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
            saidamt: document.getElementById('saidamt').value || '-',
            Patrimonio: document.getElementById('Patrimonio').value || '-',
            obs: document.getElementById('obs').value || '-'
        };

        salvarNoBanco(computer);
        editingIndex = null;
        addButton.textContent = 'Adicionar';
        computerForm.reset();
    });

    function updateTable(lista = null) {
        document.getElementById('loading').style.display = 'block';

        fetch('http://localhost/gerenciamento/api.php')
            .then(res => res.json())
            .then(data => {
                computers = data;
                renderTable(lista || data);
            })
            .catch(err => {
                console.error('Erro ao carregar dados:', err);
                alert('Erro ao carregar dados: ' + err);
            })
            .finally(() => {
                document.getElementById('loading').style.display = 'none';
            });
    }

    function renderTable(data) {
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

    window.pesquisar = function() {
        const termo = document.getElementById('pesquisa').value.toLowerCase();
        const filtro = document.getElementById('vinidobubumguloso').value.toLowerCase();

        const resultados = computers.filter(computer => {
            const campos = `${computer.id} ${computer.model} ${computer.Resp} ${computer.Setor}`.toLowerCase();
            const matchTermo = campos.includes(termo);
            const matchFiltro = filtro ? computer.model.toLowerCase().includes(filtro) : true;

            return matchTermo && matchFiltro;
        });

        renderTable(resultados);
    }

    window.botaodlt = function() {
        const selectedRow = document.querySelector('#computerTable tbody tr.selected');
        if (!selectedRow) {
            alert('Selecione um computador para deletar');
            return;
        }

        const index = selectedRow.dataset.index;
        const id = computers[index].id;

        if (confirm('Tem certeza que deseja excluir este computador?')) {
            fetch(`http://localhost/gerenciamento/api.php?id=${id}`, {
                method: 'DELETE'
            })
            .then(res => res.json())
            .then(data => {
                alert(data.mensagem || data.erro);
                updateTable();
            })
            .catch(err => {
                console.error('Erro ao deletar:', err);
                alert('Erro ao deletar: ' + err);
            });
        }
    }

    window.botaoedit = function() {
        const selectedRow = document.querySelector('#computerTable tbody tr.selected');
        if (!selectedRow) {
            alert('Selecione um computador para editar');
            return;
        }

        const index = selectedRow.dataset.index;
        const computer = computers[index];

        document.getElementById('id').value = computer.id;
        document.getElementById('status').value = computer.status;
        document.getElementById('model').value = computer.model;
        document.getElementById('entryDate').value = computer.entryDate;
        document.getElementById('Resp').value = computer.Resp;
        document.getElementById('Setor').value = computer.Setor;
        document.getElementById('pronto').value = computer.pronto;
        document.getElementById('exitDate').value = computer.exitDate !== '-' ? computer.exitDate : '';
        document.getElementById('saidamt').value = computer.saidamt !== '-' ? computer.saidamt : '';
        document.getElementById('Patrimonio').value = computer.Patrimonio !== '-' ? computer.Patrimonio : '';
        document.getElementById('obs').value = computer.obs !== '-' ? computer.obs : '';

        editingIndex = index;
        addButton.textContent = 'Salvar Edição';
        computerForm.scrollIntoView({ behavior: 'smooth' });
    }

    computerTable.addEventListener('click', function(e) {
        const row = e.target.closest('tr');
        if (!row) return;

        document.querySelectorAll('#computerTable tbody tr').forEach(r => {
            r.classList.remove('selected');
        });

        row.classList.add('selected');
    });

    function salvarNoBanco(computer) {
        fetch('http://localhost/gerenciamento/api.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(computer)
        })
        .then(res => res.json())
        .then(data => {
            alert(data.mensagem || data.erro);
            updateTable();
        })
        .catch(err => {
            console.error('Erro ao salvar:', err);
            alert('Erro ao salvar: ' + err);
        });
    }
});
