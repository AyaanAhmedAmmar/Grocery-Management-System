document.addEventListener("DOMContentLoaded", () => {
    const navButtons = document.querySelectorAll(".nav-button");
    const sections = document.querySelectorAll("section");
    const inventoryForm = document.getElementById("inventory-form");
    const inventoryTable = document.getElementById("inventory-table");
    const inventoryList = document.getElementById("sales-inventory-table");
    const sellItemSelect = document.getElementById("sell-item");
    const sellForm = document.getElementById("sell-form");

    // Inventory array to store items
    let inventory = [];

    // Navigation button functionality
    navButtons.forEach(button => {
        button.addEventListener("click", () => {
            const targetId = button.getAttribute("data-target");

            // Hide all sections
            sections.forEach(section => {
                section.classList.add("hidden");
            });

            // Show the targeted section
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.remove("hidden");
            }
        });
    });

    // Add item to inventory
    inventoryForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const itemName = document.getElementById("item-name").value.trim();
        const itemQuantity = parseInt(document.getElementById("item-quantity").value);
        const itemPrice = parseFloat(document.getElementById("item-price").value);

        if (!itemName || isNaN(itemQuantity) || isNaN(itemPrice) || itemQuantity <= 0 || itemPrice <= 0) {
            alert("Please provide valid item details.");
            return;
        }

        inventory.push({ name: itemName, quantity: itemQuantity, price: itemPrice });
        updateInventoryTable();
        updateInventoryList();
        updateSellItemSelect();

        inventoryForm.reset();
    });

    // Handle selling an item
    sellForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const selectedIndex = sellItemSelect.value;
        const sellQuantity = parseInt(document.getElementById("sell-quantity").value);

        if (selectedIndex === "" || isNaN(sellQuantity) || sellQuantity <= 0) {
            alert("Please select a valid item and quantity.");
            return;
        }

        const item = inventory[selectedIndex];

        if (sellQuantity > item.quantity) {
            alert("Insufficient quantity in inventory.");
            return;
        }

        // Deduct the sold quantity from inventory
        item.quantity -= sellQuantity;

        if (item.quantity === 0) {
            inventory.splice(selectedIndex, 1); // Remove item if quantity becomes zero
        }

        updateInventoryTable();
        updateInventoryList();
        updateSellItemSelect();
        sellForm.reset();
    });

    // Update inventory table
    function updateInventoryTable() {
        inventoryTable.innerHTML = "";
        inventory.forEach((item, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.price}</td>
                <td><button class="remove-btn" data-index="${index}">Remove</button></td>
            `;

            inventoryTable.appendChild(row);
        });

        // Attach event listeners to Remove buttons
        const removeButtons = document.querySelectorAll(".remove-btn");
        removeButtons.forEach(button => {
            button.addEventListener("click", (e) => {
                const index = e.target.getAttribute("data-index");
                removeInventoryItem(index);
            });
        });
    }

    // Update inventory table
    function updateInventoryList() {
        inventoryList.innerHTML = "";
        inventory.forEach((item, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${item.price}</td>
            `;

            inventoryList.appendChild(row);
        });
    }


    // Update sell item dropdown
    function updateSellItemSelect() {
        sellItemSelect.innerHTML = `<option value="" disabled selected>Select Item</option>`;
        inventory.forEach((item, index) => {
            const option = document.createElement("option");
            option.value = index;
            option.textContent = `${item.name} (${item.quantity} available)`;
            sellItemSelect.appendChild(option);
        });
    }

    // Remove inventory item
    function removeInventoryItem(index) {
        inventory.splice(index, 1); // Remove the item from the array
        updateInventoryTable(); // Refresh the table
        updateInventoryList();
        updateSellItemSelect(); // Refresh the dropdown
    }
});
