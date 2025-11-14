import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const TRANSLATIONS = {
  es: {
    filterBy: "Filtrar por",
    allTypes: "Todos los tipos",
    allFocus: "Todos los enfoques",
    allContinents: "Todas las regiones",
    allCountries: "Todos los países",
    type: "Tipo de organización",
    focus: "Enfoque principal",
    continent: "Región",
    country: "País",
    types: {
      cooperativa: "Cooperativa",
      corporacion: "Corporación",
      fundacion: "Fundación",
      instituto: "Instituto",
      movimiento_social: "Movimiento Social",
      organizacion_comunitaria: "Organización Comunitaria",
      organizacion_gubernamental: "Organización Gubernamental",
      ong: "ONG",
      alianza: "Alianza",
      sindicato: "Sindicato",
      asociacion: "Asociación"
    },
    focuses: {
      justicia_climatica: "Justicia Climática",
      participacion_ciudadana: "Participación Ciudadana",
      derechos_discapacidad: "Derechos de Personas con Discapacidad",
      derechos_laborales: "Derechos Laborales",
      justicia_genero: "Justicia de Género",
      lgtbiq: "LGTBIQ+",
      transicion_energetica: "Transición Energética",
      justicia_racial: "Justicia Racial",
      comunidades_indigenas: "Comunidades Indígenas",
      gobernanza_global: "Gobernanza Global",
      democracia: "Democracia",
      justicia_economica: "Justicia Económica",
      conservacion_recursos: "Conservación de Recursos Naturales",
      soberania_alimentaria: "Soberanía Alimentaria",
      derechos_digitales: "Derechos Digitales",
      economia_circular: "Economía Circular",
      salud_global: "Salud Global",
      derechos_migrantes: "Derechos de Migrantes y Refugiados",
      educacion_calidad: "Educación de Calidad",
      paz_resolucion_conflictos: "Paz y Resolución de Conflictos",
      derechos_infancias: "Derechos de las Infancias",
      innovacion_social: "Innovación Social",
      ciudades_sustentables: "Ciudades Sustentables",
      juventud: "Juventud",
      proteccion_ninez: "Protección de la Niñez",
      movimientos_ciudadanos: "Movimientos Ciudadanos",
      fortalecimiento_capacidades: "Fortalecimiento de Capacidades"
    },
    continents: {
      america_latina: "América Latina",
      caribe: "Caribe"
    }
  },
  en: {
    filterBy: "Filter by",
    allTypes: "All types",
    allFocus: "All focuses",
    allContinents: "All regions",
    allCountries: "All countries",
    type: "Organization type",
    focus: "Main focus",
    continent: "Region",
    country: "Country",
    types: {
      cooperativa: "Cooperative",
      corporacion: "Corporation",
      fundacion: "Foundation",
      instituto: "Institute",
      movimiento_social: "Social Movement",
      organizacion_comunitaria: "Community Organization",
      organizacion_gubernamental: "Government Organization",
      ong: "NGO",
      alianza: "Alliance",
      sindicato: "Union",
      asociacion: "Association"
    },
    focuses: {
      justicia_climatica: "Climate Justice",
      participacion_ciudadana: "Citizen Participation",
      derechos_discapacidad: "Disability Rights",
      derechos_laborales: "Labor Rights",
      justicia_genero: "Gender Justice",
      lgtbiq: "LGBTIQ+",
      transicion_energetica: "Energy Transition",
      justicia_racial: "Racial Justice",
      comunidades_indigenas: "Indigenous Communities",
      gobernanza_global: "Global Governance",
      democracia: "Democracy",
      justicia_economica: "Economic Justice",
      conservacion_recursos: "Natural Resource Conservation",
      soberania_alimentaria: "Food Sovereignty",
      derechos_digitales: "Digital Rights",
      economia_circular: "Circular Economy",
      salud_global: "Global Health",
      derechos_migrantes: "Migrant and Refugee Rights",
      educacion_calidad: "Quality Education",
      paz_resolucion_conflictos: "Peace and Conflict Resolution",
      derechos_infancias: "Children's Rights",
      innovacion_social: "Social Innovation",
      ciudades_sustentables: "Sustainable Cities",
      juventud: "Youth",
      proteccion_ninez: "Child Protection",
      movimientos_ciudadanos: "Citizen Movements",
      fortalecimiento_capacidades: "Capacity Building"
    },
    continents: {
      america_latina: "Latin America",
      caribe: "Caribbean"
    }
  }
};

export default function FilterPanel({ filters, setFilters, organizations, language }) {
  const t = TRANSLATIONS[language];

  const uniqueCountries = [...new Set(organizations.map(org => org.country))].sort();

  return (
    <div 
      className="bg-[#e0e0e0] rounded-3xl p-6 space-y-6"
      style={{
        boxShadow: '12px 12px 24px #bebebe, -12px -12px 24px #ffffff'
      }}
    >
      <h3 className="text-xl font-bold text-gray-800 mb-4">{t.filterBy}</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t.type}
        </label>
        <div 
          className="bg-[#e0e0e0] rounded-2xl"
          style={{
            boxShadow: 'inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff'
          }}
        >
          <Select
            value={filters.type}
            onValueChange={(value) => setFilters({ ...filters, type: value })}
          >
            <SelectTrigger className="border-none bg-transparent focus:ring-0 focus:ring-offset-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allTypes}</SelectItem>
              {Object.entries(t.types).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t.focus}
        </label>
        <div 
          className="bg-[#e0e0e0] rounded-2xl"
          style={{
            boxShadow: 'inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff'
          }}
        >
          <Select
            value={filters.focus}
            onValueChange={(value) => setFilters({ ...filters, focus: value })}
          >
            <SelectTrigger className="border-none bg-transparent focus:ring-0 focus:ring-offset-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              <SelectItem value="all">{t.allFocus}</SelectItem>
              {Object.entries(t.focuses).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t.continent}
        </label>
        <div 
          className="bg-[#e0e0e0] rounded-2xl"
          style={{
            boxShadow: 'inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff'
          }}
        >
          <Select
            value={filters.continent}
            onValueChange={(value) => setFilters({ ...filters, continent: value })}
          >
            <SelectTrigger className="border-none bg-transparent focus:ring-0 focus:ring-offset-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allContinents}</SelectItem>
              {Object.entries(t.continents).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t.country}
        </label>
        <div 
          className="bg-[#e0e0e0] rounded-2xl"
          style={{
            boxShadow: 'inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff'
          }}
        >
          <Select
            value={filters.country}
            onValueChange={(value) => setFilters({ ...filters, country: value })}
          >
            <SelectTrigger className="border-none bg-transparent focus:ring-0 focus:ring-offset-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              <SelectItem value="all">{t.allCountries}</SelectItem>
              {uniqueCountries.map(country => (
                <SelectItem key={country} value={country}>{country}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {(filters.type !== "all" || filters.focus !== "all" || filters.continent !== "all" || filters.country !== "all") && (
        <button
          onClick={() => setFilters({ type: "all", focus: "all", continent: "all", country: "all" })}
          className="w-full bg-[#00FF41] text-gray-900 rounded-2xl py-3 font-medium transition-all hover:opacity-90"
          style={{
            boxShadow: '4px 4px 8px #bebebe, -4px -4px 8px #ffffff'
          }}
        >
          {language === 'es' ? 'Limpiar filtros' : 'Clear filters'}
        </button>
      )}
    </div>
  );
}