import { URLSearchParams, Http, Response, RequestOptions } from '@angular/http';
import { Observable, Operator, Subject } from 'rxjs/Rx';

import { ODataConfiguration } from './angularODataConfiguration';
import { ODataOperation } from './angularODataOperation';
import { ODataPagedResult } from './angularODataPagedResult';

export class ODataQuery<T> extends ODataOperation<T> {
    private _filter: string;
    private _top: number;
    private _skip: number;
    private _orderBy: string;
    private _entitiesUri: string;

    constructor(typeName: string, config: ODataConfiguration, http: Http) {
        super(typeName, config, http);

        this._entitiesUri = config.getEntitiesUri(this.typeName);
    }

    public Filter(filter: string): ODataQuery<T> {
        this._filter = filter;
        return this;
    };

    public Top(top: number): ODataQuery<T> {
        this._top = top;
        return this;
    };

    public Skip(skip: number): ODataQuery<T> {
        this._skip = skip;
        return this;
    }

    public OrderBy(orderBy: string): ODataQuery<T> {
        this._orderBy = orderBy;
        return this;
    }

    public Exec(): Observable<Array<T>> {
        const requestOptions: RequestOptions = this.getQueryRequestOptions(false);

        return this.http.get(this._entitiesUri, requestOptions)
            .map(res => this.extractArrayData(res, this.config))
            .catch((err: any, caught: Observable<Array<T>>) => {
                if (this.config.handleError) {
                    this.config.handleError(err, caught);
                }
                return Observable.throw(err);
            });
    }

    public ExecWithCount(): Observable<ODataPagedResult<T>> {
        const requestOptions: RequestOptions = this.getQueryRequestOptions(true);

        return this.http.get(this._entitiesUri, requestOptions)
            .map(res => this.extractArrayDataWithCount(res, this.config))
            .catch((err: any, caught: Observable<ODataPagedResult<T>>) => {
                if (this.config.handleError) {
                    this.config.handleError(err, caught);
                }
                return Observable.throw(err);
            });
    }

    private getQueryRequestOptions(odata4: boolean): RequestOptions {
        const options = this.config.defaultRequestOptions;
        const params = super.getParams();

        if (this._filter) {
            params.set(this.config.keys.filter, this._filter);
        }

        if (this._top) {
            params.set(this.config.keys.top, this._top.toString());
        }

        if (this._skip) {
            params.set(this.config.keys.skip, this._skip.toString());
        }

        if (this._orderBy) {
            params.set(this.config.keys.orderBy, this._orderBy);
        }

        if (odata4) {
            params.set('$count', 'true'); // OData v4 only
        }

        options.search = params;

        return options;
    }

    private extractArrayData(res: Response, config: ODataConfiguration): Array<T> {
        return config.extractQueryResultData<T>(res);
    }

    private extractArrayDataWithCount(res: Response, config: ODataConfiguration): ODataPagedResult<T> {
        return config.extractQueryResultDataWithCount<T>(res);
    }
}
