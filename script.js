// Mock data (replace with Firebase later)
let shops = JSON.parse(localStorage.getItem('rbxstock_shops')) || [
  { id:1, name:"ProSeller", avatar:"https://i.imgur.com/7g5e1Qw.png", stock:125000 },
  { id:2, name:"FastTrade", avatar:"https://i.imgur.com/3j5e1Qw.png", stock:89000 },
  { id:3, name:"CheapRbx", avatar:"https://i.imgur.com/9k5e1Qw.png", stock:450000 },
  { id:4, name:"EliteStock", avatar:"https://i.imgur.com/1m5e1Qw.png", stock:320000 },
  { id:5, name:"QuickSell", avatar:"https://i.imgur.com/5p5e1Qw.png", stock:167000 },
  { id:6, name:"TrustTrade", avatar:"https://i.imgur.com/6t5e1Qw.png", stock:298000 },
];

let currentUser = null;

// Render shops
function renderShops() {
  const grid = document.getElementById('shopsGrid');
  grid.innerHTML = shops.map(shop => `
    <div class="shop-card">
      <img src="${shop.avatar}" alt="${shop.name}">
      <h3>${shop.name}</h3>
      <div class="stock">${(shop.stock/1000).toFixed(0)}K Robux</div>
      <button class="btn green" style="padding:10px 20px;margin-top:10px;">Visit Shop</button>
    </div>
  `).join('');
}

// Fake live counters
setInterval(() => {
  document.getElementById('usersOnline').textContent = Math.floor(Math.random()*200 + 800);
}, 8000);

renderShops();

// ======== AUTH (Google + Discord ready) ========
// Uncomment and add your Firebase config for real login
/*
const firebaseConfig = { YOUR_CONFIG_HERE };
firebase.initializeApp(firebaseConfig);

document.querySelector('.google').addEventListener('click', () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider);
});

document.querySelector('.discord').addEventListener('click', () => {
  const provider = new firebase.auth.OAuthProvider('oidc.discord');
  firebase.auth().signInWithPopup(provider);
});
*/

// Demo login (click either button to login as demo user)
document.querySelectorAll('.login-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    currentUser = {
      name: "DemoUser123",
      avatar: "https://i.imgur.com/4k5e1Qw.png",
      myListings: JSON.parse(localStorage.getItem('myListings') || '[]')
    };

    document.getElementById('authButtons').style.display = 'none';
    document.getElementById('userMenu').style.display = 'flex';
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userAvatar').src = currentUser.avatar;
    document.getElementById('dashboard').style.display = 'block';

    renderMyListings();
  });
});

document.getElementById('logoutBtn').addEventListener('click', () => {
  currentUser = null;
  document.getElementById('authButtons').style.display = 'block';
  document.getElementById('userMenu').style.display = 'none';
  document.getElementById('dashboard').style.display = 'none';
});

// Add listing
document.getElementById('addListingBtn').addEventListener('click', () => {
  const amount = parseInt(document.getElementById('amount').value);
  const price = parseFloat(document.getElementById('price').value);

  if (amount && price) {
    const listing = { id:Date.now(), amount, price, usdPerK: (price/(amount/1000)).toFixed(2) };
    currentUser.myListings.push(listing);
    localStorage.setItem('myListings', JSON.stringify(currentUser.myListings));
    renderMyListings();
    document.getElementById('amount').value = '';
    document.getElementById('price').value = '';
  }
});

function renderMyListings() {
  const container = document.getElementById('myListings');
  if (!currentUser || currentUser.myListings.length === 0) {
    container.innerHTML = '<p>No active listings</p>';
    return;
  }

  container.innerHTML = currentUser.myListings.map(l => `
    <div>
      <span>${(l.amount/1000).toFixed(0)}K Robux → $${l.price} ($${l.usdPerK}/K)</span>
      <button class="remove-btn" onclick="removeListing(${l.id})">Remove</button>
    </div>
  `).join('');
}

function removeListing(id) {
  currentUser.myListings = currentUser.myListings.filter(x => x.id !== id);
  localStorage.setItem('myListings', JSON.stringify(currentUser.myListings));
  renderMyListings();
}
