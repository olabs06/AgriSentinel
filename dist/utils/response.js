"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
class ApiResponse {
    static success(res, data, message = 'Success', statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data,
            timestamp: new Date().toISOString(),
        });
    }
    static error(res, message, statusCode = 500, errors) {
        return res.status(statusCode).json({
            success: false,
            message,
            errors,
            timestamp: new Date().toISOString(),
        });
    }
    static paginated(res, data, page, limit, total) {
        return res.status(200).json({
            success: true,
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
                hasNext: page * limit < total,
                hasPrev: page > 1,
            },
            timestamp: new Date().toISOString(),
        });
    }
}
exports.ApiResponse = ApiResponse;
//# sourceMappingURL=response.js.map