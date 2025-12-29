import React from "react";
import { motion } from "framer-motion";
import { Globe, MapPin, X } from "lucide-react";

export default function RegionSelector({ selectedRegion, onRegionSelect, onClearRegion, language }) {
  const translations = {
    es: {
      selectRegion: "Seleccionar Región",
      clearFilter: "Limpiar Filtro",
      continents: "Continentes",
      countries: "Países Principales",
      currentSelection: "Selección actual",
      continentsList: {
        south_america: "América del Sur",
        central_america: "América Central",
        caribbean: "Caribe"
      },
      countriesList: {
        argentina: "Argentina",
        brasil: "Brasil",
        chile: "Chile",
        colombia: "Colombia",
        ecuador: "Ecuador",
        peru: "Perú",
        mexico: "México",
        costa_rica: "Costa Rica",
        guatemala: "Guatemala",
        republica_dominicana: "República Dominicana"
      }
    },
    en: {
      selectRegion: "Select Region",
      clearFilter: "Clear Filter",
      continents: "Continents",
      countries: "Main Countries",
      currentSelection: "Current selection",
      continentsList: {
        south_america: "South America",
        central_america: "Central America",
        caribbean: "Caribbean"
      },
      countriesList: {
        argentina: "Argentina",
        brasil: "Brazil",
        chile: "Chile",
        colombia: "Colombia",
        ecuador: "Ecuador",
        peru: "Peru",
        mexico: "Mexico",
        costa_rica: "Costa Rica",
        guatemala: "Guatemala",
        republica_dominicana: "Dominican Republic"
      }
    }
  };

  const t = translations[language];

  const continents = [
    { id: "south_america", name: t.continentsList.south_america, coordinates: [-15, -60] },
    { id: "central_america", name: t.continentsList.central_america, coordinates: [14, -90] },
    { id: "caribbean", name: t.continentsList.caribbean, coordinates: [18, -70] }
  ];

  const countries = [
    { id: "Brasil", name: t.countriesList.brasil, coordinates: [-15.7975, -47.8919] },
    { id: "Argentina", name: t.countriesList.argentina, coordinates: [-34.6037, -58.3816] },
    { id: "Chile", name: t.countriesList.chile, coordinates: [-33.4489, -70.6693] },
    { id: "Colombia", name: t.countriesList.colombia, coordinates: [4.711, -74.0721] },
    { id: "México", name: t.countriesList.mexico, coordinates: [19.4326, -99.1332] },
    { id: "Perú", name: t.countriesList.peru, coordinates: [-12.0464, -77.0428] }
  ];

  return (
    <div className="card space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Globe className="w-6 h-6 text-verde" />
          <h2 className="text-2xl font-bold text-verde">{t.selectRegion}</h2>
        </div>
        {selectedRegion && (
          <button
            onClick={onClearRegion}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-amarillo" />
          </button>
        )}
      </div>

      {selectedRegion && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 border-2 border-gris p-4 rounded-xl"
        >
          <p className="text-sm font-semibold text-gris mb-1">{t.currentSelection}</p>
          <p className="text-negro font-medium">{selectedRegion.name}</p>
        </motion.div>
      )}

      <div>
        <h3 className="text-[15px] font-semibold text-verde mb-3">{t.continents}</h3>
        <div className="grid grid-cols-1 gap-2">
          {continents.map((continent) => (
            <button
              key={continent.id}
              onClick={() => onRegionSelect({ 
                type: 'continent', 
                id: continent.id, 
                name: continent.name,
                coordinates: continent.coordinates 
              })}
              className={`bg-white border-2 p-3 rounded-xl text-left hover:bg-gray-50 transition-all ${
                selectedRegion?.id === continent.id ? 'border-verde bg-gray-50' : 'border-gris'
              }`}
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amarillo" />
                <span className="text-sm font-medium text-negro">{continent.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-[15px] font-semibold text-verde mb-3">{t.countries}</h3>
        <div className="grid grid-cols-1 gap-2">
          {countries.map((country) => (
            <button
              key={country.id}
              onClick={() => onRegionSelect({ 
                type: 'country', 
                id: country.id, 
                name: country.name,
                coordinates: country.coordinates 
              })}
              className={`bg-white border-2 p-3 rounded-xl text-left hover:bg-gray-50 transition-all ${
                selectedRegion?.id === country.id ? 'border-verde bg-gray-50' : 'border-gris'
              }`}
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amarillo" />
                <span className="text-sm font-medium text-negro">{country.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}