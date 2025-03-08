import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import { vi, describe, it, beforeAll, expect, afterAll } from 'vitest';
import TransactionList from '../components/TransactionList/TransactionList.svelte';
import { locale } from 'svelte-i18n';

// Mocking Svelte's onMount function to avoid it being called during tests
vi.mock('svelte', () => ({
  ...vi.importActual('svelte'),
  onMount: vi.fn(),
}));

// Test suite for the 'TransactionList' component
describe('TransactionList', () => {
  let fetchMock;

  beforeAll(() => {
    locale.set('en');
    // Mock the global fetch function to simulate a successful API response
    fetchMock = vi.spyOn(global, 'fetch').mockResolvedValue({
      json: vi.fn().mockResolvedValue([
        {
          transaction_id: '1',
          sender_whatsapp: '+123456789',
          receiver_whatsapp: '+987654321',
          status: 'Completed',
          date: '2025-03-01T12:00:00Z',
        },
        {
          transaction_id: '2',
          sender_whatsapp: '+198765432',
          receiver_whatsapp: '+123456789',
          status: 'Pending',
          date: '2025-03-02T12:00:00Z',
        },
      ]),
      ok: true,
      status: 200,
      statusText: 'OK',
      headers: new Headers(),
      redirected: false,
      type: 'default',
      url: 'https://67c661b6351c081993fd057f.mockapi.io/api/mockTransaction/transactions',
      clone: vi.fn().mockReturnThis(),
      body: null,
      bodyUsed: false,
      arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(0)),
      text: vi.fn().mockResolvedValue(''),
      blob: vi.fn().mockResolvedValue(new Blob([])),
      formData: vi.fn().mockResolvedValue(new FormData()),
    });
  });

  // Restore mocked functions after all tests
  afterAll(() => {
    vi.restoreAllMocks(); 
  });

  // Test to check if transactions are fetched and displayed correctly
  it('fetches and displays transactions correctly', async () => {
    render(TransactionList); 
    await waitFor(() => screen.getByText('1')); 
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('+123456789')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  // Test to check if the transactions are filtered by the search query
  it('filters transactions by search query', async () => {
    render(TransactionList);
    await waitFor(() => screen.getByText('1')); 
    const searchInput = screen.getByLabelText('Whatsapp');
    await fireEvent.input(searchInput, { target: { value: '+123456789' } }); 
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.queryByText('2')).not.toBeInTheDocument();
  });

  // Test to check if the language changes to Spanish
  it('changes language to Spanish', async () => {
    render(TransactionList);
    const spanishButton = screen.getByText('Spanish'); 
    await fireEvent.click(spanishButton);
    expect(locale).toHaveProperty('current', 'es');
  });

  // Test to check if pagination works correctly for navigating through transactions
  it('navigates through paginated transactions', async () => {
    render(TransactionList); 
    await waitFor(() => screen.getByText('1')); 
    const nextButton = screen.getByText('Next');
    await fireEvent.click(nextButton);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  // Test to check if a transaction can be deleted
  it('deletes a transaction', async () => {
    render(TransactionList); 
    await waitFor(() => screen.getByText('1')); 
    const deleteButton = screen.getByText('Delete');
    await fireEvent.click(deleteButton);
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/transactions/1'), 
      expect.objectContaining({ method: 'DELETE' })
    ));
    expect(screen.queryByText('1')).not.toBeInTheDocument();
  });
});
