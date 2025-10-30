import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Hash, LayoutIcon, Type } from "lucide-react";

type Props = {
  children: React.ReactNode;
};

const tabs = [
  {
    value: 'colours',
    label: 'Colours',
    icon: Hash,
  },
  {
    value: 'typography',
    label: 'Typography',
    icon: Type,
  },
  {
    value: 'moodboard',
    label: 'Moodboard',
    icon: LayoutIcon,
  }
] as const;

const Layout = ({ children }: Props) => {
  return (
    <Tabs defaultValue="colours" className="w-full">
      <div className="mt-36 container mx-auto px-4 sm:px-4 py-6 sm:py-8">
        <div>
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-5 items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-left text-center font-bold text-foreground">
                Style Guide
              </h1>
              <p className="text-muted-foreground mt-2 text-center lg:text-left">
                Manage your style guide here
              </p>
            </div>
            <TabsList className="grid w-full sm:w-fit h-auto grid-cols-3 rounded-full backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] saturate-150 p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="flex items-center justify-center gap-2 rounded-2xl transition-all duration-200 
                      text-xs sm:text-sm px-3 py-2
                      data-[state=active]:bg-white/15 data-[state=active]:border-white/[0.2] data-[state=active]:border "
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.value}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>
        </div>
        {/* Render the page content here */}
        {children}
      </div>
    </Tabs>
  );
};

export default Layout;