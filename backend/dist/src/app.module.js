"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./01_Core/prisma/prisma.module");
const auth_module_1 = require("./01_Core/Auth/auth.module");
const student_module_1 = require("./02_Admission/StudentProfile/student.module");
const attendance_module_1 = require("./04_Attendance/StudentAttendance/attendance.module");
const fee_module_1 = require("./05_Fees/FeeStructure/fee.module");
const exam_module_1 = require("./06_Exams/ExamSetup/exam.module");
const staff_module_1 = require("./07_Staff/StaffProfile/staff.module");
const notice_module_1 = require("./08_Communication/Notices/notice.module");
const dashboard_module_1 = require("./01_Core/Dashboard/dashboard.module");
const class_module_1 = require("./03_Academics/Class/class.module");
const lesson_module_1 = require("./03_Academics/LessonPlan/lesson.module");
const library_module_1 = require("./14_FutureTrendModules/Library/library.module");
const payroll_module_1 = require("./07_Staff/Salary/payroll.module");
const visitor_module_1 = require("./14_FutureTrendModules/VisitorManagement/visitor.module");
const inventory_module_1 = require("./14_FutureTrendModules/Inventory/inventory.module");
const timetable_module_1 = require("./13_StudentPortal/Timetable/timetable.module");
const branch_module_1 = require("./01_Core/Branch/branch.module");
const settings_module_1 = require("./01_Core/Settings/settings.module");
const notification_module_1 = require("./08_Communication/InAppAlerts/notification.module");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const audit_log_interceptor_1 = require("./common/interceptors/audit-log.interceptor");
const upload_module_1 = require("./02_Admission/Documents/upload.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            student_module_1.StudentModule,
            attendance_module_1.AttendanceModule,
            fee_module_1.FeeModule,
            exam_module_1.ExamModule,
            staff_module_1.StaffModule,
            notice_module_1.NoticeModule,
            dashboard_module_1.DashboardModule,
            class_module_1.ClassModule,
            lesson_module_1.LessonModule,
            library_module_1.LibraryModule,
            payroll_module_1.PayrollModule,
            visitor_module_1.VisitorModule,
            inventory_module_1.InventoryModule,
            timetable_module_1.TimetableModule,
            branch_module_1.BranchModule,
            settings_module_1.SettingsModule,
            notification_module_1.NotificationModule,
            upload_module_1.UploadModule,
            throttler_1.ThrottlerModule.forRoot([{
                    ttl: 60000,
                    limit: 100,
                }]),
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: audit_log_interceptor_1.AuditLogInterceptor,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map