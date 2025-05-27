import {defineRouting} from 'next-intl/routing';
 
export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'mk', 'sq'],
 
  // Used when no locale matches
  defaultLocale: 'mk',
  localeDetection: false, // ❌ disables browser-based redirection
});