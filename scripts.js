// DOM elements
const resultsContainer = document.getElementById('resultsContainer');
const rowTemplate = document.getElementById('rowTemplate');
const detailContent = document.getElementById('detailContent');
const newPatientBtn = document.getElementById('newPatientBtn');
const patientFormTemplate = document.getElementById('patientFormTemplate');
const detailTemplate = document.getElementById('detailTemplate');

const urlPrefix = 'http://localhost:5000';
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
    newPatientBtn.addEventListener('click', showNewPatientForm);
    
}

function showNewPatientForm() {
    const clone = patientFormTemplate.content.cloneNode(true);
    detailContent.innerHTML = '';
    detailContent.appendChild(clone);
    
    const form = document.getElementById('patientForm');
    form.addEventListener('submit', handleFormSubmit);
    
    const cancelBtn = document.getElementById('cancelBtn');
    cancelBtn.addEventListener('click', () => {
        console.log('Cancel button clicked');
        detailContent.innerHTML = '<p class="empty-state">Select a patient to view details</p>';
    });
}

const deleteItem = (item) => {
  console.log("delete",item)
  let url = urlPrefix + '/delPaciente?cpf=' + item.cpf;


  fetch(url, {
    method: 'delete'
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
            getList(); 
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function populateResults(items = []) {
    resultsContainer.innerHTML = ''; 
    
    items.forEach(item => {
        const clone = rowTemplate.content.cloneNode(true);
        const row = clone.querySelector('.result-row');
        
        row.querySelector('.item-name').textContent = item.first_name + ' ' + item.last_name;
        row.querySelector('.item-details').textContent = item.phone_number;
        
        row.addEventListener('click', () => {
            document.querySelectorAll('.result-row').forEach(r => {
                r.classList.remove('selected');
            });
            
            row.classList.add('selected');
            getPatientByCPF(item.cpf);
        });
        
        resultsContainer.appendChild(clone);
    });
}

function showDetails(item) {
  console.log(item);
  const clone = detailTemplate.content.cloneNode(true);
  clone.querySelector('.patient-fullname').textContent = item.first_name + ' ' + item.last_name;
  clone.querySelector('.patient-cpf').textContent = item.cpf;
  clone.querySelector('.patient-address').textContent = item.address;
  clone.querySelector('.patient-phone').textContent = item.phone_number || 'N/A';
  clone.querySelector('.patient-email').textContent = item.email || 'N/A';

  clone.querySelector('.btn.delete').addEventListener('click', () => {
    deleteItem(item);
  });
  detailContent.innerHTML = '';
  detailContent.appendChild(clone);
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
        resultsContainer.innerHTML = '';
        patients = filtered;
        populateResults(filtered);
    });
};


addSearchFunctionality();
getList();
newPatientBtn.addEventListener('click', showNewPatientForm);