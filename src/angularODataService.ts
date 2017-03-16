import { URLSearchParams, Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable, Operator } from 'rxjs/Rx';
import { ODataConfiguration } from './angularODataConfiguration';
import { ODataQuery } from './angularODataQuery';
import { GetOperation } from './angularODataOperation';

export class ODataService<T> {

    constructor(private _typeName: string, private http: Http, private config: ODataConfiguration) { }

    public get TypeName(){
        return this._typeName;
    }

    public Get(key: string): GetOperation<T> {
        return new GetOperation<T>(this._typeName, this.config, this.http, key);
    }

    public Post(entity: T): Observable<T> {
        const body = JSON.stringify(entity);
        return this.handleResponse(this.http.post(this.config.baseUrl + '/' + this.TypeName, body, this.config.postRequestOptions));
    }

    public CustomAction(key: string, actionName: string, postdata: any): Observable<any> {
        const body = JSON.stringify(postdata);
        return this.http.post(this.getEntityUri(key) + '/' + actionName, body, this.config.requestOptions).map(resp => resp.json());
    }

    public CustomFunction(key: string, actionName: string): Observable<any> {
        return this.http.get(this.getEntityUri(key) + '/' + actionName, this.config.requestOptions).map(resp => resp.json());
    }

    public Patch(entity: any, key: string): Observable<Response> {
        const body = JSON.stringify(entity);
        return this.http.patch(this.getEntityUri(key), body, this.config.postRequestOptions);
    }

    public Put(entity: T,  key: string): Observable<T> {
        const body = JSON.stringify(entity);
        return this.handleResponse(this.http.put(this.getEntityUri(key), body, this.config.postRequestOptions));
    }

    public Delete(key: string): Observable<Response> {
        return this.http.delete(this.getEntityUri(key), this.config.requestOptions);
    }

    public Query(): ODataQuery<T> {
        return new ODataQuery<T>(this.TypeName, this.config, this.http);
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
