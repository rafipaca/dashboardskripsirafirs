"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

import { MapContainer, TileLayer, GeoJSON, ZoomControl, LayersControl, Tooltip } from "react-leaflet";
import { FeatureCollection } from "geojson";
import { LatLngBoundsExpression } from "leaflet";
import L from "leaflet";
import { useState, useRef, useEffect } from "react";

interface MapProps {
  data: FeatureCollection;
  onRegionSelect?: (region: string) => void;
}

const Map = ({ data, onRegionSelect }: MapProps) => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const geoJsonRef = useRef<L.GeoJSON | null>(null);
  
  // Define bounds for Indonesia with some padding
  // This will restrict the view to Indonesia and prevent panning too far outside
  const indonesiaBounds: LatLngBoundsExpression = [
    [-11.0, 94.0], // South West corner (extends beyond Java to include Sumatra)
    [6.0, 141.0],  // North East corner (extends to Papua)
  ];
  
  // Define more specific bounds for Java Island that will be initially shown
  const javaBounds: LatLngBoundsExpression = [
    [-8.8, 105.0], // South West corner
    [-5.0, 114.6], // North East corner
  ];

  // Function to get color based on region risk level (mocked data for now)
  const getRegionColor = (properties: any) => {
    const nama = properties.NAMOBJ || properties.WADMKK || properties.NAME_2 || "";
    
    // Simulate different risk levels based on region name for demo purposes
    // In a real app, this would come from actual data
    if (nama.toLowerCase().includes("jakarta") || nama.toLowerCase().includes("bandung")) {
      return "#ef4444"; // High risk - red
    } else if (nama.toLowerCase().includes("bogor") || nama.toLowerCase().includes("depok") || 
               nama.toLowerCase().includes("bekasi") || nama.toLowerCase().includes("tangerang") ||
               nama.toLowerCase().includes("cianjur")) {
      return "#f97316"; // Medium-high risk - orange
    } else if (nama.toLowerCase().includes("semarang") || nama.toLowerCase().includes("surabaya") ||
               nama.toLowerCase().includes("malang")) {
      return "#fbbf24"; // Medium risk - yellow
    } else if (nama.toLowerCase().includes("yogyakarta") || nama.toLowerCase().includes("solo")) {
      return "#22c55e"; // Low risk - green
    }
    
    return "#60a5fa"; // Default - blue
  };

  // Generate tooltip content based on feature properties
  const generateTooltipContent = (properties: any) => {
    const nama = properties.NAMOBJ || properties.WADMKK || properties.NAME_2 || "(Tanpa Nama)";
    let content = `<div class="map-tooltip">
      <h3 class="font-bold text-md">${nama}</h3>`;
    
    // Mock data for demonstration
    if (nama.toLowerCase().includes("cianjur")) {
      content += `
        <div class="text-sm mt-1">
          <div><span class="font-medium">Kasus:</span> 153</div>
          <div><span class="font-medium">s1:</span> Signifikan (p<0.05)</div>
          <div><span class="font-medium">s2:</span> Signifikan (p<0.05)</div>
          <div><span class="font-medium">Risk Level:</span> Medium-high</div>
        </div>`;
    } else if (nama.toLowerCase().includes("jakarta")) {
      content += `
        <div class="text-sm mt-1">
          <div><span class="font-medium">Kasus:</span> 289</div>
          <div><span class="font-medium">s1:</span> Signifikan (p<0.01)</div>
          <div><span class="font-medium">s2:</span> Signifikan (p<0.01)</div>
          <div><span class="font-medium">Risk Level:</span> High</div>
        </div>`;
    } else if (nama.toLowerCase().includes("bandung")) {
      content += `
        <div class="text-sm mt-1">
          <div><span class="font-medium">Kasus:</span> 214</div>
          <div><span class="font-medium">s1:</span> Signifikan (p<0.01)</div>
          <div><span class="font-medium">s2:</span> Tidak signifikan</div>
          <div><span class="font-medium">Risk Level:</span> High</div>
        </div>`;
    } else {
      content += `
        <div class="text-sm mt-1">
          <div><span class="font-medium">Kasus:</span> N/A</div>
          <div><span class="font-medium">s1:</span> N/A</div>
          <div><span class="font-medium">s2:</span> N/A</div>
          <div><span class="font-medium">Risk Level:</span> Unknown</div>
        </div>`;
    }
    
    content += `</div>`;
    return content;
  };

  // Function to handle events for each GeoJSON feature
  const onEachFeature = (feature: any, layer: L.Layer) => {
    if (feature.properties) {
      const nama = feature.properties.NAMOBJ || feature.properties.WADMKK || feature.properties.NAME_2 || "(Tanpa Nama)";
      const tooltipContent = generateTooltipContent(feature.properties);
      
      layer.on({
        mouseover: function (e: any) {
          const layer = e.target;
          layer.setStyle({
            weight: 2,
            color: '#000',
            fillOpacity: 0.8
          });
          layer.bindTooltip(tooltipContent, {
            sticky: true, 
            direction: 'top',
            className: 'custom-tooltip'
          }).openTooltip();
        },
        mouseout: function (e: any) {
          const layer = e.target;
          if (selectedRegion !== nama) {
            geoJsonRef.current?.resetStyle(e.target);
          }
          layer.closeTooltip();
        },
        click: function (e: any) {
          setSelectedRegion(nama);
          if (onRegionSelect) {
            onRegionSelect(nama);
          }
          mapRef.current?.fitBounds(e.target.getBounds());
        }
      });
    }
  };

  // Effect to add legend to map
  useEffect(() => {
    if (!mapRef.current) return;
    
    // Create a custom legend
    const legendContainer = L.DomUtil.create('div', 'leaflet-legend bg-white p-2 rounded shadow-md');
    legendContainer.style.position = 'absolute';
    legendContainer.style.zIndex = '1000';
    legendContainer.style.right = '10px';
    legendContainer.style.bottom = '24px';
    legendContainer.style.padding = '8px';
    legendContainer.style.backgroundColor = 'white';
    legendContainer.style.borderRadius = '4px';
    legendContainer.style.boxShadow = '0 1px 3px rgba(0,0,0,0.2)';
    
    legendContainer.innerHTML = `
      <div style="font-size: 0.875rem; font-weight: bold; margin-bottom: 4px;">Risk Level</div>
      <div style="display: flex; align-items: center; margin-bottom: 4px;">
        <div style="background-color: #ef4444; width: 15px; height: 15px; margin-right: 5px;"></div>
        <span style="font-size: 0.75rem;">High</span>
      </div>
      <div style="display: flex; align-items: center; margin-bottom: 4px;">
        <div style="background-color: #f97316; width: 15px; height: 15px; margin-right: 5px;"></div>
        <span style="font-size: 0.75rem;">Medium-high</span>
      </div>
      <div style="display: flex; align-items: center; margin-bottom: 4px;">
        <div style="background-color: #fbbf24; width: 15px; height: 15px; margin-right: 5px;"></div>
        <span style="font-size: 0.75rem;">Medium</span>
      </div>
      <div style="display: flex; align-items: center; margin-bottom: 4px;">
        <div style="background-color: #22c55e; width: 15px; height: 15px; margin-right: 5px;"></div>
        <span style="font-size: 0.75rem;">Low</span>
      </div>
      <div style="display: flex; align-items: center;">
        <div style="background-color: #60a5fa; width: 15px; height: 15px; margin-right: 5px;"></div>
        <span style="font-size: 0.75rem;">Unknown</span>
      </div>
    `;
    
    // Get the map container and append the legend
    const mapContainer = mapRef.current.getContainer();
    mapContainer.appendChild(legendContainer);
    
    // Apply bounds restrictions to prevent scrolling/zooming outside Indonesia
    if (mapRef.current) {
      mapRef.current.setMaxBounds(indonesiaBounds);
      mapRef.current.setMinZoom(5); // Prevent zooming out too far
      mapRef.current.setMaxZoom(12); // Prevent zooming in too much
      
      // Set initial view to Java
      mapRef.current.fitBounds(javaBounds);
    }
    
    // Clean up function to remove the legend when component unmounts
    return () => {
      if (mapContainer && legendContainer) {
        try {
          mapContainer.removeChild(legendContainer);
        } catch (e) {
          console.error('Error removing legend:', e);
        }
      }
    };
  }, [mapRef.current]);

  return (
    <MapContainer
      bounds={javaBounds}
      style={{ height: "100%", width: "100%" }}
      className="rounded-lg z-0"
      zoomControl={false}
      maxBounds={indonesiaBounds}
      maxBoundsViscosity={1.0} // This makes the bounds "hard" - preventing movement outside
      minZoom={5}
      maxZoom={12}
      ref={(map) => {
        if (map) mapRef.current = map;
      }}
    >
      <ZoomControl position="topleft" />
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="OpenStreetMap">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            noWrap={true} // Prevents the map from repeating horizontally
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Satelit">
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; <a href="https://www.esri.com">Esri</a>'
            noWrap={true} // Prevents the map from repeating horizontally
          />
        </LayersControl.BaseLayer>
      </LayersControl>
      <GeoJSON 
        data={data} 
        style={(feature) => ({
          fillColor: feature?.properties ? getRegionColor(feature.properties) : '#60a5fa',
          color: '#666',
          weight: 1,
          fillOpacity: 0.7,
        })}
        onEachFeature={onEachFeature}
        ref={(layer) => {
          if (layer) geoJsonRef.current = layer;
        }}
      />
    </MapContainer>
  );
};

export default Map; 