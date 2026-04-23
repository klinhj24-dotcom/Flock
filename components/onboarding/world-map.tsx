"use client";

import { useMemo, useState } from "react";
import { geoEqualEarth, geoContains } from "d3-geo";
import { feature } from "topojson-client";
import type { Feature, Geometry } from "geojson";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import worldData from "world-atlas/countries-110m.json";
import { X } from "lucide-react";

export type Pin = {
  id: string;
  lon: number;
  lat: number;
  country: string;
};

type CountryProps = { name: string };

// TopoJSON → GeoJSON, done once
const WORLD = feature(
  worldData as unknown as Parameters<typeof feature>[0],
  (worldData as unknown as { objects: { countries: unknown } }).objects
    .countries as Parameters<typeof feature>[1]
) as unknown as { features: Feature<Geometry, CountryProps>[] };

const WIDTH = 900;
const HEIGHT = 480;

export function WorldMap({
  pins,
  setPins,
  max = 3,
}: {
  pins: Pin[];
  setPins: (pins: Pin[]) => void;
  max?: number;
}) {
  const [hoverCountry, setHoverCountry] = useState<string | null>(null);

  const projection = useMemo(
    () =>
      geoEqualEarth()
        .scale(160)
        .translate([WIDTH / 2, HEIGHT / 2]),
    []
  );

  const findCountryAt = (lon: number, lat: number): string => {
    const hit = WORLD.features.find((f) => geoContains(f, [lon, lat]));
    return hit?.properties?.name ?? "Ocean";
  };

  const handleMapClick = (e: React.MouseEvent<SVGElement>) => {
    const target = e.target as SVGElement;
    const svg = (target.ownerSVGElement ??
      (target as unknown as SVGSVGElement)) as SVGSVGElement | null;
    if (!svg) return;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const { x, y } = pt.matrixTransform(ctm.inverse());
    const inverted = projection.invert?.([x, y]);
    if (!inverted) return;
    const [lon, lat] = inverted;
    const country = findCountryAt(lon, lat);
    if (country === "Ocean") return;
    if (pins.length >= max) return;
    setPins([
      ...pins,
      { id: `p-${Date.now()}`, lon, lat, country },
    ]);
  };

  const removePin = (id: string) =>
    setPins(pins.filter((p) => p.id !== id));

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-[#0a0a12]">
      <div className="relative">
        <ComposableMap
          width={WIDTH}
          height={HEIGHT}
          projection="geoEqualEarth"
          projectionConfig={{ scale: 160 }}
          onClick={handleMapClick}
          className="w-full cursor-crosshair"
          style={{ background: "#0a0a12" }}
        >
          <Geographies geography={WORLD}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const name = (geo.properties as CountryProps).name;
                const hovered = hoverCountry === name;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => setHoverCountry(name)}
                    onMouseLeave={() => setHoverCountry(null)}
                    style={{
                      default: {
                        fill: "#1a1a28",
                        stroke: "#2a2a40",
                        strokeWidth: 0.5,
                        outline: "none",
                      },
                      hover: {
                        fill: hovered ? "#2a2a40" : "#1a1a28",
                        stroke: "#E8D5A3",
                        strokeWidth: 0.75,
                        outline: "none",
                        cursor: "crosshair",
                      },
                      pressed: {
                        fill: "#2a2a40",
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {pins.map((p, i) => (
            <Marker
              key={p.id}
              coordinates={[p.lon, p.lat]}
              onClick={(e) => {
                e.stopPropagation();
                removePin(p.id);
              }}
            >
              <g style={{ cursor: "pointer" }}>
                <circle
                  r={14}
                  fill="rgba(232, 213, 163, 0.2)"
                  stroke="#E8D5A3"
                  strokeWidth={1.5}
                />
                <circle r={6} fill="#E8D5A3" />
                <text
                  textAnchor="middle"
                  y={3}
                  fontSize={9}
                  fontWeight={700}
                  fill="#0a0a0f"
                >
                  {i + 1}
                </text>
              </g>
            </Marker>
          ))}
        </ComposableMap>

        {/* Hover label */}
        {hoverCountry && (
          <div className="pointer-events-none absolute left-3 top-3 rounded-full border border-border bg-black/60 px-2.5 py-1 text-[11px] text-text-primary backdrop-blur">
            {hoverCountry}
          </div>
        )}

        {/* Pin counter */}
        <div className="pointer-events-none absolute right-3 top-3 rounded-full border border-primary/30 bg-black/60 px-3 py-1 text-[11px] font-medium text-primary backdrop-blur">
          {pins.length} / {max} pinned
        </div>
      </div>

      {/* Pin list */}
      {pins.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-border bg-surface px-4 py-3">
          {pins.map((p, i) => (
            <span
              key={p.id}
              className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[12px] text-primary"
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-background">
                {i + 1}
              </span>
              {p.country}
              <button
                onClick={() => removePin(p.id)}
                className="text-primary/70 transition hover:text-primary"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
