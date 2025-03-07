import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import { vi, describe, it, beforeAll, afterAll, expect } from 'vitest';
import TransactionActions from '../components/TransactionActions/TransactionActions.svelte';
import { locale } from 'svelte-i18n';


vi.mock('svelte', () => ({
  ...vi.importActual('svelte'),
  onMount: vi.fn(),
}));

describe('TransactionActions', () => {
  let closeModal;
  let onSave;

  beforeAll(() => {
    locale.set('en');
    closeModal = vi.fn();
    onSave = vi.fn();
  });

  it('renders modal with default values when no transaction is passed', async () => {
    render(TransactionActions, {
      props: { closeModal, onSave }
    });

    expect(screen.getByText('Add New Transaction')).toBeInTheDocument();
    expect(screen.getByLabelText('Sender Whatsapp')).toHaveValue('');
    expect(screen.getByLabelText('Receiver Whatsapp')).toHaveValue('');
    expect(screen.getByLabelText('Amount Sent')).toHaveValue('');
    expect(screen.getByLabelText('Exchange')).toHaveValue('');
    expect(screen.getByLabelText('Amount Received')).toHaveValue('');
    expect(screen.getByLabelText('Status')).toHaveValue('Pending');
    expect(screen.getByLabelText('Method')).toHaveValue('');
    expect(screen.getByLabelText('Date')).toHaveValue(new Date().toISOString().split('T')[0]);
  });

  it('renders modal with transaction data when transaction prop is passed', async () => {
    const transaction = {
      transaction_id: '1',
      sender_whatsapp: '+123456789',
      receiver_whatsapp: '+987654321',
      amount_sent: 1000,
      exchange_rate: 19.5,
      amount_received: 19500,
      status: 'Completed',
      payment_method: 'Bank Transfer',
      date: '2025-03-01',
    };

    render(TransactionActions, {
      props: { transaction, closeModal, onSave }
    });

    expect(screen.getByText('Edit Transaction')).toBeInTheDocument();
    expect(screen.getByLabelText('Sender Whatsapp')).toHaveValue(transaction.sender_whatsapp);
    expect(screen.getByLabelText('Receiver Whatsapp')).toHaveValue(transaction.receiver_whatsapp);
    expect(screen.getByLabelText('Amount Sent')).toHaveValue(transaction.amount_sent);
    expect(screen.getByLabelText('Exchange')).toHaveValue(transaction.exchange_rate);
    expect(screen.getByLabelText('Amount Received')).toHaveValue(transaction.amount_received);
    expect(screen.getByLabelText('Status')).toHaveValue(transaction.status);
    expect(screen.getByLabelText('Method')).toHaveValue(transaction.payment_method);
    expect(screen.getByLabelText('Date')).toHaveValue(transaction.date);
  });

  it('calls onSave with correct data when saving a new transaction', async () => {
    const transactionData = {
      transaction_id: '',
      sender_whatsapp: '+123456789',
      receiver_whatsapp: '+987654321',
      amount_sent: 1000,
      exchange_rate: 19.5,
      amount_received: 19500,
      status: 'Completed',
      payment_method: 'Bank Transfer',
      date: '2025-03-01',
    };

    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(transactionData),
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers(),
      redirected: false,
      type: 'default',
      url: 'https://67c661b6351c081993fd057f.mockapi.io/api/mockTransaction/transactions',
    });

    render(TransactionActions, { props: { closeModal, onSave } });

    const saveButton = screen.getByText('Add Transaction');
    await fireEvent.click(saveButton);

    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(
      'https://67c661b6351c081993fd057f.mockapi.io/api/mockTransaction/transactions',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(transactionData),
      })
    ));

    await waitFor(() => expect(onSave).toHaveBeenCalledWith(transactionData));
    expect(closeModal).toHaveBeenCalled();
  });

  it('calls onSave with correct data when saving an edited transaction', async () => {
    const transaction = {
      transaction_id: '1',
      sender_whatsapp: '+123456789',
      receiver_whatsapp: '+987654321',
      amount_sent: 1000,
      exchange_rate: 19.5,
      amount_received: 19500,
      status: 'Completed',
      payment_method: 'Bank Transfer',
      date: '2025-03-01',
    };

    global.fetch = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(transaction),
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers(),
      redirected: false,
      type: 'default',
      url: `https://67c661b6351c081993fd057f.mockapi.io/api/mockTransaction/transactions/${transaction.transaction_id}`,
    });

    render(TransactionActions, { props: { transaction, closeModal, onSave } });

    const saveButton = screen.getByText('Save');
    await fireEvent.click(saveButton);

    await waitFor(() => expect(global.fetch).toHaveBeenCalledWith(
      `https://67c661b6351c081993fd057f.mockapi.io/api/mockTransaction/transactions/${transaction.transaction_id}`,
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify(transaction),
      })
    ));

    await waitFor(() => expect(onSave).toHaveBeenCalledWith(transaction));
    expect(closeModal).toHaveBeenCalled();
  });

  it('calls closeModal when cancel button is clicked', async () => {
    render(TransactionActions, { props: { closeModal, onSave } });

    const cancelButton = screen.getByText('Cancel');
    await fireEvent.click(cancelButton);

    expect(closeModal).toHaveBeenCalled();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });
});
