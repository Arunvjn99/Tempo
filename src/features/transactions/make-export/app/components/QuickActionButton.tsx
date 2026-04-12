import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";

interface QuickActionButtonProps {
  icon: React.ReactNode;
  title: string;
  contextInfo: string;
  additionalInfo?: string;
  onClick: () => void;
}

export function QuickActionButton({
  icon,
  title,
  contextInfo,
  additionalInfo,
  onClick,
}: QuickActionButtonProps) {
  return (
    <motion.div
      whileHover={{
        y: -2,
        boxShadow: "0 8px 24px color-mix(in srgb, var(--color-primary) 18%, transparent)",
      }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={onClick}
      className="card-standard group relative cursor-pointer overflow-hidden px-5 py-4"
    >
      <div className="relative flex items-start gap-3.5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-gradient-to-br from-primary/12 to-primary/20 text-brand transition-all duration-200">
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold leading-5 tracking-[-0.3px] text-primary">{title}</h3>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-secondary transition-all group-hover:translate-x-0.5 group-hover:text-brand" />
          </div>
          <p className="mt-0.5 text-xs font-semibold text-brand">{contextInfo}</p>
          {additionalInfo ? (
            <p className="mt-0.5 text-[11px] font-medium text-secondary">{additionalInfo}</p>
          ) : null}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-0.5 origin-left scale-x-0 rounded-sm bg-primary transition-transform duration-200 group-hover:scale-x-100" />
    </motion.div>
  );
}
