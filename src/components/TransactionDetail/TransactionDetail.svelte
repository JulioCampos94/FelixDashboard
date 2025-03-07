<script>
  export let transaction;
  export let closeModal;
  import { t } from 'svelte-i18n';

  function close() {
    closeModal();
  }
</script>

<div class="modal-overlay">
  <div class="modal">
    <div class="modal-content">
      <h3>{$t('transactionDetail')}</h3>
      <p><strong>ID:</strong> {transaction.transaction_id}</p>
      <p><strong>{$t('sender')}:</strong> {transaction.sender_whatsapp}</p>
      <p><strong>{$t('receiver')}:</strong> {transaction.receiver_whatsapp}</p>
      <p><strong>{$t('amountSent')}:</strong> ${transaction.amount_sent}</p>
      <p><strong>{$t('amountReceived')}:</strong> {transaction.amount_received}</p>
      <p><strong>{$t('exchange')}:</strong> {transaction.exchange_rate}</p>
      <p><strong>{$t('status')}:</strong> {transaction.status}</p>
      <p><strong>{$t('method')}:</strong> {transaction.payment_method}</p>

      <button class="close-button" on:click={close}>{$t('close')}</button>
    </div>
  </div>
</div>

<style>
.close-button {
  background-color: black;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 22px;
  font-weight: bold;
  position: relative;
  right: 10px;
  top: 10px;
  z-index: 1;
}

.close-button:hover {
  background-color: #333;
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

.modal-content p {
  color: #555;
  font-size: 1rem;
  margin: 15px 0;
  text-align: left;
}

.modal-overlay {
  align-items: center;
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

@keyframes fadeInBackground {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInModal {
  from {
    opacity: 0;
    transform: translate(-50%, -55%);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

button {
  background-color: #007BFF;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  font-size: 16px;
  padding: 12px 25px;
  transition: background-color 0.3s ease;
  width: 200px;
  align-self: center;
  margin-top: 20px;
}

button:hover {
  background-color: #0056b3;
}

@media (max-width: 400px) {
  .modal {
    padding: 10px;
    width: 95%;
  }

  button {
    font-size: 12px;
    padding: 8px 16px;
    width: 140px;
  }
}

@media (max-width: 600px) {
  .modal {
    padding: 15px;
    width: 85%;
  }

  button {
    font-size: 14px;
    padding: 10px 18px;
    width: 160px;
  }
}

@media (max-width: 768px) {
  .modal {
    padding: 20px;
    width: 90%;
  }

  button {
    font-size: 14px;
    padding: 10px 20px;
    width: 180px;
  }
}
</style>
