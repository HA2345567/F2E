import { useMutation } from "convex/react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";
import { useForm } from "react-hook-form";

// Types
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
  images: MoodBoardImages[];
}

export const useMoodBoard = (guideImages: MoodBoardImages[]) => {
  const [dragActive, setDragActive] = useState(false);
  const searchParams = useSearchParams();
  const projectId = searchParams.get("project");

  const form = useForm<StyleFormData>({
    defaultValues: {
      images: [],
    },
  });

  const { watch, setValue, getValues } = form;
  const images = watch("images");

  // Mutations (no naming collisions with local functions)
  const generateUploadUrl = useMutation(api.moodboard.generateUploadUrl);
  const removeMoodBoardImage = useMutation(api.moodboard.removeMoodBoardImage);
  const addMoodBoardImageMutation = useMutation(api.moodboard.addMoodBoardImage);

  const uploadImage = async (file: File): Promise<{ storageId: string; url?: string }> => {
    try {
      // server may expect body: file or formdata or a PUT — keep as POST with raw body as original code
      const uploadUrl = await generateUploadUrl();

      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!result.ok) {
        throw new Error(`Upload failed: ${result.status} ${result.statusText}`);
      }

      const json = await result.json();
      const { storageId, url } = json;

      // If projectId exists, save mapping on server
      if (projectId) {
        await addMoodBoardImageMutation({
          projectId: projectId as Id<"projects">,
          storageId: storageId as Id<"_storage">,
        });
      }

      return { storageId, url };
    } catch (err) {
      console.error("uploadImage error:", err);
      // rethrow so callers can handle (important!)
      throw err;
    }
  };

  // Sync server-provided guideImages into form values
  useEffect(() => {
    if (guideImages && guideImages.length > 0) {
      const serverImages: MoodBoardImages[] = guideImages.map((img: any) => ({
        id: img.id,
        preview: img.url,
        storageId: img.storageId,
        uploaded: true,
        uploading: false,
        url: img.url,
        isFormServer: true,
      }));

      const currentImages = getValues("images") || [];
      if (currentImages.length === 0) {
        setValue("images", serverImages);
      } else {
        // Merge server images into client images (replace matches by storageId)
        const mergedImages = [...currentImages];
        serverImages.forEach((serverImg) => {
          const clientIndex = mergedImages.findIndex((clientImg) => clientImg.storageId === serverImg.storageId);
          if (clientIndex !== -1) {
            // cleanup blob preview if replaced by server url
            if (mergedImages[clientIndex].preview?.startsWith?.("blob:")) {
              try {
                URL.revokeObjectURL(mergedImages[clientIndex].preview);
              } catch {}
            }
            mergedImages[clientIndex] = serverImg;
          } else {
            // If server image not present in client array, push it (optional behavior)
            mergedImages.push(serverImg);
          }
        });
        setValue("images", mergedImages);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guideImages, setValue]);

  const addImage = (file: File) => {
    const currentImages = getValues("images") || [];
    if (currentImages.length >= 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    const newImage: MoodBoardImages = {
      id: `${Date.now()}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
      uploaded: false,
      uploading: false,
      isFormServer: false,
    };

    const updatedImages = [...currentImages, newImage];
    setValue("images", updatedImages);
    toast.success("Image added to mood board");
  };

  const removeImage = async (imageId: string) => {
    const currentImages = getValues("images") || [];
    const imageToRemove = currentImages.find((img) => img.id === imageId);
    if (!imageToRemove) return;

    if (imageToRemove.isFormServer && imageToRemove.storageId && projectId) {
      try {
        await removeMoodBoardImage({
          projectId: projectId as Id<"projects">,
          storageId: imageToRemove.storageId as Id<"_storage">,
        });
      } catch (error) {
        console.error("removeImage error:", error);
        toast.error("Failed to remove image from server");
        return;
      }
    }

    const updatedImages = currentImages.filter((img) => {
      if (img.id === imageId) {
        if (!img.isFormServer && img.preview.startsWith("blob:")) {
          try {
            URL.revokeObjectURL(img.preview);
          } catch {}
        }
        return false;
      }
      return true;
    });

    setValue("images", updatedImages);
    toast.success("Image removed");
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files || []);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length === 0) {
      toast.error("Please drop image files only");
      return;
    }

    const currentImages = getValues("images") || [];
    imageFiles.forEach((file) => {
      if ((getValues("images") || []).length < 5) {
        addImage(file);
      } else {
        toast.error("Maximum 5 images allowed");
      }
    });
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => addImage(file));
    e.target.value = "";
  };

  // Upload pending images whenever images changes
  useEffect(() => {
    let cancelled = false;

    const uploadPendingImages = async () => {
      const currentImages = getValues("images") || [];
      // iterate by index to keep updating correct position
      for (let i = 0; i < currentImages.length; i++) {
        if (cancelled) return;
        const image = currentImages[i];
        if (!image.uploaded && !image.uploading && !image.error) {
          const updatedImages = [...(getValues("images") || [])];
          updatedImages[i] = { ...image, uploading: true };
          setValue("images", updatedImages);

          try {
            const { storageId, url } = await uploadImage(image.file!);

            // reload latest images and update the one that matches id
            const finalImages = getValues("images") || [];
            const finalIndex = finalImages.findIndex((img) => img.id === image.id);
            if (finalIndex !== -1) {
              finalImages[finalIndex] = {
                ...finalImages[finalIndex],
                storageId,
                url,
                uploaded: true,
                uploading: false,
                isFormServer: true,
              };
              setValue("images", [...finalImages]);
            }
          } catch (error) {
            console.error("uploadPendingImages error:", error);
            const errorImages = getValues("images") || [];
            const errorIndex = errorImages.findIndex((img) => img.id === image.id);
            if (errorIndex !== -1) {
              errorImages[errorIndex] = {
                ...errorImages[errorIndex],
                uploading: false,
                error: "Upload failed",
              };
              setValue("images", [...errorImages]);
            }
          }
        }
      }
    };

    if ((getValues("images") || []).length > 0) {
      uploadPendingImages();
    }

    return () => {
      cancelled = true;
    };
    // we intentionally depend on images so uploads run when images change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images, setValue, getValues, uploadImage, projectId]);

  // cleanup blob object URLs on unmount
  useEffect(() => {
    return () => {
      const current = getValues("images") || [];
      current.forEach((img: MoodBoardImages) => {
        if (!img.isFormServer && img.preview?.startsWith?.("blob:")) {
          try {
            URL.revokeObjectURL(img.preview);
          } catch {}
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper to check if more images can be added
  const canAddMore = (getValues("images") || []).length < 5;

  // Expose what's needed from the hook
  return {
    form,
    images,
    dragActive,
    addImage,
    removeImage,
    handleDrag,
    handleDrop,
    handleFileInput,
    canAddMore,
  };
};
