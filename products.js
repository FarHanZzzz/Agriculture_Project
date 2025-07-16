document.addEventListener('DOMContentLoaded', function() {
    console.log("Product Management System Initialized");

    // Crop icons mapping
    const cropIcons = {
        'Fruits': 'fa-apple-whole',
        'Vegetables': 'fa-carrot',
        'Grains': 'fa-wheat-awn',
        'Dairy': 'fa-cow',
        'Meat': 'fa-drumstick-bite',
        'Herbs': 'fa-leaf',
        'Nuts': 'fa-peanut',
        'default': 'fa-seedling'
    };

    // Initialize products from localStorage or with sample data
    let products = JSON.parse(localStorage.getItem('products')) || [];
    if (products.length === 0) {
        products = [
            {
                id: 'PRD-' + Date.now(),
                name: 'Organic Apples',
                cropType: 'Fruits',
                plantingDate: '2023-01-15',
                harvestDate: '2023-10-20',
                shelfLife: 30,
                storage: 'Cold Storage',
                packaging: 'Cardboard boxes'
            },
            {
                id: 'PRD-' + (Date.now() + 1),
                name: 'Fresh Carrots',
                cropType: 'Vegetables',
                plantingDate: '2023-03-10',
                harvestDate: '2023-09-15',
                shelfLife: 21,
                storage: 'Refrigerated',
                packaging: 'Plastic bags'
            }
        ];
        localStorage.setItem('products', JSON.stringify(products));
    }

    // DOM Elements
    const productTableBody = document.getElementById('productTableBody');
    const noProductsMessage = document.getElementById('noProductsMessage');
    const addProductBtn = document.getElementById('addProductBtn');
    const saveBtn = document.getElementById('saveProductBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const productForm = document.getElementById('productForm');
    const editProductId = document.getElementById('editProductId');
    
    // Modal elements
    const addProductModal = document.getElementById('addProductModal');
    const deleteProductModal = document.getElementById('deleteProductModal');
    const modalCloseBtns = document.querySelectorAll('.close');

    // Initial render
    renderTable();
    setupEventListeners();

    function setupEventListeners() {
        // Add Product button
        addProductBtn.addEventListener('click', function() {
            productForm.reset();
            editProductId.value = '';
            document.getElementById('productModalTitle').textContent = 'Add New Product';
            saveBtn.textContent = 'Save Product';
            addProductModal.style.display = 'block';
        });

        // Save Product button
        saveBtn.addEventListener('click', handleSave);

        // Cancel button
        cancelBtn.addEventListener('click', function() {
            addProductModal.style.display = 'none';
        });

        // Confirm Delete button
        confirmDeleteBtn.addEventListener('click', handleDelete);

        // Cancel Delete button
        cancelDeleteBtn.addEventListener('click', function() {
            deleteProductModal.style.display = 'none';
        });

        // Modal close buttons
        modalCloseBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const modal = this.closest('.modal');
                modal.style.display = 'none';
            });
        });

        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target.classList.contains('modal')) {
                event.target.style.display = 'none';
            }
        });

        // Table event delegation for edit/delete buttons
        productTableBody.addEventListener('click', function(e) {
            const editBtn = e.target.closest('.edit-btn');
            const deleteBtn = e.target.closest('.delete-btn');
            
            if (editBtn) {
                handleEdit(editBtn.dataset.id);
            }
            if (deleteBtn) {
                showDeleteModal(deleteBtn.dataset.id);
            }
        });
    }

    function renderTable() {
        productTableBody.innerHTML = '';

        if (products.length === 0) {
            noProductsMessage.style.display = 'block';
            return;
        }

        noProductsMessage.style.display = 'none';

        products.forEach(product => {
            const status = calculateStatus(product.harvestDate, product.shelfLife);
            const iconClass = cropIcons[product.cropType] || cropIcons.default;
            const statusClass = status === 'Active' ? 'status-active' : 'status-expired';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td><div class="product-image"><i class="fas ${iconClass}"></i></div></td>
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.cropType}</td>
                <td>${formatDate(product.plantingDate)}</td>
                <td>${formatDate(product.harvestDate)}</td>
                <td>${product.shelfLife} days</td>
                <td><span class="status-badge ${statusClass}">${status}</span></td>
                <td>
                    <button class="btn btn-warning edit-btn" data-id="${product.id}">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger delete-btn" data-id="${product.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            productTableBody.appendChild(row);
        });
    }

    function calculateStatus(harvestDate, shelfLife) {
        if (!harvestDate || !shelfLife) return 'Active';
        
        const harvest = new Date(harvestDate);
        const expiryDate = new Date(harvest);
        expiryDate.setDate(expiryDate.getDate() + shelfLife);
        
        return new Date() <= expiryDate ? 'Active' : 'Expired';
    }

    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    function handleSave() {
        const productId = editProductId.value;
        const productData = {
            id: productId || 'PRD-' + Date.now(),
            name: document.getElementById('productName').value.trim(),
            cropType: document.getElementById('cropType').value,
            plantingDate: document.getElementById('plantingDate').value,
            harvestDate: document.getElementById('harvestDate').value,
            shelfLife: parseInt(document.getElementById('shelfLife').value),
            storage: document.getElementById('storageReq').value,
            packaging: document.getElementById('packagingDetails').value
        };

        // Validation
        if (!productData.name || !productData.cropType || !productData.plantingDate || 
            !productData.harvestDate || isNaN(productData.shelfLife)) {
            alert("Please fill in all required fields.");
            return;
        }

        // Save to array
        if (productId) {
            const index = products.findIndex(p => p.id === productId);
            if (index !== -1) products[index] = productData;
        } else {
            products.push(productData);
        }

        // Save to storage
        localStorage.setItem('products', JSON.stringify(products));
        
        // Update UI
        renderTable();
        addProductModal.style.display = 'none';
    }

    function handleEdit(id) {
        const product = products.find(p => p.id === id);
        if (product) {
            document.getElementById('productModalTitle').textContent = 'Edit Product';
            editProductId.value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('cropType').value = product.cropType;
            document.getElementById('plantingDate').value = product.plantingDate;
            document.getElementById('harvestDate').value = product.harvestDate;
            document.getElementById('shelfLife').value = product.shelfLife;
            document.getElementById('storageReq').value = product.storage;
            document.getElementById('packagingDetails').value = product.packaging;
            saveBtn.textContent = 'Update Product';
            addProductModal.style.display = 'block';
        }
    }

    function showDeleteModal(id) {
        const product = products.find(p => p.id === id);
        if (product) {
            document.getElementById('deleteProductText').innerHTML = 
                `Are you sure you want to delete <strong>${product.name}</strong>?`;
            confirmDeleteBtn.dataset.id = id;
            deleteProductModal.style.display = 'block';
        }
    }

    function handleDelete() {
        const id = this.dataset.id;
        products = products.filter(p => p.id !== id);
        localStorage.setItem('products', JSON.stringify(products));
        renderTable();
        deleteProductModal.style.display = 'none';
    }
});