import * as S from 'string';
import { Injectable } from '@angular/core';
import { RequestOptions, Headers, Response } from '@angular/http';
import { ODataPagedResult } from './angularODataPagedResult';

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
    private readonly _postHeaders = new Headers({ 'Content-Type': 'application/json; charset=utf-8' });

    private _baseUrl: string = 'http://localhost/odata';

    public keys: KeyConfigs = new KeyConfigs();
    public defaultRequestOptions: RequestOptions = new RequestOptions({ body: '' });
    public postRequestOptions: RequestOptions = new RequestOptions({ headers: this._postHeaders });

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
        // check if entityKey is a GUID (UUID) type
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(entityKey)) {
            return this.getEntitiesUri(typeName) + '(' + entityKey + ')';
        }

        // check if entityKey is not a number
        if (!/^[0-9]*$/.test(entityKey)) {
            return this.getEntitiesUri(typeName) + '(\'' + entityKey + '\')';
        }

        return this.getEntitiesUri(typeName) + '(' + entityKey + ')';
    }

    public handleError(err: any, caught: any): void {
        console.warn('OData error: ', err, caught);
    }

    public extractQueryResultData<T>(res: Response): T[] {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }

        const body = res.json();
        const entities: T[] = body.value;
        return entities;
    }

    public extractQueryResultDataWithCount<T>(res: Response): ODataPagedResult<T> {
        const pagedResult = new ODataPagedResult<T>();

        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }

        const body = res.json();
        const entities: T[] = body.value;

        pagedResult.data = entities;

        try {
            const count = parseInt(body['@odata.count'], 10) || entities.length;
            pagedResult.count = count;
        } catch (error) {
            console.warn('Cannot determine OData entities count. Falling back to collection length...');
            pagedResult.count = entities.length;
        }

        return pagedResult;
    }

    private sanitizeTypeName(typeName: string): string {
        return S(typeName).stripLeft('/').stripRight('/').s;
    }
}
