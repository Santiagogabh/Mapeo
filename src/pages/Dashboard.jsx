import React, { useState, useMemo, useEffect } from "react";
import { Filter, X } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import MapView from "@/components/map/MapView";
import FilterPanel from "../components/map/FilterPanel";
import OrganizationModal from "@/components/map/OrganizationModal";
import organizationsData from "@/data/organizations.json";
import "@/dashboard.css";


export default function Dashboard() {
  const [language, setLanguage] = useState("es");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: "all",
    focus: "all",
    continent: "all",
    country: "all"
  });

  const { data: organizations = [], isLoading } = useQuery({
    queryKey: ['organizations'],
    queryFn: () => organizationsData(),
    initialData: [],
  });

  const filteredOrganizations = useMemo(() => {
    return organizations.filter(org => {
      if (filters.type !== "all" && org.type !== filters.type) return false;
      if (filters.focus !== "all" && org.focus !== filters.focus) return false;
      if (filters.continent !== "all" && org.continent !== filters.continent) return false;
      if (filters.country !== "all" && org.country !== filters.country) return false;
      return true;
    });
  }, [organizations, filters]);

  const translations = {
    es: {
      title: "Mapa de Organizaciones",
      subtitle: "América Latina y el Caribe",
      filters: "Filtros",
      language: "Idioma",
      totalOrgs: "organizaciones"
    },
    en: {
      title: "Organizations Map",
      subtitle: "Latin America and the Caribbean",
      filters: "Filters",
      language: "Language",
      totalOrgs: "organizations"
    }
  };

  const t = translations[language];

  return (
    <div className="min-h-screen bg-[#e0e0e0] p-4 md:p-8">
      {/* Neumorphic Header */}
      <div className="max-w-[1600px] mx-auto mb-6">
        <div 
          className="bg-[#e0e0e0] rounded-3xl p-6 md:p-8"
          style={{
            boxShadow: '12px 12px 24px #bebebe, -12px -12px 24px #ffffff'
          }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                {t.title}
              </h1>
              <p className="text-lg text-gray-600">{t.subtitle}</p>
              <div className="mt-3 flex items-center gap-2">
                <div 
                  className="bg-[#e0e0e0] rounded-full px-4 py-2"
                  style={{
                    boxShadow: 'inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff'
                  }}
                >
                  <span className="text-sm font-semibold text-[#00FF41]">
                    {filteredOrganizations.length} {t.totalOrgs}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              {/* Language Toggle */}
              <div 
                className="bg-[#e0e0e0] rounded-2xl p-1 flex gap-1"
                style={{
                  boxShadow: 'inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff'
                }}
              >
                <button
                  onClick={() => setLanguage("es")}
                  className={`px-4 py-2 rounded-xl transition-all font-medium ${
                    language === "es"
                      ? "bg-[#00FF41] text-gray-900 shadow-lg"
                      : "text-gray-600"
                  }`}
                  style={language === "es" ? {
                    boxShadow: '4px 4px 8px #bebebe, -4px -4px 8px #ffffff'
                  } : {}}
                >
                  ES
                </button>
                <button
                  onClick={() => setLanguage("en")}
                  className={`px-4 py-2 rounded-xl transition-all font-medium ${
                    language === "en"
                      ? "bg-[#00FF41] text-gray-900 shadow-lg"
                      : "text-gray-600"
                  }`}
                  style={language === "en" ? {
                    boxShadow: '4px 4px 8px #bebebe, -4px -4px 8px #ffffff'
                  } : {}}
                >
                  EN
                </button>
              </div>

              {/* Filters Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-[#e0e0e0] rounded-2xl px-6 py-3 flex items-center gap-2 text-gray-800 font-medium transition-all hover:text-[#00FF41]"
                style={{
                  boxShadow: showFilters 
                    ? 'inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff'
                    : '6px 6px 12px #bebebe, -6px -6px 12px #ffffff'
                }}
              >
                {showFilters ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
                <span className="hidden md:inline">{t.filters}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Panel */}
          {showFilters && (
            <div className="lg:col-span-1">
              <FilterPanel 
                filters={filters}
                setFilters={setFilters}
                organizations={organizations}
                language={language}
              />
            </div>
          )}

          {/* Map */}
          <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
            <div 
              className="bg-[#e0e0e0] rounded-3xl overflow-hidden"
              style={{
                boxShadow: '12px 12px 24px #bebebe, -12px -12px 24px #ffffff',
                height: 'calc(100vh - 280px)',
                minHeight: '500px'
              }}
            >
              <MapView
                organizations={filteredOrganizations}
                onCountryClick={setSelectedCountry}
                language={language}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Organization Modal */}
      {selectedCountry && (
        <OrganizationModal
          country={selectedCountry}
          organizations={filteredOrganizations.filter(
            org => org.country === selectedCountry
          )}
          onClose={() => setSelectedCountry(null)}
          language={language}
        />
      )}
    </div>
  );
}