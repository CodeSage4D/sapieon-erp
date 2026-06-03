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
exports.LibraryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../01_Core/prisma/prisma.service");
let LibraryService = class LibraryService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getBooks(institutionId, search) {
        const where = { institutionId };
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { author: { contains: search, mode: 'insensitive' } },
                { isbn: { contains: search, mode: 'insensitive' } },
            ];
        }
        return this.prisma.book.findMany({
            where,
            orderBy: { title: 'asc' },
        });
    }
    async getBookById(institutionId, id) {
        const book = await this.prisma.book.findFirst({
            where: { id, institutionId },
        });
        if (!book) {
            throw new common_1.NotFoundException('Book not found');
        }
        return book;
    }
    async createBook(institutionId, data) {
        const existing = await this.prisma.book.findFirst({
            where: { isbn: data.isbn, institutionId },
        });
        if (existing) {
            throw new common_1.BadRequestException('A book with this ISBN already exists in your library');
        }
        return this.prisma.book.create({
            data: {
                title: data.title,
                author: data.author,
                isbn: data.isbn,
                totalCopies: parseInt(data.totalCopies) || 1,
                availableCopies: parseInt(data.totalCopies) || 1,
                institutionId,
            },
        });
    }
    async updateBook(institutionId, id, data) {
        const book = await this.getBookById(institutionId, id);
        const totalCopies = data.totalCopies !== undefined ? parseInt(data.totalCopies) : book.totalCopies;
        const diff = totalCopies - book.totalCopies;
        const availableCopies = Math.max(0, book.availableCopies + diff);
        return this.prisma.book.update({
            where: { id },
            data: {
                title: data.title !== undefined ? data.title : book.title,
                author: data.author !== undefined ? data.author : book.author,
                isbn: data.isbn !== undefined ? data.isbn : book.isbn,
                totalCopies,
                availableCopies,
            },
        });
    }
    async deleteBook(institutionId, id) {
        await this.getBookById(institutionId, id);
        return this.prisma.book.delete({
            where: { id },
        });
    }
    async getIssues(institutionId) {
        return this.prisma.bookIssue.findMany({
            where: {
                book: { institutionId },
            },
            include: {
                book: true,
                student: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        scholarNumber: true,
                        rollNumber: true,
                        class: { select: { name: true, section: true } },
                    },
                },
            },
            orderBy: { issueDate: 'desc' },
        });
    }
    async getStudentIssues(studentId) {
        return this.prisma.bookIssue.findMany({
            where: { studentId },
            include: {
                book: true,
            },
            orderBy: { issueDate: 'desc' },
        });
    }
    async issueBook(institutionId, data) {
        const book = await this.prisma.book.findFirst({
            where: { id: data.bookId, institutionId },
        });
        if (!book) {
            throw new common_1.NotFoundException('Book not found');
        }
        if (book.availableCopies <= 0) {
            throw new common_1.BadRequestException('No copies of this book are currently available');
        }
        const student = await this.prisma.student.findFirst({
            where: { id: data.studentId, institutionId },
        });
        if (!student) {
            throw new common_1.NotFoundException('Student not found');
        }
        const existingIssue = await this.prisma.bookIssue.findFirst({
            where: {
                studentId: data.studentId,
                bookId: data.bookId,
                status: 'ISSUED',
            },
        });
        if (existingIssue) {
            throw new common_1.BadRequestException('This book is already issued to this student');
        }
        return this.prisma.$transaction(async (tx) => {
            const issue = await tx.bookIssue.create({
                data: {
                    studentId: data.studentId,
                    bookId: data.bookId,
                    status: 'ISSUED',
                },
                include: {
                    book: true,
                    student: true,
                },
            });
            await tx.book.update({
                where: { id: data.bookId },
                data: {
                    availableCopies: {
                        decrement: 1,
                    },
                },
            });
            return issue;
        });
    }
    async returnBook(institutionId, issueId) {
        const issue = await this.prisma.bookIssue.findUnique({
            where: { id: issueId },
            include: { book: true },
        });
        if (!issue || issue.book.institutionId !== institutionId) {
            throw new common_1.NotFoundException('Book issue record not found');
        }
        if (issue.status === 'RETURNED') {
            throw new common_1.BadRequestException('Book has already been returned');
        }
        return this.prisma.$transaction(async (tx) => {
            const updatedIssue = await tx.bookIssue.update({
                where: { id: issueId },
                data: {
                    status: 'RETURNED',
                    returnDate: new Date(),
                },
                include: {
                    book: true,
                    student: true,
                },
            });
            await tx.book.update({
                where: { id: issue.bookId },
                data: {
                    availableCopies: {
                        increment: 1,
                    },
                },
            });
            return updatedIssue;
        });
    }
};
exports.LibraryService = LibraryService;
exports.LibraryService = LibraryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LibraryService);
//# sourceMappingURL=library.service.js.map