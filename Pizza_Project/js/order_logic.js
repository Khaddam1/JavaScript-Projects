/**
 * Initiates the receipt generation process when the order button is clicked.
 */
function generateReceipt() {
    console.log("--- Starting Receipt Generation ---");

    // Initialize receipt string and total cost
    let receiptHTML = "<h3>Your Custom Pizza Order:</h3>"; // Changed initial text [cite: 9]
    let currentTotalCost = 0;

    // Process selected size to get base cost and update receipt
    const sizeData = processSizeSelection();
    if (sizeData) {
        receiptHTML += sizeData.sizeText + "<br>"; // Add selected size text [cite: 11]
        currentTotalCost = sizeData.sizeCost; // Set base cost [cite: 13]
    } else {
        // Handle case where no size is selected (though one is checked by default)
        alert("Please select a pizza size.");
        return;
    }

    console.log(`Selected Size: ${sizeData.sizeText}, Cost: $${sizeData.sizeCost}`);
    console.log(`Receipt after size: ${receiptHTML}`);
    console.log(`Subtotal after size: $${currentTotalCost}`);

    // Process toppings and update total cost and receipt text
    processToppings(currentTotalCost, receiptHTML); // Pass current total and receipt text [cite: 14]
}

/**
 * Determines the selected pizza size and its cost.
 * @returns {object|null} - An object { sizeText: string, sizeCost: number } or null if none selected.
 */
function processSizeSelection() {
    const sizeOptions = document.getElementsByClassName("pizza-size-selector"); // Updated class name
    let chosenSize = null;
    let baseSizeCost = 0;

    // Define size costs using an object for cleaner lookup
    const sizePriceMap = {
        "Personal Pizza": 6,
        "Small Pizza": 8,
        "Medium Pizza": 10,
        "Large Pizza": 14,
        "Extra Large Pizza": 16
    };

    // Find the selected radio button
    for (let i = 0; i < sizeOptions.length; i++) {
        if (sizeOptions[i].checked) { // Check if this size option is selected [cite: 11]
            chosenSize = sizeOptions[i].value; // Get the value (name) of the selected size [cite: 11]
            baseSizeCost = sizePriceMap[chosenSize] || 0; // Look up cost from the map [cite: 12]
            break; // Exit loop once found
        }
    }

    if (chosenSize) {
        return { sizeText: chosenSize, sizeCost: baseSizeCost };
    } else {
        return null; // Should not happen with default checked radio
    }
}

/**
 * Processes selected toppings, calculates their cost, and updates the final receipt.
 * @param {number} currentTotal - The cost calculated so far (from size).
 * @param {string} receiptText - The receipt text generated so far.
 */
function processToppings(currentTotal, receiptText) {
    let extrasCost = 0; // Cost for toppings (first one free)
    const chosenToppings = []; // Array to store selected topping names
    const toppingCheckboxes = document.getElementsByClassName("topping-selector"); // Updated class name [cite: 16]

    // Loop through all topping checkboxes
    for (let j = 0; j < toppingCheckboxes.length; j++) {
        if (toppingCheckboxes[j].checked) { // Check if topping is selected [cite: 16]
            const toppingValue = toppingCheckboxes[j].value;
            chosenToppings.push(toppingValue); // Add topping name to our list [cite: 16]
            console.log(`Selected topping item: (${toppingValue})`);
            receiptText += `- ${toppingValue}<br>`; // Add topping to receipt string, slightly different format [cite: 16]
        }
    }

    const numToppings = chosenToppings.length; // Get the count of selected toppings [cite: 16]

    // Calculate topping cost: first one is free, others $1 each
    if (numToppings > 1) {
        extrasCost = (numToppings - 1); // Only charge for toppings after the first one [cite: 16]
    } else {
        extrasCost = 0; // No extra cost if 0 or 1 topping [cite: 16]
    }

    console.log(`Total selected topping items: ${numToppings}`);
    console.log(`${numToppings} topping(s): 1st free + $${extrasCost}.00 for extras`);
    console.log(`Receipt after toppings: ${receiptText}`);

    // Calculate final total cost
    const finalTotalCost = currentTotal + extrasCost; // Add topping cost to running total [cite: 16]
    console.log(`Purchase Total: $${finalTotalCost}.00`);

    // Display the final receipt details and total price
    document.getElementById("order-details-text").innerHTML = receiptText; // Updated ID [cite: 18]
    document.getElementById("final-price-display").innerHTML = `<h3>Total: <strong>$${finalTotalCost}.00</strong></h3>`; // Updated ID and format [cite: 18]
}

// --- Initial Setup (Optional) ---
// Could add logic here if needed when the page loads
console.log("Pizza order script loaded.");
