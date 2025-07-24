 // Data structure
 
    // Data structure
    let products = JSON.parse(localStorage.getItem('agriProducts')) || [];
    let batches = JSON.parse(localStorage.getItem('agriBatches')) || [];
    
    // DOM Elements
    const productView = document.getElementById('productView');
    const batchView = document.getElementById('batchView');
    const productViewBtn = document.getElementById('productViewBtn');
    const batchViewBtn = document.getElementById('batchViewBtn');
    const addProductBtn = document.getElementById('addProductBtn');
    const addBatchBtn = document.getElementById('addBatchBtn');
    const productTableBody = document.getElementById('productTableBody');
    const batchTableBody = document.getElementById('batchTableBody');
    const noProductsMessage = document.getElementById('noProductsMessage');
    const noBatchesMessage = document.getElementById('noBatchesMessage');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    // Modals
    const productModal = document.getElementById('productModal');
    const batchModal = document.getElementById('batchModal');
    const productModalTitle = document.getElementById('productModalTitle');
    const batchModalTitle = document.getElementById('batchModalTitle');
    const cancelProductBtn = document.getElementById('cancelProductBtn');
    const cancelBatchBtn = document.getElementById('cancelBatchBtn');
    const saveProductBtn = document.getElementById('saveProductBtn');
    const saveBatchBtn = document.getElementById('saveBatchBtn');
    const batchProductSelect = document.getElementById('batchProduct');
    const toast = document.getElementById('toast');
    const dynamicActionButton = document.getElementById('dynamicActionButton');
    
    
   // Initialize the application
    document.addEventListener('DOMContentLoaded', () => {
      renderProducts();
      renderBatches();
      setupEventListeners();
      loadProductsForBatchSelect();
      
      // Set initial view to product view
      productViewBtn.click();
    });
    
   function setupEventListeners() {
      // View toggle
      productViewBtn.addEventListener('click', () => {
        productViewBtn.classList.add('btn-primary');
        productViewBtn.classList.remove('btn-info');
        batchViewBtn.classList.remove('btn-primary');
        batchViewBtn.classList.add('btn-info');
        productView.classList.add('active');
        batchView.classList.remove('active');
        
        // Update action button
        dynamicActionButton.innerHTML = '';
        const newAddBtn = addProductBtn.cloneNode(true);
        newAddBtn.addEventListener('click', () => openProductModal());
        dynamicActionButton.appendChild(newAddBtn);
      });
      
     batchViewBtn.addEventListener('click', () => {
        batchViewBtn.classList.add('btn-primary');
        batchViewBtn.classList.remove('btn-info');
        productViewBtn.classList.remove('btn-primary');
        productViewBtn.classList.add('btn-info');
        batchView.classList.add('active');
        productView.classList.remove('active');
        
        // Update action button
        dynamicActionButton.innerHTML = '';
        const newAddBtn = addBatchBtn.cloneNode(true);
        newAddBtn.addEventListener('click', () => openBatchModal());
        dynamicActionButton.appendChild(newAddBtn);
      });
      
      // Add buttons
      addProductBtn.addEventListener('click', () => openProductModal());
      addBatchBtn.addEventListener('click', () => openBatchModal());
      
      // Cancel buttons
      cancelProductBtn.addEventListener('click', () => closeModal(productModal));
      cancelBatchBtn.addEventListener('click', () => closeModal(batchModal));
      
      // Save buttons
      saveProductBtn.addEventListener('click', saveProduct);
      saveBatchBtn.addEventListener('click', saveBatch);
      
      // Close modals when clicking on X
      document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
          if (productModal.style.display === 'block') closeModal(productModal);
          if (batchModal.style.display === 'block') closeModal(batchModal);
        });
      });
      
      // Close modals when clicking outside
      window.addEventListener('click', (e) => {
        if (e.target === productModal) closeModal(productModal);
        if (e.target === batchModal) closeModal(batchModal);
      });
      
      // Search functionality
      searchBtn.addEventListener('click', searchInventory);
      searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') searchInventory();
      });
    }
    
    // Product CRUD operations
    function openProductModal(editId = null) {
  const form = document.getElementById('productForm');
  form.reset();
  
  if (editId) {
    productModalTitle.textContent = 'Edit Product';
    const product = products.find(p => p.id === editId);
    
    if (product) {
      document.getElementById('editProductId').value = product.id;
      document.getElementById('productName').value = product.name;
      document.getElementById('productCategory').value = product.category;
      document.getElementById('shelfLife').value = product.shelfLife;
      document.getElementById('supplierName').value = product.supplier;
      document.getElementById('packagingInfo').value = product.packagingInfo;
      document.getElementById('unitPrice').value = product.unitPrice;
      document.getElementById('productDescription').value = product.description || '';
    }
  } else {
    productModalTitle.textContent = 'Add New Product';
    document.getElementById('editProductId').value = '';
  }
  
  openModal(productModal);
}

    
    function saveProduct() {
      const form = document.getElementById('productForm');
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      
      const id = document.getElementById('editProductId').value;
      const name = document.getElementById('productName').value;
      const category = document.getElementById('productCategory').value;
      const shelfLife = document.getElementById('shelfLife').value;
      const supplier = document.getElementById('supplierName').value;
      const packagingInfo = document.getElementById('packagingInfo').value;
      const unitPrice = document.getElementById('unitPrice').value;
      const description = document.getElementById('productDescription').value;
      
      if (id) {
        // Update existing product
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
          products[index] = {
            id,
            name,
            category,
            shelfLife,
            supplier,
            packagingInfo,
            unitPrice,
            description
          };
          showToast('Product updated successfully!', 'success');
        }
      } else {
        // Add new product
        const newProduct = {
          id: generateId(),
          name,
          category,
          shelfLife,
          supplier,
          packagingInfo,
          unitPrice,
          description
        };
        products.push(newProduct);
        showToast('Product added successfully!', 'success');
      }
      
      saveToLocalStorage();
      renderProducts();
      loadProductsForBatchSelect();
      closeModal(productModal);
    }
    
    function deleteProduct(id) {
      if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== id);
        // Also delete batches associated with this product
        batches = batches.filter(b => b.productId !== id);
        saveToLocalStorage();
        renderProducts();
        renderBatches();
        loadProductsForBatchSelect();
        showToast('Product deleted successfully!', 'success');
      }
    }
    
    // Batch CRUD operations
    function openBatchModal(editId = null) {
  const form = document.getElementById('batchForm');
  form.reset();
  
  if (editId) {
    batchModalTitle.textContent = 'Edit Batch';
    const batch = batches.find(b => b.id === editId);
    
    if (batch) {
      document.getElementById('editBatchId').value = batch.id;
      document.getElementById('batchProduct').value = batch.productId;
      document.getElementById('batchNumber').value = batch.batchNumber;
      document.getElementById('quantity').value = batch.quantity;
      document.getElementById('location').value = batch.location;
      document.getElementById('storageTemp').value = batch.storageTemp || '';
      document.getElementById('storageHumidity').value = batch.storageHumidity || '';
      document.getElementById('expiryDate').value = batch.expiryDate;
      document.getElementById('batchStatus').value = batch.status;
    }
  } else {
    batchModalTitle.textContent = 'Add New Batch';
    document.getElementById('editBatchId').value = '';
  }
  
  openModal(batchModal);
}
    function saveBatch() {
      const form = document.getElementById('batchForm');
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      
      const id = document.getElementById('editBatchId').value;
      const productId = document.getElementById('batchProduct').value;
      const batchNumber = document.getElementById('batchNumber').value;
      const quantity = document.getElementById('quantity').value;
      const location = document.getElementById('location').value;
      const storageTemp = document.getElementById('storageTemp').value || null;
      const storageHumidity = document.getElementById('storageHumidity').value || null;
      const expiryDate = document.getElementById('expiryDate').value;
      const status = document.getElementById('batchStatus').value;
      
      if (id) {
        // Update existing batch
        const index = batches.findIndex(b => b.id === id);
        if (index !== -1) {
          batches[index] = {
            id,
            productId,
            batchNumber,
            quantity,
            location,
            storageTemp,
            storageHumidity,
            expiryDate,
            status
          };
          showToast('Batch updated successfully!', 'success');
        }
      } else {
        // Add new batch
        const newBatch = {
          id: generateId(),
          productId,
          batchNumber,
          quantity,
          location,
          storageTemp,
          storageHumidity,
          expiryDate,
          status
        };
        batches.push(newBatch);
        showToast('Batch added successfully!', 'success');
      }
      
      saveToLocalStorage();
      renderBatches();
      closeModal(batchModal);
    }
    
    function deleteBatch(id) {
      if (confirm('Are you sure you want to delete this batch?')) {
        batches = batches.filter(b => b.id !== id);
        saveToLocalStorage();
        renderBatches();
        showToast('Batch deleted successfully!', 'success');
      }
    }
    
    // Helper functions
    function generateId() {
      return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }
    
