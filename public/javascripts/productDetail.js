document.addEventListener('DOMContentLoaded', () => {
  // Get the delete form
  const deleteForm = document.querySelector('.delete-form');

  if (deleteForm) {
    // Add confirmation dialog before deletion
    deleteForm.addEventListener('submit', (e) => {
      const confirmDelete = confirm('Êtes-vous sûr de vouloir supprimer ce produit ?');

      if (!confirmDelete) {
        e.preventDefault();
      }
    });
  }

  // Add animation for delete button
  const deleteButton = document.querySelector('.btn-delete');
  if (deleteButton) {
    deleteButton.addEventListener('mouseenter', () => {
      deleteButton.style.backgroundColor = '#d32f2f';
    });

    deleteButton.addEventListener('mouseleave', () => {
      deleteButton.style.backgroundColor = '';
    });
  }

  // Handle error display if present
  const displayError = (message) => {
    const main = document.querySelector('main');
    if (main) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.textContent = message;
      main.prepend(errorDiv);

      // Auto-hide after 5 seconds
      setTimeout(() => {
        errorDiv.style.opacity = '0';
        setTimeout(() => errorDiv.remove(), 500);
      }, 5000);
    }
  };

  // Check for error parameter in URL
  const urlParams = new URLSearchParams(window.location.search);
  const errorMsg = urlParams.get('error');
  if (errorMsg) {
    displayError(decodeURIComponent(errorMsg));
  }
});
