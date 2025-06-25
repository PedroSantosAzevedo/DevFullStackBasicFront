// DOM elements
const resultsContainer = document.getElementById('resultsContainer');
const rowTemplate = document.getElementById('rowTemplate');
const detailContent = document.getElementById('detailContent');
const newPatientBtn = document.getElementById('newPatientBtn');
const patientFormTemplate = document.getElementById('patientFormTemplate');
const urlPrefix = 'http://192.168.0.5:5000';
let allPatients = [];
let patients = [];



const getList = async () => {
  let url = urlPrefix + '/pacientes';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      populateResults(data.pacientes);
      allPatients = data.pacientes;
      patients = data.pacientes;
      // data.pacientes.forEach(item => insertList(item.nome, item.idade, item.sexo))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

const getPatientByCPF = async (cpf) => {
  const url = urlPrefix + `/pacienteCompleto`;
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



function setupEventListeners() {
    // New Patient button
    newPatientBtn.addEventListener('click', showNewPatientForm);
    
}

function showNewPatientForm() {
    const clone = patientFormTemplate.content.cloneNode(true);
    detailContent.innerHTML = '';
    detailContent.appendChild(clone);
    
    // Add form submission handler
    const form = document.getElementById('patientForm');
    form.addEventListener('submit', handleFormSubmit);
    
    // Add cancel button handler
    const cancelBtn = document.getElementById('cancelBtn');
    cancelBtn.addEventListener('click', () => {
        console.log('Cancel button clicked');
        detailContent.innerHTML = '<p class="empty-state">Select a patient to view details</p>';
    });
}



const deleteItem = (item) => {
  console.log(item)
  let url = urlPrefix + '/patient';

  const formData = new FormData();
  formData.append('cpf', item.cpf);

  fetch(url, {
    method: 'delete',
    body: formData
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

function handleFormSubmit() {
  event.preventDefault();
  console.log('Form submitted');

  const firstName = document.getElementById('patientName').value;
  const lastName = document.getElementById('patientNickName').value;
  const address =  document.getElementById('patientAddress').value;
  const phone =    document.getElementById('patientPhone').value || '';
  const email =    document.getElementById('patientEmail').value || '';
  const cpf =      document.getElementById('patientCPF').value;

  const formData = new FormData();
  formData.append('first_name', firstName);
  formData.append('last_name', lastName);
  formData.append('address', address);
  formData.append('phone_number', phone);
  formData.append('email', email);
  formData.append('cpf', cpf);


    const url = urlPrefix + '/paciente';

    fetch(url, {
        method: 'post',
        body: formData
    })
        .then((response) => response.json())
        .then((data) => {
            getList(); // Refresh the list after adding
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

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

function addSearchFunctionality() {

    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
        if (e.target.value === '' || e.target.value === null) {
            resultsContainer.innerHTML = '';
            populateResults(allPatients);
            return;
        } 
        console.log('Search input changed:', e.target.value.toLowerCase());

        const term = e.target.value.toString().toLowerCase();

         const filtered = allPatients.filter(item =>
            item.first_name.toLowerCase().includes(term) ||
            item.last_name.toLowerCase().includes(term)
        );
        // Re-populate with filtered results
        resultsContainer.innerHTML = '';
        patients = filtered;
        populateResults(filtered);
    });
};


addSearchFunctionality();
getList();
newPatientBtn.addEventListener('click', showNewPatientForm);