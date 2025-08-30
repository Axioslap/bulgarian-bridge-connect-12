
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import SkillTag from "./SkillTag";

interface SkillSelectorProps {
  skills: string[];
  onSkillsChange: (skills: string[]) => void;
  placeholder?: string;
}

const SkillSelector = ({ skills, onSkillsChange, placeholder = "Add a skill..." }: SkillSelectorProps) => {
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      onSkillsChange([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onSkillsChange(skills.filter(skill => skill !== skillToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button onClick={addSkill} size="sm" disabled={!newSkill.trim()}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <SkillTag 
              key={index} 
              skill={skill} 
              onRemove={() => removeSkill(skill)} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillSelector;
