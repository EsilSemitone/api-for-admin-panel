export class HttpException extends Error {
    constructor(
        message: string,
        public statusCode: number,
        public context?: any,
    ) {
        super(message);
    }
}
