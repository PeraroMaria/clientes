// MODAL OPEN / CLOSE

let modalCloseElement = document.querySelector('.modalClose');

let modal = document.querySelector('.modal')
function modalOpen() {
    modal.classList.add('modal-active');
}

function modalClose() {
    modal.classList.remove('modal-active');
    clearFields();
    document.querySelector('#nome').dataset.index = 'new';
    document.querySelector('#modalTitle').innerHTML = "Novo Cliente";
}

modalCloseElement.addEventListener("click", modalClose, false);


function clearFields() {
    const fields = document.querySelectorAll('.modal-input');
    fields.forEach(fields => fields.value = "")
}




// CRUD

const tempClient = {
    nome: "Duda",
    celular: "999979108",
    email: "maria.peraro@gmail.com",
    cep: "04622001",
    rua: "R. Laplace",
    bairro: "Brooklin",
    cidade: "São Paulo",
    estado: "SP"
}

const getLocalStorage = () => JSON.parse(localStorage.getItem("db_client")) ?? []
const setLocalStorage = (dbClient) => localStorage.setItem("db_client", JSON.stringify(dbClient));


// CREATE
function createClient(client) {
    const dbClient = getLocalStorage()
    dbClient.push(client);
    setLocalStorage(dbClient)
}

// READ

const readClient = () => getLocalStorage();

// UPDATE

function updateClient(index, client) {
    const dbClient = readClient();
    dbClient[index] = client
    setLocalStorage(dbClient)
    closeLastSearch();
    closeSearch();
}

// DELETE

const deleteClient = (index) => {
    const dbClient = readClient()
    dbClient.splice(index, 1)
    setLocalStorage(dbClient)

    updateTable();
}


// INTERACTIONS 

updateTable();

// ==== CREATE

function isValidFields() {
    return document.querySelector('#formAdd').reportValidity()
}

function saveClient() {
    if (isValidFields()) {
        const client = {
            nome: document.querySelector('#nome').value,
            celular: document.querySelector('#celular').value,
            email: document.querySelector('#email').value,
            cep: document.querySelector('#cep').value,
            rua: document.querySelector('#rua').value,
            bairro: document.querySelector('#bairro').value,
            cidade: document.querySelector('#cidade').value,
            estado: document.querySelector('#uf').value
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
            createClient(client);
            updateTable();
            modalClose();
        } else {
            updateClient(index, client);
            updateTable();
            modalClose();
        }

    }
}

document.querySelector('.button-add-form').addEventListener('click', saveClient);

// ========== READ


function createRow(client, index) {
    const newRow = document.createElement('tr')
    newRow.classList.add('row-table')
    newRow.innerHTML = `
        <td>${index}</td>
        <td>${client.nome}</td>
        <td>${client.celular}</td>
        <td>${client.email}</td>
        <td>${client.cep}</td>
        <td>${client.rua}</td>
        <td>${client.bairro}</td>
        <td>${client.cidade}</td>
        <td>${client.estado}</td>
        <td><button class="button-edit" type='button' id="edit-${index}"></button></td>
        <td><button class="button-delete" type='button'  id="delete-${index}"></button></td>
    `
    document.querySelector("#tableClients>tbody").appendChild(newRow)

}

function clearTable() {
    const rows = document.querySelectorAll('#tableClients>tbody tr');
    rows.forEach(row => row.parentNode.removeChild(row))

}

function updateTable() {
    const dbClient = readClient();
    clearTable();
    dbClient.forEach(createRow);

}

// ========== UPDATE and DELETE

function fillFields(client) {
    document.querySelector('#nome').value = client.nome
    document.querySelector('#celular').value = client.celular
    document.querySelector('#email').value = client.email
    document.querySelector('#cep').value = client.cep
    document.querySelector('#rua').value = client.rua
    document.querySelector('#bairro').value = client.bairro
    document.querySelector('#cidade').value = client.cidade
    document.querySelector('#uf').value = client.estado
    document.querySelector('#nome').dataset.index = client.index

}

function editClient(index) {
    const client = readClient()[index]
    client.index = index
    fillFields(client);
    modalOpen();

}

