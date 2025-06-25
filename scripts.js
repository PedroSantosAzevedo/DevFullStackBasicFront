/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  let url = 'http://127.0.0.1:5000/produtos';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.produtos.forEach(item => insertList(item.nome, item.quantidade, item.valor))
    })
    .catch((error) => {
      console.error('Error:', error);
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

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (nameProduct, quantity, price) => {
  var item = [nameProduct, quantity, price]
  var table = document.getElementById('myTable');
  var row = table.insertRow();

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
  insertButton(row.insertCell(-1))
  document.getElementById("newInput").value = "";
  document.getElementById("newQuantity").value = "";
  document.getElementById("newPrice").value = "";

  removeElement()
}


// DOM elements
const resultsContainer = document.getElementById('resultsContainer');
const rowTemplate = document.getElementById('rowTemplate');
const detailContent = document.getElementById('detailContent');

// Sample data - replace with your actual data
const items = [
    { id: 1, name: "Item One", details: "Description for item one", fullInfo: "Complete details for item one..." },
    { id: 2, name: "Item Two", details: "Description for item two", fullInfo: "Complete details for item two..." },
    { id: 3, name: "Item Three", details: "Description for item three", fullInfo: "Complete details for item three..." },
    // ... add more items
];

// Populate results list
function populateResults() {
    resultsContainer.innerHTML = ''; // Clear existing content
    
    items.forEach(item => {
        // Clone the template
        const clone = rowTemplate.content.cloneNode(true);
        const row = clone.querySelector('.result-row');
        
        // Populate with data
        row.querySelector('.item-name').textContent = item.name;
        row.querySelector('.item-details').textContent = item.details;
        
        // Add click handler
        row.addEventListener('click', () => {
            // Remove previous selection
            document.querySelectorAll('.result-row').forEach(r => {
                r.classList.remove('selected');
            });
            
            // Select current row
            row.classList.add('selected');
            
            // Show details in right panel
            showDetails(item);
        });
        
        // Add to container
        resultsContainer.appendChild(clone);
    });
}

// Show item details
function showDetails(item) {
    detailContent.innerHTML = `
        <h3>${item.name}</h3>
        <p>${item.fullInfo}</p>
        <div class="meta-info">
            <p><strong>ID:</strong> ${item.id}</p>
            <p><strong>Last Updated:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
    `;
}

populateResults();

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    populateResults();
    
    // Add search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = items.filter(item => 
            item.name.toLowerCase().includes(term) || 
            item.details.toLowerCase().includes(term)
        );
        
        // Re-populate with filtered results
        resultsContainer.innerHTML = '';
        filtered.forEach(item => {
            // ... same population code as above
        });
    });
});