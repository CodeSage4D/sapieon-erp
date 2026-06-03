"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../01_Core/prisma/prisma.service");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const crypto_1 = require("crypto");
let UploadService = class UploadService {
    prisma;
    uploadDir = path.join(process.cwd(), 'uploads');
    constructor(prisma) {
        this.prisma = prisma;
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }
    async saveFile(file) {
        if (!file || !file.buffer) {
            throw new common_1.BadRequestException('No file uploaded or file buffer is empty');
        }
        const maxSizeBytes = 5 * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            throw new common_1.BadRequestException('File size exceeds the limit of 5MB');
        }
        const buffer = file.buffer;
        if (buffer.length < 4) {
            throw new common_1.BadRequestException('Invalid file buffer');
        }
        const hex = buffer.toString('hex', 0, 4).toUpperCase();
        const isPdf = hex === '25504446';
        const isPng = hex === '89504E47';
        const isJpg = hex.startsWith('FFD8FF');
        if (!isPdf && !isPng && !isJpg) {
            throw new common_1.BadRequestException('Invalid file signature. Only JPEG, PNG, and PDF files are allowed.');
        }
        let ext = '';
        if (isPdf)
            ext = '.pdf';
        else if (isPng)
            ext = '.png';
        else if (isJpg)
            ext = '.jpg';
        const filename = `${(0, crypto_1.randomUUID)()}${ext}`;
        const filePath = path.join(this.uploadDir, filename);
        try {
            fs.writeFileSync(filePath, buffer);
        }
        catch (err) {
            console.error('Failed to write file to disk:', err);
            throw new common_1.BadRequestException('Could not save file to disk');
        }
        return filename;
    }
    async getFile(filename, user) {
        const filePath = path.join(this.uploadDir, filename);
        if (!fs.existsSync(filePath)) {
            throw new common_1.NotFoundException('File not found');
        }
        const doc = await this.prisma.document.findFirst({
            where: {
                fileUrl: {
                    contains: filename,
                },
            },
            include: {
                student: {
                    select: {
                        id: true,
                        parentId: true,
                        institutionId: true,
                    },
                },
            },
        });
        if (doc) {
            if (doc.student.institutionId !== user.institutionId) {
                throw new common_1.ForbiddenException('Access denied. Institution mismatch.');
            }
            if (user.role === 'PARENT') {
                const parentProfile = await this.prisma.parent.findUnique({
                    where: { userId: user.sub },
                    select: { id: true },
                });
                if (!parentProfile || doc.student.parentId !== parentProfile.id) {
                    throw new common_1.ForbiddenException('Access denied. This document does not belong to your child.');
                }
            }
            else if (user.role === 'STUDENT') {
                const studentProfile = await this.prisma.student.findUnique({
                    where: { userId: user.sub },
                    select: { id: true },
                });
                if (!studentProfile || doc.student.id !== studentProfile.id) {
                    throw new common_1.ForbiddenException('Access denied. This document does not belong to you.');
                }
            }
        }
        return filePath;
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UploadService);
//# sourceMappingURL=upload.service.js.map