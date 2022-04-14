/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { APP_INITIALIZER, ApplicationInitStatus } from './application_init';
import { ApplicationRef } from './application_ref';
import { APP_ID_RANDOM_PROVIDER } from './application_tokens';
import { defaultIterableDiffers, defaultKeyValueDiffers, IterableDiffers, KeyValueDiffers } from './change_detection/change_detection';
import { Injector } from './di';
import { Inject, Optional, SkipSelf } from './di/metadata';
import { ErrorHandler } from './error_handler';
import { DEFAULT_LOCALE_ID, USD_CURRENCY_CODE } from './i18n/localization';
import { DEFAULT_CURRENCY_CODE, LOCALE_ID } from './i18n/tokens';
import { ivyEnabled } from './ivy_switch';
import { ComponentFactoryResolver } from './linker';
import { Compiler } from './linker/compiler';
import { NgModule } from './metadata';
import { SCHEDULER } from './render3/component_ref';
import { setLocaleId } from './render3/i18n/i18n_locale_id';
import { NgZone } from './zone';
export function _iterableDiffersFactory() {
    return defaultIterableDiffers;
}
export function _keyValueDiffersFactory() {
    return defaultKeyValueDiffers;
}
export function _localeFactory(locale) {
    locale = locale || getGlobalLocale();
    if (ivyEnabled) {
        setLocaleId(locale);
    }
    return locale;
}
/**
 * Work out the locale from the potential global properties.
 *
 * * Closure Compiler: use `goog.getLocale()`.
 * * Ivy enabled: use `$localize.locale`
 */
export function getGlobalLocale() {
    if (typeof ngI18nClosureMode !== 'undefined' && ngI18nClosureMode &&
        typeof goog !== 'undefined' && goog.getLocale() !== 'en') {
        // * The default `goog.getLocale()` value is `en`, while Angular used `en-US`.
        // * In order to preserve backwards compatibility, we use Angular default value over
        //   Closure Compiler's one.
        return goog.getLocale();
    }
    else {
        // KEEP `typeof $localize !== 'undefined' && $localize.locale` IN SYNC WITH THE LOCALIZE
        // COMPILE-TIME INLINER.
        //
        // * During compile time inlining of translations the expression will be replaced
        //   with a string literal that is the current locale. Other forms of this expression are not
        //   guaranteed to be replaced.
        //
        // * During runtime translation evaluation, the developer is required to set `$localize.locale`
        //   if required, or just to provide their own `LOCALE_ID` provider.
        return (ivyEnabled && typeof $localize !== 'undefined' && $localize.locale) ||
            DEFAULT_LOCALE_ID;
    }
}
const ɵ0 = USD_CURRENCY_CODE;
/**
 * A built-in [dependency injection token](guide/glossary#di-token)
 * that is used to configure the root injector for bootstrapping.
 */
export const APPLICATION_MODULE_PROVIDERS = [
    {
        provide: ApplicationRef,
        useClass: ApplicationRef,
        deps: [NgZone, Injector, ErrorHandler, ComponentFactoryResolver, ApplicationInitStatus]
    },
    { provide: SCHEDULER, deps: [NgZone], useFactory: zoneSchedulerFactory },
    {
        provide: ApplicationInitStatus,
        useClass: ApplicationInitStatus,
        deps: [[new Optional(), APP_INITIALIZER]]
    },
    { provide: Compiler, useClass: Compiler, deps: [] },
    APP_ID_RANDOM_PROVIDER,
    { provide: IterableDiffers, useFactory: _iterableDiffersFactory, deps: [] },
    { provide: KeyValueDiffers, useFactory: _keyValueDiffersFactory, deps: [] },
    {
        provide: LOCALE_ID,
        useFactory: _localeFactory,
        deps: [[new Inject(LOCALE_ID), new Optional(), new SkipSelf()]]
    },
    { provide: DEFAULT_CURRENCY_CODE, useValue: ɵ0 },
];
/**
 * Schedule work at next available slot.
 *
 * In Ivy this is just `requestAnimationFrame`. For compatibility reasons when bootstrapped
 * using `platformRef.bootstrap` we need to use `NgZone.onStable` as the scheduling mechanism.
 * This overrides the scheduling mechanism in Ivy to `NgZone.onStable`.
 *
 * @param ngZone NgZone to use for scheduling.
 */
