document.addEventListener('DOMContentLoaded', () => {
  // Add details buttons to each product row
  const actionCells = document.querySelectorAll('.actions');

  actionCells.forEach(cell => {
    // Get the product ID from the edit button's href
    const editButton = cell.querySelector('.btn-edit');
    if (editButton) {
      const editUrl = editButton.getAttribute('href');
      const productId = editUrl.split('/edit/')[1];

      // Create details button
      const detailsButton = document.createElement('a');
      detailsButton.className = 'btn btn-details';
      detailsButton.textContent = 'Détails';
      detailsButton.href = `/products/${productId}`;

      // Insert the details button as the first child of the actions cell
      cell.insertBefore(detailsButton, cell.firstChild);
    }
  });

  // Add sort functionality to table headers
  const tableHeaders = document.querySelectorAll('thead th');
  tableHeaders.forEach(header => {
    if (!header.textContent.includes('Actions')) {
      header.style.cursor = 'pointer';
      header.addEventListener('click', () => sortTable(header));
    }
  });

  // Function to sort the table
  function sortTable(clickedHeader) {
    const table = document.querySelector('table');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    // Get the index of the clicked header
    const headerIndex = Array.from(clickedHeader.parentNode.children).indexOf(clickedHeader);

    // Determine sort direction
    const currentDirection = clickedHeader.getAttribute('data-sort') || 'asc';
    const newDirection = currentDirection === 'asc' ? 'desc' : 'asc';

    // Update header attributes
    document.querySelectorAll('th').forEach(th => th.removeAttribute('data-sort'));
    clickedHeader.setAttribute('data-sort', newDirection);

    // Sort the rows
    rows.sort((a, b) => {
      const cellA = a.querySelectorAll('td')[headerIndex].textContent.trim();
      const cellB = b.querySelectorAll('td')[headerIndex].textContent.trim();

      if (isNaN(cellA) || isNaN(cellB)) {
        // Sort as strings
        return newDirection === 'asc'
          ? cellA.localeCompare(cellB, 'fr', {sensitivity: 'base'})
          : cellB.localeCompare(cellA, 'fr', {sensitivity: 'base'});
      } else {
        // Sort as numbers
        return newDirection === 'asc'
          ? parseFloat(cellA) - parseFloat(cellB)
          : parseFloat(cellB) - parseFloat(cellA);
      }
    });

    // Reinsert the sorted rows
    rows.forEach(row => tbody.appendChild(row));
  }

  // Add hover effect for table rows
  const tableRows = document.querySelectorAll('tbody tr');
  tableRows.forEach(row => {
    row.addEventListener('mouseover', () => {
      row.style.backgroundColor = '#f5f5f5';
    });
    row.addEventListener('mouseout', () => {
      row.style.backgroundColor = '';
    });
  });
});
