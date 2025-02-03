import { v2 as cloudinary } from 'cloudinary';
 async function uploads(
    file,
    public_id,
    overwrite,
    invalidate
) {
    try {
        const result = await cloudinary.uploader.upload(file, {
            public_id,
            overwrite,
            invalidate,
            resource_type: 'auto' // zip, images
        });
        return result;
    } catch (error) {
        return error;
    }
}

async function videoUpload(
    file,
    public_id,
    overwrite,
    invalidate
) {
    try {
        const result = await cloudinary.uploader.upload(file, {
            public_id,
            overwrite,
            invalidate,
            chunk_size: 50000,
            resource_type: 'video'
        });
        return result;
    } catch (error) {
        return error;
    }
}

export {uploads,videoUpload} 
