export const isLessThanTheMB = (fileSize: number, smallerThanSizeMB: number) => {
    try {
        const isOk = fileSize / (1024 * 1024) < smallerThanSizeMB;
        return isOk;
    } catch (error) {
        console.log('file upload Error', error);
    }
};
