/* The above code is defining a JavaScript object named `TRANSLATIONS` which contains translations for
various text elements in both English and Spanish. These translations are related to organizations,
types of organizations, focus areas, and other related terms. The translations are structured in a
way that allows for easy access to the translated text based on the selected language. This object
can be used to dynamically display text in different languages within a React application. */
import React from 'react';
import { X, ExternalLink, Mail, Phone, Globe, Building2, Target } from 'lucide-react';

const TRANSLATIONS = {
  es: {
    organizationsIn: "Organizaciones en",
    close: "Cerrar",
    website: "Sitio web",
    email: "Email",
    phone: "Teléfono",
    type: "Tipo",
    focus: "Enfoque",
    contact: "Contacto",
    description: "Descripción",
    noOrgs: "No hay organizaciones en este país",
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
    }
  },
  en: {
    organizationsIn: "Organizations in",
    close: "Close",
    website: "Website",
    email: "Email",
    phone: "Phone",
    type: "Type",
    focus: "Focus",
    contact: "Contact",
    description: "Description",
    noOrgs: "No organizations in this country",
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
    }
  }
};

/* The above code is a React component named `OrganizationModal` that renders a modal window displaying
information about organizations based on the provided props. Here is a summary of what the code is
doing: */
export default function OrganizationModal({ country, organizations, onClose, language }) {
  const t = TRANSLATIONS[language];

  return (
    <>
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-4 md:inset-auto md:right-4 md:top-4 md:bottom-4 md:w-[600px] z-50 flex items-center justify-center md:items-start md:justify-end">
        <div 
          className="bg-[#e0e0e0] rounded-3xl w-full h-full md:h-full overflow-hidden flex flex-col"
          style={{
            boxShadow: '20px 20px 40px #bebebe, -20px -20px 40px #ffffff'
          }}
        >
          <div 
            className="bg-[#e0e0e0] p-6 border-b-2 border-[#00FF41]"
            style={{
              boxShadow: '4px 4px 8px #bebebe, -4px -4px 8px #ffffff'
            }}
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-1">
                  {t.organizationsIn} {country}
                </h2>
                <p className="text-sm text-gray-600">
                  {organizations.length} {language === 'es' ? 'organizaciones encontradas' : 'organizations found'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="bg-[#e0e0e0] rounded-xl p-2 text-gray-600 hover:text-[#00FF41] transition-all"
                style={{
                  boxShadow: '4px 4px 8px #bebebe, -4px -4px 8px #ffffff'
                }}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {organizations.length === 0 ? (
              <div className="text-center text-gray-600 py-12">
                <Globe className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p>{t.noOrgs}</p>
              </div>
            ) : (
              organizations.map((org, index) => (
                <div
                  key={index}
                  className="bg-[#e0e0e0] rounded-2xl p-5"
                  style={{
                    boxShadow: '8px 8px 16px #bebebe, -8px -8px 16px #ffffff'
                  }}
                >
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {org.name}
                  </h3>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {language === 'es' ? org.description_es : org.description_en}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <div 
                      className="bg-[#e0e0e0] rounded-lg px-3 py-1.5 flex items-center gap-2"
                      style={{
                        boxShadow: 'inset 2px 2px 4px #bebebe, inset -2px -2px 4px #ffffff'
                      }}
                    >
                      <Building2 className="w-3 h-3 text-[#00FF41]" />
                      <span className="text-xs font-medium text-gray-700">
                        {t.types[org.type]}
                      </span>
                    </div>
                    <div 
                      className="bg-[#e0e0e0] rounded-lg px-3 py-1.5 flex items-center gap-2"
                      style={{
                        boxShadow: 'inset 2px 2px 4px #bebebe, inset -2px -2px 4px #ffffff'
                      }}
                    >
                      <Target className="w-3 h-3 text-[#00FF41]" />
                      <span className="text-xs font-medium text-gray-700">
                        {t.focuses[org.focus]}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {org.website && (
                      <a
                        href={org.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#00FF41] transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span className="truncate">{org.website}</span>
                      </a>
                    )}
                    {org.email && (
                      <a
                        href={`mailto:${org.email}`}
                        className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#00FF41] transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{org.email}</span>
                      </a>
                    )}
                    {org.phone && (
                      <a
                        href={`tel:${org.phone}`}
                        className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#00FF41] transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        <span>{org.phone}</span>
                      </a>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div 
            className="bg-[#e0e0e0] p-4 border-t-2 border-gray-300"
            style={{
              boxShadow: '0 -4px 8px rgba(0, 0, 0, 0.05)'
            }}
          >
            <button
              onClick={onClose}
              className="w-full bg-[#00FF41] text-gray-900 rounded-2xl py-3 font-medium transition-all hover:opacity-90"
              style={{
                boxShadow: '4px 4px 8px #bebebe, -4px -4px 8px #ffffff'
              }}
            >
              {t.close}
            </button>
          </div>
        </div>
      </div>
    </>
  );
} 