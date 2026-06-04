// ============================================
// DANKANO MULTITRADE NIG LTD - Web App V2
// Enhanced with Loyalty, Reviews, Referral, Charts, Agent Performance
// ============================================

// ============================================
// STATE MANAGEMENT
// ============================================
const AppState = {
    currentUser: null,
    currentRole: null,
    orders: JSON.parse(localStorage.getItem('dankano_orders') || '[]'),
    customers: JSON.parse(localStorage.getItem('dankano_customers') || '[]'),
    reviews: JSON.parse(localStorage.getItem('dankano_reviews') || '[]'),
    referrals: JSON.parse(localStorage.getItem('dankano_referrals') || '[]'),
    inventory: {
        cylinders: [
            { id: 'DANKANO-001', size: '3kg', status: 'available', customer: null },
            { id: 'DANKANO-002', size: '3kg', status: 'available', customer: null },
            { id: 'DANKANO-003', size: '3kg', status: 'available', customer: null },
            { id: 'DANKANO-004', size: '6kg', status: 'available', customer: null },
            { id: 'DANKANO-005', size: '6kg', status: 'available', customer: null },
        ],
        gasStock: 50
    },
    agent: {
        id: 'AGENT001',
        name: 'Transport Agent',
        status: 'online',
        tasksCompleted: 0,
        tasksToday: 0,
        rating: 4.5,
        weeklyPerformance: [6, 8, 4, 9, 7, 5, 3]
    },
    currentRating: 0,
    selectedTags: []
};

// Seed demo data if empty
function seedDemoData() {
    if (AppState.orders.length === 0) {
        const demoOrders = [
            {
                id: 'ORD-001',
                type: 'gas',
                customerName: 'Amina Ibrahim',
                customerPhone: '08012345678',
                customerAddress: 'No. 15 Zaria Road, Kano',
                cylinderSize: '6kg',
                serviceType: 'exchange',
                price: 7500,
                deliveryFee: 500,
                total: 8000,
                status: 'completed',
                deliveryTime: 'morning',
                notes: '',
                createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
                updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
                assignedTo: 'AGENT001',
                rated: true
            },
            {
                id: 'ORD-002',
                type: 'errand',
                customerName: 'Musa Abdullahi',
                customerPhone: '08098765432',
                customerAddress: 'No. 22 Sabon Gari, Kano',
                errandType: 'market',
                errandDetails: '• 2kg tomatoes\n• 1kg onions\n• 5kg rice\n• 1L vegetable oil',
                budget: 15000,
                stops: '2',
                urgency: 'normal',
                serviceFee: 1500,
                total: 1500,
                status: 'in-progress',
                createdAt: new Date(Date.now() - 3600000).toISOString(),
                updatedAt: new Date(Date.now() - 1800000).toISOString(),
                assignedTo: 'AGENT001',
                rated: false
            },
            {
                id: 'ORD-003',
                type: 'gas',
                customerName: 'Fatima Yusuf',
                customerPhone: '08055551234',
                customerAddress: 'No. 8 Bompai Road, Kano',
                cylinderSize: '3kg',
                serviceType: 'refill',
                price: 4000,
                deliveryFee: 500,
                total: 4500,
                status: 'pending',
                deliveryTime: 'afternoon',
                notes: 'Call before arrival',
                createdAt: new Date(Date.now() - 1800000).toISOString(),
                updatedAt: new Date(Date.now() - 1800000).toISOString(),
                assignedTo: null,
                rated: false
            }
        ];
        AppState.orders = demoOrders;
        saveOrders();
    }

    if (AppState.customers.length === 0) {
        AppState.customers = [
            { name: 'Amina Ibrahim', phone: '08012345678', address: 'No. 15 Zaria Road, Kano', orders: 1, loyalty: 10, referralCode: 'DANKANO-REF-001', referrals: 0, referralEarned: 0 },
            { name: 'Musa Abdullahi', phone: '08098765432', address: 'No. 22 Sabon Gari, Kano', orders: 1, loyalty: 5, referralCode: 'DANKANO-REF-002', referrals: 0, referralEarned: 0 },
            { name: 'Fatima Yusuf', phone: '08055551234', address: 'No. 8 Bompai Road, Kano', orders: 1, loyalty: 0, referralCode: 'DANKANO-REF-003', referrals: 0, referralEarned: 0 }
        ];
        saveCustomers();
    }

    if (AppState.reviews.length === 0) {
        AppState.reviews = [
            { orderId: 'ORD-001', customerPhone: '08012345678', customerName: 'Amina Ibrahim', rating: 5, text: 'Excellent service! Very fast delivery.', tags: ['Fast Delivery', 'Friendly Agent'], date: new Date(Date.now() - 86400000 * 2).toISOString() }
        ];
        saveReviews();
    }
}

function saveOrders() { localStorage.setItem('dankano_orders', JSON.stringify(AppState.orders)); }
function saveCustomers() { localStorage.setItem('dankano_customers', JSON.stringify(AppState.customers)); }
function saveReviews() { localStorage.setItem('dankano_reviews', JSON.stringify(AppState.reviews)); }
function saveReferrals() { localStorage.setItem('dankano_referrals', JSON.stringify(AppState.referrals)); }

// ============================================
// SCREEN MANAGEMENT
// ============================================
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    window.scrollTo(0, 0);
}

