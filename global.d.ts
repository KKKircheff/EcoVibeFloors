import en from './messages/en.json';

type Messages = typeof en;

declare global {
    // Use type safe message keys with `next-intl`
    interface IntlMessages extends Messages {}

    type NestedKeys<T> = {
        [K in keyof T]: K extends string ? (T[K] extends object ? `${K}.${NestedKeys<T[K]>}` | K : K) : never;
    }[keyof T];

    type TranslationKey = NestedKeys<IntlMessages>;
}
