import { cn } from "@/lib/utils"
import { ColorSwatch } from "../swatch"

type Props={
    title: string,
    swatches: Array<{
        name: string
        value: string
        description?: string
    }>
    className?: string
}
export const ColorTheme=({title, swatches,className}:Props)=>{
    return(
        <div className={cn('flex flex-col gap-5 ', className)}>
            <div >
                <h3 className="text-lg font-medium text-foreground mb-4">
                    {title}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
                    {swatches.map((swatch)=>(
                        <div key={swatch.name} >
                            <ColorSwatch
                            name={swatch.name}
                            value={swatch.value}/>
                            {swatch.description && (
                            <p className="text-xs text-muted-foreground mt-2">
                                {swatch.description}
                            </p>
                            )}
                        </div>

                    ))}

                </div>
            </div>
        </div>
    )

}


type ThemeContentProps = {
    colorGuide: ColorSection[];
};

export const ThemeContent = ({ colorGuide }: ThemeContentProps) => {
    if (!colorGuide || colorGuide.length === 0) {
        return <div>No color sections available</div>;
    }

    return (
        <div className="space-y-10">
            {colorGuide.map((section, index) => (
                <ColorTheme
                    key={`${section.title}-${index}`}
                    title={section.title}
                    swatches={section.swatches}
                />
            ))}
        </div>
    );
};