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
exports.InventoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../01_Core/prisma/prisma.service");
let InventoryService = class InventoryService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getInventory(institutionId) {
        return this.prisma.inventoryItem.findMany({
            where: { institutionId },
            orderBy: { name: 'asc' },
        });
    }
    async createInventoryItem(institutionId, data) {
        const qty = parseInt(data.quantity) || 0;
        const status = qty <= 0 ? 'OUT_OF_STOCK' : qty <= 5 ? 'LOW_STOCK' : 'IN_STOCK';
        return this.prisma.inventoryItem.create({
            data: {
                name: data.name,
                category: data.category,
                quantity: qty,
                unit: data.unit || 'PCS',
                vendor: data.vendor || null,
                status,
                institutionId,
            },
        });
    }
    async updateInventoryItem(institutionId, id, data) {
        const item = await this.prisma.inventoryItem.findFirst({
            where: { id, institutionId },
        });
        if (!item) {
            throw new common_1.NotFoundException('Inventory item not found');
        }
        const qty = data.quantity !== undefined ? parseInt(data.quantity) : item.quantity;
        const status = qty <= 0 ? 'OUT_OF_STOCK' : qty <= 5 ? 'LOW_STOCK' : 'IN_STOCK';
        return this.prisma.inventoryItem.update({
            where: { id },
            data: {
                name: data.name !== undefined ? data.name : item.name,
                category: data.category !== undefined ? data.category : item.category,
                quantity: qty,
                unit: data.unit !== undefined ? data.unit : item.unit,
                vendor: data.vendor !== undefined ? data.vendor : item.vendor,
                status,
            },
        });
    }
    async deleteInventoryItem(institutionId, id) {
        const item = await this.prisma.inventoryItem.findFirst({
            where: { id, institutionId },
        });
        if (!item) {
            throw new common_1.NotFoundException('Inventory item not found');
        }
        return this.prisma.inventoryItem.delete({
            where: { id },
        });
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map