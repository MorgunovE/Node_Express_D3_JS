document.addEventListener('DOMContentLoaded', () => {
  // Search functionality
  const searchInput = document.getElementById('product-search');
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      const productItems = document.querySelectorAll('.product-item');

      productItems.forEach(item => {
        const productName = item.querySelector('.product-name').textContent.toLowerCase();
        const productCategory = item.querySelector('.product-category').textContent.toLowerCase();

        if (productName.includes(searchTerm) || productCategory.includes(searchTerm)) {
          item.style.display = 'flex';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }

  // Sort functionality
  const sortSelect = document.getElementById('sort-products');
  if (sortSelect) {
    sortSelect.addEventListener('change', function() {
      const sortValue = this.value;
      const productList = document.querySelector('.product-list');
      const productItems = Array.from(document.querySelectorAll('.product-item'));

      productItems.sort((a, b) => {
        switch (sortValue) {
          case 'name-asc':
            return a.querySelector('.product-name').textContent.localeCompare(b.querySelector('.product-name').textContent);
          case 'name-desc':
            return b.querySelector('.product-name').textContent.localeCompare(a.querySelector('.product-name').textContent);
          case 'price-asc':
            return parseFloat(a.querySelector('.product-price').textContent) - parseFloat(b.querySelector('.product-price').textContent);
          case 'price-desc':
            return parseFloat(b.querySelector('.product-price').textContent) - parseFloat(a.querySelector('.product-price').textContent);
          default:
            return 0;
        }
      });

      // Clear the list and append sorted items
      productList.innerHTML = '';
      productItems.forEach(item => productList.appendChild(item));
    });
  }

  // Confirmation for delete buttons
  const deleteButtons = document.querySelectorAll('.delete-product');
  if (deleteButtons.length > 0) {
    deleteButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) {
          e.preventDefault();
        }
      });
    });
  }
});
