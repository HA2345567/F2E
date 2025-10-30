
import { useMutation } from "convex/react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";

// src/hooks/use-style.ts
export interface MoodBoardImages {
    id: string;
    file?: File;
    preview: string;
    storageId?: string;
    uploaded: boolean;
    uploading: boolean;
    error?: string;
    url?: string;
    isFormServer?: boolean;
}

interface StyleFormData {
    images: MoodBoardImages[]
}

export const useMoodBoard = ({ guideImages }: { guideImages: MoodBoardImages[] }) => {
    const [dragActive, setDragActive] = useState(false)
    const searchParams = useSearchParams()
    const projectId = searchParams.get('project')

    const form = useForm<StyleFormData>({
        defaultValues: {
            images: guideImages
        }
    })
    const { watch, setValue, getValues } = form
    const images = watch('images')

    const generateUploadUrl = useMutation(api.moodboard.generateUploadUrl)
    const removeMoodBoardImage = useMutation(api.moodboard.removeMoodBoardImage)
    const addMoodBoardImage = useMutation(api.moodboard.addMoodBoardImage)

    const uploadImage = async (
        file: File | undefined
    ): Promise<{ storageId: Id<'_storage'>; url: string }> => {
        if (!file) {
            throw new Error('No file provided for upload');
        }

        try {
            // First get the upload URL
            const uploadUrl = await generateUploadUrl()

            // Upload the file to the URL using POST
            const result = await fetch(uploadUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': file.type || 'application/octet-stream'
                },
                body: file
            })

            if (!result.ok) {
                const errorText = await result.text();
                console.error('Upload failed:', {
                    status: result.status,
                    statusText: result.statusText,
                    error: errorText
                });
                throw new Error(`Failed to upload image: ${result.status} ${result.statusText}`);
            }

            const response = await result.json();
            const { storageId, url } = response;

            if (!storageId) {
                console.error('Invalid response from server:', response);
                throw new Error('Invalid response from server: missing storageId');
            }

            // If we have a projectId, associate the image with the project
            if (projectId && storageId) {
                try {
                    await addMoodBoardImage({
                        projectId: projectId as Id<'projects'>,
                        storageId: storageId as Id<'_storage'>
                    });
                } catch (error) {
                    console.error('Failed to add image to project:', error);
                    // Continue even if adding to project fails
                }
            }

            return { storageId, url: url || '' };
        } catch (error) {
            console.error('Failed to upload image:', error);
            throw error instanceof Error ? error : new Error('Failed to upload image');
        }
    }

    useEffect(() => {
        if (guideImages && guideImages.length > 0) {
            const serverImages: MoodBoardImages[] = guideImages.map((img: any) => ({
                id: img.id,
                file: img.file,
                preview: img.preview,
                storageId: img.storageId,
                uploaded: true,
                uploading: false,
                error: img.error,
                url: img.url,
                isFormServer: true,
            }))
            const currentImages = getValues('images')

            if (currentImages.length === 0) {
                setValue('images', serverImages)
            } else {
                const mergedImages = [...currentImages]
                serverImages.forEach((serverImg) => {
                    const clientIndex = mergedImages.findIndex(
                        (clientImg) => clientImg.storageId === serverImg.storageId
                    )
                    if (clientIndex !== -1) {
                        const preview = mergedImages[clientIndex]?.preview;
                        if (preview?.startsWith?.('blob:')) {
                            URL.revokeObjectURL(preview);
                        }
                        mergedImages[clientIndex] = serverImg
                    }
                })
                setValue('images', mergedImages)
            }
        }
    }, [guideImages, setValue, getValues])
    const addImage = (file: File) => {
        if (images.length >= 5) {
            toast.error('Maximum 5 images allowed')
            return
        }
        const newImage: MoodBoardImages = {
            id: `${Date.now()}-${Math.random()}`,
            file,
            preview: URL.createObjectURL(file),
            uploaded: false,
            uploading: false,
            isFormServer: false,
        }

        const updatedImages = [...images, newImage]
        setValue('images', updatedImages)
        toast.success('Image added successfully')
    }
    const removeImage = async (imageId: string) => {

        const imagetoRemove = images.find((img) => img.id === imageId)
        if (!imagetoRemove) return

        if (imagetoRemove.isFormServer && imagetoRemove.storageId && projectId) {
            try {
                await removeMoodBoardImage({
                    projectId: projectId as Id<'projects'>,
                    storageId: imagetoRemove.storageId as Id<'_storage'>
                })

            } catch (error) {
                toast.error('Failed to remove image')
                return
            }

        }

        const updatedImages = images.filter((img) => {
            if (img.id === imageId) {
                // Clean up object URL if it's a blob URL
                const preview = img?.preview;
                if (!img.isFormServer && preview?.startsWith?.('blob:')) {
                    URL.revokeObjectURL(preview);
                }
                return false; // Exclude this image
            }
            return true; // Keep other images
        });

        setValue('images', updatedImages);
        toast.success('Image removed successfully');
    }

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        const files = Array.from(e.dataTransfer.files)
        const imagesFiles = files.filter((file) => file.type.startsWith('image/'))

        if (imagesFiles.length === 0) {
            toast.error('No image files found')
            return
        }

        if (imagesFiles.length > 5) {
            toast.error('Maximum 5 images allowed')
            return
        }

        imagesFiles.forEach((file) => {
            addImage(file)
        })
    }

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        files.forEach((file) => addImage(file))

        e.target.value = ''
    }

    useEffect(() => {
        let isMounted = true;

        const uploadPendingImages = async () => {
            let currentImages = [...getValues('images')];
            let hasChanges = false;

            for (let i = 0; i < currentImages.length; i++) {
                if (!isMounted) return;
                
                const image = currentImages[i];

                // Skip if already uploaded, uploading, or has error
                if (image.uploaded || image.uploading || image.error) continue;

                try {
                    // Mark as uploading
                    const updatedImages = [...getValues('images')];
                    const currentIndex = updatedImages.findIndex(img => img.id === image.id);
                    
                    if (currentIndex === -1) continue;
                    
                    updatedImages[currentIndex] = {
                        ...updatedImages[currentIndex],
                        uploading: true,
                        error: undefined
                    };
                    setValue('images', updatedImages);

                    // Upload the image
                    const { storageId, url } = await uploadImage(image.file);
                    
                    if (!isMounted) return;
                    
                    // Update with the uploaded data
                    const finalImages = [...getValues('images')];
                    const finalIndex = finalImages.findIndex(img => img.id === image.id);
                    
                    if (finalIndex !== -1) {
                        finalImages[finalIndex] = {
                            ...finalImages[finalIndex],
                            storageId,
                            url,
                            uploaded: true,
                            uploading: false,
                            isFormServer: true,
                            error: undefined
                        };
                        setValue('images', finalImages);
                    }
                } catch (error) {
                    if (!isMounted) return;
                    
                    console.error('Error uploading image:', error);
                    const errorImages = [...getValues('images')];
                    const errorIndex = errorImages.findIndex(img => img.id === image.id);
                    
                    if (errorIndex !== -1) {
                        errorImages[errorIndex] = {
                            ...errorImages[errorIndex],
                            uploading: false,
                            error: 'Upload failed',
                            uploaded: false
                        };
                        setValue('images', errorImages);
                    }
                }
            }
        };

        if (images.length > 0) {
            uploadPendingImages();
        }

        return () => {
            isMounted = false;
        };
    }, [images, getValues, setValue, uploadImage]);

    useEffect(() => {
        return () => {
            images.forEach((image) => {
                if (image.preview && image.preview.startsWith('blob:')) {
                    URL.revokeObjectURL(image.preview);
                }
            });
        };
    }, [images]);
    return {
        form,
        images,
        dragActive,
        addImage,
        removeImage,
        handleDrag,
        handleDrop,
        handleFileInput,
        canAddMore: images.length < 5,
    }
}
