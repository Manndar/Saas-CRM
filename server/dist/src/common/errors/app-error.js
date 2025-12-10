"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
const common_1 = require("@nestjs/common");
class AppError extends common_1.HttpException {
    constructor(message, status = common_1.HttpStatus.BAD_REQUEST, metadata) {
        super({
            success: false,
            message,
            ...(metadata ? { metadata } : {}),
        }, status);
    }
}
exports.AppError = AppError;
//# sourceMappingURL=app-error.js.map