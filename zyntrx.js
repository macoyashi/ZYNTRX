function switchTab(btn, filter) {
  document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');

  const isHomepage = window.location.pathname.includes('/homepage/');
  const prefix = isHomepage ? '../SHOPS/' : './';

  if (filter === 'women') {
    location.href = prefix + 'womenShop.html';
  } else if (filter === 'sport') {
    location.href = prefix + 'sportShop.html';
  } else if (filter === 'men') {
    location.href = prefix + 'menSHOP.html';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Universal Product Card Click Handler
  document.querySelectorAll('.product-card').forEach(card => {
    card.onclick = function (e) {
      const img = this.querySelector('img');
      const imgSrc = img.getAttribute('src');
      const name = img.getAttribute('alt') || 'Sneaker';

      const isHomepage = window.location.pathname.includes('/homepage/');
      const prefix = isHomepage ? '../SHOPS/' : './';

      // Redirect to buy_add.html with auto-add flag
      location.href = prefix + `buy_add.html?img=${encodeURIComponent(imgSrc)}&name=${encodeURIComponent(name)}&buyNow=true`;
    };
  });

  // Buy Now Page Logic
  const qtyInput = document.getElementById('buyNowQty');
  if (qtyInput) {
    const params = new URLSearchParams(window.location.search);
    const imgUrl = params.get('img');
    const prodName = params.get('name');
    const basePrice = parseFloat(params.get('price')) || 129.00;

    const imgEl = document.getElementById('buyNowImg');
    const nameEl = document.getElementById('buyNowName');
    const priceEl = document.getElementById('buyNowPrice');
    const totalEl = document.getElementById('buyNowTotal');

    if (imgUrl) imgEl.src = imgUrl;
    if (prodName) {
      nameEl.textContent = prodName;
      imgEl.alt = prodName;
    }

    function updateTotal() {
      let qty = parseInt(qtyInput.value);
      if (isNaN(qty) || qty < 1) {
        qty = 1;
        qtyInput.value = 1;
      }
      const total = (basePrice * qty).toFixed(2);
      priceEl.textContent = '$' + total;
      totalEl.textContent = '$' + total;
    }

    qtyInput.addEventListener('input', updateTotal);
    updateTotal();

    // Payment Method Toggle Logic
    const paymentSelect = document.getElementById('paymentMethodSelect');
    const ewalletField = document.getElementById('ewalletField');
    if (paymentSelect && ewalletField) {
      paymentSelect.addEventListener('change', function () {
        if (this.value === 'ewallet') {
          ewalletField.style.display = 'flex';
        } else {
          ewalletField.style.display = 'none';
        }
      });
    }

    // Confirm Order Logic
    const confirmBtn = document.querySelector('.confirm-btn');
    const successModal = document.getElementById('successModal');
    if (confirmBtn && successModal) {
      confirmBtn.addEventListener('click', function (e) {
        e.preventDefault();
        successModal.classList.add('active');
      });
    }
  }

  // UNIVERSAL CAROUSEL LOGIC
  function initCarousel(carouselElement, interval = 5000) {
    const items = carouselElement.querySelectorAll('.carousel-item');
    const indicators = carouselElement.querySelectorAll('.indicator');
    const nextBtn = carouselElement.querySelector('.next') || carouselElement.querySelector('.carousel-control.next');
    const prevBtn = carouselElement.querySelector('.prev') || carouselElement.querySelector('.carousel-control.prev');
    const inner = carouselElement.querySelector('.carousel-inner');
    const isMulti = carouselElement.classList.contains('featured-carousel');

    let currentIndex = 0;
    let autoPlayInterval;

    function showSlide(index) {
      if (items.length === 0) return;

      if (isMulti) {
        // Multi-item shift logic
        currentIndex = (index + items.length) % items.length;
        const isMobile = window.innerWidth <= 768;
        const itemsPerView = isMobile ? 1 : 3;
        
        // Prevent sliding past the end on desktop
        if (!isMobile && currentIndex > items.length - 3) {
          currentIndex = 0; // Loop back to start
        }

        const shift = currentIndex * (100 / itemsPerView);
        inner.style.transform = `translateX(-${shift}%)`;
        
        // Update indicators if they exist
        indicators.forEach((ind, i) => {
          ind.classList.toggle('active', i === currentIndex);
        });
      } else {
        // Standard fade/stack logic
        items.forEach(item => item.classList.remove('active'));
        indicators.forEach(ind => ind.classList.remove('active'));

        currentIndex = (index + items.length) % items.length;
        items[currentIndex].classList.add('active');
        if (indicators[currentIndex]) indicators[currentIndex].classList.add('active');
      }
    }

    function nextSlide() {
      showSlide(currentIndex + 1);
    }

    function prevSlide() {
      showSlide(currentIndex - 1);
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        nextSlide();
        resetAutoPlay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        prevSlide();
        resetAutoPlay();
      });
    }

    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        showSlide(index);
        resetAutoPlay();
      });
    });

    function startAutoPlay() {
      autoPlayInterval = setInterval(nextSlide, interval);
    }

    function resetAutoPlay() {
      clearInterval(autoPlayInterval);
      startAutoPlay();
    }

    startAutoPlay();
  }

  // Initialize all carousels on the page
  const mainCarousels = document.querySelectorAll('.hero-carousel');
  const bentoElements = document.querySelectorAll('.bento-carousel');

  mainCarousels.forEach(carousel => initCarousel(carousel, 6000));

  if (bentoElements.length > 0) {
    const bentoInterval = 4000;
    const bentoStates = Array.from(bentoElements).map(carousel => {
      const items = carousel.querySelectorAll('.carousel-item');
      let currentIndex = 0;
      return {
        showSlide: (index) => {
          if (items.length === 0) return;
          items.forEach(item => item.classList.remove('active'));
          currentIndex = (index + items.length) % items.length;
          items[currentIndex].classList.add('active');
        }
      };
    });

    let globalBentoIndex = 0;
    setInterval(() => {
      globalBentoIndex++;
      bentoStates.forEach(state => state.showSlide(globalBentoIndex));
    }, bentoInterval);
  }

  // LOGIN MODAL LOGIC
  const loginModalHtml = `
    <div id="loginModal" class="login-modal">
      <div class="login-close" id="closeLogin">&times;</div>
      <div class="login-header">
        <h2>Welcome Back</h2>
        <p>Login to your ZYNTRX account</p>
      </div>
      <form class="login-form" id="loginForm">
        <div class="form-group">
          <label>Email Address</label>
          <input type="email" placeholder="email@example.com" required>
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" placeholder="••••••••" required>
        </div>
        <button type="submit" class="login-btn">Sign In</button>
      </form>
      <div class="login-footer">
        Don't have an account? <a href="#">Create One</a>
      </div>
    </div>
    <div id="loginSuccessModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-icon-success">✔</div>
        <h3 class="modal-title">Login Successful!</h3>
        <p class="modal-text">Welcome back to ZYNTRX. You can now access your account and order history.</p>
        <button class="modal-btn" id="closeSuccessModal">Continue Shopping</button>
      </div>
    </div>
    <div id="toastContainer" class="toast-container"></div>
  `;

  // Inject modal into body (excluding buy_add.html as requested)
  if (!window.location.pathname.includes('buy_add.html')) {
    document.body.insertAdjacentHTML('beforeend', loginModalHtml);
  }

  const loginModal = document.getElementById('loginModal');
  const loginForm = document.getElementById('loginForm');
  const toastContainer = document.getElementById('toastContainer');
  const closeLogin = document.getElementById('closeLogin');
  const accountBtn = document.querySelector('[aria-label="Account"]');
  const cartOverlay = document.getElementById('cartOverlay');

  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <div class="toast-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <div class="toast-message">${message}</div>
    `;
    toastContainer.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Remove after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3000);
  }

  function toggleLoginModal(show) {
    if (loginModal) loginModal.classList.toggle('active', show);
    if (cartOverlay) cartOverlay.classList.toggle('active', show);
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      toggleLoginModal(false);

      const successModal = document.getElementById('loginSuccessModal');
      if (successModal) {
        successModal.classList.add('active');

        const closeBtn = document.getElementById('closeSuccessModal');
        if (closeBtn) {
          closeBtn.onclick = () => successModal.classList.remove('active');
        }

        // Also close if clicking overlay
        successModal.onclick = (e) => {
          if (e.target === successModal) successModal.classList.remove('active');
        };
      }
    });
  }

  if (accountBtn) {
    accountBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleLoginModal(true);
    });
  }

  if (closeLogin) {
    closeLogin.addEventListener('click', () => toggleLoginModal(false));
  }

  // Close modal if clicking overlay
  if (cartOverlay) {
    cartOverlay.addEventListener('click', () => {
      toggleLoginModal(false);
    });
  }

  // UNIVERSAL CART LOGIC
  const cartBtn = document.querySelector('[aria-label="Cart"]');
  const cartSidebar = document.getElementById('cartSidebar');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartSubtotalEl = document.getElementById('cartSubtotal');

  function toggleShopCart(show) {
    if (cartSidebar && cartOverlay) {
      cartSidebar.classList.toggle('active', show);
      cartOverlay.classList.toggle('active', show);
    }
  }

  window.renderCart = function () {
    if (!cartItemsList || !cartSubtotalEl) return;
    const cart = JSON.parse(localStorage.getItem('zyntrx_cart')) || [];
    cartItemsList.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
      cartItemsList.innerHTML = '<p style="padding:20px;color:#888;font-size:14px;">Your cart is empty.</p>';
    } else {
      cart.forEach((item, i) => {
        const price = 129.00 * item.quantity;
        total += price;
        const el = document.createElement('div');
        el.className = 'cart-item';
        el.innerHTML = `
          <img src="${item.image}" class="cart-item-img" />
          <div class="cart-item-info">
            <div class="cart-item-title">${item.name}</div>
            <div class="cart-item-meta">Size: ${item.size || '—'} | Qty: ${item.quantity}</div>
          </div>
          <div>
            <div class="cart-item-price">$${price.toFixed(2)}</div>
            <div class="cart-item-remove" onclick="removeCartItem(${i})">&times;</div>
          </div>`;
        cartItemsList.appendChild(el);
      });
    }
    cartSubtotalEl.textContent = '$' + total.toFixed(2);
  }

  window.removeCartItem = function (i) {
    const cart = JSON.parse(localStorage.getItem('zyntrx_cart')) || [];
    cart.splice(i, 1);
    localStorage.setItem('zyntrx_cart', JSON.stringify(cart));
    renderCart();
  }

  if (cartBtn) {
    cartBtn.addEventListener('click', e => {
      e.preventDefault();
      toggleShopCart(true);
    });
  }

  if (document.getElementById('closeCart')) {
    document.getElementById('closeCart').addEventListener('click', () => toggleShopCart(false));
  }

  if (cartOverlay) {
    cartOverlay.addEventListener('click', () => {
      toggleLoginModal(false);
      toggleShopCart(false);
      const navLinksList = document.querySelector('.nav-links');
      if (navLinksList) navLinksList.classList.remove('active');
    });
  }

  // SIDE MENU LOGIC (Desktop & Mobile)
  const menuToggle = document.getElementById('menuToggle');
  const navLinksList = document.querySelector('.nav-links');

  if (menuToggle && navLinksList) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinksList.classList.toggle('active');
      if (cartOverlay) cartOverlay.classList.toggle('active', navLinksList.classList.contains('active'));
    });
  }

  renderCart();
});