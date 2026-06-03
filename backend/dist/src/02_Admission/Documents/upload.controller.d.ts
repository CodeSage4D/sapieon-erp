import { UploadService } from './upload.service';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadFile(file: any): Promise<{
        message: string;
        filename: string;
        url: string;
    }>;
    getFile(filename: string, req: any, res: any): Promise<any>;
}
