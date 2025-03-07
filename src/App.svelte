<script>
  import { locale } from 'svelte-i18n';
  import TransactionList from './components/TransactionList/TransactionList.svelte';
  import { t } from 'svelte-i18n';

  let localeReady = false;

  locale.subscribe(() => {
    localeReady = true;
  });
</script>

<main>
  <h1>{$t('dashboard')}</h1>
  
  {#if localeReady}
  <TransactionList />
  {/if}
</main>

<style>
  main {
    text-align: center;
    font-family: Arial, sans-serif;
  }
</style>
