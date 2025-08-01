"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, GeoJSON, ZoomControl, LayersControl } from "react-leaflet";
import { FeatureCollection } from "geojson";
import L from "leaflet";
import { useMapData } from "@/hooks/useMapData";

// Import styles
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

interface MapProps {
  data: FeatureCollection;
  onRegionSelect?: (region: string) => void;
}

const MapClient = ({ data, onRegionSelect }: MapProps) => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const geoJsonRef = useRef<L.GeoJSON | null>(null);
  
  const { getRegionColor, generateTooltipContent } = useMapData();

  // Define bounds for Indonesia with some padding using useMemo
  const indonesiaBounds: L.LatLngBoundsExpression = useMemo(() => [
    [-11.0, 94.0], // South West corner
    [6.0, 141.0],  // North East corner
  ], []);
  
  // Define more specific bounds for Java Island using useMemo
  const javaBounds: L.LatLngBoundsExpression = useMemo(() => [
    [-8.8, 105.0], // South West corner
    [-5.0, 114.6], // North East corner
  ], []);

  // Function to handle events for each GeoJSON feature
  const onEachFeature = (feature: GeoJSON.Feature, layer: L.Layer) => {
    const properties = feature?.properties || {};
    const tooltipContent = generateTooltipContent(properties);
    
    layer.bindTooltip(tooltipContent, {
      className: 'custom-tooltip',
      direction: 'top',
      permanent: false,
      sticky: true,
      offset: [0, -10]
    });

    // Mouse events for highlighting with Twitter-style interactions
    layer.on({
      mouseover: (e: L.LeafletMouseEvent) => {
        const targetLayer = e.target as L.Path;
        targetLayer.setStyle({
          weight: 3,
          color: 'oklch(0.6397 0.1720 36.4421)', // Primary color from CSS variables
          fillOpacity: 0.85,
          dashArray: '',
        });
        targetLayer.bringToFront();
        
        // Add smooth transition effect with type assertion
        const pathElement = (targetLayer as L.Path & { _path?: HTMLElement })._path;
        if (pathElement) {
          pathElement.style.transition = 'all 0.2s ease-out';
        }
      },
      mouseout: (e: L.LeafletMouseEvent) => {
        const targetLayer = e.target as L.Path;
        geoJsonRef.current?.resetStyle(targetLayer);
        
        // Reset transition
        const pathElement = (targetLayer as L.Path & { _path?: HTMLElement })._path;
        if (pathElement) {
          pathElement.style.transition = '';
        }
      },
      click: (e: L.LeafletMouseEvent) => {
        const regionName = properties?.NAMOBJ || properties?.WADMKK || properties?.NAME_2 || "Unknown";
        setSelectedRegion(regionName);
        onRegionSelect?.(regionName);
        
        // Twitter-style zoom animation
        const map = mapRef.current;
        const targetLayer = e.target as L.Path & { getBounds?: () => L.LatLngBounds };
        if (map && targetLayer.getBounds) {
          map.flyToBounds(targetLayer.getBounds(), {
            padding: [30, 30],
            maxZoom: 10,
            duration: 1.2,
            easeLinearity: 0.25
          });
        }
        
        // Add selection highlight
        targetLayer.setStyle({
          weight: 4,
          color: 'oklch(0.6397 0.1720 36.4421)',
          fillOpacity: 0.9,
          dashArray: '5, 5',
        });
      }
    });
  };

  // Initialize map and add legend
  useEffect(() => {
    if (!mapRef.current) return;

    // Create modern Twitter-style legend
    const legendContainer = document.createElement('div');
    legendContainer.className = 'leaflet-control info legend leaflet-control-custom';
    legendContainer.style.cssText = `
      padding: 16px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(0, 0, 0, 0.08);
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
      font-size: 13px;
      line-height: 1.5;
      max-width: 180px;
      transition: all 0.2s ease;
    `;
    
    legendContainer.innerHTML = `
      <div style="font-size: 14px; font-weight: 700; margin-bottom: 12px; color: #0f1419;">Risk Level</div>
      <div style="display: flex; align-items: center; margin-bottom: 8px; padding: 4px 0;">
        <div style="background: linear-gradient(135deg, #ef4444, #dc2626); width: 16px; height: 16px; margin-right: 10px; border-radius: 4px; box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);"></div>
        <span style="font-size: 13px; font-weight: 500; color: #536471;">High Risk</span>
      </div>
      <div style="display: flex; align-items: center; margin-bottom: 8px; padding: 4px 0;">
        <div style="background: linear-gradient(135deg, #f97316, #ea580c); width: 16px; height: 16px; margin-right: 10px; border-radius: 4px; box-shadow: 0 2px 4px rgba(249, 115, 22, 0.3);"></div>
        <span style="font-size: 13px; font-weight: 500; color: #536471;">Medium-High</span>
      </div>
      <div style="display: flex; align-items: center; margin-bottom: 8px; padding: 4px 0;">
        <div style="background: linear-gradient(135deg, #fbbf24, #f59e0b); width: 16px; height: 16px; margin-right: 10px; border-radius: 4px; box-shadow: 0 2px 4px rgba(251, 191, 36, 0.3);"></div>
        <span style="font-size: 13px; font-weight: 500; color: #536471;">Medium</span>
      </div>
      <div style="display: flex; align-items: center; margin-bottom: 8px; padding: 4px 0;">
        <div style="background: linear-gradient(135deg, #22c55e, #16a34a); width: 16px; height: 16px; margin-right: 10px; border-radius: 4px; box-shadow: 0 2px 4px rgba(34, 197, 94, 0.3);"></div>
        <span style="font-size: 13px; font-weight: 500; color: #536471;">Low Risk</span>
      </div>
      <div style="display: flex; align-items: center; padding: 4px 0;">
        <div style="background: linear-gradient(135deg, #60a5fa, #3b82f6); width: 16px; height: 16px; margin-right: 10px; border-radius: 4px; box-shadow: 0 2px 4px rgba(96, 165, 250, 0.3);"></div>
        <span style="font-size: 13px; font-weight: 500; color: #536471;">Unknown</span>
      </div>
    `;
    
    // Add hover effect to legend
    legendContainer.addEventListener('mouseenter', () => {
      legendContainer.style.transform = 'translateY(-2px)';
      legendContainer.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.15)';
    });
    
    legendContainer.addEventListener('mouseleave', () => {
      legendContainer.style.transform = 'translateY(0)';
      legendContainer.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12)';
    });
    
    // Get the map container and append the legend
    const mapContainer = mapRef.current.getContainer();
    mapContainer.appendChild(legendContainer);
    
    // Apply bounds restrictions with smooth animation
    mapRef.current.setMaxBounds(indonesiaBounds);
    mapRef.current.setMinZoom(5);
    mapRef.current.setMaxZoom(12);
    mapRef.current.fitBounds(javaBounds);
    
    // Clean up function
    return () => {
      if (mapContainer && legendContainer) {
        try {
          mapContainer.removeChild(legendContainer);
        } catch (e) {
          console.error('Error removing legend:', e);
        }
      }
    };
  }, [indonesiaBounds, javaBounds]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-border/50 bg-card shadow-lg">
      <MapContainer
        bounds={javaBounds}
        style={{ height: "100%", width: "100%" }}
        className="rounded-xl z-0"
        zoomControl={false}
        maxBounds={indonesiaBounds}
        maxBoundsViscosity={1.0}
        minZoom={5}
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
        <GeoJSON 
          data={data} 
          style={(feature) => ({
            fillColor: getRegionColor(feature?.properties?.NAMOBJ || feature?.properties?.WADMKK || feature?.properties?.NAME_2 || ""),
            color: 'rgba(15, 20, 25, 0.2)',
            weight: 1.5,
            fillOpacity: 0.75,
            className: 'transition-all duration-200 ease-out hover:drop-shadow-lg'
          })}
          onEachFeature={onEachFeature}
          ref={(layer) => {
            if (layer) geoJsonRef.current = layer;
          }}
        />
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
