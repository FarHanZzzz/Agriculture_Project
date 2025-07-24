
    // Product Data Storage
    let products = JSON.parse(localStorage.getItem('products')) || [];
    let currentEditId = null;

    // DOM Elements
    const addProductBtn = document.getElementById('addProductBtn');
    const productModal = document.getElementById('productModal');
    const deleteModal = document.getElementById('deleteModal');
    const closeButtons = document.querySelectorAll('.close');
    const cancelBtn = document.getElementById('cancelBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const saveProductBtn = document.getElementById('saveProductBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const productForm = document.getElementById('productForm');
    const productTableBody = document.getElementById('productTableBody');
    const noProductsMessage = document.getElementById('noProductsMessage');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    // Initialize the app
    document.addEventListener('DOMContentLoaded', () => {
      // Add sample products if empty
      if (products.length === 0) {
        const today = new Date();
        const nextMonth = new Date(today);
        nextMonth.setMonth(today.getMonth() + 1);
        
        products = [
          {
            id: 'AG-1234',
            name: 'Organic Tomatoes',
            cropType: 'Vegetables',
            plantingDate: formatDateForInput(new Date(today.getFullYear(), today.getMonth() - 3, 15)),
            harvestDate: formatDateForInput(new Date(today.getFullYear(), today.getMonth(), 10)),
            shelfLife: 14,
            storageReq: 'Refrigerated',
            packagingDetails: 'Cardboard boxes with ventilation holes, 10kg per box'
          },
          {
            id: 'AG-5678',
            name: 'Premium Almonds',
            cropType: 'Nuts',
            plantingDate: formatDateForInput(new Date(today.getFullYear() - 1, 10, 1)),
            harvestDate: formatDateForInput(new Date(today.getFullYear(), 7, 15)),
            shelfLife: 365,
            storageReq: 'Dry Storage',
            packagingDetails: 'Vacuum-sealed bags, 5kg per bag in cardboard cartons'
          }
        ];
        
        localStorage.setItem('products', JSON.stringify(products));
      }
      
      renderProducts();
    });

    function renderProducts(filteredProducts = null) {
  const productsToRender = filteredProducts || products;
  productTableBody.innerHTML = '';

  if (productsToRender.length === 0) {
    noProductsMessage.style.display = 'block';
    return;
  }

  noProductsMessage.style.display = 'none';

  productsToRender.forEach(product => {
    const row = document.createElement('tr');
    const today = new Date();
    const harvestDate = new Date(product.harvestDate);
    const isExpired = today > harvestDate;
    
    // Get icon based on crop type
    let icon = 'fa-leaf';
    if (product.cropType === 'Fruits') icon = 'fa-apple-alt';
    if (product.cropType === 'Vegetables') icon = 'fa-carrot';
    if (product.cropType === 'Grains') icon = 'fa-wheat-awn';
    if (product.cropType === 'Dairy') icon = 'fa-cheese';
    if (product.cropType === 'Meat') icon = 'fa-drumstick-bite';
    if (product.cropType === 'Herbs') icon = 'fa-spa';
    if (product.cropType === 'Nuts') icon = 'fa-acorn';

    // Format packaging details for display
    const packagingText = product.packagingDetails || 'No details provided';
    
    row.innerHTML = `
      <td><div class="product-image"><i class="fas ${icon}"></i></div></td>
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td>${product.cropType}</td>
      <td>${formatDate(product.plantingDate)}</td>
      <td>${formatDate(product.harvestDate)}</td>
      <td>${product.shelfLife} days</td>
      <td>
        <div class="packaging-cell" title="${packagingText}">
          ${packagingText}
        </div>
      </td>
      <td><span class="status-badge ${isExpired ? 'status-expired' : 'status-active'}">${isExpired ? 'Expired' : 'Active'}</span></td>
      <td>
        <div class="action-btns">
          <button class="action-btn edit-btn" onclick="editProduct('${product.id}')"><i class="fas fa-edit"></i></button>
          <button class="action-btn delete-btn" onclick="confirmDelete('${product.id}')"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    `;
    productTableBody.appendChild(row);
  });
}

    // Format date for display
    function formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    }
    
    // Format date for input fields
    function formatDateForInput(date) {
      return date.toISOString().split('T')[0];
    }

    // Generate unique ID
    function generateId() {
      return 'AG-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    }

    // Open Add Product Modal
    addProductBtn.addEventListener('click', () => {
      document.getElementById('productModalTitle').textContent = 'Add New Product';
      currentEditId = null;
      productForm.reset();
      productModal.style.display = 'block';
      setTimeout(() => {
        productModal.classList.add('active');
      }, 10);
    });

    // Close Modals
    function closeModal(modal) {
      modal.classList.remove('active');
      setTimeout(() => {
        modal.style.display = 'none';
      }, 300);
    }

    closeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal');
        closeModal(modal);
      });
    });

    cancelBtn.addEventListener('click', () => closeModal(productModal));
    cancelDeleteBtn.addEventListener('click', () => closeModal(deleteModal));

    // Click outside modal to close
    window.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        closeModal(productModal);
        closeModal(deleteModal);
      }
    });

    // Edit Product
    window.editProduct = function(id) {
      const product = products.find(p => p.id === id);
      if (!product) return;

      currentEditId = id;
      document.getElementById('productModalTitle').textContent = 'Edit Product';
      document.getElementById('editProductId').value = id;
      document.getElementById('productName').value = product.name;
      document.getElementById('cropType').value = product.cropType;
      document.getElementById('plantingDate').value = product.plantingDate;
      document.getElementById('harvestDate').value = product.harvestDate;
      document.getElementById('shelfLife').value = product.shelfLife;
      document.getElementById('storageReq').value = product.storageReq;
      document.getElementById('packagingDetails').value = product.packagingDetails || '';

      productModal.style.display = 'block';
      setTimeout(() => {
        productModal.classList.add('active');
      }, 10);
    };

    // Confirm Delete
    window.confirmDelete = function(id) {
      currentEditId = id;
      deleteModal.style.display = 'block';
      setTimeout(() => {
        deleteModal.classList.add('active');
      }, 10);
    };

    // Save Product
    saveProductBtn.addEventListener('click', () => {
      if (!productForm.checkValidity()) {
        alert('Please fill all required fields');
        return;
      }

      const productData = {
        id: currentEditId || generateId(),
        name: document.getElementById('productName').value,
        cropType: document.getElementById('cropType').value,
        plantingDate: document.getElementById('plantingDate').value,
        harvestDate: document.getElementById('harvestDate').value,
        shelfLife: document.getElementById('shelfLife').value,
        storageReq: document.getElementById('storageReq').value,
        packagingDetails: document.getElementById('packagingDetails').value
      };

      if (currentEditId) {
        // Update existing product
        const index = products.findIndex(p => p.id === currentEditId);
        if (index !== -1) {
          products[index] = productData;
        }
      } else {
        // Add new product
        products.push(productData);
      }

      // Save to localStorage
      localStorage.setItem('products', JSON.stringify(products));
      
      // Refresh the table
      renderProducts();
      
      // Close modal
      closeModal(productModal);
      
      // Show success message
      alert(`Product ${currentEditId ? 'updated' : 'added'} successfully!`);
    });

    // Delete Product
    confirmDeleteBtn.addEventListener('click', () => {
      products = products.filter(p => p.id !== currentEditId);
      localStorage.setItem('products', JSON.stringify(products));
      renderProducts();
      closeModal(deleteModal);
      alert('Product deleted successfully!');
    });

    // Search functionality
    searchInput.addEventListener('input', searchProducts);
    searchBtn.addEventListener('click', searchProducts);

    function searchProducts() {
      const searchTerm = searchInput.value.toLowerCase();
      if (!searchTerm) {
        renderProducts();
        return;
      }

      const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.cropType.toLowerCase().includes(searchTerm) ||
        product.id.toLowerCase().includes(searchTerm) ||
        (product.packagingDetails && product.packagingDetails.toLowerCase().includes(searchTerm))
      );

      renderProducts(filteredProducts);
    }