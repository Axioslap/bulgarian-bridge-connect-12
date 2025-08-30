import { useState } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const US_UNIVERSITIES = [
  "Harvard University",
  "Stanford University", 
  "Massachusetts Institute of Technology (MIT)",
  "University of California, Berkeley",
  "Yale University",
  "Princeton University",
  "Columbia University",
  "University of Chicago",
  "University of Pennsylvania",
  "California Institute of Technology (Caltech)",
  "Johns Hopkins University",
  "Northwestern University",
  "Duke University",
  "Dartmouth College",
  "Brown University",
  "Vanderbilt University",
  "Rice University",
  "Washington University in St. Louis",
  "Cornell University",
  "University of Notre Dame",
  "University of California, Los Angeles (UCLA)",
  "Emory University",
  "University of California, San Diego",
  "Carnegie Mellon University",
  "University of Virginia",
  "Georgetown University",
  "University of Michigan",
  "University of Southern California",
  "New York University",
  "Boston University"
];

const BULGARIAN_UNIVERSITIES = [
  "Sofia University St. Kliment Ohridski",
  "Plovdiv University Paisii Hilendarski", 
  "Technical University of Sofia",
  "University of National and World Economy (UNWE)",
  "American University in Bulgaria (AUBG)",
  "New Bulgarian University (NBU)",
  "Varna University of Economics",
  "University of Architecture, Civil Engineering and Geodesy (UACEG)",
  "Medical University of Sofia",
  "Medical University of Plovdiv",
  "Technical University of Varna",
  "Burgas Free University",
  "University of Forestry",
  "National Academy of Art",
  "National Sports Academy",
  "Shumen University",
  "University of Ruse",
  "South-West University",
  "Trakia University"
];

const ALL_UNIVERSITIES = [
  ...US_UNIVERSITIES.map(uni => ({ name: uni, country: "US" })),
  ...BULGARIAN_UNIVERSITIES.map(uni => ({ name: uni, country: "BG" }))
].sort((a, b) => a.name.localeCompare(b.name));

interface UniversitySelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function UniversitySelector({ value, onChange, placeholder = "Select university..." }: UniversitySelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search universities..." />
          <CommandList>
            <CommandEmpty>No university found.</CommandEmpty>
            <CommandGroup heading="US Universities">
              {ALL_UNIVERSITIES.filter(uni => uni.country === "US").map((university) => (
                <CommandItem
                  key={university.name}
                  value={university.name}
                  onSelect={() => {
                    onChange(university.name);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === university.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {university.name}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Bulgarian Universities">
              {ALL_UNIVERSITIES.filter(uni => uni.country === "BG").map((university) => (
                <CommandItem
                  key={university.name}
                  value={university.name}
                  onSelect={() => {
                    onChange(university.name);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === university.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {university.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}