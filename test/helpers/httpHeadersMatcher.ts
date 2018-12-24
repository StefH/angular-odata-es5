import { HttpHeaders } from '@angular/common/http';
import { assert } from 'chai';
import { IAsymmetricMatcher } from './jasmineAsymmetricMatcher';

export class HttpHeadersMatcher implements IAsymmetricMatcher {

    constructor(private check: { [name: string]: string }) {
    }

    public asymmetricMatch(options: any): boolean {
        const headers: HttpHeaders = options.headers;

        assert.equal(options.observe, 'response');

        Object.keys(this.check)
            .forEach((key: string) => {
                assert.equal(headers.get(key), this.check[key], `The header '${key}' does not have the correct value`);
            });

        return true;
    }

    public jasmineToString(): string {
        return `<HeaderMatching: ${JSON.stringify(this.check)}>`;
    }
}
