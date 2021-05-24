'use strict'

const openModal = () => document.querySelector('#modal')
    .classList.add('active')

const closeModal = () => document.querySelector('#modal')
    .classList.remove('active')

const clearInput = () => {
    const inputs = Array.from(document.querySelectorAll('.modal input'))
    inputs.forEach(input => input.value = '')
    document.querySelector('#nome').dataset.index = ''
}

const readDB = () => JSON.parse(localStorage.getItem('db')) ?? [];

const setDB = (db) => localStorage.setItem('db', JSON.stringify(db));

const insertDB = (client) =>{
    // 1 - Ler o banco
    const db = readDB();
    // 2 - Adicionar o novo cliente
    db.push(client);
    // 3 - enviar ou fechar o banco de dados
    setDB(db);
};

const updateClient = (client, index) =>{
    const db = readDB();
    db[index] = client;
    setDB(db);
}

const clearTable = () => {
    const recordClient = document.querySelector('#tabelaClientes tbody');
    while (recordClient.firstChild) {
        recordClient.removeChild(recordClient.lastChild);
    }
};

const createRow = (client, index) => {
    const recordClient = document.querySelector('#tabelaClientes tbody');
    const newTr = document.createElement('tr');
    newTr.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.email}</td>
        <td>${client.celular}</td>
        <td>${client.cidade}</td>
        <td>
            <button type="button" class="button blue" data-action="editar-${index}">Editar</button>
            <button type="button" class="button red" data-action="deletar-${index}">Deletar</button>
        </td>
    `
    recordClient.appendChild(newTr);
}

const updateTable = () => {
    // 0 - limpar tabela
    clearTable();
    // 1 - Ler obanco de dados
    const db = readDB();
    // 2 - Criar linhas na tbody com os registros
    db.forEach(createRow)
}

const isValidForm = () => document.querySelector('.form').reportValidity();

const saveClient = () =>{
    // 0 - Validar dados
    if(isValidForm()){

    // 1 - Ler as caixas de texto do formulário
        const newClient = {
            nome: document.querySelector('#nome').value,
            email: document.querySelector('#email').value,
            celular: document.querySelector('#celular').value,
            cidade: document.querySelector('#cidade').value
        };
        // 2 - Adicionar o novo cliente ao banco de dados
        const index = document.querySelector('#nome').dataset.index;

        if(index == ''){
            insertDB(newClient)
        }else{
            updateClient(newClient, index);
        }
        // 3 - Fechar modal
        closeModal();
        // 4 - Limpar as caixas de texto
        clearInput();
        // 5 - Atualizar a tabela
        updateTable();
    }
}

const maskCell = (text) =>{
    
    // Para criar uma expressão regular (REGEX) em JS
    // Usamos barra -> const cel = /3430984/
    text = text.replace(/\D/g,"");
    text = text.replace(/^(\d{2})(\d)/g, "($1) $2");
    text = text.replace(/(\d)(\d{4})$/, "$1-$2");

    return text;
}

const applyMask = (event) => {
    event.target.value = maskCell(event.target.value);
}

const deleteClient = (index) =>{
    const db = readDB()
    const resp = confirm(`Deseja realmente deletar ${db[index].nome}?`);
    
    if(resp){
        db.splice(index, 1)
        setDB(db);
        updateTable();
    }
}

const editClient = (index) =>{
    const db = readDB();
    document.querySelector('#nome').value = db[index].nome;
    document.querySelector('#email').value = db[index].email;
    document.querySelector('#celular').value = db[index].celular;
    document.querySelector('#cidade').value = db[index].cidade;
    document.querySelector('#nome').dataset.index = index;
    openModal();
}

const actionButtons = (event) => {
    const element = event.target;
    if(element.type === 'button'){
        const action = element.dataset.action.split('-')
        if(action[0] === 'deletar'){
            deleteClient(action[1])
        }else{
            editClient(action[1])
        }
    }
}

document.querySelector('#cadastrarCliente')
    .addEventListener('click', openModal)

document.querySelector('#close')
    .addEventListener('click', () => { closeModal(); clearInput() })

document.querySelector('#cancelar')
    .addEventListener('click', () => { closeModal(); clearInput() })

document.querySelector('#salvar')
    .addEventListener('click', saveClient);

document.querySelector('#celular')
    .addEventListener('keyup', applyMask);

document.querySelector('#tabelaClientes')
    .addEventListener('click', actionButtons);

updateTable();