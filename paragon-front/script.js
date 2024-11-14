const receiptTableBody = document.getElementById("receipt-items");
const itemDialog = document.getElementById("item-dialog");
const itemForm = document.getElementById("item-form");
const addItemButton = document.getElementById("add-item");
const totalElement = document.getElementById("total");
let items = JSON.parse(localStorage.getItem("receiptItems")) || [];
let total = 0;

function editItem(index) {
    const item = items[index];
    itemForm.name.value = item.name;
    itemForm.price.value = item.price;
    itemForm.quantity.value = item.quantity;
    itemDialog.showModal();

    itemForm.onsubmit = (e) => {
        e.preventDefault();
        const prev = items[index].price * items[index].quantity;
        items[index] = {
            name: itemForm.name.value,
            price: parseFloat(itemForm.price.value),
            quantity: parseInt(itemForm.quantity.value),
        };
        const newPrice = itemForm.price.value * itemForm.quantity.value;
        total = total - prev + newPrice;
        renderTotal();
        renderReceipt();
        itemDialog.close();
    };
}

function deleteItem(index) {
    if (confirm("Czy na pewno chcesz usunąć tę pozycję?")) {
        const itemTotal = items[index].price * items[index].quantity;
        total -= itemTotal;
        items.splice(index, 1);
        renderTotal();
        renderReceipt();
    }
}

function renderTotal(){
    totalElement.textContent = total.toFixed(2);
}

function renderReceipt() {
    receiptTableBody.textContent = "";
    items.forEach((item, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index+1}</td>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>${item.price.toFixed(2)}</td>
            <td>${(item.price * item.quantity).toFixed(2)}</td>
            <td>
                <button id="edit" onclick="editItem(${index})">Edytuj</button>
                <button id="delete" onclick="deleteItem(${index})">Usuń</button>
            </td>
        `;

        receiptTableBody.appendChild(row);
    });
    localStorage.setItem("receiptItems", JSON.stringify(items));
}

function addItem(item) {
    items.push(item);
    total += item.price * item.quantity;
    renderTotal();
    renderReceipt();
}

addItemButton.addEventListener("click", () => {
    itemForm.reset();
    itemDialog.showModal();
    itemForm.onsubmit = (e) => {
        e.preventDefault();
        const newItem = {
            name: itemForm.name.value,
            price: parseFloat(itemForm.price.value),
            quantity: parseInt(itemForm.quantity.value),
        };
        addItem(newItem);
        itemDialog.close();
    };
});

document.getElementById("cancel").addEventListener("click", () => itemDialog.close());

renderReceipt();

