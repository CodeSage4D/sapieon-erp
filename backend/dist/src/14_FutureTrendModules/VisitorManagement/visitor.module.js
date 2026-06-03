"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitorModule = void 0;
const common_1 = require("@nestjs/common");
const visitor_controller_1 = require("./visitor.controller");
const visitor_service_1 = require("./visitor.service");
const prisma_module_1 = require("../../01_Core/prisma/prisma.module");
let VisitorModule = class VisitorModule {
};
exports.VisitorModule = VisitorModule;
exports.VisitorModule = VisitorModule = __decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [visitor_controller_1.VisitorController],
        providers: [visitor_service_1.VisitorService],
        exports: [visitor_service_1.VisitorService],
    })
], VisitorModule);
//# sourceMappingURL=visitor.module.js.map