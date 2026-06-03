import { NotificationService } from './notification.service';
export declare class NotificationController {
    private notificationService;
    constructor(notificationService: NotificationService);
    findAll(req: any): Promise<{
        id: string;
        createdAt: Date;
        title: string;
        content: string;
        isRead: boolean;
        userId: string;
    }[]>;
    markAllRead(req: any): Promise<import(".prisma/client").Prisma.BatchPayload>;
}
