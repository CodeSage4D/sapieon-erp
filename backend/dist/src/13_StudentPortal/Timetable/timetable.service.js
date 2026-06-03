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
exports.TimetableService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../01_Core/prisma/prisma.service");
let TimetableService = class TimetableService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    addMinutes(timeStr, mins) {
        const [h, m] = timeStr.split(':').map(Number);
        const totalMins = h * 60 + m + mins;
        const newH = Math.floor(totalMins / 60) % 24;
        const newM = totalMins % 60;
        return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
    }
    async getTimetable(institutionId, classId) {
        const classRecord = await this.prisma.class.findFirst({
            where: { id: classId, institutionId }
        });
        if (!classRecord) {
            throw new common_1.NotFoundException('Class not found');
        }
        return this.prisma.timetableEntry.findMany({
            where: { classId, institutionId },
            include: {
                subject: {
                    select: { id: true, name: true, code: true, teacherId: true }
                },
                teacher: {
                    select: { id: true, firstName: true, lastName: true, employeeId: true }
                }
            },
            orderBy: [
                { dayOfWeek: 'asc' },
                { periodNumber: 'asc' }
            ]
        });
    }
    async generateTimetable(institutionId, classId, periodsPerDay, durationMin, startTime) {
        const classRecord = await this.prisma.class.findFirst({
            where: { id: classId, institutionId }
        });
        if (!classRecord) {
            throw new common_1.NotFoundException('Class not found');
        }
        const subjects = await this.prisma.subject.findMany({
            where: { classId }
        });
        if (subjects.length === 0) {
            throw new common_1.BadRequestException('This class has no subjects registered. Please add subjects first.');
        }
        const teachers = await this.prisma.staff.findMany({
            where: { institutionId },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                subjectsExpertise: true,
                designation: true,
            }
        });
        const otherEntries = await this.prisma.timetableEntry.findMany({
            where: {
                institutionId,
                classId: { not: classId }
            },
            select: {
                teacherId: true,
                dayOfWeek: true,
                periodNumber: true,
            }
        });
        const busyMap = {};
        const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
        days.forEach(day => {
            busyMap[day] = {};
            for (let p = 1; p <= periodsPerDay; p++) {
                busyMap[day][p] = new Set();
            }
        });
        otherEntries.forEach(entry => {
            if (busyMap[entry.dayOfWeek] && busyMap[entry.dayOfWeek][entry.periodNumber]) {
                busyMap[entry.dayOfWeek][entry.periodNumber].add(entry.teacherId);
            }
        });
        const generatedEntries = [];
        const isExpert = (teacher, subjectName) => {
            if (!teacher.subjectsExpertise)
                return false;
            return teacher.subjectsExpertise.some(exp => exp.toLowerCase().includes(subjectName.toLowerCase()) ||
                subjectName.toLowerCase().includes(exp.toLowerCase()));
        };
        for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
            const day = days[dayIndex];
            for (let p = 1; p <= periodsPerDay; p++) {
                const pStartTime = this.addMinutes(startTime, (p - 1) * durationMin);
                const pEndTime = this.addMinutes(pStartTime, durationMin);
                const subjectIndex = (dayIndex * periodsPerDay + (p - 1)) % subjects.length;
                let selectedSubject = subjects[subjectIndex];
                let assignedTeacherId = selectedSubject.teacherId;
                let assignedTeacher = teachers.find(t => t.id === assignedTeacherId);
                const isBusy = assignedTeacherId ? busyMap[day][p].has(assignedTeacherId) : true;
                if (isBusy || !assignedTeacherId) {
                    let backupTeacher = teachers.find(t => t.id !== assignedTeacherId &&
                        !busyMap[day][p].has(t.id) &&
                        isExpert(t, selectedSubject.name));
                    if (backupTeacher) {
                        assignedTeacherId = backupTeacher.id;
                        assignedTeacher = backupTeacher;
                    }
                    else {
                        let selfStudySubject = subjects.find(s => s.name.toLowerCase() === 'self study');
                        if (!selfStudySubject) {
                            selfStudySubject = {
                                id: 'SELF-STUDY-TEMP',
                                name: 'Self Study',
                                code: 'SELF-STUDY',
                                classId,
                                teacherId: null,
                                createdAt: new Date(),
                                updatedAt: new Date()
                            };
                        }
                        selectedSubject = selfStudySubject;
                        const freeTeacher = teachers.find(t => !busyMap[day][p].has(t.id));
                        if (freeTeacher) {
                            assignedTeacherId = freeTeacher.id;
                            assignedTeacher = freeTeacher;
                        }
                        else {
                            const classTeacher = teachers.find(t => t.id === classRecord.classTeacherId);
                            if (classTeacher) {
                                assignedTeacherId = classTeacher.id;
                                assignedTeacher = classTeacher;
                            }
                            else {
                                throw new common_1.BadRequestException(`No free teachers available for Period ${p} on ${day} to resolve conflict.`);
                            }
                        }
                    }
                }
                if (assignedTeacherId) {
                    busyMap[day][p].add(assignedTeacherId);
                }
                generatedEntries.push({
                    dayOfWeek: day,
                    periodNumber: p,
                    startTime: pStartTime,
                    endTime: pEndTime,
                    subjectId: selectedSubject.id,
                    subject: {
                        id: selectedSubject.id,
                        name: selectedSubject.name,
                        code: selectedSubject.code,
                    },
                    teacherId: assignedTeacherId,
                    teacher: {
                        id: assignedTeacher?.id || '',
                        firstName: assignedTeacher?.firstName || '',
                        lastName: assignedTeacher?.lastName || '',
                    }
                });
            }
        }
        return generatedEntries;
    }
    async saveTimetable(institutionId, classId, entries) {
        const classRecord = await this.prisma.class.findFirst({
            where: { id: classId, institutionId }
        });
        if (!classRecord) {
            throw new common_1.NotFoundException('Class not found');
        }
        for (const entry of entries) {
            const conflict = await this.prisma.timetableEntry.findFirst({
                where: {
                    institutionId,
                    classId: { not: classId },
                    dayOfWeek: entry.dayOfWeek,
                    periodNumber: parseInt(entry.periodNumber),
                    teacherId: entry.teacherId
                },
                include: {
                    class: true,
                    teacher: true
                }
            });
            if (conflict) {
                throw new common_1.BadRequestException(`Conflict: Teacher ${conflict.teacher.firstName} ${conflict.teacher.lastName} is already assigned to ${conflict.class.name} on ${entry.dayOfWeek} Period ${entry.periodNumber}`);
            }
        }
        return this.prisma.$transaction(async (tx) => {
            await tx.timetableEntry.deleteMany({
                where: { classId, institutionId }
            });
            const created = [];
            for (const entry of entries) {
                let finalSubjectId = entry.subjectId;
                if (entry.subjectId === 'SELF-STUDY-TEMP' || entry.subject?.code === 'SELF-STUDY') {
                    let selfStudy = await tx.subject.findFirst({
                        where: { classId, name: 'Self Study' }
                    });
                    if (!selfStudy) {
                        selfStudy = await tx.subject.create({
                            data: {
                                name: 'Self Study',
                                code: 'SELF-STUDY',
                                classId,
                            }
                        });
                    }
                    finalSubjectId = selfStudy.id;
                }
                const item = await tx.timetableEntry.create({
                    data: {
                        classId,
                        subjectId: finalSubjectId,
                        teacherId: entry.teacherId,
                        dayOfWeek: entry.dayOfWeek,
                        periodNumber: parseInt(entry.periodNumber),
                        startTime: entry.startTime,
                        endTime: entry.endTime,
                        institutionId,
                    },
                    include: {
                        subject: {
                            select: { id: true, name: true, code: true }
                        },
                        teacher: {
                            select: { id: true, firstName: true, lastName: true }
                        }
                    }
                });
                created.push(item);
            }
            return created;
        });
    }
};
exports.TimetableService = TimetableService;
exports.TimetableService = TimetableService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TimetableService);
//# sourceMappingURL=timetable.service.js.map