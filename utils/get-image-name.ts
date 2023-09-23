import { Job } from '@interface/job.interface.ts';

export const getImageName = (image: Job['image']): string => {
    if (image === undefined) {
        console.error('Image is undefined.');
        process.exit(1);
    }
    const isImageString = (x: Job['image']): x is string => { return typeof x === 'string'; };

    return isImageString(image) ? image : image.name;
};
