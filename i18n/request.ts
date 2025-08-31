import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  // `requestLocale` is the locale detected from the middleware - need to await it
  let locale = await requestLocale;
  
  // Ensure that the incoming `locale` parameter is valid
  if (!locale || !routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = (await import(`../messages/${locale}.json`)).default;
  return { 
    locale,
    messages 
  };
});