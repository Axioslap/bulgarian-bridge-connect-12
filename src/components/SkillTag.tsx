
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface SkillTagProps {
  skill: string;
  onRemove?: () => void;
  variant?: "default" | "secondary" | "outline";
}

const SkillTag = ({ skill, onRemove, variant = "secondary" }: SkillTagProps) => {
  return (
    <Badge variant={variant} className="flex items-center gap-1 text-xs">
      {skill}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </Badge>
  );
};

export default SkillTag;