// ============================================
// SPLASH & ROLE SELECTION
// ============================================
window.addEventListener('load', () => {
    seedDemoData();
    setTimeout(() => { showScreen('role-screen'); }, 2500);
});

function selectRole(role) {
    AppState.currentRole = role;
    if (role === 'customer') showScreen('customer-login');
    else if (role === 'agent') showScreen('agent-login');
    else if (role === 'owner') showScreen('owner-login');
}

function goToRole() {
    AppState.currentRole = null;
    AppState.currentUser = null;
    showScreen('role-screen');
}

// ============================================
// NOTIFICATIONS
// ============================================
function showNotification(message, type = 'success', icon = '✅') {
    const notif = document.getElementById('notification');
    document.getElementById('notification-text').textContent = message;
    document.getElementById('notification-icon').textContent = icon;
    notif.className = 'notification ' + type;
    notif.classList.add('show');
    setTimeout(() => { notif.classList.remove('show'); }, 3000);
}

// ============================================
// MODALS
// ============================================
function showModal(title, content) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-body').innerHTML = content;
    document.getElementById('modal-overlay').classList.add('show');
    document.getElementById('modal').classList.add('show');
}

function closeModal() {
    document.getElementById('modal-overlay').classList.remove('show');
    document.getElementById('modal').classList.remove('show');
}

// ============================================
// CUSTOMER FUNCTIONS
// ============================================
function customerLogin() {
    const phone = document.getElementById('cust-phone').value.trim();
    const name = document.getElementById('cust-name').value.trim();
    const address = document.getElementById('cust-address').value.trim();

    if (!phone || phone.length < 10) { showNotification('Please enter a valid phone number', 'error', '⚠️'); return; }
    if (!name) { showNotification('Please enter your name', 'error', '⚠️'); return; }
    if (!address) { showNotification('Please enter your address', 'error', '⚠️'); return; }

    let customer = AppState.customers.find(c => c.phone === phone);
    if (!customer) {
        const referralCode = 'DANKANO-REF-' + (AppState.customers.length + 1).toString().padStart(3, '0');
        customer = { name, phone, address, orders: 0, loyalty: 0, referralCode, referrals: 0, referralEarned: 0 };
        AppState.customers.push(customer);
        saveCustomers();
        showNotification('Welcome! You have been registered.', 'success', '🎉');
    } else {
        customer.name = name;
        customer.address = address;
        saveCustomers();
    }

    AppState.currentUser = customer;
    document.getElementById('cust-display-name').textContent = customer.name;
    document.getElementById('cust-display-phone').textContent = customer.phone;
    document.getElementById('gas-address').value = customer.address;
    document.getElementById('errand-address').value = customer.address;

    updateLoyaltyBanner(customer);
    updateQuickReorder(customer);

    showScreen('customer-dashboard');
}

function updateLoyaltyBanner(customer) {
    const points = customer.loyalty || 0;
    const progress = (points % 100) / 100 * 100;
    document.querySelector('.loyalty-points').textContent = points + ' points';
    document.getElementById('loyalty-progress-bar').style.width = progress + '%';
}

function updateQuickReorder(customer) {
    const myOrders = AppState.orders.filter(o => o.customerPhone === customer.phone && o.status === 'completed');
    const container = document.getElementById('quick-order-list');

    if (myOrders.length === 0) {
        document.getElementById('quick-order-section').style.display = 'none';
    } else {
        document.getElementById('quick-order-section').style.display = 'block';
        const recentOrders = myOrders.slice(0, 2);
        container.innerHTML = recentOrders.map(order => `
            <div class="quick-order-card" onclick="quickReorder('${order.id}')">
                <div class="quick-order-info">
                    <h4>${order.type === 'gas' ? '🔥 Gas ' + order.cylinderSize : '🛒 ' + order.errandType}</h4>
                    <p>₦${order.total.toLocaleString()} • ${formatDate(order.createdAt)}</p>
                </div>
                <button class="quick-order-btn">Reorder</button>
            </div>
        `).join('');
    }
}

function quickReorder(orderId) {
    const order = AppState.orders.find(o => o.id === orderId);
    if (!order) return;

    if (order.type === 'gas') {
        selectedCylinder = { size: order.cylinderSize, price: order.price };
        selectedServiceType = order.serviceType;
        document.getElementById('gas-address').value = order.customerAddress;
        document.getElementById('gas-notes').value = 'Reorder: ' + order.id;
        showScreen('gas-order');
    } else {
        selectedErrandType = order.errandType;
        document.getElementById('errand-details').value = order.errandDetails;
        document.getElementById('errand-budget').value = order.budget;
        document.getElementById('errand-address').value = order.customerAddress;
        showScreen('errand-order');
    }
    showNotification('Quick reorder loaded! Review and confirm.', 'success', '🔄');
}

function showGasOrder() {
    document.querySelectorAll('.cylinder-option').forEach(o => o.classList.remove('selected'));
    document.querySelectorAll('.type-option').forEach((o, i) => o.classList.toggle('active', i === 0));
    document.getElementById('gas-notes').value = '';
    document.getElementById('summary-gas-price').textContent = '₦0';
    document.getElementById('summary-total').textContent = '₦500';
    showScreen('gas-order');
}

let selectedCylinder = { size: null, price: 0 };
let selectedServiceType = 'exchange';

