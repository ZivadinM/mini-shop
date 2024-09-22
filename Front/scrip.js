/** @format */

var productContainter = document.getElementById("products-con");
function generatePDF() {
	const { jsPDF } = window.jspdf;

	var cart = JSON.parse(localStorage.getItem("cart")) || [];

	var doc = new jsPDF();

	doc.setFontSize(18);
	doc.text("Shopping Cart Details", 14, 20);

	doc.setFontSize(12);

	doc.text("Product Name", 14, 30);
	doc.text("Quantity", 100, 30);
	doc.text("Price", 140, 30);
	doc.text("Total", 180, 30);

	doc.line(14, 32, 195, 32);

	let y = 40;
	let totalPrice = 0;

	cart.forEach((item) => {
		let itemTotalPrice = item.quantity * item.price;
		totalPrice += itemTotalPrice;

		doc.text(item.name, 14, y);
		doc.text(item.quantity.toString(), 100, y);
		doc.text(`$${item.price.toFixed(2)}`, 140, y);
		doc.text(`$${itemTotalPrice.toFixed(2)}`, 180, y);

		y += 10;
	});

	doc.text("Total", 140, y);
	doc.text(`$${totalPrice.toFixed(2)}`, 180, y);

	doc.save("cart-details.pdf");
}
function getProduct(product) {
	return `                    
        <div class="col-md-3 product-card" id="product-card-${product.id}">
								<div class="card">
									<img
										src=${product.pictureUrl}
										class="card-img-top"
										alt="Product Image"
									/>
									<div class="card-body text-center">
										<h5 class="card-title">${product.name}</h5>
										<p class="card-text">${product.price}</p>
										<div
											class="d-flex justify-content-center align-items-center"
										>
											<input
												type="number"
												class="form-control me-2"
												min="0"
												value="0"
												style="width: 60px"
                                                id="quantity_${product.id}"
											/>
											<button class="btn btn-primary" id="but_id_${product.id}">Add To Cart</button>
										</div>
									</div>
								</div>
							</div>`;
}
function defualtProduct(product) {
	return `                    
								<div class="card">
									<img
										src=${product.pictureUrl}
										class="card-img-top"
										alt="Product Image"
									/>
									<div class="card-body text-center">
										<h5 class="card-title">${product.name}</h5>
										<p class="card-text">${product.price}</p>
										<div
											class="d-flex justify-content-center align-items-center"
										>
											<input
												type="number"
												class="form-control me-2"
												min="0"
												value="0"
												style="width: 60px"
                                                id="quantity_${product.id}"
											/>
											<button class="btn btn-primary" id="but_id_${product.id}">Add To Cart</button>
										</div>
									</div>
							</div>`;
}
function getAlternativeProduct(product) {
	return `
            <div class="card">
                <img
                    src=${product.pictureUrl}
                    class="card-img-top"
                    alt="Product Image"
                />
                <div class="card-body text-center">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.price}</p>
                    <button class="btn btn-primary btn-custom" id="remove_but_id_${product.id}">
                        Remove From Cart
                    </button>
                </div>

        </div>`;
}

function replaceProductCard(product) {
	var productCard = document.getElementById(`product-card-${product.id}`);
	var isAddedToCart = productCard.querySelector(`#remove_but_id_${product.id}`);

	if (isAddedToCart) {
		productCard.innerHTML = defualtProduct(product);
		var addButton = productCard.querySelector(`#but_id_${product.id}`);
		addButton.addEventListener("click", function () {
			handleAddToCart(product);
		});
	} else {
		productCard.innerHTML = getAlternativeProduct(product);
		var removeButton = productCard.querySelector(
			`#remove_but_id_${product.id}`
		);
		removeButton.addEventListener("click", function () {
			handleRemoveFromCart(product);
		});
	}
}

// Function to handle adding product to cart
function handleAddToCart(product) {
	var quantityInput = document.getElementById(`quantity_${product.id}`);
	var quantity = parseInt(quantityInput.value, 10) || 0;
	if (quantity == 0) {
		alert("Please enter a quantity greater than 0.");
		return;
	}
	if (quantity > 0) {
		var cart = JSON.parse(localStorage.getItem("cart")) || [];

		var existingProduct = cart.find((item) => item.id === product.id);
		if (existingProduct) {
			existingProduct.quantity += quantity;
		} else {
			cart.push({
				id: product.id,
				name: product.name,
				quantity: quantity,
				price: product.price,
			});
		}

		localStorage.setItem("cart", JSON.stringify(cart));
		replaceProductCard(product);
	}
}

function handleRemoveFromCart(product) {
	var cart = JSON.parse(localStorage.getItem("cart")) || [];

	// Remove the product from the cart
	cart = cart.filter((item) => item.id !== product.id);

	localStorage.setItem("cart", JSON.stringify(cart));
	replaceProductCard(product);
}

function loadCart() {
	var cart = JSON.parse(localStorage.getItem("cart")) || [];
	var cartItemsList = document.getElementById("cart-items-list");
	var cartTotal = document.getElementById("cart-total");

	cartItemsList.innerHTML = "";

	var totalPrice = 0;

	cart.forEach((item) => {
		var itemTotalPrice = item.quantity * item.price;
		totalPrice += itemTotalPrice;

		var listItem = document.createElement("li");
		listItem.textContent = `${item.name} - ${item.quantity} pcs.`;
		cartItemsList.appendChild(listItem);
	});

	cartTotal.textContent = `Total: $${totalPrice.toFixed(2)}`;
}

function handleCheckout() {
	var cart = JSON.parse(localStorage.getItem("cart")) || [];

	var productOrders = cart.map((item) => ({
		product: { id: item.id },
		quantity: item.quantity,
	}));

	var requestData = { productOrders: productOrders };

	fetch("http://localhost:8082/api/orders", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(requestData),
	})
		.then((response) => response.json())
		.then((data) => {
			console.log("Success:", data);
			generatePDF();
			localStorage.removeItem("cart");
			loadCart();
			alert("Order placed successfully!");
		})
		.catch((error) => {
			console.error("Error:", error);
			alert("Failed to place the order. Please try again.");
		});
}

fetch("http://localhost:8082/api/products")
	.then((response) => response.json())
	.then((products) => {
		console.log(products);
		var productsMarkup = "";
		for (let product of products) {
			productsMarkup += getProduct(product);
		}
		productContainter.innerHTML = productsMarkup;

		products.forEach((product) => {
			var button = document.getElementById(`but_id_${product.id}`);
			button.addEventListener("click", function () {
				handleAddToCart(product);
			});
		});
	});
setInterval(loadCart, 1);

document.addEventListener("DOMContentLoaded", function () {
	loadCart();
	var checkoutButton = document.querySelector(".btn-custom");
	if (checkoutButton) {
		checkoutButton.addEventListener("click", handleCheckout);
	}
});
window.addEventListener("beforeunload", function (event) {
	localStorage.removeItem("cart");
});
