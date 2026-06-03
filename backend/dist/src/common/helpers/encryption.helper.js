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
Object.defineProperty(exports, "__esModule", { value: true });
exports.encrypt = encrypt;
exports.decrypt = decrypt;
exports.maskSensitiveData = maskSensitiveData;
const crypto = __importStar(require("crypto"));
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
function getKey() {
    const rawKey = process.env.BACKEND_ENCRYPTION_KEY;
    if (!rawKey) {
        throw new Error('BACKEND_ENCRYPTION_KEY is not defined in environment variables');
    }
    const keyBuf = Buffer.from(rawKey, 'utf8');
    if (keyBuf.length !== 32) {
        throw new Error(`BACKEND_ENCRYPTION_KEY must be exactly 32 bytes (256 bits). Current length: ${keyBuf.length} bytes`);
    }
    return keyBuf;
}
function encrypt(text) {
    if (text === null || text === undefined || text === '')
        return null;
    try {
        const key = getKey();
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const tag = cipher.getAuthTag();
        return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
    }
    catch (error) {
        console.error('Encryption failed:', error);
        throw new Error('Cryptographic operation failed');
    }
}
function decrypt(encryptedData) {
    if (encryptedData === null || encryptedData === undefined || encryptedData === '')
        return null;
    try {
        const parts = encryptedData.split(':');
        if (parts.length !== 3) {
            return encryptedData;
        }
        const [ivHex, tagHex, encryptedHex] = parts;
        const key = getKey();
        const iv = Buffer.from(ivHex, 'hex');
        const tag = Buffer.from(tagHex, 'hex');
        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        decipher.setAuthTag(tag);
        let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
    catch (error) {
        console.error('Decryption failed:', error);
        return 'DECRYPTION_ERROR';
    }
}
function maskSensitiveData(val, visibleDigits = 4) {
    if (!val)
        return '';
    const cleanVal = val.replace(/\s/g, '');
    if (cleanVal.length <= visibleDigits)
        return val;
    const maskedPart = 'X'.repeat(cleanVal.length - visibleDigits);
    return maskedPart + cleanVal.slice(-visibleDigits);
}
//# sourceMappingURL=encryption.helper.js.map