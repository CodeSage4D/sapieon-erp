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
exports.AuditLogInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const prisma_service_1 = require("../../01_Core/prisma/prisma.service");
let AuditLogInterceptor = class AuditLogInterceptor {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async intercept(context, next) {
        const httpContext = context.switchToHttp();
        const request = httpContext.getRequest();
        const method = request.method;
        if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
            return next.handle();
        }
        const url = request.url;
        const modelName = this.getModelNameFromUrl(url);
        const id = request.params.id;
        const ipAddress = request.headers['x-forwarded-for'] || request.ip || request.socket.remoteAddress || null;
        let preValue = null;
        if (['PUT', 'PATCH', 'DELETE'].includes(method) && id && modelName) {
            try {
                const dbModel = this.prisma[modelName];
                if (dbModel && typeof dbModel.findUnique === 'function') {
                    preValue = await dbModel.findUnique({ where: { id } });
                }
            }
            catch (err) {
                console.warn(`AuditLogInterceptor: Failed to fetch pre-value for model ${modelName} with id ${id}:`, err);
            }
        }
        return next.handle().pipe((0, operators_1.tap)(async (responseBody) => {
            const user = request.user;
            if (!user || !user.id) {
                return;
            }
            let postValue = null;
            if (method === 'POST') {
                postValue = responseBody;
            }
            else if (['PUT', 'PATCH'].includes(method) && id && modelName) {
                try {
                    const dbModel = this.prisma[modelName];
                    if (dbModel && typeof dbModel.findUnique === 'function') {
                        postValue = await dbModel.findUnique({ where: { id } });
                    }
                }
                catch (err) {
                    console.warn(`AuditLogInterceptor: Failed to fetch post-value for model ${modelName} with id ${id}:`, err);
                }
            }
            try {
                const action = this.getFriendlyActionName(method, modelName || 'resource', url);
                const sanitizedPre = this.sanitize(preValue);
                const sanitizedPost = this.sanitize(postValue);
                const detailsObj = {
                    method,
                    url,
                    params: request.params,
                    body: this.sanitize(request.body),
                    preValue: sanitizedPre,
                    postValue: sanitizedPost,
                };
                await this.prisma.auditLog.create({
                    data: {
                        userId: user.id,
                        action,
                        details: JSON.stringify(detailsObj),
                        ipAddress,
                    },
                });
            }
            catch (err) {
                console.error('AuditLogInterceptor: Failed to save audit log:', err);
            }
        }));
    }
    getModelNameFromUrl(url) {
        const path = url.split('?')[0];
        const parts = path.split('/');
        if (parts.includes('student') || parts.includes('students'))
            return 'student';
        if (parts.includes('attendance'))
            return 'attendance';
        if (parts.includes('class') || parts.includes('classes'))
            return 'class';
        if (parts.includes('staff'))
            return 'staff';
        if (parts.includes('settings'))
            return 'settings';
        if (parts.includes('notice') || parts.includes('notices'))
            return 'notice';
        if (parts.includes('fee') || parts.includes('fees')) {
            if (path.includes('allocation'))
                return 'studentFeeAllocation';
            if (path.includes('payment') || path.includes('payments'))
                return 'payment';
            return 'feeStructure';
        }
        if (parts.includes('exam') || parts.includes('exams')) {
            if (path.includes('result') || path.includes('results'))
                return 'examResult';
            return 'exam';
        }
        return null;
    }
    getFriendlyActionName(method, modelName, url) {
        const actionMap = {
            POST: 'CREATE',
            PUT: 'UPDATE',
            PATCH: 'UPDATE',
            DELETE: 'DELETE',
        };
        const action = actionMap[method] || method;
        const formattedModel = modelName.replace(/([A-Z])/g, '_$1').toUpperCase();
        return `${action}_${formattedModel}`;
    }
    sanitize(obj) {
        if (!obj || typeof obj !== 'object') {
            return obj;
        }
        let copy;
        try {
            copy = JSON.parse(JSON.stringify(obj));
        }
        catch {
            return '[UNPARSABLE_OBJECT]';
        }
        const sensitiveFields = [
            'password',
            'passwordHash',
            'pass',
            'token',
            'accessToken',
            'refreshToken',
            'aadhaarNumber',
            'accNumber',
            'ifscCode',
            'samagraId',
            'familyId',
            'panNumber',
        ];
        const sanitizeObject = (item) => {
            if (!item || typeof item !== 'object')
                return;
            for (const key of Object.keys(item)) {
                if (sensitiveFields.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
                    item[key] = '[REDACTED_PII]';
                }
                else if (typeof item[key] === 'object') {
                    sanitizeObject(item[key]);
                }
            }
        };
        sanitizeObject(copy);
        return copy;
    }
};
exports.AuditLogInterceptor = AuditLogInterceptor;
exports.AuditLogInterceptor = AuditLogInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuditLogInterceptor);
//# sourceMappingURL=audit-log.interceptor.js.map