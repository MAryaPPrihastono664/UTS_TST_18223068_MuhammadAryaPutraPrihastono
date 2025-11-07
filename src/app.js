// Menunggu seluruh konten HTML dimuat sebelum menjalankan skrip
document.addEventListener('DOMContentLoaded', () => {

    // --- Inisialisasi Widget 1: Akun Pengguna ---
    const loadUserBtn = document.getElementById('load-user-btn');
    const userProfileDiv = document.getElementById('user-profile');
    
    loadUserBtn.addEventListener('click', fetchUserProfile);

    async function fetchUserProfile() {
        showLoading(userProfileDiv);
        try {
            const response = await fetch('https://api.randomuser.me/');
            if (!response.ok) throw new Error('Gagal memuat profil');
            const data = await response.json();
            const user = data.results[0];

            userProfileDiv.innerHTML = `
                <div class="profile-card">
                    <img src="${user.picture.medium}" alt="Foto Profil">
                    <div>
                        <div class="name">${user.name.first} ${user.name.last}</div>
                        <div class="email">${user.email}</div>
                    </div>
                </div>
            `;
        } catch (error) {
            showError(userProfileDiv, error.message);
        }
    }


    // --- Inisialisasi Widget 2: Katalog Produk ---
    const loadProductsBtn = document.getElementById('load-products-btn');
    const productListDiv = document.getElementById('product-list');

    loadProductsBtn.addEventListener('click', fetchProducts);

    async function fetchProducts() {
        showLoading(productListDiv);
        try {
            // Kita batasi hanya 3 produk untuk demo
            const response = await fetch('https://fakestoreapi.com/products?limit=3');
            if (!response.ok) throw new Error('Gagal memuat produk');
            const products = await response.json();

            // Format harga ke USD
            const formatter = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
            });

            // Kosongkan div dan isi dengan produk
            productListDiv.innerHTML = ""; 
            products.forEach(product => {
                const productEl = document.createElement('div');
                productEl.className = 'product-card';
                productEl.innerHTML = `
                    <img src="${product.image}" alt="${product.title}">
                    <div class="info">
                        <div class="title">${product.title}</div>
                    </div>
                    <div class="price">${formatter.format(product.price)}</div>
                `;
                productListDiv.appendChild(productEl);
            });

        } catch (error) {
            showError(productListDiv, error.message);
        }
    }


    // --- Inisialisasi Widget 3: Pengecekan Kode Pos ---
    const checkPostalBtn = document.getElementById('check-postal-btn');
    const postalInput = document.getElementById('postal-input');
    const postalResultDiv = document.getElementById('postal-result');

    checkPostalBtn.addEventListener('click', fetchPostalInfo);

    async function fetchPostalInfo() {
        const postalCode = postalInput.value;
        if (!postalCode) {
            showError(postalResultDiv, 'Silakan masukkan kode pos. (Amerika)');
            return;
        }
        
        showLoading(postalResultDiv);
        try {
            // API ini menggunakan path /{country_code}/{postal_code}
            const response = await fetch(`https://api.zippopotam.us/US/${postalCode}`);
            if (!response.ok) throw new Error('Kode pos tidak ditemukan.');
            
            const data = await response.json();
            const place = data.places[0];

            postalResultDiv.innerHTML = `
                <div class="location-info">
                    <strong>Negara:</strong> ${data.country} (${data['country abbreviation']})
                    <span><strong>Wilayah:</strong> ${place['place name']}</span>
                    <span><strong>Provinsi:</strong> ${place.state}</span>
                </div>
            `;
        } catch (error) {
            showError(postalResultDiv, error.message);
        }
    }


    // --- Fungsi Bantuan (Helper Functions) ---
    function showLoading(element) {
        element.innerHTML = '<p class="loading">Memuat data...</p>';
    }

    function showError(element, message) {
        element.innerHTML = `<p class="error">${message}</p>`;
    }

});