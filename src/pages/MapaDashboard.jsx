import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { Filter, X, Globe, Building2, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "leaflet/dist/leaflet.css";

import FilterPanel from "../components/map/FilterPanel";
import OrganizationModal from "../components/map/OrganizationModal";
import MapLegend from "../components/map/MapLegend";
import RegionSelector from "../components/map/RegionSelector";
import ClusteredMarkers from "../components/map/ClusteredMarkers";

// Custom hook to update map view with smooth animation
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, {
      duration: 1.5,
      easeLinearity: 0.25
    });
  }, [center, zoom, map]);
  return null;
}

export default function MapaDashboard({ language = "es" }) {
  const [filters, setFilters] = useState({
    type: "all",
    focus: "all",
    continent: "all",
    country: "all"
  });
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [showFilters, setShowFilters] = useState(true);
  const [showRegionSelector, setShowRegionSelector] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [mapCenter, setMapCenter] = useState([-15, -60]);
  const [mapZoom, setMapZoom] = useState(4);

  const { data: organizations = [], isLoading } = useQuery({
    queryKey: ['organizations'],
    queryFn: () => base44.entities.Organization.list(),
    initialData: [],
  });

  const translations = {
    es: {
      filters: "Filtros",
      hideFilters: "Ocultar Filtros",
      showFilters: "Mostrar Filtros",
      regions: "Regiones",
      hideRegions: "Ocultar Regiones",
      showRegions: "Mostrar Regiones",
      organizations: "organizaciones",
      loading: "Cargando mapa...",
      filteredBy: "Filtrado por"
    },
    en: {
      filters: "Filters",
      hideFilters: "Hide Filters",
      showFilters: "Show Filters",
      regions: "Regions",
      hideRegions: "Hide Regions",
      showRegions: "Show Regions",
      organizations: "organizations",
      loading: "Loading map...",
      filteredBy: "Filtered by"
    }
  };

  const t = translations[language];

  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
    setMapCenter(region.coordinates);
    setMapZoom(region.type === 'continent' ? 5 : 6);
    
    if (region.type === 'continent') {
      setFilters({ ...filters, continent: region.id, country: "all" });
    } else if (region.type === 'country') {
      setFilters({ ...filters, country: region.id });
    }
  };

  const handleClearRegion = () => {
    setSelectedRegion(null);
    setMapCenter([-15, -60]);
    setMapZoom(4);
    setFilters({ ...filters, continent: "all", country: "all" });
  };

  const filteredOrgs = organizations.filter(org => {
    if (filters.type !== "all" && org.type !== filters.type) return false;
    if (filters.focus !== "all" && org.focus !== filters.focus) return false;
    if (filters.continent !== "all" && org.continent !== filters.continent) return false;
    if (filters.country !== "all" && org.country !== filters.country) return false;
    return true;
  });

  const orgsByCountry = filteredOrgs.reduce((acc, org) => {
    if (!org.latitude || !org.longitude) return acc;
    const key = `${org.country}-${org.latitude}-${org.longitude}`;
    if (!acc[key]) {
      acc[key] = {
        country: org.country,
        latitude: org.latitude,
        longitude: org.longitude,
        count: 0,
        organizations: []
      };
    }
    acc[key].count++;
    acc[key].organizations.push(org);
    return acc;
  }, {});

  const markers = Object.values(orgsByCountry);

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-medium">
        <div className="flex flex-wrap items-center gap-small">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary flex items-center gap-2"
          >
            <Filter className="w-5 h-5" />
            {showFilters ? t.hideFilters : t.showFilters}
          </button>

          <button
            onClick={() => setShowRegionSelector(!showRegionSelector)}
            className="btn-secondary flex items-center gap-2"
          >
            <Layers className="w-5 h-5" />
            {showRegionSelector ? t.hideRegions : t.showRegions}
          </button>

          {selectedRegion && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border-2 border-gris px-4 py-3 rounded-xl flex items-center gap-2"
            >
              <span className="text-sm font-semibold text-gris">{t.filteredBy}:</span>
              <span className="text-sm font-bold text-verde">{selectedRegion.name}</span>
              <button
                onClick={handleClearRegion}
                className="ml-2 hover:bg-gray-100 rounded-full p-1 transition-colors"
              >
                <X className="w-4 h-4 text-amarillo" />
              </button>
            </motion.div>
          )}
        </div>

        <div className="bg-white border-2 border-gris px-6 py-3 rounded-xl flex items-center gap-2">
          <Building2 className="w-5 h-5 text-amarillo" />
          <span className="font-semibold text-verde">
            {filteredOrgs.length} {t.organizations}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-large">
        {/* Filters Sidebar */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="lg:col-span-1"
            >
              <FilterPanel
                filters={filters}
                setFilters={setFilters}
                organizations={organizations}
                language={language}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Map */}
        <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
          <div className="grid lg:grid-cols-4 gap-large">
            {/* Region Selector */}
            <AnimatePresence>
              {showRegionSelector && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="lg:col-span-1"
                >
                  <RegionSelector
                    selectedRegion={selectedRegion}
                    onRegionSelect={handleRegionSelect}
                    onClearRegion={handleClearRegion}
                    language={language}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Map Container */}
            <div className={showRegionSelector ? "lg:col-span-3" : "lg:col-span-4"}>
              <motion.div
                layout
                transition={{ duration: 0.3 }}
                className="bg-white border-2 border-gris rounded-3xl p-4"
                style={{ height: "700px" }}
              >
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <Globe className="w-12 h-12 text-verde mx-auto mb-4 animate-spin" />
                      <p className="text-gris">{t.loading}</p>
                    </div>
                  </div>
                ) : (
                  <MapContainer
                    center={mapCenter}
                    zoom={mapZoom}
                    style={{ height: "100%", width: "100%", borderRadius: "20px" }}
                    className="z-0"
                  >
                    <ChangeView center={mapCenter} zoom={mapZoom} />
                    <TileLayer
                      url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    
                    <ClusteredMarkers
                      markers={markers}
                      onOrganizationsClick={setSelectedOrganization}
                      language={language}
                    />
                  </MapContainer>
                )}
              </motion.div>

              {/* Legend */}
              <MapLegend language={language} />
            </div>
          </div>
        </div>
      </div>

      {/* Organization Modal */}
      {selectedOrganization && (
        <OrganizationModal
          organizations={Array.isArray(selectedOrganization) ? selectedOrganization : [selectedOrganization]}
          onClose={() => setSelectedOrganization(null)}
          language={language}
        />
      )}
    </div>
  );
}