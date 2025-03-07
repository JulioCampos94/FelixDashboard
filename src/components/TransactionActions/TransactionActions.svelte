<script>
  export let transaction = null;
  export let closeModal;
  export let onSave;

  import { t } from 'svelte-i18n';

  let transactionData = {
    transaction_id: '',
    sender_whatsapp: '',
    receiver_whatsapp: '',
    amount_sent: null,
    exchange_rate:null,
    amount_received:null,
    status: 'Pending',
    payment_method:'',
    date: new Date().toISOString().split('T')[0],
  };

  let buttonText = '';

  $: buttonText = transaction ? $t('save') : $t('addTransaction');

  if (transaction && typeof transaction === 'object') {
    // @ts-ignore
    transactionData = { ...transaction };
  }

  async function saveTransaction() {
    const url = transaction ? 
      `https://67c661b6351c081993fd057f.mockapi.io/api/mockTransaction/transactions/${transaction.transaction_id}` : 
      'https://67c661b6351c081993fd057f.mockapi.io/api/mockTransaction/transactions';
    
    const method = transaction ? 'PUT' : 'POST';
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });
      const result = await response.json();
      console.log(result);
      onSave(result);
      closeModal();
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  }
</script>

<div class="modal-overlay">
  <div class="modal">
    <h2>{transaction ? 'Edit Transaction' : 'Add New Transaction'}</h2>

    <div class="form-group">
      <label for="sender_whatsapp">{$t('senderWhatsapp')}</label>
      <input id="sender_whatsapp" type="text" bind:value={transactionData.sender_whatsapp} />
    </div>

    <div class="form-group">
      <label for="receiver_whatsapp">{$t('receiverWhatsapp')} </label>
      <input id="receiver_whatsapp" type="text" bind:value={transactionData.receiver_whatsapp}  />
    </div>

    <div class="form-group">
      <label for="amount_sent">{$t('amountSent')}</label>
      <input id="amount_sent" type="number" bind:value={transactionData.amount_sent}/>
    </div>

    <div class="form-group">
      <label for="exchange_rate">{$t('exchange')}</label>
      <input id="exchange_rate" type="number" bind:value={transactionData.exchange_rate}  />
    </div>

    <div class="form-group">
      <label for="amount_received">{$t('amountReceived')}</label>
      <input id="amount_received" type="number" bind:value={transactionData.amount_received} />
    </div>

    <div class="form-group">
      <label for="status">{$t('status')}</label>
      <select id="status" bind:value={transactionData.status}>
        <option value="Pending">{$t('pending')}</option>
        <option value="Completed">{$t('complete')}</option>
        <option value="Failed">{$t('failed')}</option>
      </select>
    </div>

    <div class="form-group">
      <label for="payment_method">{$t('method')}</label>
      <input id="payment_method" type="text" bind:value={transactionData.payment_method} />
    </div>

    <div class="form-group">
      <label for="date">{$t('date')}</label>
      <input id="date" type="date" bind:value={transactionData.date} />
    </div>
    
    <div class="button-container">
      <button on:click={saveTransaction}>{buttonText}</button>
      <button class="cancel-button" on:click={closeModal}>{$t('cancel')}</button>
    </div>
  </div>
</div>

<style>
 .button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.button-container button {
  width: 48%;
}

.button-container button:hover {
  background-color: #0056b3;
}

button {
  background-color: #007BFF;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-size: 16px;
  padding: 10px 20px;
  transition: background-color 0.3s ease;
  width: 100%;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

button:hover {
  background-color: #0056b3;
}

.cancel-button {
  background-color: black;
}

.cancel-button:hover {
  background-color: #999;
}

.form-group {
  align-items: center;
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.form-group input,
.form-group select {
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  padding: 10px;
  transition: border-color 0.2s ease;
  width: 100%;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #007BFF;
  outline: none;
}

.form-group label {
  color: #333;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
}

.modal {
  animation: fadeIn 0.3s ease-out;
  background: #fff;
  border-radius: 12px;
  box-sizing: border-box;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow-y: auto;
  padding: 20px;
  position: relative;
  width: 500px;
}

.modal-overlay {
  background: rgba(0, 0, 0, 0.5);
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 1000;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 400px) {
  .modal {
    padding: 10px;
    width: 95%;
  }

  .form-group input,
  .form-group select {
    font-size: 12px;
    padding: 8px;
  }

  button {
    font-size: 12px;
    padding: 8px 16px;
  }

  .button-container button {
    width: 48%;
  }
}

@media (max-width: 600px) {
  .modal {
    padding: 15px;
    width: 90%;
  }

  .form-group input,
  .form-group select {
    font-size: 12px;
    padding: 8px;
  }

  button {
    font-size: 14px;
    padding: 10px 20px;
  }

  .button-container button {
    width: 48%;
  }
}

</style>
