import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Globe, Mail, Phone, Building2, Target, MapPin, Loader2, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function OrganizationDetails({ language = "es" }) {
  const navigate = useNavigate();
  const [organizationId, setOrganizationId] = useState(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    setOrganizationId(id);
  }, []);

  const { data: organizations = [], isLoading } = useQuery({
    queryKey: ['organizations'],
    queryFn: () => base44.entities.Organization.list(),
    initialData: [],
  });

  const organization = organizations.find(org => org.id === organizationId);

  const translations = {
    es: {
      back: "Volver al Mapa",
      details: "Detalles de la Organización",
      description: "Descripción",
      type: "Tipo de Organización",
      focus: "Enfoque Principal",
      location: "Ubicación",
      contact: "Información de Contacto",
      website: "Sitio Web",
      visitWebsite: "Visitar Sitio Web",
      email: "Correo Electrónico",
      phone: "Teléfono",
      continent: "Continente",
      country: "País",
      notFound: "Organización no encontrada",
      loading: "Cargando...",
      types: {
        cooperative: "Cooperativa",
        corporation: "Corporación",
        foundation: "Fundación",
        institute: "Instituto",
        social_movement: "Movimiento Social",
        community_organization: "Organización Comunitaria",
        government_organization: "Organización Gubernamental",
        ngo: "ONG",
        alliance: "Alianza",
        union: "Sindicato",
        association: "Asociación"
      },
      focusAreas: {
        climate_justice: "Justicia Climática",
        citizen_participation: "Participación Ciudadana",
        disability_rights: "Derechos de las Personas con Discapacidad",
        labor_rights: "Derechos Laborales",
        gender_justice: "Justicia de Género",
        lgbtiq: "LGTBIQ+",
        energy_transition: "Transición Energética",
        racial_justice: "Justicia Racial",
        indigenous_communities: "Comunidades Indígenas",
        global_governance: "Gobernanza Global",
        democracy: "Democracia",
        economic_justice: "Justicia Económica",
        natural_resources_conservation: "Conservación de Recursos Naturales",
        food_sovereignty: "Soberanía Alimentaria",
        digital_rights: "Derechos Digitales",
        circular_economy: "Economía Circular",
        global_health: "Salud Global",
        migrant_refugee_rights: "Derechos de Migrantes y Refugiados",
        quality_education: "Educación de Calidad",
        peace_conflict_resolution: "Paz y Resolución de Conflictos",
        children_rights: "Derechos de las Infancias",
        social_innovation: "Innovación Social",
        sustainable_cities: "Ciudades Sustentables",
        youth: "Juventud",
        child_protection: "Protección de la Niñez",
        citizen_movements: "Movimientos Ciudadanos",
        organizational_capacity_building: "Fortalecimiento de Capacidades Organizacionales"
      },
      continents: {
        south_america: "América del Sur",
        central_america: "América Central",
        caribbean: "Caribe"
      }
    },
    en: {
      back: "Back to Map",
      details: "Organization Details",
      description: "Description",
      type: "Organization Type",
      focus: "Main Focus",
      location: "Location",
      contact: "Contact Information",
      website: "Website",
      visitWebsite: "Visit Website",
      email: "Email",
      phone: "Phone",
      continent: "Continent",
      country: "Country",
      notFound: "Organization not found",
      loading: "Loading...",
      types: {
        cooperative: "Cooperative",
        corporation: "Corporation",
        foundation: "Foundation",
        institute: "Institute",
        social_movement: "Social Movement",
        community_organization: "Community Organization",
        government_organization: "Government Organization",
        ngo: "NGO",
        alliance: "Alliance",
        union: "Union",
        association: "Association"
      },
      focusAreas: {
        climate_justice: "Climate Justice",
        citizen_participation: "Citizen Participation",
        disability_rights: "Disability Rights",
        labor_rights: "Labor Rights",
        gender_justice: "Gender Justice",
        lgbtiq: "LGBTIQ+",
        energy_transition: "Energy Transition",
        racial_justice: "Racial Justice",
        indigenous_communities: "Indigenous Communities",
        global_governance: "Global Governance",
        democracy: "Democracy",
        economic_justice: "Economic Justice",
        natural_resources_conservation: "Natural Resources Conservation",
        food_sovereignty: "Food Sovereignty",
        digital_rights: "Digital Rights",
        circular_economy: "Circular Economy",
        global_health: "Global Health",
        migrant_refugee_rights: "Migrant and Refugee Rights",
        quality_education: "Quality Education",
        peace_conflict_resolution: "Peace and Conflict Resolution",
        children_rights: "Children's Rights",
        social_innovation: "Social Innovation",
        sustainable_cities: "Sustainable Cities",
        youth: "Youth",
        child_protection: "Child Protection",
        citizen_movements: "Citizen Movements",
        organizational_capacity_building: "Organizational Capacity Building"
      },
      continents: {
        south_america: "South America",
        central_america: "Central America",
        caribbean: "Caribbean"
      }
    }
  };

  const t = translations[language];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-verde mx-auto mb-4 animate-spin" />
          <p className="text-gris">{t.loading}</p>
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center card">
          <Building2 className="w-16 h-16 text-verde mx-auto mb-4 opacity-50" />
          <h2 className="text-2xl font-bold text-verde mb-4">{t.notFound}</h2>
          <button
            onClick={() => navigate(createPageUrl("MapaDashboard"))}
            className="btn-secondary flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-5 h-5" />
            {t.back}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <button
        onClick={() => navigate(createPageUrl("MapaDashboard"))}
        className="btn-secondary flex items-center gap-2"
      >
        <ArrowLeft className="w-5 h-5" />
        {t.back}
      </button>

      <div className="card">
        <div className="flex items-start gap-6">
          <div className="bg-verde rounded-2xl p-6">
            <Building2 className="w-12 h-12 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-verde mb-2">
              {organization.name}
            </h1>
            <div className="flex flex-wrap gap-3 mt-4">
              <span className="bg-white border-2 border-gris px-4 py-2 rounded-xl text-sm font-semibold text-verde">
                {t.types[organization.type] || organization.type}
              </span>
              <span className="bg-white border-2 border-gris px-4 py-2 rounded-xl text-sm font-semibold text-verde">
                {t.focusAreas[organization.focus] || organization.focus}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-large">
        <div className="lg:col-span-2 space-y-8">
          {organization.description && (
            <div className="card">
              <h2 className="text-2xl font-bold text-verde mb-4 flex items-center gap-2">
                <Target className="w-6 h-6" />
                {t.description}
              </h2>
              <p className="text-negro leading-relaxed text-lg">
                {organization.description}
              </p>
            </div>
          )}

          {organization.latitude && organization.longitude && (
            <div className="card">
              <h2 className="text-2xl font-bold text-verde mb-4 flex items-center gap-2">
                <MapPin className="w-6 h-6" />
                {t.location}
              </h2>
              <div className="bg-white border-2 border-gris rounded-2xl p-4" style={{ height: "400px" }}>
                <MapContainer
                  center={[organization.latitude, organization.longitude]}
                  zoom={6}
                  style={{ height: "100%", width: "100%", borderRadius: "16px" }}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  <Marker position={[organization.latitude, organization.longitude]}>
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-bold text-verde">
                          {organization.name}
                        </h3>
                        <p className="text-sm text-gris">{organization.country}</p>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1 space-y-8">
          <div className="card">
            <h2 className="text-2xl font-bold text-verde mb-4 flex items-center gap-2">
              <MapPin className="w-6 h-6" />
              {t.location}
            </h2>
            <div className="space-y-3">
              <div className="bg-gray-50 border-2 border-gris p-4 rounded-xl">
                <p className="text-sm font-semibold text-gris mb-1">{t.country}</p>
                <p className="text-negro font-medium">{organization.country}</p>
              </div>
              <div className="bg-gray-50 border-2 border-gris p-4 rounded-xl">
                <p className="text-sm font-semibold text-gris mb-1">{t.continent}</p>
                <p className="text-negro font-medium">
                  {t.continents[organization.continent] || organization.continent}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold text-verde mb-4 flex items-center gap-2">
              <Phone className="w-6 h-6" />
              {t.contact}
            </h2>
            <div className="space-y-3">
              {organization.website && (
                <a
                  href={organization.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full flex items-center justify-center gap-3"
                >
                  <Globe className="w-5 h-5" />
                  <span>{t.visitWebsite}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              {organization.contact && (
                <div className="bg-gray-50 border-2 border-gris p-4 rounded-xl flex items-center gap-3">
                  {organization.contact.includes("@") ? (
                    <>
                      <Mail className="w-5 h-5 text-amarillo" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gris">{t.email}</p>
                        <p className="text-sm text-negro break-all">{organization.contact}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Phone className="w-5 h-5 text-amarillo" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gris">{t.phone}</p>
                        <p className="text-sm text-negro">{organization.contact}</p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}