import { NoticeService } from './notice.service';
export declare class NoticeController {
    private noticeService;
    constructor(noticeService: NoticeService);
    getNotices(req: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        institutionId: string;
        title: string;
        content: string;
        targetRoles: string;
        authorName: string;
    }[]>;
    createNotice(req: any, body: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        institutionId: string;
        title: string;
        content: string;
        targetRoles: string;
        authorName: string;
    }>;
}
