// Additional component functionality for XISTORE website

// Page transition and scroll to top functionality
class PageTransition {
    constructor() {
        this.init();
    }
    
    init() {
        // Auto scroll to top on page change/refresh
        this.scrollToTopOnPageChange();
        
        // Initialize smooth page transitions
        this.initPageTransitions();
        
        // Initialize route handling (for SPA-like behavior)
        this.initRouteHandling();
    }
    
    scrollToTopOnPageChange() {
        // Scroll to top immediately when page loads
        window.scrollTo(0, 0);
        
        // Also handle browser back/forward buttons
        window.addEventListener('pageshow', (e) => {
            if (e.persisted) {
                window.scrollTo(0, 0);
            }
        });
        
        // Handle hash changes
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash;
            if (!hash) {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    initPageTransitions() {
        // Add page transition effects
        document.body.classList.add('page-loaded');
        
        // Handle internal links with transition effects
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;
            
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                // Hash link - smooth scroll handled elsewhere
                return;
            }
            
            if (href && !href.startsWith('http') && !href.startsWith('mailto') && !href.startsWith('tel')) {
                // Internal link
                e.preventDefault();
                this.transitionToPage(href);
            }
        });
    }
    
    transitionToPage(url) {
        // Add fade out effect
        document.body.classList.add('page-transitioning');
        
        setTimeout(() => {
            window.location.href = url;
        }, 300);
    }
    
    initRouteHandling() {
        // Simple client-side routing for single page application feel
        const routes = {
            '#catalog': () => this.showSection('catalog'),
            '#about': () => this.showSection('about'),
            '#contact': () => this.showSection('contact'),
            '#services': () => this.showSection('services')
        };
        
        // Handle route changes
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash;
            if (routes[hash]) {
                routes[hash]();
            }
        });
    }
    
    showSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = section.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
}

// Advanced search functionality
class SearchManager {
    constructor() {
        this.searchInput = document.querySelector('.search-input');
        this.searchResults = [];
        this.init();
    }
    
    init() {
        if (!this.searchInput) return;
        
        this.createSearchDropdown();
        this.bindEvents();
        this.loadSearchData();
    }
    
    createSearchDropdown() {
        const searchContainer = this.searchInput.parentElement;
        
        this.dropdown = document.createElement('div');
        this.dropdown.className = 'search-dropdown';
        this.dropdown.innerHTML = `
            <div class="search-suggestions">
                <div class="suggestion-category">
                    <h5>Популярные запросы</h5>
                    <div class="suggestions-list"></div>
                </div>
                <div class="suggestion-category">
                    <h5>Товары</h5>
                    <div class="products-list"></div>
                </div>
            </div>
        `;
        
        searchContainer.appendChild(this.dropdown);
    }
    
    bindEvents() {
        let searchTimeout;
        
        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();
            
            if (query.length > 1) {
                searchTimeout = setTimeout(() => {
                    this.performSearch(query);
                }, 300);
            } else {
                this.hideDropdown();
            }
        });
        
        this.searchInput.addEventListener('focus', () => {
            if (this.searchInput.value.length > 1) {
                this.showDropdown();
            }
        });
        
        document.addEventListener('click', (e) => {
            if (!this.searchInput.contains(e.target) && !this.dropdown.contains(e.target)) {
                this.hideDropdown();
            }
        });
    }
    
    loadSearchData() {
        // Mock search data - in real app this would come from API
        this.searchData = {
            products: [
                { name: 'Xiaomi 14', category: 'Смартфоны', price: '1299 BYN' },
                { name: 'Redmi Note 13', category: 'Смартфоны', price: '449 BYN' },
                { name: 'Mi Band 8', category: 'Умные часы', price: '89 BYN' },
                { name: 'Mi Robot Vacuum', category: 'Умный дом', price: '799 BYN' }
            ],
            suggestions: ['Смартфоны Xiaomi', 'Умные часы', 'Наушники', 'Роботы-пылесосы']
        };
    }
    
    performSearch(query) {
        const filteredProducts = this.searchData.products.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
        );
        
        const filteredSuggestions = this.searchData.suggestions.filter(suggestion =>
            suggestion.toLowerCase().includes(query.toLowerCase())
        );
        
        this.renderSearchResults(filteredProducts, filteredSuggestions);
        this.showDropdown();
    }
    
    renderSearchResults(products, suggestions) {
        const suggestionsContainer = this.dropdown.querySelector('.suggestions-list');
        const productsContainer = this.dropdown.querySelector('.products-list');
        
        // Render suggestions
        suggestionsContainer.innerHTML = suggestions.map(suggestion => `
            <div class="search-suggestion-item" data-query="${suggestion}">
                <i class="fas fa-search"></i>
                <span>${suggestion}</span>
            </div>
        `).join('');
        
        // Render products
        productsContainer.innerHTML = products.map(product => `
            <div class="search-product-item">
                <div class="product-info">
                    <span class="product-name">${product.name}</span>
                    <span class="product-category">${product.category}</span>
                </div>
                <span class="product-price">${product.price}</span>
            </div>
        `).join('');
        
        // Bind click events
        suggestionsContainer.addEventListener('click', (e) => {
            const item = e.target.closest('.search-suggestion-item');
            if (item) {
                this.searchInput.value = item.dataset.query;
                this.hideDropdown();
            }
        });
    }
    
    showDropdown() {
        this.dropdown.classList.add('active');
    }
    
    hideDropdown() {
        this.dropdown.classList.remove('active');
    }
}

