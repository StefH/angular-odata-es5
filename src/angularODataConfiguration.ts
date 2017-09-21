import * as S from 'string';
import { Injectable } from '@angular/core';
import { ODataPagedResult } from './angularODataPagedResult';
import { ODataUtils } from './angularODataUtils';
import { HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

export class KeyConfigs {
    public filter: string = '$filter';
    public top: string = '$top';
    public skip: string = '$skip';
    public orderBy: string = '$orderby';
    public select: string = '$select';
    public expand: string = '$expand';
}

@Injectable()
export class ODataConfiguration {
    private readonly _postHeaders = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });

    private _baseUrl: string = 'http://localhost/odata';

    public keys: KeyConfigs = new KeyConfigs();
    public defaultRequestOptions: {
        headers?: HttpHeaders;
        observe: 'response';
        params?: HttpParams;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
    } = { observe: 'response'  };

    public postRequestOptions: {
        headers?: HttpHeaders;
        observe: 'response';
        params?: HttpParams;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
    } = { headers: this._postHeaders, observe: 'response' };

    set baseUrl(baseUrl: string) {
        this._baseUrl = S(baseUrl).stripRight('/').s;
    }

    get baseUrl(): string {
        return this._baseUrl;
    }

    public getEntitiesUri(typeName: string): string {
        return this.baseUrl + '/' + this.sanitizeTypeName(typeName);
    }

    public getEntityUri(entityKey: string, typeName: string): string {
        return this.getEntitiesUri(typeName) + `(${ODataUtils.quoteValue(entityKey)})`;
    }

    public handleError(err: any, caught: any): void {
        console.warn('OData error: ', err, caught);
    }

    public extractQueryResultData<T>(res: HttpResponse<T>): T[] {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }

        const body = res;
        const entities: T[] = body['value'];
        return entities;
    }

    public extractQueryResultDataWithCount<T>(res: HttpResponse<T>): ODataPagedResult<T> {
        const pagedResult = new ODataPagedResult<T>();

        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }

        const body = res;
        const entities: T[] = body['value'];

        pagedResult.data = entities;

        try {
            const count = parseInt(body['@odata.count'], 10) || entities.length;
            pagedResult.count = count;
        } catch (error) {
            console.warn('Cannot determine OData entities count. Falling back to collection length.');
            pagedResult.count = entities.length;
        }

        return pagedResult;
    }

    private sanitizeTypeName(typeName: string): string {
        return S(typeName).stripLeft('/').stripRight('/').s;
    }
}
