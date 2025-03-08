import { render, screen, fireEvent } from '@testing-library/svelte';
import { vi, describe, it, beforeAll, expect } from 'vitest';
import TransactionDetail from '../components/TransactionDetail/TransactionDetail.svelte';
import { locale } from 'svelte-i18n';

// Mocking Svelte's onMount function to avoid it being called during tests
vi.mock('svelte', () => ({
  ...vi.importActual('svelte'),
  onMount: vi.fn(),
}));

// Test suite for the 'TransactionDetail' component
describe('TransactionDetail', () => {
  const transaction = {
    transaction_id: "1",
    sender_whatsapp: "+123456789",
    receiver_whatsapp: "+987654321",
    amount_sent: 1000,
    amount_received: 980,
    exchange_rate: 1.02,
    status: "Completed",
    payment_method: "Credit Card",
  };

  const closeModal = vi.fn(); 

  beforeAll(() => {
    locale.set('en'); 
  });

  // Test to check if the transaction details are displayed correctly
  it('displays transaction details correctly', () => {
    render(TransactionDetail, { 
      props: {
        transaction, 
        closeModal, 
      },
    });

    expect(screen.getByText('ID: 1')).toBeInTheDocument();
    expect(screen.getByText('Sender: +123456789')).toBeInTheDocument();
    expect(screen.getByText('Receiver: +987654321')).toBeInTheDocument();
    expect(screen.getByText('Amount Sent: $1000')).toBeInTheDocument();
    expect(screen.getByText('Amount Received: 980')).toBeInTheDocument();
    expect(screen.getByText('Exchange: 1.02')).toBeInTheDocument();
    expect(screen.getByText('Status: Completed')).toBeInTheDocument();
    expect(screen.getByText('Method: Credit Card')).toBeInTheDocument();
  });

  // Test to check if the modal closes when the close button is clicked
  it('closes the modal when the close button is clicked', async () => {
    render(TransactionDetail, {
      props: {
        transaction, 
        closeModal, 
      },
    });

    const closeButton = screen.getByText('Close'); 
    await fireEvent.click(closeButton); 

    expect(closeModal).toHaveBeenCalledTimes(1);
  });
});
