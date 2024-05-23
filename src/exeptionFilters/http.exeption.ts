export class HttpExeption extends Error {
    constructor(
        message: string,
        public statusCode: number,
        public context: string,
    ) {
        super(message);
    }
}
