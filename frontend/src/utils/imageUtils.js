export const transformImageData = (imageData) => {
    if (!imageData) return 'https://via.placeholder.com/400';
    
    // If it's already a data URI
    if (typeof imageData === 'string' && imageData.startsWith('data:image')) {
        return imageData;
    }
    
    // Handle MongoDB Binary format
    if (imageData.$binary) {
        return `data:image/jpeg;base64,${imageData.$binary.base64}`;
    }
    
    // Handle Buffer or Buffer-like object
    if (imageData.type === 'Buffer' && imageData.data) {
        const buffer = new Uint8Array(imageData.data);
        const base64 = btoa(String.fromCharCode.apply(null, buffer));
        return `data:image/jpeg;base64,${base64}`;
    }
    
    return 'https://via.placeholder.com/400';
}; 