function openModal(modal) {
  modal.style.display = 'block';
  setTimeout(() => {
    modal.classList.add('active');
  }, 10);
}
    function closeModal(modal) {
      modal.classList.remove('active');
      setTimeout(() => {
        modal.style.display = 'none';
      }, 300);
    }
    
    function saveToLocalStorage() {
      localStorage.setItem('agriProducts', JSON.stringify(products));
      localStorage.setItem('agriBatches', JSON.stringify(batches));
    }
    
    function loadProductsForBatchSelect() {
      batchProductSelect.innerHTML = '<option value="">Select product</option>';
      products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = product.name;
        batchProductSelect.appendChild(option);
      });
    }
    
    function renderProducts() {
      productTableBody.innerHTML = '';
      
      if (products.length === 0) {
        noProductsMessage.style.display = 'block';
        return;
      }
      
      noProductsMessage.style.display = 'none';
      
      products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td><div class="product-image"><i class="fas fa-box"></i></div></td>
          <td>${product.id.substr(-6)}</td>
          <td>${product.name}</td>
          <td>${product.category}</td>
          <td>${product.shelfLife} days</td>
          <td>${product.supplier}</td>
          <td>$${parseFloat(product.unitPrice).toFixed(2)}</td>
          <td>
            <div class="action-btns">
              <button class="action-btn edit-btn" data-id="${product.id}">
                <i class="fas fa-edit"></i>
              </button>
              <button class="action-btn delete-btn" data-id="${product.id}">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        `;
        productTableBody.appendChild(row);
      });
      
      // Add event listeners to action buttons
      document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          openProductModal(id);
        });
      });
      
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          deleteProduct(id);
        });
      });
    }
    
    function renderBatches() {
      batchTableBody.innerHTML = '';
      
      if (batches.length === 0) {
        noBatchesMessage.style.display = 'block';
        return;
      }
      
      noBatchesMessage.style.display = 'none';
      
      batches.forEach(batch => {
        const product = products.find(p => p.id === batch.productId);
        const productName = product ? product.name : 'Unknown Product';
        
        // Format expiry date
        const expiryDate = new Date(batch.expiryDate);
        const formattedDate = expiryDate.toLocaleDateString();
        
        // Determine status badge
        let statusClass = 'status-available';
        if (batch.status === 'Reserved') statusClass = 'status-reserved';
        if (batch.status === 'Expired') statusClass = 'status-expired';
        
        row = document.createElement('tr');
        row.innerHTML = `
          <td>${batch.id.substr(-6)}</td>
          <td>${productName}</td>
          <td>${batch.batchNumber}</td>
          <td>${batch.quantity}</td>
          <td>${batch.location}</td>
          <td>${formattedDate}</td>
          <td><span class="status-badge ${statusClass}">${batch.status}</span></td>
          <td>
            <div class="action-btns">
              <button class="action-btn edit-btn" data-id="${batch.id}">
                <i class="fas fa-edit"></i>
              </button>
              <button class="action-btn delete-btn" data-id="${batch.id}">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        `;
        batchTableBody.appendChild(row);
      });
      
      // Add event listeners to action buttons
      document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          openBatchModal(id);
        });
      });
      
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          deleteBatch(id);
        });
      });
    }
    
    function searchInventory() {
      const searchTerm = searchInput.value.toLowerCase().trim();
      
      if (!searchTerm) {
        renderProducts();
        renderBatches();
        return;
      }
      
      // Filter products
      const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.supplier.toLowerCase().includes(searchTerm) ||
        product.packagingInfo.toLowerCase().includes(searchTerm) ||
        product.id.toLowerCase().includes(searchTerm)
      );
      
      // Filter batches
      const filteredBatches = batches.filter(batch => {
        const product = products.find(p => p.id === batch.productId);
        const productName = product ? product.name.toLowerCase() : '';
        
        return (
          batch.batchNumber.toLowerCase().includes(searchTerm) ||
          batch.location.toLowerCase().includes(searchTerm) ||
          batch.id.toLowerCase().includes(searchTerm) ||
          productName.includes(searchTerm)
        );
      });
      
      // Render filtered results
      renderFilteredProducts(filteredProducts);
      renderFilteredBatches(filteredBatches);
    }
    
    function renderFilteredProducts(filteredProducts) {
      productTableBody.innerHTML = '';
      
      if (filteredProducts.length === 0) {
        noProductsMessage.style.display = 'block';
        return;
      }
      
      noProductsMessage.style.display = 'none';
      
      filteredProducts.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td><div class="product-image"><i class="fas fa-box"></i></div></td>
          <td>${product.id.substr(-6)}</td>
          <td>${product.name}</td>
          <td>${product.category}</td>
          <td>${product.shelfLife} days</td>
          <td>${product.supplier}</td>
          <td>$${parseFloat(product.unitPrice).toFixed(2)}</td>
          <td>
            <div class="action-btns">
              <button class="action-btn edit-btn" data-id="${product.id}">
                <i class="fas fa-edit"></i>
              </button>
              <button class="action-btn delete-btn" data-id="${product.id}">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        `;
        productTableBody.appendChild(row);
      });
      
      // Add event listeners to action buttons
      document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          openProductModal(id);
        });
      });
      
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          deleteProduct(id);
        });
      });
    }
    
    function renderFilteredBatches(filteredBatches) {
      batchTableBody.innerHTML = '';
      
      if (filteredBatches.length === 0) {
        noBatchesMessage.style.display = 'block';
        return;
      }
      
      noBatchesMessage.style.display = 'none';
      
      filteredBatches.forEach(batch => {
        const product = products.find(p => p.id === batch.productId);
        const productName = product ? product.name : 'Unknown Product';
        
        // Format expiry date
        const expiryDate = new Date(batch.expiryDate);
        const formattedDate = expiryDate.toLocaleDateString();
        
        // Determine status badge
        let statusClass = 'status-available';
        if (batch.status === 'Reserved') statusClass = 'status-reserved';
        if (batch.status === 'Expired') statusClass = 'status-expired';
        
        row = document.createElement('tr');
        row.innerHTML = `
          <td>${batch.id.substr(-6)}</td>
          <td>${productName}</td>
          <td>${batch.batchNumber}</td>
          <td>${batch.quantity}</td>
          <td>${batch.location}</td>
          <td>${formattedDate}</td>
          <td><span class="status-badge ${statusClass}">${batch.status}</span></td>
          <td>
            <div class="action-btns">
              <button class="action-btn edit-btn" data-id="${batch.id}">
                <i class="fas fa-edit"></i>
              </button>
              <button class="action-btn delete-btn" data-id="${batch.id}">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        `;
        batchTableBody.appendChild(row);
      });
      
      // Add event listeners to action buttons
      document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          openBatchModal(id);
        });
      });
      
      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          deleteBatch(id);
        });
      });
    }
    
    function showToast(message, type = 'success') {
      toast.textContent = message;
      toast.className = `toast toast-${type} show`;
      
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }
    
    // Add sample data for initial demonstration
    function addSampleData() {
      if (products.length === 0) {
        products = [
          {
            id: generateId(),
            name: "Organic Tomato Seeds",
            category: "Seeds",
            shelfLife: 730,
            supplier: "GreenThumb Seeds",
            packagingInfo: "500g sealed packets",
            unitPrice: 12.99,
            description: "Heirloom variety, resistant to common diseases"
          },
          {
            id: generateId(),
            name: "NPK Fertilizer 20-20-20",
            category: "Fertilizers",
            shelfLife: 1095,
            supplier: "AgroGrowth Solutions",
            packagingInfo: "25kg bags",
            unitPrice: 45.50,
            description: "Balanced fertilizer for all growth stages"
          }
        ];
        
        batches = [
          {
            id: generateId(),
            productId: products[0].id,
            batchNumber: "TOM-2023-001",
            quantity: 150,
            location: "Warehouse A, Shelf 3",
            storageTemp: 18,
            storageHumidity: 45,
            expiryDate: "2025-12-31",
            status: "Available"
          },
          {
            id: generateId(),
            productId: products[1].id,
            batchNumber: "FERT-2023-045",
            quantity: 500,
            location: "Warehouse B, Shelf 7",
            expiryDate: "2026-06-15",
            status: "Available"
          }
        ];
        
        saveToLocalStorage();
        renderProducts();
        renderBatches();
        loadProductsForBatchSelect();
      }
    }
    
    // Initialize with sample data if empty
    addSampleData();