// Shopping cart functionality
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart') || '[]');
        this.init();
    }
    
    init() {
        this.updateCartDisplay();
        this.bindEvents();
    }
    
    bindEvents() {
        // Cart button click
        document.addEventListener('click', (e) => {
            if (e.target.closest('.cart-btn')) {
                this.showCartModal();
            }
        });
    }
    
    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                ...product,
                quantity: 1
            });
        }
        
        this.saveCart();
        this.updateCartDisplay();
        this.showAddedToCartAnimation(product);
    }
    
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
    }
    
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(0, quantity);
            if (item.quantity === 0) {
                this.removeItem(productId);
            } else {
                this.saveCart();
                this.updateCartDisplay();
            }
        }
    }
    
    getTotal() {
        return this.items.reduce((total, item) => {
            return total + (parseFloat(item.price.replace(/[^\d.]/g, '')) * item.quantity);
        }, 0);
    }
    
    getItemsCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }
    
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }
    
    updateCartDisplay() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const count = this.getItemsCount();
            cartCount.textContent = count;
            cartCount.style.display = count > 0 ? 'flex' : 'none';
        }
    }
    
    showCartModal() {
        const modal = this.createCartModal();
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('active'), 10);
    }
    
    createCartModal() {
        const modal = document.createElement('div');
        modal.className = 'modal cart-modal';
        
        const cartItems = this.items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p class="item-price">${item.price}</p>
                </div>
                <div class="quantity-controls">
                    <button class="qty-btn minus">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="qty-btn plus">+</button>
                </div>
                <button class="remove-item" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
        
        modal.innerHTML = `
            <div class="modal-content cart-content">
                <button class="modal-close">&times;</button>
                <h3>Корзина</h3>
                <div class="cart-items">
                    ${cartItems || '<p class="empty-cart">Корзина пуста</p>'}
                </div>
                ${this.items.length > 0 ? `
                    <div class="cart-footer">
                        <div class="cart-total">
                            <strong>Итого: ${this.getTotal().toFixed(2)} BYN</strong>
                        </div>
                        <button class="btn btn-primary checkout-btn">Оформить заказ</button>
                    </div>
                ` : ''}
            </div>
        `;
        
        // Bind events
        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal') || e.target.classList.contains('modal-close')) {
                modal.classList.remove('active');
                setTimeout(() => modal.remove(), 300);
            }
            
            if (e.target.classList.contains('minus')) {
                const cartItem = e.target.closest('.cart-item');
                const id = cartItem.dataset.id;
                const currentQty = parseInt(cartItem.querySelector('.quantity').textContent);
                this.updateQuantity(id, currentQty - 1);
                this.refreshCartModal(modal);
            }
            
            if (e.target.classList.contains('plus')) {
                const cartItem = e.target.closest('.cart-item');
                const id = cartItem.dataset.id;
                const currentQty = parseInt(cartItem.querySelector('.quantity').textContent);
                this.updateQuantity(id, currentQty + 1);
                this.refreshCartModal(modal);
            }
            
            if (e.target.closest('.remove-item')) {
                const id = e.target.closest('.remove-item').dataset.id;
                this.removeItem(id);
                this.refreshCartModal(modal);
            }
            
            if (e.target.classList.contains('checkout-btn')) {
                this.showCheckout();
                modal.classList.remove('active');
                setTimeout(() => modal.remove(), 300);
            }
        });
        
        return modal;
    }
    
    refreshCartModal(modal) {
        const cartContent = modal.querySelector('.cart-content');
        const newModal = this.createCartModal();
        cartContent.innerHTML = newModal.querySelector('.cart-content').innerHTML;
    }
    
    showAddedToCartAnimation(product) {
        // Create floating animation
        const animation = document.createElement('div');
        animation.className = 'cart-add-animation';
        animation.innerHTML = `
            <i class="fas fa-shopping-cart"></i>
            <span>Товар добавлен</span>
        `;
        
        document.body.appendChild(animation);
        
        setTimeout(() => {
            animation.classList.add('animate');
        }, 10);
        
        setTimeout(() => {
            animation.remove();
        }, 2000);
    }
    
    showCheckout() {
        showToast('Переход к оформлению заказа...', 'info');
        // Here you would typically redirect to checkout page
    }
}

