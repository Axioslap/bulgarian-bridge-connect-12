import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface USMembersMapProps {
  onStateClick?: (state: string) => void;
}

interface StateInfo {
  name: string;
  abbreviation: string;
  count: number;
}

const USMembersMap = ({ onStateClick }: USMembersMapProps) => {
  const [loading, setLoading] = useState(true);
  const [stateData, setStateData] = useState<Record<string, StateInfo>>({});
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  // US State mappings
  const stateNames: Record<string, string> = {
    AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
    CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
    HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
    KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
    MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri",
    MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
    NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
    OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
    SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
    VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
    DC: "District of Columbia"
  };

  useEffect(() => {
    const loadStateData = async () => {
      try {
        setLoading(true);

        // Get member counts by state
        const { data, error } = await supabase
          .from("profiles")
          .select("state, id")
          .eq("country", "United States")
          .not("state", "is", null)
          .eq("is_public", true);

        if (error) {
          console.error('Error loading state data:', error);
          return;
        }

        // Count members by state
        const stateCounts: Record<string, number> = {};
        data?.forEach((profile) => {
          const state = profile.state?.trim().toUpperCase();
          if (state && stateNames[state]) {
            stateCounts[state] = (stateCounts[state] || 0) + 1;
          }
        });

        // Build state info
        const stateInfo: Record<string, StateInfo> = {};
        Object.entries(stateNames).forEach(([abbr, name]) => {
          stateInfo[abbr] = {
            name,
            abbreviation: abbr,
            count: stateCounts[abbr] || 0
          };
        });

        setStateData(stateInfo);
      } catch (error) {
        console.error('Error loading USA map data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStateData();
  }, []);

  const getStateColor = (count: number) => {
    if (count === 0) return "#e5e7eb"; // Gray for no members
    if (count <= 2) return "#22c55e"; // Green for low
    if (count <= 5) return "#3b82f6"; // Blue for medium
    if (count <= 10) return "#f59e0b"; // Orange for high
    return "#ef4444"; // Red for very high
  };

  const handleStateClick = (stateAbbr: string) => {
    if (onStateClick && stateData[stateAbbr]?.count > 0) {
      onStateClick(stateAbbr);
    }
  };

  return (
    <Card className="relative overflow-hidden">
      <div className="p-6">
        {loading && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Loading USA map...</p>
            </div>
          </div>
        )}

        <div className="bg-background/95 backdrop-blur-sm rounded-lg p-4 border shadow-lg mb-6 inline-block">
          <div className="text-lg font-semibold mb-2">USA Members Map</div>
          <div className="text-sm text-muted-foreground space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>Blue shades = Member density</span>
            </div>
            <div>Numbers show member count</div>
            <div>Click to zoom into state</div>
          </div>
        </div>

        {/* USA Geographical Map */}
        <div className="relative bg-gradient-to-b from-slate-50 to-slate-100 rounded-xl p-4 border shadow-lg">
          <svg 
            viewBox="0 0 1000 600" 
            className="w-full h-auto max-w-5xl mx-auto"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* State paths - simplified outlines */}
            {/* California */}
            <path
              d="M50 150 L50 450 L150 440 L160 400 L140 350 L120 300 L100 250 L80 200 Z"
              fill={getStateColor(stateData.CA?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('CA')}
              onMouseEnter={() => setHoveredState('CA')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* Nevada */}
            <path
              d="M150 150 L150 400 L160 400 L170 350 L160 300 L150 250 L150 200 Z"
              fill={getStateColor(stateData.NV?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('NV')}
              onMouseEnter={() => setHoveredState('NV')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* Oregon */}
            <path
              d="M50 100 L50 150 L150 150 L150 100 Z"
              fill={getStateColor(stateData.OR?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('OR')}
              onMouseEnter={() => setHoveredState('OR')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* Washington */}
            <path
              d="M50 50 L50 100 L150 100 L150 50 Z"
              fill={getStateColor(stateData.WA?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('WA')}
              onMouseEnter={() => setHoveredState('WA')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* Idaho */}
            <path
              d="M150 50 L150 150 L200 150 L200 50 Z"
              fill={getStateColor(stateData.ID?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('ID')}
              onMouseEnter={() => setHoveredState('ID')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* Montana */}
            <path
              d="M200 50 L200 150 L350 150 L350 50 Z"
              fill={getStateColor(stateData.MT?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('MT')}
              onMouseEnter={() => setHoveredState('MT')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* North Dakota */}
            <path
              d="M350 50 L350 150 L450 150 L450 50 Z"
              fill={getStateColor(stateData.ND?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('ND')}
              onMouseEnter={() => setHoveredState('ND')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* Minnesota */}
            <path
              d="M450 50 L450 200 L500 200 L500 50 Z"
              fill={getStateColor(stateData.MN?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('MN')}
              onMouseEnter={() => setHoveredState('MN')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* Wisconsin */}
            <path
              d="M500 50 L500 200 L550 200 L550 50 Z"
              fill={getStateColor(stateData.WI?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('WI')}
              onMouseEnter={() => setHoveredState('WI')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* Michigan */}
            <path
              d="M550 70 L550 180 L600 180 L620 150 L600 120 L580 100 L560 80 Z"
              fill={getStateColor(stateData.MI?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('MI')}
              onMouseEnter={() => setHoveredState('MI')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* Utah */}
            <path
              d="M200 150 L200 300 L300 300 L300 150 Z"
              fill={getStateColor(stateData.UT?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('UT')}
              onMouseEnter={() => setHoveredState('UT')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* Arizona */}
            <path
              d="M170 300 L170 450 L300 450 L300 300 Z"
              fill={getStateColor(stateData.AZ?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('AZ')}
              onMouseEnter={() => setHoveredState('AZ')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* New Mexico */}
            <path
              d="M300 300 L300 450 L400 450 L400 300 Z"
              fill={getStateColor(stateData.NM?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('NM')}
              onMouseEnter={() => setHoveredState('NM')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* Colorado */}
            <path
              d="M300 150 L300 300 L400 300 L400 150 Z"
              fill={getStateColor(stateData.CO?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('CO')}
              onMouseEnter={() => setHoveredState('CO')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* Wyoming */}
            <path
              d="M200 150 L200 200 L350 200 L350 150 Z"
              fill={getStateColor(stateData.WY?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('WY')}
              onMouseEnter={() => setHoveredState('WY')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* Nebraska */}
            <path
              d="M350 150 L350 250 L450 250 L450 150 Z"
              fill={getStateColor(stateData.NE?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('NE')}
              onMouseEnter={() => setHoveredState('NE')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* Kansas */}
            <path
              d="M350 250 L350 350 L450 350 L450 250 Z"
              fill={getStateColor(stateData.KS?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('KS')}
              onMouseEnter={() => setHoveredState('KS')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* Oklahoma */}
            <path
              d="M350 350 L350 400 L500 400 L500 350 Z"
              fill={getStateColor(stateData.OK?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('OK')}
              onMouseEnter={() => setHoveredState('OK')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* Texas */}
            <path
              d="M350 400 L350 520 L500 520 L520 480 L500 450 L480 430 L450 420 L400 430 Z"
              fill={getStateColor(stateData.TX?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('TX')}
              onMouseEnter={() => setHoveredState('TX')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* South Dakota */}
            <path
              d="M350 150 L350 200 L450 200 L450 150 Z"
              fill={getStateColor(stateData.SD?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('SD')}
              onMouseEnter={() => setHoveredState('SD')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* Iowa */}
            <path
              d="M450 200 L450 280 L550 280 L550 200 Z"
              fill={getStateColor(stateData.IA?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('IA')}
              onMouseEnter={() => setHoveredState('IA')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* Missouri */}
            <path
              d="M450 280 L450 380 L550 380 L550 280 Z"
              fill={getStateColor(stateData.MO?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('MO')}
              onMouseEnter={() => setHoveredState('MO')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* Arkansas */}
            <path
              d="M450 380 L450 450 L550 450 L550 380 Z"
              fill={getStateColor(stateData.AR?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('AR')}
              onMouseEnter={() => setHoveredState('AR')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* Louisiana */}
            <path
              d="M450 450 L450 520 L550 520 L550 450 Z"
              fill={getStateColor(stateData.LA?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('LA')}
              onMouseEnter={() => setHoveredState('LA')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* Illinois */}
            <path
              d="M550 200 L550 350 L600 350 L600 200 Z"
              fill={getStateColor(stateData.IL?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('IL')}
              onMouseEnter={() => setHoveredState('IL')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* Indiana */}
            <path
              d="M600 200 L600 350 L650 350 L650 200 Z"
              fill={getStateColor(stateData.IN?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('IN')}
              onMouseEnter={() => setHoveredState('IN')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* Ohio */}
            <path
              d="M650 200 L650 350 L720 350 L720 200 Z"
              fill={getStateColor(stateData.OH?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('OH')}
              onMouseEnter={() => setHoveredState('OH')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* Kentucky */}
            <path
              d="M550 350 L550 400 L720 400 L720 350 Z"
              fill={getStateColor(stateData.KY?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('KY')}
              onMouseEnter={() => setHoveredState('KY')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* Tennessee */}
            <path
              d="M550 400 L550 450 L720 450 L720 400 Z"
              fill={getStateColor(stateData.TN?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('TN')}
              onMouseEnter={() => setHoveredState('TN')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* Mississippi */}
            <path
              d="M550 450 L550 520 L600 520 L600 450 Z"
              fill={getStateColor(stateData.MS?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('MS')}
              onMouseEnter={() => setHoveredState('MS')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* Alabama */}
            <path
              d="M600 450 L600 520 L670 520 L670 450 Z"
              fill={getStateColor(stateData.AL?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('AL')}
              onMouseEnter={() => setHoveredState('AL')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* Georgia */}
            <path
              d="M670 400 L670 520 L750 520 L750 400 Z"
              fill={getStateColor(stateData.GA?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('GA')}
              onMouseEnter={() => setHoveredState('GA')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* Florida */}
            <path
              d="M670 520 L670 570 L800 570 L820 550 L800 530 L750 520 Z"
              fill={getStateColor(stateData.FL?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('FL')}
              onMouseEnter={() => setHoveredState('FL')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* South Carolina */}
            <path
              d="M720 400 L720 470 L780 470 L780 400 Z"
              fill={getStateColor(stateData.SC?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('SC')}
              onMouseEnter={() => setHoveredState('SC')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* North Carolina */}
            <path
              d="M720 350 L720 400 L850 400 L850 350 Z"
              fill={getStateColor(stateData.NC?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('NC')}
              onMouseEnter={() => setHoveredState('NC')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* Virginia */}
            <path
              d="M720 280 L720 350 L850 350 L850 280 Z"
              fill={getStateColor(stateData.VA?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('VA')}
              onMouseEnter={() => setHoveredState('VA')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* West Virginia */}
            <path
              d="M720 200 L720 280 L780 280 L780 200 Z"
              fill={getStateColor(stateData.WV?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('WV')}
              onMouseEnter={() => setHoveredState('WV')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* Pennsylvania */}
            <path
              d="M720 150 L720 200 L850 200 L850 150 Z"
              fill={getStateColor(stateData.PA?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('PA')}
              onMouseEnter={() => setHoveredState('PA')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* New York */}
            <path
              d="M720 100 L720 150 L850 150 L850 100 Z"
              fill={getStateColor(stateData.NY?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('NY')}
              onMouseEnter={() => setHoveredState('NY')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* Vermont */}
            <path
              d="M850 100 L850 150 L880 150 L880 100 Z"
              fill={getStateColor(stateData.VT?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('VT')}
              onMouseEnter={() => setHoveredState('VT')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* New Hampshire */}
            <path
              d="M880 100 L880 150 L910 150 L910 100 Z"
              fill={getStateColor(stateData.NH?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('NH')}
              onMouseEnter={() => setHoveredState('NH')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* Maine */}
            <path
              d="M910 50 L910 150 L950 150 L950 50 Z"
              fill={getStateColor(stateData.ME?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('ME')}
              onMouseEnter={() => setHoveredState('ME')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* Massachusetts */}
            <path
              d="M850 150 L850 180 L920 180 L920 150 Z"
              fill={getStateColor(stateData.MA?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('MA')}
              onMouseEnter={() => setHoveredState('MA')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* Rhode Island */}
            <path
              d="M920 150 L920 170 L930 170 L930 150 Z"
              fill={getStateColor(stateData.RI?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('RI')}
              onMouseEnter={() => setHoveredState('RI')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* Connecticut */}
            <path
              d="M850 180 L850 200 L900 200 L900 180 Z"
              fill={getStateColor(stateData.CT?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('CT')}
              onMouseEnter={() => setHoveredState('CT')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* New Jersey */}
            <path
              d="M850 200 L850 250 L880 250 L880 200 Z"
              fill={getStateColor(stateData.NJ?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('NJ')}
              onMouseEnter={() => setHoveredState('NJ')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* Delaware */}
            <path
              d="M850 250 L850 280 L870 280 L870 250 Z"
              fill={getStateColor(stateData.DE?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('DE')}
              onMouseEnter={() => setHoveredState('DE')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* Maryland */}
            <path
              d="M780 250 L780 300 L850 300 L850 250 Z"
              fill={getStateColor(stateData.MD?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('MD')}
              onMouseEnter={() => setHoveredState('MD')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* Alaska */}
            <path
              d="M50 480 L50 560 L150 560 L150 480 Z"
              fill={getStateColor(stateData.AK?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('AK')}
              onMouseEnter={() => setHoveredState('AK')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* Hawaii */}
            <path
              d="M200 480 L200 520 L250 520 L250 480 Z"
              fill={getStateColor(stateData.HI?.count || 0)}
              stroke="#374151"
              strokeWidth="1"
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleStateClick('HI')}
              onMouseEnter={() => setHoveredState('HI')}
              onMouseLeave={() => setHoveredState(null)}
            />
            
            {/* State labels for member counts */}
            {Object.entries(stateData).map(([abbr, info]) => {
              if (info.count === 0) return null;
              
              // Simple positioning for state labels - you can adjust these coordinates
              const positions: Record<string, { x: number; y: number }> = {
                CA: { x: 100, y: 300 }, TX: { x: 425, y: 470 }, FL: { x: 745, y: 545 },
                NY: { x: 785, y: 125 }, PA: { x: 785, y: 175 }, IL: { x: 575, y: 275 },
                OH: { x: 685, y: 275 }, GA: { x: 710, y: 460 }, NC: { x: 785, y: 375 },
                MI: { x: 585, y: 125 }, NJ: { x: 865, y: 225 }, VA: { x: 785, y: 315 },
                WA: { x: 100, y: 75 }, AZ: { x: 235, y: 375 }, MA: { x: 885, y: 165 },
                TN: { x: 635, y: 425 }, IN: { x: 625, y: 275 }, MO: { x: 500, y: 330 },
                MD: { x: 815, y: 275 }, WI: { x: 525, y: 125 }, CO: { x: 350, y: 225 },
                MN: { x: 475, y: 125 }, SC: { x: 750, y: 435 }, AL: { x: 635, y: 485 },
                LA: { x: 500, y: 485 }, KY: { x: 635, y: 375 }, OR: { x: 100, y: 125 },
                OK: { x: 425, y: 375 }, CT: { x: 875, y: 190 }, IA: { x: 500, y: 240 },
                MS: { x: 575, y: 485 }, AR: { x: 500, y: 415 }, KS: { x: 400, y: 300 },
                UT: { x: 250, y: 225 }, NV: { x: 160, y: 275 }, NM: { x: 350, y: 375 },
                WV: { x: 750, y: 240 }, NE: { x: 400, y: 200 }, ID: { x: 175, y: 100 },
                NH: { x: 895, y: 125 }, ME: { x: 930, y: 100 }, RI: { x: 925, y: 160 },
                MT: { x: 275, y: 100 }, ND: { x: 400, y: 100 }, SD: { x: 400, y: 175 },
                WY: { x: 275, y: 175 }, VT: { x: 865, y: 125 }, DE: { x: 860, y: 265 },
                AK: { x: 100, y: 520 }, HI: { x: 225, y: 500 }
              };
              
              const pos = positions[abbr];
              if (!pos) return null;
              
              return (
                <text
                  key={abbr}
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="text-sm font-bold fill-white pointer-events-none"
                  style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}
                >
                  {info.count}
                </text>
              );
            })}
          </svg>
        </div>
        
        {/* Legend */}
        <div className="mt-6 flex justify-center">
          <div className="bg-background/95 backdrop-blur-sm rounded-lg p-4 border shadow-lg">
            <div className="text-sm font-semibold mb-2 text-center">Member Count by State</div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: "#e5e7eb" }}></div>
                <span>0</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: "#22c55e" }}></div>
                <span>1-2</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: "#3b82f6" }}></div>
                <span>3-5</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: "#f59e0b" }}></div>
                <span>6-10</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: "#ef4444" }}></div>
                <span>10+</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hover tooltip */}
        {hoveredState && stateData[hoveredState] && (
          <div className="absolute top-4 right-4 bg-background/95 backdrop-blur-sm rounded-lg p-3 border shadow-lg">
            <div className="font-semibold">{stateData[hoveredState].name}</div>
            <div className="text-sm text-muted-foreground">
              {stateData[hoveredState].count} member{stateData[hoveredState].count !== 1 ? 's' : ''}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default USMembersMap;