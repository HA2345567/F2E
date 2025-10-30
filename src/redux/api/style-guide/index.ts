
export interface TypographyStyle{
    name: string
    fontFamily: string
    fontSize: string
    fontWeight: string
    lineHeight: string
    letterSpacing?: string
    description?:string
}

export interface TypographySection{
    title: string
    styles: TypographyStyle[]
    
}
export interface ColorSwatch{
    name: string
    value: string
    description?:string
}
export interface ColorSecition{
    title: 
    | 'Primary Colours'
    | 'Secondary & Accent Colours'
    | 'UI Components Colors'
    | 'Utility & Form Colors'
    | 'Status & Feedback Colors'

    swatches: ColorSwatch[]
    

}
export interface StyleGuide{
    theme: string
    description: string
    colorSections: [
        ColorSecition,
        ColorSecition,
        ColorSecition,
        ColorSecition,
        ColorSecition,
        ColorSecition,
    ]
    typographySections: [
        TypographySection,
        TypographySection,
        TypographySection,
        TypographySection,
        TypographySection,
    ]
}