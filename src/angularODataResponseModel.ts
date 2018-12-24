export interface IODataResponseModel<T> {
    '@odata.context': string;

    '@odata.count'?: number;

    '@odata.nextLink'?: string;

    value: T[];
}
