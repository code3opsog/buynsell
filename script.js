// Mock users and data
let currentUser = null;
let shops = JSON.parse(localStorage.getItem('shops')) || [
    { id: 1, name: 'User1 Shop', items: [
        { id: 1, name: 'Cool Sword', price: 100, image: 'https://via.placeholder.com/250x150?text=Sword' }
    ] },
    { id: 2, name: 'User2 Shop', items: [
        { id: 2, name: 'Magic Hat', price: 50, image: 'https://via.placeholder.com/250x150?text=Hat' }
    ] }
];

// Login simulation
document.getElementById('googleLogin').addEventListener('click', () => {
    // In real: firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
    currentUser = { id: 1, name: 'Google User' };
    updateUI();
});

document.getElementById('discordLogin').addEventListener('click', () => {
    // In real: Implement Discord OAuth
    currentUser = { id: 2, name: 'Discord User' };
    updateUI();
});

// Add current user's shop if not exists
function ensureUserShop() {
    if (!currentUser) return;
    if (!shops.find(s => s.id === currentUser.id)) {
        shops.push({ id: currentUser.id, name: `${currentUser.name}'s Shop`, items: [] });
        saveData();
    }
}

// Update UI based on login state
function updateUI() {
    if (currentUser) {
        document.getElementById('authSection').style.display = 'none';
        document.getElementById('nav').style.display = 'flex';
        document.getElementById('dashboardLink').style.display = 'inline';
        document.getElementById('logoutLink').style.display = 'inline';
        document.getElementById('home').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        ensureUserShop();
        renderShops();
        renderMyItems();
    } else {
        document.getElementById('authSection').style.display = 'block';
        document.getElementById('nav').style.display = 'none';
        document.getElementById('home').style.display = 'block';
        document.getElementById('dashboard').style.display = 'none';
        renderHomeShops();
    }
}

// Render home shops
function renderHomeShops() {
    const grid = document.getElementById('shopsGrid');
    grid.innerHTML = shops.map(shop => `
        <div class="shop-card">
            <h4>${shop.name}</h4>
            <p>${shop.items.length} items</p>
            <button onclick="viewShop(${shop.id})">View Shop</button>
        </div>
    `).join('');
}

// Render all shops in dashboard
function renderShops() {
    const grid = document.getElementById('allShopsGrid');
    grid.innerHTML = shops.filter(s => s.id !== currentUser.id).map(shop => `
        <div class="shop-card">
            <h4>${shop.name}</h4>
            <div class="grid">${shop.items.map(item => `
                <div class="item-card">
                    <img src="${item.image}" alt="${item.name}">
                    <h4>${item.name}</h4>
                    <p class="price">R$ ${item.price}</p>
                    <button onclick="buyItem(${item.id})">Buy</button>
                </div>
            `).join('')}</div>
        </div>
    `).join('');
}

// Render my items
function renderMyItems() {
    const userShop = shops.find(s => s.id === currentUser.id);
    const list = document.getElementById('myItemsList');
    list.innerHTML = userShop.items.map(item => `
        <li>${item.name} - R$ ${item.price} <button class="remove-btn" onclick="removeItem(${item.id})">Remove</button></li>
    `).join('');
}

// Add item
document.getElementById('addItemForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const userShop = shops.find(s => s.id === currentUser.id);
    const newItem = {
        id: Date.now(),
        name: document.getElementById('itemName').value,
        price: parseInt(document.getElementById('itemPrice').value),
        image: document.getElementById('itemImage').value
    };
    userShop.items.push(newItem);
    saveData();
    renderMyItems();
    renderShops();
    e.target.reset();
});

// Remove item
function removeItem(itemId) {
    const userShop = shops.find(s => s.id === currentUser.id);
    userShop.items = userShop.items.filter(i => i.id !== itemId);
    saveData();
    renderMyItems();
    renderShops();
}

// Mock buy
function buyItem(itemId) {
    alert('Item purchased! (Mock - implement payment in backend)');
}

// Mock view shop (expands in dashboard)
function viewShop(shopId) {
    alert(`Viewing shop ${shopId} (Integrated in dashboard)`);
}

// Logout
document.getElementById('logoutLink').addEventListener('click', () => {
    currentUser = null;
    localStorage.removeItem('shops'); // Optional: clear data
    updateUI();
});

// Nav links
document.getElementById('homeLink').addEventListener('click', (e) => {
    e.preventDefault();
    if (currentUser) {
        currentUser = null;
        updateUI();
    }
});

document.getElementById('dashboardLink').addEventListener('click', (e) => {
    e.preventDefault();
    updateUI(); // Already shows dashboard
});

// Save/Load data
function saveData() {
    localStorage.setItem('shops', JSON.stringify(shops));
}

// Init
updateUI();
