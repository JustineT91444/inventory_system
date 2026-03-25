// Load data from LocalStorage
let inventory = JSON.parse(localStorage.getItem('inventoryData')) || [];

// DOM Selectors
const elements = {
    form: document.getElementById('inventory-form'),
    tableBody: document.getElementById('inventory-table-body'),
    submitBtn: document.getElementById('submit-btn'),
    idInput: document.getElementById('item-id'),
    nameInput: document.getElementById('item-name'),
    qtyInput: document.getElementById('item-qty'),
    priceInput: document.getElementById('item-price'),
    grandTotal: document.getElementById('grand-total')
};

// --- READ & RENDER ---
function renderTable() {
    elements.tableBody.innerHTML = '';
    let totalStockValue = 0;

    if (inventory.length === 0) {
        elements.tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:40px; color:#64748b;">No items found.</td></tr>`;
        elements.grandTotal.textContent = "$0.00";
        return;
    }

    inventory.forEach(item => {
        const lineTotal = item.qty * item.price;
        totalStockValue += lineTotal;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="font-weight: 600;">${item.name}</td>
            <td>${item.qty}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td>$${lineTotal.toFixed(2)}</td>
            <td>
                <button class="btn-edit" onclick="editItem('${item.id}')">Edit</button>
                <button class="btn-delete" onclick="deleteItem('${item.id}')">Delete</button>
            </td>
        `;
        elements.tableBody.appendChild(row);
    });

    elements.grandTotal.textContent = `$${totalStockValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
}

// --- CREATE & UPDATE ---
elements.form.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = elements.idInput.value;
    const itemData = {
        id: id || Date.now().toString(),
        name: elements.nameInput.value.trim(),
        qty: parseInt(elements.qtyInput.value),
        price: parseFloat(elements.priceInput.value)
    };

    if (id) {
        const index = inventory.findIndex(i => i.id === id);
        inventory[index] = itemData;
    } else {
        inventory.push(itemData);
    }

    syncData();
    resetUI();
});

// --- EDIT (Populate form) ---
window.editItem = (id) => {
    const item = inventory.find(i => i.id === id);
    if (!item) return;

    elements.idInput.value = item.id;
    elements.nameInput.value = item.name;
    elements.qtyInput.value = item.qty;
    elements.priceInput.value = item.price;
    elements.submitBtn.textContent = 'Update Item';
    elements.nameInput.focus();
};

// --- DELETE ---
window.deleteItem = (id) => {
    if (confirm('Delete this item?')) {
        inventory = inventory.filter(i => i.id !== id);
        syncData();
    }
};

// --- UTILS ---
function syncData() {
    localStorage.setItem('inventoryData', JSON.stringify(inventory));
    renderTable();
}

function resetUI() {
    elements.form.reset();
    elements.idInput.value = '';
    elements.submitBtn.textContent = 'Save Item';
}

// Init
renderTable();