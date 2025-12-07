const form = document.getElementById('tracker-form');
const dataList = document.getElementById('data-list');
const totalSavingsEl = document.getElementById('total-savings');
const progressBar = document.getElementById('progress-bar');
const goalProgressText = document.getElementById('goal-progress-text');

// Hardcode your team's annual savings goal
const ANNUAL_GOAL = 100000; 

// 1. Load Data from LocalStorage
let savings = localStorage.getItem('savingsData') 
    ? JSON.parse(localStorage.getItem('savingsData')) 
    : [];

// 2. Add New Saving (Form Submission)
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const provider = document.getElementById('provider').value;
    const cost = parseFloat(document.getElementById('cost').value);
    const resource = document.getElementById('resource').value;

    if (cost > 0) {
        const newSaving = {
            id: Date.now(),
            date: new Date().toLocaleDateString('en-US'),
            provider,
            cost: cost,
            resource
        };

        savings.push(newSaving);
        
        // Save to LocalStorage and update the display
        updateLocalStorage();
        renderData();
        
        // Clear the form
        form.reset();
    } else {
        alert("Cost Saved must be a positive number.");
    }
});

// 3. Remove Saving (Delete Button)
function deleteSaving(id) {
    savings = savings.filter(saving => saving.id !== id);
    updateLocalStorage();
    renderData();
}

// 4. Update LocalStorage
function updateLocalStorage() {
    localStorage.setItem('savingsData', JSON.stringify(savings));
}

// 5. Render Data to the Table and Calculate Totals
function renderData() {
    dataList.innerHTML = ''; // Clear existing list

    // Calculate Total Savings
    const totalSavings = savings.reduce((acc, item) => acc + item.cost, 0);
    totalSavingsEl.textContent = `$${totalSavings.toFixed(2)}`;

    // Calculate Goal Progress
    const progressPercent = Math.min((totalSavings / ANNUAL_GOAL) * 100, 100);
    progressBar.style.width = `${progressPercent}%`;
    goalProgressText.textContent = `${progressPercent.toFixed(1)}% of Annual Goal Achieved`;

    // Display Savings in the Table
    savings.forEach(saving => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${saving.date}</td>
            <td>${saving.provider}</td>
            <td>$${saving.cost.toFixed(2)}</td>
            <td>${saving.resource}</td>
            <td><button class="delete-btn" onclick="deleteSaving(${saving.id})">X</button></td>
        `;
        dataList.appendChild(row);
    });
}

// Initial load
renderData();
