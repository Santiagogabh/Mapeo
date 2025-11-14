import React, { useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import { Loader2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

const COUNTRY_COORDS = {
  'Argentina': [-34.6037, -58.3816],
  'Bolivia': [-16.5000, -68.1500],
  'Brasil': [-15.7801, -47.9292],
  'Chile': [-33.4489, -70.6693],
  'Colombia': [4.7110, -74.0721],
  'Costa Rica': [9.9281, -84.0907],
  'Cuba': [23.1136, -82.3666],
  'Ecuador': [-0.1807, -78.4678],
  'El Salvador': [13.6929, -89.2182],
  'Guatemala': [14.6349, -90.5069],
  'Haití': [18.5944, -72.3074],
  'Honduras': [14.0723, -87.1921],
  'Jamaica': [18.0179, -76.8099],
  'México': [19.4326, -99.1332],
  'Nicaragua': [12.1364, -86.2514],
  'Panamá': [8.9824, -79.5199],
  'Paraguay': [-25.2637, -57.5759],
  'Perú': [-12.0464, -77.0428],
  'República Dominicana': [18.4861, -69.9312],
  'Uruguay': [-34.9011, -56.1645],
  'Venezuela': [10.4806, -66.9036],
  'Barbados': [13.0969, -59.6145],
  'Trinidad y Tobago': [10.6918, -61.2225],
  'Guyana': [6.8013, -58.1551],
  'Surinam': [5.8520, -55.2038],
  'Belice': [17.2510, -88.7590],
  'Puerto Rico': [18.4655, -66.1057],
  'Bahamas': [25.0343, -77.3963]
};

function MapUpdater({ organizations }) {
  const map = useMap();
  
  React.useEffect(() => {
    if (organizations.length > 0) {
      const coords = organizations
        .map(org => COUNTRY_COORDS[org.country])
        .filter(Boolean);
      
      if (coords.length > 0) {
        const bounds = coords.map(coord => [coord[0], coord[1]]);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 5 });
      }
    }
  }, [organizations, map]);
  
  return null;
}

export default function MapView({ organizations, onCountryClick, language, isLoading }) {
  const countryData = useMemo(() => {
    const data = {};
    organizations.forEach(org => {
      if (!data[org.country]) {
        data[org.country] = {
          count: 0,
          continent: org.continent,
          coords: COUNTRY_COORDS[org.country]
        };
      }
      data[org.country].count++;
    });
    return data;
  }, [organizations]);

  const translations = {
    es: {
      organizations: "organizaciones",
      clickToSee: "Clic para ver detalles",
      loading: "Cargando mapa..."
    },
    en: {
      organizations: "organizations",
      clickToSee: "Click to see details",
      loading: "Loading map..."
    }
  };

  const t = translations[language];

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#00FF41] mx-auto mb-4" />
          <p className="text-gray-600">{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <MapContainer
      center={[-8.7832, -55.4915]}
      zoom={4}
      style={{ width: '100%', height: '100%' }}
      className="z-0"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      
      <MapUpdater organizations={organizations} />

      {Object.entries(countryData).map(([country, data]) => {
        if (!data.coords) return null;
        
        const [lat, lng] = data.coords;
        
        return (
          <CircleMarker
            key={country}
            center={[lat, lng]}
            radius={Math.min(8 + data.count * 2, 30)}
            pathOptions={{
              fillColor: '#00FF41',
              fillOpacity: 0.7,
              color: '#00FF41',
              weight: 3,
              opacity: 1
            }}
            eventHandlers={{
              click: () => onCountryClick(country)
            }}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={1}>
              <div 
                className="bg-[#e0e0e0] rounded-lg p-3 border-2 border-[#00FF41]"
                style={{
                  boxShadow: '4px 4px 8px #bebebe, -4px -4px 8px #ffffff'
                }}
              >
                <div className="font-bold text-gray-800 mb-1">{country}</div>
                <div className="text-sm text-gray-600">
                  {data.count} {t.organizations}
                </div>
                <div className="text-xs text-[#00FF41] mt-1 font-medium">
                  {t.clickToSee}
                </div>
              </div>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}