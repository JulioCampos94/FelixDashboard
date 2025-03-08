<script>
  import { onMount } from "svelte";
  import TransactionDetail from "../TransactionDetail/TransactionDetail.svelte";
  import TransactionActions from "../TransactionActions/TransactionActions.svelte";
  import { t } from 'svelte-i18n';
  import { locale } from 'svelte-i18n';

  let transactions = []; 
  let filteredTransactions = [];
  let searchQuery = ""; 
  let statusFilter = "";
  let startDate = ""; 
  let endDate = ""; 
  let currentPage = 1; 
  let itemsPerPage = 10; 
  let selectedTransaction = null; 
  let selectedAction = null; 
  let showModal = false; 

  $: currentLocale = $locale; // Reactive variable for the current locale

  function switchToEnglish() {
    locale.set('en');
  }

  function switchToSpanish() {
    locale.set('es');
  }

  // Fetch transactions from API
  async function fetchTransactions() {
    try {
      const response = await fetch("https://67c661b6351c081993fd057f.mockapi.io/api/mockTransaction/transactions");
      transactions = await response.json();
      applyFilters(); 
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }

  // Save or update a transaction
  function handleTransactionSave(updatedTransaction) {
    const index = transactions.findIndex(tx => tx.transaction_id === updatedTransaction.transaction_id);
    if (index !== -1) {
      transactions[index] = updatedTransaction; // Update existing transaction
    } else {
      transactions.push(updatedTransaction); // Add new transaction
    }
    applyFilters(); 
  }

  onMount(fetchTransactions); // Fetch transactions when component mounts

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString(); 
  }

  // Apply filters 
  function applyFilters() {
    filteredTransactions = transactions.filter(tx => {
      const matchSearch = tx.transaction_id.includes(searchQuery) || 
                          String(tx.sender_whatsapp).includes(searchQuery) || 
                          String(tx.receiver_whatsapp).includes(searchQuery);
                          
      const matchStatus = statusFilter ? tx.status === statusFilter : true;
      const matchDate = (startDate && endDate) ? 
                        (new Date(tx.date) >= new Date(startDate) && new Date(tx.date) <= new Date(endDate)) : 
                        true;
      return matchSearch && matchStatus && matchDate; // Return only matching transactions
    });
    currentPage = 1; // Reset to first page after applying filters
  }

  function clearFilters() {
    searchQuery = "";
    statusFilter = "";
    startDate = "";
    endDate = "";
    applyFilters(); 
  }

  function openTransactionDetail(tx) {
    selectedTransaction = { ...tx };
  }

  function closeTransactionDetail() {
    selectedTransaction = null;
  }

  // Paginate filtered transactions
  $: paginatedTransactions = filteredTransactions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  
  function nextPage() {
    if (currentPage < Math.ceil(filteredTransactions.length / itemsPerPage)) {
      currentPage++;
    }
  }

  function prevPage() {
    if (currentPage > 1) {
      currentPage--;
    }
  }

  // Delete a transaction by its ID
  async function deleteTransaction(id) {
    try {
      const response = await fetch(`https://67c661b6351c081993fd057f.mockapi.io/api/mockTransaction/transactions/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        transactions = transactions.filter(tx => tx.transaction_id !== id);
        applyFilters(); // Reapply filters after deletion
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  }

  // Open modal for transaction action (edit or delete)
  function openModal(tx = null) {
    selectedAction = tx;
    showModal = true;
  }

  function closeModal() {
    showModal = false;
    selectedAction = null;
  }
</script>

<div class="container">

  <div class="filters">
    <div class="filter-group">
      <label for="searchQuery">{$t('whatsapp')}</label>
      <input id="searchQuery" type="text" bind:value={searchQuery} on:input={applyFilters} placeholder="{$t('search')}" />
    </div>

    <div class="filter-group">
      <label for="statusFilter">{$t('status')}</label>
      <select id="statusFilter" bind:value={statusFilter} on:change={applyFilters}>
        <option value="">{$t('allstatus')}</option>
        <option value="Pending">{$t('pending')}</option>
        <option value="Completed">{$t('complete')}</option>
        <option value="Failed">{$t('failed')}</option>
      </select>
    </div>

    <div class="filter-group">
      <label for="startDate">{$t('from')}</label>
      <input id="startDate" type="date" bind:value={startDate} on:change={applyFilters} />
    </div>
    <div class="filter-group">
      <label for="endDate">{$t('to')}</label>
      <input id="endDate" type="date" bind:value={endDate} on:change={applyFilters} />
    </div>
  </div>

  <div class="clear-button-container">
    <button class="clear" on:click={clearFilters}>{$t('filters')}</button>
    <button class="add" on:click={() => openModal()}>{$t('addTransaction')}</button>
    {#if currentLocale === 'es'}
      <button class="language" on:click={switchToEnglish}>{$t('english')}</button>
    {:else}
      <button class="language" on:click={switchToSpanish}>{$t('spanish')}</button>
    {/if}
  </div>

  <table>
    <thead>
      <tr>
        <th>{$t('id')}</th>
        <th>{$t('sender')}</th>
        <th>{$t('receiver')}</th>
        <th>{$t('status')}</th>
        <th>{$t('date')}</th>
        <th></th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {#each paginatedTransactions as tx}
        <tr>
          <td>
            <button type="button" class="transaction-button" on:click={() => openTransactionDetail(tx)}>
              {tx.transaction_id}
            </button>
          </td>
          <td>{tx.sender_whatsapp}</td>
          <td>{tx.receiver_whatsapp}</td>
          <td>{tx.status}</td>
          <td>{formatDate(tx.date)}</td>
          <td>
            <button on:click={() => openModal(tx)}>
              {$t('editTransaction')}
            </button>
          </td>
          <td>
            <button on:click={() => deleteTransaction(tx.transaction_id)}>
              {$t('deleteTransaction')}
            </button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>

  <div class="pagination">
    <button on:click={prevPage} disabled={currentPage === 1}>{$t('previous')}</button>
    <span> {currentPage}/{Math.ceil(filteredTransactions.length / itemsPerPage)}</span>
    <button on:click={nextPage} disabled={currentPage >= Math.ceil(filteredTransactions.length / itemsPerPage)}>{$t('next')}</button>
  </div>

  <!-- Transaction detail modal -->
  {#if selectedTransaction}
  <TransactionDetail transaction={selectedTransaction || {}} closeModal={closeTransactionDetail} />
  {/if}

  <!-- Transaction action modal -->
  {#if showModal}
    <TransactionActions 
      transaction={selectedAction} 
      closeModal={closeModal} 
      onSave={handleTransactionSave}
    />
  {/if}
</div>

<style>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 1200px;
  padding: 20px;
}

.clear-button-container {
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 10px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 200px;
}

.filters {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 90%;
}

.filters input,
.filters select {
  padding: 8px 6px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  box-sizing: border-box;
}

button.add,
button.clear,
button.language {
  width: auto;
  background-color: black;
  color: white;
  padding: 8px 20px;
  border-radius: 5px;
  cursor: pointer;
}

button.add:hover,
button.clear:hover,
button.language:hover {
  background-color: #333;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 1rem;
  text-align: left;
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

th,
td {
  padding: 10px;
  border: 1px solid #ddd;
}

th {
  background: black;
  color: white;
}

tr:nth-child(even) {
  background: #f4f4f4;
}

tr:hover {
  background: #e2e6ea;
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
}

.pagination button {
  padding: 8px 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: black;
  color: white;
  cursor: pointer;
  transition: background 0.3s ease;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination button:hover:not(:disabled) {
  background-color: #333;
}

.pagination span {
  font-size: 1rem;
  font-weight: bold;
  color: #333;
  align-self: center;
}

.transaction-button {
  background: none;
  border: none;
  color: inherit;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;
}

.transaction-button:hover,
.transaction-button:focus,
.transaction-button:active {
  background: none !important;
  border: none !important;
  color: inherit !important;
  text-decoration: none !important;
  transform: none !important;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-group {
    width: 100%;
  }

  button.add,
  button.clear,
  button.language {
    width: 100%;
    margin-top: 10px;
  }

  table {
    font-size: 0.9rem;
  }

  .pagination {
    flex-direction: column;
  }

  .pagination span {
    margin: 10px 0;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 10px;
  }

  .filters {
    padding: 15px;
  }

  .filter-group {
    width: 100%;
  }

  button.add,
  button.clear,
  button.language {
    padding: 10px 15px;
    font-size: 0.9rem;
  }

  table {
    font-size: 0.8rem;
  }

  .pagination button {
    padding: 6px 10px;
    font-size: 0.9rem;
  }
}
</style>