// Product gallery and zoom functionality
class ProductGallery {
    constructor(galleryElement) {
        this.gallery = galleryElement;
        this.images = Array.from(galleryElement.querySelectorAll('img'));
        this.currentIndex = 0;
        this.init();
    }
    
    init() {
        this.createZoomModal();
        this.bindEvents();
    }
    
    createZoomModal() {
        this.zoomModal = document.createElement('div');
        this.zoomModal.className = 'zoom-modal';
        this.zoomModal.innerHTML = `
            <div class="zoom-content">
                <button class="zoom-close">&times;</button>
                <button class="zoom-prev"><i class="fas fa-chevron-left"></i></button>
                <img class="zoom-image" src="" alt="">
                <button class="zoom-next"><i class="fas fa-chevron-right"></i></button>
                <div class="zoom-indicators"></div>
            </div>
        `;
        
        document.body.appendChild(this.zoomModal);
    }
    
    bindEvents() {
        this.images.forEach((img, index) => {
            img.addEventListener('click', () => {
                this.openZoom(index);
            });
        });
        
        this.zoomModal.addEventListener('click', (e) => {
            if (e.target.classList.contains('zoom-modal') || e.target.classList.contains('zoom-close')) {
                this.closeZoom();
            }
            
            if (e.target.closest('.zoom-prev')) {
                this.showPrevImage();
            }
            
            if (e.target.closest('.zoom-next')) {
                this.showNextImage();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (this.zoomModal.classList.contains('active')) {
                if (e.key === 'Escape') {
                    this.closeZoom();
                } else if (e.key === 'ArrowLeft') {
                    this.showPrevImage();
                } else if (e.key === 'ArrowRight') {
                    this.showNextImage();
                }
            }
        });
    }
    
    openZoom(index) {
        this.currentIndex = index;
        this.updateZoomImage();
        this.zoomModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeZoom() {
        this.zoomModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    updateZoomImage() {
        const zoomImage = this.zoomModal.querySelector('.zoom-image');
        zoomImage.src = this.images[this.currentIndex].src;
        zoomImage.alt = this.images[this.currentIndex].alt;
    }
    
    showNextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateZoomImage();
    }
    
    showPrevImage() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateZoomImage();
    }
}

// Initialize components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize page transitions
    new PageTransition();
    
    // Initialize search manager
    new SearchManager();
    
    // Initialize shopping cart
    window.cart = new ShoppingCart();
    
    // Initialize product galleries
    document.querySelectorAll('.product-gallery').forEach(gallery => {
        new ProductGallery(gallery);
    });
    
    console.log('All components initialized successfully');
});

