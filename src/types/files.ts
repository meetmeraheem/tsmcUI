export type ReactFilesFile = File & {
    id: string;
    extension: string;
    sizeReadable: string;
    preview: {
        type: string;
        url?: string;
    };
    name:string
};

export type ReactFilesError = {
    code: ErrorCodeEnum;
    message: string;
};

enum ErrorCodeEnum {
    invalidFileType = 1,
    fileTooLarge = 2,
    fileTooSmall = 3,
    maximumFileCount = 4,
}
