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
    if (count === 0) return "#e5e7eb";
    if (count <= 2) return "#dbeafe";
    if (count <= 5) return "#93c5fd";
    if (count <= 10) return "#3b82f6";
    return "#1d4ed8";
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

        <div className="bg-background/90 backdrop-blur-sm rounded-lg p-3 border shadow-lg mb-4 inline-block">
          <div className="text-sm font-medium mb-1">USA Members Map</div>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>🔵 Blue shades = Member density</div>
            <div>Numbers show member count</div>
            <div>Click to zoom into state</div>
          </div>
        </div>

        <div className="relative w-full max-w-4xl mx-auto">
          <svg viewBox="0 0 1000 600" className="w-full h-auto">
            {/* Simplified US States SVG paths */}
            <g>
              {/* California */}
              <path
                d="M50 150 L50 450 L200 450 L200 150 Z"
                fill={getStateColor(stateData.CA?.count || 0)}
                stroke="#374151"
                strokeWidth="1"
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => handleStateClick('CA')}
                onMouseEnter={() => setHoveredState('CA')}
                onMouseLeave={() => setHoveredState(null)}
              />
              {stateData.CA?.count > 0 && (
                <text x="125" y="300" textAnchor="middle" className="fill-white text-lg font-bold">
                  {stateData.CA.count}
                </text>
              )}

              {/* Texas */}
              <path
                d="M350 350 L550 350 L550 500 L350 500 Z"
                fill={getStateColor(stateData.TX?.count || 0)}
                stroke="#374151"
                strokeWidth="1"
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => handleStateClick('TX')}
                onMouseEnter={() => setHoveredState('TX')}
                onMouseLeave={() => setHoveredState(null)}
              />
              {stateData.TX?.count > 0 && (
                <text x="450" y="425" textAnchor="middle" className="fill-white text-lg font-bold">
                  {stateData.TX.count}
                </text>
              )}

              {/* Florida */}
              <path
                d="M700 400 L850 400 L850 500 L700 500 Z"
                fill={getStateColor(stateData.FL?.count || 0)}
                stroke="#374151"
                strokeWidth="1"
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => handleStateClick('FL')}
                onMouseEnter={() => setHoveredState('FL')}
                onMouseLeave={() => setHoveredState(null)}
              />
              {stateData.FL?.count > 0 && (
                <text x="775" y="450" textAnchor="middle" className="fill-white text-lg font-bold">
                  {stateData.FL.count}
                </text>
              )}

              {/* New York */}
              <path
                d="M750 150 L850 150 L850 250 L750 250 Z"
                fill={getStateColor(stateData.NY?.count || 0)}
                stroke="#374151"
                strokeWidth="1"
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => handleStateClick('NY')}
                onMouseEnter={() => setHoveredState('NY')}
                onMouseLeave={() => setHoveredState(null)}
              />
              {stateData.NY?.count > 0 && (
                <text x="800" y="200" textAnchor="middle" className="fill-white text-lg font-bold">
                  {stateData.NY.count}
                </text>
              )}

              {/* Illinois */}
              <path
                d="M550 200 L650 200 L650 350 L550 350 Z"
                fill={getStateColor(stateData.IL?.count || 0)}
                stroke="#374151"
                strokeWidth="1"
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => handleStateClick('IL')}
                onMouseEnter={() => setHoveredState('IL')}
                onMouseLeave={() => setHoveredState(null)}
              />
              {stateData.IL?.count > 0 && (
                <text x="600" y="275" textAnchor="middle" className="fill-white text-lg font-bold">
                  {stateData.IL.count}
                </text>
              )}

              {/* Pennsylvania */}
              <path
                d="M650 200 L750 200 L750 300 L650 300 Z"
                fill={getStateColor(stateData.PA?.count || 0)}
                stroke="#374151"
                strokeWidth="1"
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => handleStateClick('PA')}
                onMouseEnter={() => setHoveredState('PA')}
                onMouseLeave={() => setHoveredState(null)}
              />
              {stateData.PA?.count > 0 && (
                <text x="700" y="250" textAnchor="middle" className="fill-white text-lg font-bold">
                  {stateData.PA.count}
                </text>
              )}

              {/* Ohio */}
              <path
                d="M600 250 L700 250 L700 350 L600 350 Z"
                fill={getStateColor(stateData.OH?.count || 0)}
                stroke="#374151"
                strokeWidth="1"
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => handleStateClick('OH')}
                onMouseEnter={() => setHoveredState('OH')}
                onMouseLeave={() => setHoveredState(null)}
              />
              {stateData.OH?.count > 0 && (
                <text x="650" y="300" textAnchor="middle" className="fill-white text-lg font-bold">
                  {stateData.OH.count}
                </text>
              )}

              {/* Georgia */}
              <path
                d="M650 350 L750 350 L750 450 L650 450 Z"
                fill={getStateColor(stateData.GA?.count || 0)}
                stroke="#374151"
                strokeWidth="1"
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => handleStateClick('GA')}
                onMouseEnter={() => setHoveredState('GA')}
                onMouseLeave={() => setHoveredState(null)}
              />
              {stateData.GA?.count > 0 && (
                <text x="700" y="400" textAnchor="middle" className="fill-white text-lg font-bold">
                  {stateData.GA.count}
                </text>
              )}

              {/* North Carolina */}
              <path
                d="M700 300 L800 300 L800 400 L700 400 Z"
                fill={getStateColor(stateData.NC?.count || 0)}
                stroke="#374151"
                strokeWidth="1"
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => handleStateClick('NC')}
                onMouseEnter={() => setHoveredState('NC')}
                onMouseLeave={() => setHoveredState(null)}
              />
              {stateData.NC?.count > 0 && (
                <text x="750" y="350" textAnchor="middle" className="fill-white text-lg font-bold">
                  {stateData.NC.count}
                </text>
              )}

              {/* Michigan */}
              <path
                d="M550 150 L650 150 L650 250 L550 250 Z"
                fill={getStateColor(stateData.MI?.count || 0)}
                stroke="#374151"
                strokeWidth="1"
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => handleStateClick('MI')}
                onMouseEnter={() => setHoveredState('MI')}
                onMouseLeave={() => setHoveredState(null)}
              />
              {stateData.MI?.count > 0 && (
                <text x="600" y="200" textAnchor="middle" className="fill-white text-lg font-bold">
                  {stateData.MI.count}
                </text>
              )}

              {/* Washington */}
              <path
                d="M100 50 L250 50 L250 150 L100 150 Z"
                fill={getStateColor(stateData.WA?.count || 0)}
                stroke="#374151"
                strokeWidth="1"
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => handleStateClick('WA')}
                onMouseEnter={() => setHoveredState('WA')}
                onMouseLeave={() => setHoveredState(null)}
              />
              {stateData.WA?.count > 0 && (
                <text x="175" y="100" textAnchor="middle" className="fill-white text-lg font-bold">
                  {stateData.WA.count}
                </text>
              )}

              {/* Add more states as needed - this is a simplified representation */}
            </g>
          </svg>

          {/* Tooltip */}
          {hoveredState && stateData[hoveredState] && (
            <div className="absolute top-4 right-4 bg-background border rounded-lg p-3 shadow-lg z-10">
              <div className="font-medium">{stateData[hoveredState].name}</div>
              <div className="text-sm text-muted-foreground">
                {stateData[hoveredState].count} members
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 justify-center">
          <div className="text-xs text-muted-foreground">Member Count:</div>
          {[
            { range: "0", color: "#e5e7eb" },
            { range: "1-2", color: "#dbeafe" },
            { range: "3-5", color: "#93c5fd" },
            { range: "6-10", color: "#3b82f6" },
            { range: "10+", color: "#1d4ed8" }
          ].map((item) => (
            <div key={item.range} className="flex items-center gap-2">
              <div 
                className="w-4 h-4 border border-gray-400"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs">{item.range}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default USMembersMap;