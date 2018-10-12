export class ODataUtils {
    public static convertObjectToString(obj: any): string {
        const properties: string[] = [];

        for (const prop in obj) {
            if (obj.hasOwnProperty(prop) && obj[prop] !== undefined) {
                const value: any = ODataUtils.quoteValue(obj[prop]);

                properties.push(`${prop}=${value}`);
            }
        }
        return properties.join(', ');
    }

    public static quoteValue(value: number | string | boolean | any): string {
        // check if GUID (UUID) type
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
            return value;
        }

        // check if string
        if (typeof value === 'string') {
            const escaped = value.replace(/'/g, '\'\'');
            return `'${escaped}'`;
        }

        // check if boolean or number
        if (typeof value === 'boolean' || typeof value === 'number') {
            return `${value}`;
        }

        const parts: string[] = [];
        Object.getOwnPropertyNames(value).forEach((propertyName: string) => {
            const propertyValue: any = value[propertyName];
            parts.push(`${propertyName}=${ODataUtils.quoteValue(propertyValue)}`);
        });

        return parts.length > 0 ? parts.join(', ') : `${value}`;
    }
}
