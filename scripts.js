/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  let url = 'http://192.168.0.5:5000/pacientes';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      populateResults(data.pacientes);
      // data.pacientes.forEach(item => insertList(item.nome, item.idade, item.sexo))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

const getPatientByCPF = async (cpf) => {
  let url = `http://192.168.0.5:5000/pacienteCompleto`;
  const formData = new FormData();
  formData.append('cpf', cpf);
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .then((data) => {
      showDetails(data);
    })
    .catch((error) => {
      console.error('Error:', error);
      detailContent.innerHTML = "Erro ao buscar paciente.";
    });
}

const postItem = async (inputProduct, inputQuantity, inputPrice) => {
  const formData = new FormData();
  formData.append('nome', inputProduct);
  formData.append('quantidade', inputQuantity);
  formData.append('valor', inputPrice);

  let url = 'http://127.0.0.1:5000/produto';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);
}


/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("close");
  // var table = document.getElementById('myTable');
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const nomeItem = div.getElementsByTagName('td')[0].innerHTML
      if (confirm("Você tem certeza?")) {
        div.remove()
        deleteItem(nomeItem)
        alert("Removido!")
      }
    }
  }
}

getList();
/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
  console.log(item)
  let url = 'http://127.0.0.1:5000/produto?nome=' + item;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item com nome, quantidade e valor 
  --------------------------------------------------------------------------------------
*/
const newItem = () => {
  let inputProduct = document.getElementById("newInput").value;
  let inputQuantity = document.getElementById("newQuantity").value;
  let inputPrice = document.getElementById("newPrice").value;

  if (inputProduct === '') {
    alert("Escreva o nome de um item!");
  } else if (isNaN(inputQuantity) || isNaN(inputPrice)) {
    alert("Quantidade e valor precisam ser números!");
  } else {
    insertList(inputProduct, inputQuantity, inputPrice)
    postItem(inputProduct, inputQuantity, inputPrice)
    alert("Item adicionado!")
  }
}

// DOM elements
const resultsContainer = document.getElementById('resultsContainer');
const rowTemplate = document.getElementById('rowTemplate');
const detailContent = document.getElementById('detailContent');

// Populate results list
function populateResults(items = []) {
    resultsContainer.innerHTML = ''; // Clear existing content
    
    items.forEach(item => {
        // Clona o template
        const clone = rowTemplate.content.cloneNode(true);
        const row = clone.querySelector('.result-row');
        
        // Populate with data
        row.querySelector('.item-name').textContent = item.first_name + ' ' + item.last_name;
        row.querySelector('.item-details').textContent = item.phone_number;
        
        // Add click handler
        row.addEventListener('click', () => {
            // Remove previous selection
            document.querySelectorAll('.result-row').forEach(r => {
                r.classList.remove('selected');
            });
            
            // Select current row
            row.classList.add('selected');
            
            // Show details in right panel
            // showDetails(item);

            getPatientByCPF(item.cpf);
        });
        
        // Add to container
        resultsContainer.appendChild(clone);
    });
}

// Show item details
function showDetails(item) {
  console.log(item);
    detailContent.innerHTML = `
        <h3>${item.first_name + ' ' + item.last_name}</h3>
        <p>${item.address}</p>
        <div class="meta-info">
            <p><strong>CPF:</strong> ${item.cpf}</p>
        </div>
    `;
}



// Initialize when page loads
// document.addEventListener('DOMContentLoaded', () => {
//     populateResults(items);
    
//     // Add search functionality
//     const searchInput = document.getElementById('searchInput');
//     searchInput.addEventListener('input', (e) => {
//         const term = e.target.value.toLowerCase();
//         const filtered = items.filter(item => 
//             item.name.toLowerCase().includes(term) || 
//             item.details.toLowerCase().includes(term)
//         );
        
//         // Re-populate with filtered results
//         resultsContainer.innerHTML = '';
//         filtered.forEach(item => {
//             // ... same population code as above
//         });
//     });
// });