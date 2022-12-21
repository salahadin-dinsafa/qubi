export interface HttpExceptionResponse {
    statusCode: number;
    error: string;
    message?: string;
}

export interface CustomeHttpExceptionResponse extends HttpExceptionResponse {
    method: string;
    path: string;
    timeStamp: string;
}