// Add CSS for component styles
const componentStyles = `
    /* Page transition styles */
    .page-loaded {
        animation: pageLoadIn 0.5s ease-out;
    }
    
    .page-transitioning {
        animation: pageLoadOut 0.3s ease-in;
    }
    
    @keyframes pageLoadIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes pageLoadOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
    
    /* Search dropdown styles */
    .search-dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: #fff;
        border: 2px solid #f0f0f0;
        border-top: none;
        border-radius: 0 0 15px 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: all 0.3s ease;
        z-index: 1000;
        max-height: 400px;
        overflow-y: auto;
    }
    
    .search-dropdown.active {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }
    
    .suggestion-category h5 {
        padding: 10px 15px 5px;
        margin: 0;
        color: #666;
        font-size: 12px;
        text-transform: uppercase;
        font-weight: 600;
        border-bottom: 1px solid #f0f0f0;
    }
    
    .search-suggestion-item,
    .search-product-item {
        display: flex;
        align-items: center;
        padding: 10px 15px;
        cursor: pointer;
        transition: background 0.3s ease;
        border-bottom: 1px solid #f8f9fa;
    }
    
    .search-suggestion-item:hover,
    .search-product-item:hover {
        background: #f8f9fa;
    }
    
    .search-suggestion-item i {
        color: #FF6B35;
        margin-right: 10px;
    }
    
    .search-product-item {
        justify-content: space-between;
    }
    
    .product-name {
        font-weight: 500;
        display: block;
    }
    
    .product-category {
        font-size: 12px;
        color: #666;
    }
    
    .product-price {
        color: #FF6B35;
        font-weight: 600;
    }
    
    /* Cart modal styles */
    .cart-modal .modal-content {
        max-width: 600px;
        max-height: 80vh;
    }
    
    .cart-items {
        max-height: 400px;
        overflow-y: auto;
        margin: 20px 0;
    }
    
    .cart-item {
        display: flex;
        align-items: center;
        padding: 15px;
        border-bottom: 1px solid #f0f0f0;
        gap: 15px;
    }
    
    .item-info {
        flex: 1;
    }
    
    .item-info h4 {
        margin: 0 0 5px 0;
        font-size: 16px;
    }
    
    .item-price {
        margin: 0;
        color: #FF6B35;
        font-weight: 600;
    }
    
    .quantity-controls {
        display: flex;
        align-items: center;
        gap: 10px;
        border: 1px solid #ddd;
        border-radius: 5px;
        padding: 5px;
    }
    
    .qty-btn {
        background: none;
        border: none;
        width: 30px;
        height: 30px;
        cursor: pointer;
        font-size: 16px;
        color: #FF6B35;
    }
    
    .quantity {
        min-width: 30px;
        text-align: center;
        font-weight: 500;
    }
    
    .remove-item {
        background: none;
        border: none;
        color: #dc3545;
        cursor: pointer;
        padding: 8px;
        border-radius: 4px;
        transition: background 0.3s ease;
    }
    
    .remove-item:hover {
        background: rgba(220, 53, 69, 0.1);
    }
    
    .cart-footer {
        border-top: 1px solid #f0f0f0;
        padding-top: 15px;
    }
    
    .cart-total {
        text-align: right;
        margin-bottom: 15px;
        font-size: 18px;
    }
    
    .empty-cart {
        text-align: center;
        color: #666;
        padding: 40px 20px;
        font-style: italic;
    }
    
    /* Cart add animation */
    .cart-add-animation {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #FF6B35;
        color: #fff;
        padding: 15px 20px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 3000;
        opacity: 0;
        transition: all 0.3s ease;
    }
    
    .cart-add-animation.animate {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1.1);
    }
    
    /* Zoom modal styles */
    .zoom-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 3000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }
    
    .zoom-modal.active {
        opacity: 1;
        visibility: visible;
    }
    
    .zoom-content {
        position: relative;
        max-width: 90vw;
        max-height: 90vh;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .zoom-image {
        max-width: 100%;
        max-height: 90vh;
        object-fit: contain;
    }
    
    .zoom-close {
        position: absolute;
        top: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.9);
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        font-size: 24px;
        cursor: pointer;
        z-index: 1;
    }
    
    .zoom-prev,
    .zoom-next {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255, 255, 255, 0.9);
        border: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
    }
    
    .zoom-prev {
        left: 20px;
    }
    
    .zoom-next {
        right: 20px;
    }
    
    @media (max-width: 768px) {
        .search-dropdown {
            position: fixed;
            left: 10px;
            right: 10px;
            top: 70px;
        }
        
        .cart-modal .modal-content {
            margin: 10px;
            max-height: 90vh;
        }
        
        .zoom-prev,
        .zoom-next {
            width: 40px;
            height: 40px;
            font-size: 16px;
        }
        
        .zoom-prev {
            left: 10px;
        }
        
        .zoom-next {
            right: 10px;
        }
    }
`;

// Inject component styles
const styleSheet = document.createElement('style');
styleSheet.textContent = componentStyles;
document.head.appendChild(styleSheet);