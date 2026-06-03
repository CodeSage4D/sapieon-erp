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
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
const prisma = new client_1.PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
});
async function main() {
    console.log('Seeding Neon database with Indian Education schema...');
    await prisma.promotionHistory.deleteMany({});
    await prisma.notification.deleteMany({});
    await prisma.settings.deleteMany({});
    await prisma.auditLog.deleteMany({});
    await prisma.document.deleteMany({});
    await prisma.timelineEvent.deleteMany({});
    await prisma.examResult.deleteMany({});
    await prisma.payment.deleteMany({});
    await prisma.studentFeeAllocation.deleteMany({});
    await prisma.attendance.deleteMany({});
    await prisma.leaveRequest.deleteMany({});
    await prisma.lessonPlan.deleteMany({});
    await prisma.bookIssue.deleteMany({});
    await prisma.payroll.deleteMany({});
    await prisma.visitor.deleteMany({});
    await prisma.inventoryItem.deleteMany({});
    await prisma.timetableEntry.deleteMany({});
    await prisma.expense.deleteMany({});
    await prisma.notice.deleteMany({});
    await prisma.student.deleteMany({});
    await prisma.parent.deleteMany({});
    await prisma.book.deleteMany({});
    await prisma.exam.deleteMany({});
    await prisma.subject.deleteMany({});
    await prisma.class.deleteMany({});
    await prisma.feeStructure.deleteMany({});
    await prisma.branch.deleteMany({});
    await prisma.staff.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.institution.deleteMany({});
    const passwordHash = await bcrypt.hash('password123', 10);
    const institution = await prisma.institution.create({
        data: {
            name: 'Delhi Public School, Sector 4',
            logoUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=200',
            primaryColor: '#0284c7',
        },
    });
    const defaultBranch = await prisma.branch.create({
        data: {
            name: 'Delhi Public School Dwarka Campus',
            code: 'DPS-DWK',
            address: 'Sector 4, Dwarka',
            city: 'New Delhi',
            state: 'Delhi',
            pinCode: '110078',
            phone: '+91 11 25074472',
            institutionId: institution.id,
        },
    });
    await prisma.settings.create({
        data: {
            institutionId: institution.id,
            academicYear: '2026-2027',
            gradingSystem: 'CBSE',
            timezone: 'Asia/Kolkata',
            currency: 'INR',
        },
    });
    const adminUser = await prisma.user.create({
        data: {
            email: 'admin@aurxon.com',
            passwordHash,
            role: 'INSTITUTE_ADMIN',
            institutionId: institution.id,
        },
    });
    await prisma.notification.create({
        data: {
            userId: adminUser.id,
            title: 'Welcome to AURXON ERP Lite',
            content: 'Your school management platform is ready. Dwarka main branch registered successfully.',
        },
    });
    const teacherUser1 = await prisma.user.create({
        data: {
            email: 'teacher1@aurxon.com',
            passwordHash,
            role: 'TEACHER',
            institutionId: institution.id,
        },
    });
    const teacherStaff1 = await prisma.staff.create({
        data: {
            userId: teacherUser1.id,
            employeeId: 'EMP-DEL-201',
            firstName: 'Sarah',
            lastName: 'Connor',
            phone: '+91 9876543210',
            designation: 'TEACHER',
            joiningDate: new Date('2024-08-15'),
            salary: 55000,
            institutionId: institution.id,
            branchId: defaultBranch.id,
        },
    });
    const teacherUser2 = await prisma.user.create({
        data: {
            email: 'teacher2@aurxon.com',
            passwordHash,
            role: 'TEACHER',
            institutionId: institution.id,
        },
    });
    const teacherStaff2 = await prisma.staff.create({
        data: {
            userId: teacherUser2.id,
            employeeId: 'EMP-DEL-202',
            firstName: 'John',
            lastName: 'Keating',
            phone: '+91 9876543211',
            designation: 'TEACHER',
            joiningDate: new Date('2025-01-10'),
            salary: 60000,
            institutionId: institution.id,
            branchId: defaultBranch.id,
        },
    });
    const accountantUser = await prisma.user.create({
        data: {
            email: 'accountant@aurxon.com',
            passwordHash,
            role: 'ACCOUNTANT',
            institutionId: institution.id,
        },
    });
    const accountantStaff = await prisma.staff.create({
        data: {
            userId: accountantUser.id,
            employeeId: 'EMP-DEL-203',
            firstName: 'Robert',
            lastName: 'Kiyosaki',
            phone: '+91 9876543212',
            designation: 'ACCOUNTANT',
            joiningDate: new Date('2024-09-01'),
            salary: 48000,
            institutionId: institution.id,
            branchId: defaultBranch.id,
        },
    });
    const class10A = await prisma.class.create({
        data: {
            name: 'Grade 10-A',
            section: 'A',
            stream: 'General',
            board: 'CBSE',
            classTeacherId: teacherStaff1.id,
            institutionId: institution.id,
            branchId: defaultBranch.id,
        },
    });
    const class11Sci = await prisma.class.create({
        data: {
            name: 'Grade 11-Science',
            section: 'A',
            stream: 'Science',
            board: 'CBSE',
            classTeacherId: teacherStaff2.id,
            institutionId: institution.id,
            branchId: defaultBranch.id,
        },
    });
    const math = await prisma.subject.create({
        data: {
            name: 'Mathematics (041)',
            code: 'MATH101',
            classId: class10A.id,
            teacherId: teacherStaff1.id,
        },
    });
    const physics = await prisma.subject.create({
        data: {
            name: 'Physics (042)',
            code: 'PHYS101',
            classId: class11Sci.id,
            teacherId: teacherStaff2.id,
        },
    });
    const parentUser = await prisma.user.create({
        data: {
            email: 'parent@aurxon.com',
            passwordHash,
            role: 'PARENT',
            institutionId: institution.id,
        },
    });
    const parentProfile = await prisma.parent.create({
        data: {
            userId: parentUser.id,
            firstName: 'David',
            lastName: 'Miller',
            phone: '+91 9988776655',
            occupation: 'General Manager, SBI',
            address: 'House 42, Sector 15, Dwarka, New Delhi',
        },
    });
    const studentUser1 = await prisma.user.create({
        data: {
            email: 'student@aurxon.com',
            passwordHash,
            role: 'STUDENT',
            institutionId: institution.id,
        },
    });
    const student1 = await prisma.student.create({
        data: {
            userId: studentUser1.id,
            scholarNumber: 'SCH-2026-0001',
            rollNumber: '10101',
            firstName: 'Alice',
            lastName: 'Miller',
            dateOfBirth: new Date('2010-05-14'),
            gender: 'FEMALE',
            aadhaarNumber: '541275896324',
            samagraId: 'SSM-102547',
            familyId: 'FAM-541289',
            casteCategory: 'GENERAL',
            bankName: 'State Bank of India',
            accHolderName: 'Alice Miller',
            accNumber: '32145698712',
            ifscCode: 'SBIN0004520',
            bankBranch: 'Dwarka Sector 15',
            houseNo: 'House 42',
            street: 'Sector 15, Dwarka',
            city: 'New Delhi',
            district: 'South West Delhi',
            state: 'Delhi',
            pinCode: '110075',
            parentId: parentProfile.id,
            classId: class10A.id,
            institutionId: institution.id,
            branchId: defaultBranch.id,
        },
    });
    const studentUser2 = await prisma.user.create({
        data: {
            email: 'student2@aurxon.com',
            passwordHash,
            role: 'STUDENT',
            institutionId: institution.id,
        },
    });
    const student2 = await prisma.student.create({
        data: {
            userId: studentUser2.id,
            scholarNumber: 'SCH-2026-0002',
            rollNumber: '10102',
            firstName: 'Bob',
            lastName: 'Singh',
            dateOfBirth: new Date('2010-11-22'),
            gender: 'MALE',
            aadhaarNumber: '984512763459',
            samagraId: 'SSM-102548',
            familyId: 'FAM-541290',
            casteCategory: 'OBC',
            bankName: 'Punjab National Bank',
            accHolderName: 'Bob Singh',
            accNumber: '5412896324578',
            ifscCode: 'PUNB0124500',
            bankBranch: 'Uttam Nagar',
            houseNo: 'Flat 304',
            street: 'Uttam Nagar Block C',
            city: 'New Delhi',
            district: 'West Delhi',
            state: 'Delhi',
            pinCode: '110059',
            classId: class10A.id,
            institutionId: institution.id,
            branchId: defaultBranch.id,
        },
    });
    const studentUser3 = await prisma.user.create({
        data: {
            email: 'student3@aurxon.com',
            passwordHash,
            role: 'STUDENT',
            institutionId: institution.id,
        },
    });
    const student3 = await prisma.student.create({
        data: {
            userId: studentUser3.id,
            scholarNumber: 'SCH-2026-0003',
            rollNumber: '11101',
            firstName: 'Charlie',
            lastName: 'Sharma',
            dateOfBirth: new Date('2009-02-28'),
            gender: 'MALE',
            aadhaarNumber: '124578963214',
            samagraId: 'SSM-102549',
            familyId: 'FAM-541291',
            casteCategory: 'GENERAL',
            bankName: 'HDFC Bank',
            accHolderName: 'Charlie Sharma',
            accNumber: '5010045214896',
            ifscCode: 'HDFC0001201',
            bankBranch: 'Janakpuri',
            houseNo: 'Sector 3A, Qtr 12',
            street: 'Janakpuri East',
            city: 'New Delhi',
            district: 'West Delhi',
            state: 'Delhi',
            pinCode: '110058',
            classId: class11Sci.id,
            institutionId: institution.id,
            branchId: defaultBranch.id,
        },
    });
    const studentUser4 = await prisma.user.create({
        data: {
            email: 'student4@aurxon.com',
            passwordHash,
            role: 'STUDENT',
            institutionId: institution.id,
        },
    });
    const student4 = await prisma.student.create({
        data: {
            userId: studentUser4.id,
            scholarNumber: 'SCH-2026-0004',
            rollNumber: '10104',
            firstName: 'Deepak',
            lastName: 'Kumar',
            dateOfBirth: new Date('2010-08-15'),
            gender: 'MALE',
            aadhaarNumber: '125478963254',
            samagraId: 'SSM-102550',
            familyId: 'FAM-541292',
            casteCategory: 'SC',
            bankName: 'Canara Bank',
            accHolderName: 'Deepak Kumar',
            accNumber: '40125896325',
            ifscCode: 'CNRB0001201',
            bankBranch: 'Dwarka Sector 4',
            houseNo: 'Flat 101',
            street: 'Block D, Sector 4',
            city: 'New Delhi',
            district: 'South West Delhi',
            state: 'Delhi',
            pinCode: '110078',
            classId: class10A.id,
            institutionId: institution.id,
            branchId: defaultBranch.id,
        },
    });
    await prisma.timelineEvent.create({
        data: {
            studentId: student1.id,
            type: 'ADMISSION',
            description: 'Enrolled under Scholar No. SCH-2026-0001 with SSSMID verification.',
        },
    });
    const dates = [new Date('2026-05-25'), new Date('2026-05-26'), new Date('2026-05-27')];
    for (const date of dates) {
        await prisma.attendance.create({
            data: {
                studentId: student1.id,
                date,
                status: 'PRESENT',
                recordedById: teacherStaff1.id,
            },
        });
        await prisma.attendance.create({
            data: {
                studentId: student2.id,
                date,
                status: date.getDate() === 26 ? 'ABSENT' : 'PRESENT',
                recordedById: teacherStaff1.id,
            },
        });
        await prisma.attendance.create({
            data: {
                studentId: student4.id,
                date,
                status: date.getDate() === 25 ? 'PRESENT' : 'ABSENT',
                recordedById: teacherStaff1.id,
            },
        });
    }
    const quarter1Fee = await prisma.feeStructure.create({
        data: {
            name: 'Quarter 1 Tuition Fee',
            amount: 24000,
            dueDate: new Date('2026-06-15'),
            description: 'Tuition Fee collection for Grade 10/11 CBSE Term 1',
            institutionId: institution.id,
        },
    });
    const labExamFee = await prisma.feeStructure.create({
        data: {
            name: 'CBSE Physics Lab Exam Fee',
            amount: 3500,
            dueDate: new Date('2026-06-30'),
            description: 'Physics practical board laboratory cost allocation',
            institutionId: institution.id,
        },
    });
    const alloc1 = await prisma.studentFeeAllocation.create({
        data: {
            studentId: student1.id,
            feeStructureId: quarter1Fee.id,
            amountDue: 24000,
            amountPaid: 24000,
            status: 'PAID',
        },
    });
    const alloc2 = await prisma.studentFeeAllocation.create({
        data: {
            studentId: student2.id,
            feeStructureId: quarter1Fee.id,
            amountDue: 24000,
            amountPaid: 8000,
            status: 'PARTIAL',
        },
    });
    const alloc3 = await prisma.studentFeeAllocation.create({
        data: {
            studentId: student3.id,
            feeStructureId: quarter1Fee.id,
            amountDue: 24000,
            amountPaid: 0,
            status: 'UNPAID',
        },
    });
    await prisma.payment.create({
        data: {
            allocationId: alloc1.id,
            amount: 24000,
            paymentMethod: 'ONLINE',
            receiptNumber: 'RCPT-DEL-001',
            remarks: 'Paid via BHIM UPI',
        },
    });
    await prisma.payment.create({
        data: {
            allocationId: alloc2.id,
            amount: 8000,
            paymentMethod: 'CASH',
            receiptNumber: 'RCPT-DEL-002',
            remarks: 'Cash counter collection',
        },
    });
    const algebraExam = await prisma.exam.create({
        data: {
            name: 'CBSE Mathematics Mid-Term',
            examType: 'HALF_YEARLY',
            subjectId: math.id,
            maxMarks: 80,
            internalMarks: 20,
            examDate: new Date('2026-04-10'),
        },
    });
    await prisma.examResult.create({
        data: {
            examId: algebraExam.id,
            studentId: student1.id,
            marksObtained: 74,
            remarks: 'Excellent logical skills',
        },
    });
    await prisma.examResult.create({
        data: {
            examId: algebraExam.id,
            studentId: student2.id,
            marksObtained: 52,
            remarks: 'Needs improvement in algebra theorems',
        },
    });
    await prisma.examResult.create({
        data: {
            examId: algebraExam.id,
            studentId: student4.id,
            marksObtained: 22,
            remarks: 'Struggles with basics, requires focus sessions.',
        },
    });
    await prisma.notice.create({
        data: {
            title: 'CBSE Board Examination Subject Verification',
            content: 'All class 10 & 11 students must verify their registered CBSE board exam subjects and verify details in the administrative office before June 10th.',
            targetRoles: 'STUDENT,PARENT,TEACHER',
            institutionId: institution.id,
            authorName: 'Sarah Connor',
        },
    });
    await prisma.lessonPlan.create({
        data: {
            title: 'Polynomials & Quadratic Equations',
            content: 'Explain factorization, remainder theorem, and plotting quadratic curves.',
            status: 'COMPLETED',
            syllabusPercent: 35,
            subjectId: math.id,
            teacherId: teacherStaff1.id,
        },
    });
    await prisma.lessonPlan.create({
        data: {
            title: 'Trigonometric Identities',
            content: 'Derive complementary angles and apply identities to solve heights and distances.',
            status: 'IN_PROGRESS',
            syllabusPercent: 15,
            subjectId: math.id,
            teacherId: teacherStaff1.id,
        },
    });
    await prisma.expense.create({
        data: {
            title: 'Monthly High-Speed Fiber Internet Connection',
            amount: 4500,
            category: 'UTILITY',
            paymentMethod: 'UPI',
            institutionId: institution.id,
        },
    });
    await prisma.expense.create({
        data: {
            title: 'Smart Board Digital Classroom Projector Repair',
            amount: 12000,
            category: 'MAINTENANCE',
            paymentMethod: 'BANK_TRANSFER',
            institutionId: institution.id,
        },
    });
    await prisma.expense.create({
        data: {
            title: 'Administrative Office Stationery Supplies',
            amount: 3200,
            category: 'MAINTENANCE',
            paymentMethod: 'CASH',
            institutionId: institution.id,
        },
    });
    console.log('Indian Education database seeding successfully finished!');
}
main()
    .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map