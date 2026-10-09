(() => {
  "use strict";

  // Menu names/prices match the items presented on menu.html.
  // Nutrition values are estimates copied from the site's menu cards.
  const menuItems = [
    {
      id: "house-cold-brew",
      name: "House Cold Brew",
      category: "drinks",
      price: 130,
      calories: 15,
      protein: 0,
    },
    {
      id: "monster-matcha-latte",
      name: "Monster Matcha Latte",
      category: "drinks",
      price: 160,
      calories: 150,
      protein: 6,
    },
    {
      id: "espresso-romano",
      name: "Espresso Romano",
      category: "drinks",
      price: 120,
      calories: 10,
      protein: 0,
    },
    {
      id: "gym-fuel-protein-latte",
      name: "Gym-Fuel Protein Latte",
      category: "drinks",
      price: 180,
      calories: 190,
      protein: 25,
    },
    {
      id: "bkl-club-sandwich",
      name: "BKL Club Sandwich",
      category: "foods",
      price: 210,
      calories: 520,
      protein: 38,
    },
    {
      id: "high-protein-rice-bowl",
      name: "High-Protein Rice Bowl",
      category: "foods",
      price: 250,
      calories: 550,
      protein: 45,
    },
    {
      id: "acai-berry-bowl",
      name: "Acai Berry Bowl",
      category: "foods",
      price: 220,
      calories: 420,
      protein: 8,
    },
    {
      id: "sourdough-avocado-toast",
      name: "Sourdough Avocado Toast",
      category: "foods",
      price: 180,
      calories: 380,
      protein: 14,
    },
    {
      id: "chocolate-cookie",
      name: "Chocolate Cookie",
      category: "snacks",
      price: 80,
      calories: 210,
      protein: 28,
    },
    {
      id: "oat-protein-bar",
      name: "Oat Protein Bar",
      category: "snacks",
      price: 90,
      calories: 220,
      protein: 15,
    },
    {
      id: "sweet-potato-chips",
      name: "Sweet Potato Chips",
      category: "snacks",
      price: 70,
      calories: 190,
      protein: 2,
    },
    {
      id: "fresh-croissant",
      name: "Fresh Croissant",
      category: "snacks",
      price: 100,
      calories: 270,
      protein: 5,
    },
  ];

  const money = (amount) =>
    `₱${amount.toLocaleString("en-PH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const itemSelect = document.getElementById("itemSelect");
  const itemTemp = document.getElementById("itemTemp");
  const itemQty = document.getElementById("itemQty");
  const itemNotes = document.getElementById("itemNotes");
  const customerName = document.getElementById("customerName");
  const categoryPills = [...document.querySelectorAll(".category-pill")];
  const btnAddItem = document.getElementById("btnAddItem");
  const orderList = document.getElementById("orderList");
  const emptyState = document.getElementById("emptyState");
  const cartCount = document.getElementById("cartCount");
  const subtotalPriceEl = document.getElementById("subtotalPrice");
  const totalPriceEl = document.getElementById("totalPrice");
  const macroSummaryEl = document.getElementById("macroSummary");
  const btnConfirmOrder = document.getElementById("btnConfirmOrder");
  const orderMessage = document.getElementById("orderMessage");
  const pickupTime = document.getElementById("pickupTime");
  const orderModal = document.getElementById("orderModal");

  if (!itemSelect || !orderList || !btnConfirmOrder || !orderModal) return;

  let currentOrder = [];
  let activeCategory = "all";
  let nextCartId = 1;

  function getSelectedItem() {
    return menuItems.find((item) => item.id === itemSelect.value);
  }

  function populateDropdown(category = activeCategory) {
    activeCategory = category;
    const filtered =
      category === "all"
        ? menuItems
        : menuItems.filter((item) => item.category === category);

    itemSelect.replaceChildren();
    filtered.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.textContent = `${item.name} — ${money(item.price)}`;
      itemSelect.appendChild(option);
    });

    updatePreparationOptions();
  }

  function updatePreparationOptions() {
    const selected = getSelectedItem();
    const options =
      selected && selected.category === "drinks"
        ? ["Iced", "Hot", "Blended / Shake"]
        : ["As served", "Warm"];
    const previousValue = itemTemp.value;
    itemTemp.replaceChildren();
    options.forEach((value) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      itemTemp.appendChild(option);
    });
    itemTemp.value = options.includes(previousValue)
      ? previousValue
      : options[0];
  }

  function showMessage(message, type = "success") {
    orderMessage.textContent = message;
    orderMessage.classList.toggle("is-error", type === "error");
    orderMessage.classList.toggle("is-success", type === "success");
  }

  function makeTextElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = text;
    return element;
  }

  function removeOrderItem(cartId) {
    currentOrder = currentOrder.filter((item) => item.cartId !== cartId);
    updateOrderUI();
    showMessage("Item removed from your pre-order.");
  }

  function addItemToOrder() {
    const selected = getSelectedItem();
    if (!selected) {
      showMessage("Please select a menu item first.", "error");
      itemSelect.focus();
      return;
    }

    if (!itemQty.checkValidity()) {
      itemQty.reportValidity();
      return;
    }

    const qty = Number.parseInt(itemQty.value, 10);
    const notes = itemNotes.value.trim();
    currentOrder.push({
      cartId: nextCartId++,
      id: selected.id,
      name: selected.name,
      category: selected.category,
      price: selected.price,
      calories: selected.calories,
      protein: selected.protein,
      temp: itemTemp.value,
      qty,
      notes,
      subtotal: selected.price * qty,
    });

    updateOrderUI();
    itemNotes.value = "";
    itemQty.value = "1";
    showMessage(`${selected.name} added to your pre-order.`);
  }

  function updateOrderUI() {
    orderList.replaceChildren();

    if (currentOrder.length === 0) {
      const empty = document.createElement("li");
      empty.className = "empty-state";
      empty.appendChild(
        makeTextElement("i", "fa-solid fa-basket-shopping", ""),
      );
      empty.lastElementChild.setAttribute("aria-hidden", "true");
      empty.appendChild(makeTextElement("span", "", "Your order is empty."));
      empty.appendChild(
        makeTextElement(
          "small",
          "",
          "Add something from the menu to get started.",
        ),
      );
      orderList.appendChild(empty);
      cartCount.textContent = "0 items";
      subtotalPriceEl.textContent = money(0);
      totalPriceEl.textContent = money(0);
      macroSummaryEl.textContent = "0 kcal · 0g protein";
      btnConfirmOrder.disabled = true;
      return;
    }

    let totalAmount = 0;
    let totalCalories = 0;
    let totalProtein = 0;
    let itemCount = 0;

    currentOrder.forEach((item) => {
      totalAmount += item.subtotal;
      totalCalories += item.calories * item.qty;
      totalProtein += item.protein * item.qty;
      itemCount += item.qty;

      const listItem = document.createElement("li");
      listItem.className = "order-item";

      const details = document.createElement("div");
      details.className = "item-details";
      details.appendChild(
        makeTextElement("div", "item-name", `${item.name} × ${item.qty}`),
      );
      const meta = item.notes ? `${item.temp} · ${item.notes}` : item.temp;
      details.appendChild(makeTextElement("div", "item-meta", meta));

      const trailing = document.createElement("div");
      trailing.className = "item-trailing";
      trailing.appendChild(
        makeTextElement("span", "item-price", money(item.subtotal)),
      );
      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.className = "btn-remove";
      removeButton.setAttribute("aria-label", `Remove ${item.name} from order`);
      removeButton.title = "Remove item";
      removeButton.innerHTML =
        '<i class="fa-solid fa-trash-can" aria-hidden="true"></i>';
      removeButton.addEventListener("click", () =>
        removeOrderItem(item.cartId),
      );
      trailing.appendChild(removeButton);

      listItem.append(details, trailing);
      orderList.appendChild(listItem);
    });

    cartCount.textContent = `${itemCount} ${itemCount === 1 ? "item" : "items"}`;
    subtotalPriceEl.textContent = money(totalAmount);
    totalPriceEl.textContent = money(totalAmount);
    macroSummaryEl.textContent = `${totalCalories.toLocaleString("en-PH")} kcal · ${totalProtein}g protein`;
    btnConfirmOrder.disabled = false;
  }

  function confirmOrder() {
    if (currentOrder.length === 0) return;

    if (!customerName.checkValidity()) {
      customerName.reportValidity();
      customerName.focus();
      return;
    }

    const orderId = `#BKL-${Math.floor(1000 + Math.random() * 9000)}`;
    document.getElementById("modalOrderId").textContent = orderId;
    document.getElementById("modalCustomerName").textContent =
      customerName.value.trim();
    document.getElementById("modalPickupTime").textContent = pickupTime.value;
    document.getElementById("modalTotal").textContent =
      totalPriceEl.textContent;
    orderModal.style.display = "flex";
    orderModal.setAttribute("aria-hidden", "false");
    document.getElementById("closeOrderModal").focus();
  }

  function closeOrderModal() {
    orderModal.style.display = "none";
    orderModal.setAttribute("aria-hidden", "true");
    currentOrder = [];
    updateOrderUI();
    showMessage("Your basket is ready for your next order.");
    btnConfirmOrder.focus();
  }

  categoryPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      categoryPills.forEach((otherPill) => {
        const isActive = otherPill === pill;
        otherPill.classList.toggle("active", isActive);
        otherPill.setAttribute("aria-pressed", String(isActive));
      });
      populateDropdown(pill.dataset.category || "all");
      showMessage("");
    });
  });

  itemSelect.addEventListener("change", updatePreparationOptions);
  btnAddItem.addEventListener("click", addItemToOrder);
  document
    .getElementById("add-item-form")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      addItemToOrder();
    });
  btnConfirmOrder.addEventListener("click", confirmOrder);
  document
    .getElementById("closeOrderModal")
    .addEventListener("click", closeOrderModal);

  orderModal.addEventListener("click", (event) => {
    if (event.target === orderModal) closeOrderModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && orderModal.style.display === "flex")
      closeOrderModal();
  });

  populateDropdown("all");
  updateOrderUI();
})();
