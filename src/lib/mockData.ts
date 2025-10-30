import { StyleGuide } from "@/redux/api/style-guide";
import { TypographySection } from "@/components/style/typography";

export const mockTypographyGuide: TypographySection[] = [
  {
    title: "Headings",
    styles: [
      {
        name: "Heading 1",
        description: "Main page title",
        fontFamily: "Inter, sans-serif",
        fontSize: "3rem",
        fontWeight: 700,
        lineHeight: "1.2",
        letterSpacing: "-0.02em"
      },
      {
        name: "Heading 2",
        description: "Section headers",
        fontFamily: "Inter, sans-serif",
        fontSize: "2.25rem",
        fontWeight: 700,
        lineHeight: "1.25",
        letterSpacing: "-0.01em"
      },
      {
        name: "Heading 3",
        description: "Subsection headers",
        fontFamily: "Inter, sans-serif",
        fontSize: "1.5rem",
        fontWeight: 600,
        lineHeight: "1.3"
      }
    ]
  },
  {
    title: "Body Text",
    styles: [
      {
        name: "Body Large",
        description: "Main body text",
        fontFamily: "Inter, sans-serif",
        fontSize: "1.125rem",
        fontWeight: 400,
        lineHeight: "1.7",
        letterSpacing: "0.01em"
      },
      {
        name: "Body Regular",
        description: "Standard text",
        fontFamily: "Inter, sans-serif",
        fontSize: "1rem",
        fontWeight: 400,
        lineHeight: "1.6"
      },
      {
        name: "Body Small",
        description: "Secondary text, captions",
        fontFamily: "Inter, sans-serif",
        fontSize: "0.875rem",
        fontWeight: 400,
        lineHeight: "1.5"
      }
    ]
  },
  {
    title: "UI Elements",
    styles: [
      {
        name: "Button Text",
        description: "Call to action buttons",
        fontFamily: "Inter, sans-serif",
        fontSize: "1rem",
        fontWeight: 600,
        lineHeight: "1.5",
        letterSpacing: "0.01em"
      },
      {
        name: "Input Text",
        description: "Form input fields",
        fontFamily: "Inter, sans-serif",
        fontSize: "1rem",
        fontWeight: 400,
        lineHeight: "1.5"
      },
      {
        name: "Label",
        description: "Form labels and captions",
        fontFamily: "Inter, sans-serif",
        fontSize: "0.875rem",
        fontWeight: 500,
        lineHeight: "1.4"
      }
    ]
  }
];

