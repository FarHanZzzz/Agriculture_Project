// Product Manager Module
const productManager = (() => {
    // Sample product data
    let products = JSON.parse(localStorage.getItem('products')) || [
        {
            id: 'PRD-1001',
            name: 'Organic Tomatoes',
            cropType: 'Vegetables',
            plantingDate: '2023-03-15',
            harvestDate: '2023-06-20',
            shelfLife: 14,
            storage: 'Refrigerated',
            packaging: 'Plastic crates, 10kg each'
        },
        {
            id: 'PRD-1002',
            name: 'Golden Apples',
            cropType: 'Fruits',
            plantingDate: '2022-11-10',
            harvestDate: '2023-04-25',
            shelfLife: 30,
            storage: 'Cold Storage',
            packaging: 'Wooden boxes, 20kg each'
        }
    ];

    // DOM Elements
    const elements = {
        tableBody: document.querySelector('#productsTable tbody'),
        searchInput: document.getElementById('searchInput'),
        filterSelect: document.getElementById('filterSelect'),
        modal: new bootstrap.Modal('#productModal'),
        modalTitle: document.getElementById('modalTitle'),
        form: document.getElementById('productForm'),
        saveBtn: document.getElementById('saveBtn'),
        productId: document.getElementById('productId'),
        nameInput: document.getElementById('nameInput'),
        typeSelect: document.getElementById('typeSelect'),
        plantDateInput: document.getElementById('plantDateInput'),
        harvestDateInput: document.getElementById('harvestDateInput'),
        shelfLifeInput: document.getElementById('shelfLifeInput'),
        storageSelect: document.getElementById('storageSelect'),
        packagingInput: document.getElementById('packagingInput')
    };

    // Initialize
    function init() {
        renderTable();
        setupEventListeners();
    }

    // Set up event listeners
    function setupEventListeners() {
        elements.saveBtn.addEventListener('click', handleSave);
        elements.searchInput.addEventListener('input', handleSearch);
        elements.filterSelect.addEventListener('change', handleFilter);
    }

    // Render products table
    function renderTable(productsToRender = products) {
        elements.tableBody.innerHTML = '';
        
        productsToRender.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.cropType}</td>
                <td>${formatDate(product.plantingDate)}</td>
                <td>${formatDate(product.harvestDate)}</td>
                <td>${product.shelfLife} days</td>
                <td>${product.storage}</td>
                <td>
                    <button class="btn btn-sm btn-warning me-1 edit-btn" data-id="${product.id}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger delete-btn" data-id="${product.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            elements.tableBody.appendChild(row);
        });

        // Add event listeners to action buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => handleEdit(btn.dataset.id));
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => handleDelete(btn.dataset.id));
        });
    }

    // Handle save product
    function handleSave() {
        if (!validateForm()) return;

        const productData = {
            id: elements.productId.value || generateId(),
            name: elements.nameInput.value,
            cropType: elements.typeSelect.value,
            plantingDate: elements.plantDateInput.value,
            harvestDate: elements.harvestDateInput.value,
            shelfLife: parseInt(elements.shelfLifeInput.value),
            storage: elements.storageSelect.value,
            packaging: elements.packagingInput.value
        };

        if (elements.productId.value) {
            // Update existing product
            const index = products.findIndex(p => p.id === elements.productId.value);
            if (index !== -1) products[index] = productData;
        } else {
            // Add new product
            products.push(productData);
        }

        saveToLocalStorage();
        renderTable();
        elements.modal.hide();
        resetForm();
    }

    // Handle edit product
    function handleEdit(id) {
        const product = products.find(p => p.id === id);
        if (!product) return;

        elements.modalTitle.textContent = 'Edit Product';
        elements.productId.value = product.id;
        elements.nameInput.value = product.name;
        elements.typeSelect.value = product.cropType;
        elements.plantDateInput.value = product.plantingDate;
        elements.harvestDateInput.value = product.harvestDate;
        elements.shelfLifeInput.value = product.shelfLife;
        elements.storageSelect.value = product.storage;
        elements.packagingInput.value = product.packaging || '';
        elements.saveBtn.textContent = 'Update Product';

        elements.modal.show();
    }

    // Handle delete product
    function handleDelete(id) {
        if (!confirm('Are you sure you want to delete this product?')) return;
        
        products = products.filter(p => p.id !== id);
        saveToLocalStorage();
        renderTable();
    }

    // Handle search
    function handleSearch() {
        const term = elements.searchInput.value.toLowerCase();
        const filtered = products.filter(p => 
            p.name.toLowerCase().includes(term) || 
            p.cropType.toLowerCase().includes(term)
        );
        renderTable(filtered);
    }

    // Handle filter
    function handleFilter() {
        const value = elements.filterSelect.value;
        const filtered = value ? products.filter(p => p.cropType === value) : products;
        renderTable(filtered);
    }

    // Helper functions
    function generateId() {
        return `PRD-${1000 + products.length + 1}`;
    }

    function validateForm() {
        const requiredFields = [
            elements.nameInput,
            elements.typeSelect,
            elements.plantDateInput,
            elements.harvestDateInput,
            elements.shelfLifeInput,
            elements.storageSelect
        ];

        let isValid = true;
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('is-invalid');
            } else {
                field.classList.remove('is-invalid');
            }
        });

        // Date validation
        const plantDate = new Date(elements.plantDateInput.value);
        const harvestDate = new Date(elements.harvestDateInput.value);
        if (harvestDate <= plantDate) {
            alert('Harvest date must be after planting date');
            isValid = false;
        }

        return isValid;
    }

    function resetForm() {
        elements.form.reset();
        elements.productId.value = '';
        elements.modalTitle.textContent = 'Add New Product';
        elements.saveBtn.textContent = 'Save Product';
    }

    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString();
    }

    function saveToLocalStorage() {
        localStorage.setItem('products', JSON.stringify(products));
    }

    // Public API
    return {
        init
    };
})();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', productManager.init);