export function zoneSchedulerFactory(ngZone) {
    let queue = [];
    ngZone.onStable.subscribe(() => {
        while (queue.length) {
            queue.pop()();
        }
    });
    return function (fn) {
        queue.push(fn);
    };
}
/**
 * Configures the root injector for an app with
 * providers of `@angular/core` dependencies that `ApplicationRef` needs
 * to bootstrap components.
 *
 * Re-exported by `BrowserModule`, which is included automatically in the root
 * `AppModule` when you create a new app with the CLI `new` command.
 *
 * @publicApi
 */
export class ApplicationModule {
    // Inject ApplicationRef to make it eager...
    constructor(appRef) { }
}
ApplicationModule.decorators = [
    { type: NgModule, args: [{ providers: APPLICATION_MODULE_PROVIDERS },] }
];
ApplicationModule.ctorParameters = () => [
    { type: ApplicationRef }
];
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwbGljYXRpb25fbW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvYXBwbGljYXRpb25fbW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILE9BQU8sRUFBQyxlQUFlLEVBQUUscUJBQXFCLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUMxRSxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDakQsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDNUQsT0FBTyxFQUFDLHNCQUFzQixFQUFFLHNCQUFzQixFQUFFLGVBQWUsRUFBRSxlQUFlLEVBQUMsTUFBTSxxQ0FBcUMsQ0FBQztBQUNySSxPQUFPLEVBQUMsUUFBUSxFQUFpQixNQUFNLE1BQU0sQ0FBQztBQUM5QyxPQUFPLEVBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDekQsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzdDLE9BQU8sRUFBQyxpQkFBaUIsRUFBRSxpQkFBaUIsRUFBQyxNQUFNLHFCQUFxQixDQUFDO0FBQ3pFLE9BQU8sRUFBQyxxQkFBcUIsRUFBRSxTQUFTLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDL0QsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUN4QyxPQUFPLEVBQUMsd0JBQXdCLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFDbEQsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQzNDLE9BQU8sRUFBQyxRQUFRLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDcEMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLHlCQUF5QixDQUFDO0FBQ2xELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSwrQkFBK0IsQ0FBQztB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QUFDLENBQUM7SUFDSCxPQUFPLFVBQVMsRUFBYztRQUM1QixLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ2pCLENBQUMsQ0FBQztBQUNKLENBQUM7QUFFRDs7Ozs7Ozs7O0dBU0c7QUFFSCxNQUFNLE9BQU8saUJBQWlCO0lBQzVCLDRDQUE0QztJQUM1QyxZQUFZLE1BQXNCLElBQUcsQ0FBQzs7O1lBSHZDLFFBQVEsU0FBQyxFQUFDLFNBQVMsRUFBRSw0QkFBNEIsRUFBQzs7O1lBekgzQyxjQUFjIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7QVBQX0lOSVRJQUxJWkVSLCBBcHBsaWNhdGlvbkluaXRTdGF0dXN9IGZyb20gJy4vYXBwbGljYXRpb25faW5pdCc7XG5pbXBvcnQge0FwcGxpY2F0aW9uUmVmfSBmcm9tICcuL2FwcGxpY2F0aW9uX3JlZic7XG5pbXBvcnQge0FQUF9JRF9SQU5ET01fUFJPVklERVJ9IGZyb20gJy4vYXBwbGljYXRpb25fdG9rZW5zJztcbmltcG9ydCB7ZGVmYXVsdEl0ZXJhYmxlRGlmZmVycywgZGVmYXVsdEtleVZhbHVlRGlmZmVycywgSXRlcmFibGVEaWZmZXJzLCBLZXlWYWx1ZURpZmZlcnN9IGZyb20gJy4vY2hhbmdlX2RldGVjdGlvbi9jaGFuZ2VfZGV0ZWN0aW9uJztcbmltcG9ydCB7SW5qZWN0b3IsIFN0YXRpY1Byb3ZpZGVyfSBmcm9tICcuL2RpJztcbmltcG9ydCB7SW5qZWN0LCBPcHRpb25hbCwgU2tpcFNlbGZ9IGZyb20gJy4vZGkvbWV0YWRhdGEnO1xuaW1wb3J0IHtFcnJvckhhbmRsZXJ9IGZyb20gJy4vZXJyb3JfaGFuZGxlcic7XG5pbXBvcnQge0RFRkFVTFRfTE9DQUxFX0lELCBVU0RfQ1VSUkVOQ1lfQ09ERX0gZnJvbSAnLi9pMThuL2xvY2FsaXphdGlvbic7XG5pbXBvcnQge0RFRkFVTFRfQ1VSUkVOQ1lfQ09ERSwgTE9DQUxFX0lEfSBmcm9tICcuL2kxOG4vdG9rZW5zJztcbmltcG9ydCB7aXZ5RW5hYmxlZH0gZnJvbSAnLi9pdnlfc3dpdGNoJztcbmltcG9ydCB7Q29tcG9uZW50RmFjdG9yeVJlc29sdmVyfSBmcm9tICcuL2xpbmtlcic7XG5pbXBvcnQge0NvbXBpbGVyfSBmcm9tICcuL2xpbmtlci9jb21waWxlcic7XG5pbXBvcnQge05nTW9kdWxlfSBmcm9tICcuL21ldGFkYXRhJztcbmltcG9ydCB7U0NIRURVTEVSfSBmcm9tICcuL3JlbmRlcjMvY29tcG9uZW50X3JlZic7XG5pbXBvcnQge3NldExvY2FsZUlkfSBmcm9tICcuL3JlbmRlcjMvaTE4bi9pMThuX2xvY2FsZV9pZCc7XG5pbXBvcnQge05nWm9uZX0gZnJvbSAnLi96b25lJztcblxuZGVjbGFyZSBjb25zdCAkbG9jYWxpemU6IHtsb2NhbGU/OiBzdHJpbmd9O1xuXG5leHBvcnQgZnVuY3Rpb24gX2l0ZXJhYmxlRGlmZmVyc0ZhY3RvcnkoKSB7XG4gIHJldHVybiBkZWZhdWx0SXRlcmFibGVEaWZmZXJzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gX2tleVZhbHVlRGlmZmVyc0ZhY3RvcnkoKSB7XG4gIHJldHVybiBkZWZhdWx0S2V5VmFsdWVEaWZmZXJzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gX2xvY2FsZUZhY3RvcnkobG9jYWxlPzogc3RyaW5nKTogc3RyaW5nIHtcbiAgbG9jYWxlID0gbG9jYWxlIHx8IGdldEdsb2JhbExvY2FsZSgpO1xuICBpZiAoaXZ5RW5hYmxlZCkge1xuICAgIHNldExvY2FsZUlkKGxvY2FsZSk7XG4gIH1cbiAgcmV0dXJuIGxvY2FsZTtcbn1cblxuLyoqXG4gKiBXb3JrIG91dCB0aGUgbG9jYWxlIGZyb20gdGhlIHBvdGVudGlhbCBnbG9iYWwgcHJvcGVydGllcy5cbiAqXG4gKiAqIENsb3N1cmUgQ29tcGlsZXI6IHVzZSBgZ29vZy5nZXRMb2NhbGUoKWAuXG4gKiAqIEl2eSBlbmFibGVkOiB1c2UgYCRsb2NhbGl6ZS5sb2NhbGVgXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRHbG9iYWxMb2NhbGUoKTogc3RyaW5nIHtcbiAgaWYgKHR5cGVvZiBuZ0kxOG5DbG9zdXJlTW9kZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbmdJMThuQ2xvc3VyZU1vZGUgJiZcbiAgICAgIHR5cGVvZiBnb29nICE9PSAndW5kZWZpbmVkJyAmJiBnb29nLmdldExvY2FsZSgpICE9PSAnZW4nKSB7XG4gICAgLy8gKiBUaGUgZGVmYXVsdCBgZ29vZy5nZXRMb2NhbGUoKWAgdmFsdWUgaXMgYGVuYCwgd2hpbGUgQW5ndWxhciB1c2VkIGBlbi1VU2AuXG4gICAgLy8gKiBJbiBvcmRlciB0byBwcmVzZXJ2ZSBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eSwgd2UgdXNlIEFuZ3VsYXIgZGVmYXVsdCB2YWx1ZSBvdmVyXG4gICAgLy8gICBDbG9zdXJlIENvbXBpbGVyJ3Mgb25lLlxuICAgIHJldHVybiBnb29nLmdldExvY2FsZSgpO1xuICB9IGVsc2Uge1xuICAgIC8vIEtFRVAgYHR5cGVvZiAkbG9jYWxpemUgIT09ICd1bmRlZmluZWQnICYmICRsb2NhbGl6ZS5sb2NhbGVgIElOIFNZTkMgV0lUSCBUSEUgTE9DQUxJWkVcbiAgICAvLyBDT01QSUxFLVRJTUUgSU5MSU5FUi5cbiAgICAvL1xuICAgIC8vICogRHVyaW5nIGNvbXBpbGUgdGltZSBpbmxpbmluZyBvZiB0cmFuc2xhdGlvbnMgdGhlIGV4cHJlc3Npb24gd2lsbCBiZSByZXBsYWNlZFxuICAgIC8vICAgd2l0aCBhIHN0cmluZyBsaXRlcmFsIHRoYXQgaXMgdGhlIGN1cnJlbnQgbG9jYWxlLiBPdGhlciBmb3JtcyBvZiB0aGlzIGV4cHJlc3Npb24gYXJlIG5vdFxuICAgIC8vICAgZ3VhcmFudGVlZCB0byBiZSByZXBsYWNlZC5cbiAgICAvL1xuICAgIC8vICogRHVyaW5nIHJ1bnRpbWUgdHJhbnNsYXRpb24gZXZhbHVhdGlvbiwgdGhlIGRldmVsb3BlciBpcyByZXF1aXJlZCB0byBzZXQgYCRsb2NhbGl6ZS5sb2NhbGVgXG4gICAgLy8gICBpZiByZXF1aXJlZCwgb3IganVzdCB0byBwcm92aWRlIHRoZWlyIG93biBgTE9DQUxFX0lEYCBwcm92aWRlci5cbiAgICByZXR1cm4gKGl2eUVuYWJsZWQgJiYgdHlwZW9mICRsb2NhbGl6ZSAhPT0gJ3VuZGVmaW5lZCcgJiYgJGxvY2FsaXplLmxvY2FsZSkgfHxcbiAgICAgICAgREVGQVVMVF9MT0NBTEVfSUQ7XG4gIH1cbn1cblxuLyoqXG4gKiBBIGJ1aWx0LWluIFtkZXBlbmRlbmN5IGluamVjdGlvbiB0b2tlbl0oZ3VpZGUvZ2xvc3NhcnkjZGktdG9rZW4pXG4gKiB0aGF0IGlzIHVzZWQgdG8gY29uZmlndXJlIHRoZSByb290IGluamVjdG9yIGZvciBib290c3RyYXBwaW5nLlxuICovXG5leHBvcnQgY29uc3QgQVBQTElDQVRJT05fTU9EVUxFX1BST1ZJREVSUzogU3RhdGljUHJvdmlkZXJbXSA9IFtcbiAge1xuICAgIHByb3ZpZGU6IEFwcGxpY2F0aW9uUmVmLFxuICAgIHVzZUNsYXNzOiBBcHBsaWNhdGlvblJlZixcbiAgICBkZXBzOiBbTmdab25lLCBJbmplY3RvciwgRXJyb3JIYW5kbGVyLCBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsIEFwcGxpY2F0aW9uSW5pdFN0YXR1c11cbiAgfSxcbiAge3Byb3ZpZGU6IFNDSEVEVUxFUiwgZGVwczogW05nWm9uZV0sIHVzZUZhY3Rvcnk6IHpvbmVTY2hlZHVsZXJGYWN0b3J5fSxcbiAge1xuICAgIHByb3ZpZGU6IEFwcGxpY2F0aW9uSW5pdFN0YXR1cyxcbiAgICB1c2VDbGFzczogQXBwbGljYXRpb25Jbml0U3RhdHVzLFxuICAgIGRlcHM6IFtbbmV3IE9wdGlvbmFsKCksIEFQUF9JTklUSUFMSVpFUl1dXG4gIH0sXG4gIHtwcm92aWRlOiBDb21waWxlciwgdXNlQ2xhc3M6IENvbXBpbGVyLCBkZXBzOiBbXX0sXG4gIEFQUF9JRF9SQU5ET01fUFJPVklERVIsXG4gIHtwcm92aWRlOiBJdGVyYWJsZURpZmZlcnMsIHVzZUZhY3Rvcnk6IF9pdGVyYWJsZURpZmZlcnNGYWN0b3J5LCBkZXBzOiBbXX0sXG4gIHtwcm92aWRlOiBLZXlWYWx1ZURpZmZlcnMsIHVzZUZhY3Rvcnk6IF9rZXlWYWx1ZURpZmZlcnNGYWN0b3J5LCBkZXBzOiBbXX0sXG4gIHtcbiAgICBwcm92aWRlOiBMT0NBTEVfSUQsXG4gICAgdXNlRmFjdG9yeTogX2xvY2FsZUZhY3RvcnksXG4gICAgZGVwczogW1tuZXcgSW5qZWN0KExPQ0FMRV9JRCksIG5ldyBPcHRpb25hbCgpLCBuZXcgU2tpcFNlbGYoKV1dXG4gIH0sXG4gIHtwcm92aWRlOiBERUZBVUxUX0NVUlJFTkNZX0NPREUsIHVzZVZhbHVlOiBVU0RfQ1VSUkVOQ1lfQ09ERX0sXG5dO1xuXG4vKipcbiAqIFNjaGVkdWxlIHdvcmsgYXQgbmV4dCBhdmFpbGFibGUgc2xvdC5cbiAqXG4gKiBJbiBJdnkgdGhpcyBpcyBqdXN0IGByZXF1ZXN0QW5pbWF0aW9uRnJhbWVgLiBGb3IgY29tcGF0aWJpbGl0eSByZWFzb25zIHdoZW4gYm9vdHN0cmFwcGVkXG4gKiB1c2luZyBgcGxhdGZvcm1SZWYuYm9vdHN0cmFwYCB3ZSBuZWVkIHRvIHVzZSBgTmdab25lLm9uU3RhYmxlYCBhcyB0aGUgc2NoZWR1bGluZyBtZWNoYW5pc20uXG4gKiBUaGlzIG92ZXJyaWRlcyB0aGUgc2NoZWR1bGluZyBtZWNoYW5pc20gaW4gSXZ5IHRvIGBOZ1pvbmUub25TdGFibGVgLlxuICpcbiAqIEBwYXJhbSBuZ1pvbmUgTmdab25lIHRvIHVzZSBmb3Igc2NoZWR1bGluZy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHpvbmVTY2hlZHVsZXJGYWN0b3J5KG5nWm9uZTogTmdab25lKTogKGZuOiAoKSA9PiB2b2lkKSA9PiB2b2lkIHtcbiAgbGV0IHF1ZXVlOiAoKCkgPT4gdm9pZClbXSA9IFtdO1xuICBuZ1pvbmUub25TdGFibGUuc3Vic2NyaWJlKCgpID0+IHtcbiAgICB3aGlsZSAocXVldWUubGVuZ3RoKSB7XG4gICAgICBxdWV1ZS5wb3AoKSEoKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZnVuY3Rpb24oZm46ICgpID0+IHZvaWQpIHtcbiAgICBxdWV1ZS5wdXNoKGZuKTtcbiAgfTtcbn1cblxuLyoqXG4gKiBDb25maWd1cmVzIHRoZSByb290IGluamVjdG9yIGZvciBhbiBhcHAgd2l0aFxuICogcHJvdmlkZXJzIG9mIGBAYW5ndWxhci9jb3JlYCBkZXBlbmRlbmNpZXMgdGhhdCBgQXBwbGljYXRpb25SZWZgIG5lZWRzXG4gKiB0byBib290c3RyYXAgY29tcG9uZW50cy5cbiAqXG4gKiBSZS1leHBvcnRlZCBieSBgQnJvd3Nlck1vZHVsZWAsIHdoaWNoIGlzIGluY2x1ZGVkIGF1dG9tYXRpY2FsbHkgaW4gdGhlIHJvb3RcbiAqIGBBcHBNb2R1bGVgIHdoZW4geW91IGNyZWF0ZSBhIG5ldyBhcHAgd2l0aCB0aGUgQ0xJIGBuZXdgIGNvbW1hbmQuXG4gKlxuICogQHB1YmxpY0FwaVxuICovXG5ATmdNb2R1bGUoe3Byb3ZpZGVyczogQVBQTElDQVRJT05fTU9EVUxFX1BST1ZJREVSU30pXG5leHBvcnQgY2xhc3MgQXBwbGljYXRpb25Nb2R1bGUge1xuICAvLyBJbmplY3QgQXBwbGljYXRpb25SZWYgdG8gbWFrZSBpdCBlYWdlci4uLlxuICBjb25zdHJ1Y3RvcihhcHBSZWY6IEFwcGxpY2F0aW9uUmVmKSB7fVxufVxuIl19