export const mockStyleGuide: StyleGuide = {
    theme: "Modern Professional",
    description: "A clean, modern design system with vibrant accents and professional typography",
    colorSections: [
        {
            title: "Primary Colours",
            swatches: [
                {
                    name: "Primary",
                    value: "#3B82F6",
                    description: "Main brand color for primary actions"
                },
                {
                    name: "Primary Dark",
                    value: "#1E40AF",
                    description: "Darker shade for hover states"
                },
                {
                    name: "Primary Light",
                    value: "#DBEAFE",
                    description: "Light tint for backgrounds"
                }
            ]
        },
        {
            title: "Secondary & Accent Colours",
            swatches: [
                {
                    name: "Accent 1",
                    value: "#8B5CF6",
                    description: "Vibrant purple accent"
                },
                {
                    name: "Accent 2",
                    value: "#EC4899",
                    description: "Energetic pink accent"
                },
                {
                    name: "Accent 3",
                    value: "#F97316",
                    description: "Warm orange accent"
                }
            ]
        },
        {
            title: "UI Components Colors",
            swatches: [
                {
                    name: "Background",
                    value: "#FFFFFF",
                    description: "Main background"
                },
                {
                    name: "Surface",
                    value: "#F9FAFB",
                    description: "Card backgrounds"
                },
                {
                    name: "Border",
                    value: "#E5E7EB",
                    description: "Borders and dividers"
                }
            ]
        },
        {
            title: "Utility & Form Colors",
            swatches: [
                {
                    name: "Text Primary",
                    value: "#111827",
                    description: "Main text color"
                },
                {
                    name: "Text Secondary",
                    value: "#6B7280",
                    description: "Secondary text color"
                },
                {
                    name: "Placeholder",
                    value: "#9CA3AF",
                    description: "Form input placeholder"
                }
            ]
        },
        {
            title: "Status & Feedback Colors",
            swatches: [
                {
                    name: "Success",
                    value: "#10B981",
                    description: "For success states"
                },
                {
                    name: "Warning",
                    value: "#F59E0B",
                    description: "For warning states"
                },
                {
                    name: "Error",
                    value: "#EF4444",
                    description: "For error states"
                }
            ]
        },
        {
            title: "Status & Feedback Colors",
            swatches: [
                {
                    name: "Info",
                    value: "#3B82F6",
                    description: "For informational messages"
                },
                {
                    name: "Muted",
                    value: "#6B7280",
                    description: "Muted or disabled states"
                },
                {
                    name: "Link",
                    value: "#3B82F6",
                    description: "Hyperlinks and interactive elements"
                }
            ]
        }
  ],
  typographySections: [
    {
      title: "Headings",
      styles: [
        {
          name: "Heading 1",
          description: "Main page title",
          fontFamily: "Inter, sans-serif",
          fontSize: "3rem",
          fontWeight: "700",
          lineHeight: "1.2",
          letterSpacing: "-0.02em"
        },
        {
          name: "Heading 2",
          description: "Section headers",
          fontFamily: "Inter, sans-serif",
          fontSize: "2.25rem",
          fontWeight: "700",
          lineHeight: "1.25",
          letterSpacing: "-0.01em"
        },
        {
          name: "Heading 3",
          description: "Subsection headers",
          fontFamily: "Inter, sans-serif",
          fontSize: "1.5rem",
          fontWeight: "600",
          lineHeight: "1.3"
        },
        {
          name: "Heading 4",
          description: "Smaller headings",
          fontFamily: "Inter, sans-serif",
          fontSize: "1.25rem",
          fontWeight: "600",
          lineHeight: "1.35"
        }
      ]
    },
    {
      title: "Body Text",
      styles: [
        {
          name: "Body Large",
          description: "Main body text",
          fontFamily: "Inter, sans-serif",
          fontSize: "1.125rem",
          fontWeight: "400",
          lineHeight: "1.7"
        },
        {
          name: "Body Regular",
          description: "Standard text",
          fontFamily: "Inter, sans-serif",
          fontSize: "1rem",
          fontWeight: "400",
          lineHeight: "1.6"
        },
        {
          name: "Body Small",
          description: "Secondary text, captions",
          fontFamily: "Inter, sans-serif",
          fontSize: "0.875rem",
          fontWeight: "400",
          lineHeight: "1.5"
        }
      ]
    },
    {
      title: "UI Elements",
      styles: [
        {
          name: "Button Text",
          description: "Call to action buttons",
          fontFamily: "Inter, sans-serif",
          fontSize: "1rem",
          fontWeight: "600",
          lineHeight: "1.5"
        },
        {
          name: "Input Text",
          description: "Form input fields",
          fontFamily: "Inter, sans-serif",
          fontSize: "1rem",
          fontWeight: "400",
          lineHeight: "1.5"
        },
        {
          name: "Label",
          description: "Form labels and captions",
          fontFamily: "Inter, sans-serif",
          fontSize: "0.875rem",
          fontWeight: "500",
          lineHeight: "1.4"
        }
      ]
    },
    {
      title: "Navigation",
      styles: [
        {
          name: "Nav Link",
          description: "Navigation menu items",
          fontFamily: "Inter, sans-serif",
          fontSize: "1rem",
          fontWeight: "500",
          lineHeight: "1.5"
        },
        {
          name: "Breadcrumb",
          description: "Breadcrumb navigation",
          fontFamily: "Inter, sans-serif",
          fontSize: "0.875rem",
          fontWeight: "400",
          lineHeight: "1.5"
        }
      ]
    },
    {
      title: "Special Text",
      styles: [
        {
          name: "Quote",
          description: "Blockquotes and testimonials",
          fontFamily: "Inter, sans-serif",
          fontSize: "1.25rem",
          fontWeight: "400",
          lineHeight: "1.6",
        },
        {
          name: "Code",
          description: "Inline code and snippets",
          fontFamily: "'Roboto Mono', monospace",
          fontSize: "0.875rem",
          fontWeight: "400",
          lineHeight: "1.5"
        }
      ]
    }
  ]
};