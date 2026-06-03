"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../01_Core/prisma/prisma.service");
let HttpExceptionFilter = class HttpExceptionFilter {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let exceptionResponse = null;
        if (exception instanceof common_1.HttpException) {
            status = exception.getStatus();
            exceptionResponse = exception.getResponse();
            message = typeof exceptionResponse === 'object' && exceptionResponse.message
                ? exceptionResponse.message
                : exception.message || 'Internal server error';
        }
        else {
            console.error('Unhandled system exception intercepted:', exception);
        }
        const ipAddress = request.headers['x-forwarded-for'] || request.ip || request.socket.remoteAddress || null;
        let securityAction = null;
        let securityDetails = '';
        if (status === common_1.HttpStatus.TOO_MANY_REQUESTS) {
            securityAction = 'RATE_LIMIT_VIOLATION';
            securityDetails = `Rate limit exceeded on endpoint: ${request.method} ${request.url}`;
        }
        else if (status === common_1.HttpStatus.FORBIDDEN) {
            securityAction = 'PERMISSION_DENIED';
            securityDetails = `Forbidden access attempt on endpoint: ${request.method} ${request.url}. Message: ${typeof exceptionResponse === 'object' ? JSON.stringify(exceptionResponse) : exceptionResponse || message}`;
        }
        else if (status === common_1.HttpStatus.UNAUTHORIZED) {
            securityAction = 'SUSPICIOUS_ACCESS_ATTEMPT';
            securityDetails = `Unauthorized credentials or token validation failure on endpoint: ${request.method} ${request.url}`;
        }
        else if (status === common_1.HttpStatus.INTERNAL_SERVER_ERROR && !(exception instanceof common_1.HttpException)) {
            securityAction = 'SYSTEM_ERROR';
            securityDetails = `Unhandled system error on endpoint: ${request.method} ${request.url}. Error: ${exception instanceof Error ? exception.message : String(exception)}`;
        }
        if (securityAction) {
            try {
                const userId = request.user?.id || null;
                const email = request.body?.email || request.user?.email || null;
                await this.prisma.securityEventLog.create({
                    data: {
                        userId,
                        email,
                        action: securityAction,
                        details: securityDetails,
                        ipAddress,
                    },
                });
            }
            catch (err) {
                console.error('Failed to log security event in HttpExceptionFilter:', err);
            }
        }
        const errorResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message,
        };
        response.status(status).json(errorResponse);
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = __decorate([
    (0, common_1.Catch)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HttpExceptionFilter);
//# sourceMappingURL=http-exception.filter.js.map