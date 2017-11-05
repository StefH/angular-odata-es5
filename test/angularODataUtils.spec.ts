import { assert } from 'chai';
import { ODataUtils } from '../src/angularODataUtils';

describe('ODataUtils', () => {

    it('quoteValue string', () => {
        // Act
        const value: string = ODataUtils.quoteValue('test');

        // Assert
        assert.equal(value, `'test'`);
    });

    it('quoteValue integer', () => {
        // Act
        const value: string = ODataUtils.quoteValue('10');

        // Assert
        assert.equal(value, '10');
    });

    it('quoteValue double', () => {
        // Act
        const value: string = ODataUtils.quoteValue('-10.01');

        // Assert
        assert.equal(value, '-10.01');
    });

    it('quoteValue GUID', () => {
        // Act
        const value: string = ODataUtils.quoteValue('eefea99a-c988-44b8-ac37-b326a489c1e3');

        // Assert
        assert.equal(value, 'eefea99a-c988-44b8-ac37-b326a489c1e3');
    });

    it('convertObjectToString', () => {
        // Act
        const value: string = ODataUtils.convertObjectToString(
          { str: 'abc', int: 10, double: -10.01, guid: 'eefea99a-c988-44b8-ac37-b326a489c1e3', omitted: undefined });

        // Assert
        assert.equal(value, `str='abc', int=10, double=-10.01, guid=eefea99a-c988-44b8-ac37-b326a489c1e3`);
    });

});
