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

// Render shops with stagger animation
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

  // Stagger entrance
  const cards = grid.querySelectorAll('.shop-card');
  cards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
    setTimeout(() => card.classList.add('animate'), 100);
  });
}

// Fake live counters
setInterval(() => {
  document.getElementById('usersOnline').textContent = Math.floor(Math.random()*200 + 800);
}, 8000);

renderShops();

// Ripple effect
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('ripple')) {
    const ripple = document.createElement('span');
    const rect = e.target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px; height: ${size}px;
      left: ${x}px; top: ${y}px;
      background: rgba(255,255,255,0.4);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple-anim 0.6s linear;
      pointer-events: none;
    `;
    e.target.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }
});

const style = document.createElement('style');
style.textContent = `
  @keyframes ripple-anim {
    to { transform: scale(4); opacity: 0; }
  }
`;
document.head.appendChild(style);

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

    // Animate dashboard entrance
    document.getElementById('dashboard').style.opacity = '0';
    document.getElementById('dashboard').style.transform = 'translateY(20px)';
    setTimeout(() => {
      document.getElementById('dashboard').style.transition = 'all 0.5s ease';
      document.getElementById('dashboard').style.opacity = '1';
      document.getElementById('dashboard').style.transform = 'translateY(0)';
    }, 100);

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
    container.innerHTML = '<p style="opacity:0.7;">No active listings</p>';
    return;
  }

  container.innerHTML = currentUser.myListings.map(l => `
    <div>
      <span>${(l.amount/1000).toFixed(0)}K Robux → $${l.price} ($${l.usdPerK}/K)</span>
      <button class="remove-btn ripple" onclick="removeListing(${l.id})">Remove</button>
    </div>
  `).join('');
}

function removeListing(id) {
  currentUser.myListings = currentUser.myListings.filter(x => x.id !== id);
  localStorage.setItem('myListings', JSON.stringify(currentUser.myListings));
  renderMyListings();
}
