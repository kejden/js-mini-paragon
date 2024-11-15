const receiptTableBody = document.getElementById("receipt-items");
const itemDialog = document.getElementById("item-dialog");
const itemForm = document.getElementById("item-form");
const addItemButton = document.getElementById("add-item");
const totalElement = document.getElementById("total");
let total = 0;

async function fetchItems() {
    const response = await fetch('http://localhost:3000/items');
    const data = await response.json();
    return data;
}

async function renderTotal(){
    total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    totalElement.textContent = total.toFixed(2);
}

async function renderReceipt() {
    items = await fetchItems();
    receiptTableBody.textContent = "";
    items.forEach((item, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.price.toFixed(2)}</td>
            <td>${(item.price * item.quantity).toFixed(2)}</td>
            <td>
                <button id="edit" onclick="editItem('${item.id}')">Edytuj</button>
                <button id="delete" onclick="deleteItem('${item.id}')">Usuń</button>
            </td>
        `;

        receiptTableBody.appendChild(row);
    });
    renderTotal();
}

async function addItem(item) {
    await fetch('http://localhost:3000/items', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    });
    renderReceipt();
}

async function editItem(index) {
    const item = await fetch(`http://localhost:3000/items/${index}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json());
    itemForm.name.value = item.name;
    itemForm.price.value = item.price;
    itemForm.quantity.value = item.quantity;
    itemDialog.showModal();

    itemForm.onsubmit = async (e) => {
        e.preventDefault();
        const updatedItem = {
            name: itemForm.name.value,
            price: parseFloat(itemForm.price.value),
            quantity: parseInt(itemForm.quantity.value),
        };
        await fetch(`http://localhost:3000/items/${index}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedItem)
        });
        itemDialog.close();
        renderReceipt();
    };
}

async function deleteItem(index) {
    if (confirm("Czy na pewno chcesz usunąć tę pozycję?")) {
        await fetch(`http://localhost:3000/items/${index}`, {
            method: 'DELETE'
        });
        renderReceipt();
    }
}

addItemButton.addEventListener("click", () => {
    itemForm.reset();
    itemDialog.showModal();
    itemForm.onsubmit = async (e) => {
        e.preventDefault();
        const newItem = {
            name: itemForm.name.value,
            price: parseFloat(itemForm.price.value),
            quantity: parseInt(itemForm.quantity.value),
        };
        await addItem(newItem);
        itemDialog.close();
    };
});

document.getElementById("cancel").addEventListener("click", () => itemDialog.close());

renderReceipt();
