import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';

import { ODataConfiguration } from './angularODataConfiguration';
import { ODataExecReturnType } from './angularODataEnums';
import { ODataOperation } from './angularODataOperation';
import { ODataPagedResult } from './angularODataPagedResult';
import { IODataResponseModel } from './angularODataResponseModel';

export class ODataQuery<T> extends ODataOperation<T> {

    private _filter: string;
    private _top: number;
    private _skip: number;
    private _orderBy: string[] = [];
    private _apply: string[] = [];
    private _entitiesUri: string;
    private _maxPerPage: number;

    constructor(typeName: string, config: ODataConfiguration, http: HttpClient) {
        super(typeName, config, http);

        this._entitiesUri = config.getEntitiesUri(this.typeName);
    }

    public Filter(filter: string): ODataQuery<T> {
        if (filter) {
            this._filter = filter;
        }
        return this;
    }

    public Top(top: number): ODataQuery<T> {
        if (top > 0) {
            this._top = top;
        }
        return this;
    }

    public Skip(skip: number): ODataQuery<T> {
        if (skip > 0) {
            this._skip = skip;
        }
        return this;
    }

    public OrderBy(orderBy: string | string[]): ODataQuery<T> {
        if (orderBy) {
            this._orderBy = this.toStringArray(orderBy);
        }
        return this;
    }

    public MaxPerPage(maxPerPage: number): ODataQuery<T> {
        if (maxPerPage > 0) {
            this._maxPerPage = maxPerPage;
        }
        return this;
    }

    public Apply(apply: string | string[]): ODataQuery<T> {
        if (apply) {
            this._apply = this.toStringArray(apply);
        }
        return this;
    }

    public GetUrl(returnType?: ODataExecReturnType): string {
        let url: string = this._entitiesUri;
        if (returnType === ODataExecReturnType.Count) {
            url = `${url}/${this.config.keys.count}`;
        }

        const params: HttpParams = this.getQueryParams(returnType === ODataExecReturnType.PagedResult);
        if (params.keys().length > 0) {
            return `${url}?${params}`;
        }

        return url;
    }

    public Exec(): Observable<T[]>;
    public Exec(returnType: ODataExecReturnType.Count): Observable<number>;
    public Exec(returnType: ODataExecReturnType.PagedResult): Observable<ODataPagedResult<T>>;
    public Exec(returnType?: ODataExecReturnType): Observable<T[] | ODataPagedResult<T> | number> {
        const requestOptions: {
            headers?: HttpHeaders;
            observe: 'response';
            params?: HttpParams;
            reportProgress?: boolean;
            responseType?: 'json';
            withCredentials?: boolean;
        } = this.getQueryRequestOptions(returnType === ODataExecReturnType.PagedResult);

        switch (returnType) {
            case ODataExecReturnType.Count:
                const countUrl = `${this._entitiesUri}/${this.config.keys.count}`;
                return this.http.get<number>(countUrl, requestOptions)
                    .pipe(
                        map(res => this.extractDataAsNumber(res, this.config)),
                        catchError((err: any, caught: Observable<number>) => {
                            if (this.config.handleError) {
                                this.config.handleError(err, caught);
                            }
                            return throwError(err);
                        })
                    );

            case ODataExecReturnType.PagedResult:
                return this.http.get<IODataResponseModel<T>>(this._entitiesUri, requestOptions)
                    .pipe(
                        map(res => this.extractArrayDataWithCount(res, this.config)),
                        catchError((err: any, caught: Observable<ODataPagedResult<T>>) => {
                            if (this.config.handleError) {
                                this.config.handleError(err, caught);
                            }
                            return throwError(err);
                        })
                    );

            default:
                return this.http.get<IODataResponseModel<T>>(this._entitiesUri, requestOptions)
                    .pipe(
                        map(res => this.extractArrayData(res, this.config)),
                        catchError((err: any, caught: Observable<Array<T>>) => {
                            if (this.config.handleError) {
                                this.config.handleError(err, caught);
                            }
                            return throwError(err);
                        })
                    );
        }
    }

    public ExecWithCount(): Observable<ODataPagedResult<T>> {
        return this.Exec(ODataExecReturnType.PagedResult);
    }

    public NextPage(pagedResult: ODataPagedResult<T>): Observable<ODataPagedResult<T>> {
        const requestOptions: {
            headers?: HttpHeaders;
            observe: 'response';
            params?: HttpParams;
            reportProgress?: boolean;
            responseType?: 'json';
            withCredentials?: boolean;
        } = this.getQueryRequestOptions(false);

        return this.http.get<IODataResponseModel<T>>(pagedResult.nextLink, requestOptions)
            .pipe(
                map(res => this.extractArrayDataWithCount(res, this.config)),
                catchError((err: any, caught: Observable<ODataPagedResult<T>>) => {
                    if (this.config.handleError) {
                        this.config.handleError(err, caught);
                    }
                    return throwError(err);
                })
            );
    }

    private getQueryRequestOptions(odata4: boolean): {
        headers?: HttpHeaders;
        observe: 'response';
        params?: HttpParams;
        reportProgress?: boolean;
        responseType?: 'json';
        withCredentials?: boolean;
    } {
        const options = Object.assign({}, this.config.defaultRequestOptions);
        options.params = this.getQueryParams(odata4);

        if (this._maxPerPage > 0) {
            if (!options.headers) {
                options.headers = new HttpHeaders();
            }
            options.headers = options.headers.set('Prefer', `${this.config.keys.maxPerPage}=${this._maxPerPage}`);

            // Hack to force the values to apply so test compare works.
            options.headers.keys();
        }

        return options;
    }

    private getQueryParams(odata4: boolean): HttpParams {
        let params = super.getParams();

        if (this._filter) {
            params = params.append(this.config.keys.filter, this._filter);
        }

        if (this._top > 0) {
            params = params.append(this.config.keys.top, this._top.toString());
        }

        if (this._skip > 0) {
            params = params.append(this.config.keys.skip, this._skip.toString());
        }

        if (this._orderBy.length > 0) {
            params = params.append(this.config.keys.orderBy, this.toCommaString(this._orderBy));
        }

        if (this._apply.length > 0) {
            params = params.append(this.config.keys.apply, this.toCommaString(this._apply));
        }

        if (odata4) {
            params = params.append('$count', 'true'); // OData v4 only
        }

        return params;
    }

    private extractDataAsNumber(res: HttpResponse<number>, config: ODataConfiguration): number {
        return config.extractQueryResultDataAsNumber(res);
    }

    private extractArrayData(res: HttpResponse<IODataResponseModel<T>>, config: ODataConfiguration): T[] {
        return config.extractQueryResultData(res);
    }

    private extractArrayDataWithCount(res: HttpResponse<IODataResponseModel<T>>, config: ODataConfiguration): ODataPagedResult<T> {
        return config.extractQueryResultDataWithCount(res);
    }
}
