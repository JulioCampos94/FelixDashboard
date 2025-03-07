import { mount } from 'svelte';
import App from './App.svelte';
import { init, register, locale, waitLocale } from 'svelte-i18n';
import en from './i18n/en.json';
import es from './i18n/es.json';

register('en', () => Promise.resolve(en));
register('es', () => Promise.resolve(es));

const savedLocale = localStorage.getItem('user-locale') || 'en';

init({
  fallbackLocale: 'en',
  initialLocale: savedLocale,
});

waitLocale().then(() => {
  locale.set(savedLocale);
  mount(App, {
    target: document.getElementById('app'),
  });
});

locale.subscribe((newLocale) => {
  if (newLocale) {
    localStorage.setItem('user-locale', newLocale);
  }
});
