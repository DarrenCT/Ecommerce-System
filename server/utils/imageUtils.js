export const transformToDataUri = (buffer) => {
    if (!buffer) return null;
    return `data:image/jpeg;base64,${buffer.toString('base64')}`;
}; 