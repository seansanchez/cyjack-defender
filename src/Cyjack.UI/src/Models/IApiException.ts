export enum ApiErrorStatus {
    SecurityException = 503
}

export interface IApiException {
    response: {
        data: {
            detail: string;
            status: number;
        };
    };
}