import * as S from 'string';
import { URLSearchParams, Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable, Operator } from 'rxjs/Rx';
import { ODataConfiguration } from './angularODataConfiguration';
import { ODataQuery } from './angularODataQuery';
import { GetOperation } from './angularODataOperation';
import { ODataUtils } from './angularODataUtils';

export class ODataService<T> {
    private _entitiesUri: string;

    constructor(private _typeName: string, private _http: Http, private config: ODataConfiguration) {
        this._entitiesUri = config.getEntitiesUri(_typeName);
    }

    public get TypeName(): string {
        return this._typeName;
    }

    public Get(key: string): GetOperation<T> {
        return new GetOperation<T>(this._typeName, this.config, this._http, key);
    }

    public Post(entity: T): Observable<T> {
        const body = JSON.stringify(entity);
        return this.handleResponse(this._http.post(this._entitiesUri, body, this.config.postRequestOptions));
    }

    public CustomAction(key: string, actionName: string, postdata: any): Observable<any> {
        const body = JSON.stringify(postdata);
        return this._http.post(this.getEntityUri(key) + '/' + actionName, body, this.config.defaultRequestOptions).map(resp => resp.json());
    }

    public CustomFunction(functionName: string, parameters?: any): Observable<any> {
        if (parameters) {
            const params: string = ODataUtils.convertObjectToString(parameters);
            functionName = `${functionName}(${params})`;
        } else if (!functionName.endsWith(')') && !functionName.endsWith('()')) {
            functionName = `${functionName}()`;
        }

        return this._http.get(`${this._entitiesUri}/${functionName}`, this.config.defaultRequestOptions).map(resp => resp.json());
    }

    public Patch(entity: any, key: string): Observable<Response> {
        const body = JSON.stringify(entity);
        return this._http.patch(this.getEntityUri(key), body, this.config.postRequestOptions);
    }

    public Put(entity: T, key: string): Observable<T> {
        const body = JSON.stringify(entity);
        return this.handleResponse(this._http.put(this.getEntityUri(key), body, this.config.postRequestOptions));
    }

    public Delete(key: string): Observable<Response> {
        return this._http.delete(this.getEntityUri(key), this.config.defaultRequestOptions);
    }

    public Query(): ODataQuery<T> {
        return new ODataQuery<T>(this.TypeName, this.config, this._http);
    }

    protected getEntityUri(entityKey: string): string {
        return this.config.getEntityUri(entityKey, this._typeName);
    }

    protected handleResponse(entity: Observable<Response>): Observable<T> {
        return entity.map(this.extractData)
            .catch((err: any, caught: Observable<T>) => {
                if (this.config.handleError) {
                    this.config.handleError(err, caught);
                }
                return Observable.throw(err);
            });
    }

    private extractData(res: Response): T {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }

        const body: any = res.json();
        const entity: T = body;

        return entity || null;
    }

    private escapeKey() {

    }
}
