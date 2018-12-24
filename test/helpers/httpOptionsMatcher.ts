import { HttpParams } from '@angular/common/http';
import { assert } from 'chai';
import { HttpHeadersMatcher } from './httpHeadersMatcher';
import { IAsymmetricMatcher } from './jasmineAsymmetricMatcher';

export class HttpOptionsMatcher implements IAsymmetricMatcher {

    constructor(private params: HttpParams, private headerMatcher?: HttpHeadersMatcher) {
    }

    public asymmetricMatch(options: any): boolean {
        assert.equal(options.observe, 'response');
        assert.deepEqual(this.params, options.params);

        if (this.headerMatcher) {
            return this.headerMatcher.asymmetricMatch(options);
        }

        return true;
    }

    public jasmineToString(): string {
        return `<HttpOptionsMatcher>`;
    }
}
