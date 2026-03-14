// CoreInventory JS Application
// Handing UI Interactions, Views, and simple dummy data for Hackathon Demo

document.addEventListener('DOMContentLoaded', () => {

    // --- State ---
    const state = {
        currentView: 'dashboard'
    };

    // --- DOM Elements ---
    const sidebar = document.getElementById('sidebar');
    const toggleSidebarBtn = document.getElementById('toggleSidebarBtn');
    if (!toggleSidebarBtn) {
        document.getElementById('toggle-sidebar').addEventListener('click', toggleSidebar);
    }
    const navButtons = document.querySelectorAll('.nav-btn');
    const viewSections = document.querySelectorAll('.view-section');
    const currentTimeEl = document.getElementById('current-time');

    // --- Initialization ---
    initApp();

    function initApp() {
        // Update Time
        setInterval(() => {
            const now = new Date();
            currentTimeEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }, 1000);

        // Sidebar interactions
        navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const view = btn.getAttribute('data-view');
                if (view) switchView(view);
            });
        });

        // Load Dashboard Data
        populateDashboard();
        initChart();
    }

    // --- Navigation ---
    function toggleSidebar() {
        sidebar.classList.toggle('sidebar-closed');
        sidebar.classList.toggle('w-64');
    }

    function switchView(viewName) {
        // Update Active Nav Button
        navButtons.forEach(btn => {
            if (btn.getAttribute('data-view') === viewName) {
                btn.classList.add('active', 'bg-erp-sidebarhover', 'text-white');
                btn.classList.remove('text-gray-300');
            } else {
                btn.classList.remove('active', 'bg-erp-sidebarhover', 'text-white');
                btn.classList.add('text-gray-300');
            }
        });

        // Hide all views, show selected
        viewSections.forEach(section => {
            if (section.id === `view-${viewName}`) {
                section.classList.add('active');
                section.classList.remove('hidden');
            } else {
                section.classList.remove('active');
                section.classList.add('hidden');
            }
        });

        state.currentView = viewName;

        // Optionally, load data when switching views
        if (viewName === 'dashboard') populateDashboard();
        else if (viewName === 'products') renderProductsPage();
        else if (viewName === 'receipts') renderReceiptsPage();
        else if (viewName === 'deliveries') renderDeliveriesPage();
        else if (viewName === 'transfers') renderTransfersPage();
        else if (viewName === 'adjustments') renderAdjustmentsPage();
        else if (viewName === 'history') renderHistoryPage();
        else if (viewName === 'warehouses') renderWarehousesPage();
    }

    // --- Dashboard Functions ---
    async function populateDashboard() {
        try {
            const response = await fetch('api/dashboard.php');
            const data = await response.json();

            // KPIs
            document.getElementById('kpi-products').textContent = data.kpis.products.toLocaleString();
            document.getElementById('kpi-low-stock').textContent = data.kpis.lowStock;
            document.getElementById('kpi-receipts').textContent = data.kpis.receipts;
            document.getElementById('kpi-deliveries').textContent = data.kpis.deliveries;
            document.getElementById('kpi-transfers').textContent = data.kpis.transfers;

            // Recent Movements Table
            const movementsTbody = document.getElementById('dashboard-recent-movements');
            movementsTbody.innerHTML = '';
            data.recentMovements.forEach(m => {
                const tr = document.createElement('tr');
                tr.className = "border-b border-gray-100 hover:bg-gray-50 transition-colors";
                tr.innerHTML = `
                    <td class="py-3 px-4 flex items-center">
                        <div class="w-8 h-8 rounded bg-gray-100 flex items-center justify-center mr-3 text-gray-500">
                            <i class="ph ph-package"></i>
                        </div>
                        <span class="font-medium text-gray-800">${m.product}</span>
                    </td>
                    <td class="py-3 px-4 text-gray-600">${m.type}</td>
                    <td class="py-3 px-4 font-semibold ${m.color}">${m.qty}</td>
                    <td class="py-3 px-4 text-gray-500 text-sm whitespace-nowrap"><i class="ph ph-map-pin mr-1"></i>${m.location}</td>
                    <td class="py-3 px-4 text-gray-500 text-sm">${m.date}</td>
                `;
                movementsTbody.appendChild(tr);
            });

            // Low Stock List
            const lowStockContainer = document.getElementById('low-stock-list');
            lowStockContainer.innerHTML = '';
            data.lowStockAlerts.forEach(item => {
                const div = document.createElement('div');
                div.className = "flex justify-between items-center p-3 mb-2 rounded border border-red-100 bg-red-50/30";
                div.innerHTML = `
                    <div class="flex items-center">
                        <div class="w-2 h-2 rounded-full bg-red-500 mr-3"></div>
                        <div>
                            <p class="font-medium text-gray-800 text-sm">${item.product}</p>
                            <p class="text-xs text-gray-500">${item.sku}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="font-bold text-red-600">${item.stock}</p>
                        <p class="text-xs text-gray-500">Min: ${item.min}</p>
                    </div>
                `;
                lowStockContainer.appendChild(div);
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    }

    function initChart() {
        const ctx = document.getElementById('inventoryChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [
                    {
                        label: 'Receipts',
                        data: [12, 19, 3, 5, 2, 3, 10],
                        borderColor: '#0ea5e9', // primary-500
                        backgroundColor: 'rgba(14, 165, 233, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Deliveries',
                        data: [5, 12, 18, 14, 7, 5, 2],
                        borderColor: '#f59e0b', // amber-500
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            usePointStyle: true,
                            boxWidth: 8
                        }
                    }
                },
                scales: {
                    y: { beginAtZero: true, grid: { borderDash: [2, 2] } },
                    x: { grid: { display: false } }
                },
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
            }
        });
    }

    // --- Page Renderers ---
    // (Will be implemented in next tasks to keep file modular)
    function renderProductsPage() {
        const container = document.getElementById('view-products');
        if (container.innerHTML.trim() !== '') return; // Already rendered

        container.innerHTML = `
            <div class="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h1 class="text-2xl font-bold text-gray-800">Products</h1>
                <button class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm flex items-center">
                    <i class="ph ph-plus mr-2"></i> Add Product
                </button>
            </div>
            
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                    <div class="relative w-64">
                        <i class="ph ph-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                        <input type="text" placeholder="Search products..." class="w-full pl-10 pr-3 py-1.5 border border-gray-300 rounded-md focus:ring-1 focus:ring-primary-500 outline-none text-sm">
                    </div>
                    <div class="flex space-x-2">
                        <button class="flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"><i class="ph ph-funnel mr-1"></i> Filters</button>
                        <button class="flex items-center px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"><i class="ph ph-export mr-1"></i> Export</button>
                    </div>
                </div>
                
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead class="bg-white text-gray-500 text-sm border-b border-gray-200">
                            <tr>
                                <th class="py-3 px-4 font-medium">Product Details</th>
                                <th class="py-3 px-4 font-medium">Category</th>
                                <th class="py-3 px-4 font-medium text-right">On Hand</th>
                                <th class="py-3 px-4 font-medium">UoM</th>
                                <th class="py-3 px-4 font-medium text-right">Price</th>
                                <th class="py-3 px-4 font-medium text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="products-tbody" class="text-sm">
                            <!-- Populated below -->
                        </tbody>
                    </table>
                </div>
                <div class="p-4 border-t border-gray-200 flex justify-between items-center text-sm text-gray-500">
                    <span>Showing 1 to 5 of 1,245 entries</span>
                    <div class="flex space-x-1">
                        <button class="px-2 py-1 border rounded hover:bg-gray-50 disabled:opacity-50" disabled>Prev</button>
                        <button class="px-2 py-1 border rounded bg-primary-50 text-primary-600 border-primary-200">1</button>
                        <button class="px-2 py-1 border rounded hover:bg-gray-50">2</button>
                        <button class="px-2 py-1 border rounded hover:bg-gray-50">3</button>
                        <button class="px-2 py-1 border rounded hover:bg-gray-50">Next</button>
                    </div>
                </div>
            </div>
        `;

        // Fetch products from API
        const productsTbody = document.getElementById('products-tbody');

        async function fetchProducts() {
            try {
                const response = await fetch('api/products.php');
                const products = await response.json();

                productsTbody.innerHTML = '';
                products.forEach(p => {
                    const row = document.createElement('tr');
                    row.className = "border-b border-gray-100 hover:bg-gray-50";
                    row.innerHTML = `
                        <td class="py-3 px-4">
                            <div class="flex items-center">
                                <div class="w-10 h-10 rounded-lg bg-gray-100 flex justify-center items-center text-gray-400 mr-3 shrink-0"><i class="ph ph-image text-xl"></i></div>
                                <div>
                                    <p class="font-medium text-gray-800">${p.name}</p>
                                    <p class="text-xs text-gray-500">${p.sku}</p>
                                </div>
                            </div>
                        </td>
                        <td class="py-3 px-4"><span class="bg-gray-100 text-gray-600 px-2 py-1 rounded-md text-xs">${p.cat}</span></td>
                        <td class="py-3 px-4 text-right font-semibold ${p.stock < 10 ? 'text-red-500' : 'text-gray-800'}">${p.stock}</td>
                        <td class="py-3 px-4 text-gray-500">${p.uom}</td>
                        <td class="py-3 px-4 text-right">${p.price}</td>
                        <td class="py-3 px-4 text-center">
                            <button class="text-gray-400 hover:text-primary-600 mr-2"><i class="ph ph-pencil-simple text-lg"></i></button>
                            <button class="text-gray-400 hover:text-red-600"><i class="ph ph-trash text-lg"></i></button>
                        </td>
                    `;
                    productsTbody.appendChild(row);
                });
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        }

        fetchProducts();

        // Add Product Event Listener
        const addBtn = container.querySelector('button.bg-primary-600');
        if (addBtn) {
            addBtn.addEventListener('click', () => {
                openModal(`
                    <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden">
                        <div class="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50">
                            <h3 class="text-xl font-bold text-gray-800">New Product</h3>
                            <button onclick="closeModal()" class="text-gray-400 hover:text-gray-600"><i class="ph ph-x text-xl"></i></button>
                        </div>
                        <div class="p-6">
                            <form id="add-product-form" class="space-y-4">
                                <div id="form-error" class="hidden bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4"></div>
                                <div class="grid grid-cols-2 gap-4">
                                    <div class="col-span-2 sm:col-span-1">
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                        <input type="text" id="p-name" required class="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-1 focus:ring-primary-500 focus:border-primary-500 outline-none" placeholder="e.g. Ergonomic Keyboard">
                                    </div>
                                    <div class="col-span-2 sm:col-span-1">
                                        <label class="block text-sm font-medium text-gray-700 mb-1">SKU / Code</label>
                                        <input type="text" id="p-sku" required class="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-1 focus:ring-primary-500 outline-none" placeholder="e.g. KBD-ERG-01">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                        <select id="p-cat" class="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-1 focus:ring-primary-500 outline-none bg-white">
                                            <option value="Electronics">Electronics</option>
                                            <option value="Furniture">Furniture</option>
                                            <option value="Office Supplies">Office Supplies</option>
                                            <option value="Accessories">Accessories</option>
                                            <option value="Stationery">Stationery</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Unit of Measure</label>
                                        <select id="p-uom" class="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-1 focus:ring-primary-500 outline-none bg-white">
                                            <option value="Units">Units</option>
                                            <option value="Box">Box</option>
                                            <option value="Kg">Kg</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Initial Stock</label>
                                        <input type="number" id="p-stock" value="0" class="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-1 focus:ring-primary-500 outline-none">
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-1">Cost Price ($)</label>
                                        <input type="number" step="0.01" id="p-price" value="0.00" class="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:ring-1 focus:ring-primary-500 outline-none">
                                    </div>
                                </div>
                                <div class="mt-6 flex justify-end space-x-3 pt-4 border-t border-gray-100">
                                    <button type="button" onclick="closeModal()" class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                                    <button type="submit" class="px-4 py-2 bg-primary-600 rounded-lg text-sm font-medium text-white hover:bg-primary-700">Save Product</button>
                                </div>
                            </form>
                        </div>
                    </div>
                `);

                // Handle Form submission
                document.getElementById('add-product-form').addEventListener('submit', async (e) => {
                    e.preventDefault();

                    const payload = {
                        name: document.getElementById('p-name').value,
                        sku: document.getElementById('p-sku').value,
                        category: document.getElementById('p-cat').value,
                        uom: document.getElementById('p-uom').value,
                        stock: parseInt(document.getElementById('p-stock').value),
                        price: parseFloat(document.getElementById('p-price').value),
                        min_stock: 10 // Default
                    };

                    try {
                        const res = await fetch('api/products.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload)
                        });
                        const data = await res.json();

                        if (data.status === 'success') {
                            closeModal();
                            fetchProducts(); // Refresh table
                            populateDashboard(); // Refresh KPI since stock might have changed
                        } else {
                            const errDiv = document.getElementById('form-error');
                            errDiv.textContent = data.message;
                            errDiv.classList.remove('hidden');
                        }
                    } catch (err) {
                        console.error("Submission error:", err);
                    }
                });
            });
        }
    }

    // Modal logic
    window.openModal = function (htmlContent) {
        const modal = document.getElementById('modal-container');
        modal.innerHTML = htmlContent;
        modal.classList.remove('hidden');
        // small delay for transition
        setTimeout(() => modal.classList.remove('opacity-0'), 10);
    };

    window.closeModal = function () {
        const modal = document.getElementById('modal-container');
        modal.classList.add('opacity-0');
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.innerHTML = '';
        }, 300);
    };

    function renderReceiptsPage() {
        const container = document.getElementById('view-receipts');
        if (container.innerHTML.trim() !== '') return;

        container.innerHTML = `
            <div class="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h1 class="text-2xl font-bold text-gray-800">Incoming Receipts</h1>
                <button class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center shadow-sm">
                    <i class="ph ph-plus mr-2"></i> Create Receipt
                </button>
            </div>
            
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead class="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                            <tr>
                                <th class="py-3 px-4 font-medium">Receipt ID</th>
                                <th class="py-3 px-4 font-medium">Supplier</th>
                                <th class="py-3 px-4 font-medium">Scheduled Date</th>
                                <th class="py-3 px-4 font-medium">Source Document</th>
                                <th class="py-3 px-4 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody class="text-sm">
                            <tr class="border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                                <td class="py-3 px-4 font-medium text-primary-600">WH/IN/00012</td>
                                <td class="py-3 px-4">TechSupply Inc.</td>
                                <td class="py-3 px-4">2026-03-15</td>
                                <td class="py-3 px-4 text-gray-500">PO0045</td>
                                <td class="py-3 px-4"><span class="badge badge-waiting">Waiting</span></td>
                            </tr>
                            <tr class="border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                                <td class="py-3 px-4 font-medium text-primary-600">WH/IN/00013</td>
                                <td class="py-3 px-4">Office Depot Global</td>
                                <td class="py-3 px-4">2026-03-16</td>
                                <td class="py-3 px-4 text-gray-500">PO0048</td>
                                <td class="py-3 px-4"><span class="badge badge-draft">Draft</span></td>
                            </tr>
                            <tr class="border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                                <td class="py-3 px-4 font-medium text-primary-600">WH/IN/00011</td>
                                <td class="py-3 px-4">Global Electronics</td>
                                <td class="py-3 px-4">2026-03-12</td>
                                <td class="py-3 px-4 text-gray-500">PO0041</td>
                                <td class="py-3 px-4"><span class="badge badge-done">Done</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    function renderDeliveriesPage() {
        const container = document.getElementById('view-deliveries');
        if (container.innerHTML.trim() !== '') return;

        container.innerHTML = `
            <div class="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h1 class="text-2xl font-bold text-gray-800">Delivery Orders</h1>
                <button class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center shadow-sm">
                    <i class="ph ph-plus mr-2"></i> New Delivery
                </button>
            </div>
            
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead class="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                            <tr>
                                <th class="py-3 px-4 font-medium">Order ID</th>
                                <th class="py-3 px-4 font-medium">Customer</th>
                                <th class="py-3 px-4 font-medium">Scheduled Date</th>
                                <th class="py-3 px-4 font-medium">Source Document</th>
                                <th class="py-3 px-4 font-medium">Status</th>
                                <th class="py-3 px-4 font-medium text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody class="text-sm">
                            <tr class="border-b border-gray-100 hover:bg-gray-50">
                                <td class="py-3 px-4 font-medium text-primary-600">WH/OUT/00024</td>
                                <td class="py-3 px-4">Acme Corp</td>
                                <td class="py-3 px-4 text-red-500">2026-03-13 (Late)</td>
                                <td class="py-3 px-4 text-gray-500">SO0102</td>
                                <td class="py-3 px-4"><span class="badge badge-ready">Ready</span></td>
                                <td class="py-3 px-4 text-center">
                                    <button class="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded hover:bg-emerald-200">Validate</button>
                                </td>
                            </tr>
                            <tr class="border-b border-gray-100 hover:bg-gray-50">
                                <td class="py-3 px-4 font-medium text-primary-600">WH/OUT/00025</td>
                                <td class="py-3 px-4">Stark Industries</td>
                                <td class="py-3 px-4">2026-03-15</td>
                                <td class="py-3 px-4 text-gray-500">SO0105</td>
                                <td class="py-3 px-4"><span class="badge badge-waiting">Waiting</span></td>
                                <td class="py-3 px-4 text-center">
                                    <button class="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded cursor-not-allowed">Wait</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    function renderTransfersPage() {
        const container = document.getElementById('view-transfers');
        if (container.innerHTML.trim() !== '') return;

        container.innerHTML = `
            <div class="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h1 class="text-2xl font-bold text-gray-800">Internal Transfers</h1>
                <button class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center shadow-sm">
                    <i class="ph ph-plus mr-2"></i> New Transfer
                </button>
            </div>
            
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="p-8 text-center text-gray-500">
                    <i class="ph ph-arrows-left-right text-4xl mb-3 text-gray-300"></i>
                    <p>No pending internal transfers.</p>
                </div>
            </div>
        `;
    }

    function renderAdjustmentsPage() {
        const container = document.getElementById('view-adjustments');
        if (container.innerHTML.trim() !== '') return;

        container.innerHTML = `
            <div class="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h1 class="text-2xl font-bold text-gray-800">Inventory Adjustments</h1>
                <button class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center shadow-sm">
                    <i class="ph ph-plus mr-2"></i> New Adjustment
                </button>
            </div>
            
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden p-6">
                <p class="text-gray-600 text-sm mb-4">Create an inventory adjustment to correct stock mismatch in real locations.</p>
                
                <table class="w-full text-left border">
                    <thead class="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                        <tr>
                            <th class="py-3 px-4 font-medium">Reference</th>
                            <th class="py-3 px-4 font-medium">Location</th>
                            <th class="py-3 px-4 font-medium">Date</th>
                            <th class="py-3 px-4 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody class="text-sm">
                        <tr class="border-b border-gray-100 hover:bg-gray-50">
                            <td class="py-3 px-4 font-medium">INV: Annual Count 2026</td>
                            <td class="py-3 px-4">WH/Stock</td>
                            <td class="py-3 px-4">2026-01-01</td>
                            <td class="py-3 px-4"><span class="badge badge-done">Validated</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }

    function renderHistoryPage() {
        const container = document.getElementById('view-history');
        if (container.innerHTML.trim() !== '') return;

        container.innerHTML = `
            <div class="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h1 class="text-2xl font-bold text-gray-800">Move History</h1>
                <div class="relative">
                    <i class="ph ph-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <input type="text" placeholder="Search product or reference..." class="pl-10 pr-3 py-2 border border-gray-300 rounded-md outline-none text-sm w-64 bg-gray-50 focus:bg-white focus:ring-1 focus:ring-primary-500">
                </div>
            </div>
            
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead class="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                            <tr>
                                <th class="py-3 px-4 font-medium">Date</th>
                                <th class="py-3 px-4 font-medium">Reference</th>
                                <th class="py-3 px-4 font-medium">Product</th>
                                <th class="py-3 px-4 font-medium">From</th>
                                <th class="py-3 px-4 font-medium">To</th>
                                <th class="py-3 px-4 font-medium text-right">Quantity</th>
                            </tr>
                        </thead>
                        <tbody class="text-sm">
                            <tr class="border-b border-gray-100 hover:bg-gray-50">
                                <td class="py-3 px-4 text-gray-500 text-xs">2026-03-14 08:30:12</td>
                                <td class="py-3 px-4">WH/IN/00010</td>
                                <td class="py-3 px-4 font-medium">Wireless Mouse X1</td>
                                <td class="py-3 px-4 text-gray-500">Partner Locations/Vendors</td>
                                <td class="py-3 px-4 text-gray-800">WH/Stock/Rack A</td>
                                <td class="py-3 px-4 text-right text-green-600 font-semibold">+50.00</td>
                            </tr>
                            <tr class="border-b border-gray-100 hover:bg-gray-50">
                                <td class="py-3 px-4 text-gray-500 text-xs">2026-03-13 15:45:00</td>
                                <td class="py-3 px-4">WH/OUT/00023</td>
                                <td class="py-3 px-4 font-medium">Mechanical Keyboard Z</td>
                                <td class="py-3 px-4 text-gray-800">WH/Stock/Rack B</td>
                                <td class="py-3 px-4 text-gray-500">Partner Locations/Customers</td>
                                <td class="py-3 px-4 text-right text-red-500 font-semibold">-2.00</td>
                            </tr>
                            <tr class="border-b border-gray-100 hover:bg-gray-50">
                                <td class="py-3 px-4 text-gray-500 text-xs">2026-03-13 11:20:44</td>
                                <td class="py-3 px-4">WH/INT/00005</td>
                                <td class="py-3 px-4 font-medium">USB-C Cable 2m</td>
                                <td class="py-3 px-4 text-gray-800">WH/Receiving</td>
                                <td class="py-3 px-4 text-gray-800">WH/Stock/Rack C</td>
                                <td class="py-3 px-4 text-right text-blue-500 font-semibold">100.00</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    }

    function renderWarehousesPage() {
        const container = document.getElementById('view-warehouses');
        if (container.innerHTML.trim() !== '') return;

        container.innerHTML = `
            <div class="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h1 class="text-2xl font-bold text-gray-800">Warehouses & Locations</h1>
                <div class="space-x-2">
                    <button class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm">Locations</button>
                    <button class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm">
                        Create
                    </button>
                </div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:border-primary-300 transition-colors cursor-pointer">
                    <div class="w-12 h-12 bg-blue-50 text-primary-600 rounded-lg flex items-center justify-center mb-4">
                        <i class="ph ph-warehouse text-2xl"></i>
                    </div>
                    <h3 class="text-lg font-bold text-gray-800 mb-1">Main Warehouse (WH)</h3>
                    <p class="text-sm text-gray-500 mb-4">123 Logistics Ave, NY 10001</p>
                    <div class="flex justify-between items-center border-t border-gray-100 pt-4">
                        <span class="text-xs font-semibold text-gray-500 tracking-wide uppercase">Locations: 24</span>
                        <a href="#" class="text-sm text-primary-600 hover:text-primary-700 font-medium">Manage</a>
                    </div>
                </div>
                
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:border-primary-300 transition-colors cursor-pointer">
                    <div class="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
                        <i class="ph ph-storefront text-2xl"></i>
                    </div>
                    <h3 class="text-lg font-bold text-gray-800 mb-1">Retail Store East (RET-E)</h3>
                    <p class="text-sm text-gray-500 mb-4">456 Market St, NY 10002</p>
                    <div class="flex justify-between items-center border-t border-gray-100 pt-4">
                        <span class="text-xs font-semibold text-gray-500 tracking-wide uppercase">Locations: 5</span>
                        <a href="#" class="text-sm text-primary-600 hover:text-primary-700 font-medium">Manage</a>
                    </div>
                </div>
                
                <div class="bg-gray-50 rounded-xl border border-dashed border-gray-300 p-5 flex flex-col justify-center items-center text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer min-h-[200px]">
                    <i class="ph ph-plus-circle text-3xl mb-2 text-gray-400"></i>
                    <p class="font-medium">Add Warehouse</p>
                </div>
            </div>
        `;
    }

});
document.querySelector('[data-view="products"]').addEventListener("click", function () {

    fetch("api/products.php")
        .then(response => response.text())
        .then(data => {

            document.getElementById("view-products").innerHTML = data;

            document.querySelectorAll(".view-section").forEach(v => v.classList.add("hidden"));
            document.getElementById("view-products").classList.remove("hidden");

        });

});