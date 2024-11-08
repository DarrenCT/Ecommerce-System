export const transformToDataUri = (imageData) => {
    if (!imageData) return null;
    if (typeof imageData === 'string' && imageData.startsWith('data:image')) {
        return imageData;
    }
    if (imageData.$binary) {
        return `data:image/jpeg;base64,${imageData.$binary.base64}`;
    }
    return null;
}; 