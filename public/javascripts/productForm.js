document.addEventListener('DOMContentLoaded', () => {
  const productForm = document.getElementById('productForm');

  if (productForm) {
    const nameField = document.getElementById('name');
    const quantityField = document.getElementById('quantity');
    const priceField = document.getElementById('price');
    const categoryField = document.getElementById('category');

    // Add error styling to a field
    const showError = (field, message) => {
      field.classList.add('error');

      // Create or update error message
      let errorElement = field.parentNode.querySelector('.error-message');
      if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        field.parentNode.appendChild(errorElement);
      }
      errorElement.textContent = message;
    };

    // Remove error styling from a field
    const clearError = (field) => {
      field.classList.remove('error');

      const errorElement = field.parentNode.querySelector('.error-message');
      if (errorElement) {
        errorElement.remove();
      }
    };

    // Validate name field
    const validateName = () => {
      const value = nameField.value.trim();

      if (value === '') {
        showError(nameField, 'Le nom du produit est obligatoire');
        return false;
      } else if (value.length < 2) {
        showError(nameField, 'Le nom doit contenir au moins 2 caractères');
        return false;
      } else if (value.length > 100) {
        showError(nameField, 'Le nom ne doit pas dépasser 100 caractères');
        return false;
      } else {
        clearError(nameField);
        return true;
      }
    };

    // Validate quantity field
    const validateQuantity = () => {
      const value = quantityField.value.trim();

      if (value === '') {
        showError(quantityField, 'La quantité est obligatoire');
        return false;
      } else if (isNaN(value) || parseInt(value) < 0) {
        showError(quantityField, 'La quantité doit être un nombre positif');
        return false;
      } else {
        clearError(quantityField);
        return true;
      }
    };

    // Validate price field
    const validatePrice = () => {
      const value = priceField.value.trim();

      if (value === '') {
        showError(priceField, 'Le prix est obligatoire');
        return false;
      } else if (isNaN(value) || parseFloat(value) < 0) {
        showError(priceField, 'Le prix doit être un nombre positif');
        return false;
      } else {
        clearError(priceField);
        return true;
      }
    };

    // Validate category field
    const validateCategory = () => {
      const value = categoryField.value.trim();

      if (value === '') {
        showError(categoryField, 'La catégorie est obligatoire');
        return false;
      } else {
        clearError(categoryField);
        return true;
      }
    };

    // Add validation to input fields
    nameField.addEventListener('blur', validateName);
    quantityField.addEventListener('blur', validateQuantity);
    priceField.addEventListener('blur', validatePrice);
    categoryField.addEventListener('blur', validateCategory);

    // Form submission validation
    productForm.addEventListener('submit', (e) => {
      const isNameValid = validateName();
      const isQuantityValid = validateQuantity();
      const isPriceValid = validatePrice();
      const isCategoryValid = validateCategory();

      // Prevent form submission if validation fails
      if (!isNameValid || !isQuantityValid || !isPriceValid || !isCategoryValid) {
        e.preventDefault();
      }
    });
  }
});
