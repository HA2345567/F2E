'use client'

import { MoodBoardImages, useMoodBoard } from "@/hooks/use-style"
import { cn } from "@/lib/utils"
import { ImageBoard } from "./images.board"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRef } from "react"



type Props = {
    guideImages: MoodBoardImages[]
}

const MoodBoard = ({ guideImages }: Props) => {
    const {
        images,
        dragActive,
        removeImage,
        handleDrag,
        handleDrop,
        handleFileInput,
        canAddMore,
    } = useMoodBoard(guideImages)

    const fileInputRef = useRef<HTMLInputElement>(null)
    const handleUploadClick = ()=>{
        fileInputRef.current?.click()
    }

    return (
        <div className="flex flex-col gap-10">
            <input 
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
            />
            <div
                className={cn(
                    'relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-200 min-h-[500px] flex items-center justify-center',
                    dragActive
                        ? 'border-primary bg-primary/5 scale-[1.02]'
                        : 'border-border/50 hover:border-border'
                )}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
            >
                <div className="absolute inset-0 opacity-5">
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-transparent rounded-3xl" />
                </div>
                {images.length > 0 && (
                    <>
                        <div className="lg:hidden absolute inset-0 flex items-center justify-center">
                            <div className="relative">
                                {images.map((image, index) => {
                                    const seed = image.id
                                        .split('')
                                        .reduce((a, b) => a + b.charCodeAt(0), 0)
                                    const random1 = ((seed * 9301 + 49297) % 233280) / 233280
                                    const random2 = ((seed + 1) * 9301 + 49297) % 233280 / 233280
                                    const random3 = ((seed + 2) * 9301 + 49297) % 233280 / 233280

                                    const rotation = (random1 - 0.5) * 20
                                    const xoffset = (random2 - 0.5) * 40
                                    const yoffset = (random3 - 0.5) * 30

                                    return (
                                        <ImageBoard
                                            key={`mobile-${image.storageId ?? image.id}-${index}`}
                                            image={image}
                                            removeImage={removeImage}
                                            xOffset={xoffset}
                                            yOffset={yoffset}
                                            rotation={rotation}
                                            zIndex={index + 1}
                                            marginLeft="-80px"
                                            marginTop="-96px"
                                        />
                                    )
                                })}

                            </div>
                            {images.length > 0 && (
                                <div className="absolute bottom-6 right-6 z-20">
                                    <Button 
                                    onClick={handleUploadClick}
                                    size="sm"
                                    variant="outline">
                                        <Upload  className="w-4 h-4 mr-2"/>
                                        Add More
                                    </Button>
                                </div>
                            )}
                        </div>
                         <div className="hidden lg:flex absolute inset-0 items-center justify-center">
                    <div className="relative w-full max-w-[700px] h-full flex items-center justify-center">
                        {images.map((image, index) => {
                            const seed = image.id
                                .split('')
                                .reduce((a, b) => a + b.charCodeAt(0), 0);
                            const random1 = ((seed * 9301 + 49297) % 233280) / 233280;
                            const random3 = ((seed + 2) * 9301 + 49297) % 233280 / 233280;

                            const imageWidth = 192;
                            const overlapAmount = 30;
                            const spacing = imageWidth - overlapAmount;  // Fixed typo here

                            const rotation = (random1 - 0.5) * 50;
                            const xoffset = (index * spacing) - ((images.length - 1) * spacing) / 2;  // Fixed calculation
                            const yoffset = (random3 - 0.5) * 30;
                            const zIndex = index + 1;

                            return (
                                <ImageBoard
                                    key={`desktop-${image.storageId ?? image.id}-${index}`}
                                    image={image}
                                    removeImage={() => removeImage(image.id)}
                                    xOffset={xoffset}
                                    yOffset={yoffset}
                                    rotation={rotation}
                                    zIndex={zIndex}
                                    marginLeft="-96px"
                                    marginTop="-112px"
                                />
                            );
                        })}

                        {images.length === 0 && (
                            <div className='relative z-10 space-y-6'>
                                <div className="mx-auto w-16 h-16 rounded-2xl bg-muted flex items-center justify-center ">
                                    <Upload className="w-8 h-8 text-muted-foreground"/>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-lg font-medium text-forground">
                                    Drop your imgages here

                                </h3>
                                <p className="text-sm text-muted-foreground mx-w-md mx-auto">
                                    Drag and drop up to 5 imgages to build your mood board
                                </p>

                            </div>
                            <Button
                            onClick={handleUploadClick}
                            variant="outline">
                                <Upload className="w-4 h-4 mr-2"/>
                                Choose Files

                            </Button>

                            </div>
                        )}
                        {/** desktop images and empty-state are rendered inside the relative container above. */}




                    </div>

                    {/* Floating desktop Add More button placed as a sibling to avoid stacking-context issues */}
                    {images.length > 0 && (
                        <div className="absolute  right-6 top-[87%] transform -translate-y-1/2 z-50">
                            <Button onClick={handleUploadClick} size="lg" variant="outline">
                                <Upload className="w-4 h-4 mr-2" />
                                Add More
                            </Button>
                        </div>
                    )}

                </div>
                    </>
                )}
               
            </div>
        </div>
    )
}

export default MoodBoard