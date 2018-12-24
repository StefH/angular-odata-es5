import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpClient, HttpResponse } from '@angular/common/http';

import { ODataConfiguration } from './angularODataConfiguration';
import { DeleteOperation, GetOperation, PatchOperation, PostOperation, PutOperation } from './angularODataOperation';
import { ODataQuery } from './angularODataQuery';
import { ODataUtils } from './angularODataUtils';

export class ODataService<T> {
    private _entitiesUri: string;

    constructor(private _typeName: string, private _http: HttpClient, private config: ODataConfiguration) {
        this._entitiesUri = config.getEntitiesUri(_typeName);
    }

    public get TypeName(): string {
        return this._typeName;
    }

    public Get(key: any): GetOperation<T> {
        return new GetOperation<T>(this._typeName, this.config, this._http, key);
    }

    public Post<T>(entity: T): PostOperation<T> {
        return new PostOperation<T>(this._typeName, this.config, this._http, entity);
    }

    public Patch<T>(entity: T, key: any): PatchOperation<T> {
        return new PatchOperation<T>(this._typeName, this.config, this._http, key, entity);
    }

    public Put<T>(entity: T, key: any): PutOperation<T> {
        return new PutOperation<T>(this._typeName, this.config, this._http, key, entity);
    }

    public Delete(key: any): DeleteOperation<T> {
        return new DeleteOperation<T>(this._typeName, this.config, this._http, key);
    }

    public CustomAction(key: any, actionName: string, postdata: any): Observable<any> {
        const body = postdata ? JSON.stringify(postdata) : null;
        return this._http.post(`${this.getEntityUri(key)}/${actionName}`, body, this.config.customRequestOptions).pipe(map(resp => resp));
    }

    public CustomCollectionAction(actionName: string, postdata: any): Observable<any> {
        const body = postdata ? JSON.stringify(postdata) : null;
        return this._http.post(`${this._entitiesUri}/${actionName}`, body, this.config.customRequestOptions).pipe(map(resp => resp));
    }

    public CustomFunction(key: any, functionName: string, parameters?: any): Observable<any> {
        if (parameters) {
            const params: string = ODataUtils.convertObjectToString(parameters);
            functionName = `${functionName}(${params})`;
        } else if (!functionName.endsWith(')') && !functionName.endsWith('()')) {
            functionName = `${functionName}()`;
        }
        return this._http.get(`${this.getEntityUri(key)}/${functionName}`, this.config.defaultRequestOptions).pipe(map(resp => resp));
    }

    public CustomCollectionFunction(functionName: string, parameters?: any): Observable<any> {
        if (parameters) {
            const params: string = ODataUtils.convertObjectToString(parameters);
            functionName = `${functionName}(${params})`;
        } else if (!functionName.endsWith(')') && !functionName.endsWith('()')) {
            functionName = `${functionName}()`;
        }
        return this._http.get(`${this._entitiesUri}/${functionName}`, this.config.defaultRequestOptions).pipe(map(resp => resp));
    }

    public Query(): ODataQuery<T> {
        return new ODataQuery<T>(this.TypeName, this.config, this._http);
    }

    protected getEntityUri(key: any): string {
        return this.config.getEntityUri(key, this._typeName);
    }

    protected handleResponse<TResponse>(entity: Observable<HttpResponse<TResponse>>): Observable<TResponse> {
        return entity
            .pipe(
                map(this.extractData),
                catchError((err: any, caught: Observable<TResponse>) => {
                    if (this.config.handleError) {
                        this.config.handleError(err, caught);
                    }
                    return throwError(err);
                })
            );
    }

    private extractData<TResponse>(res: HttpResponse<TResponse>): TResponse {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        const body: any = res.body;
        return body || {};
    }
}
