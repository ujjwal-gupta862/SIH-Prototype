import en from './en';
import hi from './hi';
import mr from './mr';
import type { TranslationKeys } from './en';

export type Language = 'en' | 'hi' | 'mr';

const translations: Record<Language, TranslationKeys> = { en, hi, mr };

export function t(lang: Language, path: string): string {
  const keys = path.split('.');
  let result: unknown = translations[lang];
  for (const key of keys) {
    if (result && typeof result === 'object' && key in (result as Record<string, unknown>)) {
      result = (result as Record<string, unknown>)[key];
    } else {
      // Fallback to English
      result = translations.en;
      for (const k of keys) {
        if (result && typeof result === 'object' && k in (result as Record<string, unknown>)) {
          result = (result as Record<string, unknown>)[k];
        } else {
          return path; // Return the path as fallback
        }
      }
      break;
    }
  }
  return typeof result === 'string' ? result : path;
}

export { en, hi, mr };
export type { TranslationKeys };
