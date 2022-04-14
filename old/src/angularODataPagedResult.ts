export class ODataPagedResult<T> {
    public data: T[];
    public count: number;
    public nextLink: string;
}
