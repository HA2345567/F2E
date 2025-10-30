import { Type, ChevronRight } from "lucide-react"

export interface TypographyStyle {
  fontFamily: string;
  fontSize: string;
  fontWeight: string | number;
  lineHeight: string;
  letterSpacing?: string;
  name?: string;
  description?: string;
}

export interface TypographySection {
  title: string;
  styles: TypographyStyle[];
}

export interface StyleGuideTypographyProps {
  typographyGuide: TypographySection[];
}

const TypographySample = ({ style }: { style: TypographyStyle }) => {
  return (
    <div className="group relative py-6 border-b border-border/20 last:border-0">
      <div className="flex items-start gap-6">
        <div className="w-24 flex-shrink-0">
          <div className="text-sm font-medium text-foreground/80">
            {style.name}
          </div>
          {style.description && (
            <p className="text-xs text-muted-foreground mt-1">
              {style.description}
            </p>
          )}
          <div className="mt-3 text-xs text-muted-foreground space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="w-16 text-foreground/50">Font:</span>
              <span className="font-mono">{style.fontFamily.split(',')[0]}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-16 text-foreground/50">Size:</span>
              <span className="font-mono">{style.fontSize}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-16 text-foreground/50">Weight:</span>
              <span className="font-mono">{style.fontWeight}</span>
            </div>
          </div>
        </div>
        <div 
          className="flex-1 min-w-0"
          style={{
            fontFamily: style.fontFamily,
            fontSize: style.fontSize,
            fontWeight: style.fontWeight,
            lineHeight: style.lineHeight,
            letterSpacing: style.letterSpacing || 'normal',
          }}
        >
          <div className="text-foreground/90">
            The quick brown fox jumps over the lazy dog
          </div>
          
        
        </div>
      </div>
      <ChevronRight className="absolute right-0 top-8 w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

export const StyleGuideTypography = ({ typographyGuide }: StyleGuideTypographyProps) => {
  return (
    <div className="max-w-4xl mx-auto">
      {typographyGuide.length === 0 ? (
        <div className="text-center py-20">
          <Type className="w-16 h-16 mx-auto mb-4 text-muted-foreground"/>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No typography generated yet
          </h3>
          <p className="text-sm text-muted-foreground">
            Generate a style guide to see typography recommendations.
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {typographyGuide.map((section, index) => (
            <div key={index} className="space-y-6">
              <div className="sticky top-0 bg-background/80 backdrop-blur-sm z-10 pb-2">
                <h2 className="text-xl font-semibold text-foreground/90">
                  {section.title}
                </h2>
                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mt-2" />
              </div>
              <div className="space-y-0">
                {section.styles?.map((style, styleIndex) => (
                  <TypographySample key={styleIndex} style={style} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StyleGuideTypography;