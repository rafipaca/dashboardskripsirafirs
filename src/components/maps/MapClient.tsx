"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, ZoomControl, LayersControl } from "react-leaflet";
import { FeatureCollection } from "geojson";
import L, { type PathOptions } from "leaflet";
import { useMapData } from "@/hooks/useMapData";

// Import styles
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

interface MapClientProps {
  data: FeatureCollection | null;
  onRegionSelect?: (region: string | null) => void;
  activeLayer: string;
  selectedRegion?: string | null;
  onPredictionSelect?: (regionName: string | null) => void;
}

const MapClient = ({ data, onRegionSelect, activeLayer, selectedRegion, onPredictionSelect }: MapClientProps) => {
  const [internalSelectedRegion, setSelectedRegion] = useState<string | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const geoJsonRef = useRef<L.GeoJSON | null>(null);
  
  const { getFeatureStyle, generateTooltipContent, styleVersion } = useMapData();

  // Define tighter bounds for Java Island to restrict zoom out area
  const javaBounds: L.LatLngBoundsExpression = useMemo(() => [
    [-8.5, 105.5], // South West corner (Banten) - tighter bounds
    [-5.5, 114.0], // North East corner (Jawa Timur) - tighter bounds
  ], []);
  
  // Define more restrictive bounds to keep focus on Java Island
  useEffect(() => {
    if (selectedRegion && geoJsonRef.current && mapRef.current) {
      const layers = geoJsonRef.current.getLayers();
      const targetLayer = layers.find(layer => {
        const feature = (layer as L.Layer & { feature?: { properties?: Record<string, unknown> } }).feature;
        const regionName = feature?.properties?.NAMOBJ || feature?.properties?.WADMKK;
        return typeof regionName === 'string' && regionName.toLowerCase() === selectedRegion.toLowerCase();
      });

      if (targetLayer) {
        const bounds = (targetLayer as L.GeoJSON).getBounds();
        mapRef.current.flyToBounds(bounds, {
          padding: [50, 50],
          maxZoom: 11,
          duration: 1.5,
        });
      }
    }
  }, [selectedRegion]);



  // Function to handle events for each GeoJSON feature
  const onEachFeature = (feature: GeoJSON.Feature, layer: L.Layer) => {
    const properties = feature?.properties || {};
    const tooltipContent = generateTooltipContent(feature);
    
    layer.bindTooltip(tooltipContent, {
      className: 'custom-tooltip',
      direction: 'top',
      permanent: false,
      sticky: true,
      offset: [0, -10]
    });

    layer.on({
      mouseover: (e: L.LeafletMouseEvent) => {
        const targetLayer = e.target as L.Path;
        targetLayer.setStyle({ weight: 3, color: '#000' });
        targetLayer.bringToFront();
      },
      mouseout: (e: L.LeafletMouseEvent) => {
        const targetLayer = e.target as L.Path;
        targetLayer.setStyle(getFeatureStyle(feature, activeLayer));
      },
      click: (e: L.LeafletMouseEvent) => {
        // Prefer NAMOBJ (aligned with CSV) to preserve Kota/Kabupaten/Admin names exactly
        const regionName = properties?.NAMOBJ || properties?.WADMKK || properties?.NAME_2 || "Unknown";

        // Toggle only if clicking exactly the same full name
        const newSelectedRegion = internalSelectedRegion && internalSelectedRegion === regionName ? null : regionName;
        setSelectedRegion(newSelectedRegion);
        onRegionSelect?.(newSelectedRegion);
        
        if (onPredictionSelect) {
          onPredictionSelect(newSelectedRegion);
        }

        const map = mapRef.current;
        const target = e.target as L.Layer & { getBounds?: () => L.LatLngBounds };
        if (map && target.getBounds) {
          map.flyToBounds(target.getBounds(), {
            padding: [30, 30],
            maxZoom: 10,
            duration: 1.2,
            easeLinearity: 0.25
          });
        }
      }
    });
  };

  // Initialize map bounds (no custom legend)
  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.setMaxBounds(javaBounds);
    mapRef.current.setMinZoom(7);
    mapRef.current.setMaxZoom(12);
    mapRef.current.fitBounds(javaBounds);
  }, [javaBounds]);

  // Refresh styles when data becomes ready or layer changes
  useEffect(() => {
    if (!geoJsonRef.current) return;
    try {
      geoJsonRef.current.eachLayer((layer: L.Layer) => {
        const candidate = layer as L.Layer & { feature?: GeoJSON.Feature };
        const feature = candidate.feature;
        if (feature && (layer as L.Path).setStyle) {
          const pathLayer = layer as L.Path;
          const nextStyle = getFeatureStyle(feature, activeLayer) as PathOptions;
          pathLayer.setStyle(nextStyle);
        }
      });
    } catch {
      // no-op: safe guard for any leaflet internals
    }
  }, [styleVersion, activeLayer, getFeatureStyle]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-border/50 bg-card shadow-lg">
      <MapContainer
        bounds={javaBounds}
        style={{ height: "100%", width: "100%" }}
        className="rounded-xl z-0"
        zoomControl={false}
        maxBounds={javaBounds}
        maxBoundsViscosity={1.0}
        minZoom={7}
        maxZoom={12}
        ref={(map) => {
          if (map) mapRef.current = map;
        }}
      >
        {/* Custom Twitter-style zoom controls */}
        <ZoomControl position="topleft" />
        
        {/* Modern layer controls */}
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Default">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              noWrap={true}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution='&copy; <a href="https://www.esri.com">Esri</a>'
              noWrap={true}
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        
        {/* Enhanced GeoJSON with Twitter-style interactions */}
    {data && (
          <GeoJSON 
      key={`${activeLayer}-${styleVersion}-${data.features.length}-${selectedRegion || 'initial'}`}
            data={data} 
            style={(feature) => {
              const baseStyle = feature ? getFeatureStyle(feature, activeLayer) : { weight: 1, fillOpacity: 0.7 };
              const regionName = feature?.properties?.NAMOBJ || feature?.properties?.WADMKK || feature?.properties?.NAME_2 || "";
              const isSelected = selectedRegion ? (regionName === selectedRegion) : false;
              
              return {
                ...baseStyle,
                color: isSelected ? '#0f1419' : 'rgba(15, 20, 25, 0.2)',
                weight: isSelected ? 3 : baseStyle.weight,
                fillOpacity: isSelected ? 0.9 : baseStyle.fillOpacity,
              };
            }}
            onEachFeature={onEachFeature}
            ref={(layer) => {
              if (layer) geoJsonRef.current = layer;
            }}
          />
        )}
      </MapContainer>
      
      {/* Selection indicator */}
      {selectedRegion && (
        <div className="absolute top-4 left-4 bg-background/95 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-lg">
          <p className="text-sm font-medium text-foreground">
            Selected: <span className="text-primary">{selectedRegion}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default MapClient;
