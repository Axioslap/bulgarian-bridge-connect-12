import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant={language === 'en' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setLanguage('en')}
        className="h-8 px-3"
      >
        EN
      </Button>
      <Button
        variant={language === 'bg' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setLanguage('bg')}
        className="h-8 px-3"
      >
        BG
      </Button>
    </div>
  );
};

export default LanguageSelector;
