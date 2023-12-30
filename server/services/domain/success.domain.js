class BusinessError {
    constructor() {
        this.message = '';
        this.code = 500;
    }

    getResponse() {
        return {
            code: this.code,
            message: `Error: ${this.message}`,
        };
    }
}

export default { BusinessError };
