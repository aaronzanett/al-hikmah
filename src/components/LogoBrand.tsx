import { useLogo } from "@/contexts/LogoContext";
import { cn } from "@/lib/utils";

interface LogoBrandProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  subtitleOverride?: string;
  className?: string;
  iconOnly?: boolean;
}

const sizeMap = {
  sm: { box: "h-7 w-7", text: "text-xs", title: "text-sm", sub: "text-[10px]", completeLogo: "h-7" },
  md: { box: "h-9 w-9", text: "text-sm", title: "text-base", sub: "text-[10px]", completeLogo: "h-9" },
  lg: { box: "h-10 w-10", text: "text-sm", title: "text-xl", sub: "text-xs", completeLogo: "h-10" },
};

export function LogoBrand({ size = "md", showText = true, subtitleOverride, className, iconOnly = false }: LogoBrandProps) {
  const { logoMode, logoUrl, institutionName, tagline } = useLogo();
  const s = sizeMap[size];

  if (iconOnly) {
    return (
      <div className={cn("flex shrink-0 items-center justify-center rounded-lg", className)}>
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" className={cn(s.box, "rounded-lg object-contain")} />
        ) : (
          <div className={cn("flex items-center justify-center rounded-lg gradient-gold", s.box)}>
            <span className={cn("font-bold text-accent-foreground", s.text)}>
              {institutionName.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
    );
  }

  // Complete mode: logo image already contains name+tagline
  if (logoMode === "complete" && logoUrl) {
    return (
      <div className={cn("flex items-center", className)}>
        <img src={logoUrl} alt={institutionName} className={cn(s.completeLogo, "object-contain")} />
      </div>
    );
  }

  // Manual mode or no logo: icon + text
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      {logoUrl ? (
        <img src={logoUrl} alt="Logo" className={cn(s.box, "rounded-lg object-contain shrink-0")} />
      ) : (
        <div className={cn("flex shrink-0 items-center justify-center rounded-lg gradient-gold shadow-md", s.box)}>
          <span className={cn("font-bold text-accent-foreground", s.text)}>
            {institutionName.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      {showText && (
        <div className="min-w-0">
          <span className={cn("font-bold text-foreground leading-none block truncate", s.title)}>
            {institutionName}
          </span>
          <span className={cn("text-muted-foreground leading-tight block truncate", s.sub)}>
            {subtitleOverride || tagline}
          </span>
        </div>
      )}
    </div>
  );
}