function editDelete(event) {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            document.querySelector('#modalTitle').innerHTML = "Atualizar Dados";
            editClient(index)



        } else {
            let answerConfirm = confirm(`Deseja deletar o cliente ${index} ?`);
            if (answerConfirm) { deleteClient(index) }
            closeLastSearch();
            closeSearch();

        }
    }
}

document.querySelector('#tableClients>tbody')
    .addEventListener('click', editDelete)


// ========= SEARCH

let indexSearch = 0;

function search(array, searchName, index) {

    if (array.nome.match(searchName)) {
        createRow(array, index)
    }
    indexSearch++
}

function searchClients(searchName) {
    indexSearch = 0;
    const clients = readClient();
    clearTable();
    clients.forEach(client => search(client, searchName, indexSearch))
}

let divSearch = false;
const divSearchCss = document.querySelector('.input-search');
const closeSearchCss = document.querySelector('.closeSearch');

function openSearch() {
    divSearchCss.style.width = '140px';
    divSearchCss.placeholder = 'Pesquise por nome';
    closeSearchCss.style.width = '40px';
    closeSearchCss.style.visibility = 'visible';
    divSearch = true;
}

function closeSearch() {
    divSearchCss.style.width = '0px';
    divSearchCss.placeholder = '';
    divSearchCss.value = '';
    closeSearchCss.style.width = '0px';
    closeSearchCss.style.visibility = 'hidden';
    divSearch = false;
}

function lastSearch(lastName) {
    document.querySelector("#lastName").innerHTML = lastName;
    document.querySelector('.lastSearch').style.display = "flex";
}

function closeLastSearch() {
    document.querySelector('.lastSearch').style.display = "none";
    updateTable();
}

function sendSearch() {
    if (divSearch == false) {
        openSearch();
    } else {
        const txtSearch = document.querySelector('.input-search').value;
        searchClients(txtSearch);
        lastSearch(txtSearch);
    }
}

document.querySelector('.btn-search')
    .addEventListener('click', sendSearch)

document.querySelector('#closeLastSearch')
    .addEventListener('click', closeLastSearch)

closeSearchCss.addEventListener('click', closeSearch)




// =========== NIGHT MODE
let mode = false

function nightMode() {
    const link = document.querySelector("#linkStyle");

    if (mode == false) {
        link.href = "./css/nightMode.css";
        console.log('IF')
        mode = true;
    } else {
        link.href = " ";
        console.log('eLSE')
        mode = false;
    }

}


document.querySelector('#button-nightMode')
    .addEventListener('click', nightMode)


// Configuração para capturar o arquivo e processar
document.getElementById('uploadButton').addEventListener('click', handleFileSelect, false);

let importedData = []; // Armazena os dados importados

function handleFileSelect() {
    const file = document.getElementById('uploadFile').files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Assume que a primeira planilha é a desejada
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Converte os dados da planilha para JSON
        importedData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        alert('Dados importados com sucesso. Clique em "Confirmar" para preencher o formulário.');
    };

    reader.readAsArrayBuffer(file);
}

function submitForm() {
    if (importedData.length === 0) {
        alert('Nenhum dado importado. Por favor, importe uma planilha primeiro.');
        return;
    }

    // Assume que a primeira linha contém os cabeçalhos e a segunda linha os dados
    const clientData = importedData[1]; // ou qualquer lógica que defina qual linha contém os dados

    // Preenche o formulário com os dados importados
    document.getElementById('nome').value = clientData[0] || '';
    document.getElementById('celular').value = clientData[1] || '';
    document.getElementById('email').value = clientData[2] || '';
    document.getElementById('cep').value = clientData[3] || '';
    document.getElementById('rua').value = clientData[4] || '';
    document.getElementById('bairro').value = clientData[5] || '';
    document.getElementById('cidade').value = clientData[6] || '';
    document.getElementById('uf').value = clientData[7] || '';

    // Opcional: se você precisar enviar o formulário, descomente a linha abaixo
     document.getElementById('formAdd').submit();
}
