import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import "mapbox-gl/dist/mapbox-gl.css";

/** State centroids for USA map clustering */
const STATE_CENTROIDS: Record<string, [number, number]> = {
  AL: [-86.80, 32.80], AK: [-152.40, 64.20], AZ: [-111.93, 34.20], AR: [-92.44, 35.20],
  CA: [-119.70, 36.78], CO: [-105.55, 39.00], CT: [-72.70, 41.60], DC: [-77.04, 38.90],
  DE: [-75.50, 39.00], FL: [-81.52, 27.76], GA: [-83.44, 32.65], HI: [-155.58, 19.90],
  IA: [-93.50, 41.88], ID: [-114.14, 44.07], IL: [-89.40, 40.00], IN: [-86.13, 39.90],
  KS: [-98.38, 38.50], KY: [-84.27, 37.60], LA: [-91.96, 31.05], MA: [-71.38, 42.40],
  MD: [-76.70, 39.00], ME: [-69.24, 45.40], MI: [-84.76, 44.30], MN: [-94.69, 46.00],
  MO: [-92.60, 38.60], MS: [-89.70, 32.70], MT: [-110.00, 47.00], NC: [-79.02, 35.50],
  ND: [-100.40, 47.50], NE: [-99.90, 41.50], NH: [-71.58, 43.93], NJ: [-74.40, 40.10],
  NM: [-106.10, 34.40], NV: [-116.70, 39.30], NY: [-75.00, 42.90], OH: [-82.80, 40.30],
  OK: [-97.52, 35.50], OR: [-120.55, 43.90], PA: [-77.70, 41.10], RI: [-71.50, 41.70],
  SC: [-80.90, 33.70], SD: [-100.00, 44.50], TN: [-86.40, 35.80], TX: [-99.40, 31.00],
  UT: [-111.70, 39.40], VA: [-78.50, 37.50], VT: [-72.70, 44.00], WA: [-120.50, 47.40],
  WI: [-89.60, 44.50], WV: [-80.62, 38.70], WY: [-107.55, 43.00]
};

interface USMembersMapProps {
  onStateClick?: (state: string) => void;
}

const USMembersMap = ({ onStateClick }: USMembersMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map with dummy token (will be replaced with user's token)
    mapboxgl.accessToken = 'pk.eyJ1IjoidGVzdC11c2VyIiwiYSI6ImNsempycWlhZTEwZGwzbHM0Y2hpNG9uNzEifQ.example';

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [-98.5, 39.8],
      zoom: 3.2,
      projection: 'mercator'
    });

    const loadStateData = async () => {
      try {
        setLoading(true);

        // Aggregate members by state
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
          if (state) {
            stateCounts[state] = (stateCounts[state] || 0) + 1;
          }
        });

        // Create markers for each state with members
        Object.entries(stateCounts).forEach(([state, count]) => {
          const center = STATE_CENTROIDS[state];
          if (!center || count === 0) return;

          const el = document.createElement("div");
          el.className = "cluster-badge bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer rounded-full flex items-center justify-center font-semibold text-sm border-2 border-background shadow-lg";
          el.style.width = "40px";
          el.style.height = "40px";
          el.innerHTML = count.toString();
          
          el.onclick = () => {
            if (onStateClick) {
              onStateClick(state);
            }
          };

          new mapboxgl.Marker(el).setLngLat(center).addTo(map.current!);
        });

      } catch (error) {
        console.error('Error loading USA map data:', error);
      } finally {
        setLoading(false);
      }
    };

    map.current.on('load', loadStateData);

    return () => {
      map.current?.remove();
    };
  }, [onStateClick]);

  return (
    <Card className="relative overflow-hidden">
      <div 
        ref={mapContainer} 
        className="h-[500px] w-full rounded-lg bg-muted/20"
      />
      {loading && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Loading USA map...</p>
          </div>
        </div>
      )}
      <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 border shadow-lg">
        <div className="text-sm font-medium mb-1">USA Members Map</div>
        <div className="text-xs text-muted-foreground space-y-1">
          <div>🔵 Blue circles = State clusters</div>
          <div>Numbers show member count</div>
          <div>Click to zoom into state</div>
        </div>
      </div>
    </Card>
  );
};

export default USMembersMap;