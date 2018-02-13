import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Dictionary, IEnumerable, IQueryable, List } from 'linq-collections';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { Observable } from 'rxjs/Observable';
import { ODataConfiguration } from './angularODataConfiguration';

export abstract class ODataOperation<T> {
    private _expand: string[] = [];
    private _select: string[] = [];

    constructor(protected typeName: string, protected config: ODataConfiguration, protected http: HttpClient) {
    }

    public Expand(expand: string | string[]) {
        if (expand) {
            this._expand = this.toStringArray(expand);
        }
        return this;
    }

    public Select(select: string | string[]) {
        if (select) {
            this._select = this.toStringArray(select);
        }
        return this;
    }

    protected getParams(): HttpParams {
        const expandData = new Dictionary<string, List<string>>();
        const normalSelects = new List<string>();

        this._expand.forEach((name) => expandData.set(name, new List<string>()));

        this._select.forEach((select: string) => {
            const items: string[] = select.split('/');

            // Expand contains string like: `Boss/Name`
            if (items.length > 1) {
                const expandName = items[0];
                const propertyName = items[1];

                if (!expandData.containsKey(expandName)) {
                    expandData.set(expandName, new List<string>());
                }

                expandData.get(expandName).push(propertyName);
            }
            else {
                // Expand is just a simple string like: `Boss`
                normalSelects.push(select);
            }
        });

        let params = new HttpParams();

        const expands = expandData.distinct().select((element) => {
            if (element.value.any()) {
                return `${element.key}(${this.config.keys.select}=${this.toCommaString(element.value)})`;
            }

            return element.key;
        });

        if (expands.any()) {
            params = params.append(this.config.keys.expand, this.toCommaString(expands));
        }

        if (normalSelects.any()) {
            params = params.append(this.config.keys.select, this.toCommaString(normalSelects));
        }

        return params;
    }

    protected handleResponse(entity: Observable<HttpResponse<T>>): Observable<T> {
        return entity.map(this.extractData)
            .catch((err: any, caught: Observable<T>) => {
                if (this.config.handleError) {
                    this.config.handleError(err, caught);
                }
                return Observable.throw(err);
            });
    }

    protected getRequestOptions(): {
        headers?: HttpHeaders;
        observe: 'response';
        params?: HttpParams;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
    } {
        const options = Object.assign({}, this.config.defaultRequestOptions);
        options.params = this.getParams();
        return options;
    }

    protected abstract Exec(...args: any[]): Observable<any>;

    protected toStringArray(input: string | string[] | IEnumerable<string> | IQueryable<string>): string[] {
        if (!input) {
            return [];
        }

        if (input instanceof String || typeof input === 'string') {
            return input.split(',').map(s => s.trim());
        }

        if (input instanceof Array) {
            return input;
        }

        return input.toArray();
    }

    protected toCommaString(input: string | string[] | IEnumerable<string> | IQueryable<string>): string {
        if (input instanceof String || typeof input === 'string') {
            return input as string;
        }

        if (input instanceof Array) {
            return input.join();
        }

        return input.toArray().join();
    }

    private extractData(res: HttpResponse<T>): T {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }

        const body: any = res.body;
        const entity: T = body;
        return entity || null;
    }
}

export abstract class OperationWithKey<T> extends ODataOperation<T> {
    constructor(protected _typeName: string,
        protected config: ODataConfiguration,
        protected http: HttpClient,
        protected entityKey: string | number | boolean) {
        super(_typeName, config, http);
    }
    protected abstract Exec(...args: any[]): Observable<any>;
}

export abstract class OperationWithEntity<T> extends ODataOperation<T> {
    constructor(protected _typeName: string,
        protected config: ODataConfiguration,
        protected http: HttpClient,
        protected entity: T) {
        super(_typeName, config, http);
    }
    protected abstract Exec(...args: any[]): Observable<any>;
}

export abstract class OperationWithKeyAndEntity<T> extends ODataOperation<T> {
    constructor(protected _typeName: string,
        protected config: ODataConfiguration,
        protected http: HttpClient,
        protected entityKey: string,
        protected entity: T) {
        super(_typeName, config, http);
    }
    protected abstract Exec(...args: any[]): Observable<any>;
}

export class GetOperation<T> extends OperationWithKey<T> {
    public Exec(): Observable<T> {
        return super.handleResponse(this.http.get<T>(this.config.getEntityUri(this.entityKey, this.typeName), this.getRequestOptions()));
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
