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

        {/* USA Map Grid */}
        <div className="relative bg-gradient-to-b from-slate-50 to-slate-100 rounded-xl p-8 border shadow-lg">
          <div className="grid grid-cols-12 gap-1 max-w-5xl mx-auto">
            {/* Row 1 - Northern states */}
            <div className="col-start-1 col-span-2"></div>
            <div className="col-start-3 col-span-2"></div>
            <div className="col-start-5 col-span-1"></div>
            <div className="col-start-6 col-span-1"></div>
            <div className="col-start-7 col-span-1"></div>
            <div className="col-start-8 col-span-1"></div>
            <div className="col-start-9 col-span-2">
              {/* Maine */}
              <div
                className="h-12 border border-gray-400 cursor-pointer hover:opacity-80 transition-all duration-200 flex items-center justify-center text-sm font-bold text-white rounded"
                style={{ backgroundColor: getStateColor(stateData.ME?.count || 0) }}
                onClick={() => handleStateClick('ME')}
                onMouseEnter={() => setHoveredState('ME')}
                onMouseLeave={() => setHoveredState(null)}
              >
                {stateData.ME?.count > 0 && stateData.ME.count}
              </div>
            </div>

            {/* Row 2 */}
            <div className="col-start-1 col-span-2">
              {/* Washington */}
              <div
                className="h-12 border border-gray-400 cursor-pointer hover:opacity-80 transition-all duration-200 flex items-center justify-center text-sm font-bold text-white rounded"
                style={{ backgroundColor: getStateColor(stateData.WA?.count || 0) }}
                onClick={() => handleStateClick('WA')}
                onMouseEnter={() => setHoveredState('WA')}
                onMouseLeave={() => setHoveredState(null)}
              >
                {stateData.WA?.count > 0 && stateData.WA.count}
              </div>
            </div>
            <div className="col-start-3 col-span-1">
              {/* Montana */}
              <div
                className="h-12 border border-gray-400 cursor-pointer hover:opacity-80 transition-all duration-200 flex items-center justify-center text-sm font-bold text-white rounded"
                style={{ backgroundColor: getStateColor(stateData.MT?.count || 0) }}
                onClick={() => handleStateClick('MT')}
                onMouseEnter={() => setHoveredState('MT')}
                onMouseLeave={() => setHoveredState(null)}
              >
                {stateData.MT?.count > 0 && stateData.MT.count}
              </div>
            </div>
            <div className="col-start-4 col-span-1">
              {/* North Dakota */}
              <div
                className="h-12 border border-gray-400 cursor-pointer hover:opacity-80 transition-all duration-200 flex items-center justify-center text-sm font-bold text-white rounded"
                style={{ backgroundColor: getStateColor(stateData.ND?.count || 0) }}
                onClick={() => handleStateClick('ND')}
                onMouseEnter={() => setHoveredState('ND')}
                onMouseLeave={() => setHoveredState(null)}
              >
                {stateData.ND?.count > 0 && stateData.ND.count}
              </div>
            </div>
            <div className="col-start-5 col-span-1">
              {/* Minnesota */}
              <div
                className="h-12 border border-gray-400 cursor-pointer hover:opacity-80 transition-all duration-200 flex items-center justify-center text-sm font-bold text-white rounded"
                style={{ backgroundColor: getStateColor(stateData.MN?.count || 0) }}
                onClick={() => handleStateClick('MN')}
                onMouseEnter={() => setHoveredState('MN')}
                onMouseLeave={() => setHoveredState(null)}
              >
                {stateData.MN?.count > 0 && stateData.MN.count}
              </div>
            </div>
            <div className="col-start-6 col-span-1">
              {/* Wisconsin */}
              <div
                className="h-12 border border-gray-400 cursor-pointer hover:opacity-80 transition-all duration-200 flex items-center justify-center text-sm font-bold text-white rounded"
                style={{ backgroundColor: getStateColor(stateData.WI?.count || 0) }}
                onClick={() => handleStateClick('WI')}
                onMouseEnter={() => setHoveredState('WI')}
                onMouseLeave={() => setHoveredState(null)}
              >
                {stateData.WI?.count > 0 && stateData.WI.count}
              </div>
            </div>
            <div className="col-start-7 col-span-1">
              {/* Michigan */}
              <div
                className="h-12 border border-gray-400 cursor-pointer hover:opacity-80 transition-all duration-200 flex items-center justify-center text-sm font-bold text-white rounded"
                style={{ backgroundColor: getStateColor(stateData.MI?.count || 0) }}
                onClick={() => handleStateClick('MI')}
                onMouseEnter={() => setHoveredState('MI')}
                onMouseLeave={() => setHoveredState(null)}
              >
                {stateData.MI?.count > 0 && stateData.MI.count}
              </div>
            </div>
            <div className="col-start-8 col-span-1">
              {/* New York */}
              <div
                className="h-12 border border-gray-400 cursor-pointer hover:opacity-80 transition-all duration-200 flex items-center justify-center text-sm font-bold text-white rounded"
                style={{ backgroundColor: getStateColor(stateData.NY?.count || 0) }}
                onClick={() => handleStateClick('NY')}
                onMouseEnter={() => setHoveredState('NY')}
                onMouseLeave={() => setHoveredState(null)}
              >
                {stateData.NY?.count > 0 && stateData.NY.count}
              </div>
            </div>
            <div className="col-start-9 col-span-1">
              {/* Vermont */}
              <div
                className="h-12 border border-gray-400 cursor-pointer hover:opacity-80 transition-all duration-200 flex items-center justify-center text-sm font-bold text-white rounded"
                style={{ backgroundColor: getStateColor(stateData.VT?.count || 0) }}
                onClick={() => handleStateClick('VT')}
                onMouseEnter={() => setHoveredState('VT')}
                onMouseLeave={() => setHoveredState(null)}
              >
                {stateData.VT?.count > 0 && stateData.VT.count}
              </div>
            </div>
            <div className="col-start-10 col-span-1">
              {/* New Hampshire */}
              <div
                className="h-12 border border-gray-400 cursor-pointer hover:opacity-80 transition-all duration-200 flex items-center justify-center text-sm font-bold text-white rounded"
                style={{ backgroundColor: getStateColor(stateData.NH?.count || 0) }}
                onClick={() => handleStateClick('NH')}
                onMouseEnter={() => setHoveredState('NH')}
                onMouseLeave={() => setHoveredState(null)}
              >
                {stateData.NH?.count > 0 && stateData.NH.count}
              </div>
            </div>

            {/* Row 3 */}
            <div className="col-start-1 col-span-1">
              {/* Oregon */}
              <div
                className="h-12 border border-gray-400 cursor-pointer hover:opacity-80 transition-all duration-200 flex items-center justify-center text-sm font-bold text-white rounded"
                style={{ backgroundColor: getStateColor(stateData.OR?.count || 0) }}
                onClick={() => handleStateClick('OR')}
                onMouseEnter={() => setHoveredState('OR')}
                onMouseLeave={() => setHoveredState(null)}
              >
                {stateData.OR?.count > 0 && stateData.OR.count}
              </div>
            </div>
            <div className="col-start-2 col-span-1">
              {/* Idaho */}
              <div
                className="h-12 border border-gray-400 cursor-pointer hover:opacity-80 transition-all duration-200 flex items-center justify-center text-sm font-bold text-white rounded"
                style={{ backgroundColor: getStateColor(stateData.ID?.count || 0) }}
                onClick={() => handleStateClick('ID')}
                onMouseEnter={() => setHoveredState('ID')}
                onMouseLeave={() => setHoveredState(null)}
              >
                {stateData.ID?.count > 0 && stateData.ID.count}
              </div>
            </div>
            <div className="col-start-3 col-span-1">
              {/* Wyoming */}
              <div
                className="h-12 border border-gray-400 cursor-pointer hover:opacity-80 transition-all duration-200 flex items-center justify-center text-sm font-bold text-white rounded"
                style={{ backgroundColor: getStateColor(stateData.WY?.count || 0) }}
                onClick={() => handleStateClick('WY')}
                onMouseEnter={() => setHoveredState('WY')}
                onMouseLeave={() => setHoveredState(null)}
              >
                {stateData.WY?.count > 0 && stateData.WY.count}
              </div>
            </div>
            <div className="col-start-4 col-span-1">
              {/* South Dakota */}
              <div
                className="h-12 border border-gray-400 cursor-pointer hover:opacity-80 transition-all duration-200 flex items-center justify-center text-sm font-bold text-white rounded"
                style={{ backgroundColor: getStateColor(stateData.SD?.count || 0) }}
                onClick={() => handleStateClick('SD')}
                onMouseEnter={() => setHoveredState('SD')}
                onMouseLeave={() => setHoveredState(null)}
              >
                {stateData.SD?.count > 0 && stateData.SD.count}
              </div>
            </div>
            <div className="col-start-5 col-span-1">
              {/* Iowa */}
              <div
                className="h-12 border border-gray-400 cursor-pointer hover:opacity-80 transition-all duration-200 flex items-center justify-center text-sm font-bold text-white rounded"
                style={{ backgroundColor: getStateColor(stateData.IA?.count || 0) }}
                onClick={() => handleStateClick('IA')}
                onMouseEnter={() => setHoveredState('IA')}
                onMouseLeave={() => setHoveredState(null)}
              >
                {stateData.IA?.count > 0 && stateData.IA.count}
              </div>
            </div>
            <div className="col-start-6 col-span-1">
              {/* Illinois */}
              <div
                className="h-12 border border-gray-400 cursor-pointer hover:opacity-80 transition-all duration-200 flex items-center justify-center text-sm font-bold text-white rounded"
                style={{ backgroundColor: getStateColor(stateData.IL?.count || 0) }}
                onClick={() => handleStateClick('IL')}
                onMouseEnter={() => setHoveredState('IL')}
                onMouseLeave={() => setHoveredState(null)}
              >
                {stateData.IL?.count > 0 && stateData.IL.count}
              </div>
            </div>
            <div className="col-start-7 col-span-1">
              {/* Indiana */}
              <div
                className="h-12 border border-gray-400 cursor-pointer hover:opacity-80 transition-all duration-200 flex items-center justify-center text-sm font-bold text-white rounded"
                style={{ backgroundColor: getStateColor(stateData.IN?.count || 0) }}
                onClick={() => handleStateClick('IN')}
                onMouseEnter={() => setHoveredState('IN')}
                onMouseLeave={() => setHoveredState(null)}
              >
                {stateData.IN?.count > 0 && stateData.IN.count}
              </div>
            </div>
            <div className="col-start-8 col-span-1">
              {/* Ohio */}
              <div
                className="h-12 border border-gray-400 cursor-pointer hover:opacity-80 transition-all duration-200 flex items-center justify-center text-sm font-bold text-white rounded"
                style={{ backgroundColor: getStateColor(stateData.OH?.count || 0) }}
                onClick={() => handleStateClick('OH')}
                onMouseEnter={() => setHoveredState('OH')}
                onMouseLeave={() => setHoveredState(null)}
              >
                {stateData.OH?.count > 0 && stateData.OH.count}
              </div>
            </div>
            <div className="col-start-9 col-span-1">
              {/* Pennsylvania */}
              <div
                className="h-12 border border-gray-400 cursor-pointer hover:opacity-80 transition-all duration-200 flex items-center justify-center text-sm font-bold text-white rounded"
                style={{ backgroundColor: getStateColor(stateData.PA?.count || 0) }}
                onClick={() => handleStateClick('PA')}
                onMouseEnter={() => setHoveredState('PA')}
                onMouseLeave={() => setHoveredState(null)}
              >
                {stateData.PA?.count > 0 && stateData.PA.count}
              </div>
            </div>
            <div className="col-start-10 col-span-1">
              {/* Massachusetts */}
              <div
                className="h-12 border border-gray-400 cursor-pointer hover:opacity-80 transition-all duration-200 flex items-center justify-center text-sm font-bold text-white rounded"
                style={{ backgroundColor: getStateColor(stateData.MA?.count || 0) }}
                onClick={() => handleStateClick('MA')}
                onMouseEnter={() => setHoveredState('MA')}
                onMouseLeave={() => setHoveredState(null)}
              >
                {stateData.MA?.count > 0 && stateData.MA.count}
              </div>
            </div>

            {/* Row 4 */}
            <div className="col-start-1 col-span-2">
              {/* California */}
              <div
                className="h-16 border border-gray-400 cursor-pointer hover:opacity-80 transition-all duration-200 flex items-center justify-center text-lg font-bold text-white rounded"
                style={{ backgroundColor: getStateColor(stateData.CA?.count || 0) }}
                onClick={() => handleStateClick('CA')}
                onMouseEnter={() => setHoveredState('CA')}
                onMouseLeave={() => setHoveredState(null)}
              >
                {stateData.CA?.count > 0 && stateData.CA.count}
              </div>
            </div>
            <div className="col-start-3 col-span-1">
              {/* Nevada */}
              <div
                className="h-12 border border-gray-400 cursor-pointer hover:opacity-80 transition-all duration-200 flex items-center justify-center text-sm font-bold text-white rounded"
                style={{ backgroundColor: getStateColor(stateData.NV?.count || 0) }}
                onClick={() => handleStateClick('NV')}
                onMouseEnter={() => setHoveredState('NV')}
                onMouseLeave={() => setHoveredState(null)}
              >
                {stateData.NV?.count > 0 && stateData.NV.count}
              </div>
            </div>
            <div className="col-start-4 col-span-1">
              {/* Colorado */}
              <div
                className="h-12 border border-gray-400 cursor-pointer hover:opacity-80 transition-all duration-200 flex items-center justify-center text-sm font-bold text-white rounded"
                style={{ backgroundColor: getStateColor(stateData.CO?.count || 0) }}
                onClick={() => handleStateClick('CO')}
                onMouseEnter={() => setHoveredState('CO')}
                onMouseLeave={() => setHoveredState(null)}
              >
                {stateData.CO?.count > 0 && stateData.CO.count}
              </div>
            </div>
            <div className="col-start-5 col-span-1">
              {/* Nebraska */}
              <div
                className="h-12 border border-gray-400 cursor-pointer hover:opacity-80 transition-all duration-200 flex items-center justify-center text-sm font-bold text-white rounded"
                style={{ backgroundColor: getStateColor(stateData.NE?.count || 0) }}
                onClick={() => handleStateClick('NE')}
                onMouseEnter={() => setHoveredState('NE')}
                onMouseLeave={() => setHoveredState(null)}
              >
                {stateData.NE?.count > 0 && stateData.NE.count}
              </div>
            </div>
            <div className="col-start-6 col-span-1">
              {/* Missouri */}
              <div
                className="h-12 border border-gray-400 cursor-pointer hover:opacity-80 transition-all duration-200 flex items-center justify-center text-sm font-bold text-white rounded"
                style={{ backgroundColor: getStateColor(stateData.MO?.count || 0) }}
                onClick={() => handleStateClick('MO')}
                onMouseEnter={() => setHoveredState('MO')}
                onMouseLeave={() => setHoveredState(null)}
              >
                {stateData.MO?.count > 0 && stateData.MO.count}
              </div>
            </div>
            <div className="col-start-7 col-span-1">
              {/* Kentucky */}
              <div
                className="h-12 border border-gray-400 cursor-pointer hover:opacity-80 transition-all duration-200 flex items-center justify-center text-sm font-bold text-white rounded"
                style={{ backgroundColor: getStateColor(stateData.KY?.count || 0) }}
                onClick={() => handleStateClick('KY')}
                onMouseEnter={() => setHoveredState('KY')}
                onMouseLeave={() => setHoveredState(null)}
              >
                {stateData.KY?.count > 0 && stateData.KY.count}
              </div>
            </div>
            <div className="col-start-8 col-span-1">
              {/* West Virginia */}
              <div
                className="h-12 border border-gray-400 cursor-pointer hover:opacity-80 transition-all duration-200 flex items-center justify-center text-sm font-bold text-white rounded"
                style={{ backgroundColor: getStateColor(stateData.WV?.count || 0) }}
                onClick={() => handleStateClick('WV')}
                onMouseEnter={() => setHoveredState('WV')}
                onMouseLeave={() => setHoveredState(null)}
              >
                {stateData.WV?.count > 0 && stateData.WV.count}
              </div>
            </div>
            <div className="col-start-9 col-span-1">
              {/* Virginia */}
              <div
                className="h-12 border border-gray-400 cursor-pointer hover:opacity-80 transition-all duration-200 flex items-center justify-center text-sm font-bold text-white rounded"
                style={{ backgroundColor: getStateColor(stateData.VA?.count || 0) }}
                onClick={() => handleStateClick('VA')}
                onMouseEnter={() => setHoveredState('VA')}
                onMouseLeave={() => setHoveredState(null)}
              >
                {stateData.VA?.count > 0 && stateData.VA.count}
              </div>
            </div>
            <div className="col-start-10 col-span-1">
              {/* Maryland */}
              <div
                className="h-12 border border-gray-400 cursor-pointer hover:opacity-80 transition-all duration-200 flex items-center justify-center text-sm font-bold text-white rounded"
                style={{ backgroundColor: getStateColor(stateData.MD?.count || 0) }}
                onClick={() => handleStateClick('MD')}
                onMouseEnter={() => setHoveredState('MD')}
                onMouseLeave={() => setHoveredState(null)}
              >
                {stateData.MD?.count > 0 && stateData.MD.count}
              </div>
            </div>

            {/* Row 5 */}
            <div className="col-start-2 col-span-1">
              {/* Arizona */}
              <div
                className="h-12 border border-gray-400 cursor-pointer hover:opacity-80 transition-all duration-200 flex items-center justify-center text-sm font-bold text-white rounded"
                style={{ backgroundColor: getStateColor(stateData.AZ?.count || 0) }}
                onClick={() => handleStateClick('AZ')}
                onMouseEnter={() => setHoveredState('AZ')}
                onMouseLeave={() => setHoveredState(null)}
              >
                {stateData.AZ?.count > 0 && stateData.AZ.count}
              </div>
            </div>
            <div className="col-start-3 col-span-1">
              {/* New Mexico */}
              <div
                className="h-12 border border-gray-400 cursor-pointer hover:opacity-80 transition-all duration-200 flex items-center justify-center text-sm font-bold text-white rounded"
                style={{ backgroundColor: getStateColor(stateData.NM?.count || 0) }}
                onClick={() => handleStateClick('NM')}
                onMouseEnter={() => setHoveredState('NM')}
                onMouseLeave={() => setHoveredState(null)}
              >
                {stateData.NM?.count > 0 && stateData.NM.count}
              </div>
            </div>
            <div className="col-start-4 col-span-1">
              {/* Kansas */}
              <div
                className="h-12 border border-gray-400 cursor-pointer hover:opacity-80 transition-all duration-200 flex items-center justify-center text-sm font-bold text-white rounded"
                style={{ backgroundColor: getStateColor(stateData.KS?.count || 0) }}
                onClick={() => handleStateClick('KS')}
                onMouseEnter={() => setHoveredState('KS')}
                onMouseLeave={() => setHoveredState(null)}
              >
                {stateData.KS?.count > 0 && stateData.KS.count}
              </div>
            </div>
            <div className="col-start-5 col-span-1">
              {/* Arkansas */}
              <div
                className="h-12 border border-gray-400 cursor-pointer hover:opacity-80 transition-all duration-200 flex items-center justify-center text-sm font-bold text-white rounded"
                style={{ backgroundColor: getStateColor(stateData.AR?.count || 0) }}
                onClick={() => handleStateClick('AR')}
                onMouseEnter={() => setHoveredState('AR')}
                onMouseLeave={() => setHoveredState(null)}
              >
                {stateData.AR?.count > 0 && stateData.AR.count}
              </div>
            </div>
            <div className="col-start-6 col-span-1">
              {/* Tennessee */}
              <div
                className="h-12 border border-gray-400 cursor-pointer hover:opacity-80 transition-all duration-200 flex items-center justify-center text-sm font-bold text-white rounded"
                style={{ backgroundColor: getStateColor(stateData.TN?.count || 0) }}
                onClick={() => handleStateClick('TN')}
                onMouseEnter={() => setHoveredState('TN')}
                onMouseLeave={() => setHoveredState(null)}
              >
                {stateData.TN?.count > 0 && stateData.TN.count}
              </div>
            </div>
            <div className="col-start-7 col-span-1">
              {/* North Carolina */}
              <div
                className="h-12 border border-gray-400 cursor-pointer hover:opacity-80 transition-all duration-200 flex items-center justify-center text-sm font-bold text-white rounded"
                style={{ backgroundColor: getStateColor(stateData.NC?.count || 0) }}
                onClick={() => handleStateClick('NC')}
                onMouseEnter={() => setHoveredState('NC')}
                onMouseLeave={() => setHoveredState(null)}
              >
                {stateData.NC?.count > 0 && stateData.NC.count}
              </div>
            </div>
            <div className="col-start-8 col-span-1">
              {/* South Carolina */}
              <div
                className="h-12 border border-gray-400 cursor-pointer hover:opacity-80 transition-all duration-200 flex items-center justify-center text-sm font-bold text-white rounded"
                style={{ backgroundColor: getStateColor(stateData.SC?.count || 0) }}
                onClick={() => handleStateClick('SC')}
                onMouseEnter={() => setHoveredState('SC')}
                onMouseLeave={() => setHoveredState(null)}
              >
                {stateData.SC?.count > 0 && stateData.SC.count}
              </div>
            </div>
            <div className="col-start-9 col-span-1">
              {/* Delaware */}
              <div
                className="h-12 border border-gray-400 cursor-pointer hover:opacity-80 transition-all duration-200 flex items-center justify-center text-sm font-bold text-white rounded"
                style={{ backgroundColor: getStateColor(stateData.DE?.count || 0) }}
                onClick={() => handleStateClick('DE')}
                onMouseEnter={() => setHoveredState('DE')}
                onMouseLeave={() => setHoveredState(null)}
              >
                {stateData.DE?.count > 0 && stateData.DE.count}
              </div>
            </div>

            {/* Row 6 - Southern states */}
            <div className="col-start-3 col-span-2">
              {/* Texas */}
              <div
                className="h-16 border border-gray-400 cursor-pointer hover:opacity-80 transition-all duration-200 flex items-center justify-center text-lg font-bold text-white rounded"
                style={{ backgroundColor: getStateColor(stateData.TX?.count || 0) }}
                onClick={() => handleStateClick('TX')}
                onMouseEnter={() => setHoveredState('TX')}
                onMouseLeave={() => setHoveredState(null)}
              >
                {stateData.TX?.count > 0 && stateData.TX.count}
              </div>
            </div>
            <div className="col-start-5 col-span-1">
              {/* Louisiana */}
              <div
                className="h-12 border border-gray-400 cursor-pointer hover:opacity-80 transition-all duration-200 flex items-center justify-center text-sm font-bold text-white rounded"
                style={{ backgroundColor: getStateColor(stateData.LA?.count || 0) }}
                onClick={() => handleStateClick('LA')}
                onMouseEnter={() => setHoveredState('LA')}
                onMouseLeave={() => setHoveredState(null)}
              >
                {stateData.LA?.count > 0 && stateData.LA.count}
              </div>
            </div>
            <div className="col-start-6 col-span-1">
              {/* Mississippi */}
              <div
                className="h-12 border border-gray-400 cursor-pointer hover:opacity-80 transition-all duration-200 flex items-center justify-center text-sm font-bold text-white rounded"
                style={{ backgroundColor: getStateColor(stateData.MS?.count || 0) }}
                onClick={() => handleStateClick('MS')}
                onMouseEnter={() => setHoveredState('MS')}
                onMouseLeave={() => setHoveredState(null)}
              >
                {stateData.MS?.count > 0 && stateData.MS.count}
              </div>
            </div>
            <div className="col-start-7 col-span-1">
              {/* Alabama */}
              <div
                className="h-12 border border-gray-400 cursor-pointer hover:opacity-80 transition-all duration-200 flex items-center justify-center text-sm font-bold text-white rounded"
                style={{ backgroundColor: getStateColor(stateData.AL?.count || 0) }}
                onClick={() => handleStateClick('AL')}
                onMouseEnter={() => setHoveredState('AL')}
                onMouseLeave={() => setHoveredState(null)}
              >
                {stateData.AL?.count > 0 && stateData.AL.count}
              </div>
            </div>
            <div className="col-start-8 col-span-1">
              {/* Georgia */}
              <div
                className="h-12 border border-gray-400 cursor-pointer hover:opacity-80 transition-all duration-200 flex items-center justify-center text-sm font-bold text-white rounded"
                style={{ backgroundColor: getStateColor(stateData.GA?.count || 0) }}
                onClick={() => handleStateClick('GA')}
                onMouseEnter={() => setHoveredState('GA')}
                onMouseLeave={() => setHoveredState(null)}
              >
                {stateData.GA?.count > 0 && stateData.GA.count}
              </div>
            </div>
            <div className="col-start-9 col-span-2">
              {/* Florida */}
              <div
                className="h-12 border border-gray-400 cursor-pointer hover:opacity-80 transition-all duration-200 flex items-center justify-center text-sm font-bold text-white rounded"
                style={{ backgroundColor: getStateColor(stateData.FL?.count || 0) }}
                onClick={() => handleStateClick('FL')}
                onMouseEnter={() => setHoveredState('FL')}
                onMouseLeave={() => setHoveredState(null)}
              >
                {stateData.FL?.count > 0 && stateData.FL.count}
              </div>
            </div>

            {/* Alaska and Hawaii in bottom corners */}
            <div className="col-start-1 col-span-1 mt-4">
              {/* Alaska */}
              <div
                className="h-10 border border-gray-400 cursor-pointer hover:opacity-80 transition-all duration-200 flex items-center justify-center text-xs font-bold text-white rounded"
                style={{ backgroundColor: getStateColor(stateData.AK?.count || 0) }}
                onClick={() => handleStateClick('AK')}
                onMouseEnter={() => setHoveredState('AK')}
                onMouseLeave={() => setHoveredState(null)}
              >
                {stateData.AK?.count > 0 && stateData.AK.count}
              </div>
            </div>
            <div className="col-start-2 col-span-1 mt-4">
              {/* Hawaii */}
              <div
                className="h-10 border border-gray-400 cursor-pointer hover:opacity-80 transition-all duration-200 flex items-center justify-center text-xs font-bold text-white rounded"
                style={{ backgroundColor: getStateColor(stateData.HI?.count || 0) }}
                onClick={() => handleStateClick('HI')}
                onMouseEnter={() => setHoveredState('HI')}
                onMouseLeave={() => setHoveredState(null)}
              >
                {stateData.HI?.count > 0 && stateData.HI.count}
              </div>
            </div>
          </div>

          {/* Tooltip */}
          {hoveredState && stateData[hoveredState] && (
            <div className="absolute top-4 right-4 bg-white border rounded-lg p-3 shadow-xl z-10 min-w-[140px]">
              <div className="font-semibold text-gray-900">{stateData[hoveredState].name}</div>
              <div className="text-sm text-gray-600">
                {stateData[hoveredState].count} member{stateData[hoveredState].count !== 1 ? 's' : ''}
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Legend */}
        <div className="mt-8 flex flex-col items-center">
          <div className="text-lg font-semibold mb-4 text-gray-800">Member Count</div>
          <div className="flex flex-wrap gap-6 justify-center bg-white rounded-lg p-4 border shadow-sm">
            {[
              { range: "0", color: "#e5e7eb", label: "No members" },
              { range: "1-2", color: "#dbeafe", label: "1-2 members" },
              { range: "3-5", color: "#93c5fd", label: "3-5 members" },
              { range: "6-10", color: "#3b82f6", label: "6-10 members" },
              { range: "10+", color: "#1d4ed8", label: "10+ members" }
            ].map((item) => (
              <div key={item.range} className="flex items-center gap-3">
                <div 
                  className="w-5 h-5 border border-gray-400 rounded shadow-sm"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium text-gray-700">{item.range}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default USMembersMap;