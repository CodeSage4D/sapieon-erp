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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = __importStar(require("bcryptjs"));
const argon2 = __importStar(require("argon2"));
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async login(email, pass) {
        const sanitizedEmail = (email || '').trim().toLowerCase();
        const user = await this.prisma.user.findUnique({
            where: { email: sanitizedEmail },
            include: {
                institution: {
                    select: {
                        name: true,
                        logoUrl: true,
                        primaryColor: true,
                    },
                },
                studentProfile: {
                    select: { id: true, firstName: true, lastName: true },
                },
                parentProfile: {
                    select: { id: true, firstName: true, lastName: true },
                },
                staffProfile: {
                    select: { id: true, firstName: true, lastName: true, designation: true },
                },
            },
        });
        if (!user) {
            await this.prisma.securityEventLog.create({
                data: {
                    userId: null,
                    email: sanitizedEmail,
                    action: 'FAILED_LOGIN',
                    details: `Failed login attempt for non-existent email: ${sanitizedEmail}`,
                },
            });
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (!user.isActive) {
            await this.prisma.securityEventLog.create({
                data: {
                    userId: user.id,
                    email: sanitizedEmail,
                    action: 'SUSPICIOUS_ACCESS_ATTEMPT',
                    details: `Login attempt on inactive account: ${sanitizedEmail}`,
                },
            });
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
            const remainingMs = new Date(user.lockedUntil).getTime() - Date.now();
            const remainingMins = Math.ceil(remainingMs / 60000);
            await this.prisma.securityEventLog.create({
                data: {
                    userId: user.id,
                    email: sanitizedEmail,
                    action: 'LOCKOUT_VIOLATION_ATTEMPT',
                    details: `Login attempt on locked account: ${sanitizedEmail}. Lockout remaining: ${remainingMins} min(s).`,
                },
            });
            throw new common_1.UnauthorizedException(`Account is temporarily locked. Please try again in ${remainingMins} minute(s).`);
        }
        let isMatch = false;
        let needsRehash = false;
        const isLegacyBcrypt = user.passwordHash.startsWith('$2a$') || user.passwordHash.startsWith('$2b$');
        if (isLegacyBcrypt) {
            isMatch = await bcrypt.compare(pass, user.passwordHash);
            needsRehash = isMatch;
        }
        else {
            try {
                isMatch = await argon2.verify(user.passwordHash, pass);
            }
            catch (error) {
                isMatch = false;
            }
        }
        if (!isMatch) {
            const newAttempts = user.failedLoginAttempts + 1;
            let lockedUntil = null;
            let action = 'FAILED_LOGIN';
            let details = `Failed login attempt for email: ${sanitizedEmail}`;
            if (newAttempts >= 5) {
                lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
                action = 'LOCKOUT';
                details = `Account locked for 15 minutes due to 5 consecutive failed login attempts`;
            }
            await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    failedLoginAttempts: newAttempts >= 5 ? 0 : newAttempts,
                    lockedUntil,
                },
            });
            await this.prisma.securityEventLog.create({
                data: {
                    userId: user.id,
                    email: sanitizedEmail,
                    action,
                    details,
                },
            });
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const updateData = {
            failedLoginAttempts: 0,
            lockedUntil: null,
        };
        if (needsRehash) {
            const argonHash = await argon2.hash(pass);
            updateData.passwordHash = argonHash;
            await this.prisma.securityEventLog.create({
                data: {
                    userId: user.id,
                    email: sanitizedEmail,
                    action: 'PASSWORD_MIGRATION',
                    details: `Password hash successfully upgraded from BCrypt to Argon2 at runtime.`,
                },
            });
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: updateData,
        });
        let profileName = 'Administrator';
        let profileId = '';
        if (user.studentProfile) {
            profileName = `${user.studentProfile.firstName} ${user.studentProfile.lastName}`;
            profileId = user.studentProfile.id;
        }
        else if (user.parentProfile) {
            profileName = `${user.parentProfile.firstName} ${user.parentProfile.lastName}`;
            profileId = user.parentProfile.id;
        }
        else if (user.staffProfile) {
            profileName = `${user.staffProfile.firstName} ${user.staffProfile.lastName}`;
            profileId = user.staffProfile.id;
        }
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            institutionId: user.institutionId,
        };
        return {
            token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                profileName,
                profileId,
                institutionId: user.institutionId,
                institutionName: user.institution.name,
                logoUrl: user.institution.logoUrl,
                primaryColor: user.institution.primaryColor,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map