import React from "react";

export default function MapLegend({ language }) {
  const translations = {
    es: {
      legend: "Leyenda",
      singleLocation: "Ubicación única",
      clusterLocation: "Ubicaciones agrupadas",
      size: "El tamaño indica cantidad de organizaciones",
      interaction: "Click para acercar o ver detalles"
    },
    en: {
      legend: "Legend",
      singleLocation: "Single location",
      clusterLocation: "Clustered locations",
      size: "Size indicates number of organizations",
      interaction: "Click to zoom in or view details"
    }
  };

  const t = translations[language];

  return (
    <div className="card mt-6">
      <h3 className="font-bold text-verde mb-4 text-lg">{t.legend}</h3>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-6 h-6 rounded-full flex-shrink-0"
            style={{ 
              backgroundColor: "#1A685B",
              border: "4px solid #FFFFFF",
              boxShadow: "0 0 0 2px #1A685B"
            }}
          />
          <span className="text-sm text-negro">{t.singleLocation}</span>
        </div>
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded-full flex-shrink-0"
            style={{ 
              backgroundColor: "#E7C011",
              border: "4px solid #FFFFFF",
              boxShadow: "0 0 0 2px #1A685B"
            }}
          />
          <span className="text-sm text-negro">{t.clusterLocation}</span>
        </div>
        <p className="text-xs text-gris italic pt-2 border-t border-gris">{t.size}</p>
        <p className="text-xs text-gris italic">{t.interaction}</p>
      </div>
    </div>
  );
}