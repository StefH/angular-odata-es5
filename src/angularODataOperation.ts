import { URLSearchParams, Http, Response, RequestOptions } from '@angular/http';
import { Observable, Operator } from 'rxjs/Rx';

import { ODataConfiguration } from './angularODataConfiguration';

export abstract class ODataOperation<T> {
    private _expand: string;
    private _select: string;

    constructor(protected typeName: string, protected config: ODataConfiguration, protected http: Http) {
    }

    public Expand(expand: string | string[]) {
        this._expand = this.parseStringOrStringArray(expand);
        return this;
    }

    public Select(select: string | string[]) {
        this._select = this.parseStringOrStringArray(select);
        return this;
    }

    protected getParams(): URLSearchParams {
        const params = new URLSearchParams();

        if (this._select && this._select.length > 0) {
            params.set(this.config.keys.select, this._select);
        }

        if (this._expand && this._expand.length > 0) {
            params.set(this.config.keys.expand, this._expand);
        }

        return params;
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

    protected getRequestOptions(): RequestOptions {
        const options = this.config.defaultRequestOptions;
        options.search = this.getParams();
        return options;
    }

    protected abstract Exec(...args): Observable<any>;

    protected parseStringOrStringArray(input: string | string[]): string {
        if (input instanceof Array) {
            return input.join(',');
        }

        return input as string;
    }

    private extractData(res: Response): T {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }

        const body: any = res.json();
        const entity: T = body;
        return entity || null;
    }
}

export abstract class OperationWithKey<T> extends ODataOperation<T> {
    constructor(protected _typeName: string,
        protected config: ODataConfiguration,
        protected http: Http,
        protected entityKey: string) {
        super(_typeName, config, http);
    }
    protected abstract Exec(...args): Observable<any>;
}

export abstract class OperationWithEntity<T> extends ODataOperation<T> {
    constructor(protected _typeName: string,
        protected config: ODataConfiguration,
        protected http: Http,
        protected entity: T) {
        super(_typeName, config, http);
    }
    protected abstract Exec(...args): Observable<any>;
}

export abstract class OperationWithKeyAndEntity<T> extends ODataOperation<T> {
    constructor(protected _typeName: string,
        protected config: ODataConfiguration,
        protected http: Http,
        protected entityKey: string,
        protected entity: T) {
        super(_typeName, config, http);
    }
    protected abstract Exec(...args): Observable<any>;
}

export class GetOperation<T> extends OperationWithKey<T> {
    public Exec(): Observable<T> {
        return super.handleResponse(this.http.get(this.config.getEntityUri(this.entityKey, this.typeName), this.getRequestOptions()));
    }
}

// export class PostOperation<T> extends OperationWithEntity<T>{
//     public Exec():Observable<T>{    //ToDo: Check ODataV4
//         let body = JSON.stringify(this.entity);
//         return this.handleResponse(this.http.post(this.config.baseUrl + "/"+this._typeName, body, this.getRequestOptions()));
//     }
// }

// export class PatchOperation<T> extends OperationWithKeyAndEntity<T>{
//     public Exec():Observable<Response>{    //ToDo: Check ODataV4
//         let body = JSON.stringify(this.entity);
//         return this.http.patch(this.getEntityUri(this.key),body,this.getRequestOptions());
//     }
// }

// export class PutOperation<T> extends OperationWithKeyAndEntity<T>{
//     public Exec(){
//         let body = JSON.stringify(this.entity);
//         return this.handleResponse(this.http.put(this.getEntityUri(this.key),body,this.getRequestOptions()));
//     }
// }