function selectCylinder(size, price) {
    selectedCylinder = { size, price };
    document.querySelectorAll('.cylinder-option').forEach(o => o.classList.remove('selected'));
    document.querySelector(`[data-size="${size}"]`).classList.add('selected');
    document.getElementById('summary-gas-price').textContent = '₦' + price.toLocaleString();
    document.getElementById('summary-total').textContent = '₦' + (price + 500).toLocaleString();
}

function selectServiceType(type) {
    selectedServiceType = type;
    document.querySelectorAll('.type-option').forEach(o => o.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

function submitGasOrder() {
    if (!selectedCylinder.size) { showNotification('Please select a cylinder size', 'error', '⚠️'); return; }
    const address = document.getElementById('gas-address').value.trim();
    if (!address) { showNotification('Please enter delivery address', 'error', '⚠️'); return; }

    const order = {
        id: 'ORD-' + Date.now().toString().slice(-6),
        type: 'gas',
        customerName: AppState.currentUser.name,
        customerPhone: AppState.currentUser.phone,
        customerAddress: address,
        cylinderSize: selectedCylinder.size,
        serviceType: selectedServiceType,
        price: selectedCylinder.price,
        deliveryFee: 500,
        total: selectedCylinder.price + 500,
        status: 'pending',
        deliveryTime: document.getElementById('gas-time').value,
        notes: document.getElementById('gas-notes').value,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        assignedTo: null,
        rated: false
    };

    AppState.orders.unshift(order);
    saveOrders();

    const customer = AppState.customers.find(c => c.phone === AppState.currentUser.phone);
    if (customer) {
        customer.orders++;
        customer.loyalty += 10;
        saveCustomers();
        updateLoyaltyBanner(customer);
    }

    showNotification('Gas order placed! Order ID: ' + order.id, 'success', '🔥');
    showScreen('customer-dashboard');
}

function showErrandOrder() {
    document.querySelectorAll('.errand-type').forEach(o => o.classList.remove('selected'));
    document.querySelectorAll('.urgency-option').forEach((o, i) => o.classList.toggle('selected', i === 0));
    document.getElementById('errand-details').value = '';
    document.getElementById('errand-budget').value = '';
    showScreen('errand-order');
}

let selectedErrandType = 'market';
let selectedUrgency = 'normal';

function selectErrandType(type) {
    selectedErrandType = type;
    document.querySelectorAll('.errand-type').forEach(o => o.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
}

function selectUrgency(urgency) {
    selectedUrgency = urgency;
    document.querySelectorAll('.urgency-option').forEach(o => o.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    const fee = urgency === 'urgent' ? 1500 : 1000;
    document.getElementById('errand-fee').textContent = '₦' + fee.toLocaleString();
    document.getElementById('errand-total').textContent = '₦' + fee.toLocaleString() + ' + items';
}

function submitErrandOrder() {
    const details = document.getElementById('errand-details').value.trim();
    if (!details) { showNotification('Please describe what you need', 'error', '⚠️'); return; }
    const address = document.getElementById('errand-address').value.trim();
    if (!address) { showNotification('Please enter delivery address', 'error', '⚠️'); return; }

    const budget = parseInt(document.getElementById('errand-budget').value) || 0;
    const fee = selectedUrgency === 'urgent' ? 1500 : 1000;

    const order = {
        id: 'ORD-' + Date.now().toString().slice(-6),
        type: 'errand',
        customerName: AppState.currentUser.name,
        customerPhone: AppState.currentUser.phone,
        customerAddress: address,
        errandType: selectedErrandType,
        errandDetails: details,
        budget: budget,
        stops: document.getElementById('errand-stops').value,
        urgency: selectedUrgency,
        serviceFee: fee,
        total: fee,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        assignedTo: null,
        rated: false
    };

    AppState.orders.unshift(order);
    saveOrders();

    const customer = AppState.customers.find(c => c.phone === AppState.currentUser.phone);
    if (customer) {
        customer.orders++;
        customer.loyalty += 5;
        saveCustomers();
        updateLoyaltyBanner(customer);
    }

    showNotification('Errand request sent! We will confirm shortly.', 'success', '🛒');
    showScreen('customer-dashboard');
}

function showCustomerOrders() {
    const list = document.getElementById('customer-orders-list');
    const myOrders = AppState.orders.filter(o => o.customerPhone === AppState.currentUser.phone);

    if (myOrders.length === 0) {
        list.innerHTML = `<div class="empty-state"><span>📋</span><h3>No orders yet</h3><p>Place your first order to see it here</p></div>`;
    } else {
        list.innerHTML = myOrders.map(order => renderOrderCard(order)).join('');
    }
    showScreen('customer-orders');
}

function renderOrderCard(order) {
    const statusClass = order.status;
    const typeClass = order.type + '-order';
    const typeLabel = order.type === 'gas' ? '🔥 Gas Delivery' : '🛒 Dan Aike';
    const detailText = order.type === 'gas'
        ? `${order.cylinderSize} cylinder • ${order.serviceType === 'exchange' ? 'Exchange' : 'Refill'}`
        : `${order.errandType.charAt(0).toUpperCase() + order.errandType.slice(1)} run • ${order.stops} stop${order.stops !== '1' ? 's' : ''}`;

    const rateButton = (order.status === 'completed' && !order.rated) 
        ? `<button class="btn-primary" style="margin-top:10px; font-size:12px; padding:8px;" onclick="event.stopPropagation(); showRateScreen('${order.id}')">⭐ Rate Experience</button>` 
        : '';

    return `
        <div class="order-card ${typeClass} ${statusClass}" onclick="showOrderDetail('${order.id}')">
            <div class="order-header">
                <h4>${typeLabel}</h4>
                <span class="order-status ${statusClass}">${order.status.replace('-', ' ')}</span>
            </div>
            <div class="order-details">
                <p><strong>${detailText}</strong></p>
                <p>📍 ${order.customerAddress.substring(0, 40)}${order.customerAddress.length > 40 ? '...' : ''}</p>
            </div>
            <div class="order-footer">
                <span class="order-total">₦${order.total.toLocaleString()}</span>
                <span class="order-date">${formatDate(order.createdAt)}</span>
            </div>
            ${rateButton}
        </div>
    `;
}

function showOrderDetail(orderId) {
    const order = AppState.orders.find(o => o.id === orderId);
    if (!order) return;

    const isGas = order.type === 'gas';
    const content = document.getElementById('order-detail-content');

    let detailsHTML = `
        <div class="detail-section">
            <h3>Order Information</h3>
            <div class="detail-row"><span>Order ID</span><span>${order.id}</span></div>
            <div class="detail-row"><span>Type</span><span>${isGas ? '🔥 Gas Delivery' : '🛒 Dan Aike'}</span></div>
            <div class="detail-row"><span>Status</span><span style="text-transform: capitalize; color: ${getStatusColor(order.status)}">${order.status.replace('-', ' ')}</span></div>
            <div class="detail-row"><span>Date</span><span>${formatDateTime(order.createdAt)}</span></div>
        </div>
    `;

    if (isGas) {
        detailsHTML += `
            <div class="detail-section">
                <h3>Gas Details</h3>
                <div class="detail-row"><span>Cylinder Size</span><span>${order.cylinderSize}</span></div>
                <div class="detail-row"><span>Service Type</span><span>${order.serviceType === 'exchange' ? 'Exchange' : 'Refill'}</span></div>
                <div class="detail-row"><span>Delivery Time</span><span>${order.deliveryTime}</span></div>
                ${order.notes ? `<div class="detail-row"><span>Notes</span><span>${order.notes}</span></div>` : ''}
            </div>
            <div class="detail-section">
                <h3>Pricing</h3>
                <div class="detail-row"><span>Gas Price</span><span>₦${order.price.toLocaleString()}</span></div>
                <div class="detail-row"><span>Delivery Fee</span><span>₦${order.deliveryFee.toLocaleString()}</span></div>
                <div class="detail-row"><span><strong>Total</strong></span><span><strong>₦${order.total.toLocaleString()}</strong></span></div>
            </div>
        `;
    } else {
        detailsHTML += `
            <div class="detail-section">
                <h3>Errand Details</h3>
                <div class="detail-row"><span>Type</span><span>${order.errandType}</span></div>
                <div class="detail-row"><span>Stops</span><span>${order.stops}</span></div>
                <div class="detail-row"><span>Urgency</span><span>${order.urgency}</span></div>
                <div class="detail-row"><span>Budget</span><span>₦${order.budget.toLocaleString()}</span></div>
            </div>
            <div class="detail-section">
                <h3>What You Need</h3>
                <p style="white-space: pre-line; line-height: 1.8; color: var(--dark);">${order.errandDetails}</p>
            </div>
            <div class="detail-section">
                <h3>Pricing</h3>
                <div class="detail-row"><span>Service Fee</span><span>₦${order.serviceFee.toLocaleString()}</span></div>
                <div class="detail-row"><span><strong>Total</strong></span><span><strong>₦${order.total.toLocaleString()} + items</strong></span></div>
            </div>
        `;
    }

    detailsHTML += `
        <div class="detail-section">
            <h3>Delivery Information</h3>
            <div class="detail-row"><span>Name</span><span>${order.customerName}</span></div>
            <div class="detail-row"><span>Phone</span><span>${order.customerPhone}</span></div>
            <div class="detail-row"><span>Address</span><span>${order.customerAddress}</span></div>
        </div>
    `;

    if (order.status === 'pending') {
        detailsHTML += `<div class="detail-actions"><button class="btn-danger" onclick="cancelOrder('${order.id}')">Cancel Order</button></div>`;
    }

    if (order.status === 'completed' && !order.rated) {
        detailsHTML += `<div class="detail-actions"><button class="btn-success" onclick="showRateScreen('${order.id}')">⭐ Rate This Order</button></div>`;
    }

    content.innerHTML = detailsHTML;
    showScreen('order-detail');
}

function cancelOrder(orderId) {
    const order = AppState.orders.find(o => o.id === orderId);
    if (order) {
        order.status = 'cancelled';
        order.updatedAt = new Date().toISOString();
        saveOrders();
        showNotification('Order cancelled successfully', 'warning', '⚠️');
        showCustomerOrders();
    }
}

// ============================================
// RATING & REVIEWS
// ============================================
let currentRatingOrderId = null;

function showRateScreen(orderId) {
    currentRatingOrderId = orderId;
    AppState.currentRating = 0;
    AppState.selectedTags = [];

    document.querySelectorAll('#rating-stars span').forEach(s => {
        s.classList.remove('active');
        s.style.filter = 'grayscale(100%)';
        s.style.opacity = '0.5';
    });
    document.getElementById('rating-label').textContent = 'Tap a star to rate';
    document.getElementById('review-text').value = '';
    document.querySelectorAll('.review-tag').forEach(t => t.classList.remove('selected'));

    showScreen('rate-order');
}

function setRating(stars) {
    AppState.currentRating = stars;
    const starElements = document.querySelectorAll('#rating-stars span');
    const labels = ['Terrible', 'Poor', 'Average', 'Good', 'Excellent!'];

    starElements.forEach((el, i) => {
        if (i < stars) {
            el.classList.add('active');
            el.style.filter = 'grayscale(0%)';
            el.style.opacity = '1';
        } else {
            el.classList.remove('active');
            el.style.filter = 'grayscale(100%)';
            el.style.opacity = '0.5';
        }
    });

    document.getElementById('rating-label').textContent = labels[stars - 1];
}

function toggleTag(element) {
    const tag = element.textContent;
    if (element.classList.contains('selected')) {
        element.classList.remove('selected');
        AppState.selectedTags = AppState.selectedTags.filter(t => t !== tag);
    } else {
        element.classList.add('selected');
        AppState.selectedTags.push(tag);
    }
}

function submitReview() {
    if (AppState.currentRating === 0) {
        showNotification('Please select a star rating', 'error', '⚠️');
        return;
    }

    const review = {
        orderId: currentRatingOrderId,
        customerPhone: AppState.currentUser.phone,
        customerName: AppState.currentUser.name,
        rating: AppState.currentRating,
        text: document.getElementById('review-text').value.trim(),
        tags: AppState.selectedTags,
        date: new Date().toISOString()
    };

    AppState.reviews.push(review);
    saveReviews();

    const order = AppState.orders.find(o => o.id === currentRatingOrderId);
    if (order) {
        order.rated = true;
        saveOrders();
    }

    const customer = AppState.customers.find(c => c.phone === AppState.currentUser.phone);
    if (customer) {
        customer.loyalty += 5;
        saveCustomers();
        updateLoyaltyBanner(customer);
    }

    showNotification('Thank you! You earned 5 bonus points.', 'success', '⭐');
    showScreen('customer-orders');
}

function showCustomerReviews() {
    const list = document.getElementById('customer-reviews-list');
    const myReviews = AppState.reviews.filter(r => r.customerPhone === AppState.currentUser.phone);

    if (myReviews.length === 0) {
        list.innerHTML = `<div class="empty-state"><span>⭐</span><h3>No reviews yet</h3><p>Complete an order and rate your experience</p></div>`;
    } else {
        list.innerHTML = myReviews.map(review => `
            <div class="detail-section" style="margin: 15px 20px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <span style="font-size:24px;">${'⭐'.repeat(review.rating)}</span>
                    <span style="font-size:12px; color:var(--gray);">${formatDate(review.date)}</span>
                </div>
                <p style="color:var(--dark); margin-bottom:10px;">${review.text || 'No written review'}</p>
                <div style="display:flex; gap:5px; flex-wrap:wrap;">
                    ${review.tags.map(tag => `<span style="background:var(--gray-light); padding:4px 10px; border-radius:15px; font-size:12px; color:var(--gray);">${tag}</span>`).join('')}
                </div>
            </div>
        `).join('');
    }
    showScreen('reviews-screen');
}

// ============================================
// REFERRAL SYSTEM
// ============================================
function showReferral() {
    const customer = AppState.customers.find(c => c.phone === AppState.currentUser.phone);
    if (customer) {
        document.getElementById('referral-code-display').textContent = customer.referralCode;
        document.getElementById('referral-count').textContent = customer.referrals || 0;
        document.getElementById('referral-earned').textContent = '₦' + (customer.referralEarned || 0).toLocaleString();
    }
    showScreen('referral-screen');
}

function copyReferralCode() {
    const code = document.getElementById('referral-code-display').textContent;
    navigator.clipboard.writeText(code).then(() => {
        showNotification('Referral code copied!', 'success', '📋');
    }).catch(() => {
        showNotification('Code: ' + code, 'success', '📋');
    });
}

function shareReferral() {
    const customer = AppState.customers.find(c => c.phone === AppState.currentUser.phone);
    const code = customer ? customer.referralCode : 'DANKANO-REF-001';
    const text = `Order gas and errands with DANKANO! Use my referral code ${code} and we both get ₦500 off. Download the app: https://umaramahmud123.github.io/Dankano-deliveryapp/`;

    if (navigator.share) {
        navigator.share({ title: 'DANKANO Referral', text: text });
    } else {
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
    }
}

// ============================================
// PROFILE
// ============================================
function showCustomerProfile() {
    const customer = AppState.customers.find(c => c.phone === AppState.currentUser.phone);
    if (customer) {
        document.getElementById('profile-name').textContent = customer.name;
        document.getElementById('profile-phone').textContent = customer.phone;
        document.getElementById('profile-address').textContent = customer.address;
        document.getElementById('profile-orders').textContent = customer.orders;
        document.getElementById('profile-loyalty').textContent = customer.loyalty;
        document.getElementById('profile-reviews').textContent = AppState.reviews.filter(r => r.customerPhone === customer.phone).length;
        document.getElementById('profile-referral').textContent = customer.referralCode;
        document.getElementById('profile-since').textContent = 'June 2026';
    }
    showScreen('customer-profile');
}

function editProfile() {
    showNotification('Profile editing coming soon!', 'warning', '⚠️');
}

// ============================================
// AGENT FUNCTIONS
// ============================================
function agentLogin() {
    const id = document.getElementById('agent-id').value.trim();
    const password = document.getElementById('agent-password').value;

    if (id !== 'AGENT001' || password !== 'dankano123') {
        showNotification('Invalid credentials. Demo: ID=AGENT001, Pass=dankano123', 'error', '⚠️');
        return;
    }

    showScreen('agent-dashboard');
    updateAgentDashboard();
}

function updateAgentDashboard() {
    const pending = AppState.orders.filter(o => o.status === 'pending' && !o.assignedTo).length;
    const today = AppState.orders.filter(o => {
        const d = new Date(o.createdAt);
        const now = new Date();
        return d.toDateString() === now.toDateString();
    }).length;
    const completed = AppState.orders.filter(o => o.status === 'completed' && o.assignedTo === 'AGENT001').length;

    document.getElementById('agent-pending').textContent = pending;
    document.getElementById('agent-today').textContent = today;
    document.getElementById('agent-completed').textContent = completed;
    document.getElementById('agent-rating').textContent = AppState.agent.rating.toFixed(1);

    const taskList = document.getElementById('agent-task-list');
    const myTasks = AppState.orders.filter(o =>
        (o.status === 'pending' && !o.assignedTo) ||
        (o.assignedTo === 'AGENT001' && o.status !== 'completed' && o.status !== 'cancelled')
    );

    if (myTasks.length === 0) {
        taskList.innerHTML = `<div class="empty-state"><span>🛵</span><h3>No active tasks</h3><p>Check back for new orders</p></div>`;
    } else {
        taskList.innerHTML = myTasks.map(task => renderTaskCard(task)).join('');
    }
}

function renderTaskCard(task) {
    const isAssigned = task.assignedTo === 'AGENT001';
    const typeLabel = task.type === 'gas' ? '🔥 Gas' : '🛒 Errand';
    const detail = task.type === 'gas'
        ? `${task.cylinderSize} • ${task.serviceType}`
        : `${task.errandType} • ${task.stops} stops`;

    return `
        <div class="task-card ${isAssigned ? 'assigned' : ''}" onclick="showTaskDetail('${task.id}')">
            <div class="task-header">
                <h4>${typeLabel} — ${task.id}</h4>
                <span class="task-type ${task.type}">${task.type}</span>
            </div>
            <div class="task-info">
                <p><strong>${detail}</strong></p>
                <p>📍 ${task.customerAddress.substring(0, 35)}...</p>
                <p>👤 ${task.customerName} • ${task.customerPhone}</p>
            </div>
            <div class="task-actions">
                ${!isAssigned
                    ? `<button class="btn-primary" onclick="event.stopPropagation(); acceptTask('${task.id}')">Accept Task</button>`
                    : `<button class="btn-success" onclick="event.stopPropagation(); completeTask('${task.id}')">Complete</button>
                       <button class="btn-secondary" onclick="event.stopPropagation(); showTaskDetail('${task.id}')">Details</button>`
                }
            </div>
        </div>
    `;
}

function showTaskDetail(taskId) {
    const task = AppState.orders.find(o => o.id === taskId);
    if (!task) return;

    const isAssigned = task.assignedTo === 'AGENT001';
    let content = `
        <div class="detail-section">
            <h3>Task Information</h3>
            <div class="detail-row"><span>Order ID</span><span>${task.id}</span></div>
            <div class="detail-row"><span>Type</span><span>${task.type === 'gas' ? '🔥 Gas Delivery' : '🛒 Dan Aike'}</span></div>
            <div class="detail-row"><span>Status</span><span>${task.status}</span></div>
        </div>
        <div class="detail-section">
            <h3>Customer</h3>
            <div class="detail-row"><span>Name</span><span>${task.customerName}</span></div>
            <div class="detail-row"><span>Phone</span><span><a href="tel:${task.customerPhone}">${task.customerPhone}</a></span></div>
            <div class="detail-row"><span>Address</span><span>${task.customerAddress}</span></div>
        </div>
    `;

    if (task.type === 'gas') {
        content += `
            <div class="detail-section">
                <h3>Gas Details</h3>
                <div class="detail-row"><span>Size</span><span>${task.cylinderSize}</span></div>
                <div class="detail-row"><span>Service</span><span>${task.serviceType}</span></div>
                <div class="detail-row"><span>Time</span><span>${task.deliveryTime}</span></div>
            </div>
        `;
    } else {
        content += `
            <div class="detail-section">
                <h3>Errand Details</h3>
                <div class="detail-row"><span>Type</span><span>${task.errandType}</span></div>
                <div class="detail-row"><span>Budget</span><span>₦${task.budget.toLocaleString()}</span></div>
                <div class="detail-row"><span>Stops</span><span>${task.stops}</span></div>
            </div>
            <div class="detail-section">
                <h3>Instructions</h3>
                <p style="white-space: pre-line;">${task.errandDetails}</p>
            </div>
        `;
    }

    content += `
        <div class="detail-actions">
            ${!isAssigned
                ? `<button class="btn-primary" onclick="acceptTask('${task.id}'); showScreen('agent-dashboard');">Accept Task</button>`
                : `<button class="btn-success" onclick="completeTask('${task.id}'); showScreen('agent-dashboard');">Mark Complete</button>`
            }
            <button class="btn-secondary" onclick="showScreen('agent-dashboard')">Back</button>
        </div>
    `;

    document.getElementById('agent-task-content').innerHTML = content;
    showScreen('agent-task-detail');
}

function acceptTask(taskId) {
    const task = AppState.orders.find(o => o.id === taskId);
    if (task) {
        task.assignedTo = 'AGENT001';
        task.status = 'in-progress';
        task.updatedAt = new Date().toISOString();
        saveOrders();
        showNotification('Task accepted! Head to customer location.', 'success', '🛵');
        updateAgentDashboard();
    }
}

function completeTask(taskId) {
    const task = AppState.orders.find(o => o.id === taskId);
    if (task) {
        task.status = 'completed';
        task.updatedAt = new Date().toISOString();
        saveOrders();
        AppState.agent.tasksCompleted++;
        AppState.agent.tasksToday++;
        showNotification('Task completed! Great job.', 'success', '✅');
        updateAgentDashboard();
    }
}

function toggleAgentStatus() {
    AppState.agent.status = AppState.agent.status === 'online' ? 'offline' : 'online';
    const statusEl = document.getElementById('agent-status');
    statusEl.textContent = AppState.agent.status === 'online' ? '● Online' : '● Offline';
    statusEl.className = AppState.agent.status === 'online' ? 'status-online' : 'status-offline';
    showNotification('Status updated to ' + AppState.agent.status, 'success', '🔄');
}

// ============================================
// OWNER FUNCTIONS
// ============================================
function ownerLogin() {
    const password = document.getElementById('owner-password').value;
    if (password !== 'dankano2026') {
        showNotification('Invalid password. Demo: dankano2026', 'error', '⚠️');
        return;
    }
    showScreen('owner-dashboard');
    updateOwnerDashboard();
}

function updateOwnerDashboard() {
    const today = new Date().toDateString();
    const todayOrders = AppState.orders.filter(o => new Date(o.createdAt).toDateString() === today);
    const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
    const pending = AppState.orders.filter(o => o.status === 'pending').length;

    document.getElementById('owner-today-revenue').textContent = '₦' + todayRevenue.toLocaleString();
    document.getElementById('owner-today-orders').textContent = todayOrders.length;
    document.getElementById('owner-pending').textContent = pending;
    document.getElementById('owner-customers').textContent = AppState.customers.length;

    renderRevenueChart();
    showOwnerTab('orders');
}

function renderRevenueChart() {
    const chart = document.getElementById('revenue-chart');
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const revenues = [45000, 62000, 38000, 75000, 58000, 42000, 28000];
    const maxRevenue = Math.max(...revenues);

    chart.innerHTML = days.map((day, i) => {
        const height = (revenues[i] / maxRevenue) * 100;
        return `
            <div class="revenue-bar" style="height: ${height}%">
                <span class="bar-value">₦${(revenues[i]/1000).toFixed(0)}k</span>
                <span class="bar-label">${day}</span>
            </div>
        `;
    }).join('');
}

function showOwnerTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');

    const content = document.getElementById('owner-tab-content');

    if (tab === 'orders') {
        const allOrders = AppState.orders;
        if (allOrders.length === 0) {
            content.innerHTML = '<div class="empty-state"><span>📋</span><h3>No orders</h3></div>';
        } else {
            content.innerHTML = allOrders.map(o => renderOrderCard(o)).join('');
        }
    } else if (tab === 'customers') {
        if (AppState.customers.length === 0) {
            content.innerHTML = '<div class="empty-state"><span>👥</span><h3>No customers</h3></div>';
        } else {
            content.innerHTML = AppState.customers.map(c => `
                <div class="order-card" style="border-left-color: var(--primary);">
                    <div class="order-header">
                        <h4>👤 ${c.name}</h4>
                        <span class="order-status" style="background: #e3f2fd; color: #1565c0;">${c.orders} orders</span>
                    </div>
                    <div class="order-details">
                        <p>📞 ${c.phone}</p>
                        <p>📍 ${c.address}</p>
                        <p>⭐ Loyalty: ${c.loyalty} points</p>
                        <p>🎁 Referrals: ${c.referrals || 0}</p>
                    </div>
                </div>
            `).join('');
        }
    } else if (tab === 'agents') {
        content.innerHTML = `
            <div class="detail-section" style="margin: 15px 20px;">
                <h3>Agent Performance</h3>
                <div class="detail-row"><span>Agent ID</span><span>AGENT001</span></div>
                <div class="detail-row"><span>Status</span><span style="color: var(--success);">Online</span></div>
                <div class="detail-row"><span>Tasks Completed</span><span>${AppState.agent.tasksCompleted}</span></div>
                <div class="detail-row"><span>Today's Tasks</span><span>${AppState.agent.tasksToday}</span></div>
                <div class="detail-row"><span>Rating</span><span>⭐ ${AppState.agent.rating}</span></div>
            </div>
            <div class="detail-section" style="margin: 15px 20px;">
                <h3>Weekly Performance</h3>
                <div class="performance-chart" style="height: 120px;">
                    ${AppState.agent.weeklyPerformance.map((p, i) => `
                        <div class="chart-bar" style="height: ${(p/10)*100}%"><span>${['M','T','W','T','F','S','S'][i]}</span></div>
                    `).join('')}
                </div>
            </div>
        `;
    } else if (tab === 'inventory') {
        content.innerHTML = `
            <div class="detail-section" style="margin: 15px 20px;">
                <h3>Gas Cylinders</h3>
                ${AppState.inventory.cylinders.map(c => `
                    <div class="detail-row">
                        <span>${c.id} (${c.size})</span>
                        <span style="color: ${c.status === 'available' ? 'var(--success)' : 'var(--warning)'}">${c.status}</span>
                    </div>
                `).join('')}
            </div>
            <div class="detail-section" style="margin: 15px 20px;">
                <h3>Gas Stock</h3>
                <div class="detail-row"><span>Remaining Stock</span><span>${AppState.inventory.gasStock} kg</span></div>
                <div style="margin-top: 15px; background: var(--gray-light); border-radius: 10px; height: 20px; overflow: hidden;">
                    <div style="width: ${Math.min(AppState.inventory.gasStock, 100)}%; height: 100%; background: ${AppState.inventory.gasStock > 20 ? 'var(--success)' : 'var(--danger)'}; transition: width 0.5s;"></div>
                </div>
                <p style="font-size: 12px; color: var(--gray); margin-top: 5px;">${AppState.inventory.gasStock > 20 ? 'Stock level healthy' : '⚠️ Low stock - reorder needed'}</p>
            </div>
        `;
    } else if (tab === 'reviews') {
        if (AppState.reviews.length === 0) {
            content.innerHTML = '<div class="empty-state"><span>⭐</span><h3>No reviews yet</h3></div>';
        } else {
            const avgRating = (AppState.reviews.reduce((sum, r) => sum + r.rating, 0) / AppState.reviews.length).toFixed(1);
            content.innerHTML = `
                <div class="detail-section" style="margin: 15px 20px;">
                    <h3>Review Summary</h3>
                    <div class="detail-row"><span>Total Reviews</span><span>${AppState.reviews.length}</span></div>
                    <div class="detail-row"><span>Average Rating</span><span>⭐ ${avgRating}</span></div>
                </div>
                ${AppState.reviews.map(r => `
                    <div class="detail-section" style="margin: 15px 20px;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                            <span style="font-weight:600;">${r.customerName}</span>
                            <span>${'⭐'.repeat(r.rating)}</span>
                        </div>
                        <p style="font-size:13px; color:var(--gray); margin-bottom:8px;">${r.text || 'No comment'}</p>
                        <div style="display:flex; gap:5px; flex-wrap:wrap;">
                            ${r.tags.map(t => `<span style="background:var(--gray-light); padding:3px 8px; border-radius:10px; font-size:11px;">${t}</span>`).join('')}
                        </div>
                    </div>
                `).join('')}
            `;
        }
    } else if (tab === 'reports') {
        const totalRevenue = AppState.orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.total, 0);
        const totalOrders = AppState.orders.length;
        const gasOrders = AppState.orders.filter(o => o.type === 'gas').length;
        const errandOrders = AppState.orders.filter(o => o.type === 'errand').length;

        content.innerHTML = `
            <div class="detail-section" style="margin: 15px 20px;">
                <h3>Business Summary</h3>
                <div class="detail-row"><span>Total Revenue</span><span>₦${totalRevenue.toLocaleString()}</span></div>
                <div class="detail-row"><span>Total Orders</span><span>${totalOrders}</span></div>
                <div class="detail-row"><span>Gas Orders</span><span>${gasOrders}</span></div>
                <div class="detail-row"><span>Errand Orders</span><span>${errandOrders}</span></div>
                <div class="detail-row"><span>Total Customers</span><span>${AppState.customers.length}</span></div>
                <div class="detail-row"><span>Total Reviews</span><span>${AppState.reviews.length}</span></div>
            </div>
            <div class="detail-section" style="margin: 15px 20px;">
                <h3>Order Status Breakdown</h3>
                <div class="detail-row"><span>Pending</span><span>${AppState.orders.filter(o => o.status === 'pending').length}</span></div>
                <div class="detail-row"><span>In Progress</span><span>${AppState.orders.filter(o => o.status === 'in-progress').length}</span></div>
                <div class="detail-row"><span>Completed</span><span>${AppState.orders.filter(o => o.status === 'completed').length}</span></div>
                <div class="detail-row"><span>Cancelled</span><span>${AppState.orders.filter(o => o.status === 'cancelled').length}</span></div>
            </div>
        `;
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function formatDate(isoString) {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatDateTime(isoString) {
    const d = new Date(isoString);
    return d.toLocaleString('en-NG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function getStatusColor(status) {
    const colors = { 'pending': '#ffc107', 'in-progress': '#004085', 'completed': '#28a745', 'cancelled': '#dc3545' };
    return colors[status] || '#6c757d';
}

// ============================================
// INITIALIZATION
// ============================================
console.log('🚀 DANKANO MULTITRADE NIG LTD App V2 Loaded');
console.log('📱 New features: Loyalty, Reviews, Referral, Charts, Agent Performance');
