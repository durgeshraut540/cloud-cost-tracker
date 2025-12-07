const form = document.getElementById('tracker-form');
const dataList = document.getElementById('data-list');
const totalSavingsEl = document.getElementById('total-savings');
const progressBar = document.getElementById('progress-bar');
const progressText = document.getElementById('progress-text');
const annualGoal = 100000; // Define your annual goal here

// Load savings from Local Storage
let savings = localStorage.getItem('savings') ? JSON.parse(localStorage.getItem('savings')) : [];

// Function to save data to Local Storage
function saveSavings() {
    localStorage.setItem('savings', JSON.stringify(savings));
}

// Function to calculate and update totals
function updateTotals() {
    const total = savings.reduce((acc, item) => acc + item.cost, 0);
    totalSavingsEl.innerText = `$${total.toFixed(2)}`;

    // Update progress bar
    const percentage = (total / annualGoal) * 100;
    progressBar.style.width = `${Math.min(percentage, 100)}%`;
    progressText.innerText = `${percentage.toFixed(1)}% of Annual Goal Achieved`;
    
    // Change color if goal is met
    if (percentage >= 100) {
        progressBar.style.backgroundColor = '#4CAF50'; // Green
        progressText.style.color = '#4CAF50';
    } else {
        progressBar.style.backgroundColor = '#2196F3'; // Blue
        progressText.style.color = 'initial';
    }
}

// Function to render the data list (table body)
function renderData() {
    dataList.innerHTML = ''; // Clear existing list
    
    savings.forEach(saving => {
        const row = document.createElement('tr');
        
        // This is the updated innerHTML with all 9 columns
        row.innerHTML = `
            <td>${saving.date}</td>
            <td>${saving.provider}</td>
            <td>${saving.resourceGroup}</td>
            <td>${saving.subscription}</td>
            <td>${saving.owner}</td>
            <td>${saving.crNumber}</td>
            <td>$${saving.cost.toFixed(2)}</td>
            <td>${saving.resource}</td>
            <td><button class="delete-btn" onclick="deleteSaving(${saving.id})">X</button></td>
        `;
        dataList.appendChild(row);
    });
}

// Function to add a new saving entry
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const provider = document.getElementById('provider').value;
    const cost = parseFloat(document.getElementById('cost').value);
    const resource = document.getElementById('resource').value;
    
    // --- NEW INPUTS CAPTURED HERE ---
    const resourceGroup = document.getElementById('resourceGroup').value;
    const subscription = document.getElementById('subscription').value;
    const owner = document.getElementById('owner').value;
    const crNumber = document.getElementById('crNumber').value;
    // --------------------------------

    if (cost > 0) {
        const newSaving = {
            id: Date.now(),
            // Date of Decommission is recorded as the submission date
            date: new Date().toLocaleDateString('en-US'),
            provider,
            cost: cost,
            resource,
            
            // --- NEW PROPERTIES STORED HERE ---
            resourceGroup,
            subscription,
            owner,
            crNumber
            // ----------------------------------
        };

        savings.push(newSaving);
        saveSavings();
        updateTotals();
        renderData();
        form.reset(); // Clear the form
    } else {
        alert('Please enter a positive value for Cost Saved.');
    }
});

// Function to delete an entry
window.deleteSaving = function(id) {
    savings = savings.filter(saving => saving.id !== id);
    saveSavings();
    updateTotals();
    renderData();
};

// Initialize the app on load
updateTotals();
renderData();
