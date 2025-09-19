import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, ArrowLeft, MapPin } from "lucide-react";
import USMembersMap from "@/components/USMembersMap";
import StateMembersMap from "@/components/StateMembersMap";

type MapLevel = 'world' | 'usa' | 'state';

const MapTab = () => {
  const [mapLevel, setMapLevel] = useState<MapLevel>('world');
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const handleUSAClick = () => {
    setMapLevel('usa');
  };

  const handleStateClick = (state: string) => {
    setSelectedState(state);
    setMapLevel('state');
  };

  const handleBackToWorld = () => {
    setMapLevel('world');
    setSelectedState(null);
  };

  const handleBackToUSA = () => {
    setMapLevel('usa');
    setSelectedState(null);
  };

  const getViewTitle = () => {
    if (mapLevel === 'world') return 'Global Members Map';
    if (mapLevel === 'usa') return 'USA Members';
    if (mapLevel === 'state' && selectedState) return `Members in ${selectedState}`;
    return 'Members Map';
  };

  const getViewDescription = () => {
    if (mapLevel === 'world') return 'Choose a region to explore members by location';
    if (mapLevel === 'usa') return 'Click on state clusters to explore members by state';
    if (mapLevel === 'state') return 'View individual member profiles';
    return '';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">{getViewTitle()}</h2>
          <p className="text-muted-foreground">{getViewDescription()}</p>
        </div>
        {mapLevel === 'usa' && (
          <Button variant="outline" onClick={handleBackToWorld}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to World
          </Button>
        )}
        {mapLevel === 'state' && (
          <Button variant="outline" onClick={handleBackToUSA}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to USA
          </Button>
        )}
      </div>

      {mapLevel === 'world' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card 
              className="p-6 cursor-pointer hover:bg-muted/50 transition-colors border-2 hover:border-primary/50"
              onClick={handleUSAClick}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">United States</h3>
                  <p className="text-muted-foreground">Explore members across all US states</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-6 opacity-60">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <MapPin className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Bulgaria</h3>
                  <p className="text-muted-foreground">Coming soon...</p>
                  <Badge variant="secondary" className="mt-2">Coming Soon</Badge>
                </div>
              </div>
            </Card>
          </div>
          
          <Card className="p-8 text-center">
            <div className="text-muted-foreground">
              <Globe className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>Select a region above to explore our global member network.</p>
            </div>
          </Card>
        </div>
      )}

      {mapLevel === 'usa' && (
        <USMembersMap onStateClick={handleStateClick} />
      )}

      {mapLevel === 'state' && selectedState && (
        <StateMembersMap 
          state={selectedState} 
          onBack={handleBackToUSA}
        />
      )}
    </div>
  );
};

export default MapTab;