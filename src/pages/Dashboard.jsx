import React, { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";
import { Filter, X, Globe, Building2, Layers, Search, List, Map as MapIcon } from "lucide-react";
import L from 'leaflet';

// Fix para los iconos de Leafletf
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Coordenadas de los 100 países más conocidos del mundo
const COUNTRY_COORDINATES = {
  "Afganistán": { lat: 33.9391, lng: 67.7100 },
  "Albania": { lat: 41.1533, lng: 20.1683 },
  "Alemania": { lat: 52.5200, lng: 13.4050 },
  "Argelia": { lat: 36.7538, lng: 3.0588 },
  "Argentina": { lat: -34.6037, lng: -58.3816 },
  "Armenia": { lat: 40.1792, lng: 44.4991 },
  "Australia": { lat: -33.8688, lng: 151.2093 },
  "Austria": { lat: 48.2082, lng: 16.3738 },
  "Azerbaiyán": { lat: 40.4093, lng: 49.8671 },
  "Bahréin": { lat: 26.0667, lng: 50.5577 },
  "Bangladés": { lat: 23.8103, lng: 90.4125 },
  "Bélgica": { lat: 50.8503, lng: 4.3517 },
  "Bielorrusia": { lat: 53.9045, lng: 27.5615 },
  "Bolivia": { lat: -16.5000, lng: -68.1500 },
  "Bosnia y Herzegovina": { lat: 43.8564, lng: 18.4131 },
  "Botsuana": { lat: -24.6282, lng: 25.9231 },
  "Brasil": { lat: -15.8267, lng: -47.9218 },
  "Bulgaria": { lat: 42.6977, lng: 23.3219 },
  "Burkina Faso": { lat: 12.3714, lng: -1.5197 },
  "Camboya": { lat: 11.5564, lng: 104.9282 },
  "Camerún": { lat: 3.8480, lng: 11.5021 },
  "Canadá": { lat: 43.6532, lng: -79.3832 },
  "Catar": { lat: 25.2854, lng: 51.5310 },
  "Chad": { lat: 12.1348, lng: 15.0557 },
  "Chile": { lat: -33.4489, lng: -70.6693 },
  "China": { lat: 39.9042, lng: 116.4074 },
  "Chipre": { lat: 35.1264, lng: 33.4299 },
  "Colombia": { lat: 4.7110, lng: -74.0721 },
  "Corea del Norte": { lat: 39.0392, lng: 125.7625 },
  "Corea del Sur": { lat: 37.5665, lng: 126.9780 },
  "Costa de Marfil": { lat: 5.3600, lng: -4.0083 },
  "Costa Rica": { lat: 9.9281, lng: -84.0907 },
  "Croacia": { lat: 45.8150, lng: 15.9819 },
  "Cuba": { lat: 23.1136, lng: -82.3666 },
  "Dinamarca": { lat: 55.6761, lng: 12.5683 },
  "Ecuador": { lat: -0.1807, lng: -78.4678 },
  "Egipto": { lat: 30.0444, lng: 31.2357 },
  "El Salvador": { lat: 13.6929, lng: -89.2182 },
  "Emiratos Árabes Unidos": { lat: 25.2048, lng: 55.2708 },
  "Eslovaquia": { lat: 48.1486, lng: 17.1077 },
  "Eslovenia": { lat: 46.0569, lng: 14.5058 },
  "España": { lat: 40.4168, lng: -3.7038 },
  "Estados Unidos": { lat: 38.9072, lng: -77.0369 },
  "Estonia": { lat: 59.4370, lng: 24.7536 },
  "Etiopía": { lat: 9.0320, lng: 38.7469 },
  "Filipinas": { lat: 14.5995, lng: 120.9842 },
  "Finlandia": { lat: 60.1699, lng: 24.9384 },
  "Francia": { lat: 48.8566, lng: 2.3522 },
  "Georgia": { lat: 41.7151, lng: 44.8271 },
  "Ghana": { lat: 5.6037, lng: -0.1870 },
  "Grecia": { lat: 37.9838, lng: 23.7275 },
  "Guatemala": { lat: 14.6349, lng: -90.5069 },
  "Guinea": { lat: 9.6412, lng: -13.5784 },
  "Haití": { lat: 18.5944, lng: -72.3074 },
  "Honduras": { lat: 14.0723, lng: -87.1921 },
  "Hungría": { lat: 47.4979, lng: 19.0402 },
  "India": { lat: 28.6139, lng: 77.2090 },
  "Indonesia": { lat: -6.2088, lng: 106.8456 },
  "Irak": { lat: 33.3152, lng: 44.3661 },
  "Irán": { lat: 35.6892, lng: 51.3890 },
  "Irlanda": { lat: 53.3498, lng: -6.2603 },
  "Islandia": { lat: 64.1466, lng: -21.9426 },
  "Israel": { lat: 31.7683, lng: 35.2137 },
  "Italia": { lat: 41.9028, lng: 12.4964 },
  "Jamaica": { lat: 18.0179, lng: -76.8099 },
  "Japón": { lat: 35.6762, lng: 139.6503 },
  "Jordania": { lat: 31.9454, lng: 35.9284 },
  "Kazajistán": { lat: 51.1694, lng: 71.4491 },
  "Kenia": { lat: -1.2921, lng: 36.8219 },
  "Kuwait": { lat: 29.3759, lng: 47.9774 },
  "Letonia": { lat: 56.9496, lng: 24.1052 },
  "Líbano": { lat: 33.8886, lng: 35.4955 },
  "Libia": { lat: 32.8872, lng: 13.1913 },
  "Lituania": { lat: 54.6872, lng: 25.2797 },
  "Luxemburgo": { lat: 49.6116, lng: 6.1319 },
  "Macedonia del Norte": { lat: 41.9973, lng: 21.4280 },
  "Madagascar": { lat: -18.8792, lng: 47.5079 },
  "Malasia": { lat: 3.1390, lng: 101.6869 },
  "Malí": { lat: 12.6392, lng: -8.0029 },
  "Marruecos": { lat: 33.9716, lng: -6.8498 },
  "México": { lat: 19.4326, lng: -99.1332 },
  "Moldavia": { lat: 47.0105, lng: 28.8638 },
  "Mongolia": { lat: 47.8864, lng: 106.9057 },
  "Montenegro": { lat: 42.4304, lng: 19.2594 },
  "Mozambique": { lat: -25.9655, lng: 32.5832 },
  "Myanmar": { lat: 16.8661, lng: 96.1951 },
  "Nepal": { lat: 27.7172, lng: 85.3240 },
  "Nicaragua": { lat: 12.1150, lng: -86.2362 },
  "Níger": { lat: 13.5127, lng: 2.1128 },
  "Nigeria": { lat: 9.0765, lng: 7.3986 },
  "Noruega": { lat: 59.9139, lng: 10.7522 },
  "Nueva Zelanda": { lat: -41.2865, lng: 174.7762 },
  "Omán": { lat: 23.5880, lng: 58.3829 },
  "Países Bajos": { lat: 52.3676, lng: 4.9041 },
  "Pakistán": { lat: 33.6844, lng: 73.0479 },
  "Panamá": { lat: 8.9824, lng: -79.5199 },
  "Paraguay": { lat: -25.2637, lng: -57.5759 },
  "Perú": { lat: -12.0464, lng: -77.0428 },
  "Polonia": { lat: 52.2297, lng: 21.0122 },
  "Portugal": { lat: 38.7223, lng: -9.1393 },
  "Reino Unido": { lat: 51.5074, lng: -0.1278 },
  "República Checa": { lat: 50.0755, lng: 14.4378 },
  "República Dominicana": { lat: 18.4861, lng: -69.9312 },
  "Rumania": { lat: 44.4268, lng: 26.1025 },
  "Rusia": { lat: 55.7558, lng: 37.6173 },
  "Arabia Saudita": { lat: 24.7136, lng: 46.6753 },
  "Senegal": { lat: 14.6928, lng: -17.4467 },
  "Serbia": { lat: 44.7866, lng: 20.4489 },
  "Singapur": { lat: 1.3521, lng: 103.8198 },
  "Siria": { lat: 33.5138, lng: 36.2765 },
  "Sudáfrica": { lat: -25.7479, lng: 28.2293 },
  "Sudán": { lat: 15.5007, lng: 32.5599 },
  "Suecia": { lat: 59.3293, lng: 18.0686 },
  "Suiza": { lat: 46.9480, lng: 7.4474 },
  "Tailandia": { lat: 13.7563, lng: 100.5018 },
  "Tanzania": { lat: -6.7924, lng: 39.2083 },
  "Túnez": { lat: 36.8065, lng: 10.1815 },
  "Turquía": { lat: 39.9334, lng: 32.8597 },
  "Ucrania": { lat: 50.4501, lng: 30.5234 },
  "Uganda": { lat: 0.3476, lng: 32.5825 },
  "Uruguay": { lat: -34.9011, lng: -56.1645 },
  "Uzbekistán": { lat: 41.2995, lng: 69.2401 },
  "Venezuela": { lat: 10.4806, lng: -66.9036 },
  "Vietnam": { lat: 21.0285, lng: 105.8542 },
  "Yemen": { lat: 15.5527, lng: 48.5164 },
  "Zambia": { lat: -15.3875, lng: 28.3228 },
  "Zimbabue": { lat: -17.8252, lng: 31.0335 }
};

// Datos de organizaciones con estructura completa
const organizationsData = [
  {
    id: 1,
    name: "UMI Fund",
    description_es: "El Fondo UMI es una colaboración de donantes fundada por organizaciones filantrópicas internacionales que apoya, incuba y acelera elementos estratégicos del movimiento climático a través de la cooperación con socios para la mitigación disruptiva y escalable de las emisiones de gases de efecto invernadero.",
    description_en: "UMI Fund is a donor collaborative founded by international philanthropic organizations that supports, incubates, and accelerates strategic elements of the climate movement through cooperation with partners for the disruptive and scalable mitigation of greenhouse gas emissions.",
    tipo_de_org: {
      es: "Organizaciones No Gubernamentales",
      en: "Non-Governmental Organization"
    },
    enfoque: {
      es: "Justicia Climática, Transición Energética, Movimientos Ciudadanos, Ciudades Sustentables",
      en: "Climate Justice, Energy Transition, Citizen Movements, Sustainable Cities"
    },
    como_trabajan: {
      es: "Un fondo que brinda microsubvenciones y apoyo técnico, operando a través de convocatorias abiertas, financiamiento directo a activistas y la creación de redes de aprendizaje.",
      en: "A fund that provides micro-grants and technical support, operating through open calls, direct funding to activists, and the creation of learning networks."
    },
    impacto_financiero: {
      es: "América del norte, América central, América del sur, Europa occidental,  África subsahariana, África del norte, Oriente Medio",
      en: "North America, Central America, South America, Western Europe, Sub-Saharan Africa, North Africa, Middle East"
    },
    country: "United Kingdom",
    country_es: "Reino Unido",
    ciudad: "Londres, Reino Unido",
    continent: "europa",
    latitude: 51.5074,
    longitude: -0.1278,
    website: "umifund.org",
    email: "comms@umifund.org"
  },
  {
    id: 2,
    name: "Open Society Foundation",
    description_es: "Las Open Society Foundations defienden la búsqueda de soluciones audaces y democráticas a nuestros urgentes desafíos compartidos que promuevan los derechos, la equidad y la justicia. Lo hacen apoyando a una amplia gama de voces y organizaciones independientes en todo el mundo que proporcionan un vínculo creativo y dinámico entre quienes gobiernan y quienes son gobernados.",
    description_en: "The Open Society Foundations champion the pursuit of bold and democratic solutions to our urgent shared challenges that promote rights, equity, and justice. They do so by supporting a wide range of independent voices and organizations around the world that provide a creative and dynamic link between those who govern and those who are governed.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Democracia, Gobernanza Global, políticas y rendición de cuentas, Justicia de Género, Justicia Económica, Derechos Digitales, Justicia Racial, Migrantes y Refugiados",
      en: "Democracy, Gobernanza Global, políticas y rendición de cuentas, Gender Justice, Economic Justice, Digital Rights, Racial Justice, Migrants and Refugees"
    },
    como_trabajan: {
      es: "Financia y acompaña iniciativas locales y globales a través de subvenciones, investigación, litigios estratégicos, promoción de políticas y desarrollo de capacidades. Cada año, Open Society Foundations otorga subvenciones a grupos e individuos que trabajan para promover la práctica democrática, promover los derechos humanos y la dignidad humana, y apoyar la gobernanza equitativa.",
      en: "It funds and accompanies local and global initiatives through grants, research, strategic litigation, policy advocacy, and capacity building. Each year, the Open Society Foundations award grants to groups and individuals working to advance democratic practice, promote human rights and human dignity, and support equitable governance."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "opensocietyfoundations.org",
    email: "Info@opensocietyfoundations.org\nlatinamerica@opensocietyfoundations.org"
  },
  {
    id: 3,
    name: "Universal Rights Group",
    description_es: "URG es un grupo de expertos centrado en fortalecer el disfrute de los derechos humanos en todo el mundo apoyando mejoras en el funcionamiento, la implementación y el impacto sobre el terreno del sistema multilateral de derechos humanos; hacer que ese sistema sea más accesible y responda a las necesidades de los países en desarrollo, incluidos los países menos desarrollados (PMA) y los pequeños estados insulares en desarrollo (PEID); y trabajar con los equipos de las Naciones Unidas en los países y socios bilaterales de desarrollo para mejorar el apoyo a la implementación efectiva de las obligaciones y compromisos internacionales de derechos humanos de los Estados.",
    description_en: "URG is a think tank focused on strengthening the enjoyment of human rights worldwide by supporting improvements in the functioning, implementation, and on-the-ground impact of the multilateral human rights system; making that system more accessible and responsive to the needs of developing countries, including least developed countries (LDCs) and small island developing states (SIDS); and working with United Nations country teams and bilateral development partners to enhance support for the effective implementation of states’ international human rights obligations and commitments.",
    tipo_de_org: {
      es: "Organizaciones No Gubernamentales",
      en: "Non-Governmental Organization"
    },
    enfoque: {
      es: "Gobernanza Global, políticas y rendición de cuentas, Democracia, Justicia Climática, Derechos Humanos",
      en: "Gobernanza Global, políticas y rendición de cuentas, Democracy, Climate Justice, Derechos Humanos"
    },
    como_trabajan: {
      es: "Empoderar (por ejemplo, a través del apoyo al desarrollo de capacidades) a los gobiernos, la sociedad civil local y otros actores nacionales para hacer un mejor uso del compromiso del Estado con el Consejo de Derechos Humanos y sus mecanismos, así como con los Órganos de Tratados, con el fin de impulsar el cambio interno. Construir relaciones a largo plazo basadas en la confianza con las entidades que apoyan y comprender su salud, efectividad, fortalezas y los desafíos que enfrentan es una parte integral del enfoque de concesión de subvenciones centrado en la organización de Open Society Foundations.",
      en: "To empower (for example, through capacity-building support) governments, local civil society, and other national actors to make better use of state engagement with the Human Rights Council and its mechanisms, as well as the Treaty Bodies, in order to drive internal change. Building long-term, trust-based relationships with the entities they support and understanding their health, effectiveness, strengths, and the challenges they face is an integral part of the Open Society Foundations’ organization-centered approach to grantmaking."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "Switzerland",
    country_es: "Suiza",
    ciudad: "Ginebra, Suiza",
    continent: "europa",
    latitude: 46.948,
    longitude: 7.4474,
    website: "universal-rights.org",
    email: "info@universal-rights.org\n / secretariat@universal-rights.org"
  },
  {
    id: 4,
    name: "Ford Foundation",
    description_es: "Creen que un compromiso cívico significativo es un antídoto contra la desigualdad, con un gran potencial para empoderar a comunidades subrepresentadas y marginadas que con demasiada frecuencia han sido excluidas. En todo el mundo, trabajan para proteger y ayudar a que los espacios cívicos prosperen, asegurando que todas las personas tengan la oportunidad de alzar sus voces, influir en las decisiones y exigir responsabilidades a los gobiernos.",
    description_en: "They believe that meaningful civic engagement is an antidote to inequality, with strong potential to empower underrepresented and marginalized communities that have too often been excluded. Around the world, they work to protect and help civic spaces thrive, ensuring that all people have the opportunity to raise their voices, influence decisions, and hold governments accountable.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Racial, Justicia de Género, Democracia, Gobernanza Global, políticas y rendición de cuentas, Justicia Económica, Derechos Digitales",
      en: "Racial Justice, Gender Justice, Democracy, Gobernanza Global, políticas y rendición de cuentas, Economic Justice, Digital Rights"
    },
    como_trabajan: {
      es: "Financiación para luchar contra la desigualdad. A lo largo de su historia, el enfoque de la fundación se ha caracterizado por un énfasis continuo en la creación de instituciones y redes, la inversión en personas y liderazgo, y el apoyo a nuevas ideas.",
      en: "Funding to fight inequality. Throughout its history, the foundation’s approach has been characterized by a continued emphasis on institution- and network-building, investment in individuals and leadership, and support for new ideas."
    },
    impacto_financiero: {
      es: "América del norte, América central, América del sur, Asia Central, África subsahariana, África del norte, Oriente Medio",
      en: "North America, Central America, South America, Central Asia, Sub-Saharan Africa, North Africa, Middle East"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "fordfoundation.org",
    email: "info@fordfoundation.org\nAndinaandeanregion@fordfoundation.org "
  },
  {
    id: 5,
    name: "Sall Family Foundation",
    description_es: "La Sall Family Foundation apoya el cambio transformador en la intersección del medio ambiente, la salud pública y la resiliencia comunitaria. Reconocen que la salud ambiental está directamente relacionada con la salud y el bienestar económico de todos; que la buena salud y la asistencia sanitaria son esenciales para mejorar todos los resultados de la vida; y que ayudar a las comunidades a controlar sus propios destinos requiere apoyo para mejorar de manera sostenible los ingresos, la seguridad, la nutrición y el entorno circundante.",
    description_en: "The Sall Family Foundation supports transformative change at the intersection of the environment, public health, and community resilience. They recognize that environmental health is directly linked to the health and economic well-being of everyone; that good health and healthcare are essential to improving all life outcomes; and that helping communities control their own destinies requires support to sustainably improve income, security, nutrition, and surrounding environments.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Salud Global, Conservación de Recursos Naturales, Soberanía Alimentaria, Fortalecimiento de Capacidades Organizacionales",
      en: "Global Health, Natural Resources Conservation, Food Sovereignty, Organizational Capacity Building"
    },
    como_trabajan: {
      es: "Proporciona financiación a organizaciones y proyectos sin fines de lucro que se alinean con sus prioridades estratégicas.",
      en: "It provides funding to nonprofit organizations and projects that align with its strategic priorities."
    },
    impacto_financiero: {
      es: "Asia Central, África subsahariana",
      en: "Central Asia, Sub-Saharan Africa"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Cary, Carolina del Norte, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "sallfamily.org",
    email: "info@sallfamily.org"
  },
  {
    id: 6,
    name: "Climate and Land Use Alliance",
    description_es: "Apoya los esfuerzos para fortalecer las políticas e incentivos económicos internacionales, los flujos financieros y las narrativas para detener y revertir la pérdida de bosques como parte de un mundo justo y resiliente al clima. CLUA centra su apoyo global en colocar la equidad en el centro de las transformaciones sociales y económicas necesarias para detener y revertir la pérdida de bosques. Reconocen las complejas conexiones entre las economías que “impulsan la deforestación” en el Norte Global y los impactos en los bosques tropicales en el Sur Global, y que los bosques saludables benefician tanto a las personas que viven en los bosques y sus alrededores como a las que viven lejos.",
    description_en: "It supports efforts to strengthen international economic policies and incentives, financial flows, and narratives to halt and reverse forest loss as part of a just and climate-resilient world. CLUA focuses its global support on placing equity at the center of the social and economic transformations needed to stop and reverse forest loss. They recognize the complex connections between “deforestation-driving” economies in the Global North and the impacts on tropical forests in the Global South, and that healthy forests benefit both people who live in and around forests and those who live far away.",
    tipo_de_org: {
      es: "Alianza",
      en: "Alliance"
    },
    enfoque: {
      es: "Justicia Climática, Conservación de Recursos Naturales, Comunidades Indígenas, Gobernanza Global, políticas y rendición de cuentas",
      en: "Climate Justice, Natural Resources Conservation, Indigenous Communities, Gobernanza Global, políticas y rendición de cuentas"
    },
    como_trabajan: {
      es: "Apoyan a quienes trabajan a nivel local y global para dar forma a las políticas económicas internacionales, los flujos financieros y las narrativas económicas de manera que aprovechen el potencial de los bosques tropicales para la mitigación, la adaptación y la resiliencia climática, al tiempo que promueven beneficios sociales, ambientales y económicos más amplios. Nos enfocamos en proteger la salud ambiental y las diversas culturas de Colombia y la región andino-amazónica de Perú y la ecorregión del Chocó de Colombia.",
      en: "They support those working at local and global levels to shape international economic policies, financial flows, and economic narratives in ways that harness the potential of tropical forests for climate mitigation, adaptation, and resilience, while promoting broader social, environmental, and economic benefits. We focus on protecting environmental health and the diverse cultures of Colombia and Peru’s Andean–Amazon region and Colombia’s Chocó ecoregion."
    },
    impacto_financiero: {
      es: "América del norte, América central, Asia Central",
      en: "North America, Central America, Central Asia"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "San Francisco, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "climateandlandusealliance.org",
    email: " info@climateandlandusealliance.org"
  },
  {
    id: 7,
    name: "Gordon and Betty Moore Foundation",
    description_es: "Se centra en crear un cambio positivo y duradero en el descubrimiento científico, la conservación del medio ambiente, la atención al paciente y el área de la Bahía de San Francisco.",
    description_en: "Focuses on creating positive, lasting change in Scientific Discovery, Environmental Conservation, Patient Care, and the San Francisco Bay Area.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales, Salud Global, Innovación Social, Educación de Calidad",
      en: "Natural Resources Conservation, Global Health, Social Innovation, Quality Education"
    },
    como_trabajan: {
      es: "Operan mediante el despliegue de importantes subvenciones estratégicas en áreas de alto impacto, apoyando la investigación en etapas iniciales y los esfuerzos de conservación a gran escala con objetivos claros a largo plazo. Su enfoque enfatiza la toma de decisiones, la colaboración y la innovación basadas en datos para abordar desafíos complejos y lograr resultados duraderos.",
      en: "They operate by deploying significant, strategic grants in high-impact areas, supporting early-stage research and large-scale conservation efforts with clear, long-term objectives. Their approach emphasizes data-driven decision-making, collaboration, and innovation to address complex challenges and achieve lasting results."
    },
    impacto_financiero: {
      es: "América del norte, América del sur",
      en: "North America, South America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Palo Alto, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "moore.org",
    email: "info@moore.org"
  },
  {
    id: 8,
    name: "The David and Lucile Packard Foundation",
    description_es: "Compromete recursos a largo plazo para asegurar un futuro equitativo y sostenible apoyando a líderes y organizaciones visionarios que trabajan en los temas que preocupaban a sus fundadores, incluida la salud de los océanos, la planificación familiar y las oportunidades para los niños y las familias.",
    description_en: "Commits long-term resources to secure an equitable and sustainable future by supporting visionary leaders and organizations that work on the issues their founders cared about, including ocean health, family planning, and opportunities for children and families.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales, Justicia de Género, Salud Global, Derechos de las Infancias, Juventud",
      en: "Natural Resources Conservation, Gender Justice, Global Health, Children's Rights, Youth"
    },
    como_trabajan: {
      es: "Funciona principalmente por invitación. Si bien aceptan cartas de consulta (LOI) para algunas subvenciones locales, menos del uno por ciento de las subvenciones normalmente se originan a partir de propuestas no solicitadas. Se centran en asociaciones estratégicas a largo plazo.",
      en: "Primarily works by invitation. While they accept letters of inquiry (LOIs) for some local grantmaking, less than one percent of grants typically originate from unsolicited proposals. They focus on long-term, strategic partnerships."
    },
    impacto_financiero: {
      es: "América del Norte, todas",
      en: "North America, All regions"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Los Altos, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "www.packard.org",
    email: "communications@packard.org"
  },
  {
    id: 9,
    name: "ClimateWorks Foundation",
    description_es: "Acelera soluciones climáticas globales conectando a financiadores, innovadores e implementadores, proporcionando capital filantrópico, conocimiento y redes para escalar estrategias de alto impacto que reducen las emisiones y crean resiliencia comunitaria en todo el mundo.",
    description_en: "Accelerates global climate solutions by connecting funders, innovators, and implementers, providing philanthropic capital, knowledge, and networks to scale high-impact strategies that reduce emissions and build community resilience worldwide.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Transición Energética, Gobernanza Global, políticas y rendición de cuentas, Innovación Social",
      en: "Climate Justice, Energy Transition, Gobernanza Global, políticas y rendición de cuentas, Social Innovation"
    },
    como_trabajan: {
      es: "No acepta propuestas de subvención no solicitadas para financiación general. Ocasionalmente tienen convocatorias abiertas de Solicitudes de Propuestas (RFP) para iniciativas específicas y muy específicas (por ejemplo, el Fondo de Adaptación y Resiliencia), que se anuncian públicamente.",
      en: "Does not accept unsolicited grant proposals for general funding. They occasionally have open calls for Requests for Proposals (RFPs) for specific, highly targeted initiatives (e.g., the Adaptation & Resilience Fund), which are announced publicly."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "San Francisco, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "www.climateworks.org",
    email: "GranteeFeedback@ClimateWorks.org"
  },
  {
    id: 10,
    name: "The Blackbird Foundation",
    description_es: "Impulsa la infraestructura crítica, el capital humano y el desarrollo económico en consonancia con los Objetivos de Desarrollo Sostenible de las Naciones Unidas, centrándose en la transformación socioeconómica, la educación y la conservación del medio ambiente en las economías emergentes.",
    description_en: "Advances critical infrastructure, human capital, and economic development in alignment with the UN Sustainable Development Goals, focusing on socioeconomic transformation, education, and environmental conservation in emerging economies.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Innovación Social, Juventud, Movimientos Ciudadanos, Fortalecimiento de Capacidades Organizacionales",
      en: "Social Innovation, Youth, Citizen Movements, Organizational Capacity Building"
    },
    como_trabajan: {
      es: "Opera a través de la coordinación estratégica y la implementación de proyectos. Se centra en alinearse con las mejores prácticas globales y las necesidades locales. No parece tener un proceso de solicitud de subvenciones externo y abierto para organizaciones no asociadas.",
      en: "Operates through strategic coordination and project implementation. It focuses on aligning with global best practices and local needs. It does not appear to have an open, external grant application process for non-partner organizations."
    },
    impacto_financiero: {
      es: "América del norte",
      en: "North America"
    },
    country: "Australia",
    country_es: "Australia",
    ciudad: "Sídney, Australia",
    continent: "oceania",
    latitude: -35.2809,
    longitude: 149.13,
    website: "blackbirdfdn.org",
    email: "Danielle@blackbirdfdn.org"
  },
  {
    id: 11,
    name: "The Carmack Collective Fund",
    description_es: "Tiene la misión de catalizar el cambio transformativo para lograr la justicia climática mediante el desmantelamiento de la industria de los combustibles fósiles. Apoyan a los agentes de primera línea para lograr un mundo más sostenible y equitativo.",
    description_en: "Has the mission to catalyze transfromative change to achieve climate justice by dismantling the fossil fuel industry. They support frontline agents for a more sustainbale and equitable world.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia de Género, Justicia Racial, Justicia Climática, Innovación Social",
      en: "Gender Justice, Racial Justice, Climate Justice, Social Innovation"
    },
    como_trabajan: {
      es: "Financiamiento basado en dos tácticas estratégicas: construcción de movimientos y cambio cultural. El primero se centró en la organización comunitaria y campañas de acción no violenta, y el segundo financió grupos utilizando intervenciones culturales que fortalecen las narrativas contra las prácticas destructivas de la industria de los combustibles fósiles. Fondos: Subvenciones catalíticas y plurianuales.",
      en: "Funding based on two strategic tactics: movement building and culture change. The former focused on community organizing and non-violent action campaigns, and the latter funding groups using cultural interventions that strengthen narratives against destructive practices of the fossil fuel industry. Funds: Catalytic and Multi-year grants."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Austin, Texas, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "thecarmackcollective.org",
    email: ""
  },
  {
    id: 12,
    name: "Cornell Douglas Foundation",
    description_es: "Proporciona subvenciones a organizaciones que promueven la visión de defender la salud y la justicia ambientales fomentando la protección del medio ambiente y el respeto por la sostenibilidad de los recursos. Áreas de enfoque: Salud y justicia ambiental, conservación de la tierra, protección de cuencas hidrográficas, sostenibilidad de los recursos.",
    description_en: "Provides grants to organizations which promote the vision to advocate for environmental health and justice encouraging stewarshio for the environment and respect for sustainability of resources. Areas of focus: Environmental health & justice, land conservation, watershed protection, sustainability of resources.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales, Salud Global, Educación de Calidad, Justicia Climática",
      en: "Natural Resources Conservation, Global Health, Quality Education, Climate Justice"
    },
    como_trabajan: {
      es: "Proporcionar subvenciones a organizaciones medioambientales sin fines de lucro centradas en sus cuatro áreas, y al mismo tiempo reconocer esfuerzos excepcionales con el Premio Perla anual. Generalmente no aceptan propuestas no solicitadas, sino que buscan organizaciones que se alineen con su misión.",
      en: "Providing grants to environmental non-profits focused on their four areas, while also recognizing exceptional efforts with the annual Pearl Award. They generally don't accept unsolicited proposals but look for organizations aligning with their mission."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Bethesda, Maryland, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "cornelldouglas.org",
    email: "cduffy@cornelldouglas.org"
  },
  {
    id: 13,
    name: "CS Fund",
    description_es: "Promueve el cambio progresivo en la tecnología emergente (nanotecnología, bioingeniería), la globalización económica, la soberanía alimentaria (ahorro de semillas, agricultura sostenible), las libertades civiles y las transiciones justas.",
    description_en: "Promotes progressive change in emerging tech (nanotech, bioengineering), economic globalization, food sovereignty (seed saving, sustainable farming), civil liberties, and just transitions.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Democracia, Justicia de Género, Soberanía Alimentaria, Movimientos Ciudadanos, Paz y Resolución de Conflictos",
      en: "Democracy, Gender Justice, Food Sovereignty, Citizen Movements, Peace and Conflict Resolution"
    },
    como_trabajan: {
      es: "Subvenciones para impacto nacional/internacional, a menudo mediante donaciones de transferencia.",
      en: "Grants for national/international impact, often via pass-through giving. "
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Boulder, Colorado, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "csfund.org",
    email: "inquiries@csfund.org"
  },
  {
    id: 14,
    name: "The Dudley Foundation",
    description_es: "Promueve y apoya actividades y programas de desarrollo comunitario que mejoran la calidad de vida de las personas que viven en la ciudad de Wausau, el condado de Marathon y el estado de Wisconsin.",
    description_en: "Promotes and support community development activities and programs that enhance the quality of life for people living in the City of Wausau, Marathon County, and the State of Wisconsin.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Educación de Calidad, Conservación de Recursos Naturales, Participación Ciudadana",
      en: "Quality Education, Natural Resources Conservation, Civic Participation"
    },
    como_trabajan: {
      es: "Ofrece subvenciones y fondos de premios a organizaciones locales sin fines de lucro. Se reúnen trimestralmente para considerar las solicitudes de subvención (septiembre, diciembre, marzo, junio). El solicitante debe ser una organización exenta de impuestos según la sección 501(c)(3) del Código de Rentas Internas.",
      en: "Offers grants and award funds to local non-profits. The meet quarterly to consider grant requests (September, December, March, June). An applicant must be a tax-exempt organization under section 501(c)(3) of the Internal Revenue Code."
    },
    impacto_financiero: {
      es: "América del norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Wausau, Wisconsin, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "dudleyfoundationwausau.org",
    email: "andrew.dudley.shannon@dudleyfoundationwausau.org"
  },
  {
    id: 15,
    name: "Dunn Family Charitable Foundation",
    description_es: "Se centra en el alivio de la pobreza y la justicia social a través del impacto en la atención médica, la educación, el medio ambiente y las oportunidades de empleo, lo que promueve la justicia social y los derechos humanos. Priorizan la justicia climática que abarca su compromiso social para garantizar una transición justa y equitativa para las comunidades más afectadas.",
    description_en: "Focuses on poverty alleviation and social justice through impact on healthcare, education, environment, and employment opportunities, whcih promotes social justice and human rights. They prioritize climate justice which encompasses their social commitment to ensure a fair and equitable transition for the most impacted communities.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Económica, Salud Global, Derechos de las Infancias, Educación de Calidad",
      en: "Economic Justice, Global Health, Children's Rights, Quality Education"
    },
    como_trabajan: {
      es: "Financia organizaciones específicas que trabajan en sus áreas de interés de forma continua. Algunas inversiones se enumeran en más de un área de enfoque. La estrategia de inversión de alto impacto de DFCF tiene dos partes: preservación del capital impulsada por la misión a través de DF Impact Capital, que realiza inversiones de deuda y capital en los EE. UU. y en todo el mundo, y capital catalítico o filantrópico que apoya a las comunidades desatendidas.",
      en: "Funds specific organizations that work on their areas of interest on an ongoing basis. Some investments are listed under more than one focus area. DFCF’s high-impact investment strategy has two parts: mission-driven capital preservation through DF Impact Capital, which makes debt and equity investments in the U.S. and globally, and catalytic or philanthropic capital that supports underserved communities"
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Boston, Massachusetts, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://dunnfcf.org/",
    email: "N/I"
  },
  {
    id: 16,
    name: "Eaglemere Foundation",
    description_es: "Se centra en la conservación del medio ambiente con énfasis secundario en mejorar la salud global y combatir la injusticia. Su trabajo ambiental es programático (promoción, restauración, conservación, preservación, mitigación) y geográfico (ej: Montañas Rocosas, América Latina, etc.). También tienen esfuerzos globales de salud y desarrollo global.",
    description_en: "Focuses on environmental conservation with secondary emphasis on improving global health and combating injustice. Their environmental work is programmatic (promoting, restoration, conservation, preservation, mitigation) and geographic (ex: Rocky mountains, Latin America, etc.). They also have global health and global development efforts.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales, Justicia Climática, Educación de Calidad",
      en: "Natural Resources Conservation, Climate Justice, Quality Education"
    },
    como_trabajan: {
      es: "Financia organizaciones pragmáticas con base científica centradas en la conservación del medio ambiente, la salud global y la lucha contra la injusticia, enfatizando la colaboración y los enfoques de múltiples partes interesadas, aunque es conocido por no aceptar propuestas no solicitadas y ser altamente selectivo.",
      en: "Funds pragmatic, science-based organizations focused on environmental conservation, global health, and combating injustice, emphasizing collaboration and multi-stakeholder approaches, though it's known for not accepting unsolicited proposals and being highly selective, "
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Filadelfia, Pensilvania, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.eaglemere.org/",
    email: "dgsarles@eaglemere.org/ inquiry@eaglemere.org"
  },
  {
    id: 17,
    name: "Flora Family Foundation",
    description_es: "Apoya el progreso social, el bienestar ambiental y la vitalidad cultural en todo el mundo.  Apoyan actividades de organizaciones e instituciones benéficas en dos áreas programáticas: el Programa de Protección Climática y el Programa Gap. El primero se centra en formas de reducir las emisiones de GEI y acelerar la transición hacia una economía basada en energías limpias. Este último busca mejorar las vidas de los pobres en algunos países en desarrollo. Más allá de sus dos programas principales, la FFF apoya una Iniciativa de Conservación Marina que promueve investigaciones y proyectos que impactan la salud global de los océanos, así como una Iniciativa de Salud Materna Negra destinada a reducir las disparidades en los resultados de salud de las mujeres negras en California.",
    description_en: "Supports social progress, environmental well-being, and cultural vibrancy worldwide.  They support activities of charitable organizations and institutions on two program areas: the Climate Protection Program and the Gap Program . The former focuses on ways to slow GHG emissions and to accelerate the transition to a clean energy based economy. The latter seeks to improve the lives of the poor in some developing countries. Beyond its two core programs, FFF supports a Marine Conservation Initiative that advances research and projects impacting global ocean health, as well as a Black Maternal Health Initiative aimed at reducing health outcome disparities for Black women in California.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales, Justicia de Género, Educación de Calidad, Salud Global",
      en: "Natural Resources Conservation, Gender Justice, Quality Education, Global Health"
    },
    como_trabajan: {
      es: "Las subvenciones para sus programas se ofrecen mediante invitación; la Fundación no puede considerar propuestas no solicitadas. Aproximadamente la mitad de los fondos de la fundación se otorga a través de subvenciones patrocinadas individualmente, y el resto se asigna a sus programas e iniciativas principales. Más allá de la concesión de subvenciones, los miembros y el personal del consejo apoyan activamente a los beneficiarios al formar parte de las juntas directivas, conectarlos con nuevas fuentes de financiación y fomentar la colaboración entre los financiadores.",
      en: "Grants to their programs are offered by invitation, the Foundation is unable to consider unsolicited proposals. About half of the foundation’s funding is awarded through individually sponsored grants, with the remainder allocated to its core programs and initiatives. Beyond grantmaking, council members and staff actively support grantees by serving on boards, connecting them to new funding sources, and fostering collaboration among funders."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Menlo Park, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.florafamily.org/",
    email: "info@florafamily.org"
  },
  {
    id: 18,
    name: "Foundation for a Just Society",
    description_es: "Se centra en la liberación de mujeres, niñas y personas LGBTQI, enfatizando la acción colectiva, el entendimiento compartido y las soluciones lideradas por los más afectados por la injusticia. Al apoyar movimientos y organizaciones arraigados en la experiencia vivida, la fundación busca abordar las causas fundamentales y defender la dignidad para todos.",
    description_en: "Focuses on the liberation of women, girls, and LGBTQI people, emphasizing collective action, shared understanding, and solutions led by those most affected by injustice. By supporting movements and organizations rooted in lived experience, the foundation seeks to address root causes and uphold dignity for all.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia de Género, LGTBIQ+, Justicia Racial, Fortalecimiento de Capacidades Organizacionales",
      en: "Gender Justice, LGBTIQ+, Racial Justice, Organizational Capacity Building"
    },
    como_trabajan: {
      es: "Apoya el cambio estructural a largo plazo y satisface las necesidades inmediatas que permitan a las mujeres, las niñas y las personas LGBTQI más afectadas por la injusticia ser agentes de cambio. Priorizan el soporte operativo general plurianual y evitan restricciones. También brindan a sus socios una variedad de acompañamiento impulsado por los beneficiarios.",
      en: "Supports long-term, structural change and meet immediate needs that enable the women, girls, and LGBTQI people most affected by injustice to be agents of change. They prioritize multi-year, general operating support and avoid restrictions. Also they provide their partners with an array of grantee-driven accompaniment."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.fjs.org/es",
    email: "info@fjs.org"
  },
  {
    id: 19,
    name: "Hau’oli Mau Loa Foundation",
    description_es: "Tiene asociaciones de financiación con organizaciones que trabajan en: Hope for Kids, Medio Ambiente (Hawái e internacional), Socios de Primera Generación, Vivienda Asequible para Familias, Construcción de Campo y Ayuda Humanitaria.",
    description_en: "Has funding partnerships with organizations working on: Hope for Kids, Environment (Hawaiʻi and International), First Generation Partners, Affordable Housing for Families, Field Building and Humanitarian Relief.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Juventud, Educación de Calidad, Conservación de Recursos Naturales, Protección de la Niñez",
      en: "Youth, Quality Education, Natural Resources Conservation, Child Protection"
    },
    como_trabajan: {
      es: "No aceptan propuestas no solicitadas. La Fundación identifica estrategias que tienen potencial para producir un impacto dentro de las áreas de su programa y cree profundamente en las relaciones a largo plazo con sus organizaciones beneficiarias.",
      en: "They don't accept unsolicited proposals. The Foundation identifies strategies that have potential to produce an impact within their program areas, and deeply believes in long-term relationships with their grantee organizations."
    },
    impacto_financiero: {
      es: "Oceanía",
      en: "Oceania"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Honolulu, Hawái, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.hauolimauloa.org/",
    email: "janis@hauolimauloa.org/brant@hauolimauloa.org/info@hauolimauloa.org"
  },
  {
    id: 20,
    name: "The Hitz Foundation",
    description_es: "Apoya proyectos en ciencias, artes y medio ambiente priorizando: preservación digital y mapeo LiDAR, salud, servicios humanos, educación, artes (como las traducciones de Shakespeare) y medio ambiente y sostenibilidad.",
    description_en: "Supports projects in science, arts, and the environment prioritizing: digital preservation and LiDAR Mapping, health, human services, education, arts (such as Shakespeare translations), and environment and sustainability. ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Innovación Social, Conservación de Recursos Naturales, Educación de Calidad",
      en: "Social Innovation, Natural Resources Conservation, Quality Education"
    },
    como_trabajan: {
      es: "No aceptan solicitudes de subvenciones no solicitadas. Han ofrecido más de 80 millones de dólares a más de 300 organizaciones en sus cinco principales áreas de proyectos.",
      en: "They don't accept unsolicited grant requests. Have offered over 80 million dollars to 300+ organizations in their five major project areas."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Palo Alto, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.hitzfoundation.org/",
    email: "ken_hitz@yahoo.com"
  },
  {
    id: 21,
    name: "Island Foundation",
    description_es: "Dirige sus subvenciones a cuatro áreas clave: medio ambiente, New Bedford, educación alternativa y mujeres y niñas, apoyando el trabajo en la costa de Maine, Massachusetts, Rhode Island y regiones internacionales selectas. Durante los últimos 20 años, ha concentrado gran parte de su financiamiento en el sureste de Massachusetts, centrándose en el crecimiento comunitario sostenible y equitativo, la educación ampliada, las economías rurales y urbanas conectadas y la protección de paisajes laborales y medios de vida para maximizar el impacto.",
    description_en: "Directs its grants toward four key areas: environment, New Bedford, alternative education, and womxn and girls, supporting work in coastal Maine, Massachusetts, Rhode Island, and select international regions. For the past 20 years, it has concentrated much of its funding in Southeastern Massachusetts, focusing on sustainable and equitable community growth, expanded education, connected rural and urban economies, and the protection of working landscapes and livelihoods to maximize impact.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales, Justicia de Género, Justicia Climática, Participación Ciudadana",
      en: "Natural Resources Conservation, Gender Justice, Climate Justice, Civic Participation"
    },
    como_trabajan: {
      es: "Apoya principalmente a organizaciones sin fines de lucro 501(c)(3) que trabajan en Maine, Massachusetts y Rhode Island, con excepciones limitadas para trabajos alineados fuera de la región u organizaciones que utilizan un patrocinador fiscal. Financia subvenciones operativas generales y basadas en proyectos, y ocasionalmente ofrece apoyo plurianual a socios a largo plazo.  El proceso de solicitud comienza con una consulta inicial por teléfono o correo electrónico. Si son invitados, los solicitantes envían una carta de consulta o una propuesta completa a través del sistema en línea de la Fundación, siguiendo los plazos trimestrales establecidos.",
      en: "Supports primarily 501(c)(3) nonprofits working in Maine, Massachusetts, and Rhode Island, with limited exceptions for aligned work outside the region or organizations using a fiscal sponsor. It funds both general operating and project-based grants, occasionally offering multi-year support to long-term partners.  The application process begins with an initial inquiry by phone or email. If invited, applicants submit a letter of inquiry or full proposal through the Foundation’s online system, following set quarterly deadlines."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Marion, Massachusetts, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://islandfdn.org/",
    email: "info@islandfdn.org/Andrea Bogomolni - Program Officer, Environment and Education\nabogomolni@islandfdn.org/Rayana Grace - Program Officer, New Bedford and Womxn and Girls\nrgrace@islandfdn.org/Michele Emery - Financial-Administrative Assistant\nmemery@islandfdn.org"
  },
  {
    id: 22,
    name: "Jacques M. Littlefield Foundation",
    description_es: "Con sede en California, Estados Unidos; invierte en capital privado.",
    description_en: "Based in California, United States; it invests into Private Equity.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Educación de Calidad, Conservación de Recursos Naturales, Innovación Social",
      en: "Quality Education, Natural Resources Conservation, Social Innovation"
    },
    como_trabajan: {
      es: "La Fundación otorgó 22 subvenciones en 2015. Los beneficiarios incluyen la Escuela Preparatoria Eastside College.",
      en: "The Foundation made 22 grants in 2015. Grantees include Eastside College Preparatory School. "
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Portola Valley, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "N/I",
    email: "N/I"
  },
  {
    id: 23,
    name: "Jonathan P. Formanek Foundation",
    description_es: "Principalmente en Texas, Illinois y Virginia, la concesión de subvenciones se centra en la educación, la filantropía, el voluntariado y la concesión de subvenciones, y la atención sanitaria.",
    description_en: "Primarily in Texas, Illinois, and Virginia has a grant-making focused on Education, Philanthropy, Voluntarism & Grantmaking, and Health Care.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Educación de Calidad, Salud Global, Derechos de las Infancias",
      en: "Quality Education, Global Health, Children's Rights"
    },
    como_trabajan: {
      es: "Los premios típicos oscilan entre $ 1000 y $ 575 000, con 0 oportunidades de subvenciones en vivo. Esta organización aún no ha reportado ninguna información del programa.",
      en: "Typical awards are $1,000–$575,000, with 0 live grant opportunities. This organization has not yet reported any program information."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Memphis, Tennessee, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "N/I",
    email: "N/I"
  },
  {
    id: 24,
    name: "JustFund",
    description_es: "Transforma la filantropía tradicional al hacer que la concesión de subvenciones sea más eficiente, transparente y equitativa. Fundado en respuesta a las barreras y desigualdades que enfrentan las organizaciones sin fines de lucro en los sistemas de financiamiento convencionales, JustFund proporciona una infraestructura compartida que simplifica la forma en que las organizaciones buscan financiamiento y cómo colaboran los financiadores. Lo que comenzó como una herramienta para agilizar las solicitudes de subvenciones se ha convertido en un movimiento nacional para #ResetPhilanthropy alineando recursos con valores y dirigiendo fondos a las comunidades más afectadas por la injusticia.",
    description_en: "Transforms traditional philanthropy by making grantmaking more efficient, transparent, and equitable. Founded in response to the barriers and inequities nonprofits face in conventional funding systems, JustFund provides shared infrastructure that simplifies how organizations seek funding and how funders collaborate. What began as a tool to streamline grant applications has grown into a national movement to #ResetPhilanthropy by aligning resources with values and directing funding to communities most impacted by injustice.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Racial, Justicia de Género, Innovación Social, Fortalecimiento de Capacidades Organizacionales",
      en: "Racial Justice, Gender Justice, Social Innovation, Organizational Capacity Building"
    },
    como_trabajan: {
      es: "Opera como una plataforma centralizada de concesión de subvenciones que conecta a organizaciones sin fines de lucro y de base con financiadores alineados a través de un proceso de solicitud único y optimizado. Las organizaciones envían una solicitud común que puede ser revisada por múltiples financiadores, lo que reduce la carga administrativa y aumenta el acceso a la financiación. Los financiadores utilizan la plataforma para descubrir organizaciones, colaborar con pares, compartir diligencias debidas y tomar decisiones de financiación coordinadas e impulsadas por valores.",
      en: "Operates as a centralized grantmaking platform that connects nonprofits and grassroots organizations with aligned funders through a single, streamlined application process. Organizations submit one common application that can be reviewed by multiple funders, reducing administrative burden and increasing access to funding. Funders use the platform to discover organizations, collaborate with peers, share due diligence, and make coordinated, values-driven funding decisions."
    },
    impacto_financiero: {
      es: "América del Norte, Oceanía",
      en: "North America, Oceania"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "San Francisco, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.justfund.org/",
    email: "info@justfund.us/enquiries@justfund.com.au"
  },
  {
    id: 25,
    name: "The Kendeda Fund",
    description_es: "Se centra en desarrollar la resiliencia, la equidad y la sostenibilidad de la comunidad a través de grandes apuestas en áreas como los derechos de las niñas, la propiedad de los empleados, la construcción sustentable y la curación de los veteranos, apoyando a líderes y organizaciones innovadoras.",
    description_en: "Focuses on building community resilience, equity, and sustainability through big bets in areas like girls' rights, employee ownership, green building, and veterans' healing, supporting innovative leaders and organizations.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Ciudades Sustentables, Conservación de Recursos Naturales, Justicia Económica, Justicia de Género",
      en: "Sustainable Cities, Natural Resources Conservation, Economic Justice, Gender Justice"
    },
    como_trabajan: {
      es: "Ofrece financiación plurianual sin restricciones y apoyo organizativo. invertido en una nueva generación de líderes e ideas, ofreciendo subvenciones principalmente a través de inversiones directas y de alto impacto en lugar de los típicos procesos de solicitud abiertos, trabajando en estrecha colaboración con los socios. No ofrece aplicaciones tradicionales con convocatorias públicas.",
      en: "Offers multi-year, unrestricted funding and organizational support. invested in a new generation of leaders and ideas, offering grants primarily through direct, high-impact investments rather than typical open application processes, working closely with partners. Does not offer traditional applications with public calls for proposals."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Atlanta, Georgia, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://kendedafund.org/",
    email: "N/I"
  },
  {
    id: 26,
    name: "The Libra Foundation",
    description_es: "Se centra en organizaciones lideradas por aquellos más afectados por la opresión sistémica, principalmente comunidades de color que han experimentado una falta crónica de inversión. Mueven fondos a grupos que construyen el poder de BIPOC. Sus áreas de programa incluyen: seguridad y justicia comunitaria, justicia de género y justicia ambiental y climática.",
    description_en: "Focuses on organizations led by those most impacted by systemic oppression mainly communities of color that have experienced chronic underinvestment. They move funds to groups building BIPOC power. Their program areas include: community safety and justice, gender justice, and environmental and climate justice.\n\n",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Racial, Justicia de Género, Movimientos Ciudadanos, Justicia Climática",
      en: "Racial Justice, Gender Justice, Citizen Movements, Climate Justice"
    },
    como_trabajan: {
      es: "Priorizan subvenciones plurianuales sin restricciones a organizaciones de primera línea que trabajan para lograr un cambio transformador en sus comunidades. Con el tiempo construyen relaciones de confianza con los socios donatarios, no requieren propuestas ni informes.",
      en: "They prioritize multi-year, unrestricted grants to frontline organizations working to bring transformational change in their communities. Over time, they build relationships of trust with grantee partners, they do not requiere proposals or reports required. "
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "San Francisco, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.thelibrafoundation.org/",
    email: "info@thelibrafoundation.org"
  },
  {
    id: 27,
    name: "Namaste Foundation",
    description_es: "Apoya a varias organizaciones sin fines de lucro, con un enfoque declarado en el cuidado ecológico, la conservación, la educación y las causas sociales, operando como un fondo de gastos y apoyando proyectos en lugares como Nueva Zelanda y en todo el mundo. Las áreas de enfoque incluyen: acceso sostenible a la tierra, educación y películas ambientales y ecología comunitaria.",
    description_en: "Supports various nonprofits, with a stated focus on ecological care, conservation, education, and social causes, operating as a spend-down fund and supporting projects in places like New Zealand and globally. Focus areas include: sustainable land access, environmental film and education, and community-based ecology.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Paz y Resolución de Conflictos, Innovación Social, Democracia, Participación Ciudadana",
      en: "Peace and Conflict Resolution, Social Innovation, Democracy, Civic Participation"
    },
    como_trabajan: {
      es: "Empodera a los donantes para apoyar proyectos ambientales diversos, impactantes y regenerativos a nivel mundial. A través de la concesión de subvenciones, financia organizaciones sin fines de lucro centradas en la gestión ambiental, la agricultura sostenible, la narración de historias a través de películas y la regeneración liderada por la comunidad. Operando en parte a través de un modelo de fondo asesorado por donantes, la fundación permite a los donantes dirigir sus donaciones hacia prioridades ecológicas específicas.",
      en: "Empowers donors to support diverse, impactful, and regenerative environmental projects globally. Through grantmaking, it funds nonprofits focused on environmental stewardship, sustainable agriculture, storytelling through film, and community-led regeneration. Operating in part through a donor-advised fund model, the foundation enables donors to direct their giving toward specific ecological priorities."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "San Francisco, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "N/I",
    email: "N/I"
  },
  {
    id: 28,
    name: "The Noon Whistle Fund",
    description_es: "Fundación familiar con sede en Chicago que utiliza un fondo asesorado por donantes para apoyar a varias comunidades, conocida por donaciones importantes, a menudo sorprendentes, a organizaciones como Art from Ashes, que se centra en retribuir sin un perfil público, sitio web o información de contacto directo, con el objetivo de proporcionar \"un soplo de aire fresco\" a las comunidades.",
    description_en: "Chicago-based family foundation that uses a donor-advised fund to support various communities, known for significant, often surprising, donations to organizations like Art from Ashes, focusing on giving back without a public profile, website, or direct contact info, aiming to provide \"a breath of fresh air\" to communities. ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia de Género, Justicia Económica, Movimientos Ciudadanos",
      en: "Gender Justice, Economic Justice, Citizen Movements"
    },
    como_trabajan: {
      es: "Crearon su fondo asesorado por donantes para retribuir a muchas comunidades, dondequiera que se encuentren. No tienen un sitio web y no quieren proporcionar ninguna información de contacto. Los miembros de la familia que componen la fundación son personas amables y atentas, y estamos muy agradecidos por su generosidad.",
      en: "They created their donor-advised fund in order to give back to many communities, wherever they may be. They do not have a website and don’t want to provide any contact information. The family members who comprise the foundation are kind and caring people, and we are so very thankful for their generosity."
    },
    impacto_financiero: {
      es: "América del Norte, N/I",
      en: "North America, N/I"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Chicago, Illinois, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "N/I",
    email: "N/I"
  },
  {
    id: 29,
    name: "NoVo Foundation",
    description_es: "Brinda apoyo operativo general a organizaciones confiables que prestan servicios a comunidades histórica y continuamente marginadas, así como iniciativas dedicadas a desarrollar la resiliencia de Kingston.",
    description_en: "Provides general operating support to trusted organizations serving historically and continually marginalized communities, as well as initiatives dedicated to building Kingston’s resilience.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia de Género, Derechos de las Infancias, Comunidades Indígenas, Educación de Calidad",
      en: "Gender Justice, Children's Rights, Indigenous Communities, Quality Education"
    },
    como_trabajan: {
      es: "Principalmente financia grupos mediante invitación para cultivar relaciones a largo plazo, enfatizando un modelo ascendente que apoya los esfuerzos liderados por comunidades e indígenas. Sus prioridades incluyen la justicia indígena, la equidad racial y de género, los sistemas alimentarios sostenibles, el desarrollo comunitario y la narración de historias, todo dentro de un marco holístico destinado a fomentar soluciones transformadoras e interconectadas.",
      en: "Mainly funds groups by invitation to cultivate long-term relationships, emphasizing a bottom-up model that supports community- and Indigenous-led efforts. Its priorities include Indigenous justice, racial and gender equity, sustainable food systems, community development, and storytelling, all within a holistic framework aimed at fostering interconnected, transformative solutions."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://novofoundation.org/ ",
    email: "info@novofoundation.org/ info@NoVoinKingston.org"
  },
  {
    id: 30,
    name: "Oreg Foundation",
    description_es: "Financia programas caritativos no sectarios con sede en Colorado que se centran en la educación, el servicio comunitario y la preservación de nuestro medio ambiente natural. La fundación también apoya programas que mejoran la vida judía y la renovación espiritual en los Estados Unidos, Israel y otros países del mundo.",
    description_en: "Funds Colorado based, non-sectarian charitable programs that focus on education, community service, and the preservation of our natural environment. The foundation also supports programs that enhance Jewish life and spiritual renewal in the United States, Israel, and other countries around the world. ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Conservación de Recursos Naturales, Participación Ciudadana",
      en: "Climate Justice, Natural Resources Conservation, Civic Participation"
    },
    como_trabajan: {
      es: "Apoya organizaciones e iniciativas innovadoras para mejorar la vida judía, ayudar a satisfacer las necesidades básicas y proteger el medio ambiente.",
      en: "Supports innovative organizations and initiatives to enhance Jewish life, assist in meeting basic needs and protect the environment."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Portland, Oregón, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "N/I",
    email: "N/I"
  },
  {
    id: 31,
    name: "Panta Rhea Foundation",
    description_es: "Se asocia con personas que construyen poder para garantizar que las comunidades, las culturas y los entornos naturales prosperen. Movilizan recursos para que nuestros socios puedan implementar soluciones comunitarias para la justicia social, de género, económica y ambiental. Áreas de enfoque: Justicia climática, soberanía alimentaria y derechos humanos, Narración, lenguaje y prácticas creativas, Sanación, cuidado, sostenibilidad y bienestar.",
    description_en: "Partners with people building power to ensure communities, cultures, and natural environments thrive. They mobilize resources so our partners can realize community-based solutions for social, gender, economic, and environmental justice. Focus areas: Climate justice, food sovereignty, and human rights, Storytelling, language, and creative practice, Healing, care, sustainability, and well-being.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Soberanía Alimentaria, Justicia Climática, Resiliencia Comunitaria, Movimientos Ciudadanos",
      en: "Food Sovereignty, Climate Justice, Resiliencia Comunitaria, Citizen Movements"
    },
    como_trabajan: {
      es: "Alinea a los financiadores del Norte Global con visiones lideradas por la comunidad en el Sur Global y ayudan a elevar las voces y prioridades locales. Su enfoque es adaptable y está informado por la comunidad, apoyando asociaciones a largo plazo y al mismo tiempo movilizando fondos de respuesta rápida en momentos de necesidad urgente. Panta Rhea distribuye aproximadamente $6 millones en subvenciones cada año, principalmente como apoyo operativo general de varios años, y prioriza las solicitudes solicitadas para minimizar la carga administrativa para los beneficiarios y el personal.",
      en: "Aligns funders in the Global North with community-led visions in the Global South, they help elevate local voices and priorities. Their approach is adaptive and community-informed, supporting long-term partnerships while also mobilizing rapid-response funding in times of urgent need. Panta Rhea distributes approximately $6 million in grants each year, primarily as multi-year general operating support, and prioritizes solicited applications to minimize administrative burden for grantees and staff."
    },
    impacto_financiero: {
      es: "América del Norte, América Central, América del Sur, Caribe",
      en: "North America, Central America, South America, Caribe"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Sausalito, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://pantarhea.org/ ",
    email: "info@pantarhea.org"
  },
  {
    id: 32,
    name: "The Prospect Hill Foundation",
    description_es: "Se centra en mejorar la experiencia humana y el bienestar de la Tierra, principalmente a través de subvenciones para el desarme/no proliferación nuclear y el desarrollo de la juventud, con trabajos anteriores en salud reproductiva, cambio social y conservación ambiental, a menudo apoyando esfuerzos en el noreste de EE. UU. Tiene dos áreas de programa actuales: Desarme y no proliferación nuclear y Juventud.",
    description_en: "Focuses on improving the human experience and Earth's well-being, primarily through grants in Nuclear Disarmament/Nonproliferation and Youth Development, with past work in reproductive health, social change, and environmental conservation, often supporting efforts in the Northeast U.S.. Has two current program areas are Nuclear Disarmament & Nonproliferation and Youth.  ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Justicia de Género, Conservación de Recursos Naturales, Paz y Resolución de Conflictos",
      en: "Climate Justice, Gender Justice, Natural Resources Conservation, Peace and Conflict Resolution"
    },
    como_trabajan: {
      es: "Ofrece un marco de concesión de subvenciones triple: subvenciones para programas en dos áreas, subvenciones patrocinadas y donaciones paralelas. No acepta solicitudes de subvenciones no solicitadas ni para su Programa ni para subvenciones patrocinadas; Las subvenciones del programa se otorgan de forma continua.",
      en: "Offers a three-fold grantmaking framework: program grants in two areas, sponsored grants and matching gifts. It does not accept unsolicited grant applications for either its Program or Sponsored grants; program grants are made on a rolling basis"
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.prospect-hill.org/ ",
    email: "info@prospect-hill.org"
  },
  {
    id: 33,
    name: "Red Butterfly Foundation",
    description_es: "Se centra en salvaguardar, proteger y promover áreas que contribuyen a la maravillosa y rica diversidad de nuestro mundo, es decir, fomentar lo que nos inspira: animales, artes y mujeres y niñas.",
    description_en: "Focuses on safeguarding, protecting and promoting areas that contribute to the wondrous rich diversity of our world, namely fostering what inspires us: Animals, Arts and Women & Girls.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia de Género, Educación de Calidad, Salud Global",
      en: "Gender Justice, Quality Education, Global Health"
    },
    como_trabajan: {
      es: "Acepta solicitudes de subvenciones en cada año de subvención presentadas antes del 30 de septiembre. Limitamos las subvenciones a una organización en particular a una vez por año calendario. Las organizaciones no serán consideradas automáticamente para recibir financiación el año siguiente; Las propuestas con archivos adjuntos actualizados deben volver a enviarse. Para las organizaciones estadounidenses, la Red Butterfly Foundation solo financiará organizaciones que sean organizaciones benéficas públicas exentas de impuestos según las Secciones 501(c)(3) y 509(a)(1), (2) y (3) del Código de Rentas Internas.",
      en: "Accepts applications for grants in each grant year submitted before September 30th. We limit grants to a particular organization to once per calendar year. Organizations will not be automatically considered for funding the following year; proposals with updated attachments must be resubmitted. For U.S. organizations, the Red Butterfly Foundation will only fund organizations that are tax exempt public charities under Sections 501(c)(3) and 509(a)(1), (2), and (3) of the Internal Revenue Code."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Chicago, Illinois, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://redbutterfly.foundation/",
    email: "info@redbutterfly.foundation"
  },
  {
    id: 34,
    name: "Rockefeller Philanthropy Advisors",
    description_es: "Brinda servicios de asesoría, gestión e implementación para familias, fundaciones y otras iniciativas filantrópicas; incubando colaboraciones de donantes y organizaciones sin fines de lucro innovadoras y en etapa inicial; y compartiendo ideas y produciendo publicaciones sobre enfoques, estrategias y prácticas filantrópicas. Sus áreas de interés incluyen: arte y cultura, clima y medio ambiente, educación, inclusión financiera, salud, derechos y equidad, inversión de impacto.",
    description_en: "Provides advisory, management and implementation services for families, foundations and other philanthropic initiatives; by incubating innovative and early-stage nonprofits and donor collaboratives; and by sharing insights and producing publications on philanthropic approaches, strategies and practices. Their areas of interest include: arts & culture, climate & environment, education, financial inclusion, health, rights and equity, impact investing.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Gobernanza Global, políticas y rendición de cuentas, Fortalecimiento de Capacidades Organizacionales, Innovación Social",
      en: "Gobernanza Global, políticas y rendición de cuentas, Organizational Capacity Building, Social Innovation"
    },
    como_trabajan: {
      es: "Asesora a fundaciones y corporaciones; gestionar organizaciones sin fines de lucro innovadoras y en etapa inicial; y compartir conocimientos y aprendizajes. También actúa como patrocinador fiscal de más de 100 proyectos, proporcionando gobernanza, gestión e infraestructura operativa para respaldar sus fines benéficos.",
      en: "Advises foundations and corporations; manage innovative, early-stage nonprofits; and share insight and learning. Also serves as a fiscal sponsor for more than 100 projects, providing governance, management, and operational infrastructure to support their charitable purposes."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.rockpa.org/",
    email: "info@rockpa.org/yfelix@rockpa.org(fiscal sponsorship)/hgrady@rockpa.org/dbarraso@rockpa.org"
  },
  {
    id: 35,
    name: "Roy A. Hunt Foundation",
    description_es: "Se centra en áreas como medio ambiente, desarrollo comunitario, desarrollo internacional y prevención de la violencia juvenil, con iniciativas específicas en agricultura comunitaria, diversidad, equidad e inclusión y apoyo a los veteranos.",
    description_en: "Focuses on areas like Environment, Community Development, International Development, and Youth Violence Prevention, with specific initiatives in Community Farming, Diversity, Equity & Inclusion, and Veterans' support.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales, Educación de Calidad, Justicia Económica, Juventud",
      en: "Natural Resources Conservation, Quality Education, Economic Justice, Youth"
    },
    como_trabajan: {
      es: "Propuestas principalmente invitadas, apoyo operativo general, con montos de entre 5.000 y 10.000 dólares para la mayoría. En otras palabras, operan a través de subvenciones invitadas, iniciativas especiales y círculos de donaciones, con el objetivo de lograr un impacto significativo sin crear dependencia.",
      en: "Primarily invited proposals, general operating support, with amounts from $5k-$10k for most. In other words, they operate through invited grants, special initiatives, and Giving Circles, aiming for significant impact without creating dependency. "
    },
    impacto_financiero: {
      es: "América del Norte, Todas",
      en: "North America, All regions"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Pittsburgh, Pensilvania, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://rahuntfdn.org/",
    email: "info@rahuntfdn.org"
  },
  {
    id: 36,
    name: "The Schooner Foundation",
    description_es: "Promueve los derechos humanos a nivel mundial, centrándose en la justicia social, la salud, la educación, el medio ambiente, la paz y las oportunidades económicas. Sus áreas de enfoque incluyen: \nderechos humanos y justicia social, equidad sanitaria global, educación y empoderamiento económico, medio ambiente.",
    description_en: "Advances human rights globally, focusing on social justice, health, education, environment, peace, and economic opportunity. They focus areas include: \nhuman rights & social justice, global health equity, education & economic empowerment, environment.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Paz y Resolución de Conflictos, Justicia Económica, Salud Global",
      en: "Peace and Conflict Resolution, Economic Justice, Global Health"
    },
    como_trabajan: {
      es: "Financia excelentes organizaciones sin fines de lucro a través de subvenciones solo por invitación, apoyando el cambio sistémico a través de asociaciones estratégicas. No aceptan propuestas no solicitadas.",
      en: "Funds excellent non-profits via invitation-only grants, supporting systemic change through strategic partnerships. They do not accept unsolicited proposals.\n"
    },
    impacto_financiero: {
      es: "América del Norte, América del Sur, África Subsahariana, Oriente Medio",
      en: "North America, South America, Sub-Saharan Africa, Middle East"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Boston, Massachusetts, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.schoonercapital.com/the-foundation",
    email: " isabel@schoonerfoundation.org"
  },
  {
    id: 37,
    name: "Singing Field Foundation",
    description_es: "Proporciona subvenciones a organizaciones sin fines de lucro de EE. UU. centradas en causas ambientales, de bienestar animal y de salud, con intereses alineados con los valores de los miembros de la familia, incluida la inversión relacionada con la misión para apoyar a organizaciones como As You Sow para lograr un impacto social.",
    description_en: "Provides grants to U.S. nonprofits focused on environmental, animal welfare, and health causes, with interests aligning with family members' values, including mission-related investing to support organizations like As You Sow for social impact. ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Salud Global, Conservación de Recursos Naturales, Fortalecimiento de Capacidades Organizacionales",
      en: "Global Health, Natural Resources Conservation, Organizational Capacity Building"
    },
    como_trabajan: {
      es: "Dona en gran medida a organizaciones ambientalistas de centro izquierda. Requiere un enfoque proactivo para la concesión de subvenciones iniciando apoyo, proporcionando fondos operativos generales y utilizando la propiedad activa en sus inversiones para garantizar la alineación con su misión, como se refleja en el apoyo a organizaciones como As You Sow.",
      en: "Donates largely to left-of-center environmentalist organizations. It takes a proactive approach to grantmaking by initiating support, providing general operating funds, and using active ownership in its investments to ensure alignment with its mission, as reflected in support for organizations such as As You Sow."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Marion, Massachusetts, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "N/I/ info: https://www.influencewatch.org/non-profit/singing-field-foundation/",
    email: "N/I"
  },
  {
    id: 38,
    name: "Skyline Foundation",
    description_es: "Se centra en el cambio sistémico para un mundo más justo, financia trabajos en áreas como democracia justa, soluciones climáticas, equidad educativa y justicia natal, enfatizando la filantropía basada en la confianza y el apoyo operativo general de varios años para organizaciones de izquierda.",
    description_en: "Focuses on systemic change for a more just world, funding work in areas like Just Democracy, Climate Solutions, Education Equity, and Birth Justice, emphasizing trust-based philanthropy and multi-year general operating support for left-leaning organizations. \n",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Conservación de Recursos Naturales, Comunidades Indígenas",
      en: "Climate Justice, Natural Resources Conservation, Indigenous Communities"
    },
    como_trabajan: {
      es: "Ofrece una alta confianza en el liderazgo del beneficiario, apoyo operativo general de varios años y asociaciones a largo plazo, sin aceptar propuestas no solicitadas. Con sede en Palo Alto, California, apoyando esfuerzos locales, nacionales y globales.",
      en: "Offers a high trust in grantee leadership, multi-year general operating support, and long-term partnerships, not accepting unsolicited proposals. Based in Palo Alto, California, supporting local, national, and global efforts. \n"
    },
    impacto_financiero: {
      es: "América del Norte, Todas",
      en: "North America, All regions"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "San Francisco, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://skylinefoundation.org/",
    email: "info@skylinefoundation.org"
  },
  {
    id: 39,
    name: "The Sobrato Foundation",
    description_es: "Se centra en la educación, la movilidad económica y la justicia social para los residentes de bajos ingresos, al tiempo que apoya intereses impulsados ​​por la familia, como el clima y la democracia a nivel mundial. Invierten en organizaciones sin fines de lucro que abordan barreras sistémicas, brindan servicios esenciales y construyen infraestructura comunitaria, con el objetivo de crear una región más equitativa para todos. Nuestras principales áreas de trabajo son: movilidad económica, educación, justicia y equidad social, apoyo a organizaciones sin fines de lucro.",
    description_en: "Focuses on education, economic mobility, and social justice for low-income residents, while also supporting family-driven interests like climate and democracy globally. They invest in nonprofits addressing systemic barriers, providing essential services, and building community infrastructure, aiming to create a more equitable region for all. theur main areas of work are: economic mobility, education, social justice and equity, nonprofit support.\n",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Educación de Calidad, Ciudades Sustentables, Justicia Económica",
      en: "Quality Education, Sustainable Cities, Economic Justice"
    },
    como_trabajan: {
      es: "Trabaja en dos áreas principales: invertir en Silicon Valley y hacer avanzar a los estudiantes de inglés en California. Además, la familia dona individualmente y explora iniciativas especiales para satisfacer necesidades sociales o ambientales críticas.",
      en: "Works in two core areas: investing in Silicon Valley and advancing English Learners in California. In addition, the family gives individually and explores special initiatives to meet critical societal or environmental needs."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Mountain View, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.sobrato.org/",
    email: "grants@sobrato.org/ info@sobrato.org"
  },
  {
    id: 40,
    name: "Susan Byrd and the Women & Girls Fund",
    description_es: "Fondo asesorado por donantes en la Fundación Tides, una organización benéfica pública exenta de impuestos 501(c)(3). A través de este mecanismo, apoya a los beneficiarios a través de tres áreas temáticas principales: \nFondo de Liderazgo para Mujeres y Niñas, Fondo de Gestión Ambiental, Fondo de Bienestar Comunitario.",
    description_en: "Donor Advised Fund at the Tides Foundation, a 501(c)(3) tax-exempt public charity. Through this mechanism, she supports grantees via three main thematic areas: \nWomen & Girls Leadership Fund, Environmental Stewardship Fund, Community Wellness Fund.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia de Género, Derechos de las Infancias, Juventud",
      en: "Gender Justice, Children's Rights, Youth"
    },
    como_trabajan: {
      es: "Trabajan a través de un modelo de fondo asesorado por donantes, que funciona como una cuenta de ahorros benéfica administrada por una organización patrocinadora como la Fundación Tides. Los donantes aportan activos y reciben una deducción fiscal inmediata, mientras que los fondos se invierten y crecen libres de impuestos con el tiempo. Luego, los donantes recomiendan subvenciones a organizaciones sin fines de lucro elegibles, y el patrocinador supervisa y distribuye los fondos. Este enfoque ofrece flexibilidad, eficiencia fiscal y la capacidad de programar las donaciones estratégicamente mientras se apoyan causas benéficas.",
      en: "They work through a donor-advised fund model, which functions like a charitable savings account managed by a sponsoring organization such as the Tides Foundation. Donors contribute assets and receive an immediate tax deduction, while the funds are invested and grow tax-free over time. Donors then recommend grants to eligible nonprofits, with the sponsor overseeing and distributing the funds. This approach offers flexibility, tax efficiency, and the ability to time donations strategically while supporting charitable causes."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "San Antonio, Texas, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "N/I",
    email: "N/I"
  },
  {
    id: 41,
    name: "Swift Foundation",
    description_es: "Apoya el trabajo liderado por indígenas que protege la diversidad biológica y cultural mediante el fortalecimiento de los derechos sobre la tierra, la restauración de ecosistemas y el avance de las prácticas agroecológicas. Operando con un enfoque de “ojos abiertos” basado en la confianza y basado en los valores indígenas, empoderan a los administradores locales en todo el mundo para restaurar paisajes, salvaguardar lugares sagrados y preservar cultivos tradicionales. Se centran en cómo honrar el conocimiento regenerativo ancestral de la tierra, fortalecer el liderazgo y la autodeterminación indígenas y catalizar una transferencia de buen espíritu y pensamiento.",
    description_en: "Supports Indigenous-led work that protects both biological and cultural diversity by strengthening land rights, restoring ecosystems, and advancing agroecological practices. Operating with a trust-based, “eyes open” approach grounded in Indigenous values, they empower local stewards worldwide to restore landscapes, safeguard sacred places, and preserve traditional crops. They foces on: how to honor ancestral regenerative knowledge of the land, strengthen Indigenous leadership and self-determination, and catalyze a transference of good spirit and thought.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Comunidades Indígenas, Soberanía Alimentaria, Conservación de Recursos Naturales, Justicia Climática",
      en: "Indigenous Communities, Food Sovereignty, Natural Resources Conservation, Climate Justice"
    },
    como_trabajan: {
      es: "Operan a través de un enfoque de otorgamiento de subvenciones arraigado en los valores indígenas, priorizando el liderazgo local y la toma de decisiones comunitaria mientras trabajan intencionalmente fuera de las estructuras filantrópicas tradicionales. El financiamiento se dirige a organizaciones de base local e iniciativas lideradas por nativos, particularmente en regiones con fondos insuficientes. Como fundación de reducción de gastos, están distribuyendo activamente sus activos restantes para diciembre de 2028, aumentando la concesión de subvenciones ahora para fortalecer el impacto a largo plazo y apoyar un futuro más resiliente para sus socios.",
      en: "They operate through a grantmaking approach rooted in Indigenous values, prioritizing local leadership and community decision-making while intentionally working outside traditional philanthropic structures. Funding is directed toward grassroots, place-based organizations and Native-led initiatives, particularly in underfunded regions. As a spend-down foundation, they are actively distributing their remaining assets by December 2028, increasing grantmaking now to strengthen long-term impact and support a more resilient future for their partners."
    },
    impacto_financiero: {
      es: "América del Norte, América del Sur",
      en: "North America, South America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Los Olivos, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.swiftfoundation.org/",
    email: "N/I"
  },
  {
    id: 42,
    name: "The Tarbell Family Foundation",
    description_es: "Fundación privada que apoya a varias organizaciones de centro-izquierda, educativas y de ayuda general. La mayoría de sus subvenciones son de $5.000 o menos, pero ocasionalmente se distribuirá hasta $60.000. Estas grandes subvenciones se otorgan principalmente a instituciones educativas, particularmente en el noroeste de Estados Unidos, como la Universidad de Oregon, la Universidad de Puget Sound y la Universidad Estatal de Portland.",
    description_en: "Fundación privada que apoya a varias organizaciones de centro-izquierda, educativas y de ayuda general. La mayoría de sus subvenciones son de $5.000 o menos, pero ocasionalmente distribuirá hasta $60.000. Estas grandes subvenciones se otorgan principalmente a instituciones educativas, particularmente en el noroeste de Estados Unidos, como la Universidad de Oregon, la Universidad de Puget Sound y la Universidad Estatal de Portland",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales, Salud Global, Educación de Calidad",
      en: "Natural Resources Conservation, Global Health, Quality Education"
    },
    como_trabajan: {
      es: "Aunque la fundación no especifica áreas temáticas particulares de enfoque, ha financiado proyectos en una amplia gama de ciudades de los Estados Unidos, incluidos importantes centros urbanos como Nueva York, Los Ángeles y Chicago, así como comunidades más pequeñas. La fundación apoya iniciativas en numerosos estados, como California, Nueva York y Texas.",
      en: "Although the foundation does not specify particular subject areas of focus, it has funded projects in a wide range of cities across the United States, including major urban centers like New York, Los Angeles, and Chicago, as well as smaller communities. The foundation supports initiatives in numerous states, such as California, New York, and Texas. "
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Boston, Massachusetts, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "N/I",
    email: "N/I"
  },
  {
    id: 43,
    name: "Tides Foundation",
    description_es: "Centrándose en lograr la equidad y la justicia, se asocian con líderes y organizaciones de comunidades a las que se les niega el poder brindando apoyo operativo integrado, otorgamiento de subvenciones y desarrollo de capacidades para promover la justicia.",
    description_en: "Focusing on entering equity and justice, they partner with leaders and organizations from communities denied power by providing integrated operational, grantmaking, and capacity-building support to advance justice.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Democracia, Justicia Racial, Justicia Climática, Derechos Digitales, Justicia de Género",
      en: "Democracy, Racial Justice, Climate Justice, Digital Rights, Gender Justice"
    },
    como_trabajan: {
      es: "No aceptan subvenciones no solicitadas, pero trabajan con socios recomendados para transferir recursos a comunidades a las que históricamente se les ha negado el poder.  Promueven la justicia social y la equidad apoyando a organizaciones dirigidas y sirviendo a comunidades que enfrentan barreras sistémicas. A través de la concesión de subvenciones, gestionan fondos asesorados por donantes, fondos colectivos y patrocinio fiscal para ayudar a los donantes y las fundaciones a dirigir recursos hacia el trabajo centrado en la justicia. Además, brindan apoyo operativo, de otorgamiento de subvenciones y de desarrollo de capacidades, actuando como un socio a largo plazo para fortalecer el impacto de las organizaciones de justicia social.",
      en: "They don't accept unsolicited grants but work with recommended partners to shift resources to communities historically denied power.  They advance social justice and equity by supporting organizations led by and serving communities facing systemic barriers. Through grantmaking, they manage donor-advised funds, collective funds, and fiscal sponsorship to help donors and foundations direct resources toward justice-focused work. In addition, they provide operational, grantmaking, and capacity-building support, acting as a long-term partner to strengthen the impact of social justice organizations."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "San Francisco, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.tides.org/",
    email: "grants@tides.org/partnerships@tides.org"
  },
  {
    id: 44,
    name: "Tsadik Foundation",
    description_es: "Se centra en la justicia social apoyando a comunidades desfavorecidas en todo el mundo a través del trabajo en derechos humanos, desarrollo económico e inclusión climática, al mismo tiempo que promueve la cultura y la educación judías. Avanza en esta misión a través de una combinación de subvenciones directas, inversiones de impacto en empresas impulsadas por una misión y asociaciones que empoderan a las poblaciones vulnerables, impulsan soluciones climáticas para comunidades en riesgo y fortalecen la educación y el pluralismo judíos, particularmente en Israel.",
    description_en: "Focuses on social justice by supporting disadvantaged communities worldwide through work in human rights, economic development, and climate inclusion, while also promoting Jewish culture and education. It advances this mission through a combination of direct grants, impact investing in mission-driven companies, and partnerships that empower vulnerable populations, drive climate solutions for at-risk communities, and strengthen Jewish education and pluralism, particularly in Israel.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Económica, Salud Global, Educación de Calidad",
      en: "Economic Justice, Global Health, Quality Education"
    },
    como_trabajan: {
      es: "Operan a través de una combinación de filantropía directa, inversión de impacto y asociaciones estratégicas. Esto incluye la concesión de subvenciones para organizaciones que prestan servicios a comunidades desfavorecidas, inversiones en empresas de impulso social que utilizan tecnología para promover soluciones de salud, educación y clima, y ​​colaboraciones con socios para ampliar el impacto para grupos como las personas con discapacidad.",
      en: "They operate through a mix of direct philanthropy, impact investing, and strategic partnerships. This includes grantmaking for organizations serving disadvantaged communities, investments in socially driven ventures using technology to advance health, education, and climate solutions, and collaborations with partners to expand impact for groups such as people with disabilities."
    },
    impacto_financiero: {
      es: "América del Norte, Europa del Este",
      en: "North America, Eastern Europe"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Miami, Florida, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://tsadik.org/",
    email: "tsadikfoundation@gmail.com"
  },
  {
    id: 45,
    name: "Underdog Foundation",
    description_es: "Obras para satisfacer necesidades comunitarias y ambientales que no pueden satisfacerse mediante simples inversiones. Las áreas de interés de la Fundación son: Medio Ambiente y Conservación, Inversión Comunitaria, Emprendimiento de Mujeres, Inversión Comunitaria Internacional y Desarrollo Comunitario.",
    description_en: "Works to meet community and environmental needs the cannot be met through simple investments. The interest areas of the Foundation are: Environment and Conservation, Community Investment, Women's Entrepreneurship, International Community Investment, and Community Development. ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Económica, Derechos de Migrantes y Refugiados, Movimientos Ciudadanos",
      en: "Economic Justice, Rights of Migrants and Refugees, Citizen Movements"
    },
    como_trabajan: {
      es: "Su trabajo incluye la concesión de subvenciones específicas, a menudo con la flexibilidad recomendada por los donantes; inversión comunitaria que proporciona capital a grupos desatendidos utilizando modelos de financiación innovadores; y asistencia técnica práctica en áreas como finanzas, operaciones y estrategia. La Fundación logra su misión a través de subvenciones, inversiones comunitarias, asistencia técnica y asociaciones estratégicas sin fines de lucro.",
      en: "Their work includes targeted grantmaking, often with donor-advised flexibility; community investment that provides capital to underserved groups using innovative financing models; and hands-on technical assistance in areas such as finance, operations, and strategy. The Foundation achieves its mission through grantmaking, community investments, technical assistance and strategic not-for-profit partnerships."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Minneapolis, Minnesota, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "http://underdogventures.com/underdog-foundation",
    email: "fortheunderdog24@gmail.com/mike.pr322@hotmail.com"
  },
  {
    id: 46,
    name: "Wallace Genetic Foundation",
    description_es: "Trabaja a nivel mundial financiando organizaciones centradas en la agricultura sostenible, la conservación de los recursos naturales, la biodiversidad, el agua potable, la reducción de toxinas ambientales y el cambio climático.",
    description_en: "Works globally by funding organizations focused on sustainable agriculture, natural resource conservation, biodiversity, clean water, reducing environmental toxins, and climate change.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Soberanía Alimentaria, Conservación de Recursos Naturales, Justicia Climática",
      en: "Food Sovereignty, Natural Resources Conservation, Climate Justice"
    },
    como_trabajan: {
      es: "Ya no aceptan propuestas no solicitadas. Trabajan financiando una amplia gama de organizaciones en contextos nacionales e internacionales, apoyando la conservación local y los sistemas alimentarios, el acceso global al agua y la energía, y el periodismo de investigación, políticas y ambiental. A través de esta combinación, abordan desafíos ambientales y de sostenibilidad tanto a nivel comunitario como global.",
      en: "They no longer accept unsolicited proposals. They work by funding a diverse range of organizations across domestic and international contexts, supporting local conservation and food systems, global water and energy access, and research, policy, and environmental journalism. Through this mix, they address environmental and sustainability challenges at both community and global levels.\n"
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Washington D.C., EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.wallacegenetic.org/",
    email: "wgfdn@wallacegenetic.org/info@wallacegenetic.org"
  },
  {
    id: 47,
    name: "The Walton Family Foundation",
    description_es: "Trabaja globalmente en educación y medio ambiente, pero tiene un fuerte enfoque regional en el noroeste de Arkansas y el delta de Arkansas-Mississippi, además de esfuerzos nacionales en ríos y océanos, con oficinas en Bentonville, DC, Denver y Jersey City. Su trabajo abarca mejorar la educación K-12, proteger ríos (Cuencas de Colorado, Mississippi) y océanos, y fomentar oportunidades económicas y educativas regionales, a menudo asociándose con gobiernos y organizaciones sin fines de lucro para lograr cambios a largo plazo.",
    description_en: "Works globally on education and environment but has a strong regional focus in Northwest Arkansas & the Arkansas-Mississippi Delta, plus national efforts in rivers/oceans, with offices in Bentonville, DC, Denver, and Jersey City. Their work spans improving K-12 education, protecting rivers (Colorado, Mississippi Basins) and oceans, and fostering regional economic/educational opportunity, often partnering with governments and non-profits for long-term change. ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales, Educación de Calidad, Ciudades Sustentables",
      en: "Natural Resources Conservation, Quality Education, Sustainable Cities"
    },
    como_trabajan: {
      es: "Operan como una fundación multigeneracional dirigida por familias que colabora con gobiernos, organizaciones sin fines de lucro y comunidades para impulsar un cambio sistémico. Su enfoque prioriza el impacto sostenible a largo plazo sobre las soluciones a corto plazo.",
      en: "They operate as a multigenerational, family-led foundation that collaborates with governments, nonprofits, and communities to drive systemic change. Their approach prioritizes long-term, sustainable impact over short-term solutions."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Bentonville, Arkansas, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.waltonfamilyfoundation.org/",
    email: "info@wffmail.com"
  },
  {
    id: 48,
    name: "Weissman Family Foundation",
    description_es: "Organización sin fines de lucro que otorga subvenciones con sede en el estado de Nueva York. Dona a organizaciones involucradas en la defensa del centro izquierda en temas relacionados con el ambientalismo, la justicia penal, la atención médica, la vivienda, la votación, la inmigración, los medios de comunicación y las artes. La Weissman Family Foundation otorga subvenciones para apoyar bibliotecas, educación y otras causas benéficas.",
    description_en: "Grantmaking nonprofit based in New York state. It donates to organizations involved in left-of-center advocacy on issues relating to environmentalism, criminal justice, health care, housing, voting, immigration, media, and the arts. The Weissman Family Foundation makes grants to support libraries, education, and other charitable causes.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Educación de Calidad, Justicia Económica, Salud Global",
      en: "Quality Education, Economic Justice, Global Health"
    },
    como_trabajan: {
      es: "Operan principalmente como una fundación impulsada por la inversión, generando la mayoría de sus recursos a través de ingresos por inversiones y la venta estratégica de activos no inventariables en lugar de subvenciones o contribuciones de fuentes externas. Su modelo de financiación se basa en la gestión y reasignación de activos para aumentar los ingresos totales, que luego se utilizan para respaldar las actividades relacionadas con su misión.",
      en: "They operate primarily as an investment-driven foundation, generating the majority of their resources through investment income and the strategic sale of non-inventory assets rather than through grants or contributions from external sources. Their funding model relies on managing and reallocating assets to grow total revenues, which are then used to support their mission-related activities."
    },
    impacto_financiero: {
      es: "América del Norte, Todas",
      en: "North America, All regions"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Stamford, Connecticut, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "N/I: https://www.influencewatch.org/non-profit/weissman-family-foundation/",
    email: "N/I (inactiva)"
  },
  {
    id: 49,
    name: "Wellspring Philanthropic Fund",
    description_es: "Apoyan los esfuerzos de derechos humanos y justicia social en los EE. UU., particularmente en la ciudad de Nueva York y Washington, DC, así como en África y América Central y del Sur. Su financiación prioriza la justicia racial, los derechos LGBTQI, la equidad económica y la igualdad de género, con un enfoque en organizaciones que abordan las desigualdades sistémicas, fortalecen la participación cívica y generan poder entre las comunidades marginadas. La fundación planea concluir su concesión de subvenciones para 2028. tres categorías principales: condiciones propicias, temáticas seleccionadas oportunistas o receptivas. Las áreas programáticas transversales son: justicia racial, justicia de género, justicia económica.",
    description_en: "They support human rights and social justice efforts in the U.S. particularly in New York City and Washington, DC, as well as in Africa and Central and South America. Their funding prioritizes racial justice, LGBTQI rights, economic equity, and gender equality, with a focus on organizations that address systemic inequities, strengthen civic participation, and build power among marginalized communities. The foundation plans to conclude its grantmaking by 2028. three main categories: enabling conditions, opportunistic or responsive, curated thematic. The cross-programatic areas are: racial justice, gender justice, economic justice.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia de Género, Derechos de las Personas con Discapacidad, Gobernanza Global, políticas y rendición de cuentas, Justicia Racial",
      en: "Gender Justice, Rights of Persons with Disabilities, Gobernanza Global, políticas y rendición de cuentas, Racial Justice"
    },
    como_trabajan: {
      es: "Trabajan como un donante global que fortalece los movimientos sociales apoyando la promoción y la organización, responden con flexibilidad en momentos críticos e invierten en iniciativas enfocadas vinculadas a resultados específicos, incluidas las protecciones internacionales de derechos humanos. Más allá de las subvenciones directas, brindan liderazgo filantrópico y apoyo al desarrollo de capacidades para empoderar a las comunidades marginadas y fortalecer el impacto a largo plazo.",
      en: "They work as a global grantmaker that strengthens social movements by supporting advocacy and organizing, respond flexibly at critical moments, and invest in focused initiatives tied to specific outcomes, including international human rights protections. Beyond direct grants, they provide philanthropic leadership and capacity-building support to empower marginalized communities and strengthen long-term impact."
    },
    impacto_financiero: {
      es: "América del Norte, América Central, América del Sur, África subsahariana, África del norte",
      en: "North America, Central America, South America, Sub-Saharan Africa, North Africa"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.wpfund.org/",
    email: "info@wpfund.org"
  },
  {
    id: 50,
    name: "WestWind Foundation",
    description_es: "Se centra en financiar organizaciones que trabajan en temas ambientales y de salud pública. Se dedican a promover un mundo más saludable y sostenible.",
    description_en: "Focuses on funding organizations that work on environmental and public health issues. They are dedicated to promoting a healthier and sustainable world.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Justicia de Género, Salud Global",
      en: "Climate Justice, Gender Justice, Global Health"
    },
    como_trabajan: {
      es: "Trabajan principalmente a través de la concesión de subvenciones, financiando organizaciones sin fines de lucro centradas en la protección del medio ambiente, la salud reproductiva y el acceso de los jóvenes a una educación sexual precisa. Su enfoque enfatiza las asociaciones y la colaboración con organizaciones.",
      en: "They work primarily through grantmaking, funding nonprofit organizations focused on environmental protection, reproductive health, and youth access to accurate sexuality education. Their approach emphasizes partnerships, collaborating with organizations"
    },
    impacto_financiero: {
      es: "América del Norte, América Central, América del Sur",
      en: "North America, Central America, South America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Charlottesville, Virginia, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.westwindfoundation.org/",
    email: "info@westwindfoundation.org"
  },
  {
    id: 51,
    name: "White Cedar Fund",
    description_es: "Se centra en apoyar iniciativas en arte y cultura, medio ambiente y actividades religiosas, particularmente dentro del cristianismo y el catolicismo.",
    description_en: "Focuses on supporting initiatives in arts and culture, the environment, and religious activities, particularly within Christianity and Catholicism. ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales, Justicia Climática, Comunidades Indígenas",
      en: "Natural Resources Conservation, Climate Justice, Indigenous Communities"
    },
    como_trabajan: {
      es: "N/I",
      en: "N/I"
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "N/I:https://www.grantable.co/search/funders/profile/the-white-cedar-fund-us-foundation-205717546",
    email: "N/I"
  },
  {
    id: 52,
    name: "William H. Donner Foundation",
    description_es: "Apoya a grupos de expertos, escuelas autónomas, investigaciones universitarias (como en McGill) y organizaciones como el Acuario de la Bahía de Monterey. Las áreas temáticas son: Educación, Medio Ambiente/Vida Silvestre, Servicios Humanos, Políticas Públicas, Arte y Cultura, Relaciones Internacionales, Política Alimentaria/Salud y Liderazgo Indígena Americano.",
    description_en: "Supports think tanks, charter schools, university research (like at McGill), and organizations such as the Monterey Bay Aquarium. Subject areas are: Education, Environment/Wildlife, Human Services, Public Policy, Arts & Culture, International Relations, Food Policy/Health, and American Indian Leadership.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Gobernanza Global, políticas y rendición de cuentas, Educación de Calidad, Conservación de Recursos Naturales",
      en: "Gobernanza Global, políticas y rendición de cuentas, Quality Education, Natural Resources Conservation"
    },
    como_trabajan: {
      es: "Opera a través de un modelo de concesión de subvenciones sólo por invitación, seleccionando organizaciones a través de redes de personal y asesores en lugar de solicitudes abiertas. Enfatiza las donaciones estratégicas a proyectos con objetivos claros y enfoques innovadores.",
      en: "Operates through an invitation-only grantmaking model, selecting organizations through staff and advisor networks rather than open applications. Emphasizes strategic giving to projects with clear objectives and innovative approaches. "
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://whdonner.org/",
    email: "N/I"
  },
  {
    id: 53,
    name: "Woka Foundation",
    description_es: "Fomenta un mundo justo a través de la vitalidad ambiental. Financia la acción climática, la agricultura regenerativa, la equidad de género y la educación, con el objetivo de crear un mundo justo apoyando soluciones autosostenibles y responsabilizando a los contaminadores, operando solo por invitación con áreas de enfoque: cambio climático (combustibles fósiles, energía limpia), agricultura regenerativa, equidad de género y educación.",
    description_en: "Fosters a just world through environmental vitality. Funds climate action, regenerative agriculture, gender equity, and education, aiming to create a just world by supporting self-sustaining solutions and holding polluters accountable, operating via invitation only with focus areas: Climate change (fossil fuels, clean energy), regenerative agriculture, gender equity, and education.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales, Justicia Económica, Fortalecimiento de Capacidades Organizacionales",
      en: "Natural Resources Conservation, Economic Justice, Organizational Capacity Building"
    },
    como_trabajan: {
      es: "Opera a través de un enfoque de concesión de subvenciones solo por invitación, financiando organizaciones centradas en la acción climática, la agricultura sostenible y el empoderamiento de mujeres y niñas en soluciones climáticas. Su trabajo se guía por principios de rendición de cuentas para las industrias de combustibles fósiles, educación climática y distribución equitativa de beneficios.",
      en: "Operates through invitation-only grantmaking approach, funding organizations focused on climate action, sustainable agriculture, and empowering women and girls in climate solutions. Their work is guided by principles of accountability for fossil fuel industries, climate education, and equitable sharing of benefits."
    },
    impacto_financiero: {
      es: "América del Norte, Todas",
      en: "North America, All regions"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "San Francisco, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://wokafoundation.org/",
    email: "info@wokafoundation.org"
  },
  {
    id: 54,
    name: "The 11th Hour Project",
    description_es: "Apoya los esfuerzos globales en energía renovable, sistemas alimentarios resilientes, océanos saludables y derechos humanos/indígenas, financiando grupos de base e iniciativas centradas en la justicia climática, la agricultura sostenible y la gestión ambiental para crear una relación humana más responsable con los recursos de la Tierra.  Áreas de enfoque: Clima y energía, sistemas alimentarios, comunidades indígenas, derechos humanos y ambientales, salud de los océanos.",
    description_en: "Supports global efforts in renewable energy, resilient food systems, healthy oceans, and human/Indigenous rights, funding grassroots groups and initiatives focused on climate justice, sustainable agriculture, and environmental stewardship to create a more responsible human relationship with Earth's resources.  Focus areas: Climate and energy, food systems, indigenous communities, human & environmental rights, ocean health.\n",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Transición Energética, Soberanía Alimentaria, Derechos Digitales",
      en: "Climate Justice, Energy Transition, Food Sovereignty, Digital Rights"
    },
    como_trabajan: {
      es: "Trabajan principalmente a través de la concesión de subvenciones, brindando un apoyo sustancial a organizaciones sin fines de lucro y comunitarias en todo el mundo. Su enfoque es interseccional, integra la equidad y la inclusión en los esfuerzos climáticos y energéticos, y es impulsado por la comunidad, priorizando iniciativas autodeterminadas arraigadas en el conocimiento indígena y el liderazgo local.",
      en: "They work primarily through grantmaking, providing substantial support to nonprofits and community-based organizations worldwide. Their approach is intersectional, integrating equity and inclusion into climate and energy efforts, and community-driven, prioritizing self-determined initiatives rooted in Indigenous knowledge and local leadership."
    },
    impacto_financiero: {
      es: "América del Norte, Todas",
      en: "North America, All regions"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Palo Alto, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.11thhourproject.org/",
    email: " info@11thhourproject.org"
  },
  {
    id: 55,
    name: "American Jewish World Service",
    description_es: "Trabaja a nivel mundial para poner fin a la pobreza y promover los derechos humanos, centrándose en las bases. Defensores de una política exterior estadounidense progresista desde su base en Estados Unidos. Apoyan a organizaciones locales que luchan por la justicia, los derechos de las mujeres, los derechos LGBTQ+, la acción climática y las libertades democráticas.",
    description_en: "Works globally to end poverty and promote human rights, focusing on grassroots. Advocates for progressive U.S. foreign policy from its base in the United States. They support local organizations fighting for justice, women's rights, LGBTQ+ rights, climate action, and democratic freedoms  ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia de Género, LGTBIQ+, Justicia Climática, Paz y Resolución de Conflictos",
      en: "Gender Justice, LGBTIQ+, Climate Justice, Peace and Conflict Resolution"
    },
    como_trabajan: {
      es: "Trabajan mediante una combinación de concesión de subvenciones, promoción y creación de movimientos. Al financiar cientos de organizaciones de base, empoderan a los líderes locales para que desarrollen soluciones impulsadas por la comunidad. También promueven la promoción en Estados Unidos al conectar a activistas con formuladores de políticas para promover políticas alineadas con los derechos humanos.",
      en: "They work through a combination of grantmaking, advocacy, and movement building. By funding hundreds of grassroots organizations, they empower local leaders to develop community-driven solutions. They also advance U.S. advocacy by connecting activists with policymakers to promote human rights–aligned policies."
    },
    impacto_financiero: {
      es: "América del Norte, América Central, América del Sur, Asia Central, África subsahariana, África del norte",
      en: "North America, Central America, South America, Central Asia, Sub-Saharan Africa, North Africa"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://ajws.org/",
    email: "ajws@ajws.org/nfo@ajws.org"
  },
  {
    id: 56,
    name: "The Arcus Foundation",
    description_es: "Fomenta un mundo donde las personas y la naturaleza prosperan, principalmente a través de dos áreas clave: la justicia social LGBTQ+, la promoción de los derechos, la aceptación y la seguridad de las personas LGBTQ+ a nivel mundial. Se centra en comunidades marginadas y paisajes de conservación críticos.",
    description_en: "Fosters a world where people and nature thrive, primarily through two key areas: LGBTQ+ Social Justice, advancing rights, acceptance, and safety for LGBTQ+ individuals globally. Focuses on marginalized communities and critical conservation landscapes. ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "LGTBIQ+, Conservación de Recursos Naturales (Grandes Simios), Justicia de Género",
      en: "LGBTIQ+, Conservación de Recursos Naturales (Grandes Simios), Gender Justice"
    },
    como_trabajan: {
      es: "Apoya a las organizaciones a través de subvenciones, a menudo trabajando con expertos y defensores para lograr un impacto, con un enfoque en la estrategia a largo plazo y la justicia social/ambiental.",
      en: "Supports organizations through grants, often working with experts and advocates to achieve impact, with a focus on long-term strategy and social/environmental justice. "
    },
    impacto_financiero: {
      es: "América del Norte, América Central, América del Sur, África del norte",
      en: "North America, Central America, South America, North Africa"
    },
    country: "Reino Unido)",
    country_es: "Reino Unido)",
    ciudad: "Nueva York, EE. UU. (con sede en Cambridge, Reino Unido)",
    continent: "desconocido",
    latitude: 0,
    longitude: 0,
    website: "https://www.arcusfoundation.org/",
    email: "contact@arcusfoundation.org"
  },
  {
    id: 57,
    name: "The Casey & Family Foundation",
    description_es: "Apoya a organizaciones, académicos, líderes e iniciativas enfocadas en cambiar el equilibrio de poder hacia comunidades, familias e individuos que continúan excluidos de moldear la sociedad y de compartir sus recompensas y libertades. Se centra en: desarrollo de liderazgo, comunidad en crecimiento y educación.",
    description_en: "Supports organizations, scholars, leaders, and initiatives focused on shifting the balance of power toward communities, families, and individuals who continue to be excluded from shaping society and from sharing in its rewards and freedoms. Focuses on: leadership development, growing community, and education.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Derechos de las Infancias, Protección de la Niñez, Educación de Calidad",
      en: "Children's Rights, Child Protection, Quality Education"
    },
    como_trabajan: {
      es: "Organización que otorga subvenciones solo por invitación. Proporciona subvenciones operativas generales a líderes de organizaciones e iniciativas con el potencial de cambiar el equilibrio de poder en sus comunidades.",
      en: "Invitation-only grantmaking organization. Provides general operating grants to leaders of organizations and initiatives with the potential to shift the balance of power in their communities."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Seattle, Washington, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.caseygrants.org/",
    email: "info@caseygrants.org"
  },
  {
    id: 58,
    name: "Cathy and Grayson Kamm",
    description_es: "Énfasis en el bienestar y la educación de los niños a través de instituciones como el Museo Infantil Glazer.",
    description_en: "Emphasis on children's well-being and education through institutions like the Glazer Children's Museum. ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Educación de Calidad, Salud Global, Innovación Social",
      en: "Quality Education, Global Health, Social Innovation"
    },
    como_trabajan: {
      es: "Abogar por programas de neurodiversidad y participación comunitaria, demostrando su trabajo en el área local de Tampa Bay.",
      en: "Advocating for neurodiversity programs and community engagement, demonstrating their work in the local Tampa Bay area. "
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Tampa, Florida, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "N/I",
    email: "N/I"
  },
  {
    id: 59,
    name: "Conservation, Food & Health Foundation",
    description_es: "Busca proteger el medio ambiente, mejorar la producción de alimentos y promover la salud pública.  Las áreas de enfoque incluyen: conservación, alimentación y salud.",
    description_en: "Seeks to protect the environment, improve food production, and promote public health.  Focus areas include: conservation, food, health.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales, Soberanía Alimentaria, Salud Global",
      en: "Natural Resources Conservation, Food Sovereignty, Global Health"
    },
    como_trabajan: {
      es: "Trabajan a través de un proceso estructurado de concesión de subvenciones basado en proyectos que apoya a organizaciones locales y regionales, así como a organizaciones en países de mayores ingresos que se asocian con grupos locales en estas regiones. Las subvenciones suelen otorgarse por uno o dos años, con mayor frecuencia en el rango medio de financiación, con requisitos claros de presentación de informes diseñados para ser informativos pero no onerosos. Las decisiones de subvención se toman dos veces al año a través de un proceso de solicitud competitivo.",
      en: "They work through a structured, project-based grantmaking process that supports local and regional organizations, as well as organizations in higher-income countries partnering with local groups in these regions. Grants are typically awarded for one or two years, most often in the mid-range of funding, with clear reporting requirements designed to be informative but not burdensome. Grant decisions are made twice annually through a competitive application process"
    },
    impacto_financiero: {
      es: " América del Sur, Asia Central, África subsahariana, África del norte, Asia Oriental",
      en: "South America, Central Asia, Sub-Saharan Africa, North Africa, East Asia"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Boston, Massachusetts, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://cfhfoundation.grantsmanagement08.com/",
    email: "pzinn@gmafoundations.com/amcintosh@gmafoundations.com"
  },
  {
    id: 60,
    name: "Godley Family Foundation",
    description_es: "Se centra en abordar desafíos globales interconectados en la intersección de la salud, el cambio climático, la equidad y la justicia. Guiado por los Objetivos de Desarrollo Sostenible de las Naciones Unidas, se asocia con agentes de cambio globales para impulsar soluciones sistémicas que mejoren vidas y fortalezcan a las comunidades. Sus principales prioridades de financiación incluyen la salud global, la acción climática, las mujeres y las niñas y el apoyo regional en Rhode Island y Nueva Inglaterra.",
    description_en: "Focuses on addressing interconnected global challenges at the intersection of health, climate change, equity, and justice. Guided by the UN Sustainable Development Goals, it partners with global changemakers to drive systemic solutions that improve lives and strengthen communities. Its primary funding priorities include global health, climate action, women and girls, and regional support in Rhode Island and New England.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Salud Global, Justicia Climática, Innovación Social",
      en: "Global Health, Climate Justice, Social Innovation"
    },
    como_trabajan: {
      es: "No aceptan propuestas no solicitadas. Creen en apoyar la experiencia local, construir sistemas sólidos y empoderar a las poblaciones vulnerables. Ofrecen iniciativas de financiación específicas (ver página web).",
      en: "They do not accept unsolicited proposals. They believe in supporting local expertise, building strong systems, and empowering vulnerable populations. They offer specific funding initiatives (see web page)."
    },
    impacto_financiero: {
      es: "América del Norte, África subsahariana",
      en: "North America, Sub-Saharan Africa"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Boston, Massachusetts, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://godleyfamilyfoundation.org/",
    email: "info@godleyfamilyfoundation.org"
  },
  {
    id: 61,
    name: "Grassroots International",
    description_es: "Empodera a los movimientos en el Sur Global y Estados Unidos para defender los derechos a la tierra, el agua y la alimentación como derechos humanos, apuntando al cambio sistémico, la justicia ecológica y la liberación a través de la solidaridad y la financiación. Áreas de enfoque: Tierra, agua, alimentos, semillas y la tierra, abordando las causas profundas de la pobreza y el cambio climático.",
    description_en: "Empowers movements in the Global South and U.S. to defend rights to land, water, and food as human rights, aiming for systemic change, ecological justice, and liberation through solidarity and funding. Focus areas: Land, water, food, seeds, and the earth, addressing root causes of poverty and climate change.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Soberanía Alimentaria, Justicia Climática, Comunidades Indígenas, Movimientos Ciudadanos",
      en: "Food Sovereignty, Climate Justice, Indigenous Communities, Citizen Movements"
    },
    como_trabajan: {
      es: "Proporcionan apoyo financiero directo (subvenciones) a movimientos y organizaciones que luchan por los derechos a la tierra, la soberanía alimentaria y la justicia ambiental. También tienen iniciativas de financiación específicas.",
      en: "They provide direct financial support (grants) to movements and organizations fighting for land rights, food sovereignty, and environmental justice. They also have specific funding initiatives."
    },
    impacto_financiero: {
      es: "América del Norte, América del Sur, Oriente Medio, Asia Oriental",
      en: "North America, South America, Middle East, East Asia"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Boston, Massachusetts, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://grassrootsonline.org/es/",
    email: "josephine@grassrootsonline.org"
  },
  {
    id: 62,
    name: "IKEA Foundation",
    description_es: "Socios para aliviar la pobreza y combatir el cambio climático, centrándose en las comunidades vulnerables y apoyando a los refugiados. Sus proyectos tienen como objetivo el acceso a energías renovables, la agricultura sostenible (como One Acre Fund, SELCO Foundation) y la mejora de los medios de vida de familias y refugiados. Aborda los problemas climáticos y de pobreza en las economías en desarrollo, creando un cambio sistémico a través de socios locales para empoderar a las familias y comunidades.",
    description_en: "Partners to alleviate poverty and combat climate change, focusing on vulnerable communities, and supporting refugees. Their projects target renewable energy access, sustainable farming (like One Acre Fund, SELCO Foundation), and improving livelihoods for families and refugees. Tackles poverty and climate issues in developing economies, creating systemic change through local partners to empower families and communities. ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Justicia Económica, Ciudades Sustentables, Derechos de Migrantes y Refugiados",
      en: "Climate Justice, Economic Justice, Sustainable Cities, Rights of Migrants and Refugees"
    },
    como_trabajan: {
      es: "Proporciona subvenciones (no ayuda directa a individuos) a socios experimentados, generando recursos a partir del éxito de IKEA. Se centra en el empoderamiento y tiene como objetivo empoderar a las familias para que obtengan ingresos y desarrollen la autosuficiencia, no solo para recibir ayuda.",
      en: "Provides grants (not direct aid to individuals) to experienced partners, generating resources from IKEA's success. Focuses on empowerment, aiming to empower families to earn income and build self-sufficiency, not just receive aid."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "Netherlands",
    country_es: "Países Bajos",
    ciudad: "Leiden, Países Bajos",
    continent: "europa",
    latitude: 52.3676,
    longitude: 4.9041,
    website: "https://www.ikeafoundation.org",
    email: "info@ikeafoundation.org"
  },
  {
    id: 63,
    name: "Janis Comb",
    description_es: "Se centra en apoyar a jóvenes desfavorecidos, principalmente en Estados Unidos, con fuerte presencia en comunidades como Nueva York. Su trabajo se centra en proporcionar recursos, tutoría y programas de desarrollo que creen oportunidades para los jóvenes, a menudo conectados con los sectores de la música, el entretenimiento y los negocios.",
    description_en: "Focuses on supporting underprivileged youth, primarily in the United States, with a strong presence in communities such as New York. Its work centers on providing resources, mentorship, and development programs that create opportunities for young people, often connected to the music, entertainment, and business sectors.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Educación de Calidad, Justicia de Género, Salud Global",
      en: "Quality Education, Gender Justice, Global Health"
    },
    como_trabajan: {
      es: "Ofrece apoyo, potencialmente a través de becas, programas de empoderamiento y orientación empresarial/profesional.",
      en: "Offers support, potentially through scholarships, empowerment programs, and business/career guidance. "
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Seattle, Washington, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "thejessicombsfoundation.com",
    email: "info@thejessicombsfoundation.com"
  },
  {
    id: 64,
    name: "Global Greengrants Fund",
    description_es: "Trabaja globalmente, apoyando la justicia ambiental de base. Se centra en empoderar a las comunidades marginadas para que protejan su medio ambiente, sus culturas y sus derechos contra cuestiones como el cambio climático y las industrias extractivas a través de la concesión de subvenciones locales y participativas.",
    description_en: "Works globally, supporting grassroots environmental justice. Focuses on empowering marginalized communities to protect their environment, cultures, and rights against issues like climate change and extractive industries through local, participatory grantmaking. ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Comunidades Indígenas, Conservación de Recursos Naturales, Movimientos Ciudadanos",
      en: "Climate Justice, Indigenous Communities, Natural Resources Conservation, Citizen Movements"
    },
    como_trabajan: {
      es: "Trabajan a través de un modelo participativo de concesión de subvenciones que capacita a expertos y asesores locales de las regiones afectadas para guiar las decisiones de financiación. Al proporcionar subvenciones pequeñas y flexibles a grupos de base que promueven la justicia ambiental, la sostenibilidad y la conservación, fortalecen las soluciones lideradas por la comunidad y ayudan a elevar las voces locales para influir en sistemas climáticos y de justicia más amplios.",
      en: "They work through a participatory grantmaking model that empowers local experts and advisors from affected regions to guide funding decisions. By providing small, flexible grants to grassroots groups advancing environmental justice, sustainability, and conservation, they strengthen community-led solutions and help elevate local voices to influence broader climate and justice systems."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Boulder, Colorado, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.greengrants.org/",
    email: "info@greengrants.org/info@globalgreengrants.org.uk"
  },
  {
    id: 65,
    name: "Fund for Global Human Rights",
    description_es: "Apoya a activistas y organizaciones de base en todo el mundo, brindando financiamiento flexible, asesoramiento estratégico y conexiones de red para luchar por la justicia, la dignidad y la igualdad, especialmente en áreas con espacio cívico restringido, empoderando las voces locales contra la opresión, promoviendo reformas legales y generando poder para las comunidades marginadas.",
    description_en: "Supports grassroots activists and organizations worldwide, providing flexible funding, strategic advice, and network connections to fight for justice, dignity, and equality, especially in areas with restricted civic space, by empowering local voices against oppression, promoting legal reforms, and building power for marginalized communities. ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Democracia, Participación Ciudadana, Movimientos Ciudadanos, Justicia de Género",
      en: "Democracy, Civic Participation, Citizen Movements, Gender Justice"
    },
    como_trabajan: {
      es: "Apoya los movimientos de base proporcionando financiamiento flexible a largo plazo, fortaleciendo la capacidad local a través de apoyo estratégico y técnico y ayudando a promover la defensa contra leyes injustas.",
      en: "Supports grassroots movements by providing flexible, long-term funding, strengthening local capacity through strategic and technical support, and helping advance advocacy against unjust laws."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Washington D.C., EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://fundhumanrights.org/",
    email: "info@globalhumanrights.org/donations@globalhumanrights.org"
  },
  {
    id: 66,
    name: "Climate Emergency Fund ",
    description_es: "Apoya a los activistas que están movilizando al público en torno a la crisis climática mediante la recaudación de fondos y la concesión de subvenciones a movimientos climáticos audaces y no violentos. Al canalizar las donaciones hacia acciones disruptivas de base, ayudan a fortalecer el poder de las personas e impulsar cambios significativos en respuesta a la emergencia climática.",
    description_en: "Supports activists who are mobilizing the public around the climate crisis by raising funds and providing grants to bold, nonviolent climate movements. By channeling donations into disruptive grassroots action, they help strengthen people power and drive meaningful change in response to the climate emergency.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Movimientos Ciudadanos, Transición Energética",
      en: "Climate Justice, Citizen Movements, Energy Transition"
    },
    como_trabajan: {
      es: "Proporciona subvenciones a grupos climáticos de alto impulso liderados por voluntarios que utilizan la disrupción no violenta para enfrentar la emergencia climática. Su financiamiento apoya campañas importantes, intervenciones en los medios, capacitación de activistas y esfuerzos más amplios de construcción de movimientos, así como acciones más pequeñas y de respuesta rápida, como pancartas o protestas artísticas. Priorizando grupos que hablan claramente sobre la urgencia de la crisis y reclutando y capacitando activamente a nuevos activistas.",
      en: "Provides grants to high-momentum, volunteer-led climate groups that use nonviolent disruption to confront the climate emergency. Their funding supports major campaigns, media interventions, activist training, and broader movement-building efforts, as well as smaller, rapid-response actions such as banners or artistic protests. By prioritizing groups that speak clearly about the urgency of the crisis and actively recruit and train new activists."
    },
    impacto_financiero: {
      es: "América del Norte, Europa del Este",
      en: "North America, Eastern Europe"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Beverly Hills, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.climateemergencyfund.org/",
    email: "grants@cefund.org "
  },
  {
    id: 67,
    name: "Environmental Defense Fund",
    description_es: "Se centra en soluciones climáticas, de salud y naturales a través de asociaciones científicas, políticas y comerciales para crear un cambio ambiental práctico en todo el mundo. Áreas de enfoque: ciencia y políticas, asociaciones corporativas, participación comunitaria, soluciones basadas en el mercado.",
    description_en: "Focuses on climate, health, and nature solutions through science, policy, and business partnerships to create practical environmental change worldwide. Focus areas: science and policy, corporate partnerships, community engagement, market-based solutions.\n",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales, Justicia Climática, Gobernanza Global, políticas y rendición de cuentas",
      en: "Natural Resources Conservation, Climate Justice, Gobernanza Global, políticas y rendición de cuentas"
    },
    como_trabajan: {
      es: "Proporciona financiación a otras organizaciones sin fines de lucro para impulsar la defensa climática federal, apoyando los esfuerzos en energía limpia, equidad en salud y electrificación del transporte. Ofrece subvenciones iniciales a su propio personal para soluciones creativas, no a organizaciones externas. Sus subvenciones tienen como objetivo amplificar los esfuerzos existentes y apoyar a los socios en áreas alineadas con los objetivos más amplios del EDF, particularmente en torno a la acción climática urgente.",
      en: "Provides funding to other non-profits to boost federal climate advocacy, supporting efforts in clean energy, health equity, and transportation electrification. Offers seed grants to its own staff for creative solutions, not external organizations. Their grants aim to amplify existing efforts and support partners in areas aligned with EDF's broader goals, particularly around urgent climate action."
    },
    impacto_financiero: {
      es: "América del Norte, Europa del Este, Asia Central",
      en: "North America, Eastern Europe, Central Asia"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.edf.org/",
    email: "europe@edf.org"
  },
  {
    id: 68,
    name: "Global Environment Facility",
    description_es: "Invierte en proyectos que abordan las amenazas ambientales más críticas del planeta, sirviendo como mecanismo financiero para múltiples convenciones ambientales (por ejemplo, biodiversidad, cambio climático). Movilizan fondos para apoyar el desarrollo sostenible y los beneficios ambientales globales. Áreas de enfoque: biodiversidad, cambio climático, degradación de la tierra, gestión de productos químicos y desechos, aguas internacionales.",
    description_en: "Invests in projects addressing the planet's most critical environmental threats, serving as a financial mechanism for multiple environmental conventions (e.g., biodiversity, climate change). They mobilize funding to support sustainable development and global environmental benefits. Focus areas: biodiversity, climate change, land degradation, chemical & waste management, international waters.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales, Justicia Climática, Ciudades Sustentables, Economía Circular",
      en: "Natural Resources Conservation, Climate Justice, Sustainable Cities, Circular Economy"
    },
    como_trabajan: {
      es: "Trabaja principalmente a través de 18 agencias acreditadas del FMAM (por ejemplo, el Banco Mundial, el PNUMA). Estos organismos desarrollan y presentan proyectos en nombre de los países beneficiarios. La financiación directa para pequeñas ONG es poco común, pero es posible a través de programas específicos como el Programa de Pequeñas Subvenciones.",
      en: "Works primarily through 18 accredited GEF Agencies (e.g., World Bank, UNEP). Projects are developed and submitted by these agencies on behalf of beneficiary countries. Direct funding to small NGOs is rare but possible through specific programs like the Small Grants Programme."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Washington D.C., EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.thegef.org/",
    email: "secretariat@thegef.org"
  },
  {
    id: 69,
    name: "Foundation for a Just Society (FJS)",
    description_es: "Apoya los esfuerzos para promover los derechos de las mujeres, las niñas y las personas LGBTQI a nivel mundial, dando prioridad a las organizaciones lideradas por las comunidades a las que sirven. Buscan promover la igualdad de género y hacer realidad los derechos humanos en las regiones más marginadas. Áreas de enfoque: derechos de las mujeres y las niñas, derechos lgbtqi, justicia de género, construcción de movimientos, promoción de políticas.",
    description_en: "Supports efforts to advance the rights of women, girls, and LGBTQI people globally, prioritizing organizations led by the communities they serve. They seek to promote gender equality and realize human rights in the most marginalized regions. Focus areas:  women's & girls' rights, lgbtqi rights, gender justice, movement building, policy advocacy.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia de Género, LGTBIQ+, Justicia Racial, Fortalecimiento de Capacidades Organizacionales",
      en: "Gender Justice, LGBTIQ+, Racial Justice, Organizational Capacity Building"
    },
    como_trabajan: {
      es: "Proporciona financiación plurianual flexible (sin restricciones) a organizaciones, centrándose en la creación de asociaciones de confianza a largo plazo. Por lo general, no aceptan propuestas no solicitadas y trabajan principalmente por invitación a regiones e iniciativas específicas.",
      en: "Provides multi-year, flexible funding (unrestricted) to organizations, focusing on building long-term, trusting partnerships. They generally do not accept unsolicited proposals and work primarily by invitation to specific regions and initiatives."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://fjs.org/",
    email: "info@fjs.org"
  },
  {
    id: 70,
    name: "Oak Foundation",
    description_es: "Compromete recursos para abordar problemas sociales y ambientales globales, buscando proteger el medio ambiente y empoderar a las personas afectadas por la injusticia social, ambiental y económica. Mantienen diversos programas con enfoques geográficos específicos. Áreas de enfoque: protección ambiental, vivienda y personas sin hogar, abuso infantil, derechos humanos (internacional), conservación marina.",
    description_en: "Commits resources to address global social and environmental issues, seeking to protect the environment and empower people affected by social, environmental, and economic injustice. They maintain diverse programs with specific geographic focuses. Focus areas: environmental protection, housing and homelessness, child abuse, human rights (international), marine conservation.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Protección de la Niñez, Justicia de Género, Conservación de Recursos Naturales, Derechos de Migrantes y Refugiados",
      en: "Child Protection, Gender Justice, Natural Resources Conservation, Rights of Migrants and Refugees"
    },
    como_trabajan: {
      es: "Opera a través de programas definidos con lineamientos específicos. Muchos programas aceptan cartas de consulta iniciales o notas conceptuales, pero operan predominantemente mediante invitación una vez que se determina una adecuación estratégica. Ofrecen subvenciones a largo plazo y específicas para proyectos.",
      en: "Operates through defined programs with specific guidelines. Many programs accept initial letters of inquiry or concept notes, but they operate predominantly on an invitation basis after a strategic fit is determined. They offer long-term and project-specific grants."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "Switzerland",
    country_es: "Suiza",
    ciudad: "Ginebra, Suiza",
    continent: "europa",
    latitude: 46.948,
    longitude: 7.4474,
    website: "https://oakfnd.org/",
    email: "info@oakfnd.org"
  },
  {
    id: 71,
    name: "Central American Women's Fund",
    description_es: "Fortalece las organizaciones de mujeres, niñas adolescentes y jóvenes en Centroamérica brindando apoyo flexible, financiero y estratégico para abordar la violencia y promover la justicia social y de género en la región. Áreas de enfoque: derechos de las mujeres, derechos sexuales y reproductivos, justicia económica, eliminación de la violencia contra las mujeres, construcción de movimientos.",
    description_en: "Strengthens women's, adolescent girls' and young people's organizations in Central America by providing flexible, financial, and strategic support to address violence and promote gender and social justice in the region. Focus areas: women's rights, sexual & reproductive rights, economic justice, eliminating violence against women, movement building.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia de Género, Juventud, Movimientos Ciudadanos, Justicia Económica",
      en: "Gender Justice, Youth, Citizen Movements, Economic Justice"
    },
    como_trabajan: {
      es: "Acepta propuestas a través de convocatorias abiertas dentro de ciclos de financiamiento específicos, enfocándose en organizaciones centroamericanas. Son un fondo de mujeres que prioriza la financiación accesible y flexible para grupos de base y liderados por mujeres.",
      en: "Accepts proposals via open calls for applications within specific funding cycles, focusing on Central American organizations. They are a women's fund, prioritizing accessible, flexible funding to grassroots and women-led groups."
    },
    impacto_financiero: {
      es: "América Central",
      en: "Central America"
    },
    country: "Guatemala",
    country_es: "Guatemala",
    ciudad: "Ciudad de Guatemala, Guatemala",
    continent: "america",
    latitude: 0,
    longitude: 0,
    website: "https://fondocentroamericano.org/home-2/",
    email: "info@fcmujer.org"
  },
  {
    id: 72,
    name: "Laudes Foundation",
    description_es: "Inspira y apoya la transición hacia una economía global inclusiva y positiva para el clima, centrándose en cómo se utiliza el capital y cómo se realizan los negocios en sectores como la moda y el entorno construido. Buscan cambiar las industrias hacia prácticas sostenibles y equitativas. Áreas de enfoque: entorno construido, moda y confección, finanzas y capital, justicia climática, derechos humanos en las cadenas de suministro.",
    description_en: "Inspires and supports the transition to a climate-positive and inclusive global economy, focusing on how capital is deployed and how business is conducted in sectors like fashion and built environment. They seek to shift industries toward sustainable and equitable practices. Focus areas: built environment, fashion & apparel, finance & capital, climate justice, human rights in supply chains.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Derechos Laborales, Economía Circular, Ciudades Sustentables",
      en: "Climate Justice, Labor Rights, Circular Economy, Sustainable Cities"
    },
    como_trabajan: {
      es: "Trabaja a través de alianzas estratégicas y proyectos por encargo. Generalmente no aceptan propuestas no solicitadas; La financiación se realiza principalmente a través de invitaciones a colaborar en esfuerzos de cambio sistémico a gran escala alineados con su estrategia de transición.",
      en: "Works through strategic partnerships and commissioned projects. They generally do not accept unsolicited proposals; funding is primarily through invitation to collaborate on large-scale systemic change efforts aligned with their transition strategy."
    },
    impacto_financiero: {
      es: "Europa del Este, Asia Central, África Subsahariana, América del Sur",
      en: "Eastern Europe, Central Asia, Sub-Saharan Africa, South America"
    },
    country: "Switzerland",
    country_es: "Suiza",
    ciudad: "Zug, Suiza",
    continent: "europa",
    latitude: 46.948,
    longitude: 7.4474,
    website: "https://www.laudesfoundation.org/",
    email: "info@laudesfoundation.org"
  },
  {
    id: 73,
    name: "Susan Thompson Buffett Foundation",
    description_es: "Ayuda a estudiantes de bajos ingresos a través de programas de becas y apoya iniciativas globales centradas en la salud reproductiva de las mujeres y la planificación familiar para empoderar a las mujeres y promover el desarrollo global.",
    description_en: "Aids low-income students through scholarship programs, and supports global initiatives focused on women's reproductive health and family planning to empower women and promote global development.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia de Género, Salud Global (Derechos Reproductivos), Educación de Calidad",
      en: "Gender Justice, Salud Global (Derechos Reproductivos), Quality Education"
    },
    como_trabajan: {
      es: "Trabaja principalmente a través de 18 agencias acreditadas del FMAM (por ejemplo, el Banco Mundial, el PNUMA). Estos organismos desarrollan y presentan proyectos en nombre de los países beneficiarios. La financiación directa para pequeñas ONG es poco común, pero es posible a través de programas específicos como el Programa de Pequeñas Subvenciones.\tsecretariat@thegef.org",
      en: "Works primarily through 18 accredited GEF Agencies (e.g., World Bank, UNEP). Projects are developed and submitted by these agencies on behalf of beneficiary countries. Direct funding to small NGOs is rare but possible through specific programs like the Small Grants Programme.\tsecretariat@thegef.org"
    },
    impacto_financiero: {
      es: "América del Norte, África subsahariana",
      en: "North America, Sub-Saharan Africa"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Omaha, Nebraska, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://buffettscholarships.org/",
    email: "contact@stbfoundation.org"
  },
  {
    id: 74,
    name: "Open Society Institute",
    description_es: "Construye democracias vibrantes y tolerantes cuyos gobiernos sean responsables ante sus ciudadanos, promoviendo la justicia, la educación, la salud pública y los medios de comunicación independientes. Operan una vasta red de fundaciones nacionales a nivel mundial.",
    description_en: "Builds vibrant and tolerant democracies whose governments are accountable to their citizens, promoting justice, education, public health, and independent media. They operate a vast network of national foundations globally.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Democracia, Justicia Racial, Gobernanza Global, políticas y rendición de cuentas, Derechos Digitales",
      en: "Democracy, Racial Justice, Gobernanza Global, políticas y rendición de cuentas, Digital Rights"
    },
    como_trabajan: {
      es: "La mayor parte de la financiación es gestionada por programas regionales o temáticos, que a menudo utilizan convocatorias de propuestas específicas. Muchas oficinas locales tienen procesos de solicitud abiertos u oportunidades de subvenciones que se publican en sus respectivos sitios web.",
      en: "Most funding is managed by regional or thematic programs, which often utilize specific calls for proposals. Many local offices have open application processes or grant opportunities that are published on their respective websites."
    },
    impacto_financiero: {
      es: "América del norte, América central, América del sur, South Asia, África subsahariana, África del norte, Oriente Medio",
      en: "North America, Central America, South America, South Asia, Sub-Saharan Africa, North Africa, Middle East"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.opensocietyfoundations.org/",
    email: "info@opensocietyfoundations.org"
  },
  {
    id: 75,
    name: "W.K. Kellogg Foundation",
    description_es: "Fomenta resultados equitativos para niños y familias vulnerables centrándose en áreas que crean condiciones para el bienestar: niños educados, familias saludables y comunidades prósperas, principalmente en los EE. UU., México y Haití.\tequidad racial, seguridad económica, educación, participación comunitaria, desarrollo de liderazgo.",
    description_en: "Fosters equitable outcomes for vulnerable children and families by focusing on areas that create conditions for well-being: educated kids, healthy families, and thriving communities, primarily in the U.S., Mexico, and Haiti.\tracial equity, economic security, education, community engagement, leadership development.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Derechos de las Infancias, Educación de Calidad, Justicia Racial, Salud Global",
      en: "Children's Rights, Quality Education, Racial Justice, Global Health"
    },
    como_trabajan: {
      es: "Acepta consultas no solicitadas (a través de un sistema en línea) para proyectos que se alinean con sus lugares y problemas prioritarios. La financiación suele realizarse a través de subvenciones estratégicas, que hacen hincapié en el cambio y la equidad a largo plazo impulsados ​​por la comunidad.",
      en: "Accepts unsolicited inquiries (via an online system) for projects that align with their priority places and issues. Funding is usually through strategic grants, emphasizing long-term, community-driven change and equity."
    },
    impacto_financiero: {
      es: "América del Norte, América Central",
      en: "North America, Central America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Battle Creek, Michigan, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.wkkf.org/",
    email: "grants@wkkf.org"
  },
  {
    id: 76,
    name: "UN Trust Fund to End Violence Against Women",
    description_es: "Apoya a las organizaciones de la sociedad civil (OSC) que implementan intervenciones críticas para prevenir y abordar la violencia contra las mujeres y las niñas (VAWG). Son el único mecanismo de concesión de subvenciones de la ONU dedicado exclusivamente a este tema.",
    description_en: "Supports civil society organizations (CSOs) that implement critical interventions to prevent and address violence against women and girls (VAWG). They are the only grant-making mechanism of the UN dedicated exclusively to this issue.",
    tipo_de_org: {
      es: "Organizaciones No Gubernamentales",
      en: "Non-Governmental Organization"
    },
    enfoque: {
      es: "Justicia de Género, Protección de la Niñez, Paz y Resolución de Conflictos",
      en: "Gender Justice, Child Protection, Peace and Conflict Resolution"
    },
    como_trabajan: {
      es: "Opera principalmente a través de una convocatoria de propuestas competitiva y anual abierta a organizaciones de la sociedad civil, incluidas organizaciones de derechos de las mujeres. Dan prioridad a la financiación de organizaciones de base y de aquellas que trabajan con grupos marginados.",
      en: "Operates primarily through an annual, competitive Call for Proposals open to civil society organizations, including women's rights organizations. They prioritize funding grassroots organizations and those working with marginalized groups."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "EE. UU. (Sede ONU)",
    country_es: "EE. UU. (Sede ONU)",
    ciudad: "Nueva York, EE. UU. (Sede ONU)",
    continent: "desconocido",
    latitude: 0,
    longitude: 0,
    website: "https://www.unwomen.org/en/trust-funds/un-trust-fund-to-end-violence-against-women",
    email: "untf-vaw@unwomen.org"
  },
  {
    id: 77,
    name: "Fundación AVINA",
    description_es: "Impulsa el desarrollo sostenible en América Latina a través de acciones colaborativas, fomentando alianzas estratégicas e innovación para promover la acción climática, los derechos humanos, la migración responsable y los procesos democráticos en la región.",
    description_en: "Drives sustainable development in Latin America through collaborative action, fostering strategic partnerships and innovation to promote climate action, human rights, responsible migration, and democratic processes in the region.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Innovación Social, Justicia Climática, Ciudades Sustentables, Economía Circular",
      en: "Social Innovation, Climate Justice, Sustainable Cities, Circular Economy"
    },
    como_trabajan: {
      es: "Se centra en construir asociaciones estratégicas y codiseñar proyectos en lugar de aceptar propuestas generales no solicitadas. La financiación suele dirigirse a redes, iniciativas regionales y organizaciones que participan en sus programas establecidos.",
      en: "Focuses on building strategic partnerships and co-designing projects rather than accepting general unsolicited proposals. Funding is often directed towards networks, regional initiatives, and organizations participating in their established programs."
    },
    impacto_financiero: {
      es: "América Central, América del Sur, África subsahariana, África del norte",
      en: "Central America, South America, Sub-Saharan Africa, North Africa"
    },
    country: "Panamá (Sede Ejecutiva)",
    country_es: "Panamá (Sede Ejecutiva)",
    ciudad: "Ciudad de Panamá, Panamá (Sede Ejecutiva)",
    continent: "desconocido",
    latitude: 0,
    longitude: 0,
    website: "https://www.avina.net/",
    email: "avina@avina.net"
  },
  {
    id: 78,
    name: "William & Flora Hewlett Foundation",
    description_es: "Resuelve problemas globales y sociales complejos apoyando a líderes e instituciones que trabajan en el clima, la educación, el desarrollo global y la salud reproductiva. Son conocidos por brindar apoyo operativo general y subvenciones para proyectos específicos.",
    description_en: "Solves complex global and social problems by supporting leaders and institutions working in climate, education, global development, and reproductive health. They are known for providing both general operating support and project-specific grants.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Educación de Calidad, Justicia Climática, Gobernanza Global, políticas y rendición de cuentas, Salud Global",
      en: "Quality Education, Climate Justice, Gobernanza Global, políticas y rendición de cuentas, Global Health"
    },
    como_trabajan: {
      es: "Opera principalmente por invitación a organizaciones e iniciativas específicas. Aceptan muy pocas propuestas no solicitadas y prefieren identificar y asociarse con organizaciones que se ajusten a sus estrategias profundas y específicas para lograr un cambio sistémico.",
      en: "Operates primarily by invitation to specific organizations and initiatives. They accept very few unsolicited proposals, preferring to identify and partner with organizations that fit their deep, targeted strategies for achieving systemic change."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Menlo Park, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://hewlett.org/",
    email: "info@hewlett.org"
  },
  {
    id: 79,
    name: "Silicon Valley Community Foundation",
    description_es: "Ayuda en la transformación de la comunidad al servir como centro de filantropía en Silicon Valley y más allá. Gestionan fondos caritativos y otorgan subvenciones para abordar cuestiones como vivienda, oportunidades económicas y educación en la región local y a nivel mundial.",
    description_en: "Aids in community transformation by serving as a hub for philanthropy in Silicon Valley and beyond. They manage charitable funds and provide grants to tackle issues like housing, economic opportunity, and education in the local region and globally.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Innovación Social, Justicia Económica, Ciudades Sustentables, Educación de Calidad",
      en: "Social Innovation, Economic Justice, Sustainable Cities, Quality Education"
    },
    como_trabajan: {
      es: "Gestiona una combinación de ciclos de subvenciones abiertos y competitivos para las necesidades de la comunidad local y fondos asesorados por donantes (DAF). Sus programas de subvenciones liderados por la comunidad suelen aceptar propuestas dentro de plazos definidos.",
      en: "Manages a mix of open, competitive grant cycles for local community needs and donor-advised funds (DAFs). Their community-led grant programs typically accept proposals within defined timeframes."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Mountain View, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.svcf.org/",
    email: "info@siliconvalleycf.org"
  },
  {
    id: 80,
    name: "Foundation Open Society Institute - Switzerland",
    description_es: "Apoya la misión de Open Society Foundations respaldando a organizaciones e individuos que trabajan para fortalecer la sociedad civil, los derechos humanos y el estado de derecho en Suiza y en iniciativas europeas específicas. Áreas de enfoque: desarrollo de la sociedad civil, derechos humanos, estado de derecho, migración e integración (suiza/europa).",
    description_en: "Supports the Open Society Foundations' mission by backing organizations and individuals working to strengthen civil society, human rights, and the rule of law within Switzerland and specific European initiatives. Focus areas: civil society development, human rights, rule of law, migration and integration (switzerland/europe).",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Gobernanza Global, políticas y rendición de cuentas, Derechos Digitales, Democracia",
      en: "Gobernanza Global, políticas y rendición de cuentas, Digital Rights, Democracy"
    },
    como_trabajan: {
      es: "Opera a través de convocatorias abiertas de propuestas y subvenciones directas (invitación), enfocándose en fortalecer el sector de la sociedad civil local y alineándose con las prioridades globales de OSF, adaptadas al contexto suizo.",
      en: "Operates through both open calls for proposals and direct grants (invitation), focusing on strengthening the local civil society sector and aligning with OSF’s global priorities, adapted to the Swiss context."
    },
    impacto_financiero: {
      es: "Europa Occidental",
      en: "Western Europe"
    },
    country: "Switzerland",
    country_es: "Suiza",
    ciudad: "Ginebra, Suiza",
    continent: "europa",
    latitude: 46.948,
    longitude: 7.4474,
    website: "https://www.opensocietyfoundations.org/",
    email: "info.switzerland@opensocietyfoundations.org"
  },
  {
    id: 81,
    name: "Fondo De Mujeres Del Sur",
    description_es: "Fomenta la igualdad de género y la justicia social en todo el sur de América Latina (por ejemplo, Argentina, Paraguay, Uruguay) fortaleciendo la capacidad y la independencia financiera de las organizaciones de mujeres y feministas.",
    description_en: "Fosters gender equality and social justice across Southern Latin America (e.g., Argentina, Paraguay, Uruguay) by strengthening the capacity and financial independence of women’s and feminist organizations.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia de Género, LGTBIQ+, Justicia Climática, Movimientos Ciudadanos",
      en: "Gender Justice, LGBTIQ+, Climate Justice, Citizen Movements"
    },
    como_trabajan: {
      es: "Gestiona ciclos de financiamiento competitivos a través de convocatorias abiertas dirigidas a organizaciones de mujeres y feministas del Cono Sur. Priorizan el apoyo flexible e institucional a los grupos de base.",
      en: "Manages competitive funding cycles through open calls for proposals directed at women's and feminist organizations in the Southern Cone. They prioritize flexible and institutional support for grassroots groups."
    },
    impacto_financiero: {
      es: "América del Sur ",
      en: "South America"
    },
    country: "Argentina",
    country_es: "Argentina",
    ciudad: "Córdoba, Argentina",
    continent: "america",
    latitude: -34.6037,
    longitude: -58.3816,
    website: "https://www.mujeresdelsur.org/?lang=es-AR",
    email: "info@mujeresdelsur.org"
  },
  {
    id: 82,
    name: "Norwegian Human Rights Fund",
    description_es: "Apoya a organizaciones que trabajan en condiciones desafiantes o represivas para promover los derechos humanos, poniendo especial énfasis en los grupos que luchan por la democracia, la libertad de expresión y los derechos de los grupos marginados.",
    description_en: "Supports organizations that are working under challenging or repressive conditions to promote human rights, placing special emphasis on groups fighting for democracy, freedom of expression, and the rights of marginalized groups.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Democracia, Derechos Laborales, Paz y Resolución de Conflictos, Justicia Racial",
      en: "Democracy, Labor Rights, Peace and Conflict Resolution, Racial Justice"
    },
    como_trabajan: {
      es: "Acepta solicitudes y notas conceptuales a través de ventanas de solicitud definidas que se publican en su sitio web, centrándose en socios en países que carecen de una infraestructura sólida de derechos humanos o enfrentan déficits democráticos.",
      en: "Accepts applications and concept notes through defined application windows that are published on their website, focusing on partners in countries that lack strong human rights infrastructure or face democratic deficits."
    },
    impacto_financiero: {
      es: "América del Sur, Asia Central",
      en: "South America, Central Asia"
    },
    country: "Norway",
    country_es: "Noruega",
    ciudad: "Oslo, Noruega",
    continent: "europa",
    latitude: 59.9139,
    longitude: 10.7522,
    website: "https://nhrf.no/",
    email: "post@nhrf.no"
  },
  {
    id: 83,
    name: "Summit Charitable Foundation",
    description_es: "Aborda desafíos ambientales apremiantes y necesidades de salud humana en comunidades vulnerables, con un fuerte enfoque en la conservación, el desarrollo sostenible, la salud reproductiva y el empoderamiento de las adolescentes a nivel mundial.\tsalud y derechos reproductivos (adolescentes), conservación, desarrollo sostenible, acción ambiental comunitaria.",
    description_en: "Addresses pressing environmental challenges and human health needs in vulnerable communities, with a strong focus on conservation, sustainable development, reproductive health, and empowering adolescent girls globally.\treproductive health & rights (adolescents), conservation, sustainable development, community-based environmental action.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia de Género, Conservación de Recursos Naturales, Justicia Climática",
      en: "Gender Justice, Natural Resources Conservation, Climate Justice"
    },
    como_trabajan: {
      es: "Opera únicamente por invitación (no se aceptan propuestas no solicitadas). El financiamiento se dirige a través de asociaciones a largo plazo con organizaciones establecidas y subvenciones estratégicas que están altamente alineadas con los objetivos del programa específico de la fundación.",
      en: "Operates by invitation only (no unsolicited proposals accepted). Funding is directed through long-term partnerships with established organizations and strategic grants that are highly aligned with the foundation’s specific program goals."
    },
    impacto_financiero: {
      es: "América del Norte, América Central, América del Sur",
      en: "North America, Central America, South America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Washington D.C., EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.summitfdn.org/",
    email: "info@sumcf.org"
  },
  {
    id: 84,
    name: "Gates Foundation",
    description_es: "Aborda la pobreza extrema, las enfermedades y la desigualdad a nivel mundial a través de iniciativas de alto impacto basadas en la ciencia. Trabajan para garantizar que todos tengan la oportunidad de vivir una vida sana y productiva, centrándose principalmente en la salud y el desarrollo globales.",
    description_en: "Tackles extreme poverty, disease, and inequity globally through high-impact, science-based initiatives. They work to ensure everyone has the chance to live a healthy, productive life, focusing heavily on global health and development.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Salud Global, Soberanía Alimentaria, Educación de Calidad, Innovación Social",
      en: "Global Health, Food Sovereignty, Quality Education, Social Innovation"
    },
    como_trabajan: {
      es: "Opera predominantemente a través de subvenciones directas a socios importantes e invitaciones estratégicas. Ocasionalmente ofrecen Grandes Desafíos específicos por tiempo limitado u oportunidades de financiamiento con un proceso de solicitud abierto para ideas innovadoras.",
      en: "Predominantly operates through direct grants to major partners and strategic invitations. They occasionally offer specific, time-limited Grand Challenges or funding opportunities with an open application process for innovative ideas."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Seattle, Washington, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.gatesfoundation.org/",
    email: "info@gatesfoundation.org"
  },
  {
    id: 85,
    name: "Comic Relief",
    description_es: "Financia iniciativas a nivel mundial que tienen como objetivo aliviar las causas fundamentales y las consecuencias de la pobreza, aprovechando el poder del entretenimiento para impulsar la participación pública, el cambio social y el apoyo a las comunidades más afectadas por la injusticia y el daño climático. Áreas de enfoque: aliviar la pobreza, abordar las injusticias, apoyar a las comunidades afectadas por el clima",
    description_en: "Funds initiatives globally that aim to alleviate the root causes and consequences of poverty, leveraging the power of entertainment to drive public engagement, social change, and support for communities most affected by injustice and climate harm. Focus areas: alleviating poverty, tackling injustices, supporting climate-impacted communities",
    tipo_de_org: {
      es: "Organizaciones No Gubernamentales",
      en: "Non-Governmental Organization"
    },
    enfoque: {
      es: "Salud Global, Justicia de Género, Derechos de las Infancias, Justicia Económica",
      en: "Global Health, Gender Justice, Children's Rights, Economic Justice"
    },
    como_trabajan: {
      es: "Trabajan a través de programas de subvenciones temáticos abiertos y asociaciones estratégicas. Abren rondas de financiación a las que las organizaciones pueden postularse (a menudo a través de intermediarios), centrándose en garantizar que los fondos lleguen directamente a las comunidades más marginadas. Priorizan organizaciones lideradas por personas con experiencia vivida.",
      en: "They work through open, thematic grant programs and strategic partnerships. They open funding rounds that organizations can apply to (often via intermediaries), focusing on ensuring funds directly reach the most marginalized communities. They prioritize organizations led by people with lived experience."
    },
    impacto_financiero: {
      es: "África Subsahariana, Europa Occidental",
      en: "Sub-Saharan Africa, Western Europe"
    },
    country: "United Kingdom",
    country_es: "Reino Unido",
    ciudad: "Londres, Reino Unido",
    continent: "europa",
    latitude: 51.5074,
    longitude: -0.1278,
    website: "https://www.comicrelief.com/",
    email: "fundinginfo@comicrelief.com"
  },
  {
    id: 86,
    name: "Schmidt Family Foundation",
    description_es: "Impulsa la innovación y la aplicación de nuevos conocimientos científicos para promover la sostenibilidad global, centrando los esfuerzos en mejorar la salud de los océanos, promoviendo la adopción de energía limpia y conservando recursos ambientales esenciales para las generaciones futuras. Áreas de enfoque: clima y medio ambiente, salud de los océanos, ciencia e innovación, sostenibilidad.",
    description_en: "Drives innovation and the application of new scientific knowledge to advance global sustainability, focusing efforts on improving ocean health, promoting clean energy adoption, and conserving essential environmental resources for future generations. Focus areas: climate and environment, ocean health, science and innovation, sustainability.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Transición Energética, Soberanía Alimentaria, Conservación de Recursos Naturales",
      en: "Climate Justice, Energy Transition, Food Sovereignty, Natural Resources Conservation"
    },
    como_trabajan: {
      es: "Financian principalmente proyectos iniciados y desarrollados internamente o mediante invitaciones estratégicas. La mayoría de las subvenciones se conceden a través de iniciativa propia, Schmidt Futures, o mediante invitaciones. Generalmente no aceptan propuestas no solicitadas, centrándose en un modelo de inversión de alto impacto.",
      en: "They primarily fund projects initiated and developed internally or through strategic invitations. Most grants are made through their own initiative, Schmidt Futures, or via invitations. They generally do not accept unsolicited proposals, focusing on a high-impact investment model."
    },
    impacto_financiero: {
      es: "América del Norte, Oceanía, Asia Oriental, América del Sur",
      en: "North America, Oceania, East Asia, South America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Palo Alto, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://tsffoundation.org/",
    email: "info@tsffoundation.org"
  },
  {
    id: 87,
    name: "Aidsfonds",
    description_es: "Se esfuerza por poner fin a la epidemia de SIDA brindando apoyo para la prevención, el tratamiento y la atención del VIH, al tiempo que aboga ferozmente por los derechos y la inclusión de las poblaciones clave (LGBTQI+, trabajadores sexuales) que a menudo quedan marginadas en la respuesta sanitaria mundial. Áreas de enfoque: prevención y tratamiento del VIH/SIDA, liderazgo y derechos comunitarios, salud sexual y reproductiva.",
    description_en: "Strives to end the AIDS epidemic by providing support for HIV prevention, treatment, and care, while fiercely advocating for the rights and inclusion of key populations (LGBTQI+, sex workers) that are often marginalized in the global health response. Focus areas: HIV/AIDS prevention and treatment, community leadership and rights, sexual and reproductive health.",
    tipo_de_org: {
      es: "Organizaciones No Gubernamentales",
      en: "Non-Governmental Organization"
    },
    enfoque: {
      es: "Salud Global, LGTBIQ+, Derechos de Migrantes y Refugiados",
      en: "Global Health, LGBTIQ+, Rights of Migrants and Refugees"
    },
    como_trabajan: {
      es: "Utilizan una combinación de convocatorias abiertas de propuestas de subvenciones y asociaciones estratégicas. Priorizan iniciativas de financiación lideradas por comunidades clave y locales en regiones de alta prevalencia. Ofrecen subvenciones a corto y largo plazo y, a menudo, buscan financiar intervenciones innovadoras.",
      en: "They use a combination of open calls for grant proposals and strategic partnerships. They prioritize funding initiatives led by key and local communities in high-prevalence regions. They offer short-term and long-term grants, and often seek to finance innovative interventions."
    },
    impacto_financiero: {
      es: "África Subsahariana, Europa Occidental, Asia Central, Asia Oriental, América del Sur",
      en: "Sub-Saharan Africa, Western Europe, Central Asia, East Asia, South America"
    },
    country: "Netherlands",
    country_es: "Países Bajos",
    ciudad: "Ámsterdam, Países Bajos",
    continent: "europa",
    latitude: 52.3676,
    longitude: 4.9041,
    website: "https://aidsfonds.org/",
    email: "contact@aidsfonds.nl"
  },
  {
    id: 88,
    name: "John D. and Catherine T. MacArthur Foundation",
    description_es: "Invierte en soluciones creativas y efectivas a desafíos globales complejos, principalmente apoyando la mitigación del clima, reduciendo el encarcelamiento masivo, fortaleciendo la democracia estadounidense y fomentando un mundo justo, verde y pacífico. Áreas de enfoque: soluciones climáticas, sociedades justas e inclusivas, reducción del encarcelamiento, protección de los derechos humanos, práctica democrática.",
    description_en: "Invests in creative and effective solutions to complex global challenges, primarily by supporting climate mitigation, reducing mass incarceration, strengthening American democracy, and fostering a just, verdant, and peaceful world. Focus areas: climate solutions, just & inclusive societies, reducing incarceration, protecting human rights, democratic practice.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Paz y Resolución de Conflictos, Justicia Climática, Democracia, Innovación Social",
      en: "Peace and Conflict Resolution, Climate Justice, Democracy, Social Innovation"
    },
    como_trabajan: {
      es: "Operan principalmente por invitación o mediante convocatorias de propuestas específicas y limitadas. La Fundación se centra en programas de financiación plurianuales a gran escala dentro de sus áreas temáticas principales. Requieren propuestas detalladas pero valoran las relaciones a largo plazo con sus socios beneficiarios.",
      en: "They primarily operate by invitation or through specific, limited calls for proposals. The Foundation focuses on large-scale, multi-year funding programs within their core thematic areas. They require detailed proposals but value long-term relationships with their grantee partners."
    },
    impacto_financiero: {
      es: "América del Norte, Asia del Sur, África Subsahariana",
      en: "North America, Asia del Sur, Sub-Saharan Africa"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Chicago, Illinois, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.macfound.org/",
    email: "4answers@macfound.org"
  },
  {
    id: 89,
    name: "Charles Stewart Mott Foundation",
    description_es: "Fortalece la sociedad civil promoviendo el acceso a la justicia, apoyando programas extracurriculares eficaces para el desarrollo juvenil, abogando por la protección del agua dulce y financiando esfuerzos de revitalización comunitaria en su ciudad natal y regiones globales específicas. Áreas de enfoque: sociedad civil, educación (después de la escuela), medio ambiente (agua dulce), revitalización comunitaria.",
    description_en: "Strengthens civil society by promoting access to justice, supporting effective afterschool programs for youth development, advocating for freshwater protection, and funding community revitalization efforts in its hometown and specific global regions. Focus areas: civil society, education (afterschool), environment (freshwater), community revitalization.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Participación Ciudadana, Justicia Climática, Educación de Calidad, Fortalecimiento de Capacidades Organizacionales",
      en: "Civic Participation, Climate Justice, Quality Education, Organizational Capacity Building"
    },
    como_trabajan: {
      es: "Aceptan propuestas no solicitadas (cartas de consulta) para programas específicos, pero la mayoría de las subvenciones se otorgan mediante invitaciones. Dan prioridad a las instituciones de financiación que ya han demostrado su eficacia en sus áreas de interés y ofrecen tanto apoyo operativo general como financiación para proyectos específicos.",
      en: "They accept unsolicited proposals (letters of inquiry) for specific programs, but most grants are made through invitations. They prioritize funding institutions that are already proven in their focus areas, offering both general operating support and specific project funding."
    },
    impacto_financiero: {
      es: "América del Norte, Europa Oriental, África Subsahariana",
      en: "North America, Europa Oriental, Sub-Saharan Africa"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Flint, Michigan, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.mott.org/",
    email: "info@mott.org"
  },
  {
    id: 90,
    name: "Segal Family Foundation",
    description_es: "Empodera a líderes y organizaciones africanas de alto potencial basadas en la comunidad proporcionando financiamiento flexible y recursos para el desarrollo de capacidades, con el objetivo principal de cambiar la dinámica de poder y fomentar el desarrollo sostenible liderado localmente en toda el África subsahariana. Áreas de enfoque: desarrollo liderado localmente, empoderamiento de los jóvenes, igualdad de género",
    description_en: "Empowers high-potential, community-based African leaders and organizations by providing flexible funding and capacity-building resources, with the core goal of shifting power dynamics and fostering locally-led, sustainable development across Sub-Saharan Africa. Focus areas: locally-led development, youth empowerment, gender equality",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Salud Global, Educación de Calidad, Innovación Social, Fortalecimiento de Capacidades Organizacionales",
      en: "Global Health, Quality Education, Social Innovation, Organizational Capacity Building"
    },
    como_trabajan: {
      es: "Priorizan subvenciones plurianuales, sin restricciones y basadas en fideicomisos para organizaciones africanas de primera línea. Operan con un modelo de asociación basado en relaciones, centrándose en el aprendizaje mutuo. Por lo general, no requieren propuestas o informes exhaustivos (un modelo de \"confianza y subvención\").",
      en: "They prioritize multi-year, unrestricted, and trust-based grants for frontline African organizations. They operate with a relationship-based partnership model, focusing on mutual learning. They generally do not require exhaustive proposals or reports (a \"trust and grant\" model)."
    },
    impacto_financiero: {
      es: "África Subsahariana",
      en: "Sub-Saharan Africa"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva Jersey, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.segalfamilyfoundation.org/",
    email: "info@segalfamilyfoundation.org"
  },
  {
    id: 91,
    name: "Leona M and Harry B Helmsley Charitable Trust",
    description_es: "Impulsa nuevas investigaciones médicas y mejora el acceso a atención médica de calidad, enfocándose principalmente en la diabetes tipo 1 y la enfermedad de Crohn, al tiempo que apoya la infraestructura de atención médica en áreas rurales de EE. UU. Áreas de enfoque: diabetes tipo 1, enfermedad de Crohn, atención médica rural.",
    description_en: "Advances new medical research and improves access to quality healthcare, primarily focusing on Type 1 Diabetes and Crohn’s Disease, while also supporting healthcare infrastructure in rural U.S. Focus areas: Type 1 Diabetes, Crohn’s Disease, rural healthcare.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Salud Global, Conservación de Recursos Naturales, Educación de Calidad",
      en: "Global Health, Natural Resources Conservation, Quality Education"
    },
    como_trabajan: {
      es: "Principalmente financian proyectos y organizaciones a través de invitaciones y oportunidades muy específicas. Sus programas están muy enfocados y se basan en evidencia o necesidad científica. Generalmente no aceptan propuestas no solicitadas y operan con un alto nivel de enfoque estratégico.",
      en: "They primarily fund projects and organizations through invitations and highly specific opportunities. Their programs are very focused and are based on scientific evidence or need. They generally do not accept unsolicited proposals, operating with a high level of strategic focus."
    },
    impacto_financiero: {
      es: "América del Norte, África Subsahariana, Oriente Medio",
      en: "North America, Sub-Saharan Africa, Middle East"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://helmsleytrust.org/",
    email: "grants@helmsleytrust.org"
  },
  {
    id: 92,
    name: "Euro-Mediterranean Foundation of Support to Human Rights Defenders",
    description_es: "Protege y apoya a los defensores de los derechos humanos (DDH) en la región euromediterránea ofreciéndoles ayuda financiera crucial, asistencia legal y mecanismos de respuesta rápida para salvaguardar a quienes enfrentan riesgos debido a su trabajo de promoción. Área de enfoque: protección de defensores de derechos humanos, litigio estratégico.",
    description_en: "Protects and supports human rights defenders (HRDs) in the Euro-Mediterranean region by offering crucial financial aid, legal assistance, and rapid response mechanisms to safeguard those who face risks due to their advocacy work. Focus area: protection of human rights defenders, strategic litigation.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Paz y Resolución de Conflictos, Democracia, Derechos de Migrantes y Refugiados",
      en: "Peace and Conflict Resolution, Democracy, Rights of Migrants and Refugees"
    },
    como_trabajan: {
      es: "Ofrecen apoyo directo y flexible a los defensores de los derechos humanos (DDH) y sus organizaciones a través de llamadas periódicas y solicitudes continuas. Su proceso se caracteriza por ser rápido, especialmente para solicitudes de apoyo urgentes (protección, reubicación), y adaptado a las necesidades de los DDH en riesgo.",
      en: "They offer direct, flexible support to Human Rights Defenders (HRDs) and their organizations through rolling calls and continuous applications. Their process is known for being rapid, especially for urgent support requests (protection, relocation), and adapted to the needs of HRDs at risk."
    },
    impacto_financiero: {
      es: "Europa Occidental, África del Norte, Oriente Medio",
      en: "Western Europe, North Africa, Middle East"
    },
    country: "Denmark",
    country_es: "Dinamarca",
    ciudad: "Copenhague, Dinamarca",
    continent: "europa",
    latitude: 55.6761,
    longitude: 12.5683,
    website: "https://emhrf.org/",
    email: "grants@emhrf.org"
  },
  {
    id: 93,
    name: "Rockefeller Brothers Fund",
    description_es: "Promueve el cambio social global mediante la promoción de prácticas democráticas, el apoyo a la consolidación de la paz y la resolución de conflictos, y la financiación de iniciativas de desarrollo sostenible que aborden el cambio climático y fomenten sociedades más equitativas, prósperas y seguras. Áreas de enfoque: práctica democrática, consolidación de la paz, desarrollo sostenible, cambio climático, arte y cultura.",
    description_en: "Promotes global social change by advancing democratic practices, supporting peacebuilding and conflict resolution, and funding sustainable development initiatives that address climate change and foster more equitable, prosperous, and secure societies. Focus areas: democratic practice, peacebuilding, sustainable development, climate change, arts & culture.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Paz y Resolución de Conflictos, Justicia Climática, Democracia, Transición Energética",
      en: "Peace and Conflict Resolution, Climate Justice, Democracy, Energy Transition"
    },
    como_trabajan: {
      es: "Operan principalmente a través de invitaciones, aunque ocasionalmente aceptan cartas de consulta o propuestas no solicitadas para áreas muy específicas. Se centran en programas de subvenciones estratégicos a largo plazo. Su financiación tiende a ser tolerante al riesgo y respalda el trabajo de vanguardia y la colaboración global.",
      en: "They primarily operate through invitations, although they occasionally accept letters of inquiry or unsolicited proposals for very specific areas. They focus on strategic, long-term grant programs. Their funding tends to be risk-tolerant, supporting cutting-edge work and global collaboration."
    },
    impacto_financiero: {
      es: "América del Norte, Europa Occidental, África Subsahariana, Asia Oriental, Oriente Medio",
      en: "North America, Western Europe, Sub-Saharan Africa, East Asia, Middle East"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.rbf.org",
    email: "info@rbf.org"
  },
  {
    id: 94,
    name: "Moriah Fund",
    description_es: "El Fondo Moriah es una fundación privada dedicada a promover los derechos humanos, la justicia social y la equidad para las comunidades desfavorecidas.",
    description_en: "The Moriah Fund is a private foundation dedicated to advancing human rights, social justice, and equity for disadvantaged communities.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia de Género, Democracia, Derechos de Migrantes y Refugiados, Justicia Racial",
      en: "Gender Justice, Democracy, Rights of Migrants and Refugees, Racial Justice"
    },
    como_trabajan: {
      es: "Funciona financiando programas que fortalecen el liderazgo local, amplían la participación cívica y apoyan la democracia, la educación y los derechos de las mujeres.",
      en: "It works by funding programs that strengthen local leadership, expand civic participation, and support democracy, education, and women’s rights."
    },
    impacto_financiero: {
      es: "Oriente medio",
      en: "Oriente medio"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Chevy Chase, Maryland, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://moriahfund.org/",
    email: "info@moriahfund.org"
  },
  {
    id: 95,
    name: "EEA and Norway Grants",
    description_es: "Las subvenciones del EEE y Noruega son una iniciativa de financiación que apoya una Europa más verde, más democrática y más resiliente mediante la reducción de las disparidades sociales y económicas.",
    description_en: "The EEA and Norway Grants are a funding initiative that supports a greener, more democratic, and more resilient Europe by reducing social and economic disparities.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Democracia, Innovación Social, Justicia de Género",
      en: "Climate Justice, Democracy, Social Innovation, Gender Justice"
    },
    como_trabajan: {
      es: "Trabajan financiando programas y proyectos a través de asociaciones entre Islandia, Liechtenstein, Noruega y los estados miembros de la UE, centrándose en la sostenibilidad, la inclusión y los derechos humanos.",
      en: "They work by financing programmes and projects through partnerships between Iceland, Liechtenstein, Norway, and EU member states, focusing on sustainability, inclusion, and human rights."
    },
    impacto_financiero: {
      es: "Europa del este",
      en: "Eastern Europe"
    },
    country: "Bélgica (Secretariado)",
    country_es: "Bélgica (Secretariado)",
    ciudad: "Bruselas, Bélgica (Secretariado)",
    continent: "desconocido",
    latitude: 0,
    longitude: 0,
    website: "https://eeagrants.org/",
    email: "info-fmo@efta.int"
  },
  {
    id: 96,
    name: "Open Society Fund Prague",
    description_es: "Open Society Fund Prague es una fundación que apoya la educación, la cultura y los derechos humanos al tiempo que promueve los valores democráticos en la República Checa.",
    description_en: "Open Society Fund Prague is a foundation that supports education, culture, and human rights while promoting democratic values in the Czech Republic.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Democracia, Participación Ciudadana, Derechos Digitales, Educación de Calidad",
      en: "Democracy, Civic Participation, Digital Rights, Quality Education"
    },
    como_trabajan: {
      es: "Trabaja financiando y colaborando con organizaciones sin fines de lucro y programas educativos, con un fuerte enfoque en la sociedad civil, el estado de derecho y la salud pública.",
      en: "It works by funding and collaborating with nonprofit organizations and educational programs, with a strong focus on civil society, rule of law, and public health"
    },
    impacto_financiero: {
      es: "Europa del Este",
      en: "Eastern Europe"
    },
    country: "República Checa",
    country_es: "República Checa",
    ciudad: "Praga, República Checa",
    continent: "desconocido",
    latitude: 0,
    longitude: 0,
    website: "https://www.opensocietyfoundations.org/",
    email: ""
  },
  {
    id: 97,
    name: "Open Society Initiative for Europe",
    description_es: "Open Society Initiative for Europe es una organización que apoya los valores democráticos, los derechos humanos y las sociedades inclusivas en toda Europa.",
    description_en: "Open Society Initiative for Europe is an organization that supports democratic values, human rights, and inclusive societies across Europe.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Democracia, Participación Ciudadana, Derechos de Migrantes y Refugiados, Justicia de Género",
      en: "Democracy, Civic Participation, Rights of Migrants and Refugees, Gender Justice"
    },
    como_trabajan: {
      es: "Trabaja financiando iniciativas, apoyando a socios y fortaleciendo redes que promueven la rendición de cuentas, la participación cívica y la justicia social.",
      en: "It works by funding initiatives, supporting partners, and strengthening networks that promote accountability, civic participation, and social justice."
    },
    impacto_financiero: {
      es: "Europa Occidental, Europa del Este",
      en: "Western Europe, Eastern Europe"
    },
    country: "Spain",
    country_es: "España",
    ciudad: "Barcelona, España",
    continent: "europa",
    latitude: 40.4168,
    longitude: -3.7038,
    website: "https://www.opensocietyfoundations.org/",
    email: ""
  },
  {
    id: 98,
    name: "Stiftung Erinnerung, Verantwortung und Zukunft",
    description_es: "Stiftung Erinnerung, Verantwortung und Zukunft es una fundación dedicada a preservar la memoria de la injusticia nazi y al mismo tiempo defender los derechos humanos y el entendimiento internacional.",
    description_en: "Stiftung Erinnerung, Verantwortung und Zukunft is a foundation dedicated to preserving the memory of Nazi injustice while defending human rights and international understanding.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Paz y Resolución de Conflictos, Justicia Racial, Educación de Calidad, Derechos de las Personas con Discapacidad",
      en: "Peace and Conflict Resolution, Racial Justice, Quality Education, Rights of Persons with Disabilities"
    },
    como_trabajan: {
      es: "Funciona financiando iniciativas educativas, históricas y cívicas que fortalecen la democracia, apoyan a las comunidades afectadas y promueven el diálogo entre sociedades.",
      en: "It works by funding educational, historical, and civic initiatives that strengthen democracy, support affected communities, and promote dialogue across societies."
    },
    impacto_financiero: {
      es: "Europa Occidental, Europa del Este",
      en: "Western Europe, Eastern Europe"
    },
    country: "Germany",
    country_es: "Alemania",
    ciudad: "Berlín, Alemania",
    continent: "europa",
    latitude: 52.52,
    longitude: 13.405,
    website: "https://www.stiftung-evz.de/",
    email: ""
  },
  {
    id: 99,
    name: "Global Fund for Women",
    description_es: "Financia movimientos de justicia de género que combaten la opresión a nivel mundial, apoyando movimientos feministas de base. Ha otorgado más de $100 millones en subvenciones desde 1988.",
    description_en: "Funds gender justice movements combating oppression globally, supporting grassroots feminist movements. Has awarded over $100 million in grants since 1988.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia de Género, Paz y Resolución de Conflictos, Justicia Económica, Movimientos Ciudadanos",
      en: "Gender Justice, Peace and Conflict Resolution, Economic Justice, Citizen Movements"
    },
    como_trabajan: {
      es: "Proporciona subvenciones directas a organizaciones lideradas por mujeres a través de un enfoque liderado por movimientos, transfiriendo el poder de toma de decisiones a los movimientos. Trabaja a través del desarrollo de capacidades y la promoción.www.glob",
      en: "Provides direct grants to women-led organizations through movement-led approach, shifting decision-making power to movements. Works through capacity building and advocacy.www.glob"
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "San Francisco, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.globalfundforwomen.org/",
    email: "info@globalfundforwomen.org"
  },
  {
    id: 100,
    name: "Christensen Fund",
    description_es: "Apoya los derechos, la dignidad y la autodeterminación de los pueblos indígenas a través de un enfoque de diversidad biocultural. Se centra en el rico entrelazamiento de cultura y ecología.",
    description_en: "Supports Indigenous peoples' rights, dignity, and self-determination through biocultural diversity approach. Focuses on rich interweave of culture and ecology.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Comunidades Indígenas, Soberanía Alimentaria, Conservación de Recursos Naturales, Justicia Climática",
      en: "Indigenous Communities, Food Sovereignty, Natural Resources Conservation, Climate Justice"
    },
    como_trabajan: {
      es: "Proporciona subvenciones para el desarrollo de capacidades, la generación de conocimientos y la colaboración con custodios comunitarios de bienes biológicos y culturales reconocidos localmente.",
      en: "Provides grants for capacity building, knowledge generation, and collaboration with locally-recognized community custodians of biological and cultural"
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "San Francisco, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.christensenfund.org/",
    email: "info@christensenfund.org"
  },
  {
    id: 101,
    name: "Mama Cash",
    description_es: "El fondo internacional de mujeres más antiguo (fundado en 1983) que apoya los derechos humanos de mujeres, niñas y personas trans/intersexuales a nivel mundial.",
    description_en: "Oldest international women's fund (founded 1983) supporting women, girls, and trans/intersex people's human rights globally.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia de Género, LGTBIQ+, Derechos Laborales, Movimientos Ciudadanos",
      en: "Gender Justice, LGBTIQ+, Labor Rights, Citizen Movements"
    },
    como_trabajan: {
      es: "Proporciona subvenciones (entre 5.000 y 50.000 euros) a organizaciones dirigidas por mujeres, ofreciendo apoyo general y específico para proyectos con desarrollo de capacidades y oportunidades de creación de redes.",
      en: "Provides grants (€5,000-€50,000) to women-led organizations, offering general and project-specific support with capacity building and networking opportunities."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "Netherlands",
    country_es: "Países Bajos",
    ciudad: "Ámsterdam, Países Bajos",
    continent: "europa",
    latitude: 52.3676,
    longitude: 4.9041,
    website: "https://www.mamacash.org",
    email: "Contact via website form"
  },
  {
    id: 102,
    name: "Digital Freedom Fund",
    description_es: "Apoya el litigio estratégico para promover los derechos digitales en Europa, protegiendo los derechos humanos en los espacios digitales desde 2017.",
    description_en: "Supports strategic litigation to advance digital rights in Europe, protecting human rights in digital spaces since 2017.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Derechos Digitales, Justicia de Género, Justicia Racial, Gobernanza Global, políticas y rendición de cuentas",
      en: "Digital Rights, Gender Justice, Racial Justice, Gobernanza Global, políticas y rendición de cuentas"
    },
    como_trabajan: {
      es: "Proporciona subvenciones para costos de litigios, investigaciones previas al litigio y actividades posteriores al litigio. Facilita el desarrollo de habilidades y eventos de networking para litigantes de derechos digitales.",
      en: "Provides grants for litigation costs, pre-litigation research, and post-litigation activities. Facilitates skills development and networking events for digital rights litigators."
    },
    impacto_financiero: {
      es: "Europa Occidental",
      en: "Western Europe"
    },
    country: "Germany",
    country_es: "Alemania",
    ciudad: "Berlín, Alemania",
    continent: "europa",
    latitude: 52.52,
    longitude: 13.405,
    website: "https://digitalfreedomfund.org/",
    email: ""
  },
  {
    id: 103,
    name: "Dreilinden, GmbH",
    description_es: "Defende los derechos de las personas LGBTQI+ y de las mujeres/niñas, apoyando a las comunidades con diversidad de género, particularmente en el Sur y el Este Global.",
    description_en: "Champions rights of LGBTQI+ people and women/girls, supporting gender-diverse communities particularly in Global South and East.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "LGTBIQ+, Justicia de Género, Fortalecimiento de Capacidades Organizacionales",
      en: "LGBTIQ+, Gender Justice, Organizational Capacity Building"
    },
    como_trabajan: {
      es: "Proporciona subvenciones y realiza inversiones de impacto a organizaciones que luchan contra la discriminación y la violencia de género, utilizando un enfoque de filantropía transformadora.",
      en: "Provides grants and makes impact investments to organizations fighting gender-based discrimination and violence, using transformative philanthropy approach."
    },
    impacto_financiero: {
      es: "Europa Occidental",
      en: "Western Europe"
    },
    country: "Germany",
    country_es: "Alemania",
    ciudad: "Hamburgo, Alemania",
    continent: "europa",
    latitude: 52.52,
    longitude: 13.405,
    website: "https://dreilinden.org/",
    email: "info@dreilinden.org"
  },
  {
    id: 104,
    name: "Astraea Foundation",
    description_es: "Única organización filantrópica que trabaja exclusivamente para promover los derechos LGBTQI en todo el mundo, fundada en 1977 y centrada en lesbianas y mujeres de color.",
    description_en: "Only philanthropic organization working exclusively to advance LGBTQI rights worldwide, founded 1977 focusing on lesbians and women of color",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "LGTBIQ+, Justicia Racial, Justicia de Género, Justicia Económica, Movimientos Ciudadanos",
      en: "LGBTIQ+, Racial Justice, Gender Justice, Economic Justice, Citizen Movements"
    },
    como_trabajan: {
      es: "Proporciona subvenciones que dan prioridad a organizaciones de base lideradas por lesbianas, mujeres queer, personas trans, intersexuales y personas de color. Trabaja a través de la construcción de movimientos y el desarrollo de capacidades.",
      en: "Provides grants prioritizing grassroots organizations led by lesbians, queer women, trans, intersex people, and people of color. Works through movement building and capacity development."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.astraeafoundation.org/",
    email: "development@astraeafoundation.org"
  },
  {
    id: 105,
    name: "Joseph Rowntree Charitable Trust",
    description_es: "Un fideicomiso cuáquero que apoya a las personas que abordan las causas fundamentales del conflicto y la injusticia, desafiando los desequilibrios de poder en la sociedad. Otorga más de 100 subvenciones al año que superan los 10 millones de libras esterlinas.",
    description_en: "A Quaker trust supporting people who address root causes of conflict and injustice, challenging power imbalances in society. Makes over 100 grants annually exceeding £10 million.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Democracia, Paz y Resolución de Conflictos, Justicia Racial, Justicia Económica",
      en: "Democracy, Peace and Conflict Resolution, Racial Justice, Economic Justice"
    },
    como_trabajan: {
      es: "Trabaja a través de subvenciones (entre £10 000 y £70 000) a organizaciones con sede en el Reino Unido que se centran en la paz y la seguridad, los derechos y la justicia, y el poder y la rendición de cuentas. Utiliza métodos comerciales cuáqueros en la toma de decisiones. |",
      en: "Works through grants (£10,000-£70,000) to UK-based organizations focusing on peace and security, rights and justice, and power and accountability. Uses Quaker business methods in decision-making. |"
    },
    impacto_financiero: {
      es: "Europa Occidental (Reino Unido e Irlanda)",
      en: "Europa Occidental (Reino Unido e Irlanda)"
    },
    country: "United Kingdom",
    country_es: "Reino Unido",
    ciudad: "York, Reino Unido",
    continent: "europa",
    latitude: 51.5074,
    longitude: -0.1278,
    website: "https://www.jrct.org.uk/",
    email: "enquiries@jrct.org.uk"
  },
  {
    id: 106,
    name: "Charities Aid Foundation of America",
    description_es: "Organización benéfica pública estadounidense 501(c)(3) fundada en 1992 que hace que las donaciones nacionales e internacionales sean seguras, fáciles y efectivas para los donantes estadounidenses. Distribuyó más de 4.600 millones de dólares en subvenciones a nivel mundial.",
    description_en: "US 501(c)(3) public charity founded in 1992 making international and domestic giving safe, easy, and effective for US donors. Distributed over $4.6 billion in grants globally.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Fortalecimiento de Capacidades Organizacionales, Innovación Social, Participación Ciudadana",
      en: "Organizational Capacity Building, Social Innovation, Civic Participation"
    },
    como_trabajan: {
      es: "Agiliza la concesión de subvenciones globales a través de fondos asesorados por los donantes, investigación de antecedentes y protocolos de diligencia debida. Parte de CAF Global Alliance con una red de 1,9 millones de organizaciones elegibles en 135 países.",
      en: "Streamlines global grantmaking through donor-advised funds, vetting, and due diligence protocols. Part of CAF Global Alliance with network of 1.9 million eligible organizations in 135 countries."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Alexandria, Virginia, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.cafamerica.org/",
    email: "info@cafamerica.org"
  },
  {
    id: 107,
    name: "Freedom Fund",
    description_es: "Fondo global con el único objetivo de acabar con la esclavitud moderna, trabajando como catalizador en países y sectores donde la esclavitud es altamente prevalente desde 2013.",
    description_en: "Global fund with sole aim of ending modern slavery, working as catalyst in countries and sectors where slavery is highly prevalent since 2013.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Derechos Laborales, Protección de la Niñez, Justicia Económica, Justicia de Género",
      en: "Labor Rights, Child Protection, Economic Justice, Gender Justice"
    },
    como_trabajan: {
      es: "Invierte en organizaciones de primera línea a través del modelo de puntos críticos en regiones geográficas con alta incidencia de esclavitud. Proporciona subvenciones para intervenciones comunitarias, liderazgo de supervivientes y creación de movimientos.",
      en: "Invests in frontline organizations through hotspot model in geographic regions with high slavery incidence. Provides grants for community-based interventions, survivor leadership, and movement building."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "United Kingdom",
    country_es: "Reino Unido",
    ciudad: "Londres, Reino Unido",
    continent: "europa",
    latitude: 51.5074,
    longitude: -0.1278,
    website: "https://freedomfund.org/",
    email: "info@freedomfund.org"
  },
  {
    id: 108,
    name: "Women’s Fund Asia",
    description_es: "Fondo regional de mujeres que apoya los derechos humanos de mujeres, niñas y personas trans e intersexuales en 18 países asiáticos. Fundado en 2004 como Fondo de Mujeres del Sur de Asia.",
    description_en: "Regional women's fund supporting women, girls, trans, and intersex people's human rights across 18 Asian countries. Founded 2004 as South Asia Women's Fund.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia de Género, LGTBIQ+, Derechos Laborales, Justicia Climática",
      en: "Gender Justice, LGBTIQ+, Labor Rights, Climate Justice"
    },
    como_trabajan: {
      es: "Brinda apoyo fiscal y técnico a través de subvenciones a mujeres y organizaciones lideradas por personas trans. Se centra en la filantropía feminista, la construcción de movimientos y el fortalecimiento de las capacidades y redes de los socios.",
      en: "Provides fiscal and technical support through grants to women and trans-led organizations. Focuses on feminist philanthropy, movement building, and strengthening partner capacities and networks."
    },
    impacto_financiero: {
      es: "Asia Central, Asia Oriental",
      en: "Central Asia, East Asia"
    },
    country: "Sri Lanka",
    country_es: "Sri Lanka",
    ciudad: "Colombo, Sri Lanka",
    continent: "desconocido",
    latitude: 0,
    longitude: 0,
    website: "https://www.womensfundasia.org/",
    email: ""
  },
  {
    id: 109,
    name: "George Gund Foundation",
    description_es: "Fundación privada fundada en 1952 con el único propósito de contribuir al bienestar humano y al progreso de la sociedad. Con sede en Cleveland, ha otorgado más de $722 millones en subvenciones desde su creación. Segunda fundación más grande de Cleveland.",
    description_en: "Private foundation established 1952 with sole purpose of contributing to human well-being and society's progress. Cleveland-based, made over $722 million in grants since inception. Second-largest foundation in Cleveland.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Ciudades Sustentables, Educación de Calidad, Justicia Climática, Democracia",
      en: "Sustainable Cities, Quality Education, Climate Justice, Democracy"
    },
    como_trabajan: {
      es: "Otorga subvenciones principalmente en el Gran Cleveland enfocándose en justicia climática, cultura/arte, justicia económica, educación pública y justicia social. Los fideicomisarios se reúnen 3 veces al año (fechas límite: 15 de noviembre, 15 de marzo y 15 de julio). Adopta un enfoque basado en el lugar con una perspectiva de equidad.",
      en: "Makes grants primarily in Greater Cleveland focusing on climate justice, culture/arts, economic justice, public education, and social justice. Trustees meet 3 times yearly (deadlines: Nov 15, March 15, July 15). Takes place-based approach with equity lens."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Cleveland, Ohio, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://gundfoundation.org/",
    email: "info@gundfdn.org"
  },
  {
    id: 110,
    name: "Omidyar Network Fund",
    description_es: "Empresa de inversión filantrópica fundada en 2004 por el fundador de eBay, Pierre Omidyar, y su esposa Pam. Comprometió más de $1,94 mil millones para organizaciones sin fines de lucro y empresas con fines de lucro en múltiples áreas de inversión.",
    description_en: "Philanthropic investment firm founded 2004 by eBay founder Pierre Omidyar and wife Pam. Committed over $1.94 billion to nonprofit organizations and for-profit companies across multiple investment areas.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Derechos Digitales, Justicia Económica, Democracia, Gobernanza Global, políticas y rendición de cuentas",
      en: "Digital Rights, Economic Justice, Democracy, Gobernanza Global, políticas y rendición de cuentas"
    },
    como_trabajan: {
      es: "Opera como una fundación híbrida y una LLC que realiza subvenciones e inversiones. Se centra en doblar el arco de la revolución digital hacia el poder, la prosperidad y las posibilidades compartidos. Adopta un enfoque proactivo para la concesión de subvenciones en lugar de aceptar solicitudes no solicitadas.",
      en: "Operates as hybrid foundation and LLC making both grants and investments. Focuses on bending arc of digital revolution toward shared power, prosperity, and possibility. Takes proactive approach to grantmaking rather than accepting unsolicited applications."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Redwood City, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://omidyar.com",
    email: "info@omidyar.com"
  },
  {
    id: 111,
    name: "Howard Buffett Foundation",
    description_es: "Fundación familiar privada establecida en 1999 por Howard G. Buffett, hijo de Warren Buffett. Trabaja para mejorar el nivel de vida de las poblaciones más empobrecidas y marginadas del mundo. Invertido más de $1.4 mil millones desde su inicio.",
    description_en: "Private family foundation established 1999 by Howard G. Buffett, son of Warren Buffett. Works to improve standard of living for world's most impoverished and marginalized populations. Invested over $1.4 billion since inception.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Paz y Resolución de Conflictos, Soberanía Alimentaria, Conservación de Recursos Naturales",
      en: "Peace and Conflict Resolution, Food Sovereignty, Natural Resources Conservation"
    },
    como_trabajan: {
      es: "Proporciona capital catalizador para un cambio transformador y sostenible en tres áreas principales: seguridad alimentaria, seguridad hídrica y mitigación/resolución de conflictos/desarrollo posconflicto. No acepta propuestas no solicitadas. Trabaja principalmente en África, América Latina y Estados Unidos.",
      en: "Provides catalytic capital for sustainable, transformational change in three main areas: food security, water security, and conflict mitigation/resolution/post-conflict development. Does not accept unsolicited proposals. Primarily works in Africa, Latin America, and US."
    },
    impacto_financiero: {
      es: "África Subsahariana, América del Norte",
      en: "Sub-Saharan Africa, North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Decatur, Illinois, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.thehowardgbuffettfoundation.org/",
    email: "Phone: (217) 423-9286"
  },
  {
    id: 112,
    name: "World Wildlife Fund",
    description_es: "Una de las organizaciones conservacionistas más grandes del mundo, fundada en 1961, trabaja en más de 100 países para conservar especies en peligro de extinción y proteger la naturaleza.",
    description_en: "One of world's largest conservation organizations founded 1961, working in over 100 countries to conserve endangered species and protect nature.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales, Justicia Climática, Gobernanza Global, políticas y rendición de cuentas",
      en: "Natural Resources Conservation, Climate Justice, Gobernanza Global, políticas y rendición de cuentas"
    },
    como_trabajan: {
      es: "Trabaja a través de asociaciones a nivel local y global centrándose en la conservación de la vida silvestre, la protección del hábitat y el abordaje de amenazas globales como el cambio climático. Proporciona subvenciones e implementa programas de conservación directa.",
      en: "Works through partnerships at local to global levels focusing on wildlife conservation, habitat protection, and addressing global threats like climate change. Provides grants and implements direct conservation programs."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "Suiza (Sede Internacional)",
    country_es: "Suiza (Sede Internacional)",
    ciudad: "Gland, Suiza (Sede Internacional)",
    continent: "desconocido",
    latitude: 0,
    longitude: 0,
    website: "https://www.worldwildlife.org/",
    email: "membership@worldwildlife.org"
  },
  {
    id: 113,
    name: "Bloomberg Philanthropies",
    description_es: "Abarca todas las actividades caritativas de Mike Bloomberg, trabajando para garantizar vidas mejores y más largas para el mayor número de personas. Invirtió 3.700 millones de dólares a nivel mundial en 2024",
    description_en: "Encompasses all of Mike Bloomberg's charitable activities, working to ensure better, longer lives for greatest number of people. Invested $3.7 billion globally in 2024",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Ciudades Sustentables, Salud Global, Justicia Climática, Innovación Social",
      en: "Sustainable Cities, Global Health, Climate Justice, Social Innovation"
    },
    como_trabajan: {
      es: "Otorga subvenciones solo por invitación en cinco áreas clave: arte, educación, medio ambiente, innovación gubernamental y salud pública. Trabaja con socios y alcaldes existentes a través de la consultoría Bloomberg Associates.",
      en: "Makes grants by invitation only in five key areas: arts, education, environment, government innovation, and public health. Works with existing partners and mayors through Bloomberg Associates consultancy."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.bloomberg.org/",
    email: "communications@bloomberg.org"
  },
  {
    id: 114,
    name: "Lumos Foundation",
    description_es: "ONG internacional fundada en 2005 por J.K. Rowling para poner fin a la institucionalización de niños en todo el mundo. El nombre se debe al hechizo de Harry Potter que trae luz a la oscuridad. Trabaja para reunir a unos 5,4 millones de niños institucionalizados con sus familias.",
    description_en: "International NGO founded 2005 by J.K. Rowling to end institutionalization of children worldwide. Named after Harry Potter spell bringing light to darkness. Works to reunite estimated 5.4 million institutionalized children with families.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Protección de la Niñez, Derechos de las Infancias, Educación de Calidad",
      en: "Child Protection, Children's Rights, Quality Education"
    },
    como_trabajan: {
      es: "Apoya a los países en la reforma de los sistemas de cuidado y protección infantil centrándose en los servicios de salud, educación y atención social que mantienen unidas a las familias. Trabaja en todos los niveles para transformar sistemas obsoletos en sistemas que apoyen a los niños y permitan futuros positivos.",
      en: "Supports countries in reforming child care and protection systems focusing on health, education, and social care services that keep families together. Works at every level to transform outdated systems into ones supporting children and enabling positive futures."
    },
    impacto_financiero: {
      es: "Europa del Este, Todas",
      en: "Eastern Europe, All regions"
    },
    country: "United Kingdom",
    country_es: "Reino Unido",
    ciudad: "Londres, Reino Unido",
    continent: "europa",
    latitude: 51.5074,
    longitude: -0.1278,
    website: "https://wearelumos.org/",
    email: "info@wearelumos.org"
  },
  {
    id: 115,
    name: "Schmidt Futures",
    description_es: "Iniciativa filantrópica fundada en 2017 por Eric y Wendy Schmidt. Apuesta desde temprano por personas excepcionales que hacen el mundo mejor. Comprometió más de $1,94 mil millones de dólares para iniciativas en la intersección del talento y la tecnología.",
    description_en: "Philanthropic initiative founded 2017 by Eric and Wendy Schmidt. Bets early on exceptional people making the world better. Committed over $1.94 billion to initiatives at intersection of talent and technology.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Innovación Social, Educación de Calidad, Salud Global, Juventud",
      en: "Social Innovation, Quality Education, Global Health, Youth"
    },
    como_trabajan: {
      es: "Utiliza diversas herramientas, como obsequios, subvenciones, inversiones y actividades de inicio, para esfuerzos caritativos, educativos y comerciales con fines públicos. Conecta a personas talentosas a través de redes y competencias, centrándose en problemas difíciles de la ciencia y la sociedad a través de la inteligencia artificial y las tecnologías emergentes.",
      en: "Uses diverse tools, such as gifts, grants, investments, and startup activity, for charitable, educational, and commercial efforts with public purpose. Connects talented individuals through networks and competitions, focusing on hard problems in science and society through AI and emerging technologies."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.schmidtfutures.com/",
    email: ""
  },
  {
    id: 116,
    name: "Alianza Fondos del Sur",
    description_es: "Fortalece la filantropía comunitaria y nacional en América Latina mediante el apoyo a fondos de miembros (fundaciones comunitarias) y alianzas socioambientales que fomentan el desarrollo liderado por la comunidad y la movilización de recursos desde cero. Área de enfoque: desarrollo liderado por la comunidad, filantropía comunitaria, justicia socioambiental, movilización de recursos (américa latina).",
    description_en: "Strengthens community and domestic philanthropy across Latin America by supporting member funds (community foundations) and socio-environmental alliances that foster community-led development and resource mobilization from the ground up. Focus area: community-led development, community philanthropy, socio-environmental justice, resource mobilization (latin america).",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Fortalecimiento de Capacidades Organizacionales, Justicia Económica, Gobernanza Global, políticas y rendición de cuentas",
      en: "Organizational Capacity Building, Economic Justice, Gobernanza Global, políticas y rendición de cuentas"
    },
    como_trabajan: {
      es: "Principalmente apoya y financia a sus organizaciones miembros (fondos comunitarios). El financiamiento está dirigido al desarrollo de capacidades y la promoción del aprendizaje entre pares entre sus miembros para fortalecer el ecosistema filantrópico regional. No es un donante directo para ONG en general.",
      en: "Primarily supports and funds its member organizations (community funds). Funding is directed toward capacity building and promoting peer learning among its members to strengthen the regional philanthropy ecosystem. Not a direct grantmaker to general NGOs."
    },
    impacto_financiero: {
      es: "América del Sur",
      en: "South America"
    },
    country: "",
    country_es: "Distribuida (Sede rotativa entre miembros del Sur Global)",
    ciudad: "Distribuida (Sede rotativa entre miembros del Sur Global)",
    continent: "desconocido",
    latitude: 0,
    longitude: 0,
    website: "https://alianzafondosdelsur.org/",
    email: "info@alianzafondosdelsur.org"
  },
  {
    id: 117,
    name: "Youth Climate Justice Fund",
    description_es: "Financia y empodera a grupos emergentes de justicia climática y socioambientales liderados por jóvenes a nivel mundial, utilizando un proceso participativo de toma de decisiones para garantizar que las subvenciones se destinen a líderes juveniles marginados que abordan la acción climática, la equidad y el poder comunitario.",
    description_en: "Funds and empowers emerging youth-led climate justice and socio-environmental groups globally, using a participatory decision-making process to ensure grants go to marginalized youth leaders addressing climate action, equity, and community power.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Juventud, Justicia Climática, Movimientos Ciudadanos, Participación Ciudadana",
      en: "Youth, Climate Justice, Citizen Movements, Civic Participation"
    },
    como_trabajan: {
      es: "Utiliza convocatorias abiertas para solicitudes de financiación (aunque no siempre anuales), con un proceso de revisión participativo que involucra a comités regionales. Se centra en grupos no partidistas y no violentos liderados por jóvenes (menores de 35 años), incluidos aquellos con liderazgo marginado.",
      en: "Utilizes open calls for funding applications (though not always annual), with a participatory review process involving regional committees. Focuses on non-partisan, non-violent, youth-led groups (under 35), including those with marginalized leadership."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "Belgium",
    country_es: "Bélgica",
    ciudad: "Bruselas, Bélgica",
    continent: "europa",
    latitude: 50.8503,
    longitude: 4.3517,
    website: "https://ycjf.org/",
    email: "ask@ycjf.org / hello@ycjf.org"
  },
  {
    id: 118,
    name: "Global Fund for Communities Foundations",
    description_es: "Hace crecer la filantropía comunitaria como pilar central del desarrollo liderado por las personas a nivel mundial, proporcionando pequeñas subvenciones y apoyo técnico para ayudar a las organizaciones filantrópicas comunitarias incipientes y establecidas a desarrollar activos, voz y poder locales.",
    description_en: "Grows community philanthropy as a core pillar of people-led development globally, providing small grants and technical support to help nascent and established community philanthropy organizations build local assets, voice, and power.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Fortalecimiento de Capacidades Organizacionales, Participación Ciudadana, Justicia Económica",
      en: "Organizational Capacity Building, Civic Participation, Economic Justice"
    },
    como_trabajan: {
      es: "Proporciona pequeñas subvenciones y apoyo principalmente a organizaciones filantrópicas comunitarias (por ejemplo, fundaciones comunitarias). Por lo general, no financia directamente ONG de filantropía no comunitaria, pero busca influir en debates más amplios sobre el desarrollo.",
      en: "Provides small grants and support primarily to community philanthropy organizations (e.g., community foundations). It generally does not fund non-community-philanthropy NGOs directly but seeks to influence broader development debates."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "South Africa",
    country_es: "Sudáfrica",
    ciudad: "Johannesburgo, Sudáfrica",
    continent: "africa",
    latitude: -25.7479,
    longitude: 28.2293,
    website: "https://globalfundcommunityfoundations.org/",
    email: "info@globalfundcf.org"
  },
  {
    id: 119,
    name: "Tamalpais Trust",
    description_es: "Apoya organizaciones y fondos liderados por indígenas en las Américas y el Ártico Circumpolar, promoviendo y revitalizando las lenguas indígenas, los conocimientos tradicionales, los sistemas alimentarios y la gestión ambiental, al tiempo que promueve las cosmovisiones indígenas dentro de la filantropía.",
    description_en: "Supports indigenous-led organizations and funds across the Americas and the Circumpolar Arctic, promoting and revitalizing indigenous languages, traditional knowledge, food systems, and environmental stewardship, while advancing indigenous worldviews within philanthropy.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Comunidades Indígenas, Soberanía Alimentaria, Conservación de Recursos Naturales",
      en: "Indigenous Communities, Food Sovereignty, Natural Resources Conservation"
    },
    como_trabajan: {
      es: "Opera principalmente con un enfoque basado en relaciones; generalmente no considera propuestas no solicitadas debido a un presupuesto de subvención modesto y un equipo pequeño. La mayor parte de la financiación se dirige a través de invitaciones estratégicas a socios dentro de sus regiones prioritarias (Isla Tortuga, Abya Yala, Ártico Circumpolar, Moananuiākea).",
      en: "Operates primarily with a relationship-based approach; generally does not consider unsolicited proposals due to a modest grant budget and small team. Most funding is directed through strategic invitations to partners within their priority regions (Turtle Island, Abya Yala, Circumpolar Arctic, Moananuiākea)."
    },
    impacto_financiero: {
      es: "América del Norte, (ártico)",
      en: "North America, (ártico)"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "San Rafael, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.tamtrust.org/es/",
    email: "navigationcouncil@tamtrust.org"
  },
  {
    id: 120,
    name: "Appleton Foundation",
    description_es: "Promueve la innovación y el enriquecimiento educativo dentro de un distrito escolar específico (Distrito Escolar del Área de Appleton) proporcionando subvenciones a educadores y personal para proyectos creativos, enriquecimiento de contenidos y desarrollo de habilidades que no están cubiertos por los presupuestos escolares normales.",
    description_en: "Promotes educational innovation and enrichment within a specific school district (Appleton Area School District) by providing grants to educators and staff for creative projects, content enrichment, and skills development not covered by normal school budgets.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Educación de Calidad, Salud Global, Innovación Social",
      en: "Quality Education, Global Health, Social Innovation"
    },
    como_trabajan: {
      es: "Gestiona un ciclo de subvenciones abierto y competitivo para educadores y personal dentro del distrito escolar. Los solicitantes envían propuestas a través de un Portal de subvenciones dentro de los plazos especificados. Favorece proyectos que demuestran un éxito mensurable y un uso creativo de la tecnología.",
      en: "Manages an open, competitive grant cycle for educators and staff within the school district. Applicants submit proposals through a Grant Portal within specified deadlines. Favors projects that demonstrate measurable success and creative use of technology."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "Canada",
    country_es: "Canadá",
    ciudad: "Toronto, Canadá",
    continent: "america",
    latitude: 45.4215,
    longitude: -75.6972,
    website: "https://appletonfoundation.org/",
    email: "info@appletoneducationfoundation.org / grants@appletoneducationfoundation.org"
  },
  {
    id: 121,
    name: "Inter-American Foundation",
    description_es: "Fortalece la gobernabilidad democrática y amplía las oportunidades económicas en América Latina y el Caribe al otorgar subvenciones directamente a organizaciones de base que lideran proyectos de desarrollo, enfatizando el impacto local, el autogobierno y la lucha contra la corrupción.",
    description_en: "Strengthens democratic governance and expands economic opportunities in Latin America and the Caribbean by providing grants directly to grassroots organizations that lead development projects, emphasizing local impact, self-governance, and combating corruption.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Económica, Participación Ciudadana, Soberanía Alimentaria, Paz y Resolución de Conflictos",
      en: "Economic Justice, Civic Participation, Food Sovereignty, Peace and Conflict Resolution"
    },
    como_trabajan: {
      es: "Opera un proceso de solicitud abierto y competitivo para organizaciones de base en América Latina y el Caribe. Las propuestas se evalúan en función de la participación comunitaria, el impacto local y el potencial para fortalecer la capacidad local y el autogobierno.",
      en: "Operates a competitive, open application process for grassroots organizations in Latin America and the Caribbean. Proposals are evaluated based on community participation, local impact, and potential for strengthening local capacity and self-governance."
    },
    impacto_financiero: {
      es: "América Central, América del Sur",
      en: "Central America, South America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Washington D.C., EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.iaf.gov/",
    email: "proposals@iaf.gov"
  },
  {
    id: 122,
    name: "Ayni Indigenous Women Fund",
    description_es: "Moviliza recursos humanos, financieros y materiales para apoyar a las organizaciones de mujeres indígenas a nivel mundial en el fortalecimiento de su capacidad y la implementación de proyectos enfocados en reducir las violaciones de derechos, mejorar las condiciones de vida y respetar la madre tierra.",
    description_en: "Mobilizes human, financial, and material resources to support indigenous women's organizations globally in strengthening their capacity and implementing projects focused on reducing rights violations, improving living conditions, and respecting mother earth",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Comunidades Indígenas, Justicia de Género, Soberanía Alimentaria, Justicia Climática",
      en: "Indigenous Communities, Gender Justice, Food Sovereignty, Climate Justice"
    },
    como_trabajan: {
      es: "Realiza convocatorias abiertas de propuestas dirigidas específicamente a organizaciones de mujeres indígenas. Ofrece métodos de envío flexibles (plataforma en línea o correo electrónico) y pretende utilizar prácticas de evaluación y seguimiento culturalmente sensibles.",
      en: "Conducts open calls for proposals directed specifically at indigenous women's organizations. Offers flexible submission methods (online platform or email) and aims to use culturally sensitive evaluation and monitoring practices."
    },
    impacto_financiero: {
      es: "América del Norte, América del Sur",
      en: "North America, South America"
    },
    country: "Peru",
    country_es: "Perú",
    ciudad: "Lima, Perú",
    continent: "america",
    latitude: -12.0464,
    longitude: -77.0428,
    website: "",
    email: "lfs.ayni@iiwf.org"
  },
  {
    id: 123,
    name: "International Funders for Indigenous Peoples",
    description_es: "Único grupo global de afinidad de donantes dedicado exclusivamente a los pueblos indígenas de todo el mundo, fundado en 2006. Trabaja con más de 370 millones de pueblos indígenas en más de 90 países, lo que representa el 5 % de la población mundial.",
    description_en: "Only global donor affinity group dedicated solely to Indigenous Peoples worldwide, founded 2006. Works with 370+ million Indigenous people across 90+ countries representing 5% of global population.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Comunidades Indígenas, Gobernanza Global, políticas y rendición de cuentas, Fortalecimiento de Capacidades Organizacionales",
      en: "Indigenous Communities, Gobernanza Global, políticas y rendición de cuentas, Organizational Capacity Building"
    },
    como_trabajan: {
      es: "Fomenta soluciones y asociaciones indígenas a través del desarrollo de capacidades, servicios para miembros, comunicaciones, investigaciones y reuniones regionales. Transforma las relaciones de financiación en entendimiento mutuo, organizando conferencias que reúnen a donantes y líderes indígenas para establecer relaciones filantrópicas.",
      en: "Fosters Indigenous solutions and partnerships through capacity building, membership services, communications, research, and regional meetings. Transforms funding relationships to mutual understanding, organizing conferences bringing donors and Indigenous leaders together for relationship philanthropy."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "San Francisco, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://internationalfunders.org/",
    email: "info@internationalfunders.org"
  },
  {
    id: 124,
    name: "Arctic Funders Collaborative (AFC) ",
    description_es: "Pequeña red de financiadores filantrópicos que invierten en el Ártico desde 2018 para apoyar los esfuerzos de colaboración para que las comunidades, las culturas y los ecosistemas del Ártico prosperen. Proyecto en la plataforma compartida de Makeway en Canadá.",
    description_en: "Small network of philanthropic funders investing in Arctic since 2018 to support collaborative efforts for Arctic communities, cultures, and ecosystems to thrive. Project on Makeway's shared platform in Canada.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Comunidades Indígenas, Conservación de Recursos Naturales",
      en: "Climate Justice, Indigenous Communities, Natural Resources Conservation"
    },
    como_trabajan: {
      es: "Promueve la concesión de subvenciones informada y eficaz que apoye comunidades y ecosistemas árticos saludables. Proporciona servicios de gobernanza, recursos humanos, financieros y de gestión de subvenciones. Se asocia con organizaciones indígenas para defender la reciprocidad y la fuerza colectiva en las comunidades indígenas.",
      en: "Promotes informed and effective grantmaking supporting healthy Arctic communities and ecosystems. Provides governance, human resources, financial, and grant management services. Partners with Indigenous organizations to uphold reciprocity and collective strength in Indigenous communities."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "Canada",
    country_es: "Canadá",
    ciudad: "Yellowknife, Canadá",
    continent: "america",
    latitude: 45.4215,
    longitude: -75.6972,
    website: "https://www.arcticfunders.com/",
    email: ""
  },
  {
    id: 125,
    name: "Arctic Indigenous Fund",
    description_es: "Una iniciativa liderada por indígenas se lanzó en 2018 y empodera a jóvenes líderes indígenas del Ártico para que decidan cómo se distribuyen los fondos filantrópicos en las comunidades del norte. Desarrollado en colaboración con Arctic Funders Collaborative. Guiado por asesores de las comunidades inuit, dene y sami.",
    description_en: "Indigenous-led initiative launched 2018 empowering young Indigenous leaders in Arctic to decide how philanthropic funding is distributed across Northern communities. Developed in collaboration with Arctic Funders Collaborative. Guided by Inuit, Dene, and Sámi community advisors.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Comunidades Indígenas, Justicia Climática, Soberanía Alimentaria",
      en: "Indigenous Communities, Climate Justice, Food Sovereignty"
    },
    como_trabajan: {
      es: "Asigna fondos basándose en temas anuales como \"Sanación a través del lenguaje\" y \"Juventud indígena\" que abordan las prioridades de la comunidad. Apoya la autodeterminación indígena, la preservación cultural y el desarrollo liderado por la comunidad en todo el Ártico circumpolar. Centros Los valores indígenas remodelan la filantropía para respetar las formas de vida indígenas.",
      en: "Allocates funds based on annual themes like \"Healing through Language\" and \"Indigenous Youth\" addressing community priorities. Supports Indigenous self-determination, cultural preservation, and community-led development across circumpolar Arctic. Centers Indigenous values reshaping philanthropy to respect Indigenous lifeways."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Fairbanks, Alaska, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "",
    email: ""
  },
  {
    id: 126,
    name: "First Peoples’ Cultural Foundation",
    description_es: "Invierte en la vitalidad del idioma, las artes y el patrimonio cultural de los pueblos originarios de Columbia Británica, Canadá, proporcionando subvenciones y recursos que apoyan iniciativas lideradas por la comunidad centradas en la revitalización y expresión cultural.",
    description_en: "Invests in the vitality of First Peoples’ language, arts, and cultural heritage in British Columbia, Canada, by providing grants and resources that support community-led initiatives focused on cultural revitalization and expression.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Comunidades Indígenas, Educación de Calidad, Conservación de Recursos Naturales",
      en: "Indigenous Communities, Quality Education, Natural Resources Conservation"
    },
    como_trabajan: {
      es: "Gestiona programas de subvenciones específicos con convocatorias abiertas para comunidades y organizaciones indígenas en B.C. Utilizan un proceso de solicitud accesible e informado por la comunidad, y a menudo priorizan la financiación plurianual.",
      en: "Manages specific grant programs with open application calls for Indigenous communities and organizations in B.C. They use an accessible, community-informed application process, often prioritizing multi-year funding."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "Canada",
    country_es: "Canadá",
    ciudad: "Brentwood Bay, Canadá",
    continent: "america",
    latitude: 45.4215,
    longitude: -75.6972,
    website: "https://www.firstpeoples.org/",
    email: "info@fpcf.ca"
  },
  {
    id: 127,
    name: "Na’ah Illahee Fund",
    description_es: "Apoya el cambio social liderado por mujeres indígenas en el noroeste del Pacífico (EE. UU. y Canadá) proporcionando pequeñas subvenciones que abordan la justicia ambiental, la soberanía territorial, la resiliencia climática y la revitalización cultural de mujeres y niñas.",
    description_en: "Supports Indigenous women-led social change in the Pacific Northwest (US and Canada) by providing small grants that address environmental justice, land sovereignty, climate resilience, and the cultural revitalization of women and girls.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Comunidades Indígenas, Justicia de Género, Soberanía Alimentaria, Justicia Climática",
      en: "Indigenous Communities, Gender Justice, Food Sovereignty, Climate Justice"
    },
    como_trabajan: {
      es: "Utiliza principalmente un proceso de solicitud abierto para ciclos de subvenciones específicos, invitando a propuestas de organizaciones lideradas por mujeres indígenas y grupos de base en su región de enfoque. Priorizan la financiación basada en relaciones.",
      en: "Primarily uses an open application process for specific grant cycles, inviting proposals from Indigenous women-led organizations and grassroots groups in their focus region. They prioritize relationship-based funding."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Seattle, Washington, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://naahillahee.org/",
    email: "info@naahillahee.org"
  },
  {
    id: 128,
    name: "Seventh Generation Fund",
    description_es: "Organización sin fines de lucro liderada por indígenas fundada en 1977 dedicada a la autodeterminación y la soberanía de las naciones nativas de los pueblos indígenas. Nombrado en honor al precepto de la Gran Ley Haudenosaunee considerando siete generaciones futuras.",
    description_en: "Indigenous-led nonprofit founded 1977 dedicated to Indigenous Peoples' self-determination and sovereignty of Native nations. Named after Haudenosaunee Great Law precept considering seven generations ahead.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Comunidades Indígenas, Movimientos Ciudadanos, Conservación de Recursos Naturales, Paz y Resolución de Conflictos",
      en: "Indigenous Communities, Citizen Movements, Natural Resources Conservation, Peace and Conflict Resolution"
    },
    como_trabajan: {
      es: "Proporciona subvenciones y gestión fiscal a comunidades indígenas de base a través de un programa de afiliados. Se centra en la revitalización cultural, el desarrollo del liderazgo, los entornos saludables y la justicia social para las comunidades indígenas transnacionales.",
      en: "Provides grants and fiscal management to grassroots Indigenous communities through affiliate program. Focuses on cultural revitalization, leadership development, healthy environments, and social justice for Indigenous communities transnational"
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Arcata, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://7genfund.org/",
    email: ""
  },
  {
    id: 129,
    name: "Cultural Conservancy",
    description_es: "Protege y restaura las culturas, lenguas y tierras ancestrales indígenas a través de proyectos impulsados ​​por la comunidad, gestión ambiental, educación cultural y medios de comunicación, conectando a las personas con la historia viva y el conocimiento tradicional de sus lugares.",
    description_en: "Protects and restores Indigenous cultures, languages, and ancestral lands through community-driven projects, environmental stewardship, cultural education, and media, connecting people with the living history and traditional knowledge of their places.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Comunidades Indígenas, Soberanía Alimentaria, Conservación de Recursos Naturales",
      en: "Indigenous Communities, Food Sovereignty, Natural Resources Conservation"
    },
    como_trabajan: {
      es: "No funciona como una fundación tradicional que otorga subvenciones. Es una organización sin fines de lucro que se asocia con comunidades en proyectos colaborativos, brindando implementación, recursos y consultas.",
      en: "Does not operate as a traditional grant-making foundation. It is a non-profit organization that partners with communities on collaborative projects, providing implementation, resources, and consultation."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "San Francisco, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.nativeland.org/",
    email: "info@nativeland.org"
  },
  {
    id: 130,
    name: "Native Voices Rising",
    description_es: "Fortalece la organización, el cambio de políticas y el compromiso cívico liderados por nativos al servir como un fondo colaborativo que otorga recursos directamente a organizaciones nativas sin fines de lucro que trabajan por la justicia y la soberanía en todo Estados Unidos.",
    description_en: "Strengthens Native-led organizing, policy change, and civic engagement by serving as a collaborative fund that regrants resources directly to Native non-profit organizations working for justice and sovereignty across the U.S.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Comunidades Indígenas, Participación Ciudadana, Democracia, Movimientos Ciudadanos",
      en: "Indigenous Communities, Civic Participation, Democracy, Citizen Movements"
    },
    como_trabajan: {
      es: "Utiliza una convocatoria abierta de propuestas para ciclos de subvenciones específicos. Como colaboración, revisa las solicitudes y desembolsa fondos a grupos de base liderados por nativos que realizan cambios de sistemas y construcción de movimientos.",
      en: "Utilizes an open call for proposals for specific grant cycles. As a collaborative, it reviews applications and disburses funds to grassroots Native-led groups doing systems change and movement building."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Oakland, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://nativevoicesrising.org/",
    email: "info@nativevoicesrising.org"
  },
  {
    id: 131,
    name: "Cultural Survival",
    description_es: "Organización sin fines de lucro liderada por indígenas fundada en 1972 que defiende los derechos de los pueblos indígenas, apoya la autodeterminación, las culturas y la resiliencia política. Trabaja en más de 70 países con 49 empleados.",
    description_en: "Indigenous-led nonprofit founded 1972 advocating for Indigenous Peoples' rights, supporting self-determination, cultures, and political resilience. Works in over 70 countries with 49 staff.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Comunidades Indígenas, Derechos Digitales (Radio comunitaria), Conservación de Recursos Naturales",
      en: "Indigenous Communities, Derechos Digitales (Radio comunitaria), Natural Resources Conservation"
    },
    como_trabajan: {
      es: "Proporciona subvenciones a través del Fondo Keepers of the Earth y el Fondo de Medios Comunitarios Indígenas. Ofrece desarrollo de capacidades, promoción y apoyo a las comunicaciones indígenas. Tiene estatus consultivo en el ECOSOC de la ONU.",
      en: "Provides grants through Keepers of the Earth Fund and Indigenous Community Media Fund. Offers capacity building, advocacy, and Indigenous communications support. Holds UN ECOSOC consultative status."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Cambridge, Massachusetts, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.culturalsurvival.org/es",
    email: ""
  },
  {
    id: 132,
    name: "Indigenous Peoples Resilience Fund",
    description_es: "Financia proyectos autodeterminados liderados por comunidades, grupos y organizaciones indígenas en todo Canadá, centrándose en abordar los impactos de COVID-19 y apoyando estrategias comunitarias para el bienestar, la curación, la cultura y la infraestructura.",
    description_en: "Funds self-determined projects led by Indigenous communities, groups, and organizations across Canada, focusing on addressing the impacts of COVID-19 and supporting community-based strategies for wellness, healing, culture, and infrastructure.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Comunidades Indígenas, Justicia Climática, Soberanía Alimentaria, Salud Global",
      en: "Indigenous Communities, Climate Justice, Food Sovereignty, Global Health"
    },
    como_trabajan: {
      es: "Gestiona convocatorias abiertas de solicitudes dirigidas específicamente a grupos y comunidades liderados por indígenas en Canadá. El proceso de solicitud está diseñado para ser accesible y culturalmente apropiado, priorizando el rápido despliegue de fondos.",
      en: "Manages open calls for applications specifically directed at Indigenous-led groups and communities in Canada. The application process is designed to be accessible and culturally appropriate, prioritizing rapid deployment of funds."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "Canada",
    country_es: "Canadá",
    ciudad: "Ottawa, Canadá",
    continent: "america",
    latitude: 45.4215,
    longitude: -75.6972,
    website: "https://indigenouspeoplesfund.org",
    email: "info@iprfund.ca"
  },
  {
    id: 133,
    name: "Ulnooweg Indigenous Communities Foundation",
    description_es: "Empodera a las comunidades indígenas del Atlántico canadiense (Mi'kmaq, Wolastoqiyik, Passamaquoddy) brindándoles apoyo financiero y de asesoramiento para la educación, el espíritu empresarial y el desarrollo económico, fortaleciendo la gobernanza local y la autosuficiencia.",
    description_en: "Empowers Indigenous communities in Atlantic Canada (Mi'kmaq, Wolastoqiyik, Passamaquoddy) by providing financial and advisory support for education, entrepreneurship, and economic development, strengthening local governance and self-sufficiency.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Comunidades Indígenas, Justicia Económica, Educación de Calidad",
      en: "Indigenous Communities, Economic Justice, Quality Education"
    },
    como_trabajan: {
      es: "Administra diversos programas y solicitudes de subvenciones con convocatorias abiertas específicas relacionadas con el emprendimiento y el desarrollo económico comunitario. También brindan servicios de asesoría directa y acceso a capital.",
      en: "Administers various programs and grant applications with specific open calls related to entrepreneurship and community economic development. They also provide direct advisory services and capital access."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "Canada",
    country_es: "Canadá",
    ciudad: "Truro, Nueva Escocia, Canadá",
    continent: "america",
    latitude: 45.4215,
    longitude: -75.6972,
    website: "https://ulnoowegfoundation.ca",
    email: "info@ulnooweg.ca"
  },
  {
    id: 134,
    name: "Porticus",
    description_es: "Organización filantrópica que crea un futuro justo y sostenible donde florezca la dignidad humana, fundada en 1995 por la familia Brenninkmeijer.",
    description_en: "Philanthropic organization creating just and sustainable future where human dignity flourishes, founded 1995 by Brenninkmeijer family.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Educación de Calidad, Justicia Climática, Protección de la Niñez, Justicia Económica",
      en: "Quality Education, Climate Justice, Child Protection, Economic Justice"
    },
    como_trabajan: {
      es: "Trabaja a través de asociaciones con ONG, comunidades y formuladores de políticas locales y globales centrándose en el medio ambiente natural, las sociedades, la educación y la fe para el cambio sistémico.",
      en: "Works through partnerships with local and global NGOs, communities, and policymakers focusing on natural environment, societies, education, and faith for systemic change."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "Netherlands",
    country_es: "Países Bajos",
    ciudad: "Ámsterdam, Países Bajos",
    continent: "europa",
    latitude: 52.3676,
    longitude: 4.9041,
    website: "https://www.porticus.com",
    email: "Contact via regional offices"
  },
  {
    id: 135,
    name: "Allegany Franciscan Ministries",
    description_es: "Trabaja para eliminar la pobreza estructural y desmantelar el racismo en tres regiones de Florida, proporcionando recursos financieros y no financieros para fortalecer los sistemas comunitarios y fomentar la salud, la seguridad económica y la equidad.",
    description_en: "Works to eliminate structural poverty and dismantle racism in three regions of Florida, providing financial and non-financial resources to strengthen community-based systems and foster health, economic security, and equity.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Salud Global, Justicia Económica, Participación Ciudadana",
      en: "Global Health, Economic Justice, Civic Participation"
    },
    como_trabajan: {
      es: "Opera principalmente a través de invitaciones a organizaciones dentro de sus regiones de enfoque y ocasionalmente emite solicitudes de propuestas (RFP) alineadas con prioridades estratégicas específicas. Se centra en una comunidad profunda y de largo plazo.",
      en: "Operates primarily through invitations to organizations within its focus regions and occasionally issues requests for proposals (RFPs) aligned with specific strategic priorities. Focuses on deep, long-term community"
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Palm Harbor, Florida, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://afmfl.org/",
    email: "grants@alleganyfm.org"
  },
  {
    id: 136,
    name: "An Environmental Trust, Inc.",
    description_es: "Preserva los recursos naturales y promueve la educación ambiental en Nuevo México, brindando subvenciones a organizaciones involucradas en la conservación, la administración y las iniciativas educativas enfocadas en proteger los ecosistemas únicos del estado.",
    description_en: "Preserves natural resources and promotes environmental education in New Mexico, providing grants to organizations engaged in conservation, stewardship, and educational initiatives focused on protecting the unique ecosystems of the state.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales, Justicia Climática",
      en: "Natural Resources Conservation, Climate Justice"
    },
    como_trabajan: {
      es: "Mantiene un proceso de solicitud abierto con fechas límite de presentación específicas, invitando propuestas de organizaciones sin fines de lucro que trabajan en la conservación y educación ambiental dentro de Nuevo México.",
      en: "Maintains an open application process with specific submission deadlines, inviting proposals from non-profit organizations working in environmental conservation and education within New Mexico."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Filadelfia, Pensilvania, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "N/I",
    email: "grants@aet-inc.org"
  },
  {
    id: 137,
    name: "Argosy Foundation",
    description_es: "Apoya a organizaciones centradas en la justicia social, los derechos humanos y civiles, la educación y la conservación del medio ambiente, buscando soluciones innovadoras y promoviendo la equidad a nivel mundial a través de diversas áreas de programas.",
    description_en: "Supports organizations focused on social justice, human and civil rights, education, and environmental conservation, seeking innovative solutions and promoting equity globally through various program areas.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Innovación Social, Educación de Calidad, Conservación de Recursos Naturales",
      en: "Social Innovation, Quality Education, Natural Resources Conservation"
    },
    como_trabajan: {
      es: "No acepta propuestas no solicitadas. La concesión de subvenciones se realiza mediante invitación únicamente a organizaciones con las que la fundación tiene una relación preexistente o aquellas identificadas a través de investigaciones estratégicas.",
      en: "Does not accept unsolicited proposals. Grantmaking is conducted through invitation only to organizations with which the foundation has a pre-existing relationship or those identified through strategic research."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Milwaukee, Wisconsin, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.argosyfnd.org",
    email: "info@argosyf.org"
  },
  {
    id: 138,
    name: "As You Sow Foundation",
    description_es: "Promueve la responsabilidad social y ambiental corporativa a través de la defensa de los accionistas, estrategias legales innovadoras y educación, influyendo en las grandes corporaciones para que adopten prácticas sustentables y reduzcan su huella ambiental y social.",
    description_en: "Promotes corporate social and environmental responsibility through shareholder advocacy, innovative legal strategies, and education, influencing large corporations to adopt sustainable practices and reduce their environmental and social footprint.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Economía Circular, Justicia Climática, Justicia Racial, Gobernanza Global, políticas y rendición de cuentas",
      en: "Circular Economy, Climate Justice, Racial Justice, Gobernanza Global, políticas y rendición de cuentas"
    },
    como_trabajan: {
      es: "No funciona como una fundación tradicional que otorga subvenciones. Es una organización sin fines de lucro operativa que acepta donaciones y se asocia con inversionistas y grupos en campañas y programas de promoción específicos.",
      en: "Does not operate as a traditional grant-making foundation. It is an operating non-profit that accepts donations and partners with investors and groups on specific advocacy campaigns and programs."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Berkeley, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.asyousow.org",
    email: "info@asyousow.org"
  },
  {
    id: 139,
    name: "Barr Foundation",
    description_es: "Fundación privada con sede en Boston que invierte en potencial humano, natural y creativo. Sus activos ascienden a 2.500 millones de dólares y han contribuido con más de 1.000 millones de dólares a causas benéficas desde 1999.",
    description_en: "Boston-based private foundation investing in human, natural, and creative potential. Assets of $2.5 billion, contributed over $1 billion to charitable causes since 1999.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Ciudades Sustentables, Justicia Climática, Educación de Calidad",
      en: "Sustainable Cities, Climate Justice, Quality Education"
    },
    como_trabajan: {
      es: "Otorga subvenciones principalmente en Massachusetts y Nueva Inglaterra en tres programas principales: Arte y Creatividad, Clima y Educación. Da prioridad a las asociaciones a largo plazo con compromisos plurianuales centrados en la equidad y el cambio sistémico.",
      en: "Makes grants primarily in Massachusetts and New England in three core programs: Arts & Creativity, Climate, and Education. Prioritizes long-term partnerships with multi-year commitments focusing on equity and systemic change."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Boston, Massachusetts, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.barrfoundation.org",
    email: ""
  },
  {
    id: 140,
    name: "Ben & Jerry's Foundation",
    description_es: "Organización de justicia social fundada en 1985 por Ben Cohen y que recibe el 7,5% de las ganancias antes de impuestos de Ben & Jerry's. Independiente de la empresa de helados desde la adquisición de Unilever en 2000. Guiado por los empleados de Ben & Jerry's que forman parte de los comités de financiación.",
    description_en: "Social justice organization established 1985 by Ben Cohen, receiving 7.5% of Ben & Jerry's pre-tax profits. Independent of ice cream company since 2000 Unilever acquisition. Guided by Ben & Jerry's employees serving on funding committees.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Racial, Justicia de Género, Justicia Económica, Movimientos Ciudadanos",
      en: "Racial Justice, Gender Justice, Economic Justice, Citizen Movements"
    },
    como_trabajan: {
      es: "Otorga subvenciones a través de tres programas: National Grassroots Organizing (subvenciones de dos años sin restricciones de hasta $30,000 al año para pequeñas organizaciones de base), Vermont Community Action Teams y Vermont Equity & Justice. Apoya la organización liderada por los electores para un cambio social sistémico que aborde los problemas sociales y ambientales subyacentes.",
      en: "Makes grants through three programs: National Grassroots Organizing (two-year unrestricted grants up to $30,000/year to small grassroots organizations), Vermont Community Action Teams, and Vermont Equity & Justice. Supports constituent-led organizing for systemic social change addressing underlying societal and environmental problems."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "South Burlington, Vermont, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://benandjerrysfoundation.org",
    email: "info@benandjerrysfoundation.org"
  },
  {
    id: 141,
    name: "Blumenthal Foundation",
    description_es: "Mejora la calidad de vida en la región de Charlotte, Carolina del Norte, apoyando iniciativas en educación, arte y cultura, y servicios de salud, enfocándose en fortalecer el tejido social y enriquecer a la comunidad.",
    description_en: "Enhances the quality of life in the Charlotte, North Carolina region by supporting initiatives in education, arts and culture, and health services, focusing on strengthening the social fabric and enriching the community.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Innovación Social, Educación de Calidad, Paz y Resolución de Conflictos",
      en: "Social Innovation, Quality Education, Peace and Conflict Resolution"
    },
    como_trabajan: {
      es: "Gestiona un proceso de solicitud abierto con plazos específicos, invitando propuestas de organizaciones sin fines de lucro que operan dentro del área metropolitana de Charlotte. Enfatiza el impacto local y la mejora de la comunidad.",
      en: "Manages an open application process with specific deadlines, inviting proposals from non-profit organizations operating within the Charlotte metropolitan area. Emphasizes local impact and community enhancement."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Charlotte, Carolina del Norte, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://ncnonprofits.org/members/blumenthal-foundation",
    email: "info@blumenthalfoundation.org"
  },
  {
    id: 142,
    name: "Both Ends",
    description_es: "Fortalece los movimientos ambientales y de derechos humanos en el Sur Global conectando organizaciones locales con conocimientos, recursos y plataformas de políticas internacionales, apoyando soluciones lideradas por la comunidad a la degradación y la injusticia ambiental.",
    description_en: "Strengthens environmental and human rights movements in the Global South by connecting local organizations with knowledge, resources, and international policy platforms, supporting community-led solutions to environmental degradation and injustice.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Gobernanza Global, políticas y rendición de cuentas, Justicia de Género",
      en: "Climate Justice, Gobernanza Global, políticas y rendición de cuentas, Gender Justice"
    },
    como_trabajan: {
      es: "Brinda apoyo financiero a través de convocatorias abiertas y programas colaborativos a organizaciones ambientales y de derechos humanos en el Sur Global. También se centra en conectar socios con redes y recursos internacionales.",
      en: "Provides financial support through open calls and collaborative programs to environmental and human rights organizations in the Global South. Also focuses on connecting partners to international networks and resources."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "Netherlands",
    country_es: "Países Bajos",
    ciudad: "Ámsterdam, Países Bajos",
    continent: "europa",
    latitude: 52.3676,
    longitude: 4.9041,
    website: "https://www.bothends.org/index.php?page=_",
    email: "info@bothends.org"
  },
  {
    id: 143,
    name: "Builders Vision",
    description_es: "Invierte y se asocia en diferentes sectores (filantropía, inversión de impacto, promoción) para impulsar soluciones basadas en el mercado y cambios en los sistemas que promuevan un planeta más humano y saludable, centrándose principalmente en los océanos y los sistemas alimentarios sostenibles.",
    description_en: "Invests and partners across different sectors (philanthropy, impact investing, advocacy) to drive market-based solutions and system changes that advance a more humane and healthy planet, focusing heavily on oceans and sustainable food systems.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Economía Circular, Conservación de Recursos Naturales (Océanos), Innovación Social",
      en: "Circular Economy, Conservación de Recursos Naturales (Océanos), Social Innovation"
    },
    como_trabajan: {
      es: "Las subvenciones filantrópicas se otorgan principalmente por invitación y asociación estratégica. Combinan la concesión de subvenciones con la inversión de impacto y la promoción, por lo que el proceso es altamente estratégico y rara vez está abierto a solicitudes no solicitadas.",
      en: "Philanthropic grants are primarily by invitation and strategic partnership. They combine their grant-making with impact investing and advocacy, so the process is highly strategic and rarely open to unsolicited applications."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Chicago, Illinois, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.buildersvision.com//",
    email: "info@buildersvision.com"
  },
  {
    id: 144,
    name: "Building Equity & Alignment for Environmental Justice",
    description_es: "Financia y fortalece la capacidad de organizaciones y grupos de base liderados por personas de color y comunidades de bajos ingresos para liderar campañas climáticas y de justicia ambiental en todo Estados Unidos.",
    description_en: "Funds and strengthens the capacity of grassroots organizations and groups led by people of color and low-income communities to lead environmental justice and climate campaigns across the U.S.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Justicia Racial, Movimientos Ciudadanos",
      en: "Climate Justice, Racial Justice, Citizen Movements"
    },
    como_trabajan: {
      es: "Realiza convocatorias abiertas de propuestas dirigidas específicamente a organizaciones de justicia ambiental dirigidas y que prestan servicios a comunidades de color y poblaciones de bajos ingresos. Prioriza el soporte operativo flexible, plurianual y general.",
      en: "Conducts open calls for proposals directed specifically at environmental justice organizations led by and serving communities of color and low-income populations. Prioritizes flexible, multi-year, and general operating support."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Washington D.C., EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://beajustice.org",
    email: "info@thebea.fund"
  },
  {
    id: 145,
    name: "Bullitt Foundation",
    description_es: "Fundación ambiental fundada en 1952 que salvaguarda el medio ambiente natural mediante la promoción de actividades humanas responsables y comunidades sostenibles en el noroeste del Pacífico. Se han otorgado más de 200 millones de dólares desde 1992.",
    description_en: "Environmental foundation founded 1952 safeguarding natural environment by promoting responsible human activities and sustainable communities in Pacific Northwest. Granted over $200 million since 1992.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Ciudades Sustentables, Conservación de Recursos Naturales, Justicia Climática",
      en: "Sustainable Cities, Natural Resources Conservation, Climate Justice"
    },
    como_trabajan: {
      es: "Trabajó a través de la concesión de subvenciones en energía/clima, salud de los ecosistemas regionales, ciudades resilientes y becas ambientales en la región del Pacífico Noroeste (Washington, Oregón, Idaho, oeste de Montana, Columbia Británica). Nota: Concesión de subvenciones suspendida en 2024.",
      en: "Worked through grantmaking in energy/climate, regional ecosystem health, resilient cities, and environmental fellowships in Pacific Northwest region (Washington, Oregon, Idaho, western Montana, British Columbia). Note: Sunsetted grantmaking in 2024."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Seattle, Washington, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.bullitt.org/",
    email: "info@bullitt.org"
  },
  {
    id: 146,
    name: "Charles Evans Hughes Memorial Fund (SHW)",
    description_es: "Apoya a organizaciones sin fines de lucro que trabajan en las áreas de derechos humanos, participación cívica, asistencia legal y estado de derecho, continuando el legado del compromiso de Charles Evans Hughes con las libertades civiles y la justicia social.",
    description_en: "Supports non-profit organizations working in the areas of human rights, civic engagement, legal aid, and the rule of law, continuing the legacy of Charles Evans Hughes' commitment to civil liberties and social justice.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Democracia, Justicia Racial, Educación de Calidad",
      en: "Democracy, Racial Justice, Quality Education"
    },
    como_trabajan: {
      es: "No acepta solicitudes de financiación no solicitadas. La concesión de subvenciones se realiza mediante invitación únicamente a organizaciones identificadas por los fideicomisarios que se alinean con la misión histórica y los valores específicos del fondo.",
      en: "Does not accept unsolicited requests for funding. Grantmaking is conducted by invitation only to organizations identified by the trustees that align with the specific historical mission and values of the fund."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.cehughesfoundation.org/",
    email: "contact@shwf.org"
  },
  {
    id: 147,
    name: "Chino Cienega Foundation",
    description_es: "Ayuda en la protección y el manejo sustentable de los humedales Chino Cienega, apoyando la educación ambiental, proyectos de conservación e investigaciones enfocadas en preservar este recurso biológico y geológico único en Arizona.",
    description_en: "Aids in the protection and sustainable management of the Chino Cienega wetlands, supporting environmental education, conservation projects, and research focused on preserving this unique biological and geological resource in Arizona.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Educación de Calidad, Salud Global, Innovación Social",
      en: "Quality Education, Global Health, Social Innovation"
    },
    como_trabajan: {
      es: "Gestiona un ciclo de subvenciones abierto con plazos específicos, invitando propuestas de organizaciones e investigadores centrados en la conservación, la educación y la investigación relacionada con la región del Chino Cienega.",
      en: "Manages an open grant cycle with specific deadlines, inviting proposals from organizations and researchers focused on conservation, education, and research related to the Chino Cienega region."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "San Marino, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "http://www.chinofound.org/599.html",
    email: "info@chinocienega.org"
  },
  {
    id: 148,
    name: "Cleveland Foundation",
    description_es: "Aborda los problemas más cruciales que enfrenta el Gran Cleveland a través del liderazgo cívico, la concesión de subvenciones estratégicas y el fomento de la filantropía comunitaria, trabajando para fortalecer la economía, mejorar los vecindarios y promover la equidad social.",
    description_en: "Addresses the most crucial issues facing Greater Cleveland through civic leadership, strategic grantmaking, and fostering community philanthropy, working to strengthen the economy, improve neighborhoods, and advance social equity.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Ciudades Sustentables, Educación de Calidad, Justicia Económica, Fortalecimiento de Capacidades Organizacionales",
      en: "Sustainable Cities, Quality Education, Economic Justice, Organizational Capacity Building"
    },
    como_trabajan: {
      es: "Opera principalmente a través de ciclos de subvenciones abiertos y competitivos vinculados a áreas de enfoque específicas y necesidades de la comunidad local. Son una fundación comunitaria que acepta propuestas de organizaciones locales sin fines de lucro dentro de plazos establecidos.",
      en: "Operates primarily through open, competitive grant cycles tied to specific focus areas and local community needs. They are a community foundation, accepting proposals from local non-profits within set timeframes."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Cleveland, Ohio, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.clevelandfoundation.org/",
    email: "info@clevefnd.org"
  },
  {
    id: 149,
    name: "Clif Family Foundation",
    description_es: "Apoya a las organizaciones que trabajan para fortalecer los sistemas alimentarios y agrícolas, mejorar la salud pública y proteger el medio ambiente, centrándose en soluciones innovadoras y comunitarias que conectan a las personas con los alimentos, la naturaleza y la comunidad.",
    description_en: "Supports organizations working to strengthen food and farming systems, enhance public health, and protect the environment, focusing on innovative and community-based solutions that connect people to food, nature, and community.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Soberanía Alimentaria, Conservación de Recursos Naturales, Justicia Climática",
      en: "Food Sovereignty, Natural Resources Conservation, Climate Justice"
    },
    como_trabajan: {
      es: "Acepta cartas de consulta (LOI) no solicitadas a través de un portal en línea durante períodos de subvención específicos. Priorizan organizaciones con objetivos claros y mensurables y un enfoque en soluciones basadas en la comunidad.\tfundación@cliffamily.com",
      en: "Accepts unsolicited letters of inquiry (LOIs) through an online portal during specific grant windows. They prioritize organizations with clear, measurable goals and a focus on community-based solutions.\tfoundation@cliffamily.com"
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Emeryville, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.cliffamily.org/",
    email: "foundation@cliffamily.com"
  },
  {
    id: 150,
    name: "Climate and Clean Energy Equity Fund",
    description_es: "Genera voluntad política y poder colectivo para promover la acción climática y una economía de energía limpia mediante la financiación de organizaciones, particularmente aquellas dirigidas por personas de color, que trabajan en la intersección del clima y la justicia racial.",
    description_en: "Builds political will and collective power to advance climate action and a clean energy economy by funding organizations, particularly those led by people of color, working at the intersection of climate and racial justice.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Transición Energética, Justicia Climática, Participación Ciudadana, Justicia Racial",
      en: "Energy Transition, Climate Justice, Civic Participation, Racial Justice"
    },
    como_trabajan: {
      es: "Trabaja principalmente a través de subvenciones estratégicas mediante invitación a organizaciones identificadas como socios clave en la construcción del poder político y cívico. Se centran en la capacidad a largo plazo y en la alineación con su agenda de equidad.",
      en: "Primarily works through strategic grants by invitation to organizations identified as key partners in building political and civic power. They focus on long-term capacity and alignment with their equity agenda."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Washington D.C., EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://theequityfund.org/",
    email: "info@equityfund.org"
  },
  {
    id: 151,
    name: "Wallace Global Fund",
    description_es: "Apoya los movimientos impulsados ​​por las personas que promueven la democracia, los derechos humanos y un planeta saludable. Fundada en 1996, inspirada por el fundador Henry A. Wallace, 33º vicepresidente de Estados Unidos.",
    description_en: "Supports people-powered movements advancing democracy, human rights, and healthy planet. Founded 1996, inspired by founder Henry A. Wallace, 33rd US Vice President.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Democracia, Justicia Económica, Derechos Digitales",
      en: "Climate Justice, Democracy, Economic Justice, Digital Rights"
    },
    como_trabajan: {
      es: "Otorga subvenciones a más de 300 socios del movimiento anualmente utilizando un enfoque integrado con todos los activos de la fundación: subvenciones, inversiones y promoción. Totalmente desinvertido en combustibles fósiles y con una cartera alineada con su misión.",
      en: "Makes grants to 300+ movement partners annually using integrated approach with all foundation assets: grants, investments, and advocacy. Fully divested from fossil fuels with mission-aligned portfolio."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Washington D.C., EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://wgf.org/",
    email: "info@wgf.org"
  },
  {
    id: 152,
    name: "Water Foundation",
    description_es: "Restaura y protege el flujo sostenible de agua en todo el oeste de los Estados Unidos a través de la concesión de subvenciones, la promoción y asociaciones de colaboración, centrándose en políticas y prácticas que garanticen ecosistemas saludables y un acceso equitativo al agua.",
    description_en: "Restores and protects the sustainable flow of water across the western United States through grantmaking, advocacy, and collaborative partnerships, focusing on policies and practices that ensure healthy ecosystems and equitable access to water.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales, Justicia Climática, Gobernanza Global, políticas y rendición de cuentas",
      en: "Natural Resources Conservation, Climate Justice, Gobernanza Global, políticas y rendición de cuentas"
    },
    como_trabajan: {
      es: "La financiación es principalmente estratégica y por invitación. Trabajan a través de programas definidos y estrategias regionales, lo que significa que rara vez aceptan propuestas no solicitadas fuera de iniciativas específicas publicadas.",
      en: "Funding is primarily strategic and by invitation. They work through defined programs and regional strategies, meaning they rarely accept unsolicited proposals outside of specific, published initiatives."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Sacramento, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://waterfdn.org/",
    email: "info@waterfdn.org"
  },
  {
    id: 153,
    name: "Children’s Rights Innovation Fund",
    description_es: "Ayuda a la promoción y protección de los derechos de los niños a nivel mundial, particularmente de los niños vulnerables y marginados, apoyando programas y trabajos de políticas innovadores y basados ​​en evidencia.",
    description_en: "Aids in the promotion and protection of children's rights globally, particularly for vulnerable and marginalized children, by supporting innovative, evidence-based programs and policy work.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Derechos de las Infancias, Juventud, Innovación Social, Justicia Racial",
      en: "Children's Rights, Youth, Social Innovation, Racial Justice"
    },
    como_trabajan: {
      es: "Opera principalmente a través de invitaciones estratégicas a organizaciones que puedan demostrar un impacto mensurable y escalable en el campo de los derechos del niño. Por lo general, no se aceptan propuestas no solicitadas.",
      en: "Operates mainly through strategic invitations to organizations that can demonstrate measurable, scalable impact in the field of children's rights. Unsolicited proposals are generally not accepted."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Washington D.C., EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://crifund.org/",
    email: "info@crifund.org"
  },
  {
    id: 154,
    name: "Coalition for Human Rights in Development",
    description_es: "Aboga por la rendición de cuentas y los derechos humanos en la financiación del desarrollo, apoyando la resistencia liderada por la comunidad y garantizando que los bancos de desarrollo y las instituciones financieras respeten los derechos de las personas y el medio ambiente.",
    description_en: "Advocates for accountability and human rights in development finance, supporting community-led resistance and ensuring that development banks and financial institutions respect the rights of people and the environment.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Gobernanza Global, políticas y rendición de cuentas, Comunidades Indígenas, Movimientos Ciudadanos",
      en: "Gobernanza Global, políticas y rendición de cuentas, Indigenous Communities, Citizen Movements"
    },
    como_trabajan: {
      es: "No funciona como una fundación tradicional que otorga subvenciones. Es una red y coalición que brinda apoyo no financiero, colaboración y recursos de promoción a sus miembros y socios.",
      en: "Does not operate as a traditional grant-making foundation. It is a network and coalition that provides non-financial support, collaboration, and advocacy resources to its members and partners."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Washington D.C., EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://rightsindevelopment.org/",
    email: "info@rightsindevelopment.org"
  },
  {
    id: 155,
    name: "Equality Fund",
    description_es: "El fondo para la igualdad de género más ambicioso de la historia, gestionado por feministas en colaboración con movimientos feministas de todo el mundo. Recibió 300 millones de dólares canadienses del gobierno canadiense en 2019.",
    description_en: "Most ambitious fund for gender equality in history, managed by feminists in collaboration with feminist movements worldwide. Received $300 million CAD from Canadian government in 2019.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia de Género, LGTBIQ+, Justicia Económica, Movimientos Ciudadanos",
      en: "Gender Justice, LGBTIQ+, Economic Justice, Citizen Movements"
    },
    como_trabajan: {
      es: "Traslada financiación flexible, abundante y sin restricciones a los movimientos feministas. Conecta a líderes feministas con filántropos globales comprometidos con el poder colectivo de mujeres, niñas y personas trans en todo el mundo a través de subvenciones e inversiones.",
      en: "Moves flexible, abundant, unrestricted funding to feminist movements. Connects feminist leaders with global philanthropists committed to collective power of women, girls, and trans people worldwide through grantmaking and investments."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "Canada",
    country_es: "Canadá",
    ciudad: "Ottawa, Canadá",
    continent: "america",
    latitude: 45.4215,
    longitude: -75.6972,
    website: "https://equalityfund.ca/",
    email: "info@equalityfund.ca"
  },
  {
    id: 156,
    name: "Equitas- ACTIF Fund",
    description_es: "Apoya iniciativas de educación y capacitación en derechos humanos en el Sur Global, fortaleciendo la capacidad de las organizaciones para promover los derechos humanos, la no discriminación y la participación cívica dentro de sus comunidades.",
    description_en: "Supports human rights education and training initiatives in the Global South, strengthening the capacity of organizations to promote human rights, non-discrimination, and civic participation within their communities.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "LGTBIQ+, Justicia de Género, Derechos de las Personas con Discapacidad, Derechos Laborales",
      en: "LGBTIQ+, Gender Justice, Rights of Persons with Disabilities, Labor Rights"
    },
    como_trabajan: {
      es: "Gestiona una convocatoria abierta de propuestas específica (a menudo anual) dirigida a organizaciones del Sur Global centradas en implementar la educación en derechos humanos y utilizar la metodología ACTIF.",
      en: "Manages a specific open call for proposals (often annual) directed at organizations in the Global South focused on implementing human rights education and using the ACTIF methodology."
    },
    impacto_financiero: {
      es: "mérica Central, América del Sur, África Subsahariana, África del Norte, Asia Central, Asia Oriental (en parte), Oriente Medio, y Oceanía.",
      en: "mérica Central, South America, Sub-Saharan Africa, North Africa, Central Asia, Asia Oriental (en parte), Middle East, y Oceanía."
    },
    country: "Canada",
    country_es: "Canadá",
    ciudad: "Montreal, Canadá",
    continent: "america",
    latitude: 45.4215,
    longitude: -75.6972,
    website: "https://equitas.org/where-we-work/internationally-act-together-for-inclusion-fund/",
    email: "equitas@equitas.org"
  },
  {
    id: 157,
    name: "Fondo Defensores",
    description_es: "Primer fondo enfocado en la promoción y defensa de los derechos indígenas en América Latina, fundado en 2020. Colectivo de múltiples donantes que apoya la defensa de los territorios y los derechos colectivos de los pueblos indígenas.",
    description_en: "First fund focused on promotion and defense of Indigenous rights in Latin America, founded 2020. Multi-donor collective supporting Indigenous peoples' defense of territories and collective rights.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Paz y Resolución de Conflictos, Comunidades Indígenas, Movimientos Ciudadanos, Justicia Climática",
      en: "Peace and Conflict Resolution, Indigenous Communities, Citizen Movements, Climate Justice"
    },
    como_trabajan: {
      es: "Proporciona recursos estratégicos y flexibles a través del fortalecimiento de base, defensa legal, promoción, creación de redes, comunicación estratégica, respuesta rápida y educación sobre los derechos indígenas. Trabaja desde una perspectiva intercultural con liderazgo indígena en contexto de emergencia climática.",
      en: "Provides strategic and flexible resources through grassroots strengthening, legal defense, advocacy, network building, strategic communication, rapid response, and Indigenous rights education. Works from intercultural perspective with Indigenous leadership in context of climate emergency."
    },
    impacto_financiero: {
      es: "América Central, América del Sur",
      en: "Central America, South America"
    },
    country: "Mexico",
    country_es: "México",
    ciudad: "Ciudad de México, México",
    continent: "america",
    latitude: 19.4326,
    longitude: -99.1332,
    website: "https://fondodefensores.org",
    email: "Contact via website form"
  },
  {
    id: 158,
    name: "FRIDA- The Young Feminist Fund",
    description_es: "Fortalece la capacidad de organizaciones, grupos y colectivos feministas jóvenes en todo el Sur y el Este Global proporcionando financiamiento básico flexible y apoyando su liderazgo y esfuerzos de organización.",
    description_en: "Strengthens the capacity of young feminist organizations, groups, and collectives across the Global South and East by providing flexible, core funding and supporting their leadership and organizing efforts.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Juventud, Justicia de Género, LGTBIQ+, Movimientos Ciudadanos",
      en: "Youth, Gender Justice, LGBTIQ+, Citizen Movements"
    },
    como_trabajan: {
      es: "Utiliza una convocatoria de propuestas abierta, competitiva y global de forma rotativa. Conocido por su proceso de solicitud accesible y su compromiso de brindar financiamiento flexible y plurianual a grupos pequeños, emergentes y, a menudo, no registrados.",
      en: "Utilizes a global, competitive open call for proposals on a rotating basis. Known for its accessible application process and commitment to providing flexible, multi-year funding to small, emerging, and often unregistered groups."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "Canadá (Sede administrativa)",
    country_es: "Canadá (Sede administrativa)",
    ciudad: "Toronto, Canadá (Sede administrativa)",
    continent: "desconocido",
    latitude: 0,
    longitude: 0,
    website: "https://youngfeministfund.org/",
    email: "info@fridafund.org"
  },
  {
    id: 159,
    name: "Global Fund for Children",
    description_es: "Organización internacional sin fines de lucro enfocada en promover los derechos y el bienestar de niños y jóvenes.",
    description_en: "International non profit organization focused on advancing the rights and well being of children and youth",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Derechos de las Infancias, Juventud, Educación de Calidad, Protección de la Niñez",
      en: "Children's Rights, Youth, Quality Education, Child Protection"
    },
    como_trabajan: {
      es: "Proporcionan subvenciones flexibles, tutoría organizacional y creación de redes a grupos liderados localmente.",
      en: "They provide flexible grant founding, organizational mentoring and network builiding to locally led groups "
    },
    impacto_financiero: {
      es: "America del Norte, America Central,  America del Sur, Africa Subsahariana, Asia Central, Asia Oriental, Europa Occidental  ",
      en: "America del Norte, America Central, America del Sur, Africa Subsahariana, Central Asia, East Asia, Western Europe"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Washington D.C., EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://globalfundforchildren.org/",
    email: "info@globalfundforchildren.org"
  },
  {
    id: 160,
    name: "MADRE Fund",
    description_es: "Organización feminista internacional de derechos humanos que trabaja para promover la justicia de género, racial y climática y de discapacidad, apoyando a mujeres, niñas y comunidades LGTBIQ+.",
    description_en: "International feminist human rights organization that works to advance gender, racial and climate and disability justice, supporting women, girls and LGTBIQ+ communities ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia de Género, Paz y Resolución de Conflictos, Comunidades Indígenas, Justicia Climática",
      en: "Gender Justice, Peace and Conflict Resolution, Indigenous Communities, Climate Justice"
    },
    como_trabajan: {
      es: "Trabajan a través de financiación flexible, apoyo humanitario y asistencia técnica en asociación con organizaciones de mujeres.",
      en: "They work through flexible funding, humanitarian support and technical assistance in partnership with women's organizations"
    },
    impacto_financiero: {
      es: "America del Norte, America Central, America del Sur, Africa Subsahariana, Africa del norte,  Oriente Medio, Asia Oriental ",
      en: "America del Norte, America Central, America del Sur, Africa Subsahariana, Africa del norte, Middle East, East Asia"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.madre.org/",
    email: "info@madre.org"
  },
  {
    id: 161,
    name: "Malala Fund",
    description_es: "Organización internacional sin fines de lucro dedicada a garantizar que las niñas tengan acceso a una educación secundaria segura, inclusiva y de alta calidad.",
    description_en: "International non profit organization dedicated to ensuring that girls have access to safe, inclusive and high  quality secundary education ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Educación de Calidad, Juventud, Justicia de Género",
      en: "Quality Education, Youth, Gender Justice"
    },
    como_trabajan: {
      es: "Trabajan a través de la promoción de políticas, la financiación de organizaciones educativas locales y el desarrollo de liderazgo para fortalecer los sistemas educativos.",
      en: "They work through policy advocacy, funding of local education organization and leadership development to strengthen education systems "
    },
    impacto_financiero: {
      es: "America Central, America del Sur, Africa Subsahariana, Asia Oriental, Aria Central, Medio Oriente, Europa Occidental",
      en: "America Central, America del Sur, Africa Subsahariana, East Asia, Aria Central, Medio Oriente, Western Europe"
    },
    country: "United Kingdom",
    country_es: "Reino Unido",
    ciudad: "Londres, Reino Unido",
    continent: "europa",
    latitude: 51.5074,
    longitude: -0.1278,
    website: "https://malala.org/",
    email: "info@malala.org"
  },
  {
    id: 162,
    name: "Greta Thunberg Foundation",
    description_es: "Organización internacional sin fines de lucro creada para apoyar la acción climática y la justicia ambiental empoderando a los jóvenes.",
    description_en: "International non profit organization estabilished to support climate action and enviromental justice by empowering youth ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Juventud, Movimientos Ciudadanos, Conservación de Recursos Naturales",
      en: "Climate Justice, Youth, Citizen Movements, Natural Resources Conservation"
    },
    como_trabajan: {
      es: "Trabajan a través de la promoción, la concienciación pública, las iniciativas educativas y la colaboración con los responsables de la formulación de políticas.",
      en: "They work though advocacy, public awareness, educational initiatives and collaboration with policymakers. "
    },
    impacto_financiero: {
      es: "America del Norte, Europa Occidental, Europa del Este, Africa Subsahariana, Asia Central ",
      en: "America del Norte, Western Europe, Eastern Europe, Africa Subsahariana, Central Asia"
    },
    country: "Sweden",
    country_es: "Suecia",
    ciudad: "Estocolmo, Suecia",
    continent: "europa",
    latitude: 59.3293,
    longitude: 18.0686,
    website: "https://thegretathunbergfoundation.org/",
    email: "info@thegretathunbergfoundation.org"
  },
  {
    id: 163,
    name: "SAGE Fund",
    description_es: "Sage Fund es una iniciativa colaborativa de otorgamiento de subvenciones que promueve los derechos humanos y la rendición de cuentas en la economía global.",
    description_en: "Sage Fund is a collaborative grantmaking initiative that advances human rights and accountability in the global economy ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Económica, Derechos Laborales, Gobernanza Global, políticas y rendición de cuentas",
      en: "Economic Justice, Labor Rights, Gobernanza Global, políticas y rendición de cuentas"
    },
    como_trabajan: {
      es: "Trabajan cultivando y financiando nuevas herramientas, colaboración entre movimientos y desarrollo de capacidades para fortalecer la rendición de cuentas de los actores económicos y apoyar los movimientos de base y de derechos humanos.",
      en: "They work by cultivating and funding new tools, crossmovement collaboration and capacity building to srengthen accountability  for economic actors and support grassroots and human rights movements "
    },
    impacto_financiero: {
      es: "America del Norte, America Central, America del Sur, Africa Subsahariana, Asia Central ",
      en: "America del Norte, America Central, America del Sur, Africa Subsahariana, Central Asia"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.sagefundrights.org/",
    email: "info@sagefundrights.org"
  },
  {
    id: 164,
    name: "Urgent Action Fund for Women’s Human Rights",
    description_es: "Fondo de respuesta rápida que apoya a activistas, organizaciones y movimientos feministas que enfrentan riesgos y oportunidades urgentes.",
    description_en: "Rapid respond fund supporting feminist activist, organizations and movements facing urgent risks and opportunities ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia de Género, Paz y Resolución de Conflictos, LGTBIQ+, Protección de Defensores",
      en: "Gender Justice, Peace and Conflict Resolution, LGBTIQ+, Protección de Defensores"
    },
    como_trabajan: {
      es: "Proporcionan subvenciones de emergencia rápidas y flexibles y apoyo integral para la seguridad y la atención.",
      en: "They provide fast, felixible emergency grants and holistic support for safety and care"
    },
    impacto_financiero: {
      es: "America del Norte, Asia Central, Europa Occidental, Europa del Este, Medio Oriente. ",
      en: "America del Norte, Central Asia, Western Europe, Eastern Europe, Medio Oriente."
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Oakland, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://urgentactionfund.org/",
    email: "info@urgentaction.org"
  },
  {
    id: 165,
    name: "VidaAfrolatina",
    description_es: "VidaAfrolatina es una organización feminista y antirracista que trabaja para empoderar a las comunidades afrodescendientes, particularmente a las mujeres, a través de la promoción, la acción cultural y las iniciativas de justicia social.",
    description_en: "VidaAfrolatina is a feminist and anti-racist organization that works to empower Afro-descendant communities, particularly women, through advocacy, cultural action, and social justice initiatives.",
    tipo_de_org: {
      es: "Organizaciones No Gubernamentales",
      en: "Non-Governmental Organization"
    },
    enfoque: {
      es: "Justicia Racial, Justicia de Género, Salud Global, Movimientos Ciudadanos",
      en: "Racial Justice, Gender Justice, Global Health, Citizen Movements"
    },
    como_trabajan: {
      es: "Combinan organización de base, educación comunitaria, promoción de políticas y programación cultural para abordar el racismo estructural, la desigualdad de género y la exclusión social.",
      en: "They combine grassroots organizing, community education, policy advocacy, and cultural programming to address structural racism, gender inequality, and social exclusion."
    },
    impacto_financiero: {
      es: "América Central, América del Sur",
      en: "Central America, South America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Oakland, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://vidaafrolatina.org/es/",
    email: "info@vidaafrolatina.org"
  },
  {
    id: 166,
    name: "Brot für die Welt",
    description_es: "Agencia de desarrollo protestante con sede en Alemania que trabaja para reducir la pobreza y promover la justicia",
    description_en: "Germany based Protestant develompent agency working to reduce poverty and advance justice",
    tipo_de_org: {
      es: "Organizaciones No Gubernamentales",
      en: "Non-Governmental Organization"
    },
    enfoque: {
      es: "Soberanía Alimentaria, Salud Global, Educación de Calidad, Paz y Resolución de Conflictos",
      en: "Food Sovereignty, Global Health, Quality Education, Peace and Conflict Resolution"
    },
    como_trabajan: {
      es: "Trabajan a través de asociaciones a largo plazo, cooperación técnica y promoción.",
      en: "They work through long term partnerships, techincal cooperation adn advocacy"
    },
    impacto_financiero: {
      es: "Africa SubSahariana, America del Norte, Medio Oriente , Asia Central, Asia Oriental, America Central, America del Sur,  Europa del Este",
      en: "Africa SubSahariana, America del Norte, Medio Oriente, Central Asia, East Asia, America Central, America del Sur, Eastern Europe"
    },
    country: "Germany",
    country_es: "Alemania",
    ciudad: "Berlín, Alemania",
    continent: "europa",
    latitude: 52.52,
    longitude: 13.405,
    website: "https://www.brot-fuer-die-welt.de/",
    email: "info@brot-fuer-die-welt.de"
  },
  {
    id: 167,
    name: "EDGE Funders Alliance",
    description_es: "Alianza global para profesionales filantrópicos centrados en la equidad y la justicia",
    description_en: "Global alliance for philantropic practitioners focused on equity and justice ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Fortalecimiento de Capacidades Organizacionales, Justicia Económica, Justicia Climática",
      en: "Organizational Capacity Building, Economic Justice, Climate Justice"
    },
    como_trabajan: {
      es: "Trabajan a través de la colaboración de los miembros, redes de aprendizaje e iniciativas conjuntas.",
      en: "They work through member collaboration, learning networks and joint initiatives "
    },
    impacto_financiero: {
      es: "America del Norte, Europa Occidental",
      en: "America del Norte, Western Europe"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://edgefunders.org/",
    email: "info@edgefounders.org"
  },
  {
    id: 168,
    name: "Association for Charitable Foundations",
    description_es: "Asociación de miembros del Reino Unido para fundaciones y donantes independientes",
    description_en: "UK membership association for foundations and independent grant makers ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Fortalecimiento de Capacidades Organizacionales, Gobernanza Global, políticas y rendición de cuentas",
      en: "Organizational Capacity Building, Gobernanza Global, políticas y rendición de cuentas"
    },
    como_trabajan: {
      es: "Proporciona servicios de membresía, coordinación sectorial y promoción para los donantes.",
      en: "Provides membership services, sector coordination and advocacy for grant makers "
    },
    impacto_financiero: {
      es: "Europa Occidental ",
      en: "Western Europe"
    },
    country: "United Kingdom",
    country_es: "Reino Unido",
    ciudad: "Londres, Reino Unido",
    continent: "europa",
    latitude: 51.5074,
    longitude: -0.1278,
    website: "https://www.acf.org.uk/",
    email: "info@acf.org"
  },
  {
    id: 169,
    name: "Active Philanthropy",
    description_es: "Organización asesora sin fines de lucro que apoya a filántropos e inversores sociales para aumentar el impacto. Fuerte enfoque climático",
    description_en: "Non profit advisory organization supporting philanthropists  and social investors to increase impact. Strong climate focus",
    tipo_de_org: {
      es: "Corporación",
      en: "Corporation"
    },
    enfoque: {
      es: "Justicia Climática, Innovación Social, Fortalecimiento de Capacidades Organizacionales",
      en: "Climate Justice, Social Innovation, Organizational Capacity Building"
    },
    como_trabajan: {
      es: "Proporciona apoyo estratégico, apoyo a la gestión de subvenciones y programas educativos.",
      en: "Provides strategy support , grant management support and education programs "
    },
    impacto_financiero: {
      es: "Europa Occidental ",
      en: "Western Europe"
    },
    country: "Germany",
    country_es: "Alemania",
    ciudad: "Berlín, Alemania",
    continent: "europa",
    latitude: 52.52,
    longitude: 13.405,
    website: "https://activephilanthropy.org/",
    email: "info@activephilanthropy.org"
  },
  {
    id: 170,
    name: "Ariadne Network",
    description_es: "Una red europea entre pares de más de 600 financiadores y filtrópicos que apoyan el cambio social y los derechos humanos.",
    description_en: "A european peer to peer network of more than 600 fundeers and philathropists who support social change and human rights ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Derechos de Migrantes y Refugiados, Justicia de Género, Democracia",
      en: "Rights of Migrants and Refugees, Gender Justice, Democracy"
    },
    como_trabajan: {
      es: "Trabajan a través del intercambio entre pares, el aprendizaje de coordinación y la colaboración entre fundadores.",
      en: "They work through peer exchange, coordination learning and collaboration among founders "
    },
    impacto_financiero: {
      es: "Europa Occidental ",
      en: "Western Europe"
    },
    country: "United Kingdom",
    country_es: "Reino Unido",
    ciudad: "Londres, Reino Unido",
    continent: "europa",
    latitude: 51.5074,
    longitude: -0.1278,
    website: "https://www.ariadne-network.eu/",
    email: "info@ariadne-network.eu"
  },
  {
    id: 171,
    name: "Humanity United",
    description_es: "Organización filantrópica que promueve la paz, la libertad y la dignidad de la humanidad, incluido el trabajo y los trabajos forzados.",
    description_en: "Philanthropic organization advancing peace, freedom and humanity dignity, including work and forced labor",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Paz y Resolución de Conflictos, Derechos Laborales (Trata de personas), Democracia",
      en: "Peace and Conflict Resolution, Derechos Laborales (Trata de personas), Democracy"
    },
    como_trabajan: {
      es: "Trabajan a través de la concesión de subvenciones, la investigación de asociaciones y la promoción.",
      en: "They work through grantmaking, partnerships research and advocacy"
    },
    impacto_financiero: {
      es: "America del Norte, America del Sur, Africa Subsahariana",
      en: "America del Norte, America del Sur, Africa Subsahariana"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "San Francisco, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://humanityunited.org/",
    email: "info@humanityunited.org"
  },
  {
    id: 172,
    name: "True Cost Initiative",
    description_es: "Reunió una amplia red compuesta por empresas, organizaciones no gubernamentales, empresas de auditoría y científicos. Los miembros de la iniciativa generaron un manual técnico para calcular los costos reales de los alimentos y productos agrícolas.",
    description_en: "It brought together a broad network comprising businesses, non-governmental organisations, auditing firms, and scientists. The initiative’s members generated a technical handbook for calculating the true costs of food and agricultural products.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Derechos Laborales, Justicia Económica, Justicia Climática",
      en: "Labor Rights, Economic Justice, Climate Justice"
    },
    como_trabajan: {
      es: ". La aplicación del manual en las empresas permite una comparación más completa y objetiva del desempeño de las empresas y establece incentivos para establecer modelos de negocios sostenibles.",
      en: ". The application of the handbook in businesses allows a more complete and objective comparison of businesses’ performance, and sets incentives to establish sustainable business models."
    },
    impacto_financiero: {
      es: "",
      en: ""
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://tca2f.org/initiative/",
    email: "info@truecostinitiative.org"
  },
  {
    id: 173,
    name: "The Freedom Fund",
    description_es: "Una iniciativa filantrópica dedicada a poner fin a la esclavitud moderna b invirtiendo en esfuerzos de primera línea contra la esclavitud",
    description_en: "A philanthropic initiative dedicated to ending modern slavery b investing in front line anti slavery efforts ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Derechos Laborales, Protección de la Niñez, Justicia Económica",
      en: "Labor Rights, Child Protection, Economic Justice"
    },
    como_trabajan: {
      es: "financia y convoca redes de organizaciones de primera línea en \"puntos críticos\", además de trabajos de cambio de sistemas",
      en: "funds and convenes networks of front line organization in \"hotspots\", plus systems change works "
    },
    impacto_financiero: {
      es: "Africa Subsahariana, America del Sur, Asia Central, Asia Oriental, Medio Oriente",
      en: "Africa Subsahariana, America del Sur, Central Asia, East Asia, Medio Oriente"
    },
    country: "United Kingdom",
    country_es: "Reino Unido",
    ciudad: "Londres, Reino Unido",
    continent: "europa",
    latitude: 51.5074,
    longitude: -0.1278,
    website: "https://freedomfund.org/",
    email: "info@freedomfund.org"
  },
  {
    id: 174,
    name: "European Climate Foundation",
    description_es: "Iniciativa filantrópica que apoya las soluciones climáticas y la transición neta cero",
    description_en: "Philanthtropic initiative supporting climate solutions and the net zero transition ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Transición Energética, Justicia Climática, Ciudades Sustentables, Gobernanza Global",
      en: "Energy Transition, Climate Justice, Sustainable Cities, Gobernanza Global"
    },
    como_trabajan: {
      es: "Trabajan principalmente a través de la concesión de subvenciones y el apoyo a organizaciones asociadas (investigación y campañas públicas).",
      en: "They work mainly through grantmaking and support to partner organization (research and public campaings)"
    },
    impacto_financiero: {
      es: "Europa del Este, Europa Occidental ",
      en: "Eastern Europe, Western Europe"
    },
    country: "Netherlands",
    country_es: "Países Bajos",
    ciudad: "La Haya, Países Bajos",
    continent: "europa",
    latitude: 52.3676,
    longitude: 4.9041,
    website: "https://europeanclimate.org/",
    email: "info@europeanclimate.org"
  },
  {
    id: 175,
    name: "Global Alliance for the Future of Food",
    description_es: "Alianza estratégica de fundaciones filantrópicas que trabajan para transformar los sistemas alimentarios para las personas y el planeta.",
    description_en: "Strategic alliance of philanthropic foundations working to transform food systems for people and the planet ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Soberanía Alimentaria, Salud Global, Justicia Climática, Economía Circular",
      en: "Food Sovereignty, Global Health, Climate Justice, Circular Economy"
    },
    como_trabajan: {
      es: "Estrategia conjunta, aprendizaje compartido y coordinación de financiación con socios",
      en: "Joint strategy, shared learningn, and coordinating funding with partners "
    },
    impacto_financiero: {
      es: "America del Norte, Europa Occidental, Africa Subsahariana, America Central, America del Norte, Asia Oriental ",
      en: "America del Norte, Western Europe, Africa Subsahariana, America Central, America del Norte, East Asia"
    },
    country: "Canada",
    country_es: "Canadá",
    ciudad: "Toronto, Canadá",
    continent: "america",
    latitude: 45.4215,
    longitude: -75.6972,
    website: "https://futureoffood.org/",
    email: "info@futureoffood.org"
  },
  {
    id: 176,
    name: "Children´s Investment Fund",
    description_es: "La fundación financia programas para mejorar la vida de los niños y abordar los desafíos climáticos y de desarrollo.",
    description_en: "Foundation funding programs to improve's children lives and address climate and development challenges ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Salud Global, Nutrición Infantil, Derechos de las Infancias",
      en: "Climate Justice, Global Health, Nutrición Infantil, Children's Rights"
    },
    como_trabajan: {
      es: "Proporcionan subvenciones y asociaciones a gran escala.",
      en: "They provide large scale grantmaking and partnerships "
    },
    impacto_financiero: {
      es: "Africa subsahariana, Asia Oriental, Europa Occidental, America del Sur, America Central. ",
      en: "Africa subsahariana, East Asia, Western Europe, America del Sur, America Central."
    },
    country: "United Kingdom",
    country_es: "Reino Unido",
    ciudad: "Londres, Reino Unido",
    continent: "europa",
    latitude: 51.5074,
    longitude: -0.1278,
    website: "https://ciff.org/",
    email: "info@ciff.org"
  },
  {
    id: 177,
    name: "Clean Air Fund",
    description_es: "Organización filantrópica que acelera acciones para reducir la contaminación del aire y mejorar la salud pública",
    description_en: "Philanthtropic organization accelerating action to reduce air pollution and improve public health ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Salud Global, Ciudades Sustentables",
      en: "Climate Justice, Global Health, Sustainable Cities"
    },
    como_trabajan: {
      es: "Fondos y políticas de apoyo, promoción e intervenciones basadas en evidencia",
      en: "Funds and support policy, advocacy and evidence base interventions "
    },
    impacto_financiero: {
      es: "Europa Occidental, Asia Central, Africa Subsahariana",
      en: "Western Europe, Central Asia, Africa Subsahariana"
    },
    country: "United Kingdom",
    country_es: "Reino Unido",
    ciudad: "Londres, Reino Unido",
    continent: "europa",
    latitude: 51.5074,
    longitude: -0.1278,
    website: "https://www.cleanairfund.org/",
    email: "info@cleanairfund.org"
  },
  {
    id: 178,
    name: "Mozilla Foundation",
    description_es: "Fundación sin fines de lucro que trabaja para promover una Internet más saludable",
    description_en: "Non profit foundation working to promote a healthier internet",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Derechos Digitales, Innovación Social, Justicia Racial, Democracia",
      en: "Digital Rights, Social Innovation, Racial Justice, Democracy"
    },
    como_trabajan: {
      es: "Trabajan a través de subvenciones, becas y creación de movimientos para la tecnología responsable.",
      en: "They work through grants, fellowships and movement building for responsible tech "
    },
    impacto_financiero: {
      es: "America del Norte, Europa Occidental, America Central, America del Sur",
      en: "America del Norte, Western Europe, America Central, America del Sur"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Mountain View, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.mozillafoundation.org/",
    email: "press@mozillafoundation.org"
  },
  {
    id: 179,
    name: "KR Foundation",
    description_es: "Fundación base de Dinamarca centrada en abordar la crisis climática y acelerar la eliminación gradual de los combustibles fósiles",
    description_en: "Denmark base foundation focused on addressing the climate crisis and accelerating a fossil fuel phase out ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Transición Energética, Movimientos Ciudadanos",
      en: "Climate Justice, Energy Transition, Citizen Movements"
    },
    como_trabajan: {
      es: "Otorga subvenciones solo por invitación a iniciativas de alto impacto.",
      en: "Makes invitation only grants to high impact initiatives "
    },
    impacto_financiero: {
      es: "Europa Occidental",
      en: "Western Europe"
    },
    country: "Denmark",
    country_es: "Dinamarca",
    ciudad: "Copenhague, Dinamarca",
    continent: "europa",
    latitude: 55.6761,
    longitude: 12.5683,
    website: "https://krfnd.org/",
    email: "info@krfnd.org"
  },
  {
    id: 180,
    name: "MAVA Foundation",
    description_es: "Fundación filantrópica suiza que apoya la conservación de la biodiversidad y fortalece la comunidad conservacionista",
    description_en: "Swiss philanthropic foundation supporting biodiversity conservation and strengthening the conservation community ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales, Economía Circular, Fortalecimiento de Capacidades Organizacionales",
      en: "Natural Resources Conservation, Circular Economy, Organizational Capacity Building"
    },
    como_trabajan: {
      es: "proporciona subvenciones y apoyo a socios con prioridades regionales",
      en: "provides grantmaking and partner support with regional priorities"
    },
    impacto_financiero: {
      es: "Africa Subsahariana, Europa Occidental ",
      en: "Africa Subsahariana, Western Europe"
    },
    country: "Switzerland",
    country_es: "Suiza",
    ciudad: "Gland, Suiza",
    continent: "europa",
    latitude: 46.948,
    longitude: 7.4474,
    website: "https://mava-foundation.org/",
    email: "info@mava-foundation.org"
  },
  {
    id: 181,
    name: "Swiss Philanthropy Foundation",
    description_es: "Plataforma suiza de concesión de subvenciones que permite a los donantes apoyar proyectos benéficos a través de una filantropía estructurada",
    description_en: "Swiss grantmaking platform enabling donors to support charitable projects through structured philantropy ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Innovación Social, Fortalecimiento de Capacidades Organizacionales, Salud Global",
      en: "Social Innovation, Organizational Capacity Building, Global Health"
    },
    como_trabajan: {
      es: "Funciona a través de donaciones aconsejadas por donantes y administración de subvenciones.",
      en: "Works via donor advised giving and grant administration"
    },
    impacto_financiero: {
      es: "Europa Occidental ",
      en: "Western Europe"
    },
    country: "Switzerland",
    country_es: "Suiza",
    ciudad: "Ginebra, Suiza",
    continent: "europa",
    latitude: 46.948,
    longitude: 7.4474,
    website: "https://www.swissphilanthropy.ch/",
    email: "info@swissphilanthropy.ch"
  },
  {
    id: 182,
    name: "Channel Foundation",
    description_es: "Fundación privada que apoya los derechos humanos y la justicia social con un enfoque en movimientos y comunidades de escasos recursos.",
    description_en: "Private foundation supporting human rights and social justice with a focus on under resourced movements and communities ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia de Género, Derechos de las Personas con Discapacidad, LGTBIQ+",
      en: "Gender Justice, Rights of Persons with Disabilities, LGBTIQ+"
    },
    como_trabajan: {
      es: "proporciona subvenciones y apoyo a largo plazo a los socios",
      en: "provides grantmaking and long term partner support "
    },
    impacto_financiero: {
      es: "America del Sur, Africa Subshariana, America Central, Europa Occidental, America del Norte",
      en: "America del Sur, Africa Subshariana, America Central, Western Europe, America del Norte"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Seattle, Washington, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.channelfoundation.org/",
    email: "info@channelfoundation.org"
  },
  {
    id: 183,
    name: "Civic Power Fund",
    description_es: "Fondo común del Reino Unido que apoya la organización comunitaria para generar poder entre los grupos excluidos",
    description_en: "UK pool fund supporting community organazing to build power among excluded groups ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Participación Ciudadana, Movimientos Ciudadanos, Democracia",
      en: "Civic Participation, Citizen Movements, Democracy"
    },
    como_trabajan: {
      es: "Proporciona financiación mancomunada y apoyo de infraestructura para la organización.",
      en: "Provides pooled funding and infrastructure support for organizing "
    },
    impacto_financiero: {
      es: "Europa Occidental ",
      en: "Western Europe"
    },
    country: "United Kingdom",
    country_es: "Reino Unido",
    ciudad: "Londres, Reino Unido",
    continent: "europa",
    latitude: 51.5074,
    longitude: -0.1278,
    website: "https://www.civicpower.org.uk/",
    email: "info@civicpower.org.uk"
  },
  {
    id: 184,
    name: "Dalan Fund",
    description_es: "Fondo liderado por activistas que destina recursos a movimientos interseccionales de justicia social en Europa central y oriental",
    description_en: "Activist led fund resourcing intersectional social justice movements in central/ eastern europe ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Comunidades Indígenas, Justicia Económica, Justicia de Género",
      en: "Indigenous Communities, Economic Justice, Gender Justice"
    },
    como_trabajan: {
      es: "Proporciona distribución de recursos a movimientos y colectivos de base, incluida la respuesta a las crisis.",
      en: "provides resource distribution to grassroots movements and collectives including crisis response"
    },
    impacto_financiero: {
      es: "Europa Occidental, Asia Central",
      en: "Western Europe, Central Asia"
    },
    country: "Mexico",
    country_es: "México",
    ciudad: "Ciudad de México, México",
    continent: "america",
    latitude: 19.4326,
    longitude: -99.1332,
    website: "https://dalan.fund/",
    email: "info@dalan.fund"
  },
  {
    id: 185,
    name: "Democracy and Media Foundation",
    description_es: "Fundación holandesa que apoya la democracia, los medios independientes y las iniciativas cívicas a través de subvenciones y enfoques estratégicos.",
    description_en: "Dutch foundation supporting democracy, independent media and civic initiatives through grants and strategic approaches ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Democracia, Derechos Digitales, Participación Ciudadana",
      en: "Democracy, Digital Rights, Civic Participation"
    },
    como_trabajan: {
      es: "Trabajan brindando subvenciones y apoyo a proyectos y organizaciones alineados a sus áreas de enfoque.",
      en: "They work providing grants and support to projects and organizations aligned to its focused areas "
    },
    impacto_financiero: {
      es: "Europa Occidental ",
      en: "Western Europe"
    },
    country: "Netherlands",
    country_es: "Países Bajos",
    ciudad: "Ámsterdam, Países Bajos",
    continent: "europa",
    latitude: 52.3676,
    longitude: 4.9041,
    website: "https://sdm.nl/",
    email: "info@sdm.nl"
  },
  {
    id: 186,
    name: "Edge Fund ",
    description_es: "Fondo de subvenciones que apoya iniciativas de justicia social y cambio sistémico",
    description_en: "Grantmaking fund supporting social justice and  systemic change initiatives ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Social, Participación Ciudadana, Justicia Económica",
      en: "Justicia Social, Civic Participation, Economic Justice"
    },
    como_trabajan: {
      es: "Proporciona pequeñas subvenciones a organizaciones de base y campañas.",
      en: "Provides small grants to grassrooots and campaings "
    },
    impacto_financiero: {
      es: "Europa Occidental ",
      en: "Western Europe"
    },
    country: "United Kingdom",
    country_es: "Reino Unido",
    ciudad: "Londres, Reino Unido",
    continent: "europa",
    latitude: 51.5074,
    longitude: -0.1278,
    website: "https://www.edgefund.org.uk/",
    email: "info@edgefund.org.uk"
  },
  {
    id: 187,
    name: "Hispanics in Philanthropy",
    description_es: "Iniciativa de financiación mancomunada que apoya las prioridades de impacto social a través de la filantropía",
    description_en: "Pooled funding initiative supporting social impact priorities through philanthropy ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Racial, Migrantes y Refugiados, Juventud, Justicia Económica",
      en: "Racial Justice, Migrants and Refugees, Youth, Economic Justice"
    },
    como_trabajan: {
      es: "Trabajan a través de subvenciones conjuntas y apoyo de socios.",
      en: "They work via pooled grantmaking and partner support "
    },
    impacto_financiero: {
      es: "America del Norte ",
      en: "America del Norte"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Oakland, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://hipfunds.org/",
    email: "info@hiponline.org"
  },
  {
    id: 188,
    name: "Numun Fund",
    description_es: "Fondo dedicado a sembrar y sostener exosistemas e infraestructuras de tecnología feminista",
    description_en: "Fund dedicated to seeding and sustaining feminist technology exosystems and infrastructures ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Derechos Digitales, Justicia de Género, Innovación Social",
      en: "Digital Rights, Gender Justice, Social Innovation"
    },
    como_trabajan: {
      es: "Proporciona financiación, creación de ecosistemas y apoyo al activismo tecnológico feminista.",
      en: "Provides funding, ecosystem building and support for feminist tech activism "
    },
    impacto_financiero: {
      es: "Africa Subsahariana, America Central, America del Sur",
      en: "Africa Subsahariana, America Central, America del Sur"
    },
    country: "",
    country_es: "Distribuida (Enfoque en Sur Global)",
    ciudad: "Distribuida (Enfoque en Sur Global)",
    continent: "desconocido",
    latitude: 0,
    longitude: 0,
    website: "https://numun.fund/",
    email: "info@numun.fund"
  },
  {
    id: 189,
    name: "Action Opportunity Fund",
    description_es: "Fondo filantrópico que apoya iniciativas de justicia social y derechos humanos.",
    description_en: "Philanthropic fund supporting social justice and human rights initiatives.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Económica, Derechos Laborales, Innovación Social",
      en: "Economic Justice, Labor Rights, Social Innovation"
    },
    como_trabajan: {
      es: "Proporciona subvenciones y apoyo a los socios.",
      en: "Provides grantmaking and partner support"
    },
    impacto_financiero: {
      es: "America del Norte ",
      en: "America del Norte"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "San José, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://aofund.org/",
    email: "info@aofund.org"
  },
  {
    id: 190,
    name: "Partners for a New Economy",
    description_es: "La red Caminos para la prosperidad es una red global de investigación y políticas centrada en ayudar a los países de ingresos bajos y medios a aprovechar las tecnologías digitales para impulsar el crecimiento económico inclusivo y la creación de empleo.",
    description_en: "Pathways for prosperity network is a global research and policy netowrk focused on helping low and middle income countries harness digital technologies to drive inclusive economic growth and job creation ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Económica, Economía Circular, Innovación Social",
      en: "Economic Justice, Circular Economy, Social Innovation"
    },
    como_trabajan: {
      es: "Trabajan a través de investigación aplicada, asesoramiento sobre políticas, desarrollo de capacidades y colaboración con gobiernos y organizaciones internacionales. Traduciendo la evidencia, introducción a una guía política práctica",
      en: "They work through applied research, policy advisory, capacity building and collaboration with governments and international organizations. Translating evidence intro practical policy guidance"
    },
    impacto_financiero: {
      es: "Africa Subsahariana, Asia Central, Asia Oriental, America del Sur ",
      en: "Africa Subsahariana, Central Asia, East Asia, America del Sur"
    },
    country: "Switzerland",
    country_es: "Suiza",
    ciudad: "Ginebra, Suiza",
    continent: "europa",
    latitude: 46.948,
    longitude: 7.4474,
    website: "https://p4ne.org/",
    email: "info@p4ne.org"
  },
  {
    id: 191,
    name: "Safe Passage Fund",
    description_es: "Safe Passage es una organización sin fines de lucro dedicada a brindar servicios educativos y de apoyo social a jóvenes inmigrantes y refugiados, garantizando el acceso a la educación y a las oportunidades.",
    description_en: "Safe Passage is a non profit organization dedicated to providing educational and social support services to youth inmigrant and refugees, ensuring access to education and oportunities ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Derechos de Migrantes y Refugiados, Paz y Resolución de Conflictos",
      en: "Rights of Migrants and Refugees, Peace and Conflict Resolution"
    },
    como_trabajan: {
      es: "Implementan programas de servicio directo, que incluyen apoyo académico, participación familiar, tutoría para jóvenes y navegación legal.",
      en: "They implement direct service programs, incluiding academic support family engagement, young mentoring and legal navigation "
    },
    impacto_financiero: {
      es: "America del Norte ",
      en: "America del Norte"
    },
    country: "United Kingdom",
    country_es: "Reino Unido",
    ciudad: "Londres, Reino Unido",
    continent: "europa",
    latitude: 51.5074,
    longitude: -0.1278,
    website: "https://www.safe-passage.org/",
    email: "info@safe-passage.org"
  },
  {
    id: 192,
    name: "The Pawanka Fund",
    description_es: "El fondo Pawanka es un fondo filantrópico liderado por indígenas que apoya los derechos de los pueblos indígenas y la protección de sus territorios ancestrales.",
    description_en: "Pawanka fund is an indigenous led philanthropic fund supporting indigenous people rights and protection of ancestral territories  ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Comunidades Indígenas, Soberanía Alimentaria, Conservación de Recursos Naturales",
      en: "Indigenous Communities, Food Sovereignty, Natural Resources Conservation"
    },
    como_trabajan: {
      es: "Proporcionan financiación a organizaciones y movimientos indígenas, priorizando la filantropía basada en la confianza y la gestión ambiental.",
      en: "They provide funding to indigenous organizations and movements, prioritazing trust based philanthropy and enviormental stewardship"
    },
    impacto_financiero: {
      es: "America Central, America del Sur, Asia Oriental, Africa Subsahariana. ",
      en: "America Central, America del Sur, East Asia, Africa Subsahariana."
    },
    country: "Costa Rica",
    country_es: "Costa Rica",
    ciudad: "San José, Costa Rica",
    continent: "desconocido",
    latitude: 0,
    longitude: 0,
    website: "https://pawankafund.org/",
    email: "info@pawankafund.org"
  },
  {
    id: 193,
    name: "Green Climate Fund",
    description_es: "El Fondo Verde para el Clima es un mecanismo multilateral de financiación climática establecido en el marco de la CMNUCC para apoyar a los países en desarrollo en sus esfuerzos de mitigación y adaptación al clima.",
    description_en: "The Green climate fund is a multilateral climate finance mechanism estabilished under the UNFCCC to support developing countries in climate mitigation and addaptation efforts ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Transición Energética, Ciudades Sustentables, Gobernanza Global",
      en: "Climate Justice, Energy Transition, Sustainable Cities, Gobernanza Global"
    },
    como_trabajan: {
      es: "Operan a través de financiamiento de proyectos a gran escala, entidades implementadoras acreditadas, préstamos concesionales, donaciones y financiamiento combinado, trabajando con gobiernos, bancos de desarrollo y agencias internacionales.",
      en: "They operate through large-scale project financing, accredited implementing entities, concessional loans, grants, and blended finance, working with governments, development banks, and international agencies."
    },
    impacto_financiero: {
      es: "Africa Subsahariana, Asia Central, Asia Oriental, America del Sur, Ameria Central, Oceania",
      en: "Africa Subsahariana, Central Asia, East Asia, America del Sur, Ameria Central, Oceania"
    },
    country: "Corea del Sur",
    country_es: "Corea del Sur",
    ciudad: "Incheon, Corea del Sur",
    continent: "desconocido",
    latitude: 0,
    longitude: 0,
    website: "https://www.greenclimate.fund/",
    email: "info@gcfund.org"
  },
  {
    id: 194,
    name: " The Rockefeller Foundation",
    description_es: "Organización filantrópica global centrada en promover la prosperidad inclusiva, la equidad en salud, la resiliencia climática y el acceso a la energía.",
    description_en: "Global philanthropic organization focused on advancing inclusive prosperity, health equity, climate resilience and energy access ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Salud Global, Innovación Social, Justicia Climática, Seguridad Alimentaria",
      en: "Global Health, Social Innovation, Climate Justice, Seguridad Alimentaria"
    },
    como_trabajan: {
      es: "Participan en subvenciones estratégicas, inversiones de impacto, innovación de políticas y asociaciones a gran escala, y a menudo ponen a prueba soluciones que los gobiernos y los mercados pueden ampliar.",
      en: "They engage in strategic grantmaking, impact investing, policy innovation, and large-scale partnerships, often piloting solutions that can be scaled by governments and markets."
    },
    impacto_financiero: {
      es: "America del Norte, Africa Subsahariana, Asia Oriental, Asia Central",
      en: "America del Norte, Africa Subsahariana, East Asia, Central Asia"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.rockefellerfoundation.org/",
    email: "info@rockefellerfoundation.org"
  },
  {
    id: 195,
    name: "Adaptation Fund",
    description_es: "El Fondo de Adaptación financia proyectos de adaptación climática en países en desarrollo que son particularmente vulnerables a los impactos del cambio climático.",
    description_en: "The Adaptation Fund finances climate adaptation projects in developing countries that are particularly vulnerable to climate change impacts.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Conservación de Recursos Naturales, Soberanía Alimentaria",
      en: "Climate Justice, Natural Resources Conservation, Food Sovereignty"
    },
    como_trabajan: {
      es: "Proporcionan acceso directo a financiación a instituciones nacionales y regionales, apoyando proyectos de adaptación y desarrollo de capacidades impulsados ​​localmente.",
      en: "They provide direct access financing to national and regional institutions, supporting locally driven adaptation projects and capacity building."
    },
    impacto_financiero: {
      es: "Africa Subsahariana, America Cnetral, America del Sur, Asia Central, Asia Oriental. ",
      en: "Africa Subsahariana, America Cnetral, America del Sur, Central Asia, Asia Oriental."
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Washington D.C., EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.adaptation-fund.org/",
    email: "info@adaptation-fund.org"
  },
  {
    id: 196,
    name: "Amazon Conservation Team Columbia",
    description_es: "El equipo Amazon es una organización liderada por indígenas que fortalece la gobernanza territorial y las capacidades de incidencia de los pueblos indígenas en la cuenca del Amazonas.",
    description_en: "Amazon team is an indigenous led organization that strengthens territorial governance and advocacy capacities of indigenous people in the Amazon Basin ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Comunidades Indígenas, Conservación de Recursos Naturales, Salud Global",
      en: "Indigenous Communities, Natural Resources Conservation, Global Health"
    },
    como_trabajan: {
      es: "Apoyan la organización comunitaria, la capacitación de líderes, la promoción de políticas y la representación internacional de las comunidades indígenas que defienden sus territorios.",
      en: "they support comunity organizing, leadership training, policy advocacy and international representation for indigenous communities defending their territories "
    },
    impacto_financiero: {
      es: "America del Sur ",
      en: "America del Sur"
    },
    country: "EE. UU. (Sede Colombia en Bogotá)",
    country_es: "EE. UU. (Sede Colombia en Bogotá)",
    ciudad: "Arlington, Virginia, EE. UU. (Sede Colombia en Bogotá)",
    continent: "desconocido",
    latitude: 0,
    longitude: 0,
    website: "https://www.amazonteam.org/",
    email: "info@amazonteam.org"
  },
  {
    id: 197,
    name: "Belmont Forum",
    description_es: "El Belmont Forum es una asociación internacional de financiadores de investigaciones que promueven la investigación transdisciplinaria sobre el cambio ambiental global.",
    description_en: "The Belmont Forum is an international partnership of research funders advancing transdisciplinary research on global environmental change.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Conservación de Recursos Naturales, Innovación Social, Gobernanza Global",
      en: "Climate Justice, Natural Resources Conservation, Social Innovation, Gobernanza Global"
    },
    como_trabajan: {
      es: "Coordinan convocatorias conjuntas de financiación de investigaciones, colaboración científica e integración de conocimientos entre agencias de investigación nacionales.",
      en: "They coordinate joint research funding calls, scientific collaboration, and knowledge integration across national research agencies."
    },
    impacto_financiero: {
      es: "America del Norte, Europa Occidental, Asia Occidental ",
      en: "America del Norte, Western Europe, Asia Occidental"
    },
    country: "Uruguay (Secretariado actual)",
    country_es: "Uruguay (Secretariado actual)",
    ciudad: "Montevideo, Uruguay (Secretariado actual)",
    continent: "desconocido",
    latitude: 0,
    longitude: 0,
    website: "https://belmontforum.org/",
    email: "info@belmontforum.org"
  },
  {
    id: 198,
    name: "Clara Lionel Foundation",
    description_es: "La Fundación Clara Lionel apoya iniciativas que abordan la justicia climática, la educación y la resiliencia comunitaria, con un enfoque en las comunidades de primera línea.",
    description_en: "The Clara Lionel Foundation supports initiatives addressing climate justice, education, and community resilience, with a focus on frontline communities.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Juventud, Educación de Calidad, Salud Global",
      en: "Climate Justice, Youth, Quality Education, Global Health"
    },
    como_trabajan: {
      es: "Proporcionan subvenciones y asociaciones estratégicas a organizaciones que promueven soluciones climáticas y equidad social.",
      en: "They provide grantmaking and strategic partnerships to organizations advancing climate solutions and social equity"
    },
    impacto_financiero: {
      es: "America del Norte, America Central, ",
      en: "America del Norte, America Central, "
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Beverly Hills, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.claralionelfoundation.org/",
    email: "info@claralionelfoundation.org"
  },
  {
    id: 199,
    name: "Clinton Health Access Initiative",
    description_es: "CHAI es una organización de salud global que trabaja para ampliar el acceso a medicamentos, diagnósticos y fortalecimiento de los sistemas de salud que salvan vidas.",
    description_en: "CHAI is a global health organization working to expand access to life-saving medicines, diagnostics, and health systems strengthening..",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Salud Global, Justicia Económica, Gobernanza Global, políticas y rendición de cuentas",
      en: "Global Health, Economic Justice, Gobernanza Global, políticas y rendición de cuentas"
    },
    como_trabajan: {
      es: "Colaboran con gobiernos, fabricantes y donantes para reducir costos, mejorar las cadenas de suministro y ampliar las intervenciones de salud pública.",
      en: "They collaborate with governments, manufacturers, and donors to reduce costs, improve supply chains, and scale public health interventions."
    },
    impacto_financiero: {
      es: "Africa Subsahariana, Asia Oriental, Asia Central ",
      en: "Africa Subsahariana, East Asia, Central Asia"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Boston, Massachusetts, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.clintonhealthaccess.org/",
    email: "info@clintonhealthaccess.org"
  },
  {
    id: 200,
    name: "Foundation S - The Sanofi Collective",
    description_es: "Foundation S es el brazo filantrópico de Sanofi, enfocado en mejorar la equidad en salud y fortalecer los sistemas de salud en contextos vulnerables.",
    description_en: "Foundation S is the philanthropic arm of Sanofi, focused on improving health equity and strengthening healthcare systems in vulnerable contexts.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Salud Global, Justicia Climática, Innovación Social",
      en: "Global Health, Climate Justice, Social Innovation"
    },
    como_trabajan: {
      es: "Apoyan programas de salud, iniciativas de investigación y asociaciones alineadas con las prioridades de salud global.",
      en: "They support health programs, research initiatives, and partnerships aligned with global health priorities."
    },
    impacto_financiero: {
      es: "Africa Subsahariana, Asia Central ",
      en: "Africa Subsahariana, Central Asia"
    },
    country: "France",
    country_es: "Francia",
    ciudad: "París, Francia",
    continent: "europa",
    latitude: 48.8566,
    longitude: 2.3522,
    website: "https://www.foundation-s.sanofi.com/",
    email: "foundation.s@sanofi.com"
  },
  {
    id: 201,
    name: "Global Climate and Health Alliance",
    description_es: "La Alianza Clima y Salud es una coalición que aboga por la acción climática como una prioridad de salud pública.",
    description_en: "The Climate and Health Alliance is a coalition advocating for climate action as a public health priority.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Salud Global, Gobernanza Global, políticas y rendición de cuentas",
      en: "Climate Justice, Global Health, Gobernanza Global, políticas y rendición de cuentas"
    },
    como_trabajan: {
      es: "Se involucran en la promoción de políticas, la difusión de investigaciones y la coordinación entre organizaciones de salud para influir en la política climática.",
      en: "They engage in policy advocacy, research dissemination, and coordination among health organizations to influence climate policy."
    },
    impacto_financiero: {
      es: "America del Norte",
      en: "America del Norte"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "San Francisco, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://climateandhealthalliance.org/",
    email: "info@climateandhealthalliance.org"
  },
  {
    id: 202,
    name: "BMW Foundation Herbert Quandt",
    description_es: "La Fundación BMW promueve el liderazgo responsable y la innovación social para abordar los desafíos sociales.",
    description_en: "The BMW Foundation promotes responsible leadership and social innovation to address societal challenges.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Innovación Social, Liderazgo, Ciudades Sustentables, Justicia Económica",
      en: "Social Innovation, Liderazgo, Sustainable Cities, Economic Justice"
    },
    como_trabajan: {
      es: "Operan a través de programas de liderazgo, redes globales de compañeros y diálogo intersectorial.",
      en: "They operate through leadership programs, global fellow networks, and cross-sector dialogue."
    },
    impacto_financiero: {
      es: "Europa Occidental, America del Norte",
      en: "Western Europe, America del Norte"
    },
    country: "Germany",
    country_es: "Alemania",
    ciudad: "Berlín, Alemania",
    continent: "europa",
    latitude: 52.52,
    longitude: 13.405,
    website: "https://bmw-foundation.org/",
    email: "info@bmw-foundation.org"
  },
  {
    id: 203,
    name: "Bürgerstiftung Bonn",
    description_es: "Bürgerstiftung Bonn es una fundación comunitaria alemana que promueve el compromiso cívico, la cohesión social, la educación y la responsabilidad ambiental a nivel local y regional.",
    description_en: "Bürgerstiftung Bonn is a German community foundation that promotes civic engagement, social cohesion, education, and environmental responsibility at the local and regional level.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Participación Ciudadana, Educación de Calidad, Fortalecimiento de Capacidades Organizacionales",
      en: "Civic Participation, Quality Education, Organizational Capacity Building"
    },
    como_trabajan: {
      es: "Financian proyectos locales, movilizan la participación ciudadana, gestionan dotaciones comunitarias y colaboran con actores de la sociedad civil para fortalecer iniciativas democráticas y sociales.",
      en: "They fund local projects, mobilize citizen participation, manage community endowments, and collaborate with civil society actors to strengthen democratic and social initiatives."
    },
    impacto_financiero: {
      es: "Europa Occidental ",
      en: "Western Europe"
    },
    country: "Germany",
    country_es: "Alemania",
    ciudad: "Bonn, Alemania",
    continent: "europa",
    latitude: 52.52,
    longitude: 13.405,
    website: "https://www.buergerstiftung-bonn.de/",
    email: "info@buergerstiftung-bonn.de"
  },
  {
    id: 204,
    name: "Democracy Works Foundation",
    description_es: "La Fundación Democracy Works apoya la gobernanza democrática y la participación cívica a través de la investigación y el diálogo.",
    description_en: "Democracy Works Foundation supports democratic governance and civic participation through research and dialogue.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Democracia, Participación Ciudadana, Gobernanza Global, políticas y rendición de cuentas",
      en: "Democracy, Civic Participation, Gobernanza Global, políticas y rendición de cuentas"
    },
    como_trabajan: {
      es: "Implementan investigaciones de políticas, convocatorias e iniciativas de educación cívica.",
      en: "They implement policy research, convenings, and civic education initiatives."
    },
    impacto_financiero: {
      es: "Africa Subsahariana ",
      en: "Africa Subsahariana"
    },
    country: "South Africa",
    country_es: "Sudáfrica",
    ciudad: "Johannesburgo, Sudáfrica",
    continent: "africa",
    latitude: -25.7479,
    longitude: 28.2293,
    website: "https://www.democracyworks.org.za/",
    email: "info@democracyworks.org.za"
  },
  {
    id: 205,
    name: "Deutsche Bundesstiftung Umwelt",
    description_es: "DBU es una de las fundaciones medioambientales más grandes de Europa y apoya la innovación y la investigación en la protección del medio ambiente.",
    description_en: "DBU is one of Europe’s largest environmental foundations, supporting innovation and research in environmental protection.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales, Innovación Social, Economía Circular, Transición Energética",
      en: "Natural Resources Conservation, Social Innovation, Circular Economy, Energy Transition"
    },
    como_trabajan: {
      es: "Proporcionan subvenciones, becas y financiación para investigación aplicada.",
      en: "They provide grants, fellowships, and applied research funding."
    },
    impacto_financiero: {
      es: "Europa Occidental ",
      en: "Western Europe"
    },
    country: "Germany",
    country_es: "Alemania",
    ciudad: "Osnabrück, Alemania",
    continent: "europa",
    latitude: 52.52,
    longitude: 13.405,
    website: "https://www.dbu.de/",
    email: "info@dbu.de"
  },
  {
    id: 206,
    name: "Deutsche Meeresstiftung",
    description_es: "Deutsche Meeresstiftung es una fundación alemana de conservación marina centrada en la protección de los océanos y la biodiversidad marina. Defiende el uso sostenible de los recursos marinos y apoya soluciones impulsadas por la investigación para preservar los ecosistemas marinos.",
    description_en: "Deutsche Meeresstiftung is a German marine conservation foundation focused on protecting oceans and marine biodiversity. It champions sustainable use of marine resources and supports research-driven solutions to preserve marine ecosystems.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales, Justicia Climática, Educación de Calidad",
      en: "Natural Resources Conservation, Climate Justice, Quality Education"
    },
    como_trabajan: {
      es: "Financian y coordinan investigaciones científicas, proyectos de conservación, educación pública y promoción de políticas en colaboración con instituciones académicas, ONG y partes interesadas del sector pesquero.",
      en: "They fund and coordinate scientific research, conservation projects, public education, and policy advocacy in collaboration with academic institutions, NGOs, and fisheries stakeholders."
    },
    impacto_financiero: {
      es: "Europa Occidental , Africa Subsahariana, Asia Oriental",
      en: "Western Europe, Africa Subsahariana, East Asia"
    },
    country: "Germany",
    country_es: "Alemania",
    ciudad: "Hamburgo, Alemania",
    continent: "europa",
    latitude: 52.52,
    longitude: 13.405,
    website: "https://www.meeresstiftung.de/",
    email: "info@meeresstiftung.de"
  },
  {
    id: 207,
    name: "Fondation Prince Albert II de Monaco",
    description_es: "Fundación filantrópica que apoya la innovación social, las iniciativas culturales y la preservación ambiental a través de financiamiento estratégico y participación comunitaria.",
    description_en: "philanthropic foundation that supports social innovation, cultural initiatives, and environmental preservation through strategic funding and community engagement.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales, Justicia Climática, Transición Energética",
      en: "Natural Resources Conservation, Climate Justice, Energy Transition"
    },
    como_trabajan: {
      es: "Proporcionan subvenciones multianuales, evaluaciones de proyectos, orientación de expertos y creación de asociaciones con organizaciones de la sociedad civil para implementar iniciativas sostenibles y de impacto social.",
      en: "They provide multi-year grants, project evaluations, expert guidance, and partnership-building with civil society organizations to implement sustainable and socially impactful initiatives."
    },
    impacto_financiero: {
      es: "Europa Occidental, Africa Subsahariana, America del Norte",
      en: "Western Europe, Africa Subsahariana, America del Norte"
    },
    country: "Mónaco",
    country_es: "Mónaco",
    ciudad: "Montecarlo, Mónaco",
    continent: "desconocido",
    latitude: 0,
    longitude: 0,
    website: "https://www.fpa2.org/",
    email: "contact@fondationprincealbert2.mc"
  },
  {
    id: 208,
    name: "Fondazione Cariplo",
    description_es: "Fundazione Caripio es una de las fundaciones que otorgan subvenciones más grandes de Italia y apoya la cohesión social, el desarrollo cultural, la investigación científica y la sostenibilidad ambiental.",
    description_en: "Fundazione Caripio is one of italy's largest grantmaking foundations, supporting social cohesion, cultural develppment, scientific research, and environmental sustainability",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Innovación Social, Educación de Calidad, Conservación de Recursos Naturales, Juventud",
      en: "Social Innovation, Quality Education, Natural Resources Conservation, Youth"
    },
    como_trabajan: {
      es: "Operan a través de programas de subvenciones, iniciativas temáticas, asociaciones de largo plazo con organizaciones sin fines de lucro y convocatorias de financiamiento que fortalecen las comunidades y la generación de conocimiento.",
      en: "They operate through grant programs, thematic initiatives, long term partnerships with non profits and funding calls that strengthen communities and knowledge generation "
    },
    impacto_financiero: {
      es: "Europa Occidental, Africa Subsahariana, America del Sur ",
      en: "Western Europe, Africa Subsahariana, America del Sur"
    },
    country: "Italy",
    country_es: "Italia",
    ciudad: "Milán, Italia",
    continent: "europa",
    latitude: 41.9028,
    longitude: 12.4964,
    website: "https://www.fondazionecariplo.it/",
    email: "info@fondazionecariplo.it"
  },
  {
    id: 209,
    name: "Foundation Scotland",
    description_es: "Foundation Scotland es una fundación que otorga subvenciones que apoya soluciones lideradas por la comunidad para desafíos sociales, económicos y ambientales en Escocia e internacionalmente.",
    description_en: "Foundation Scotland is a grantmaking fonudation that supports community led solutions for social, economic and enviromental challenges across Scotland and internationally ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Participación Ciudadana, Justicia Económica, Fortalecimiento de Capacidades Organizacionales",
      en: "Civic Participation, Economic Justice, Organizational Capacity Building"
    },
    como_trabajan: {
      es: "Proporcionan subvenciones asesoradas, estratégicas y comunitarias, colaboran con socios locales y potencian iniciativas de base para abordar la desigualdad y mejorar la resiliencia comunitaria.",
      en: "they provide advised, strategic and community grants, collaborate with local parnters and empower grassroots initiatives to address inequality and enhance community resilience "
    },
    impacto_financiero: {
      es: "Europa Occidental, Africa Subsahariana",
      en: "Western Europe, Africa Subsahariana"
    },
    country: "United Kingdom",
    country_es: "Reino Unido",
    ciudad: "Edimburgo, Reino Unido",
    continent: "europa",
    latitude: 51.5074,
    longitude: -0.1278,
    website: "https://www.foundationscotland.org.uk/",
    email: "info@foundationscotland.org.uk"
  },
  {
    id: 210,
    name: "Renewable Energy Institute",
    description_es: "El instituto de energías renovables es una organización dedicada a promover la investigación y las estrategias de implementación de energías renovables para acelerar la transición energética global.",
    description_en: "The renewable institute is an organization dedicated to advancing renewable energy research and deployment strategies to accelerate the global energy transtion ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Transición Energética, Justicia Climática, Gobernanza Global, políticas y rendición de cuentas",
      en: "Energy Transition, Climate Justice, Gobernanza Global, políticas y rendición de cuentas"
    },
    como_trabajan: {
      es: "Realizan investigaciones, programas de desarrollo de capacidades y recomendaciones de políticas para apoyar la adopción de energías renovables y el desarrollo de habilidades.",
      en: "They conduct research, capacity building programs and policy recommendations to support renewable energy adoption and skills development "
    },
    impacto_financiero: {
      es: "Europa Occidental, Asia Oriental, America del Norte",
      en: "Western Europe, East Asia, America del Norte"
    },
    country: "Japan",
    country_es: "Japón",
    ciudad: "Tokio, Japón",
    continent: "asia",
    latitude: 35.6762,
    longitude: 139.6503,
    website: "https://www.renewableinstitute.org/",
    email: "info@renewableinstitute.org"
  },
  {
    id: 211,
    name: "Energy Foundation",
    description_es: "Apoya la conservación del medio ambiente, el desarrollo sostenible y la administración comunitaria de los recursos naturales.",
    description_en: "Supports environmental conservation, sustainable development and community based stewardship of natural resources ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Transición Energética, Ciudades Sustentables, Justicia Climática",
      en: "Energy Transition, Sustainable Cities, Climate Justice"
    },
    como_trabajan: {
      es: "Otorgan subvenciones, organizan la participación de la comunidad, realizan investigaciones y apoyan la promoción para proteger los ecosistemas y promover la conciencia pública sobre los problemas ambientales.",
      en: "they make grants, organize community engagment, conduct research and support advocacy to protect ecosystems and advanced public awareness of environmental issues  "
    },
    impacto_financiero: {
      es: "America del Norte,  Africa Subsahariana, Europa Occidental ",
      en: "America del Norte, Africa Subsahariana, Western Europe"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "San Francisco, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.ef.org/",
    email: "info@ef.org"
  },
  {
    id: 212,
    name: "Stiftung Allianz für Entwicklung und Klima",
    description_es: "Es una coalición de ONG alemanas y actores cívicos que trabajan para integrar la justicia climática y la política de desarrollo.",
    description_en: "it is a coalition of german NGO's and civic actors working to integrate climate justice and development policy",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Conservación de Recursos Naturales, Soberanía Alimentaria",
      en: "Climate Justice, Natural Resources Conservation, Food Sovereignty"
    },
    como_trabajan: {
      es: "coordinan la promoción de políticas, campañas públicas y programación conjunta para influir en las agendas climáticas y de desarrollo a nivel nacional y de la UE.",
      en: "they coordinate policy advocacy, public campaigns and joint programming to influence national and EU level climate and development agendas. "
    },
    impacto_financiero: {
      es: "Europa Occidental, Africa Subsahariana, Asia Central ",
      en: "Western Europe, Africa Subsahariana, Central Asia"
    },
    country: "Germany",
    country_es: "Alemania",
    ciudad: "Berlín, Alemania",
    continent: "europa",
    latitude: 52.52,
    longitude: 13.405,
    website: "https://allianz-entwicklung-klima.de/",
    email: "info@allianz-entwicklung-klima.de"
  },
  {
    id: 213,
    name: "Stiftung Forum für Verantwortung",
    description_es: "Newtork cívico alemán que promueve políticas éticas, ecológicas y socialmente responsables",
    description_en: "German civic newtork promoting ethical, ecological and socially responsible policies ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Educación de Calidad, Democracia, Conservación de Recursos Naturales",
      en: "Quality Education, Democracy, Natural Resources Conservation"
    },
    como_trabajan: {
      es: "Participan en el discurso público, eventos educativos, difusión de investigaciones sobre participación política y diálogo con las partes interesadas para moldear la comprensión y la acción pública sobre cuestiones de responsabilidad.",
      en: "They engage in public discourse, educational events, policy engagement research dissemination and stakeholder dialogue to shape public understanding and action on responsability issues "
    },
    impacto_financiero: {
      es: "Europa Occidental, Africa Subsahariana ",
      en: "Western Europe, Africa Subsahariana"
    },
    country: "Germany",
    country_es: "Alemania",
    ciudad: "Winden, Alemania",
    continent: "europa",
    latitude: 52.52,
    longitude: 13.405,
    website: "https://www.forum-fuer-verantwortung.de/",
    email: "info@forum-fuer-verantwortung.de"
  },
  {
    id: 214,
    name: "Stiftung KlimaWirtschaft",
    description_es: "Klimawirtschaft es una ONG que aboga por políticas económicas respetuosas con el clima y soluciones basadas en el mercado que alineen la actividad económica con los objetivos de sostenibilidad.",
    description_en: "Klimawirtschaft is an NGO that advocates for climate-friendly economic policies and market-based solutions that align economic activity with sustainability goals.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Transición Energética, Economía Circular, Gobernanza Global, políticas y rendición de cuentas",
      en: "Energy Transition, Circular Economy, Gobernanza Global, políticas y rendición de cuentas"
    },
    como_trabajan: {
      es: "Realizan investigaciones de políticas, participación de las partes interesadas, promoción pública y modelos económicos para promover estrategias económicas alineadas con el clima.",
      en: "They conduct policy research, stakeholder engagement, public advocacy, and economic modeling to promote climate-aligned economic strategies."
    },
    impacto_financiero: {
      es: "Europa Occidental, America del Norte",
      en: "Western Europe, America del Norte"
    },
    country: "Germany",
    country_es: "Alemania",
    ciudad: "Berlín, Alemania",
    continent: "europa",
    latitude: 52.52,
    longitude: 13.405,
    website: "https://klimawirtschaft.org/",
    email: "info@klimawirtschaft.org"
  },
  {
    id: 215,
    name: "World Future Council",
    description_es: "El consejo mundial del futuro incorpora los intereses de las generaciones futuras a la toma de decisiones de hoy identificando y promoviendo soluciones políticas efectivas que promuevan la sostenibilidad, la equidad y la paz.",
    description_en: "The world future council brings the interests of future generations into today's decision making by indetifying and promoting effective policy solutions that advance sustainability, equity and peace ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Gobernanza Global, políticas y rendición de cuentas, Democracia, Paz y Resolución de Conflictos",
      en: "Gobernanza Global, políticas y rendición de cuentas, Democracy, Peace and Conflict Resolution"
    },
    como_trabajan: {
      es: "Promoción global, asociaciones estratégicas y convocatorias para resaltar las mejores prácticas en gobernanza y promover la adopción de políticas orientadas al futuro entre gobiernos e instituciones.",
      en: "global advocacy, strategic partnerships, and convenings to highlight best practices in governance and promote adoption of future-oriented policies among governments and institutions"
    },
    impacto_financiero: {
      es: "Europa Occidental, Africa Subsahariana ",
      en: "Western Europe, Africa Subsahariana"
    },
    country: "Germany",
    country_es: "Alemania",
    ciudad: "Hamburgo, Alemania",
    continent: "europa",
    latitude: 52.52,
    longitude: 13.405,
    website: "https://www.worldfuturecouncil.org/",
    email: "info@worldfuturecouncil.org"
  },
  {
    id: 216,
    name: "CLIMA Fund",
    description_es: "Climate Solutions es una organización sin fines de lucro con sede en EE. UU. dedicada a acelerar la transición hacia una economía sin emisiones de carbono mediante el avance de políticas climáticas prácticas y escalables y estrategias de energía limpia.",
    description_en: "Climate Solutions is a U.S.-based nonprofit dedicated to accelerating the transition to a zero-carbon economy by advancing practical and scalable climate policies and clean energy strategies.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Soberanía Alimentaria, Comunidades Indígenas, Movimientos Ciudadanos",
      en: "Climate Justice, Food Sovereignty, Indigenous Communities, Citizen Movements"
    },
    como_trabajan: {
      es: "Integran el diseño de políticas, el modelado económico, la participación de las partes interesadas y la creación de coaliciones para apoyar el liderazgo climático estatal y nacional y la implementación de energía limpia.",
      en: "They integrate policy design, economic modeling, stakeholder engagement, and coalition building to support state and national climate leadership and clean energy implementation."
    },
    impacto_financiero: {
      es: "America del Norte, Europa Occidental ",
      en: "America del Norte, Western Europe"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "San Francisco, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://climasolutions.org/",
    email: "info@climafund.org"
  },
  {
    id: 217,
    name: "Rockefeller Family Fund",
    description_es: "El personal de expertos y estrategas temáticos del Rockefeller Family Fund trabaja en tres áreas de programas para desarrollar e implementar iniciativas y otorgar subvenciones en asociación con organizaciones, líderes, expertos y otros financiadores nacionales y estatales.",
    description_en: "The Rockefeller Family Fund's staff of issue experts and strategists work across three program areas to develop and implement initiatives and make grants in partnership with national and state-based organizations, leaders, experts, and other funders.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Democracia, Justicia Económica",
      en: "Climate Justice, Democracy, Economic Justice"
    },
    como_trabajan: {
      es: "RFF trabaja en múltiples niveles para impulsar el cambio social: identificando los pasos transformadores necesarios, impulsando a las organizaciones e individuos adecuados para liderar, proporcionando financiación inicial, trabajando como socios estratégicos y reclutando otros financiadores y aliados para ayudar a que nuestros esfuerzos crezcan.",
      en: "RFF works at multiple levels to drive social change – identifying necessary transformative steps, galvanizing the right organizations and individuals to lead, providing seed funding, working as strategic partners, and recruiting other funders and allies to help our efforts grow."
    },
    impacto_financiero: {
      es: "America del Norte, Europa Occidental ",
      en: "America del Norte, Western Europe"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://rffund.org/",
    email: "info@rffund.org"
  },
  {
    id: 218,
    name: "Greenpeace Fund",
    description_es: "El Fondo Greenpeace es el brazo filantrópico asociado con el movimiento Greenpeace, que canaliza recursos para promover iniciativas de protección ambiental, acción climática y conservación de la biodiversidad alineadas con los valores de Greenpeace.",
    description_en: "Greenpeace Fund is the philanthropic arm associated with Greenpeace movement, channeling resources to advance environmental protection, climate action, and biodiversity conservation initiatives aligned with Greenpeace values.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Conservación de Recursos Naturales, Movimientos Ciudadanos",
      en: "Climate Justice, Natural Resources Conservation, Citizen Movements"
    },
    como_trabajan: {
      es: "A través de subvenciones estratégicas, apoyo a campañas, financiación de investigaciones e iniciativas de participación pública, el Fondo apoya a socios ambientales de base, nacionales e internacionales.",
      en: " Through strategic grantmaking, campaign support, research funding, and public engagement initiatives, the Fund supports grassroots, national, and international environmental partners."
    },
    impacto_financiero: {
      es: "America del Norte, Europa Occidental ",
      en: "America del Norte, Western Europe"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Washington D.C., EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://greenpeacefund.org/",
    email: "info@greenpeacefund.org"
  },
  {
    id: 219,
    name: "Forest, People, Climate",
    description_es: "Bosques, Personas y Clima es una coalición que promueve soluciones climáticas que centran los derechos, el conocimiento y el liderazgo de los pueblos indígenas y las comunidades locales para la conservación de los bosques y la estabilidad climática.",
    description_en: "Forests, People & Climate is a coalition advancing climate solutions that center the rights, knowledge, and leadership of Indigenous Peoples and local communities for forest conservation and climate stability.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales, Comunidades Indígenas, Justicia Climática",
      en: "Natural Resources Conservation, Indigenous Communities, Climate Justice"
    },
    como_trabajan: {
      es: "Coordinan la promoción de políticas, la participación comunitaria, la síntesis de investigaciones y la creación de plataformas para amplificar las voces indígenas en los foros climáticos globales e influir en las políticas climáticas y forestales.",
      en: "They coordinate policy advocacy, community engagement, research synthesis, and platform building to amplify Indigenous voices in global climate forums and influence climate-forest policy."
    },
    impacto_financiero: {
      es: "America del Sur, Africa Subsahariana, Asia Oriental ",
      en: "America del Sur, Africa Subsahariana, East Asia"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "San Francisco, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.forestspeopleclimate.org/",
    email: "info@forestspeopleclimate.org"
  },
  {
    id: 220,
    name: "Margaret A. Cargill Philanthropies",
    description_es: "MacPhilanthropies apoya a organizaciones de alto impacto que trabajan en educación, justicia social, medio ambiente y resiliencia comunitaria proporcionando inversiones filantrópicas catalíticas y de largo plazo.",
    description_en: "MacPhilanthropies supports high-impact organizations working across education, social justice, environment, and community resilience by providing catalytic and long-term philanthropic investment.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales, Socorro en Desastres, Educación de Calidad",
      en: "Natural Resources Conservation, Socorro en Desastres, Quality Education"
    },
    como_trabajan: {
      es: "Participan en la concesión de subvenciones estratégicas, asociaciones plurianuales, evaluaciones de impacto y colaboración intersectorial para ampliar soluciones que aborden las desigualdades estructurales y los desafíos sistémicos.",
      en: "They engage in strategic grantmaking, multi-year partnerships, impact assessment, and cross-sector collaboration to scale solutions addressing structural inequities and systemic challenges."
    },
    impacto_financiero: {
      es: "Africa Subsahariana, America del Norte, Europa occidental ",
      en: "Africa Subsahariana, America del Norte, Western Europe"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Eden Prairie, Minnesota, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.macphilanthropies.org/",
    email: "info@cargillphilanthropies.org"
  },
  {
    id: 221,
    name: "The Grantham Foundation",
    description_es: "La Fundación Grantham financia investigaciones científicas, iniciativas políticas y campañas de promoción destinadas a abordar el cambio climático, proteger los ecosistemas y promover una transición energética sostenible.",
    description_en: "The Grantham Foundation funds scientific research, policy initiatives, and advocacy campaigns aimed at addressing climate change, protecting ecosystems, and promoting a sustainable energy transition.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Innovación Social, Conservación de Recursos Naturales",
      en: "Climate Justice, Social Innovation, Natural Resources Conservation"
    },
    como_trabajan: {
      es: "Se concentran en inversiones en investigación a largo plazo, apoyo a grupos de expertos y socios académicos, promoción de políticas y colaboraciones estratégicas para influir en las políticas climáticas y el progreso científico.",
      en: "They concentrate on long-term research investment, supporting think tanks and academic partners, policy advocacy, and strategic collaborations to influence climate policy and scientific progress."
    },
    impacto_financiero: {
      es: "Asia Oriental, America del Norte, Europa Occidental ",
      en: "East Asia, America del Norte, Western Europe"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Boston, Massachusetts, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.granthamfoundation.org/",
    email: "info@granthamfoundation.org"
  },
  {
    id: 222,
    name: "The Klarman Family Foundation",
    description_es: "La Fundación Klarman financia esfuerzos para promover la equidad, la integridad democrática y las políticas públicas inclusivas a través del apoyo estratégico a organizaciones que trabajan en reformas y cambios sistémicos.",
    description_en: "The Klarman Foundation funds efforts to advance equity, democratic integrity, and inclusive public policy through strategic support for organizations working on reform and systemic change.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Salud Global, Democracia, Derechos de las Infancias",
      en: "Global Health, Democracy, Children's Rights"
    },
    como_trabajan: {
      es: "A través de subvenciones específicas, desarrollo de capacidades y apoyo organizacional a largo plazo, la Fundación permite la promoción y el fortalecimiento institucional en áreas de derechos civiles, democracia y cambio social.",
      en: "Through targeted grantmaking, capacity building, and long-term organizational support, the Foundation enables advocacy and institutional strengthening in areas of civil rights, democracy, and social change."
    },
    impacto_financiero: {
      es: "America del Norte, Europa Occidental ",
      en: "America del Norte, Western Europe"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Boston, Massachusetts, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.klarmanfoundation.org/",
    email: "info@klarmanfoundation.org"
  },
  {
    id: 223,
    name: "The Joseph & Vera Long Foundation",
    description_es: "es una fundación familiar privada que imagina un mundo donde se preservan los recursos naturales, se crean oportunidades para que los niños y los jóvenes prosperen, se brinda atención adecuada a los afligidos y más vulnerables, y se apoya a las mujeres.",
    description_en: "is a private, family foundation that envisions a world where natural resources are preserved, opportunities are created for children and youth to thrive, adequate care is provided for the afflicted and most vulnerable, and women are supported.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales, Salud Global, Educación de Calidad",
      en: "Natural Resources Conservation, Global Health, Quality Education"
    },
    como_trabajan: {
      es: "La Fundación brinda apoyo financiero a organizaciones calificadas sin fines de lucro que trabajan para mejorar las comunidades del norte de California y Hawaii, actualmente en cinco áreas de programa.",
      en: "The Foundation provides financial support to qualified not-for-profit organizations working to improve the communities of Northern California and Hawaii, currently in five program areas."
    },
    impacto_financiero: {
      es: "America del Norte ",
      en: "America del Norte"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Walnut Creek, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.jvlf.org/",
    email: "info@jvlf.org"
  },
  {
    id: 224,
    name: "Vere Initiative",
    description_es: "asociado con el Consejo Empresarial Mundial para el Desarrollo Sostenible, una red empresarial global que promueve el desarrollo económico sostenible y el liderazgo corporativo en cuestiones climáticas y sociales.",
    description_en: "associated with the World Business Council for Sustainable Development, a global business network that promotes sustainable economic development and corporate leadership on climate and social issues.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Transición Energética, Innovación Social",
      en: "Climate Justice, Energy Transition, Social Innovation"
    },
    como_trabajan: {
      es: "Operan a través de asociaciones corporativas, coaliciones industriales, iniciativas de investigación y difusión de mejores prácticas para ayudar a las empresas a integrar la sostenibilidad en su estrategia central.",
      en: "They operate through corporate partnerships, industry coalitions, research initiatives, and best-practice dissemination to help businesses integrate sustainability into core strategy."
    },
    impacto_financiero: {
      es: "Europa Occidental, America del Norte, Asia Oriental ",
      en: "Western Europe, America del Norte, East Asia"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "San Francisco, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.vere.org/",
    email: "info@vere.org"
  },
  {
    id: 225,
    name: "Ballmer Group",
    description_es: "Ballmer Group está comprometido a mejorar la movilidad económica de los niños y las familias en los Estados Unidos. Financiamos líderes y organizaciones que han demostrado la capacidad de remodelar las oportunidades.",
    description_en: "Ballmer Group is committed to improving economic mobility for children and families in the United States. We fund leaders and organizations that have demonstrated the ability to reshape opportunity.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Económica, Juventud, Movilidad Social, Educación de Calidad",
      en: "Economic Justice, Youth, Movilidad Social, Quality Education"
    },
    como_trabajan: {
      es: "sus subvenciones se centran en servicios directos que fortalecen a las comunidades de hoy y palancas de cambio que transforman los sistemas del mañana.",
      en: "their grants focus on direct services that strengthen communities for today & levers of change that transform systems for tomorrow."
    },
    impacto_financiero: {
      es: "America del Norte ",
      en: "America del Norte"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Bellevue, Washington, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://ballmergroup.org/",
    email: "info@ballmergroup.org"
  },
  {
    id: 226,
    name: "Allied Climate Partners",
    description_es: "Allied Climate Partners (ACP) es una organización de inversión filantrópica con la misión de abordar los cuellos de botella del financiamiento climático en las economías emergentes para crear un impacto ambiental, económico y social significativo.",
    description_en: "Allied Climate Partners (ACP) is a philanthropic investment organization with a mission to address climate finance bottlenecks in emerging economies to create significant environmental, economic, and social impact.  ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Justicia Económica, Innovación Social",
      en: "Climate Justice, Economic Justice, Social Innovation"
    },
    como_trabajan: {
      es: "ayudar a establecer y anclar fondos proporcionando inversiones catalíticas de capital junior y apoyo de valor agregado. Cada fondo apunta a un cuello de botella clave que impide el flujo de capital hacia sectores relacionados con el clima y apunta a aumentar el número de proyectos financiables y negocios orientados a activos.",
      en: "help to establish and anchor funds by providing catalytic junior equity investments and value-added support. Each fund targets a key bottleneck impeding the flow of capital to climate-related sectors and aims to increase the number of bankable projects and asset-oriented businesses. "
    },
    impacto_financiero: {
      es: "Asia Oriental, America Central ",
      en: "East Asia, America Central"
    },
    country: "Emiratos Árabes Unidos",
    country_es: "Emiratos Árabes Unidos",
    ciudad: "Abu Dabi, Emiratos Árabes Unidos",
    continent: "desconocido",
    latitude: 0,
    longitude: 0,
    website: "https://www.alliedclimate.org/",
    email: "info@alliedclimatepartners.org"
  },
  {
    id: 227,
    name: "Children's Campaign Fund Action",
    description_es: "uno de los PAC no partidistas (CCF) más antiguos centrados en los niños uno de los PAC no partidistas (CCF) más antiguos centrados en los problemas de los niños",
    description_en: "one of the longest standing nonpartisan PACs  (CCF) focused on children's one of the longest standing nonpartisan PACs  (CCF) focused on children's issues  ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Derechos de las Infancias, Protección de la Niñez, Participación Ciudadana",
      en: "Children's Rights, Child Protection, Civic Participation"
    },
    como_trabajan: {
      es: "Desarrollan poder político para los niños y las familias aprovechando ambas organizaciones a través de estrategias clave.",
      en: "They buils political power for children and families by leveraging both organizations through key strategies "
    },
    impacto_financiero: {
      es: "America del Norte",
      en: "America del Norte"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Seattle, Washington, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.childrenscampaignfund.org/",
    email: "info@childrenscampaignfund.org"
  },
  {
    id: 228,
    name: "Climate Lead",
    description_es: "Climate Lead es una organización sin fines de lucro centrada en desarrollar líderes que puedan impulsar acciones climáticas ambiciosas en el gobierno, la filantropía y el sector privado.",
    description_en: "Climate Lead is a nonprofit organization focused on developing leaders who can drive ambitious climate action across government, philanthropy, and the private sector.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Fortalecimiento de Capacidades Organizacionales",
      en: "Climate Justice, Organizational Capacity Building"
    },
    como_trabajan: {
      es: "Dirigen programas de desarrollo de liderazgo, becas y redes profesionales que equipan a las personas con habilidades, conocimientos y conexiones para acelerar las soluciones climáticas.",
      en: "They run leadership development programs, fellowships, and professional networks that equip individuals with skills, knowledge, and connections to accelerate climate solutions."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "San Francisco, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://climatelead.org/",
    email: "info@climatelead.org"
  },
  {
    id: 229,
    name: "Community Justice Action Fund",
    description_es: "Community Justice Action Fund apoya a organizaciones de base que promueven la justicia racial, económica y ambiental, con un enfoque en el poder comunitario y el cambio de sistemas.",
    description_en: "Community Justice Action Fund supports grassroots organizations advancing racial, economic, and environmental justice, with a focus on community power and systems change.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Paz y Resolución de Conflictos, Justicia Racial, Movimientos Ciudadanos",
      en: "Peace and Conflict Resolution, Racial Justice, Citizen Movements"
    },
    como_trabajan: {
      es: "Proporcionan subvenciones flexibles, apoyo a la capacidad y financiación alineada con el movimiento a organizaciones dirigidas por las comunidades afectadas y responsables ante ellas.",
      en: "They provide flexible grantmaking, capacity support, and movement-aligned funding to organizations led by and accountable to affected communities."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Washington D.C., EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.cjactionfund.org/",
    email: "info@communityjusticeactionfund.org"
  },
  {
    id: 230,
    name: "Sequoia Climate Foundation",
    description_es: "Sequoia Climate Foundation es una organización filantrópica dedicada a promover estrategias de mitigación climática y acelerar la transición global lejos de los combustibles fósiles.",
    description_en: "Sequoia Climate Foundation is a philanthropic organization dedicated to advancing climate mitigation strategies and accelerating the global transition away from fossil fuels.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Transición Energética, Conservación de Recursos Naturales",
      en: "Climate Justice, Energy Transition, Natural Resources Conservation"
    },
    como_trabajan: {
      es: "Financian investigación, promoción de políticas, comunicaciones estratégicas y esfuerzos de creación de coaliciones para influir en la política climática y reducir las emisiones de gases de efecto invernadero.",
      en: "They fund research, policy advocacy, strategic communications, and coalition-building efforts to influence climate policy and reduce greenhouse gas emissions."
    },
    impacto_financiero: {
      es: "América del Norte, Asia Oriental",
      en: "North America, East Asia"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Irvine, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://sequoiaclimate.org/",
    email: "info@sequoiaclimate.org"
  },
  {
    id: 231,
    name: "Sea Change Foundation",
    description_es: "SeaChange Capital Partners es una organización de asesoría filantrópica que acelera los flujos de capital hacia el impacto social y ambiental al trabajar con donantes, inversores y organizaciones alineadas con su misión para catalizar soluciones escalables.",
    description_en: "SeaChange Capital Partners is a philanthropic advisory organization that accelerates capital flows toward social and environmental impact by working with donors, investors and mission-aligned organizations to catalyze scalable solutions.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Transición Energética, Gobernanza Global",
      en: "Climate Justice, Energy Transition, Gobernanza Global"
    },
    como_trabajan: {
      es: "Proporcionan asesoramiento estratégico, diseño de asociaciones, creación de ecosistemas y mecanismos financieros combinados para ayudar a los filántropos y a los inversores de impacto a desplegar capital de forma eficaz para el cambio de sistemas.",
      en: "They provide strategic advising, partnership design, ecosystem building, and blended finance mechanisms to help philanthropists and impact investors deploy capital effectively for systems change."
    },
    impacto_financiero: {
      es: "America del Norte, Asia Central, Africa Subsahariana ",
      en: "America del Norte, Central Asia, Africa Subsahariana"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "San Francisco, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.seachange.org/",
    email: "info@seachangefoundation.org"
  },
  {
    id: 232,
    name: "Rainier Climate Group",
    description_es: "Amplia soluciones probadas e invierte en estrategias emergentes en sectores y regiones con altas emisiones a nivel mundial, financiando organizaciones líderes dedicadas a la acción climática, soluciones basadas en la naturaleza (como la prevención de la deforestación) y la modernización de la red.",
    description_en: "Scales proven solutions and invests in emerging strategies across high-emissions sectors and regions globally, funding leading organizations dedicated to climate action, nature-based solutions (like deforestation prevention), and grid modernization.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Conservación de Recursos Naturales, Innovación Social",
      en: "Climate Justice, Natural Resources Conservation, Social Innovation"
    },
    como_trabajan: {
      es: "No acepta solicitudes de subvenciones no solicitadas. La concesión de subvenciones se realiza mediante invitación únicamente a organizaciones estratégicas, a menudo de gran escala, con un historial comprobado que se alinea con la estrategia de inversión altamente enfocada del Grupo.",
      en: "Does not accept unsolicited grant applications. Grantmaking is conducted by invitation only to strategic, often large-scale, organizations with a proven track record that align with the Group's highly focused investment strategy."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Seattle, Washington, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://rainierclimate.com/",
    email: "info@rainierclimategroup.org"
  },
  {
    id: 233,
    name: "Incite Organization",
    description_es: "¡INCITAR! es una organización nacional basada en miembros que se organiza en la intersección de raza, género y violencia estatal, apoyando a mujeres de color y activistas no conformes con el género por la liberación colectiva.",
    description_en: "INCITE! is a national membmember-based organization that organizes at the intersection of race, gender, and state violence, supporting women of color and gender non-conforming activists for collective liberat",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Innovación Social, Justicia Climática, Educación de Calidad",
      en: "Social Innovation, Climate Justice, Quality Education"
    },
    como_trabajan: {
      es: "Llevan a cabo organización de base, promoción de políticas, desarrollo de liderazgo y campañas nacionales arraigadas en marcos abolicionistas, feministas y antirracistas.",
      en: "They conduct grassroots organizing, policy advocacy, leadership development, and national campaigns rooted in abolitionist, feminist and anti-racist frameworks."
    },
    impacto_financiero: {
      es: "America del Norte ",
      en: "America del Norte"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "San Francisco, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://incite-national.org",
    email: "info@incite-national.org"
  },
  {
    id: 234,
    name: "The Climate Story Fund",
    description_es: "Apoya proyectos creativos de ficción y no ficción a nivel mundial que utilizan narrativas convincentes para acercar al mundo a un futuro climático justo y biodiverso, priorizando historias y campañas de impacto de comunidades subrepresentadas.",
    description_en: "Supports creative nonfiction and fiction projects globally that use compelling narratives to move the world closer to a climate-just and biodiverse future, prioritizing stories and impact campaigns from underrepresented communities.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Movimientos Ciudadanos, Innovación Social",
      en: "Climate Justice, Citizen Movements, Social Innovation"
    },
    como_trabajan: {
      es: "Opera a través de convocatorias abiertas de solicitudes para rondas de financiación específicas (a menudo anualmente) gestionadas por Doc Society. Los solicitantes deben cumplir con criterios relacionados con los objetivos medios y de impacto, y las subvenciones suelen ser para producción o pilotaje de campañas.",
      en: "Operates through open calls for applications for specific funding rounds (often annually) managed by Doc Society. Applicants must meet criteria regarding the medium and impact goals, and grants are typically for production or campaign piloting."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Londres, Reino Unido / Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.greenclimate.fund/",
    email: "info@climatestoryfund.org"
  },
  {
    id: 235,
    name: "Civil Society Fund",
    description_es: "El Fondo de la Sociedad Civil en el marco de las subvenciones del EEE y Noruega apoya a las organizaciones de la sociedad civil que trabajan en la democracia, los derechos humanos, la inclusión social y la sostenibilidad ambiental.",
    description_en: "The Civil Society Fund under the EEA and Norway Grants supports civil society organizations working on democracy, human rights, social inclusion, and environmental sustainability.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Democracia, Participación Ciudadana, Movimientos Ciudadanos",
      en: "Democracy, Civic Participation, Citizen Movements"
    },
    como_trabajan: {
      es: "Distribuyen subvenciones a través de operadores nacionales, brindan apoyo para el desarrollo de capacidades y fortalecen la participación de la sociedad civil en los procesos políticos.",
      en: "They distribute grant funding through national operators, provide capacity-building support, and strengthen civil society participation in policy processes."
    },
    impacto_financiero: {
      es: "Europa del Este, Europa Occidental ",
      en: "Eastern Europe, Western Europe"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Washington D.C., EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://eeagrants.org/en/fmo/areas-work/civil-society-fund",
    email: "info@civilsocietyfund.org"
  },
  {
    id: 236,
    name: "Disability Rights Fund",
    description_es: "El Fondo para los Derechos de las Personas con Discapacidad se asocia con Organizaciones de Personas con Discapacidad (OPD) para financiar directamente iniciativas de promoción, empoderamiento e inclusión de los derechos de las personas con discapacidad lideradas por personas con discapacidad.",
    description_en: "The Disability Rights Fund partners with Disabled People’s Organizations (DPOs) to directly fund disability rights advocacy, empowerment, and inclusion initiatives led by people with disabilities.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Derechos de las Personas con Discapacidad, Justicia de Género, Movimientos Ciudadanos",
      en: "Rights of Persons with Disabilities, Gender Justice, Citizen Movements"
    },
    como_trabajan: {
      es: "Proporcionan subvenciones, desarrollo de liderazgo, fortalecimiento de capacidades y apoyo de promoción a las OPD para influir en las políticas, eliminar barreras y promover la inclusión a nivel mundial.",
      en: "They provide grantmaking, leadership development, capacity strengthening, and advocacy support to DPOs to influence policies, remove barriers, and promote inclusion globally."
    },
    impacto_financiero: {
      es: "Africa Subsahariana, America del Sur, Asia Central, Asia Oriental ",
      en: "Africa Subsahariana, America del Sur, Central Asia, East Asia"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Boston, Massachusetts, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://disabilityrightsfund.org/",
    email: "info@disabilityrightsfund.org"
  },
  {
    id: 237,
    name: "CIVICUS Solidarity Fund",
    description_es: "El Fondo de Solidaridad CIVICUS apoya a activistas y organizaciones de la sociedad civil que enfrentan amenazas y restricciones, permitiéndoles continuar su trabajo de derechos humanos y participación cívica en condiciones cada vez más hostiles.",
    description_en: "CIVICUS Solidarity Fund supports civil society activists and organizations facing threats and restrictions, enabling them to continue their human rights and civic engagement work under increasingly hostile conditions.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Participación Ciudadana, Movimientos Ciudadanos, Fortalecimiento de Capacidades Organizacionales",
      en: "Civic Participation, Citizen Movements, Organizational Capacity Building"
    },
    como_trabajan: {
      es: "Ofrecen subvenciones de respuesta rápida, apoyo de emergencia, creación de redes y desarrollo de capacidades para permitir la resiliencia, la protección y la acción estratégica de la sociedad civil.",
      en: "They offer rapid response grants, emergency support, networking, and capacity-building to enable civil society resilience, protection, and strategic action."
    },
    impacto_financiero: {
      es: "Africa Subsahariana, America del Sur, Asia Central, Asia Oriental ",
      en: "Africa Subsahariana, America del Sur, Central Asia, East Asia"
    },
    country: "South Africa",
    country_es: "Sudáfrica",
    ciudad: "Johannesburgo, Sudáfrica",
    continent: "africa",
    latitude: -25.7479,
    longitude: 28.2293,
    website: "https://www.civicus.org/solidarity-fund",
    email: "solidarityfund@civicus.org\n"
  },
  {
    id: 238,
    name: "Het Actiefonds",
    description_es: "Het Actiefonds es un fondo filantrópico holandés que apoya movimientos de base, participación cívica e iniciativas de justicia social que fortalecen las democracias inclusivas y el poder comunitario.",
    description_en: "Het Actiefonds is a Dutch philanthropic fund supporting grassroots movements, civic engagement, and social justice initiatives that strengthen inclusive democracies and community power.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Movimientos Ciudadanos, Paz y Resolución de Conflictos, Justicia de Género",
      en: "Citizen Movements, Peace and Conflict Resolution, Gender Justice"
    },
    como_trabajan: {
      es: "Proporcionan financiación central flexible y a largo plazo, acompañamiento y apoyo de red a grupos y campañas de base.",
      en: "They provide flexible, long-term core funding, accompaniment, and network support to grassroots groups and campaigns."
    },
    impacto_financiero: {
      es: "Europa Occidental, Africa Subsahariana ",
      en: "Western Europe, Africa Subsahariana"
    },
    country: "Netherlands",
    country_es: "Países Bajos",
    ciudad: "Ámsterdam, Países Bajos",
    continent: "europa",
    latitude: 52.3676,
    longitude: 4.9041,
    website: "https://hetactiefonds.nl/",
    email: "info@hetactiefonds.nl"
  },
  {
    id: 239,
    name: "The International Land and Forest Tenure Facility",
    description_es: "El Tenure Facility es un fondo global que apoya la garantía de la tenencia de los bosques y los derechos de los pueblos indígenas y las comunidades locales como estrategia para la mitigación y conservación del clima.",
    description_en: "The Tenure Facility is a global fund that supports securing forest tenure and rights for Indigenous Peoples and Local Communities as a strategy for climate mitigation and conservation.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Comunidades Indígenas, Conservación de Recursos Naturales, Justicia Climática",
      en: "Indigenous Communities, Natural Resources Conservation, Climate Justice"
    },
    como_trabajan: {
      es: "Proporcionan financiación, apoyo técnico y asociación a gran escala y a largo plazo para iniciativas de gobernanza forestal y derechos sobre la tierra lideradas por las comunidades.",
      en: "They provide large-scale, long-term funding, technical support, and partnership to community-led land rights and forest governance initiatives."
    },
    impacto_financiero: {
      es: "Africa Subsahariana, America Central, America del Sur ",
      en: "Africa Subsahariana, America Central, America del Sur"
    },
    country: "Sweden",
    country_es: "Suecia",
    ciudad: "Estocolmo, Suecia",
    continent: "europa",
    latitude: 59.3293,
    longitude: 18.0686,
    website: "https://thetenurefacility.org/",
    email: "info@thetenurefacility.org"
  },
  {
    id: 240,
    name: "King Baudouin Foundation United States (KBFUS)",
    description_es: "KBFUS es una organización benéfica pública de EE. UU. que facilita la filantropía internacional al permitir que los donantes apoyen causas en todo el mundo con beneficios fiscales y servicios filantrópicos con sede en EE. UU.",
    description_en: "KBFUS is a U.S. public charity that facilitates international philanthropy by enabling donors to support causes worldwide with U.S.-based tax benefits and philanthropic services.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Salud Global, Educación de Calidad, Justicia Económica, Fortalecimiento de Capacidades Organizacionales",
      en: "Global Health, Quality Education, Economic Justice, Organizational Capacity Building"
    },
    como_trabajan: {
      es: "Proporcionan asesoramiento a donantes, patrocinio fiscal, facilitación de subvenciones y soluciones de donaciones transfronterizas que conectan a filántropos con organizaciones sin fines de lucro globales.",
      en: "They provide donor advising, fiscal sponsorship, grant facilitation, and cross-border giving solutions connecting philanthropists with global nonprofits."
    },
    impacto_financiero: {
      es: "Europa Occidental, America del Norte, Africa Subsahariana ",
      en: "Western Europe, America del Norte, Africa Subsahariana"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.kbfus.org/",
    email: "info@kbfus.org"
  },
  {
    id: 241,
    name: "Open Technology Fund",
    description_es: "El Fondo de Tecnología Abierta apoya tecnologías de código abierto que promueven la libertad, la privacidad y las comunicaciones seguras en Internet para las personas que viven bajo censura y vigilancia.",
    description_en: "The Open Technology Fund supports open source technologies that advance internet freedom, privacy, and secure communications for people living under censorship and surveillance.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Derechos Digitales, Democracia, Gobernanza Global, políticas y rendición de cuentas",
      en: "Digital Rights, Democracy, Gobernanza Global, políticas y rendición de cuentas"
    },
    como_trabajan: {
      es: "Proporcionan financiación competitiva, apoyo técnico a proyectos y creación de ecosistemas para herramientas de código abierto e investigaciones que promueven los derechos digitales.",
      en: "They provide competitive funding, technical project support, and ecosystem building for open-source tools and research advancing digital rights."
    },
    impacto_financiero: {
      es: "America del Norte, Europa Occidental, Asia Central, Asia Oriental ",
      en: "America del Norte, Western Europe, Central Asia, East Asia"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Washington D.C., EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://opentech.fund/",
    email: "info@opentech.fund"
  },
  {
    id: 242,
    name: "Red Umbrella Fund ",
    description_es: "El Red Umbrella Fund es una fundación global que otorga subvenciones y apoya a organizaciones y movimientos liderados por personas que ejercen el trabajo sexual para promover los derechos humanos, la seguridad y la justicia.",
    description_en: "The Red Umbrella Fund is a global grant-making foundation supporting sex worker-led organizations and movements to promote human rights, safety, and justice.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia de Género, Derechos Laborales, Movimientos Ciudadanos",
      en: "Gender Justice, Labor Rights, Citizen Movements"
    },
    como_trabajan: {
      es: "Proporcionan financiación básica, subvenciones de solidaridad, apoyo a la capacidad y coordinación de movimientos a grupos y defensores liderados por personas que ejercen el trabajo sexual.",
      en: "They provide core funding, solidarity grants, capacity support, and movement coordination to sex worker-led groups and advocates."
    },
    impacto_financiero: {
      es: "Africa Subsahariana, America del Sur, Asia Central",
      en: "Africa Subsahariana, America del Sur, Central Asia"
    },
    country: "Netherlands",
    country_es: "Países Bajos",
    ciudad: "Ámsterdam, Países Bajos",
    continent: "europa",
    latitude: 52.3676,
    longitude: 4.9041,
    website: "https://www.redumbrellafund.org/",
    email: "info@redumbrellafund.org"
  },
  {
    id: 243,
    name: "TechSoup",
    description_es: "TechSoup es un proveedor de soluciones tecnológicas sin fines de lucro que brinda a las organizaciones de la sociedad civil de todo el mundo acceso a software, hardware, capacitación y recursos de transformación digital.",
    description_en: "TechSoup is a nonprofit technology solutions provider empowering civil society organizations worldwide with access to software, hardware, training, and digital transformation resources.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Derechos Digitales, Innovación Social, Fortalecimiento de Capacidades Organizacionales",
      en: "Digital Rights, Social Innovation, Organizational Capacity Building"
    },
    como_trabajan: {
      es: "Operan redes de distribución de tecnología, programas de capacitación, asociaciones para el desarrollo de capacidades y centros de recursos digitales para ayudar a las organizaciones sin fines de lucro a operar de manera efectiva.",
      en: "They operate technology distribution networks, training programs, capacity-building partnerships, and digital resource hubs to help nonprofits operate effectively."
    },
    impacto_financiero: {
      es: "America del Norte, Europa Occidental, Asia Oriental ",
      en: "America del Norte, Western Europe, East Asia"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "San Francisco, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.techsoup.org/",
    email: "info@techsoup.org"
  },
  {
    id: 244,
    name: "The Pollination Project ",
    description_es: "El Proyecto de Polinización proporciona subvenciones para semillas y apoyo en etapas iniciales a proyectos individuales y comunitarios centrados en un impacto social y ambiental positivo.",
    description_en: "The Pollination Project provides seed grants and early-stage support to individuals and community projects focused on positive social and environmental impact.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Innovación Social, Soberanía Alimentaria, Fortalecimiento de Capacidades Organizacionales",
      en: "Social Innovation, Food Sovereignty, Organizational Capacity Building"
    },
    como_trabajan: {
      es: "Ofrecen pequeñas subvenciones iniciales sin restricciones, participación comunitaria y plataformas en línea para catalizar iniciativas de base y la innovación social.",
      en: "They offer small, unrestricted seed grants, community engagement, and online platforms to catalyze grassroots initiatives and social innovation."
    },
    impacto_financiero: {
      es: "America del Norte, Europa Occidental, Africa Subsahariana ",
      en: "America del Norte, Western Europe, Africa Subsahariana"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Berkeley, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.thepollinationproject.org/",
    email: "info@thepollinationproject.org"
  },
  {
    id: 245,
    name: "With and for Girls",
    description_es: "With and For Girls Collective es una colaboración global que proporciona recursos y apoya a organizaciones que trabajan con niñas y mujeres jóvenes para promover la justicia y el liderazgo de género.",
    description_en: "With and For Girls Collective is a global collaborative that resources and supports organizations working with girls and young women to advance gender justice and leadership.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Juventud, Justicia de Género, Movimientos Ciudadanos",
      en: "Youth, Gender Justice, Citizen Movements"
    },
    como_trabajan: {
      es: "Coordinan financiación mancomunada, intercambios de aprendizaje, esfuerzos de promoción y concesión de subvenciones para fortalecer las organizaciones dirigidas y centradas en las niñas.",
      en: "They coordinate pooled funding, learning exchanges, advocacy efforts, and grantmaking to strengthen girl-led and girl-centered organizations."
    },
    impacto_financiero: {
      es: "África Subsahariana, América Central, América del Sur, Asia Oriental",
      en: "Sub-Saharan Africa, Central America, South America, East Asia"
    },
    country: "United Kingdom",
    country_es: "Reino Unido",
    ciudad: "Londres, Reino Unido",
    continent: "europa",
    latitude: 51.5074,
    longitude: -0.1278,
    website: "https://wearepurposeful.org/es/projects/with-and-for-girls-collective/",
    email: "info@withandforgirls.org"
  },
  {
    id: 246,
    name: "WomenStrong International",
    description_es: "WomenStrong International es una coalición que promueve la igualdad de género y los derechos de las mujeres apoyando a organizaciones de mujeres lideradas localmente con recursos, capacitación y redes de pares.",
    description_en: "WomenStrong International is a coalition that advances gender equality and women’s rights by supporting locally-led women’s organizations with resources, training, and peer networks.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia de Género, Salud Global, Justicia Económica, Juventud",
      en: "Gender Justice, Global Health, Economic Justice, Youth"
    },
    como_trabajan: {
      es: "Proporcionan desarrollo de capacidades, aprendizaje entre pares, recursos de subvenciones y facilitación de asociaciones para fortalecer el liderazgo de las mujeres y el impacto comunitario.",
      en: "They provide capacity building, peer learning, grant resources, and partnership facilitation to strengthen women’s leadership and community impact."
    },
    impacto_financiero: {
      es: "America del Sur, America Central, Africa Subsahariana",
      en: "America del Sur, America Central, Africa Subsahariana"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Washington D.C., EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://womenstrong.org/",
    email: "info@womenstrong.org"
  },
  {
    id: 247,
    name: "Women Win Foundation",
    description_es: "WomenWin financia y apoya el liderazgo de niñas y mujeres jóvenes en todo el mundo, centrándose en la libertad de expresión, la equidad de género y el empoderamiento comunitario.",
    description_en: "WomenWin funds and supports girls’ and young women’s leadership around the world, focusing on freedom of expression, gender equity, and community empowerment.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia de Género, Juventud, Derechos Laborales",
      en: "Gender Justice, Youth, Labor Rights"
    },
    como_trabajan: {
      es: "Proporcionan subvenciones, desarrollo de liderazgo, apoyo de promoción y campañas creativas para ampliar las oportunidades para las jóvenes líderes.",
      en: "They provide grants, leadership development, advocacy support, and creative campaigns to expand opportunities for young women leaders."
    },
    impacto_financiero: {
      es: "America del Sur, America Central, Africa Subsahariana",
      en: "America del Sur, America Central, Africa Subsahariana"
    },
    country: "Netherlands",
    country_es: "Países Bajos",
    ciudad: "Ámsterdam, Países Bajos",
    continent: "europa",
    latitude: 52.3676,
    longitude: 4.9041,
    website: "https://www.womenwin.org/",
    email: "info@womenwin.org"
  },
  {
    id: 248,
    name: "V. Kann Rasmussen Foundation",
    description_es: "La Fundación VKR apoya soluciones de desarrollo sostenible, resiliencia comunitaria e innovación para lograr un impacto social y ambiental positivo.",
    description_en: "The VKR Foundation supports sustainable development solutions, community resilience, and innovation for positive social and environmental impact.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Conservación de Recursos Naturales, Economía Circular",
      en: "Climate Justice, Natural Resources Conservation, Circular Economy"
    },
    como_trabajan: {
      es: "Financian investigación, proyectos de innovación, colaboraciones sistémicas e iniciativas de sostenibilidad para abordar desafíos sociales a largo plazo.",
      en: "They fund research, innovation projects, systemic collaborations, and sustainability initiatives to address long-term societal challenges."
    },
    impacto_financiero: {
      es: "Europa Occidental, Africa Subshariana ",
      en: "Western Europe, Africa Subshariana"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.vkrf.org/",
    email: "info@vkrf.org"
  },
  {
    id: 249,
    name: "Alice and Fred Stanback",
    description_es: "La Fundación Fred y Alice Stanback apoya la conservación ambiental, la educación y las iniciativas comunitarias, con un fuerte énfasis en los ecosistemas costeros, la gestión ambiental y la conciencia pública.",
    description_en: "The Fred and Alice Stanback Foundation supports environmental conservation, education, and community-based initiatives, with a strong emphasis on coastal ecosystems, environmental stewardship, and public awareness.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales, Justicia Climática",
      en: "Natural Resources Conservation, Climate Justice"
    },
    como_trabajan: {
      es: "Proporcionan subvenciones, apoyan programas educativos y se asocian con organizaciones ambientales para promover la conservación, la investigación y la participación comunitaria en torno a la protección de los recursos naturales y costeros.",
      en: "They provide grant funding, support educational programs, and partner with environmental organizations to promote conservation, research, and community engagement around coastal and natural resource protection."
    },
    impacto_financiero: {
      es: "Europa Occidental, America del Norte, Africa Subsahariana ",
      en: "Western Europe, America del Norte, Africa Subsahariana"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Salisbury, Carolina del Norte, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.nccoast.org/2015/01/fred-alice-stanback-coastal-education-center/",
    email: "info@stanbackfoundation.org"
  },
  {
    id: 250,
    name: "The Tilia Fund",
    description_es: "Tilia Fund apoya iniciativas que fortalecen la democracia, la participación cívica y la rendición de cuentas, haciendo hincapié en los medios independientes, el espacio cívico y el compromiso político.",
    description_en: "Tilia Fund supports initiatives that strengthen democracy, civic participation, and accountability, emphasizing independent media, civic space, and political engagement.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia de Género, Conservación de Recursos Naturales, Justicia Climática",
      en: "Gender Justice, Natural Resources Conservation, Climate Justice"
    },
    como_trabajan: {
      es: "Proporcionan financiación estratégica, apoyo sectorial y creación de redes para organizaciones que promueven la gobernanza democrática y las libertades cívicas.",
      en: "They provide strategic funding, sector support, and networking for organizations advancing democratic governance and civic freedoms."
    },
    impacto_financiero: {
      es: "Europa Occidental, Africa Subshariana, America del Norte ",
      en: "Western Europe, Africa Subshariana, America del Norte"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "San Francisco, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.tiliafund.org/",
    email: "info@tiliafund.org"
  },
  {
    id: 251,
    name: "JMG Foundation",
    description_es: "La Fundación JMG Goldman apoya organizaciones e iniciativas comunitarias centradas en la juventud, las artes, la equidad y la resiliencia comunitaria.",
    description_en: "The JMG Goldman Foundation supports community organizations and initiatives focused on youth, arts, equity, and community resilience.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales, Justicia Climática, Movimientos Ciudadanos",
      en: "Natural Resources Conservation, Climate Justice, Citizen Movements"
    },
    como_trabajan: {
      es: "Ofrecen subvenciones, programación colaborativa y apoyo a la capacidad para el trabajo de cambio social impulsado por la comunidad.",
      en: "They offer grantmaking, collaborative programming, and capacity support for community-driven social change work."
    },
    impacto_financiero: {
      es: "America del Norte ",
      en: "America del Norte"
    },
    country: "United Kingdom",
    country_es: "Reino Unido",
    ciudad: "Londres, Reino Unido",
    continent: "europa",
    latitude: 51.5074,
    longitude: -0.1278,
    website: "https://jmgoldmanfoundation.org/",
    email: "info@jmgoldmanfoundation.org"
  },
  {
    id: 252,
    name: "Mertz Gilmore Foundation",
    description_es: "La Fundación Mertz Gilmore apoya los movimientos progresistas que trabajan en la justicia racial, la acción climática, los derechos humanos y la gobernanza democrática.",
    description_en: "Mertz Gilmore Foundation supports progressive movements working on racial justice, climate action, human rights, and democratic governance.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia de Género, Justicia Climática, Derechos Humanos, Democracia",
      en: "Gender Justice, Climate Justice, Derechos Humanos, Democracy"
    },
    como_trabajan: {
      es: "Proporcionan subvenciones flexibles a largo plazo y apoyan iniciativas de promoción, organización y cambio de políticas alineadas con objetivos de justicia social.",
      en: "They provide long-term, flexible grants and support advocacy, organizing, and policy change initiatives aligned with social justice goals."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.mertzgilmore.org/",
    email: "info@mertzgilmore.org"
  },
  {
    id: 253,
    name: "The Scherman Foundation",
    description_es: "La Fundación Scherman es una fundación filantrópica privada que apoya la justicia social, las artes y la cultura, el compromiso cívico y las iniciativas de derechos humanos proporcionando financiación flexible a largo plazo a organizaciones de base y de defensa.",
    description_en: "The Scherman Foundation is a private philanthropic foundation that supports social justice, arts and culture, civic engagement, and human rights initiatives by providing flexible, long-term funding to grassroots and advocacy organizations.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia de Género, Justicia Climática, Derechos Humanos, Movimientos Ciudadanos",
      en: "Gender Justice, Climate Justice, Derechos Humanos, Citizen Movements"
    },
    como_trabajan: {
      es: "Proporcionan subvenciones básicas y para proyectos, apoyo para el desarrollo de capacidades y asociaciones estratégicas para organizaciones sin fines de lucro que trabajan en equidad y empoderamiento comunitario.",
      en: "They provide core and project grants, capacity building support, and strategic partnerships to nonprofit organizations working on equity and community empowerment."
    },
    impacto_financiero: {
      es: "America del Norte, Africa Subsahariana",
      en: "America del Norte, Africa Subsahariana"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.thescherman.org/",
    email: "info@thescherman.org"
  },
  {
    id: 254,
    name: "Global Youth Climate Fund",
    description_es: "El Fondo Mundial para el Clima Juvenil es una plataforma de apoyo y concesión de subvenciones que potencia las iniciativas climáticas lideradas por jóvenes proporcionando pequeñas subvenciones, tutorías y recursos comunitarios a jóvenes líderes climáticos.",
    description_en: "Global Youth Climate Fund is a grantmaking and support platform that empowers youth-led climate initiatives by providing small grants, mentorship, and community resources to young climate leaders.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Juventud, Justicia Climática, Movimientos Ciudadanos",
      en: "Youth, Climate Justice, Citizen Movements"
    },
    como_trabajan: {
      es: "Operan a través de subvenciones iniciales, redes de pares, capacitación en liderazgo y participación juvenil global para ampliar las soluciones climáticas impulsadas por los jóvenes.",
      en: "They operate through seed grant awards, peer networks, leadership training, and global youth engagement to scale youth-driven climate solutions."
    },
    impacto_financiero: {
      es: "Africa Subsahariana, America Central, America del Sur, Asia Central, Asia Oriental ",
      en: "Africa Subsahariana, America Central, America del Sur, Central Asia, East Asia"
    },
    country: "Belgium",
    country_es: "Bélgica",
    ciudad: "Bruselas, Bélgica",
    continent: "europa",
    latitude: 50.8503,
    longitude: 4.3517,
    website: "https://globalyouthclimatefund.org/",
    email: "info@globalyouthclimatefund.org"
  },
  {
    id: 255,
    name: "Fidelity Charitable Gift Fund",
    description_es: "Fidelity Charitable es el programa de fondos asesorados por donantes (DAF) más grande de los Estados Unidos, que permite a los donantes recomendar subvenciones a organizaciones sin fines de lucro elegibles mientras reciben contribuciones con ventajas impositivas.",
    description_en: "Fidelity Charitable is the largest donor-advised fund (DAF) program in the United States, enabling donors to recommend grants to eligible nonprofits while receiving tax-advantaged contributions.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Innovación Social, Fortalecimiento de Capacidades Organizacionales, Educación de Calidad",
      en: "Social Innovation, Organizational Capacity Building, Quality Education"
    },
    como_trabajan: {
      es: "Administran fondos asesorados por donantes, facilitan recomendaciones de subvenciones, brindan educación filantrópica y apoyan la capacidad de las organizaciones sin fines de lucro a través de patrocinio fiscal y programas de donaciones.",
      en: "They administer donor-advised funds, facilitate grant recommendations, provide philanthropic education, and support nonprofit capacity through fiscal sponsorship and giving programs."
    },
    impacto_financiero: {
      es: "America del Norte, Africa Subsahariana, Europa Occidental ",
      en: "America del Norte, Africa Subsahariana, Western Europe"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Cincinnati, Ohio, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.fidelitycharitable.org/",
    email: "donors@fidelitycharitable.org"
  },
  {
    id: 256,
    name: "The Overbrook Foundation",
    description_es: "La Fundación Overbrook apoya el cambio social progresivo invirtiendo en equidad educativa, desarrollo comunitario y reforma de políticas públicas a través de compromisos plurianuales con socios sin fines de lucro.",
    description_en: "The Overbrook Foundation supports progressive social change by investing in education equity, community development, and public policy reform through multi-year commitments with nonprofit partners.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia de Género, Conservación de Recursos Naturales, Derechos Humanos",
      en: "Gender Justice, Natural Resources Conservation, Derechos Humanos"
    },
    como_trabajan: {
      es: "Participan en subvenciones estratégicas, convocatorias, síntesis de investigaciones y colaboración intersectorial para ayudar a las organizaciones a lograr escala e impacto político.",
      en: "They engage in strategic grantmaking, convenings, research synthesis, and cross-sector collaboration to help organizations achieve scale and policy impact."
    },
    impacto_financiero: {
      es: "America del Norte, Africa Subsahariana ",
      en: "America del Norte, Africa Subsahariana"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://overbrook.org/",
    email: "info@overbrook.org"
  },
  {
    id: 257,
    name: "Arkay Foundation",
    description_es: "Arkay Foundation es una fundación filantrópica privada enfocada en mejorar el bienestar de la comunidad, ampliar el acceso a oportunidades y apoyar programas que fortalezcan la infraestructura social.",
    description_en: "Arkay Foundation is a private philanthropic foundation focused on enhancing community well-being, expanding access to opportunities, and supporting programs that strengthen social infrastructure.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Salud Global, Soberanía Alimentaria",
      en: "Climate Justice, Global Health, Food Sovereignty"
    },
    como_trabajan: {
      es: "Proporcionan apoyo operativo general y para proyectos, financiación de asociaciones e incubación de iniciativas para organizaciones sin fines de lucro alineadas con objetivos de empoderamiento comunitario.",
      en: "They provide project and general operating support, partnership funding, and initiative incubation for nonprofit organizations aligned with community empowerment goals."
    },
    impacto_financiero: {
      es: "America del Norte ",
      en: "America del Norte"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Los Altos, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "http://arkayfoundation.org/",
    email: "info@arkayfoundation.org"
  },
  {
    id: 258,
    name: "Chorus Foundation",
    description_es: "Chorus Foundation es una fundación filantrópica que invierte en organizaciones y movimientos que promueven la justicia racial, económica y ambiental, con énfasis en el cambio sistémico a largo plazo y el liderazgo comunitario.",
    description_en: "Chorus Foundation is a philanthropic foundation investing in organizations and movements that advance racial, economic, and environmental justice, with emphasis on long-term systemic change and community leadership.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Transición Energética, Justicia Climática, Justicia Económica, Movimientos Ciudadanos",
      en: "Energy Transition, Climate Justice, Economic Justice, Citizen Movements"
    },
    como_trabajan: {
      es: "Proporcionan subvenciones básicas y catalizadoras, apoyo a movimientos y colaboraciones estratégicas a grupos de base y de defensa que abordan la equidad y la justicia.",
      en: "They provide core and catalytic grants, movement support, and strategic collaborations to grassroots and advocacy groups addressing equity and justice."
    },
    impacto_financiero: {
      es: "America del Norte, America Central, Africa Subsahariana ",
      en: "America del Norte, America Central, Africa Subsahariana"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Boston, Massachusetts, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.chorusfoundation.org/",
    email: "info@chorusfoundation.org"
  },
  {
    id: 259,
    name: "Small Planet Fund",
    description_es: "Small Planet Fund apoya iniciativas de base y impulsadas por movimientos en torno a la justicia climática, la soberanía comunitaria y la resiliencia ecológica, priorizando el liderazgo y la equidad locales.",
    description_en: "Small Planet Fund supports grassroots and movement-driven initiatives around climate justice, community sovereignty, and ecological resilience, prioritizing local leadership and equity.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Soberanía Alimentaria, Justicia Climática, Democracia, Movimientos Ciudadanos",
      en: "Food Sovereignty, Climate Justice, Democracy, Citizen Movements"
    },
    como_trabajan: {
      es: "Proporciona respuesta rápida, financiación inicial flexible, creación de redes y subvenciones solidarias a coaliciones comunitarias y grupos de primera línea por la justicia climática.",
      en: "Provides rapid-response, flexible seed funding, network building, and solidarity grants to community coalitions and frontline climate justice groups."
    },
    impacto_financiero: {
      es: "Africa Subsahariana, America del Sur, Asia Oriental",
      en: "Africa Subsahariana, America del Sur, East Asia"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Cambridge, Massachusetts, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://smallplanetfund.org/",
    email: "info@smallplanetfund.org"
  },
  {
    id: 260,
    name: "Rose Foundation for Communities and the Environment ",
    description_es: "La Fundación Rose apoya la justicia ambiental, la salud pública y los esfuerzos de defensa de la comunidad, particularmente en comunidades desproporcionadamente afectadas por la contaminación.",
    description_en: "The Rose Foundation supports environmental justice, public health, and community-based advocacy efforts, particularly in communities disproportionately affected by pollution.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales, Justicia Climática, Salud Global, Participación Ciudadana",
      en: "Natural Resources Conservation, Climate Justice, Global Health, Civic Participation"
    },
    como_trabajan: {
      es: "Administran fondos asesorados por donantes, otorgan subvenciones a grupos de base y apoyan litigios, promoción y organización comunitaria.",
      en: "They manage donor-advised funds, provide grants to grassroots groups, and support litigation, advocacy, and community organizing."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Oakland, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://rosefdn.org/",
    email: "info@rosefdn.org"
  },
  {
    id: 261,
    name: "The Max and Anna Levinson Foundation",
    description_es: "Levinson Foundation es una fundación filantrópica privada que se enfoca en la educación, el desarrollo comunitario y la mejora de la calidad de vida a través del apoyo estratégico de iniciativas innovadoras sin fines de lucro.",
    description_en: "Levinson Foundation is a private philanthropic foundation that focuses on education, community development, and quality of life improvement through strategic support of innovative nonprofit initiatives.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia de Género, Paz y Resolución de Conflictos, Justicia Climática, Democracia",
      en: "Gender Justice, Peace and Conflict Resolution, Climate Justice, Democracy"
    },
    como_trabajan: {
      es: "Proporcionan subvenciones, apoyo a la capacidad y asociaciones estratégicas a organizaciones sin fines de lucro que abordan el acceso a la educación y el bienestar de la comunidad.",
      en: "They provide grant funding, capacity support, and strategic partnerships to nonprofits addressing education access and community well-being."
    },
    impacto_financiero: {
      es: "America del Norte ",
      en: "America del Norte"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Santa Fe, Nuevo México, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.levinsonfoundation.org",
    email: "info@levinsonfoundation.org"
  },
  {
    id: 262,
    name: "Aage V. Jensen Foundation",
    description_es: "La Aage V. Jensen Charity Foundation se centra en la conservación de la naturaleza, la protección de la biodiversidad y la investigación científica para preservar los ecosistemas y la vida silvestre.",
    description_en: "The Aage V. Jensen Charity Foundation focuses on nature conservation, biodiversity protection, and scientific research to preserve ecosystems and wildlife.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales, Justicia Climática, Educación de Calidad",
      en: "Natural Resources Conservation, Climate Justice, Quality Education"
    },
    como_trabajan: {
      es: "Financian proyectos de conservación, iniciativas de investigación y programas de administración de tierras a largo plazo en colaboración con expertos y organizaciones conservacionistas.",
      en: "They fund conservation projects, research initiatives, and long-term land stewardship programs in collaboration with experts and conservation organizations."
    },
    impacto_financiero: {
      es: "América Central, América del Sur (Zonas Costeras), África Subsahariana (África Occidental y Oriental), Asia Oriental (Sudeste Asiático), Europa Occidental (Dinamarca, Ártico)",
      en: "Central America, América del Sur (Zonas Costeras), África Subsahariana (África Occidental y Oriental), Asia Oriental (Sudeste Asiático), Europa Occidental (Dinamarca, Ártico)"
    },
    country: "Denmark",
    country_es: "Dinamarca",
    ciudad: "Copenhague, Dinamarca",
    continent: "europa",
    latitude: 55.6761,
    longitude: 12.5683,
    website: "https://avjcf.org/",
    email: "info@ajfoundation.dk"
  },
  {
    id: 263,
    name: "Agence Française de Développement",
    description_es: "La Agencia Francesa de Desarrollo (AFD) es la institución pública de financiación del desarrollo de Francia que apoya proyectos de desarrollo sostenible en todo el mundo mediante la financiación de iniciativas de infraestructura, adaptación al clima y reducción de la pobreza.",
    description_en: "The French Development Agency (AFD) is France’s public development finance institution that supports sustainable development projects worldwide by financing infrastructure, climate adaptation, and poverty reduction initiatives.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Gobernanza Global, políticas y rendición de cuentas, Ciudades Sustentables, Transición Energética, Paz y Resolución de Conflictos",
      en: "Gobernanza Global, políticas y rendición de cuentas, Sustainable Cities, Energy Transition, Peace and Conflict Resolution"
    },
    como_trabajan: {
      es: "Operan a través de préstamos concesionarios, donaciones, cooperación técnica, apoyo a políticas y asociaciones con gobiernos, entidades multilaterales y la sociedad civil para promover el desarrollo equitativo y sostenible.",
      en: "They operate through concessional loans, grants, technical cooperation, policy support, and partnerships with governments, multilateral entities, and civil society to advance equitable and sustainable development."
    },
    impacto_financiero: {
      es: "Africa Subsahariana, America del Sur, America Central, Asia Central, Asia Oriental ",
      en: "Africa Subsahariana, America del Sur, America Central, Central Asia, East Asia"
    },
    country: "France",
    country_es: "Francia",
    ciudad: "París, Francia",
    continent: "europa",
    latitude: 48.8566,
    longitude: 2.3522,
    website: "https://www.afd.fr",
    email: "info@afd.fr"
  },
  {
    id: 264,
    name: "Arcadia Fund",
    description_es: "Arcadia Fund es una fundación filantrópica que apoya la conservación del medio ambiente, la preservación del patrimonio cultural y el acceso abierto al conocimiento.",
    description_en: "Arcadia Fund is a philanthropic foundation supporting environmental conservation, cultural heritage preservation, and open access to knowledge.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales, Derechos Digitales, Educación de Calidad",
      en: "Natural Resources Conservation, Digital Rights, Quality Education"
    },
    como_trabajan: {
      es: "Proporcionan subvenciones a gran escala, apoyan asociaciones globales e invierten en iniciativas a largo plazo que protegen los ecosistemas y promueven la información abierta.",
      en: "They provide large-scale grants, support global partnerships, and invest in long-term initiatives that protect ecosystems and promote open information."
    },
    impacto_financiero: {
      es: "Europa Occidental, África Subsahariana, América del Norte",
      en: "Western Europe, Sub-Saharan Africa, North America"
    },
    country: "United Kingdom",
    country_es: "Reino Unido",
    ciudad: "Londres, Reino Unido",
    continent: "europa",
    latitude: 51.5074,
    longitude: -0.1278,
    website: "https://arcadiafund.org.uk/",
    email: "info@arcadiafund.org.uk"
  },
  {
    id: 265,
    name: "Bernard F. and Alva B. Gimbel Foundation, Inc.",
    description_es: "La Fundación Gimbel apoya a organizaciones sin fines de lucro que trabajan en iniciativas de protección ambiental, educación y bienestar social.",
    description_en: "The Gimbel Foundation supports nonprofit organizations working on environmental protection, education, and social welfare initiatives.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Educación de Calidad, Justicia Económica, Derechos de las Infancias",
      en: "Quality Education, Economic Justice, Children's Rights"
    },
    como_trabajan: {
      es: "Proporcionan subvenciones a organizaciones sin fines de lucro, enfatizando el impacto mensurable y el beneficio comunitario a largo plazo.",
      en: "They provide grant funding to nonprofits, emphasizing measurable impact and long-term community benefit."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://fconline.foundationcenter.org/fdo-grantmaker-profile/?key=GIMB001",
    email: "info@gimbelfoundation.org"
  },
  {
    id: 266,
    name: "Blue Action Fund",
    description_es: "Blue Action Fund es una organización filantrópica que apoya la conservación y el uso sostenible de la biodiversidad marina en regiones costeras tropicales mediante el financiamiento de proyectos de alto impacto liderados por socios locales.",
    description_en: "Blue Action Fund is a philanthropic organization that supports the conservation and sustainable use of marine biodiversity in tropical coastal regions by financing high-impact projects led by local partners.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales (Marinos), Justicia Climática, Comunidades Indígenas",
      en: "Conservación de Recursos Naturales (Marinos), Climate Justice, Indigenous Communities"
    },
    como_trabajan: {
      es: "Proporcionan subvenciones a largo plazo basadas en el desempeño, desarrollo de capacidades y apoyo técnico a organizaciones comunitarias y gobiernos que implementan mejoras en la conservación marina y los medios de vida costeros.",
      en: "They provide long-term, performance-based grant funding, capacity building and technical support to community organizations and governments implementing marine conservation and coastal livelihood improvements."
    },
    impacto_financiero: {
      es: "Africa Subsahariana, America Central, America del Sur ",
      en: "Africa Subsahariana, America Central, America del Sur"
    },
    country: "Germany",
    country_es: "Alemania",
    ciudad: "Fráncfort, Alemania",
    continent: "europa",
    latitude: 52.52,
    longitude: 13.405,
    website: "https://www.blueactionfund.org",
    email: "info@blueactionfund.org"
  },
  {
    id: 267,
    name: "Bertarelli Foundation",
    description_es: "Fondation Bertarelli es una fundación privada suiza que apoya la investigación sobre ciencias marinas, biodiversidad y salud, y financia iniciativas destinadas a proteger los ecosistemas y promover el conocimiento científico.",
    description_en: "Fondation Bertarelli is a Swiss private foundation that supports research on marine science, biodiversity, and health, and funds initiatives aimed at protecting ecosystems and advancing scientific knowledge.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales, Salud Global, Innovación Social",
      en: "Natural Resources Conservation, Global Health, Social Innovation"
    },
    como_trabajan: {
      es: "Otorgan subvenciones para investigación, financian programas científicos a gran escala y se asocian con instituciones académicas y de conservación para promover soluciones basadas en evidencia para la salud ambiental y humana.",
      en: "They issue research grants, fund large-scale scientific programs, and partner with academic and conservation institutions to advance evidence-based solutions for environmental and human health."
    },
    impacto_financiero: {
      es: "America del Norte, Africa Subsahariana, Europa Occidental ",
      en: "America del Norte, Africa Subsahariana, Western Europe"
    },
    country: "Switzerland",
    country_es: "Suiza",
    ciudad: "Ginebra, Suiza",
    continent: "europa",
    latitude: 46.948,
    longitude: 7.4474,
    website: "https://www.fondation-bertarelli.org",
    email: "info@fondation-bertarelli.org"
  },
  {
    id: 268,
    name: "Code Blue Foundation",
    description_es: "Code Blue Foundation apoya los esfuerzos para proteger los océanos y los ecosistemas marinos, en particular oponiéndose a las perforaciones en alta mar y a las actividades extractivas nocivas.",
    description_en: "Code Blue Foundation supports efforts to protect oceans and marine ecosystems, particularly by opposing offshore drilling and harmful extractive activities.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales, Justicia Climática, Educación de Calidad",
      en: "Natural Resources Conservation, Climate Justice, Quality Education"
    },
    como_trabajan: {
      es: "Financian campañas de promoción, investigaciones e iniciativas políticas destinadas a salvaguardar los entornos marinos.",
      en: "They fund advocacy campaigns, research, and policy initiatives aimed at safeguarding marine environments."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Los Gatos, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://codebluefoundation.org/",
    email: "info@codebluefoundation.org"
  },
  {
    id: 269,
    name: "Common Wealth Foundation",
    description_es: "Common Wealth Foundation apoya a organizaciones progresistas que trabajan para promover la democracia, la justicia económica y la participación cívica.",
    description_en: "Common Wealth Foundation supports progressive organizations working to advance democracy, economic justice, and civic participation.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Democracia, Participación Ciudadana, Justicia de Género, Movimientos Ciudadanos",
      en: "Democracy, Civic Participation, Gender Justice, Citizen Movements"
    },
    como_trabajan: {
      es: "Proporcionan subvenciones flexibles y apoyan iniciativas de promoción, organización y desarrollo de liderazgo.",
      en: "They provide flexible grants and support advocacy, organizing, and leadership development initiatives."
    },
    impacto_financiero: {
      es: "África Subsahariana, América Central (Caribe), Asia Oriental, Oceanía (Países de la Mancomunidad)",
      en: "Sub-Saharan Africa, América Central (Caribe), East Asia, Oceanía (Países de la Mancomunidad)"
    },
    country: "United Kingdom",
    country_es: "Reino Unido",
    ciudad: "Londres, Reino Unido",
    continent: "europa",
    latitude: 51.5074,
    longitude: -0.1278,
    website: "https://commonwealthfoundation.com/",
    email: "info@commonwealthfoundation.org"
  },
  {
    id: 270,
    name: "Critical Ecosystem Partnership Fund",
    description_es: "El Fondo de Asociación para Ecosistemas Críticos es una iniciativa global de biodiversidad que proporciona financiamiento estratégico y apoyo técnico para proteger los puntos críticos de biodiversidad mediante el apoyo a los líderes conservacionistas locales y a la sociedad civil.",
    description_en: "The Critical Ecosystem Partnership Fund is a global biodiversity initiative that provides strategic funding and technical support to protect biodiversity hotspots by supporting local conservation leaders and civil society.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales, Justicia Climática, Fortalecimiento de Capacidades Organizacionales",
      en: "Natural Resources Conservation, Climate Justice, Organizational Capacity Building"
    },
    como_trabajan: {
      es: "El CEPF distribuye subvenciones competitivas, desarrolla capacidad de liderazgo local y alinea las estrategias de conservación con las prioridades regionales para salvaguardar los ecosistemas y los medios de vida de las comunidades.",
      en: "CEPF distributes competitive grants, builds local leadership capacity, and aligns conservation strategies with regional priorities to safeguard ecosystems and community livelihoods."
    },
    impacto_financiero: {
      es: "America Central, America del Sur, Africa Subsahariana, Asia Central, Asia Oriental ",
      en: "America Central, America del Sur, Africa Subsahariana, Central Asia, East Asia"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Arlington, Virginia, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.cepf.net",
    email: "info@cepf.net"
  },
  {
    id: 271,
    name: "Danone Group",
    description_es: "Danone es una empresa global de alimentos y bebidas que produce lácteos, productos vegetales, aguas y soluciones nutricionales, con una agenda de sostenibilidad integrada (“Un planeta. Una salud”) que vincula el bienestar humano y ambiental.",
    description_en: "Danone is a global food and beverage company that produces dairy, plant-based products, waters, and nutrition solutions, with an integrated sustainability agenda (“One Planet.     One Health”) linking human and environmental well-be",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Soberanía Alimentaria, Economía Circular, Salud Global, Conservación de Recursos Naturales",
      en: "Food Sovereignty, Circular Economy, Global Health, Natural Resources Conservation"
    },
    como_trabajan: {
      es: "Como corporación, Danone implementa prácticas comerciales sostenibles, iniciativas de cadena de suministro, programas de responsabilidad social corporativa y asociaciones de múltiples partes interesadas para reducir el impacto ambiental y mejorar el acceso a la nutrición.",
      en: "As a corporation, Danone implements sustainable business practices, supply chain initiatives, corporate social responsibility programs, and multi-stakeholder partnerships to reduce environmental impact and improve nutrition access."
    },
    impacto_financiero: {
      es: "America del Norte, America Central, America del Sur, Europa Occidental, Asia Oriental ",
      en: "America del Norte, America Central, America del Sur, Western Europe, East Asia"
    },
    country: "France",
    country_es: "Francia",
    ciudad: "París, Francia",
    continent: "europa",
    latitude: 48.8566,
    longitude: 2.3522,
    website: "https://www.danone.com",
    email: "contact@danone.com"
  },
  {
    id: 272,
    name: "Deutsche Gesellschaft für Internationale Zusammenarbeit - GIZ",
    description_es: "GIZ es la principal agencia de cooperación internacional de Alemania y ejecuta programas de desarrollo sostenible en asociación con gobiernos, la sociedad civil y partes interesadas privadas para mejorar la gobernanza, el desarrollo económico y la resiliencia ambiental.",
    description_en: "GIZ is Germany’s primary international cooperation agency, executing sustainable development programs in partnership with governments, civil society, and private stakeholders to improve governance, economic development, and environmental resilience.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Gobernanza Global, políticas y rendición de cuentas, Transición Energética, Ciudades Sustentables, Educación de Calidad",
      en: "Gobernanza Global, políticas y rendición de cuentas, Energy Transition, Sustainable Cities, Quality Education"
    },
    como_trabajan: {
      es: "Implementan cooperación técnica, asesoramiento sobre políticas, desarrollo de capacidades institucionales e implementación de proyectos en sectores como el clima, la gobernanza, la inclusión social y el desarrollo económico.",
      en: "They implement technical cooperation, policy advisory, institutional capacity building, and project implementation across sectors such as climate, governance, social inclusion, and economic development."
    },
    impacto_financiero: {
      es: "Africa Subsahariana, America Central, America del Sur, Asia Central, Asia Oriental, Oceania, Europa Occidental",
      en: "Africa Subsahariana, America Central, America del Sur, Central Asia, East Asia, Oceania, Western Europe"
    },
    country: "Germany",
    country_es: "Alemania",
    ciudad: "Bonn y Eschborn, Alemania",
    continent: "europa",
    latitude: 52.52,
    longitude: 13.405,
    website: "https://www.giz.de",
    email: "info@giz.de"
  },
  {
    id: 273,
    name: "Doris Duke Charitable Foundation",
    description_es: "La Doris Duke Charitable Foundation apoya iniciativas en las artes, el medio ambiente, la investigación médica y el bienestar infantil, con énfasis en enfoques de impacto social basados ​​en evidencia.",
    description_en: "The Doris Duke Charitable Foundation supports initiatives in the arts, environment, medical research, and child well-being, with emphasis on evidence-based approaches to social impact.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales, Justicia de Género, Justicia Racial, Derechos de las Infancias",
      en: "Natural Resources Conservation, Gender Justice, Racial Justice, Children's Rights"
    },
    como_trabajan: {
      es: "Proporcionan subvenciones estratégicas, financiación institucional y compromisos plurianuales a organizaciones sin fines de lucro e instituciones de investigación que avanzan en sus áreas de interés.",
      en: "They provide strategic grants, institutional funding, and multi-year commitments to nonprofit organizations and research institutions advancing their focus areas."
    },
    impacto_financiero: {
      es: "America del Norte, Africa Subsahariana, Europa Occidental",
      en: "America del Norte, Africa Subsahariana, Western Europe"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.dorisduke.org",
    email: "info@dorisduke.org"
  },
  {
    id: 274,
    name: "The Vale Fund",
    description_es: "Fundação Vale es el brazo de inversión social de Vale, que se centra en el desarrollo sostenible, la educación y la resiliencia comunitaria en las regiones donde opera la empresa.",
    description_en: "Fundação Vale is the social investment arm of Vale, focusing on sustainable development, education, and community resilience in regions where the company operates.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Educación de Calidad, Justicia Económica, Salud Global, Fortalecimiento de Capacidades Organizacionales",
      en: "Quality Education, Economic Justice, Global Health, Organizational Capacity Building"
    },
    como_trabajan: {
      es: "Implementan y financian programas de desarrollo comunitario, asociaciones con gobiernos locales y proyectos de innovación social.",
      en: "They implement and fund community development programs, partnerships with local governments, and social innovation projects."
    },
    impacto_financiero: {
      es: "América del Sur (Brasil), otras",
      en: "América del Sur (Brasil), otras"
    },
    country: "Brazil",
    country_es: "Brasil",
    ciudad: "Río de Janeiro, Brasil",
    continent: "america",
    latitude: -15.7975,
    longitude: -47.8919,
    website: "https://www.fundacaovale.org/en/home/",
    email: "info@thevalefund.org"
  },
  {
    id: 275,
    name: "George B. Storer Foundation",
    description_es: "La Fundación George B. Storer apoya iniciativas caritativas en educación, salud y servicios sociales.",
    description_en: "The George B. Storer Foundation supports charitable initiatives in education, health, and social services.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales, Educación de Calidad, Democracia",
      en: "Natural Resources Conservation, Quality Education, Democracy"
    },
    como_trabajan: {
      es: "Proporcionan subvenciones a organizaciones sin fines de lucro e instituciones comunitarias para fortalecer la infraestructura social.",
      en: "They provide grants to nonprofit organizations and community institutions to strengthen social infrastructure."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Jackson, Wyoming, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.storerfoundation.org/contact",
    email: "info@storerfoundation.org"
  },
  {
    id: 276,
    name: "International Climate Initiative",
    description_es: "La Iniciativa Internacional sobre el Clima (IKI), financiada por el gobierno alemán, apoya proyectos de mitigación y adaptación al clima en países en desarrollo y emergentes en asociación con actores multilaterales, nacionales y locales.",
    description_en: "The International Climate Initiative (IKI), funded by the German government, supports climate mitigation and adaptation projects in developing and emerging countries in partnership with multilateral, national, and local actors.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Transición Energética, Conservación de Recursos Naturales, Gobernanza Global",
      en: "Climate Justice, Energy Transition, Natural Resources Conservation, Gobernanza Global"
    },
    como_trabajan: {
      es: "IKI proporciona financiación competitiva para proyectos, apoyo a políticas, cooperación técnica y desarrollo de capacidades para implementar acciones climáticas alineadas con los objetivos del Acuerdo de París.",
      en: "IKI provides competitive project funding, policy support, technical cooperation, and capacity building to implement climate action aligned with Paris Agreement goals."
    },
    impacto_financiero: {
      es: "Africa Subshariana, America Central, America del Sur, Asia Central, Asia Oriental",
      en: "Africa Subshariana, America Central, America del Sur, Central Asia, East Asia"
    },
    country: "Germany",
    country_es: "Alemania",
    ciudad: "Berlín, Alemania",
    continent: "europa",
    latitude: 52.52,
    longitude: 13.405,
    website: "https://www.international-climate-initiative.com",
    email: "info@iki.bmuv.de"
  },
  {
    id: 277,
    name: "Japan International Cooperation Agency",
    description_es: "JICA es la agencia de desarrollo gubernamental de Japón que brinda cooperación técnica, préstamos concesionales y subvenciones para el desarrollo socioeconómico, infraestructura y desarrollo de capacidades en países socios.",
    description_en: "JICA is Japan’s governmental development agency that provides technical cooperation, concessional loans, and grant aid for socio-economic development, infrastructure, and capacity building in partner countries.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Gobernanza Global, políticas y rendición de cuentas, Educación de Calidad, Ciudades Sustentables, Salud Global",
      en: "Gobernanza Global, políticas y rendición de cuentas, Quality Education, Sustainable Cities, Global Health"
    },
    como_trabajan: {
      es: "Participan en financiación de proyectos, asistencia técnica, programas de capacitación y cooperación institucional en sectores como la salud, la educación, la agricultura y la resiliencia climática.",
      en: "They engage in project financing, technical assistance, training programs, and institutional cooperation across sectors such as health, education, agriculture, and climate resilience."
    },
    impacto_financiero: {
      es: "Africa subshariana, Asia Central, Asia Oriental, America Central, America del Sur ",
      en: "Africa subshariana, Central Asia, East Asia, America Central, America del Sur"
    },
    country: "Japan",
    country_es: "Japón",
    ciudad: "Tokio, Japón",
    continent: "asia",
    latitude: 35.6762,
    longitude: 139.6503,
    website: "https://www.jica.go.jp",
    email: "jicainquiry@jica.go.jp"
  },
  {
    id: 278,
    name: "Pictet Charitable Foundation",
    description_es: "Se asocia con organizaciones que utilizan enfoques innovadores para mejorar la salud global y desarrollar resiliencia a largo plazo, centrándose específicamente en aumentar el acceso a soluciones sostenibles para la gestión del agua y prevenir la desnutrición en comunidades vulnerables.",
    description_en: "Partners with organizations that use innovative approaches to improve global health and build long-term resilience, focusing specifically on increasing access to sustainable solutions for water management and preventing malnutrition in vulnerable communities.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales (Agua), Justicia Económica, Educación de Calidad",
      en: "Conservación de Recursos Naturales (Agua), Economic Justice, Quality Education"
    },
    como_trabajan: {
      es: "Opera principalmente por invitación estratégica y asociación. La concesión de subvenciones se alinea con la experiencia temática del Grupo Pictet. Por lo general, no aceptan propuestas no solicitadas y, en cambio, se centran en organizaciones que ofrecen soluciones empresariales que abarcan todo el sistema.",
      en: "Operates primarily by strategic invitation and partnership. Grant-making aligns with the Pictet Group's thematic expertise. They do not generally accept unsolicited proposals, focusing instead on organizations that offer entrepreneurial, systems-wide solutions."
    },
    impacto_financiero: {
      es: "America del Norte ",
      en: "America del Norte"
    },
    country: "Switzerland",
    country_es: "Suiza",
    ciudad: "Ginebra, Suiza",
    continent: "europa",
    latitude: 46.948,
    longitude: 7.4474,
    website: "https://www.storerfoundation.org/",
    email: "info@pictet.com"
  },
  {
    id: 279,
    name: "Scherman Foundation        ",
    description_es: "Apoya a organizaciones enfocadas en la organización, la promoción y la construcción de movimientos para lograr una transformación política, económica y cultural, con un fuerte compromiso con el antirracismo y el empoderamiento de las comunidades BIPOC (negras, indígenas y de color).",
    description_en: "Supports organizations focused on organizing, advocacy, and movement building to achieve political, economic, and cultural transformation, with a strong commitment to anti-racism and empowering BIPOC (Black, Indigenous, and People of Color) communities.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia de Género, Justicia Climática, Derechos Humanos, Democracia",
      en: "Gender Justice, Climate Justice, Derechos Humanos, Democracy"
    },
    como_trabajan: {
      es: "Utiliza una convocatoria abierta anual de Cartas de Intención (LOI) para nuevos solicitantes, pero se centra principalmente en apoyar a los beneficiarios actuales. Priorizan la financiación para organizaciones que trabajan en las intersecciones de la justicia social, racial y económica, con financiación limitada para nuevas subvenciones cada año.",
      en: "Utilizes an annual open call for Letters of Intent (LOI) for new applicants, but primarily focuses on supporting current grantees. They prioritize funding for organizations working at the intersections of social, racial, and economic justice, with limited funding for new grants each year."
    },
    impacto_financiero: {
      es: "Butler Family Fund",
      en: "Butler Family Fund"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.scherman.org/",
    email: "info@thescherman.org"
  },
  {
    id: 280,
    name: "Secunda Family Foundation        ",
    description_es: "Secunda Family Foundation apoya a organizaciones que promueven la justicia social, la educación y el desarrollo comunitario.",
    description_en: "Secunda Family Foundation supports organizations advancing social justice, education, and community development.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Innovación Social, Salud Global, Educación de Calidad",
      en: "Social Innovation, Global Health, Quality Education"
    },
    como_trabajan: {
      es: "Proporcionan subvenciones filantrópicas y apoyan el desarrollo de capacidades para socios sin fines de lucro.",
      en: "They provide philanthropic grants and support capacity building for nonprofit partners."
    },
    impacto_financiero: {
      es: "Butler Family Fund",
      en: "Butler Family Fund"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.insidephilanthropy.com/find-a-grant/grants-s/secunda-family-foundation",
    email: "info@secundafamilyfoundation.org"
  },
  {
    id: 281,
    name: "GEF Small Grants Programme",
    description_es: "El Programa de Pequeñas Subvenciones (PPD) del PNUD y el Fondo para el Medio Ambiente Mundial (FMAM) proporciona financiación y apoyo técnico a proyectos comunitarios que abordan la conservación de la biodiversidad, la mitigación/adaptación al cambio climático y los medios de vida sostenibles.",
    description_en: "The Small Grants Programme (SGP) of UNDP and the Global Environment Facility (GEF) provides funding and technical support to community-based projects that address biodiversity conservation, climate change mitigation/adaptation, and sustainable livelihoods.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales, Justicia Climática, Comunidades Indígenas, Fortalecimiento de Capacidades Organizacionales",
      en: "Natural Resources Conservation, Climate Justice, Indigenous Communities, Organizational Capacity Building"
    },
    como_trabajan: {
      es: "El PPD ofrece subvenciones pequeñas y accesibles, desarrollo de capacidades y apoyo para el diseño participativo de proyectos a comunidades locales y organizaciones de base.",
      en: "SGP delivers small, accessible grants, capacity building, and participatory project design support to local communities and grassroots organizations."
    },
    impacto_financiero: {
      es: "Africa Subshariana, America Central, America del Sur, Asia Central, Asia Oriental ",
      en: "Africa Subshariana, America Central, America del Sur, Central Asia, East Asia"
    },
    country: "EE. UU. (Sede PNUD)",
    country_es: "EE. UU. (Sede PNUD)",
    ciudad: "Nueva York, EE. UU. (Sede PNUD)",
    continent: "desconocido",
    latitude: 0,
    longitude: 0,
    website: "https://sgp.undp.org",
    email: "sgp@undp.org"
  },
  {
    id: 282,
    name: " International Coral Reef Initiative",
    description_es: "La Iniciativa Internacional sobre Arrecifes de Coral es una asociación entre naciones, organizaciones internacionales y la sociedad civil que trabajan para preservar los arrecifes de coral, los ecosistemas relacionados y las comunidades que dependen de ellos.",
    description_en: "The International Coral Reef Initiative is a partnership among nations, international organizations, and civil society working to preserve coral reefs, related ecosystems, and the communities that depend on them.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales, Justicia Climática, Gobernanza Global, políticas y rendición de cuentas",
      en: "Natural Resources Conservation, Climate Justice, Gobernanza Global, políticas y rendición de cuentas"
    },
    como_trabajan: {
      es: "Coordinan el diálogo político, el intercambio científico, el desarrollo de capacidades, redes regionales de monitoreo y campañas globales de concientización para proteger los arrecifes de coral y los medios de vida que dependen de los arrecifes.",
      en: "They coordinate policy dialogue, scientific exchange, capacity building, regional monitoring networks, and global awareness campaigns to protect coral reefs and reef-dependent livelihoods."
    },
    impacto_financiero: {
      es: "Africa Subsahariana, America Central, America del Sur, Asia Oriental, Oceania ",
      en: "Africa Subsahariana, America Central, America del Sur, East Asia, Oceania"
    },
    country: "secretariado actual)",
    country_es: "secretariado actual)",
    ciudad: "Mónaco (Sede rotativa, secretariado actual)",
    continent: "desconocido",
    latitude: 0,
    longitude: 0,
    website: "https://icriforum.org",
    email: "secretariat@icriforum.org"
  },
  {
    id: 283,
    name: "The Leonardo DiCaprio Foundation",
    description_es: "La Fundación Leonardo DiCaprio apoya los esfuerzos globales para combatir el cambio climático, proteger la biodiversidad y conservar los ecosistemas vulnerables.",
    description_en: "The Leonardo DiCaprio Foundation supports global efforts to combat climate change, protect biodiversity, and conserve vulnerable ecosystems.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales, Justicia Climática, Comunidades Indígenas",
      en: "Natural Resources Conservation, Climate Justice, Indigenous Communities"
    },
    como_trabajan: {
      es: "Financian proyectos de conservación, campañas de promoción e investigaciones científicas a través de asociaciones con organizaciones ambientales.",
      en: "\tThey fund conservation projects, advocacy campaigns, and scientific research through partnerships with environmental organizations."
    },
    impacto_financiero: {
      es: "\tÁfrica Subsahariana, América Central, América del Sur, Asia Oriental",
      en: "Sub-Saharan Africa, Central America, South America, East Asia"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Los Ángeles, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://globalgreen.org/directory/listing/leonardo-dicaprio-foundation/",
    email: "info@leonardodicaprio.org"
  },
  {
    id: 284,
    name: "The Mohamed bin Zayed Species Conservation Fund",
    description_es: "El Fondo para la Conservación de Especies es una iniciativa filantrópica que proporciona financiación para proyectos de conservación sobre el terreno centrados en especies amenazadas y en peligro de extinción y sus hábitats.",
    description_en: "The Species Conservation Fund is a philanthropic initiative that provides funding for on-the-ground conservation projects focused on threatened and endangered species and their habitats.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales (Especies), Educación de Calidad",
      en: "Conservación de Recursos Naturales (Especies), Quality Education"
    },
    como_trabajan: {
      es: "Proporcionan subvenciones pequeñas y medianas, tutoría de proyectos y apoyo de seguimiento para organizaciones comunitarias y asociadas que implementan programas de conservación de especies.",
      en: "They provide small to medium-sized grants, project mentoring, and monitoring support for community and partner organizations implementing species conservation programs."
    },
    impacto_financiero: {
      es: "Africa Subsahariana, America Central, Asia Oriental, America del Sur ",
      en: "Africa Subsahariana, America Central, East Asia, America del Sur"
    },
    country: "Emiratos Árabes Unidos",
    country_es: "Emiratos Árabes Unidos",
    ciudad: "Abu Dabi, Emiratos Árabes Unidos",
    continent: "desconocido",
    latitude: 0,
    longitude: 0,
    website: "https://scf1.speciesconservation.org",
    email: "info@mbzspeciesconservation.org"
  },
  {
    id: 285,
    name: "The Wetland Foundation",
    description_es: "La Wetland Foundation trabaja para proteger, restaurar y defender los humedales y ecosistemas costeros críticos para la biodiversidad y la resiliencia climática.",
    description_en: "The Wetland Foundation works to protect, restore, and advocate for wetlands and coastal ecosystems critical to biodiversity and climate resilience.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales, Educación de Calidad, Justicia Climática",
      en: "Natural Resources Conservation, Quality Education, Climate Justice"
    },
    como_trabajan: {
      es: "Participan en proyectos de conservación, asociaciones comunitarias, educación y promoción de políticas para salvaguardar los ecosistemas de humedales.",
      en: "They engage in conservation projects, community partnerships, education, and policy advocacy to safeguard wetland ecosystems."
    },
    impacto_financiero: {
      es: "Butler Family Fund",
      en: "Butler Family Fund"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Gainesville, Florida, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "http://thewetlandfoundation.org/",
    email: "info@wetlandfoundation.org"
  },
  {
    id: 286,
    name: "UK Partnering for Accelerated Climate Transitions - UK PACT",
    description_es: "UK PACT es un programa climático internacional del gobierno del Reino Unido que apoya a los países en desarrollo a implementar políticas climáticas ambiciosas, vías de desarrollo bajas en carbono y fortalecimiento institucional alineados con los compromisos climáticos globales.",
    description_en: "UK PACT is a UK government international climate program that supports developing countries in delivering ambitious climate policies, low-carbon development pathways, and institutional strengthening aligned with global climate commitments.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Transición Energética, Justicia Climática, Ciudades Sustentables, Gobernanza Global",
      en: "Energy Transition, Climate Justice, Sustainable Cities, Gobernanza Global"
    },
    como_trabajan: {
      es: "Proporcionan asistencia técnica, servicios de asesoramiento sobre políticas, desarrollo de capacidades institucionales y asociaciones estructuradas con gobiernos y actores del sector privado para acelerar la mitigación y adaptación al clima.",
      en: "They provide technical assistance, policy advisory services, institutional capacity building, and structured partnerships with governments and private sector actors to accelerate climate mitigation and adaptation."
    },
    impacto_financiero: {
      es: "África Subsahariana, Asia Central, Asia Oriental, América Central, América del Sur",
      en: "Sub-Saharan Africa, Central Asia, East Asia, Central America, South America"
    },
    country: "United Kingdom",
    country_es: "Reino Unido",
    ciudad: "Londres, Reino Unido",
    continent: "europa",
    latitude: 51.5074,
    longitude: -0.1278,
    website: "https://www.ukpact.co.uk/",
    email: "info@ukpact.co.uk"
  },
  {
    id: 287,
    name: "Zennstrom Philanthropies",
    description_es: "Zennström Philanthropies es una organización filantrópica global que apoya la acción climática, los derechos humanos, la innovación social y el emprendimiento impulsado por el impacto para abordar los desafíos globales sistémicos.",
    description_en: "Zennström Philanthropies is a global philanthropic organization supporting climate action, human rights, social innovation, and impact-driven entrepreneurship to address systemic global challenges.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática (Océanos), Derechos Humanos, Innovación Social",
      en: "Justicia Climática (Océanos), Derechos Humanos, Social Innovation"
    },
    como_trabajan: {
      es: "Financian iniciativas innovadoras, promoción de políticas, soluciones impulsadas por la tecnología y empresas sociales, y a menudo respaldan la experimentación y modelos escalables para generar impacto.",
      en: "They fund innovative initiatives, policy advocacy, technology-driven solutions, and social enterprises, often supporting experimentation and scalable models for impact."
    },
    impacto_financiero: {
      es: "Europa Occidental, África Subsahariana, América del Norte, Asia Oriental",
      en: "Western Europe, Sub-Saharan Africa, North America, East Asia"
    },
    country: "United Kingdom",
    country_es: "Reino Unido",
    ciudad: "Londres, Reino Unido",
    continent: "europa",
    latitude: 51.5074,
    longitude: -0.1278,
    website: "https://www.zennstrom.org/",
    email: "info@zennstrom.org"
  },
  {
    id: 288,
    name: "Clinton Global Initiative",
    description_es: "La Fundación Clinton trabaja para mejorar la salud global, las oportunidades económicas, la resiliencia climática y el acceso a la educación a través de asociaciones a gran escala y programas prácticos.",
    description_en: "The Clinton Foundation works to improve global health, economic opportunity, climate resilience, and access to education through large-scale partnerships and practical programs.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Salud Global, Justicia Climática, Justicia de Género, Justicia Económica",
      en: "Global Health, Climate Justice, Gender Justice, Economic Justice"
    },
    como_trabajan: {
      es: "Diseñan e implementan iniciativas de múltiples partes interesadas, brindan apoyo técnico, desarrollan capacidades y coordinan asociaciones público-privadas con gobiernos, ONG y empresas.",
      en: "They design and implement multi-stakeholder initiatives, provide technical support, build capacity, and coordinate public-private partnerships with governments, NGOs, and businesses."
    },
    impacto_financiero: {
      es: "África Subsahariana, Asia Oriental, América Central, América del Sur",
      en: "Sub-Saharan Africa, East Asia, Central America, South America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.clintonfoundation.org",
    email: "info@clintonfoundation.org"
  },
  {
    id: 289,
    name: "Marguerite Casey Foundation",
    description_es: "Casey Grants administra fondos filantrópicos que apoyan la equidad racial, la participación cívica, la justicia juvenil y las iniciativas de poder comunitario.",
    description_en: "Casey Grants manages philanthropic funds that support racial equity, civic participation, youth justice, and community power initiatives.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Racial, Justicia Económica, Democracia, Movimientos Ciudadanos",
      en: "Racial Justice, Economic Justice, Democracy, Citizen Movements"
    },
    como_trabajan: {
      es: "Ofrecen subvenciones estratégicas, mecanismos de financiación mancomunados y servicios de asesoramiento a donantes para promover el cambio social sistémico.",
      en: "They deliver strategic grantmaking, pooled funding mechanisms, and donor advisory services to advance systemic social change."
    },
    impacto_financiero: {
      es: "América del Norte, Europa Occidental",
      en: "North America, Western Europe"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Seattle, Washington, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://caseygrants.org/",
    email: "info@margueritecaseyfoundation.org"
  },
  {
    id: 290,
    name: "Robert Wood Johnson Foundation",
    description_es: "La Fundación Robert Wood Johnson es una importante organización filantrópica de salud centrada en mejorar los resultados de salud y promover la equidad en salud abordando los determinantes sociales y económicos de la salud.",
    description_en: "The Robert Wood Johnson Foundation is a major health philanthropy focused on improving health outcomes and advancing health equity by addressing social and economic determinants of health.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Salud Global, Justicia Racial, Ciudades Sustentables",
      en: "Global Health, Racial Justice, Sustainable Cities"
    },
    como_trabajan: {
      es: "Financian investigaciones, análisis de políticas, iniciativas comunitarias, desarrollo de liderazgo e intervenciones a nivel de sistemas para impulsar resultados de salud equitativos.",
      en: "They fund research, policy analysis, community initiatives, leadership development, and systems-level interventions to drive equitable health outcomes."
    },
    impacto_financiero: {
      es: "América del Norte, África Subsahariana",
      en: "North America, Sub-Saharan Africa"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Princeton, Nueva Jersey, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.rwjf.org",
    email: "info@rwjf.org"
  },
  {
    id: 291,
    name: " Frederick Mulder Foundation",
    description_es: "La Fundación Frederick Mulder apoya las artes, la cultura, la participación cívica y las iniciativas de desarrollo comunitario a través de inversiones filantrópicas específicas.",
    description_en: "The Frederick Mulder Foundation supports arts, culture, civic engagement, and community development initiatives through targeted philanthropic investments.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Paz y Resolución de Conflictos, Innovación Social",
      en: "Climate Justice, Peace and Conflict Resolution, Social Innovation"
    },
    como_trabajan: {
      es: "Proporcionan subvenciones para proyectos, financiación de asociaciones y apoyo colaborativo a organizaciones que trabajan en la intersección de la cultura y el impacto social.",
      en: "They provide project grants, partnership funding, and collaborative support to organizations working at the intersection of culture and social impact."
    },
    impacto_financiero: {
      es: "Europa Occidental, África Subsahariana",
      en: "Western Europe, Sub-Saharan Africa"
    },
    country: "United Kingdom",
    country_es: "Reino Unido",
    ciudad: "Londres, Reino Unido",
    continent: "europa",
    latitude: 51.5074,
    longitude: -0.1278,
    website: "https://www.frederickmulderfoundation.org.uk",
    email: "info@frederickmulderfoundation.org.uk"
  },
  {
    id: 292,
    name: "Marie-Louise von Motesiczky Charitable Trust",
    description_es: "Marie-Louise von Motesiczky Charitable Trust apoya las artes, la cultura, el bienestar social y causas humanitarias.",
    description_en: "The Marie-Louise von Motesiczky Charitable Trust supports arts, culture, social welfare, and humanitarian causes.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Educación de Calidad, Innovación Social",
      en: "Quality Education, Social Innovation"
    },
    como_trabajan: {
      es: "Proporcionan subvenciones a organizaciones benéficas, instituciones culturales e iniciativas sociales.",
      en: "They provide grants to charitable organizations, cultural institutions, and social initiatives."
    },
    impacto_financiero: {
      es: "Europa Occidental (Reino Unido, Austria, Alemania), América del Norte (EE. UU.)",
      en: "Europa Occidental (Reino Unido, Austria, Alemania), América del Norte (EE. UU.)"
    },
    country: "United Kingdom",
    country_es: "Reino Unido",
    ciudad: "Londres, Reino Unido",
    continent: "europa",
    latitude: 51.5074,
    longitude: -0.1278,
    website: "https://www.motesiczky.org/",
    email: "info@motesiczkytrust.org"
  },
  {
    id: 293,
    name: "Funders Initiative for Civil Society",
    description_es: "Fortalece el campo global de la filantropía coordinando a los donantes para proteger el espacio cívico y defender a las organizaciones de la sociedad civil y a los defensores de los derechos humanos que enfrentan presiones o restricciones indebidas en todo el mundo.",
    description_en: "Strengthens the global field of philanthropy by coordinating donors to protect civic space and defend civil society organizations and human rights defenders facing undue pressure or restriction worldwide.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Democracia, Participación Ciudadana, Movimientos Ciudadanos, Gobernanza Global",
      en: "Democracy, Civic Participation, Citizen Movements, Gobernanza Global"
    },
    como_trabajan: {
      es: "No funciona como una fundación que otorga subvenciones directas. Es una colaboración de donantes que reúne recursos y coordina la concesión de subvenciones de los miembros hacia objetivos compartidos. El financiamiento se canaliza a través de organizaciones asociadas y es mediante invitación a socios estratégicos.",
      en: "Does not operate as a direct grant-making foundation. It is a donor collaborative that pools resources and coordinates member grantmaking toward shared goals. Funding is channelled through partner organizations and is by invitation to strategic partners."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "United Kingdom",
    country_es: "Reino Unido",
    ciudad: "Londres, Reino Unido",
    continent: "europa",
    latitude: 51.5074,
    longitude: -0.1278,
    website: "https://www.fundersinitiativeforcivilsociety.org/",
    email: "FICS@global-dialogue.org"
  },
  {
    id: 294,
    name: "International Resource for Impact and Storytelling",
    description_es: "Apoya a organizaciones que utilizan medios convincentes y estrategias narrativas para cambiar la cultura, construir movimientos y promover los objetivos de derechos humanos y justicia social a nivel mundial, centrándose en la narración creativa para el cambio social.",
    description_en: "Supports organizations that use compelling media and narrative strategies to shift culture, build movements, and advance human rights and social justice goals globally, focusing on creative storytelling for social change.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Innovación Social, Movimientos Ciudadanos, Derechos Digitales",
      en: "Social Innovation, Citizen Movements, Digital Rights"
    },
    como_trabajan: {
      es: "Opera principalmente a través de asociaciones estratégicas y proyectos encargados. La financiación generalmente se realiza mediante invitación únicamente a organizaciones que integran estrategias de medios innovadoras en su trabajo principal de derechos humanos o justicia social.",
      en: "Operates primarily through strategic partnerships and commissioned projects. Funding is generally by invitation only to organizations that integrate innovative media strategies into their core human rights or social justice work."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://storyforimpact.io/",
    email: "info@irisimpact.org"
  },
  {
    id: 295,
    name: "Proteus Fund",
    description_es: "Proteus Fund apoya los movimientos progresistas de justicia social que trabajan en la reforma democrática, los derechos humanos y el compromiso cívico.",
    description_en: "Proteus Fund supports progressive social justice movements working on democracy reform, human rights, and civic engagement.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Democracia, Justicia Racial, LGTBIQ+, Justicia de Género",
      en: "Democracy, Racial Justice, LGBTIQ+, Gender Justice"
    },
    como_trabajan: {
      es: "Operan fondos mancomunados, otorgan subvenciones y patrocinio fiscal, apoyan campañas de promoción y crean colaboraciones entre donantes.",
      en: "They operate pooled funds, provide grantmaking and fiscal sponsorship, support advocacy campaigns, and build donor collaboratives."
    },
    impacto_financiero: {
      es: "América del Norte, África Subsahariana, Europa Occidental",
      en: "North America, Sub-Saharan Africa, Western Europe"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.proteusfund.org",
    email: "info@proteusfund.org"
  },
  {
    id: 296,
    name: "Luminate Fund",
    description_es: "Luminate es una organización filantrópica global que apoya la democracia, la participación cívica y la igualdad de acceso a oportunidades a través de financiación basada en evidencia.",
    description_en: "Luminate is a global philanthropic organization that supports democracy, civic participation, and equal access to opportunity through evidence-based funding.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Derechos Digitales, Democracia, Gobernanza Global, políticas y rendición de cuentas, Participación Ciudadana",
      en: "Digital Rights, Democracy, Gobernanza Global, políticas y rendición de cuentas, Civic Participation"
    },
    como_trabajan: {
      es: "Invierten en investigación, tecnología cívica, promoción de políticas y concesión de subvenciones estratégicas para fortalecer los sistemas democráticos y la rendición de cuentas pública.",
      en: "They invest in research, civic technology, policy advocacy, and strategic grantmaking to strengthen democratic systems and public accountability."
    },
    impacto_financiero: {
      es: "América del Norte, Europa Occidental, África Subsahariana, Asia Oriental",
      en: "North America, Western Europe, Sub-Saharan Africa, East Asia"
    },
    country: "United Kingdom",
    country_es: "Reino Unido",
    ciudad: "Londres, Reino Unido",
    continent: "europa",
    latitude: 51.5074,
    longitude: -0.1278,
    website: "https://luminategroup.com",
    email: "info@luminategroup.com"
  },
  {
    id: 297,
    name: "Bright Funds",
    description_es: "Bright Funds opera una plataforma de donaciones en el lugar de trabajo y asesorada por donantes que conecta a los donantes con organizaciones sin fines de lucro examinadas en múltiples áreas temáticas.",
    description_en: "Bright Funds operates a donor-advised and workplace giving platform connecting donors with vetted nonprofit organizations across multiple issue areas.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Fortalecimiento de Capacidades Organizacionales, Innovación Social, Educación de Calidad",
      en: "Organizational Capacity Building, Social Innovation, Quality Education"
    },
    como_trabajan: {
      es: "Gestionan fondos asesorados por donantes, carteras de donaciones seleccionadas, programas de donaciones equivalentes y herramientas de informes de impacto para agilizar las donaciones caritativas.",
      en: "They manage donor-advised funds, curated giving portfolios, matching gift programs, and impact reporting tools to streamline charitable giving."
    },
    impacto_financiero: {
      es: "América del Norte, Europa Occidental",
      en: "North America, Western Europe"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Oakland, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.brightfunds.org",
    email: "info@brightfunds.org"
  },
  {
    id: 298,
    name: "The Harnisch Foundation",
    description_es: "Fomenta la igualdad de género y apoya a organizaciones que invierten en el poder y el liderazgo de las mujeres, centrándose en gran medida en los medios, la tecnología y la construcción de comunidades de práctica para mujeres líderes.",
    description_en: "Fosters gender equality and supports organizations that invest in the power and leadership of women, focusing heavily on media, technology, and building communities of practice for women leaders.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia de Género, Juventud, Innovación Social",
      en: "Gender Justice, Youth, Social Innovation"
    },
    como_trabajan: {
      es: "No acepta propuestas no solicitadas. La concesión de subvenciones se realiza mediante invitación únicamente a organizaciones que se alinean con la pasión del Fundador por apoyar a las mujeres líderes y crear entornos para que prosperen.",
      en: "Does not accept unsolicited proposals. Grantmaking is done by invitation only to organizations that align with the Founder's passion for supporting women leaders and creating environments for them to thrive."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://thehf.org/",
    email: "info@harnischfoundation.org"
  },
  {
    id: 299,
    name: "Kataly Foundation",
    description_es: "Kataly apoya los movimientos de base que promueven la justicia económica y el poder comunitario, particularmente aquellos liderados por personas de color.",
    description_en: "Kataly supports grassroots movements advancing economic justice and community power, particularly those led by people of color.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Racial, Justicia Económica, Movimientos Ciudadanos, Justicia Climática",
      en: "Racial Justice, Economic Justice, Citizen Movements, Climate Justice"
    },
    como_trabajan: {
      es: "Proporcionan financiación básica flexible, apoyo a la infraestructura del movimiento, desarrollo de capacidades y asociaciones a largo plazo con organizaciones de creación de bases.",
      en: "They provide flexible core funding, movement infrastructure support, capacity building, and long-term partnerships with base-building organizations."
    },
    impacto_financiero: {
      es: "América del Norte, África Subsahariana",
      en: "North America, Sub-Saharan Africa"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "San Francisco, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://kataly.org",
    email: "info@kataly.org"
  },
  {
    id: 300,
    name: "Butler Family Fund",
    description_es: "Trabaja para combatir las causas fundamentales de la adicción, proteger a los niños del abuso y la negligencia y prevenir la criminalización de la pobreza mediante el apoyo a la promoción de políticas, la investigación y las organizaciones que promueven la justicia y el bienestar humano.",
    description_en: "Works to combat the root causes of addiction, protect children from abuse and neglect, and prevent the criminalization of poverty by supporting policy advocacy, research, and organizations that promote justice and human welfare.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Paz y Resolución de Conflictos, Justicia Económica, Justicia Racial",
      en: "Peace and Conflict Resolution, Economic Justice, Racial Justice"
    },
    como_trabajan: {
      es: "Opera principalmente por invitación a organizaciones e iniciativas que se alinean estrechamente con las áreas principales del programa definidas por la Junta Directiva. Rara vez aceptan propuestas no solicitadas.",
      en: "Operates primarily by invitation to organizations and initiatives that closely align with the core program areas defined by the Board of Directors. They rarely accept unsolicited proposals."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Washington D.C., EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.opportunityhome.org/partners/butler-family-fund/",
    email: "info@butlerfamilyfund.org"
  },
  {
    id: 301,
    name: "Surdna Foundation",
    description_es: "La Fundación Surdna promueve la justicia social, las economías inclusivas, los entornos sostenibles y las culturas prósperas a través de inversiones filantrópicas a largo plazo.",
    description_en: "The Surdna Foundation advances social justice, inclusive economies, sustainable environments, and thriving cultures through long-term philanthropic investment.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Racial, Justicia Económica, Ciudades Sustentables, Innovación Social",
      en: "Racial Justice, Economic Justice, Sustainable Cities, Social Innovation"
    },
    como_trabajan: {
      es: "Proporcionan subvenciones multianuales, fortalecimiento de la capacidad organizacional y asociaciones estratégicas con organizaciones comunitarias.",
      en: "They provide multi-year grants, organizational capacity strengthening, and strategic partnerships with community-based organizations."
    },
    impacto_financiero: {
      es: "América del Norte, África Subsahariana",
      en: "North America, Sub-Saharan Africa"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://surdna.org",
    email: "info@surdna.org"
  },
  {
    id: 302,
    name: "Borealis Philanthropy",
    description_es: "Borealis Philanthropy es un intermediario filantrópico que apoya los movimientos de base por la justicia racial, climática y social.",
    description_en: "Borealis Philanthropy is a philanthropic intermediary supporting grassroots movements for racial, climate, and social justice.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Racial, LGTBIQ+, Derechos de las Personas con Discapacidad, Movimientos Ciudadanos",
      en: "Racial Justice, LGBTIQ+, Rights of Persons with Disabilities, Citizen Movements"
    },
    como_trabajan: {
      es: "Gestionan fondos mancomunados, coordinan colaboraciones de donantes, otorgan subvenciones y apoyan la infraestructura del movimiento.",
      en: "They manage pooled funds, coordinate donor collaboratives, provide grantmaking, and support movement infrastructure."
    },
    impacto_financiero: {
      es: "América del Norte, África Subsahariana",
      en: "North America, Sub-Saharan Africa"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Minneapolis, Minnesota, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://borealisphilanthropy.org",
    email: "info@borealisphilanthropy.org"
  },
  {
    id: 303,
    name: "The James Irvine Foundation",
    description_es: "La Fundación James Irvine apoya las oportunidades económicas y cívicas para los californianos a través del desarrollo de la fuerza laboral y el cambio de sistemas inclusivos.",
    description_en: "The James Irvine Foundation supports economic and civic opportunity for Californians through workforce development and inclusive systems change.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Económica, Derechos Laborales, Educación de Calidad",
      en: "Economic Justice, Labor Rights, Quality Education"
    },
    como_trabajan: {
      es: "Proporcionan subvenciones estratégicas, evaluaciones, desarrollo de liderazgo y asociaciones para escalar soluciones probadas.",
      en: "They provide strategic grants, evaluations, leadership development, and partnerships to scale proven solutions."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "San Francisco, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://irvine.org",
    email: "info@irvine.org"
  },
  {
    id: 304,
    name: "Mellon Foundation",
    description_es: "La Fundación Mellon apoya las artes, las humanidades, el patrimonio cultural y la equidad en la educación superior a través de importantes inversiones filantrópicas.",
    description_en: "The Mellon Foundation supports arts, humanities, cultural heritage, and equity in higher education through major philanthropic investments.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Educación de Calidad, Justicia Racial, Justicia de Género, Democracia",
      en: "Quality Education, Racial Justice, Gender Justice, Democracy"
    },
    como_trabajan: {
      es: "Financian instituciones, programas de investigación, becas e iniciativas de colaboración para fortalecer los ecosistemas culturales y académicos.",
      en: "They fund institutions, research programs, fellowships, and collaborative initiatives to strengthen cultural and academic ecosystems."
    },
    impacto_financiero: {
      es: "América del Norte, Europa Occidental",
      en: "North America, Western Europe"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://mellon.org",
    email: "info@mellon.org"
  },
  {
    id: 305,
    name: "Rothschild Foundation",
    description_es: "La Fundación Rothschild apoya el patrimonio cultural, las artes y las iniciativas de inclusión social, particularmente en contextos judíos y europeos.",
    description_en: "The Rothschild Foundation supports cultural heritage, arts, and social inclusion initiatives, particularly within Jewish and European contexts.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales, Educación de Calidad, Innovación Social",
      en: "Natural Resources Conservation, Quality Education, Social Innovation"
    },
    como_trabajan: {
      es: "Proporcionan subvenciones para proyectos, asociaciones institucionales y programas culturales para fortalecer la identidad comunitaria y la preservación del patrimonio.",
      en: "They provide project grants, institutional partnerships, and cultural programs to strengthen community identity and heritage preservation."
    },
    impacto_financiero: {
      es: "América del Norte, Europa Occidental",
      en: "North America, Western Europe"
    },
    country: "United Kingdom",
    country_es: "Reino Unido",
    ciudad: "Waddesdon, Reino Unido",
    continent: "europa",
    latitude: 51.5074,
    longitude: -0.1278,
    website: "https://www.rothschildfoundation.org",
    email: "info@rothschildfoundation.org"
  },
  {
    id: 306,
    name: "Imaginable Futures",
    description_es: "Invierte en emprendedores y sistemas para impulsar el aprendizaje equitativo y la movilidad económica, centrándose en el desarrollo de la primera infancia, las habilidades fundamentales y apoyando a los cuidadores y familias en comunidades marginadas a nivel mundial.",
    description_en: "Invests in entrepreneurs and systems to drive equitable learning and economic mobility, focusing on early childhood development, foundational skills, and supporting caregivers and families in marginalized communities globally.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Educación de Calidad, Innovación Social, Juventud",
      en: "Quality Education, Social Innovation, Youth"
    },
    como_trabajan: {
      es: "Opera como una organización híbrida (subvenciones e inversión de impacto). La financiación (tanto subvenciones como inversiones) es principalmente estratégica y mediante invitación a socios que se ajusten a su modelo específico para el cambio sistémico en los sistemas económicos y de aprendizaje.",
      en: "Operates as a hybrid organization (grants and impact investing). Funding (both grants and investments) is primarily strategic and by invitation to partners that fit their specific model for system change in learning and economic systems."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Redwood City, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://imaginablefutures.com/",
    email: "info@imaginablefutures.org"
  },
  {
    id: 307,
    name: "Reset Fund",
    description_es: "Reset es una organización sin fines de lucro que trabaja para establecer estándares y herramientas para la tecnología responsable, la gobernanza digital ética y la rendición de cuentas.",
    description_en: "Reset is a nonprofit organization working to establish standards and tools for responsible technology, ethical digital governance, and accountability.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Derechos Digitales, Democracia, Gobernanza Global, políticas y rendición de cuentas",
      en: "Digital Rights, Democracy, Gobernanza Global, políticas y rendición de cuentas"
    },
    como_trabajan: {
      es: "Convocan grupos de trabajo de múltiples partes interesadas, producen investigaciones y estándares, e influyen en las políticas y las prácticas de la industria.",
      en: "They convene multi-stakeholder working groups, produce research and standards, and influence policy and industry practices."
    },
    impacto_financiero: {
      es: "América del Norte, Europa Occidental",
      en: "North America, Western Europe"
    },
    country: "United Kingdom",
    country_es: "Reino Unido",
    ciudad: "Londres, Reino Unido",
    continent: "europa",
    latitude: 51.5074,
    longitude: -0.1278,
    website: "https://www.reset.tech",
    email: "info@reset.tech"
  },
  {
    id: 308,
    name: "Women for Women International ",
    description_es: "Women for Women International apoya a las mujeres sobrevivientes de conflictos a través de programas de empoderamiento económico, educación y liderazgo.",
    description_en: "Women for Women International supports women survivors of conflict through economic empowerment, education, and leadership programs.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia de Género, Paz y Resolución de Conflictos, Justicia Económica",
      en: "Gender Justice, Peace and Conflict Resolution, Economic Justice"
    },
    como_trabajan: {
      es: "Proporcionan programas de apoyo integrales que incluyen capacitación vocacional, servicios psicosociales, redes de defensa y apoyo a microempresas.",
      en: "They provide holistic support programs including vocational training, psychosocial services, advocacy networks, and micro-enterprise support."
    },
    impacto_financiero: {
      es: "África Subsahariana, Oriente Medio, Europa Occidental, Asia Oriental",
      en: "Sub-Saharan Africa, Middle East, Western Europe, East Asia"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Washington D.C., EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.womenforwomen.org",
    email: "info@womenforwomen.org"
  },
  {
    id: 309,
    name: "Solidaire Fund",
    description_es: "Solidaires es una federación sindical francesa que aboga por los derechos laborales, la justicia social y la democracia participativa.",
    description_en: "Solidaires is a French trade union federation advocating for labor rights, social justice, and participatory democracy.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Movimientos Ciudadanos, Justicia Racial, Justicia Climática, Justicia Económica",
      en: "Citizen Movements, Racial Justice, Climate Justice, Economic Justice"
    },
    como_trabajan: {
      es: "Participan en la organización sindical, la acción colectiva, la promoción, el apoyo legal y la movilización social.",
      en: "They engage in union organizing, collective action, advocacy, legal support, and social mobilization."
    },
    impacto_financiero: {
      es: "Europa Occidental",
      en: "Western Europe"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "San Francisco, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.solidaires.org",
    email: "contact@solidaires.org"
  },
  {
    id: 310,
    name: "Justice Funders",
    description_es: "Justice Funders es un colectivo de filántropos que trabajan para aumentar los recursos para los movimientos de base que promueven la justicia racial, económica, de género y climática.",
    description_en: "Justice Funders is a collective of philanthropists working to increase resources for grassroots movements advancing racial, economic, gender, and climate justice.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Fortalecimiento de Capacidades Organizacionales, Justicia Económica, Justicia Racial",
      en: "Organizational Capacity Building, Economic Justice, Racial Justice"
    },
    como_trabajan: {
      es: "Operan redes de donantes, fondos mancomunados, iniciativas de investigación y plataformas de estrategias compartidas.",
      en: "They operate donor networks, pooled funds, research initiatives and shared strategy platforms"
    },
    impacto_financiero: {
      es: "América del Norte, Europa Occidental",
      en: "North America, Western Europe"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Oakland, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://justicefunders.org",
    email: "info@justicefunders.org"
  },
  {
    id: 311,
    name: "Decolonizing Wealth Project",
    description_es: "Desafía los modelos filantrópicos tradicionales al promover enfoques reparadores y centrados en la equidad para la riqueza y las donaciones.",
    description_en: "Challenges traditional philanthropic models by promoting equity centered, reparative approaches to wealth anf giving ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Racial, Justicia Económica, Fortalecimiento de Capacidades Organizacionales",
      en: "Racial Justice, Economic Justice, Organizational Capacity Building"
    },
    como_trabajan: {
      es: "Realizan investigaciones, producen a través del liderazgo, desarrollan herramientas e involucran a financiadores para cambiar las prácticas filantrópicas.",
      en: "they conduct research, produce through leadership, develop tools and engage funders to shift philanthropic practices "
    },
    impacto_financiero: {
      es: "América del Norte, Europa Occidental",
      en: "North America, Western Europe"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://decolonizingwealth.com",
    email: "info@decolonizingwealth.com"
  },
  {
    id: 312,
    name: "Conrad N. Hilton Foundation ",
    description_es: "La fundación Hilton apoya causas humanitarias que incluyen agua potable, prevención de personas sin hogar, educación y respuesta a desastres.",
    description_en: "Hilton foundation supports humanitarian causes incluiding safe water, homelessness prevention, education, and disaster response ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Salud Global, Derechos de las Infancias, Socorro en Desastres, Educación de Calidad",
      en: "Global Health, Children's Rights, Socorro en Desastres, Quality Education"
    },
    como_trabajan: {
      es: "Proporcionan subvenciones estratégicas de varios años y asociaciones con organizaciones sin fines de lucro que brindan soluciones escalables.",
      en: "They provide strategic, multi year grants and partnerships with non profits delivering scalable solutions "
    },
    impacto_financiero: {
      es: "América del Norte, África Subsahariana",
      en: "North America, Sub-Saharan Africa"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Westlake Village, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.hiltonfoundation.org",
    email: "info@hiltonfoundation.org"
  },
  {
    id: 313,
    name: "Obama Foundation",
    description_es: "Promueve el compromiso cívico, el liderazgo juvenil y los valores democráticos a través de programas de desarrollo de liderazgo.",
    description_en: "Promotes civic engagement, youth leadership and democratic values through leadership development programs ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Juventud, Participación Ciudadana, Democracia, Liderazgo",
      en: "Youth, Civic Participation, Democracy, Liderazgo"
    },
    como_trabajan: {
      es: "Operan institutos de liderazgo, iniciativas comunitarias y convocatorias globales.",
      en: "they operate leadership institutes, community initiatives and global convenings "
    },
    impacto_financiero: {
      es: "América del Norte, África Subsahariana, Europa Occidental",
      en: "North America, Sub-Saharan Africa, Western Europe"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Chicago, Illinois, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.obama.org",
    email: "info@obama.org"
  },
  {
    id: 314,
    name: "PEAK Grantmaking",
    description_es: "Peak Grantmaking es una organización de membresía profesional que apoya a los donantes con estándares, capacitación y mejores prácticas.",
    description_en: "Peak Grantmaking is a professional membership organization supporting grantmakers with standards, training and best practices ",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Fortalecimiento de Capacidades Organizacionales, Gobernanza Global, políticas y rendición de cuentas",
      en: "Organizational Capacity Building, Gobernanza Global, políticas y rendición de cuentas"
    },
    como_trabajan: {
      es: "Proporcionan programas de aprendizaje, investigación sectorial y marcos de competencias para profesionales de la filantropía.",
      en: "they provide learning programs, sector research, and competency frameworks for philanthropy professionals "
    },
    impacto_financiero: {
      es: "América del Norte, Europa Occidental",
      en: "North America, Western Europe"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Washington D.C., EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.peakgrantmaking.org",
    email: "info@peakgrantmaking.org"
  },
  {
    id: 315,
    name: "CHANGE Philanthropy",
    description_es: "Change Philanthropy promueve la equidad en la filantropía al abogar por una mayor financiación para organizaciones lideradas por BIPOC y soluciones sistémicas.",
    description_en: "Change Philanthropy promotes equity in philanthropy by advocating for increased funding to BIPOC-led organizations and systemic solutions.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Racial, Justicia de Género, LGTBIQ+, Fortalecimiento de Capacidades Organizacionales",
      en: "Racial Justice, Gender Justice, LGBTIQ+, Organizational Capacity Building"
    },
    como_trabajan: {
      es: "Se involucran en investigación, creación de redes, promoción y educación de donantes para cambiar los flujos filantrópicos.",
      en: "They engage in research, network building, advocacy, and donor education to shift philanthropic flows."
    },
    impacto_financiero: {
      es: "América del Norte, Europa Occidental",
      en: "North America, Western Europe"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Washington D.C., EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.changephilanthropy.org",
    email: "info@changephilanthropy.org"
  },
  {
    id: 316,
    name: "Annie E. Casey Foundation ",
    description_es: "La Fundación Annie E. Casey trabaja para mejorar los resultados de los niños y las familias fortaleciendo las oportunidades económicas, la educación y los sistemas comunitarios.",
    description_en: "The Annie E. Casey Foundation works to improve outcomes for children and families by strengthening economic opportunity, education, and community systems.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Derechos de las Infancias, Protección de la Niñez, Juventud, Justicia Económica",
      en: "Children's Rights, Child Protection, Youth, Economic Justice"
    },
    como_trabajan: {
      es: "Financian investigación, herramientas de datos, promoción de políticas y asociaciones estratégicas para reformar los sistemas públicos.",
      en: "They fund research, data tools, policy advocacy, and strategic partnerships to reform public systems."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Baltimore, Maryland, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.aecf.org",
    email: "info@aecf.org"
  },
  {
    id: 317,
    name: "Inside Philanthropy",
    description_es: "Inside Philanthropy es una organización de medios que ofrece análisis e informes en profundidad sobre tendencias filantrópicas, donantes y estrategias de financiación.",
    description_en: "Inside Philanthropy is a media organization providing in-depth analysis and reporting on philanthropic trends, donors, and funding strategies.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Gobernanza Global, políticas y rendición de cuentas, Fortalecimiento de Capacidades Organizacionales",
      en: "Gobernanza Global, políticas y rendición de cuentas, Organizational Capacity Building"
    },
    como_trabajan: {
      es: "Publican informes de investigación, perfiles de donantes, análisis de financiación y recursos de datos para el sector filantrópico.",
      en: "They publish investigative reporting, donor profiles, funding analyses, and data resources for the philanthropy sector."
    },
    impacto_financiero: {
      es: "América del Norte, Europa Occidental",
      en: "North America, Western Europe"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Los Ángeles, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.insidephilanthropy.com",
    email: "info@insidephilanthropy.com"
  },
  {
    id: 318,
    name: "Climate Emergency Collaboration Group",
    description_es: "Facilita y apoya la cooperación entre organizaciones filantrópicas climáticas, gobiernos y sociedad civil, asegurando que estén estratégicamente alineados para aprovechar oportunidades y ofrecer resultados ambiciosos en momentos internacionales críticos como las COP de la CMNUCC.",
    description_en: "Facilitates and supports cooperation between climate philanthropies, governments, and civil society, ensuring they are strategically aligned to seize opportunities and deliver ambitious outcomes at critical international moments like the UNFCCC COPs.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Movimientos Ciudadanos, Transición Energética",
      en: "Climate Justice, Citizen Movements, Energy Transition"
    },
    como_trabajan: {
      es: "No funciona como una fundación que otorga subvenciones directas. Es un proyecto colaborativo y estratégico financiador (patrocinado por Rockefeller Philanthropy Advisors). La financiación se coordina principalmente entre los miembros o se dirige a través de asociaciones/invitaciones estratégicas para resultados de políticas específicas.",
      en: "Does not operate as a direct grant-making foundation. It is a funder collaborative and strategic project (sponsored by Rockefeller Philanthropy Advisors). Funding is primarily coordinated among members or directed via strategic partnerships/invitations for specific policy outcomes."
    },
    impacto_financiero: {
      es: "Todas",
      en: "All regions"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.climatecollaboration.org/",
    email: "info@climateemergencycollaboration.org"
  },
  {
    id: 319,
    name: "Médecins Sans Frontières",
    description_es: "Médicos Sin Fronteras (Médicos Sin Fronteras) es una organización médica humanitaria internacional independiente que brinda atención médica de emergencia a personas afectadas por conflictos armados, epidemias, desastres naturales y exclusión de los servicios de salud.",
    description_en: "Médecins Sans Frontières (Doctors Without Borders) is an independent international medical humanitarian organization that delivers emergency healthcare to people affected by armed conflict, epidemics, natural disasters, and exclusion from health services.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Salud Global, Paz y Resolución de Conflictos, Derechos de Migrantes y Refugiados",
      en: "Global Health, Peace and Conflict Resolution, Rights of Migrants and Refugees"
    },
    como_trabajan: {
      es: "MSF opera hospitales, clínicas y unidades médicas móviles, despliega personal médico local e internacional, suministra medicamentos esenciales y brinda atención de emergencia en contextos de crisis. La organización también participa en la promoción médica documentando emergencias humanitarias y de salud.",
      en: "MSF operates hospitals, clinics, and mobile medical units, deploys international and local medical staff, supplies essential medicines, and provides emergency care in crisis contexts. The organization also engages in medical advocacy by documenting humanitarian and health emergencies."
    },
    impacto_financiero: {
      es: "África Subsahariana, Oriente Medio, Asia Oriental, América Central, América del Sur, Europa Occidental",
      en: "Sub-Saharan Africa, Middle East, East Asia, Central America, South America, Western Europe"
    },
    country: "Suiza (Sede Internacional)",
    country_es: "Suiza (Sede Internacional)",
    ciudad: "Ginebra, Suiza (Sede Internacional)",
    continent: "desconocido",
    latitude: 0,
    longitude: 0,
    website: "https://www.msf.org/",
    email: "contact@msf.org"
  },
  {
    id: 320,
    name: "TOGETHERBAND",
    description_es: "Togetherband es una iniciativa de impacto social que apoya el desarrollo inclusivo, la sostenibilidad y la innovación social conectando comunidades, creativos y socios en torno a causas globales.",
    description_en: "Togetherband is a social impact initiative that supports inclusive development, sustainability, and social innovation by connecting communities, creatives, and partners around global causes.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Innovación Social, Justicia Climática, Salud Global, Educación de Calidad",
      en: "Social Innovation, Climate Justice, Global Health, Quality Education"
    },
    como_trabajan: {
      es: "Trabajan a través de asociaciones, campañas de recaudación de fondos, iniciativas de concientización y apoyo a proyectos liderados por la comunidad, utilizando la narración, la colaboración y la movilización de recursos para generar impacto social y ambiental.",
      en: "They work through partnerships, fundraising campaigns, awareness initiatives, and support for community-led projects, using storytelling, collaboration, and resource mobilization to generate social and environmental impact."
    },
    impacto_financiero: {
      es: "América del Norte, Europa Occidental, América Central",
      en: "North America, Western Europe, Central America"
    },
    country: "United Kingdom",
    country_es: "Reino Unido",
    ciudad: "Londres, Reino Unido",
    continent: "europa",
    latitude: 51.5074,
    longitude: -0.1278,
    website: "https://togetherband.org/",
    email: "togetherfund@bottletop.org"
  },
  {
    id: 321,
    name: "Norman Foster Foundation",
    description_es: "La Fundación Norman Foster es una organización internacional sin fines de lucro dedicada a promover la investigación interdisciplinaria, la educación y el diálogo sobre arquitectura, urbanismo, tecnología y sostenibilidad.",
    description_en: "The Norman Foster Foundation is an international nonprofit organization dedicated to promoting interdisciplinary research, education, and dialogue on architecture, urbanism, technology, and sustainability.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Ciudades Sustentables, Innovación Social, Educación de Calidad",
      en: "Sustainable Cities, Social Innovation, Quality Education"
    },
    como_trabajan: {
      es: "La Fundación desarrolla programas de investigación, becas, exposiciones, publicaciones e iniciativas educativas, fomentando la colaboración entre académicos, profesionales e instituciones para abordar desafíos globales a través del diseño y la innovación.",
      en: "The Foundation develops research programs, fellowships, exhibitions, publications, and educational initiatives, fostering collaboration between academics, practitioners, and institutions to address global challenges through design and innovation."
    },
    impacto_financiero: {
      es: "Europa Occidental, América del Norte, Asia Oriental",
      en: "Western Europe, North America, East Asia"
    },
    country: "Spain",
    country_es: "España",
    ciudad: "Madrid, España",
    continent: "europa",
    latitude: 40.4168,
    longitude: -3.7038,
    website: "https://normanfosterfoundation.org/es/",
    email: "support@normanfosterfoundation.org"
  },
  {
    id: 322,
    name: "Wipro Foundation",
    description_es: "Participa en un trabajo sistémico profundo, significativo y de largo plazo en educación, ecología, salud y respuesta a desastres, asociándose con organizaciones de la sociedad civil (OSC) para empoderar a las comunidades y crear modelos sostenibles en la India.",
    description_en: "Engages in deep, meaningful, and long-term systemic work across education, ecology, health, and disaster response, partnering with Civil Society Organizations (CSOs) to empower communities and create sustainable models in India.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Educación de Calidad, Salud Global, Ciudades Sustentables",
      en: "Quality Education, Global Health, Sustainable Cities"
    },
    como_trabajan: {
      es: "Utiliza un proceso abierto de solicitud de subvenciones en línea (el registro es obligatorio). Las solicitudes pasan por múltiples rondas de discusiones, visitas de campo y diligencia debida. Se centran en organizaciones con operaciones comprobadas y presencia comunitaria.",
      en: "Utilizes an open, online grant application process (registration is mandatory). Applications go through multiple rounds of discussions, field visits, and due diligence. They focus on organizations with proven operations and community presence."
    },
    impacto_financiero: {
      es: "Asia Oriental (India)",
      en: "Asia Oriental (India)"
    },
    country: "India",
    country_es: "India",
    ciudad: "Bangalore, India",
    continent: "asia",
    latitude: 28.6139,
    longitude: 77.209,
    website: "https://www.climatecollaboration.org/",
    email: "info@wiprofoundation.org"
  },
  {
    id: 323,
    name: "Brain & Behavior Research Foundation",
    description_es: "La Brain & Behavior Research Foundation es una organización filantrópica que financia investigaciones científicas para comprender mejor las causas de las enfermedades mentales y desarrollar tratamientos mejorados para los trastornos psiquiátricos y neurológicos.",
    description_en: "The Brain & Behavior Research Foundation is a philanthropic organization that funds scientific research to better understand the causes of mental illness and to develop improved treatments for psychiatric and neurological disorders.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Salud Global, Innovación Social",
      en: "Global Health, Social Innovation"
    },
    como_trabajan: {
      es: "Otorgan subvenciones competitivas a científicos establecidos y que inician su carrera, apoyan proyectos de investigación revisados ​​por pares y promueven la colaboración y difusión de hallazgos científicos en la investigación de salud mental.",
      en: "They award competitive grants to early-career and established scientists, support peer-reviewed research projects, and promote collaboration and dissemination of scientific findings in mental health research."
    },
    impacto_financiero: {
      es: "América del Norte, Europa Occidental",
      en: "North America, Western Europe"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.bbrfoundation.org",
    email: "info@bbrfoundation.org"
  },
  {
    id: 324,
    name: "Trafigura Foundation",
    description_es: "La Fundación Trafigura es el brazo filantrópico del Grupo Trafigura, que apoya iniciativas de desarrollo social, educativo, ambiental y económico en comunidades afectadas por las cadenas de suministro globales.",
    description_en: "The Trafigura Foundation is the philanthropic arm of the Trafigura Group, supporting social, educational, environmental, and economic development initiatives in communities affected by global supply chains.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Derechos Laborales, Economía Circular, Salud Global",
      en: "Labor Rights, Circular Economy, Global Health"
    },
    como_trabajan: {
      es: "Proporcionan subvenciones, asociaciones de proyectos y apoyo para el desarrollo de capacidades a organizaciones locales e internacionales que implementan programas en educación, medios de vida, salud y sostenibilidad ambiental.",
      en: "They provide grant funding, project partnerships, and capacity-building support to local and international organizations implementing programs in education, livelihoods, health, and environmental sustainability."
    },
    impacto_financiero: {
      es: "África Subsahariana, América del Sur, Asia Oriental, Europa Occidental",
      en: "Sub-Saharan Africa, South America, East Asia, Western Europe"
    },
    country: "Switzerland",
    country_es: "Suiza",
    ciudad: "Ginebra, Suiza",
    continent: "europa",
    latitude: 46.948,
    longitude: 7.4474,
    website: "https://www.trafigurafoundation.org",
    email: "info@trafigurafoundation.org"
  },
  {
    id: 325,
    name: "Beyond Fossil Fuels",
    description_es: "Impulsa una transición justa hacia un sector energético europeo libre de fósiles y totalmente basado en energías renovables para 2035, movilizando una coalición de organizaciones de la sociedad civil para poner fin al uso de carbón y gas fósil.",
    description_en: "Drives a just transition to a fossil-free, fully renewables-based European power sector by 2035 by mobilizing a coalition of civil society organizations to end the use of coal and fossil gas.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Transición Energética, Justicia Climática, Movimientos Ciudadanos",
      en: "Energy Transition, Climate Justice, Citizen Movements"
    },
    como_trabajan: {
      es: "No es un organismo que otorga subvenciones, sino una coalición y una campaña independientes. Su función es la coordinación, la promoción y la movilización. Los fondos se utilizan para campañas y apoyo a coaliciones, no para subvenciones externas abiertas.",
      en: "It is not a grant-making body but an independent coalition and campaign. Its role is coordination, advocacy, and mobilization. Funds are used for campaigns and coalition support, not for open external grants."
    },
    impacto_financiero: {
      es: "Europa Occidental, Europa del Este (Enfoque en el sector eléctrico europeo)",
      en: "Western Europe, Europa del Este (Enfoque en el sector eléctrico europeo)"
    },
    country: "Germany",
    country_es: "Alemania",
    ciudad: "Berlín, Alemania",
    continent: "europa",
    latitude: 52.52,
    longitude: 13.405,
    website: "https://beyondfossilfuels.org/",
    email: "info@beyondfossilfuels.org"
  },
  {
    id: 326,
    name: "Shockwave Foundation",
    description_es: "Impulsa la innovación audaz para la resiliencia climática al empoderar a las comunidades a través de inversiones estratégicas mediante la fundación de semillas en proyectos estratégicos que pueden proporcionar un cambio mayor.",
    description_en: "Fuels bold innovation for climate resilience by empowering communities through strategic investments  by the foundation of seeds in strategic projects that can provide a bigger change.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Soberanía Alimentaria, Conservación de Recursos Naturales",
      en: "Climate Justice, Food Sovereignty, Natural Resources Conservation"
    },
    como_trabajan: {
      es: "La financiación en las primeras etapas críticas de los proyectos es crucial para el desarrollo de las economías de los países del tercer mundo. El financiamiento proviene de inversiones relacionadas con el programa y subvenciones filantrópicas, que van desde $25 000 a $1 000 000 de dólares.",
      en: "Funding at the critical early stages of projects is crucial for developing the economies of third-world countries. The funding comes from program-related investments and philanthropic grants—ranging from $25,000 to $1,000,000 USD"
    },
    impacto_financiero: {
      es: "America del Norte, América Central, América del Sur, Europa Occidental, Europa del Este, Asia Central, Asia Oriental, África Susahariana, África del Norte, Oceanía y Oriente Medio",
      en: "America del Norte, Central America, South America, Western Europe, Eastern Europe, Central Asia, East Asia, África Susahariana, North Africa, Oceanía y Oriente Medio"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Palo Alto, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.shockwave.org",
    email: "N/I"
  },
  {
    id: 327,
    name: "Mastercard Foundation",
    description_es: "Su objetivo en África es permitir, para 2030, que aproximadamente 30 millones de jóvenes, con especial atención a los refugiados y las mujeres jóvenes, accedan a un trabajo digno. En Canadá, su objetivo es permitir que 100.000 indígenas accedan a la educación postsecundaria y reforzar el sistema educativo y laboral.",
    description_en: "Their goal in Africa is to enable, by 2030, approximately 30 million young people, with a focus on refugees and young women, to access dignified work. In Canada, their goal is to enable 100,000 indigenous people to access post-secondary education and reinforce the education and employment system.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Juventud, Justicia Económica, Educación de Calidad, Innovación Social",
      en: "Youth, Economic Justice, Quality Education, Social Innovation"
    },
    como_trabajan: {
      es: "Trabajar colaborativamente para implementar programas ajustados a cada país y sus necesidades conectando la demanda y los mercados laborales a través de la búsqueda de empleo y la educación. Inversión a través de asociaciones.",
      en: "Work collaborative to implement programs adjusted to each country and its needs by connecting demand and work markets through job seekers and education. Investment through partnerships."
    },
    impacto_financiero: {
      es: "América del Norte, África Subsahariana, África del Norte",
      en: "North America, Sub-Saharan Africa, North Africa"
    },
    country: "Canada",
    country_es: "Canadá",
    ciudad: "Toronto, Canadá",
    continent: "america",
    latitude: 45.4215,
    longitude: -75.6972,
    website: "https://mastercardfdn.org",
    email: "econstantine@mastercardfdn.org"
  },
  {
    id: 328,
    name: "Eleanor Crook Foundation",
    description_es: "Inversiones para prevenir y ayudar a la desnutrición. Inversión en investigación para crear soluciones mejoradas",
    description_en: "Investments to prevent and help malnutrition. Investment in research to create improved solutions",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Salud Global (Nutrición), Soberanía Alimentaria, Innovación Social",
      en: "Salud Global (Nutrición), Food Sovereignty, Social Innovation"
    },
    como_trabajan: {
      es: "Asociarse con gobiernos y otorgar subvenciones",
      en: "Partner with governments, grantmaking"
    },
    impacto_financiero: {
      es: "América del Norte, África Subsahariana, África del Norte, Asia Central y Asia Oriental",
      en: "North America, Sub-Saharan Africa, North Africa, Asia Central y Asia Oriental"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Washington D.C., EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://eleanorcrookfoundation.org",
    email: "info@eleanorcrookfoundation.org"
  },
  {
    id: 329,
    name: "The Global Fund",
    description_es: "Invertir hasta 5 mil millones de dólares al año para derrotar al VIH, la tuberculosis y la malaria. Fortalecer el sistema de salud en unos 100 países, el impacto es mundial e involucra a gobiernos, trabajadores de la salud y civiles.",
    description_en: "Invest up to $5 billion a year to defeat HIV, TB, and malaria. Strengthen the health system in about 100 countries, the impact is worldwide and involves governments, health workers and civilians.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Salud Global, Justicia de Género, Derechos de las Personas con Discapacidad",
      en: "Global Health, Gender Justice, Rights of Persons with Disabilities"
    },
    como_trabajan: {
      es: "Subvenciones y asociaciones de salud mundial",
      en: "Global health grants, partnerships"
    },
    impacto_financiero: {
      es: "America del Norte, América Central, América del Sur, Europa Occidental, Europa del Este, Asia Central, Asia Oriental, África Susahariana, África del Norte, Oceanía y Oriente Medio",
      en: "America del Norte, Central America, South America, Western Europe, Eastern Europe, Central Asia, East Asia, África Susahariana, North Africa, Oceanía y Oriente Medio"
    },
    country: "Switzerland",
    country_es: "Suiza",
    ciudad: "Ginebra, Suiza",
    continent: "europa",
    latitude: 46.948,
    longitude: 7.4474,
    website: "https://www.theglobalfund.org",
    email: "info@theglobalfund.org"
  },
  {
    id: 330,
    name: "Bezos Earth Fund",
    description_es: "Inversiones para equilibrar los problemas del mundo, como la seguridad alimentaria, la deforestación, la contaminación de los océanos y otros, mediante la creación de soluciones donde un medio ambiente saludable y la mejora de la economía puedan ir de la mano.",
    description_en: "Investments to balance the world's problems, such as food security, deforestation, ocean contamination, and others, by creating solutions where a healthy environment and the improvement of the economy may work hand in hand.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Conservación de Recursos Naturales, Soberanía Alimentaria, Transición Energética",
      en: "Climate Justice, Natural Resources Conservation, Food Sovereignty, Energy Transition"
    },
    como_trabajan: {
      es: "Subvenciones para proyectos específicos, Filantropía, Dotación privada, personal",
      en: "Grants for specific projects, Philanthropy, Private, personal endowment"
    },
    impacto_financiero: {
      es: "America del Norte, América Central, América del Sur, Europa Occidental, Europa del Este, Asia Central, Asia Oriental, África Susahariana, África del Norte, Oceanía y Oriente Medio",
      en: "America del Norte, Central America, South America, Western Europe, Eastern Europe, Central Asia, East Asia, África Susahariana, North Africa, Oceanía y Oriente Medio"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Washington D.C., EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.bezosearthfund.org",
    email: "N/I"
  },
  {
    id: 331,
    name: "High Tide Foundation",
    description_es: "Una organización benéfica independiente para jóvenes de entre 11 y 16 años, que sirve como conexión entre el espacio de trabajo y los candidatos, a través de las escuelas secundarias.",
    description_en: "An independent charity for young people between the ages of 11-16, which is useful as a connection between the workspace and the candidates, through secondary schools.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Transición Energética, Conservación de Recursos Naturales",
      en: "Climate Justice, Energy Transition, Natural Resources Conservation"
    },
    como_trabajan: {
      es: "Alianzas con diferentes organizaciones.",
      en: "Partnerships with different organizations"
    },
    impacto_financiero: {
      es: "America del Norte, América Central, América del Sur, Europa Occidental, Europa del Este, Asia Central, Asia Oriental, África Susahariana, África del Norte, Oceanía y Oriente Medio",
      en: "America del Norte, Central America, South America, Western Europe, Eastern Europe, Central Asia, East Asia, África Susahariana, North Africa, Oceanía y Oriente Medio"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "San Francisco, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.hightidefoundation.co.uk/",
    email: "N/I"
  },
  {
    id: 332,
    name: "Threshold Philanthropy",
    description_es: "Compuesto por una membresía multigeneracional de individuos que utilizan sus propios recursos para lograr objetivos que pueden mejorar el mundo.",
    description_en: "Compound by a multi-generational membership of individual who use their own resources to objectives that can improve the world. ",
    tipo_de_org: {
      es: "Organización Comunitaria",
      en: "Community Organization"
    },
    enfoque: {
      es: "Movimientos Ciudadanos, Justicia Climática, Justicia Racial",
      en: "Citizen Movements, Climate Justice, Racial Justice"
    },
    como_trabajan: {
      es: "Donaciones y filantrofia",
      en: "Donations and Philantrophy"
    },
    impacto_financiero: {
      es: "America del Norte, América Central, América del Sur, Europa Occidental, Europa del Este, Asia Central, Asia Oriental, África Susahariana, África del Norte, Oceanía y Oriente Medio",
      en: "America del Norte, Central America, South America, Western Europe, Eastern Europe, Central Asia, East Asia, África Susahariana, North Africa, Oceanía y Oriente Medio"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://thresholdphilanthropy.org",
    email: "N/I"
  },
  {
    id: 333,
    name: "Walter & Elise Haas Fund",
    description_es: "Una fundación que brinda inversión a diferentes áreas de la educación, como las artes y la seguridad económica.",
    description_en: "A foundation that provides investment to different areas of education, such as arts, and economic security.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Democracia, Justicia Económica, Educación de Calidad",
      en: "Democracy, Economic Justice, Quality Education"
    },
    como_trabajan: {
      es: "Fundación familiar, dotación personal.",
      en: "Family foundation, personal endowment"
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "San Francisco, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://haassr.org/",
    email: "info@haassr.org"
  },
  {
    id: 334,
    name: "Børns Vilkår",
    description_es: "El objetivo de esta organización es proteger los derechos y el bienestar de los niños en Dinamarca.",
    description_en: "This organization's goal is to protect the rights and well-being of children in Denmark.",
    tipo_de_org: {
      es: "Organizaciones No Gubernamentales",
      en: "Non-Governmental Organization"
    },
    enfoque: {
      es: "Protección de la Niñez, Derechos de las Infancias, Juventud",
      en: "Child Protection, Children's Rights, Youth"
    },
    como_trabajan: {
      es: "Subvenciones, recaudación de fondos públicos y donaciones",
      en: "Grants, public fundraising and donations"
    },
    impacto_financiero: {
      es: "Europa Occidental, Europa del Este",
      en: "Western Europe, Eastern Europe"
    },
    country: "Denmark",
    country_es: "Dinamarca",
    ciudad: "Valby (Copenhague), Dinamarca",
    continent: "europa",
    latitude: 55.6761,
    longitude: 12.5683,
    website: "https://bornsvilkar.dk",
    email: "bvillkaar@bvillkaar.dk "
  },
  {
    id: 335,
    name: "1% for the Planet ",
    description_es: "Conecta diferentes empresas y trabajadores para aportar el 1% de su propio salario a causas sociales, normalmente relacionadas con el medio ambiente.",
    description_en: "Connects different businesses and workers to provide 1% of their own salary to social causes, usually environmentally related.",
    tipo_de_org: {
      es: "Movimiento Social",
      en: "Social Movement"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales, Justicia Climática, Economía Circular",
      en: "Natural Resources Conservation, Climate Justice, Circular Economy"
    },
    como_trabajan: {
      es: "Donaciones y membresías",
      en: "Donations and memberships"
    },
    impacto_financiero: {
      es: "America del Norte, América Central, América del Sur, Europa Occidental, Europa del Este, Asia Central, Asia Oriental, África Susahariana, África del Norte, Oceanía y Oriente Medio",
      en: "America del Norte, Central America, South America, Western Europe, Eastern Europe, Central Asia, East Asia, África Susahariana, North Africa, Oceanía y Oriente Medio"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Burlington, Vermont, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.onepercentfortheplanet.org",
    email: "info@onepercentfortheplanet.org"
  },
  {
    id: 336,
    name: "Walton Family Foundation ",
    description_es: "Trabajan apoyando causas relacionadas con la protección del agua, que reduce la contaminación de océanos y ríos, y la mejora de la educación en las comunidades de Arkansas y el Delta.",
    description_en: "They work supporting causes related to the protection of water, which reduces ocean and river contamination, and the improvement of education in the communities of Arkansas and the Delta.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales, Educación de Calidad, Ciudades Sustentables",
      en: "Natural Resources Conservation, Quality Education, Sustainable Cities"
    },
    como_trabajan: {
      es: "Dotación personal",
      en: "Personal edowment"
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Bentonville, Arkansas, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.waltonfamilyfoundation.org",
    email: "info@wffmail.com"
  },
  {
    id: 337,
    name: "Mission 44",
    description_es: "Llevar apoyo a las generaciones jóvenes de comunidades con más problemas sociales y económicos, a través de la educación y el empleo.",
    description_en: "Bring support to young generations in communities with more social and economic problems, through education and employment.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Juventud, Justicia Racial, Educación de Calidad",
      en: "Youth, Racial Justice, Quality Education"
    },
    como_trabajan: {
      es: "Asociaciones, Capital propio",
      en: "Partnerships, Own capital"
    },
    impacto_financiero: {
      es: "Europa Occidental, Europa del Este",
      en: "Western Europe, Eastern Europe"
    },
    country: "United Kingdom",
    country_es: "Reino Unido",
    ciudad: "Londres, Reino Unido",
    continent: "europa",
    latitude: 51.5074,
    longitude: -0.1278,
    website: "https://mission44.org",
    email: "N/I"
  },
  {
    id: 338,
    name: "Realdania Fund",
    description_es: "Su primer enfoque es Dinamarca, la idea es mejorar la vida a través de la construcción del medio ambiente.",
    description_en: "Its first focus is Denmark, the idea is to improve life through the built of environment",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Ciudades Sustentables, Innovación Social, Salud Global",
      en: "Sustainable Cities, Social Innovation, Global Health"
    },
    como_trabajan: {
      es: "Filantrófica y dotación",
      en: "Philantrophic and endowment"
    },
    impacto_financiero: {
      es: "Europa Occidental, Europa del Este",
      en: "Western Europe, Eastern Europe"
    },
    country: "Denmark",
    country_es: "Dinamarca",
    ciudad: "Copenhague, Dinamarca",
    continent: "europa",
    latitude: 55.6761,
    longitude: 12.5683,
    website: "https://realdania.org",
    email: "realdania@realdania.dk"
  },
  {
    id: 339,
    name: "Latino Community Foundation",
    description_es: "Su principal objetivo consiste en construir mejores relaciones de poder político o económico entre la comunidad latina y los estadounidenses en Estados Unidos.",
    description_en: "Its main objective consists of building better relationships for political or economic power between the Latino community and Americans in the United States.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Participación Ciudadana, Justicia Económica, Juventud, Movimientos Ciudadanos",
      en: "Civic Participation, Economic Justice, Youth, Citizen Movements"
    },
    como_trabajan: {
      es: "Donaciones, filantropía, subvenciones corporativas.",
      en: "Donations, philanthropy, corporate grants"
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "San Francisco, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://latinocf.org",
    email: "info@latinocf.org"
  },
  {
    id: 340,
    name: "Jacobs Foundation",
    description_es: "Inversión en educación de los jóvenes, mediante la financiación de investigaciones dirigidas a los niños y jóvenes.",
    description_en: "Investment in education for young people, by funding research with the objective of children and young people.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Juventud, Educación de Calidad, Innovación Social",
      en: "Youth, Quality Education, Social Innovation"
    },
    como_trabajan: {
      es: "Dotación, financiada con los bienes del fundador.",
      en: "Endowment, financed by  the assets of the founder"
    },
    impacto_financiero: {
      es: "America del Norte, América Central, América del Sur, Europa Occidental, Europa del Este, Asia Central, Asia Oriental, África Susahariana, África del Norte, Oceanía y Oriente Medio",
      en: "America del Norte, Central America, South America, Western Europe, Eastern Europe, Central Asia, East Asia, África Susahariana, North Africa, Oceanía y Oriente Medio"
    },
    country: "Switzerland",
    country_es: "Suiza",
    ciudad: "Zúrich, Suiza",
    continent: "europa",
    latitude: 46.948,
    longitude: 7.4474,
    website: "https://jacobsfoundation.org",
    email: "info@jacobsfoundation.org"
  },
  {
    id: 341,
    name: "Solthis Fund",
    description_es: "La estrategia principal es una atención de calidad para todos, apoyando la salud pública.",
    description_en: "The main strategy is quality care for all, throughout supporting public health",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Salud Global, Fortalecimiento de Capacidades Organizacionales",
      en: "Global Health, Organizational Capacity Building"
    },
    como_trabajan: {
      es: "Donaciones de donantes institucionales y recaudación de fondos privados, subvenciones.",
      en: "Donations from institutional donors and private fundraising, grants"
    },
    impacto_financiero: {
      es: "América del Norte, África Subsahariana, África del Norte, Asia Central y Asia Oriental",
      en: "North America, Sub-Saharan Africa, North Africa, Asia Central y Asia Oriental"
    },
    country: "France",
    country_es: "Francia",
    ciudad: "París, Francia",
    continent: "europa",
    latitude: 48.8566,
    longitude: 2.3522,
    website: "https://www.solthis.org",
    email: "contact@solthis.org"
  },
  {
    id: 342,
    name: "Global Innovation Fund ",
    description_es: "Invertir en investigaciones que puedan mejorar a las personas más pobres, a través de soluciones que sean fácilmente accesibles.",
    description_en: "Invest in research that can improve the poorest people, through solutions that are easily reachable.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Innovación Social, Justicia Económica, Salud Global",
      en: "Social Innovation, Economic Justice, Global Health"
    },
    como_trabajan: {
      es: "Financiado por múltiples gobiernos y fundaciones privadas.",
      en: "Funded by multiple governments and private foundations"
    },
    impacto_financiero: {
      es: "America del Norte, América Central, América del Sur, Europa Occidental, Europa del Este, Asia Central, Asia Oriental, África Susahariana, África del Norte, Oceanía y Oriente Medio",
      en: "America del Norte, Central America, South America, Western Europe, Eastern Europe, Central Asia, East Asia, África Susahariana, North Africa, Oceanía y Oriente Medio"
    },
    country: "United Kingdom",
    country_es: "Reino Unido",
    ciudad: "Londres, Reino Unido",
    continent: "europa",
    latitude: 51.5074,
    longitude: -0.1278,
    website: "https://www.globalinnovation.fund",
    email: "info@globalinnovation.fund"
  },
  {
    id: 343,
    name: "Open Philanthropy",
    description_es: "Financiar diferentes tipos de proyectos donde el resultado tenga el impacto más efectivo, como causas relacionadas con la salud global y el bienestar animal.",
    description_en: "Fund different kinds of projects where the outcome has the most effective impact like causes related to global health, animal welfare",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Salud Global, Gobernanza Global, políticas y rendición de cuentas, Innovación Social",
      en: "Global Health, Gobernanza Global, políticas y rendición de cuentas, Social Innovation"
    },
    como_trabajan: {
      es: "Dotación del fundador (patrimonio personal de los propietarios)",
      en: "Founder's endowment (personal wealth of the owners)"
    },
    impacto_financiero: {
      es: "America del Norte, América Central, América del Sur, Europa Occidental, Europa del Este, Asia Central, Asia Oriental, África Susahariana, África del Norte, Oceanía y Oriente Medio",
      en: "America del Norte, Central America, South America, Western Europe, Eastern Europe, Central Asia, East Asia, África Susahariana, North Africa, Oceanía y Oriente Medio"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "San Francisco, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.openphilanthropy.org",
    email: "info@openphilanthropy.org"
  },
  {
    id: 344,
    name: "Van Leer Foundation ",
    description_es: "Se especializa en apoyar las primeras etapas del desarrollo infantil, generalmente desde el nacimiento hasta los ocho años.",
    description_en: "It specializes in supporting the early stages of childhood development, usually between they are born and up to eight years old.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Derechos de las Infancias, Ciudades Sustentables, Educación de Calidad",
      en: "Children's Rights, Sustainable Cities, Quality Education"
    },
    como_trabajan: {
      es: "Dotación de sus propietarios",
      en: "Endowment from it's owners"
    },
    impacto_financiero: {
      es: "America del Norte, América Central, América del Sur, Europa Occidental, Europa del Este, Asia Central, Asia Oriental, África Susahariana, África del Norte, Oceanía y Oriente Medio",
      en: "America del Norte, Central America, South America, Western Europe, Eastern Europe, Central Asia, East Asia, África Susahariana, North Africa, Oceanía y Oriente Medio"
    },
    country: "Netherlands",
    country_es: "Países Bajos",
    ciudad: "La Haya, Países Bajos",
    continent: "europa",
    latitude: 52.3676,
    longitude: 4.9041,
    website: "https://vanleerfoundation.org/",
    email: "info@vanleerfoundation.org"
  },
  {
    id: 345,
    name: "The Commonwealth Fund",
    description_es: "Es una fundación privada que aporta recursos para investigaciones independientes o relacionadas con políticas de salud, para mejorar el sistema de salud.",
    description_en: "It's a private foundation that provides resources for research that are independent or related to health policies, to improve the system of healthcare.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Salud Global, Gobernanza Global, políticas y rendición de cuentas",
      en: "Global Health, Gobernanza Global, políticas y rendición de cuentas"
    },
    como_trabajan: {
      es: "Becas y dotación personal.",
      en: "Grants and personal endowment."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.commonwealthfund.org",
    email: "info@cmwf.org"
  },
  {
    id: 346,
    name: "Mary Fonden Foundation",
    description_es: "Su primera donación proviene de la corona real de la princesa María y se centra en el aislamiento social, el acoso y la violencia doméstica.",
    description_en: "Its first donation comes from the royal crown by Princess Mary, focusing on social isolation, bullying, and domestic violence.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Salud Global, Inclusión Social, Educación de Calidad",
      en: "Global Health, Inclusión Social, Quality Education"
    },
    como_trabajan: {
      es: "Subvenciones de empresas danesas y organizaciones privadas.",
      en: "Grants from Danish companies and private organizations"
    },
    impacto_financiero: {
      es: "Europa Occidental, Europa del Este",
      en: "Western Europe, Eastern Europe"
    },
    country: "Denmark",
    country_es: "Dinamarca",
    ciudad: "Copenhague, Dinamarca",
    continent: "europa",
    latitude: 55.6761,
    longitude: 12.5683,
    website: "https://maryfonden.dk",
    email: "N/I"
  },
  {
    id: 347,
    name: "Paul Ramsay Foundation",
    description_es: "Su principal objetivo se centra en romper los ciclos de desventaja apoyando la educación, la inclusión social y el cambio sistémico para las comunidades vulnerables.",
    description_en: "Its main objective focuses on breaking cycles of disadvantage by supporting education, social inclusion, and systemic change for vulnerable communities.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Económica, Educación de Calidad, Salud Global, Fortalecimiento de Capacidades Organizacionales",
      en: "Economic Justice, Quality Education, Global Health, Organizational Capacity Building"
    },
    como_trabajan: {
      es: "Financiamiento filantrópico, asociaciones y subvenciones.",
      en: "Philanthropic funding, partnerships and grants."
    },
    impacto_financiero: {
      es: "Oceanía",
      en: "Oceania"
    },
    country: "Australia",
    country_es: "Australia",
    ciudad: "Sídney, Australia",
    continent: "oceania",
    latitude: -35.2809,
    longitude: 149.13,
    website: "https://www.paulramsayfoundation.org.au/",
    email: "info@paulramsayfoundation.org.au"
  },
  {
    id: 348,
    name: "The LEGO Foundation",
    description_es: "Su enfoque principal es mejorar los resultados del aprendizaje de los niños mediante la promoción del aprendizaje a través del juego, particularmente en la primera infancia y para las comunidades vulnerables.",
    description_en: "Its main focus is on improving learning outcomes for children by promoting learning through play, particularly in early childhood and for vulnerable communities.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Educación de Calidad, Derechos de las Infancias, Juventud, Innovación Social",
      en: "Quality Education, Children's Rights, Youth, Social Innovation"
    },
    como_trabajan: {
      es: "Inversiones estratégicas, asociaciones de investigación e iniciativas educativas",
      en: "Strategic investments, research partnerships, and education initiatives"
    },
    impacto_financiero: {
      es: "America del Norte, América Central, América del Sur, Europa Occidental, Europa del Este, Asia Central, Asia Oriental, África Susahariana, África del Norte, Oceanía y Oriente Medio",
      en: "America del Norte, Central America, South America, Western Europe, Eastern Europe, Central Asia, East Asia, África Susahariana, North Africa, Oceanía y Oriente Medio"
    },
    country: "Denmark",
    country_es: "Dinamarca",
    ciudad: "Billund, Dinamarca",
    continent: "europa",
    latitude: 55.6761,
    longitude: 12.5683,
    website: "https://learningthroughplay.com/",
    email: "info@LEGOFoundation.com"
  },
  {
    id: 349,
    name: "Echidna Giving Foundation",
    description_es: "Una fundación privada dedicada a promover la equidad educativa, con un fuerte enfoque en mejorar las oportunidades de aprendizaje para estudiantes desatendidos a través de cambios sistémicos y a nivel de políticas.",
    description_en: "A private foundation dedicated to advancing education equity, with a strong focus on improving learning opportunities for underserved students through systemic and policy-level change.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia de Género, Educación de Calidad, Juventud",
      en: "Gender Justice, Quality Education, Youth"
    },
    como_trabajan: {
      es: "Financiamiento educativo específico, asociaciones centradas en políticas y apoyo a iniciativas de investigación y promoción.",
      en: "Targeted education funding, policy-focused partnerships, and support for research and advocacy initiatives."
    },
    impacto_financiero: {
      es: "America del Norte, América Central, América del Sur, Europa Occidental, Europa del Este, Asia Central, Asia Oriental, África Susahariana, África del Norte, Oceanía y Oriente Medio",
      en: "America del Norte, Central America, South America, Western Europe, Eastern Europe, Central Asia, East Asia, África Susahariana, North Africa, Oceanía y Oriente Medio"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "San Francisco, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.echidnagiving.org",
    email: "N/I"
  },
  {
    id: 350,
    name: "Stiftung Mercator Schweiz",
    description_es: "Promueve una sociedad abierta y cohesionada apoyando iniciativas en educación, democracia, participación y sostenibilidad ambiental, con un fuerte enfoque en el impacto sistémico.",
    description_en: "Promotes an open and cohesive society by supporting initiatives in education, democracy, participation, and environmental sustainability, with a strong focus on systemic impact.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Democracia, Educación de Calidad, Participación Ciudadana",
      en: "Climate Justice, Democracy, Quality Education, Civic Participation"
    },
    como_trabajan: {
      es: "Financiamiento basado en programas, asociaciones intersectoriales y apoyo a la investigación, el diálogo y las iniciativas orientadas a políticas.",
      en: "Program-based funding, cross-sector partnerships, and support for research, dialogue, and policy-oriented initiatives."
    },
    impacto_financiero: {
      es: "Europa Occidental, Europa del Este",
      en: "Western Europe, Eastern Europe"
    },
    country: "Switzerland",
    country_es: "Suiza",
    ciudad: "Zúrich, Suiza",
    continent: "europa",
    latitude: 46.948,
    longitude: 7.4474,
    website: "https://www.stiftung-mercator.ch",
    email: "info@stiftung-mercator.ch"
  },
  {
    id: 351,
    name: "SELCO Foundation",
    description_es: "Una fundación con sede en la India centrada en promover medios de vida sostenibles y equidad social al permitir el acceso a soluciones descentralizadas de energía renovable para comunidades desatendidas.",
    description_en: "An India-based foundation focused on advancing sustainable livelihoods and social equity by enabling access to decentralized renewable energy solutions for underserved communities.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Transición Energética, Innovación Social, Justicia Económica, Ciudades Sustentables",
      en: "Energy Transition, Social Innovation, Economic Justice, Sustainable Cities"
    },
    como_trabajan: {
      es: "Apoyo a empresas sociales, construcción de ecosistemas y modelos de financiación para soluciones inclusivas de energía limpia.",
      en: "Support for social enterprises, ecosystem building, and financing models for inclusive clean energy solutions."
    },
    impacto_financiero: {
      es: "Asia Central, Asia Oriental",
      en: "Central Asia, East Asia"
    },
    country: "India",
    country_es: "India",
    ciudad: "Bangalore, India",
    continent: "asia",
    latitude: 28.6139,
    longitude: 77.209,
    website: "https://selcofoundation.org/",
    email: "contact@selcofoundation.org"
  },
  {
    id: 352,
    name: "GAIA Impact Fund",
    description_es: "Un fondo de inversión de impacto enfocado en abordar desafíos sociales y ambientales a través de finanzas sostenibles.",
    description_en: "An impact investment fund focused on addressing social and environmental challenges through sustainable finance.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Transición Energética, Justicia Climática, Innovación Social",
      en: "Energy Transition, Climate Justice, Social Innovation"
    },
    como_trabajan: {
      es: "Inversión de impacto, financiación combinada y capital alineados con resultados sociales y ambientales medibles.",
      en: "Impact investing, blended finance, and capital aligned with measurable social and environmental outcomes."
    },
    impacto_financiero: {
      es: "África Subsahariana, África del Norte",
      en: "Sub-Saharan Africa, North Africa"
    },
    country: "France",
    country_es: "Francia",
    ciudad: "París, Francia",
    continent: "europa",
    latitude: 48.8566,
    longitude: 2.3522,
    website: "https://gaiaimpact.com/en/",
    email: "contact@gaia-impact.com"
  },
  {
    id: 353,
    name: " Global Energy Alliance for People and Planet",
    description_es: "Una alianza global centrada en acelerar la transición hacia la energía limpia para apoyar los objetivos climáticos y de desarrollo en las economías emergentes.",
    description_en: "A global alliance focused on accelerating the transition to clean energy to support development and climate goals in emerging economies.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Transición Energética, Justicia Climática, Gobernanza Global, políticas y rendición de cuentas",
      en: "Energy Transition, Climate Justice, Gobernanza Global, políticas y rendición de cuentas"
    },
    como_trabajan: {
      es: "Financiamiento combinado, asociaciones público-privadas y programas de energía limpia a gran escala.",
      en: "Blended finance, public-private partnerships, and large-scale clean energy programs."
    },
    impacto_financiero: {
      es: "América del Norte. América Central, América del Sur, Asia Central, Asia Oriental, África Subsahariana ,África del Norte ",
      en: "América del Norte. América Central, South America, Central Asia, East Asia, Sub-Saharan Africa, North Africa"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://energyalliance.org/",
    email: "info@globalenergyalliance.org"
  },
  {
    id: 354,
    name: "Shell Foundation",
    description_es: "Una fundación independiente centrada en apoyar medios de vida sostenibles y el desarrollo económico inclusivo en comunidades de bajos ingresos.",
    description_en: "An independent foundation focused on supporting sustainable livelihoods and inclusive economic development in low-income communities.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Transición Energética, Justicia Económica, Ciudades Sustentables, Innovación Social",
      en: "Energy Transition, Economic Justice, Sustainable Cities, Social Innovation"
    },
    como_trabajan: {
      es: "Apoyo a soluciones basadas en el mercado, asociaciones con empresas y financiación catalizadora.",
      en: "Support for market-based solutions, partnerships with enterprises, and catalytic funding."
    },
    impacto_financiero: {
      es: "Asia Central, Asia Oriental, África Subsahariana, África del Norte",
      en: "Central Asia, East Asia, Sub-Saharan Africa, North Africa"
    },
    country: "United Kingdom",
    country_es: "Reino Unido",
    ciudad: "Londres, Reino Unido",
    continent: "europa",
    latitude: 51.5074,
    longitude: -0.1278,
    website: "https://shellfoundation.org",
    email: "shellfoundation@shell.com"
  },
  {
    id: 355,
    name: "The Lemelson Foundation",
    description_es: "Una fundación centrada en promover la invención y la innovación para mejorar vidas y abordar desafíos globales.",
    description_en: "A foundation focused on advancing invention and innovation to improve lives and address global challenges.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Innovación Social, Educación de Calidad, Justicia Económica",
      en: "Social Innovation, Quality Education, Economic Justice"
    },
    como_trabajan: {
      es: "Apoyo a inventores, programas educativos y financiación para soluciones impulsadas por la innovación.",
      en: "Support for inventors, education programs, and funding for innovation-driven solutions."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Portland, Oregón, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.lemelson.org",
    email: "info@lemelson.org"
  },
  {
    id: 356,
    name: "Small Scale Sustainable Infrastructure Development Fund",
    description_es: "Permite el desarrollo de infraestructura sostenible a pequeña escala para ampliar el acceso a la energía, el agua y los servicios esenciales en comunidades desatendidas.",
    description_en: "Enables the development of small-scale sustainable infrastructure to expand access to energy, water, and essential services in underserved communities.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Económica, Transición Energética, Ciudades Sustentables",
      en: "Economic Justice, Energy Transition, Sustainable Cities"
    },
    como_trabajan: {
      es: "Financiamiento concesional, asistencia técnica y asociaciones con desarrolladores e instituciones locales.",
      en: "Concessional finance, technical assistance, and partnerships with local developers and institutions."
    },
    impacto_financiero: {
      es: "America del Norte, América Central, América del Sur, Europa Occidental, Europa del Este, Asia Central, Asia Oriental, África Susahariana, África del Norte, Oceanía y Oriente Medio",
      en: "America del Norte, Central America, South America, Western Europe, Eastern Europe, Central Asia, East Asia, África Susahariana, North Africa, Oceanía y Oriente Medio"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Cambridge, Massachusetts, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://s3idf.org/",
    email: "info@sssidf.org"
  },
  {
    id: 357,
    name: "A.P. Møller Fonden",
    description_es: "Fortalece la sociedad y la cultura danesas mediante el apoyo a la educación, la investigación, las artes y las iniciativas sociales.",
    description_en: "Strengthens Danish society and culture through support for education, research, arts, and social initiatives.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Educación de Calidad, Conservación de Recursos Naturales, Salud Global",
      en: "Quality Education, Natural Resources Conservation, Global Health"
    },
    como_trabajan: {
      es: "Subvenciones para educación e investigación, financiación cultural y apoyo a proyectos sociales y humanitarios.",
      en: "Grants for education and research, cultural funding, and support for social and humanitarian projects."
    },
    impacto_financiero: {
      es: "America del Norte, América Central, América del Sur, Europa Occidental, Europa del Este, Asia Central, Asia Oriental, África Susahariana, África del Norte, Oceanía y Oriente Medio",
      en: "America del Norte, Central America, South America, Western Europe, Eastern Europe, Central Asia, East Asia, África Susahariana, North Africa, Oceanía y Oriente Medio"
    },
    country: "Denmark",
    country_es: "Dinamarca",
    ciudad: "Copenhague, Dinamarca",
    continent: "europa",
    latitude: 55.6761,
    longitude: 12.5683,
    website: "https://www.apmollerfonde.dk/",
    email: "info@apmollerfonde.dk"
  },
  {
    id: 358,
    name: "Tuborgfondet Foundation",
    description_es: "Empodera a los jóvenes para dar forma a la sociedad a través de la innovación, el espíritu empresarial y el compromiso cívico.",
    description_en: "Empowers young people to shape society through innovation, entrepreneurship, and civic engagement.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Juventud, Participación Ciudadana, Derechos Laborales, Movimientos Ciudadanos",
      en: "Youth, Civic Participation, Labor Rights, Citizen Movements"
    },
    como_trabajan: {
      es: "Financiamiento para iniciativas lideradas por jóvenes, programas de emprendimiento y asociaciones con actores educativos y cívicos.",
      en: "Funding for youth-led initiatives, entrepreneurship programs, and partnerships with educational and civic actors."
    },
    impacto_financiero: {
      es: "Europa Occidental, Europa del Este",
      en: "Western Europe, Eastern Europe"
    },
    country: "Denmark",
    country_es: "Dinamarca",
    ciudad: "Hellerup, Dinamarca",
    continent: "europa",
    latitude: 55.6761,
    longitude: 12.5683,
    website: "https://tuborgfondet.dk",
    email: "info@tuborgfondet.dk"
  },
  {
    id: 359,
    name: "Hempel Foundation",
    description_es: "Promueve la educación, la protección de la biodiversidad y la inclusión social para crear un cambio positivo a largo plazo.",
    description_en: "Advances education, biodiversity protection, and social inclusion to create long-term positive change.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Educación de Calidad, Conservación de Recursos Naturales, Justicia Económica",
      en: "Quality Education, Natural Resources Conservation, Economic Justice"
    },
    como_trabajan: {
      es: "Financiamiento de programas, asociaciones estratégicas y apoyo a iniciativas de investigación e implementación.",
      en: "Program funding, strategic partnerships, and support for research and implementation initiatives."
    },
    impacto_financiero: {
      es: "Europa Occidental, Europa del Este, Asia Central, Asia Oriental, África Subsahariana, África del Norte",
      en: "Western Europe, Eastern Europe, Central Asia, East Asia, Sub-Saharan Africa, North Africa"
    },
    country: "Denmark",
    country_es: "Dinamarca",
    ciudad: "Lyngby, Dinamarca",
    continent: "europa",
    latitude: 55.6761,
    longitude: 12.5683,
    website: "https://hempelfoundation.com",
    email: "mail@hempelfoundation.com"
  },
  {
    id: 360,
    name: "Black Feminist Fund",
    description_es: "Fortalece los movimientos feministas negros para promover la justicia racial, de género y económica a nivel mundial.",
    description_en: "Strengthens Black feminist movements to advance racial, gender, and economic justice globally.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia de Género, Justicia Racial, Justicia Económica, Movimientos Ciudadanos",
      en: "Gender Justice, Racial Justice, Economic Justice, Citizen Movements"
    },
    como_trabajan: {
      es: "Concesión de subvenciones flexible, asociaciones con movimientos y apoyo para la promoción y la organización.",
      en: "Flexible grantmaking, movement partnerships, and support for advocacy and organizing."
    },
    impacto_financiero: {
      es: "America del Norte, América Central, América del Sur, Europa Occidental, Europa del Este, Asia Central, Asia Oriental, África Susahariana, África del Norte, Oceanía y Oriente Medio",
      en: "America del Norte, Central America, South America, Western Europe, Eastern Europe, Central Asia, East Asia, África Susahariana, North Africa, Oceanía y Oriente Medio"
    },
    country: "Barbados",
    country_es: "Barbados",
    ciudad: "Bridgetown, Barbados",
    continent: "desconocido",
    latitude: 0,
    longitude: 0,
    website: "https://www.theblackfeministproject.org/",
    email: "info@blackfeministfund.org"
  },
  {
    id: 361,
    name: "Charles Koch Institute",
    description_es: "Promueve una sociedad basada en la libertad individual, el diálogo abierto y el pensamiento crítico a través de la educación y las ideas.",
    description_en: "Promotes a society grounded in individual liberty, open dialogue, and critical thinking through education and ideas.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Económica, Democracia, Paz y Resolución de Conflictos, Educación de Calidad",
      en: "Economic Justice, Democracy, Peace and Conflict Resolution, Quality Education"
    },
    como_trabajan: {
      es: "Programas educativos, apoyo a la investigación y asociaciones que fomenten el debate y la participación política.",
      en: "Educational programs, research support, and partnerships that foster debate and policy engagement."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Arlington, Virginia, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.charleskochinstitute.org",
    email: "info@charleskochinstitute.org"
  },
  {
    id: 362,
    name: "The Elevate Prize Foundation",
    description_es: "Amplifica el impacto de los innovadores sociales que trabajan para resolver desafíos sociales y ambientales apremiantes.",
    description_en: "Amplifies the impact of social innovators working to solve pressing social and environmental challenges.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Innovación Social, Fortalecimiento de Capacidades Organizacionales, Movimientos Ciudadanos",
      en: "Social Innovation, Organizational Capacity Building, Citizen Movements"
    },
    como_trabajan: {
      es: "Premios, apoyo al desarrollo de capacidades y plataformas que amplían la visibilidad y escalan el impacto.",
      en: "Prizes, capacity-building support, and platforms that expand visibility and scale impact."
    },
    impacto_financiero: {
      es: "America del Norte, América Central, América del Sur, Europa Occidental, Europa del Este, Asia Central, Asia Oriental, África Susahariana, África del Norte, Oceanía y Oriente Medio",
      en: "America del Norte, Central America, South America, Western Europe, Eastern Europe, Central Asia, East Asia, África Susahariana, North Africa, Oceanía y Oriente Medio"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Miami, Florida, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://elevateprize.org/",
    email: "info@elevateprize.org"
  },
  {
    id: 363,
    name: "Thousand Currents",
    description_es: "Apoya los movimientos de base liderados por las comunidades más afectadas por la desigualdad y la injusticia climática.",
    description_en: "Supports grassroots movements led by communities most affected by inequality and climate injustice.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Soberanía Alimentaria, Justicia Climática, Justicia Económica, Comunidades Indígenas",
      en: "Food Sovereignty, Climate Justice, Economic Justice, Indigenous Communities"
    },
    como_trabajan: {
      es: "Financiamiento flexible, alianzas a largo plazo y acompañamiento a iniciativas lideradas por la comunidad.",
      en: "Flexible funding, long-term partnerships, and accompaniment for community-led initiatives."
    },
    impacto_financiero: {
      es: "América Central, América del Sur, Asia Central, Asia Oriental, África Subsahariana, África del Norte",
      en: "Central America, South America, Central Asia, East Asia, Sub-Saharan Africa, North Africa"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Richmond, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://thousandcurrents.org/",
    email: "info@thousandcurrents.org"
  },
  {
    id: 364,
    name: "Andes Amazon Fund",
    description_es: "Protege la Amazonía y los Andes fortaleciendo el liderazgo indígena, los derechos comunitarios y la conservación de los ecosistemas.",
    description_en: "Protects the Amazon and Andes by strengthening Indigenous leadership, community rights, and ecosystem conservation.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales, Comunidades Indígenas, Justicia Climática",
      en: "Natural Resources Conservation, Indigenous Communities, Climate Justice"
    },
    como_trabajan: {
      es: "Concesión de subvenciones, alianzas con organizaciones indígenas y apoyo a iniciativas territoriales y de conservación.",
      en: "Grantmaking, partnerships with Indigenous organizations, and support for territorial and conservation initiatives."
    },
    impacto_financiero: {
      es: "América del Sur",
      en: "South America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Washington D.C., EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.andesamazonfund.org",
    email: "info@andesamazonfund.org"
  },
  {
    id: 365,
    name: "Bobolink Foundation",
    description_es: "Promueve la protección ambiental y la justicia social apoyando soluciones de base y basadas en movimientos.",
    description_en: "Advances environmental protection and social justice by supporting grassroots and movement-based solutions.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales, Justicia Climática",
      en: "Natural Resources Conservation, Climate Justice"
    },
    como_trabajan: {
      es: "Subvenciones para organizaciones de primera línea, asociaciones a largo plazo y apoyo para la promoción y el cambio de sistemas.",
      en: "Grants to frontline organizations, long-term partnerships, and support for advocacy and systems change."
    },
    impacto_financiero: {
      es: "N/I",
      en: "N/I"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Chicago, Illinois, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.bobolinkfoundation.org/",
    email: "N/I"
  },
  {
    id: 366,
    name: "Biodiversity Funders Group",
    description_es: "Fortalece la acción filantrópica para conservar la biodiversidad y abordar desafíos ambientales interconectados.",
    description_en: "Strengthens philanthropic action to conserve biodiversity and address interconnected environmental challenges.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales, Gobernanza Global, políticas y rendición de cuentas, Justicia Climática",
      en: "Natural Resources Conservation, Gobernanza Global, políticas y rendición de cuentas, Climate Justice"
    },
    como_trabajan: {
      es: "Redes de aprendizaje entre pares, iniciativas colaborativas y estrategias compartidas de investigación y financiación.",
      en: "Peer learning networks, collaborative initiatives, and shared research and funding strategies."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "San Francisco, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://biodiversityfunders.org",
    email: "info@biodiversityfunders.org"
  },
  {
    id: 367,
    name: "Full Circle Foundation",
    description_es: "Apoya soluciones lideradas por la comunidad que promueven la equidad social, la sostenibilidad ambiental y las oportunidades económicas.",
    description_en: "Supports community-led solutions that advance social equity, environmental sustainability, and economic opportunity.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Soberanía Alimentaria, Conservación de Recursos Naturales, Educación de Calidad",
      en: "Food Sovereignty, Natural Resources Conservation, Quality Education"
    },
    como_trabajan: {
      es: "Subvenciones flexibles, asociaciones con organizaciones de base y apoyo a iniciativas impulsadas por la comunidad.",
      en: "Flexible grants, partnerships with grassroots organizations, and support for community-driven initiatives."
    },
    impacto_financiero: {
      es: "America del Norte, América Central, América del Sur, Europa Occidental, Europa del Este, Asia Central, Asia Oriental, África Susahariana, África del Norte, Oceanía y Oriente Medio",
      en: "America del Norte, Central America, South America, Western Europe, Eastern Europe, Central Asia, East Asia, África Susahariana, North Africa, Oceanía y Oriente Medio"
    },
    country: "United Kingdom",
    country_es: "Reino Unido",
    ciudad: "Cambridge, Reino Unido",
    continent: "europa",
    latitude: 51.5074,
    longitude: -0.1278,
    website: "https://fullcirclefdn.org/",
    email: "info@fullcirclefoundation.com"
  },
  {
    id: 368,
    name: "Re:wild",
    description_es: "Protege y restaura la biodiversidad salvaguardando los ecosistemas más importantes y amenazados a nivel mundial.",
    description_en: "Protects and restores biodiversity by safeguarding the most important and threatened ecosystems worldwide.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales, Justicia Climática, Comunidades Indígenas",
      en: "Natural Resources Conservation, Climate Justice, Indigenous Communities"
    },
    como_trabajan: {
      es: "Asociaciones para la conservación, iniciativas basadas en la ciencia y apoyo al liderazgo indígena y local.",
      en: "Conservation partnerships, science-based initiatives, and support for Indigenous and local leadership."
    },
    impacto_financiero: {
      es: "America del Norte, América Central, América del Sur, Europa Occidental, Europa del Este, Asia Central, Asia Oriental, África Susahariana, África del Norte, Oceanía y Oriente Medio",
      en: "America del Norte, Central America, South America, Western Europe, Eastern Europe, Central Asia, East Asia, África Susahariana, North Africa, Oceanía y Oriente Medio"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Austin, Texas, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.rewild.org/",
    email: "info@rewild.org"
  },
  {
    id: 369,
    name: "Public Welfare Foundation",
    description_es: "Promueve la justicia y las oportunidades abordando las causas fundamentales de la desigualdad dentro de los sistemas de justicia penal, jóvenes y trabajadores.",
    description_en: "Advances justice and opportunity by addressing the root causes of inequality within criminal justice, youth, and worker systems.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Paz y Resolución de Conflictos, Justicia Racial, Democracia",
      en: "Peace and Conflict Resolution, Racial Justice, Democracy"
    },
    como_trabajan: {
      es: "Concesión de subvenciones estratégicas, asociaciones centradas en políticas y apoyo a la promoción y la reforma de los sistemas.",
      en: "Strategic grantmaking, policy-focused partnerships, and support for advocacy and systems reform."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Washington D.C., EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://publicwelfare.org/",
    email: "info@publicwelfare.org"
  },
  {
    id: 370,
    name: "Collaborative Fund",
    description_es: "Apoya ideas y empresas que dan forma a un futuro más equitativo, sostenible y resiliente.",
    description_en: "Supports ideas and businesses shaping a more equitable, sustainable, and resilient future.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Innovación Social, Economía Circular, Justicia Climática",
      en: "Social Innovation, Circular Economy, Climate Justice"
    },
    como_trabajan: {
      es: "Inversión a largo plazo, asociaciones de fundadores y capital alineado con el impacto social y ambiental.",
      en: "Long-term investing, founder partnerships, and capital aligned with social and environmental impact."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.collaborativefund.com/",
    email: "hello@collaborativefund.com"
  },
  {
    id: 371,
    name: "Environmental Defenders Collaborative (EDC) ",
    description_es: "Fortalece la justicia ambiental y climática protegiendo a activistas y comunidades que defienden la tierra, el agua y los ecosistemas.",
    description_en: "Strengthens environmental and climate justice by protecting activists and communities defending land, water, and ecosystems.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Movimientos Ciudadanos, Paz y Resolución de Conflictos, Gobernanza Global",
      en: "Climate Justice, Citizen Movements, Peace and Conflict Resolution, Gobernanza Global"
    },
    como_trabajan: {
      es: "Apoyo legal, asistencia de emergencia y coordinación entre la sociedad civil y organizaciones de defensa.",
      en: "Legal support, emergency assistance, and coordination among civil society and advocacy organizations."
    },
    impacto_financiero: {
      es: "America del Norte, América Central, América del Sur, Europa Occidental, Europa del Este, Asia Central, Asia Oriental, África Susahariana, África del Norte, Oceanía y Oriente Medio",
      en: "America del Norte, Central America, South America, Western Europe, Eastern Europe, Central Asia, East Asia, África Susahariana, North Africa, Oceanía y Oriente Medio"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "San Francisco, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://environmentaldefenders.org/",
    email: "N/I"
  },
  {
    id: 372,
    name: "Fonseca Species Conservation Fund ",
    description_es: "Apoya la protección de especies amenazadas y hábitats críticos a través de esfuerzos de conservación específicos.",
    description_en: "Supports the protection of threatened species and critical habitats through targeted conservation efforts.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales, Educación de Calidad",
      en: "Natural Resources Conservation, Quality Education"
    },
    como_trabajan: {
      es: "Pequeñas subvenciones para proyectos de campo, apoyo a profesionales de la conservación y asociaciones con organizaciones locales.",
      en: "Small grants for field-based projects, support for conservation practitioners, and partnerships with local organizations."
    },
    impacto_financiero: {
      es: "America del Norte, América Central, América del Sur, Europa Occidental, Europa del Este, Asia Central, Asia Oriental, África Susahariana, África del Norte, Oceanía y Oriente Medio",
      en: "America del Norte, Central America, South America, Western Europe, Eastern Europe, Central Asia, East Asia, África Susahariana, North Africa, Oceanía y Oriente Medio"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Arlington, Virginia, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.rewild.org/the-fonseca-species-conservation-fund",
    email: "info@fonsecafund.org"
  },
  {
    id: 373,
    name: "Neighborhood Funders Group",
    description_es: "Fortalece la filantropía basada en el lugar para promover el desarrollo equitativo e impulsado por la comunidad.",
    description_en: "Strengthens place-based philanthropy to advance equitable and community-driven development.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Racial, Justicia Económica, Ciudades Sustentables, Movimientos Ciudadanos",
      en: "Racial Justice, Economic Justice, Sustainable Cities, Citizen Movements"
    },
    como_trabajan: {
      es: "Redes de pares, aprendizaje colaborativo e iniciativas políticas y de financiación compartida.",
      en: "Peer networks, collaborative learning, and shared funding and policy initiatives."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Oakland, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://nfg.org/",
    email: "info@neighborhoodfunders.org"
  },
  {
    id: 374,
    name: "Amplify Fund",
    description_es: "Fortalece los movimientos por la justicia social, racial y ambiental proporcionando recursos a organizadores y defensores de primera línea.",
    description_en: "Strengthens movements for social, racial, and environmental justice by resourcing frontline organizers and advocates.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Racial, Ciudades Sustentables, Participación Ciudadana, Movimientos Ciudadanos",
      en: "Racial Justice, Sustainable Cities, Civic Participation, Citizen Movements"
    },
    como_trabajan: {
      es: "Concesión de subvenciones flexible, financiación alineada con el movimiento y apoyo a los esfuerzos de promoción y organización.",
      en: "Flexible grantmaking, movement-aligned funding, and support for advocacy and organizing efforts."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.amplifyfund.org/",
    email: "info@amplifyfund.org"
  },
  {
    id: 375,
    name: "Democracy Fund",
    description_es: "Fortalece las instituciones democráticas y la participación cívica para garantizar una democracia más inclusiva y representativa.",
    description_en: "Strengthens democratic institutions and civic participation to ensure a more inclusive and representative democracy.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Democracia, Gobernanza Global, políticas y rendición de cuentas, Participación Ciudadana",
      en: "Democracy, Gobernanza Global, políticas y rendición de cuentas, Civic Participation"
    },
    como_trabajan: {
      es: "Concesión de subvenciones estratégicas, apoyo a la investigación y asociaciones que promuevan el compromiso cívico y la práctica democrática.",
      en: "Strategic grantmaking, research support, and partnerships that advance civic engagement and democratic practice."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Washington D.C., EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://democracyfund.org/",
    email: "info@democracyfund.org"
  },
  {
    id: 376,
    name: "Glasswaters Foundation ",
    description_es: "Promueve soluciones climáticas y equidad social a través de acciones ambientales a nivel de sistemas.",
    description_en: "Advances climate solutions and social equity through systems-level environmental action.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Salud Global, Soberanía Alimentaria, Justicia de Género",
      en: "Global Health, Food Sovereignty, Gender Justice"
    },
    como_trabajan: {
      es: "Subvenciones estratégicas, asociaciones de movimientos y apoyo a la defensa del clima.",
      en: "Strategic grants, movement partnerships, and support for climate advocacy."
    },
    impacto_financiero: {
      es: "America del Norte, América Central, América del Sur, Europa Occidental, Europa del Este, Asia Central, Asia Oriental, África Susahariana, África del Norte, Oceanía y Oriente Medio",
      en: "America del Norte, Central America, South America, Western Europe, Eastern Europe, Central Asia, East Asia, África Susahariana, North Africa, Oceanía y Oriente Medio"
    },
    country: "Canada",
    country_es: "Canadá",
    ciudad: "Campbell River, Columbia Británica, Canadá",
    continent: "america",
    latitude: 45.4215,
    longitude: -75.6972,
    website: "https://glasswaters.ca/",
    email: "info@glasswaters.org"
  },
  {
    id: 377,
    name: "Mitsubishi Corporation Foundation",
    description_es: "Contribuye al desarrollo social a través de la educación, la cultura y el intercambio internacional.",
    description_en: "Contributes to social development through education, culture, and international exchange.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales, Educación de Calidad, Justicia Climática",
      en: "Natural Resources Conservation, Quality Education, Climate Justice"
    },
    como_trabajan: {
      es: "Ayudas, becas y apoyo a iniciativas culturales y educativas.",
      en: "Grants, scholarships, and support for cultural and educational initiatives."
    },
    impacto_financiero: {
      es: "América del Norte y Asia Oriental",
      en: "América del Norte y Asia Oriental"
    },
    country: "Japón (Sede Londres para Europa/África)",
    country_es: "Japón (Sede Londres para Europa/África)",
    ciudad: "Tokio, Japón (Sede Londres para Europa/África)",
    continent: "desconocido",
    latitude: 0,
    longitude: 0,
    website: "https://www.mitsubishicorp.com/us/en/mcfa/",
    email: "mcfa@mcfa.com"
  },
  {
    id: 378,
    name: "The Waltons Trust",
    description_es: "Apoya causas benéficas que mejoran el bienestar, las oportunidades y la resiliencia de la comunidad.",
    description_en: "Supports charitable causes that improve wellbeing, opportunity, and community resilience.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de Recursos Naturales, Justicia Económica",
      en: "Natural Resources Conservation, Economic Justice"
    },
    como_trabajan: {
      es: "Concesión de subvenciones basada en confianza y apoyo a largo plazo para organizaciones sin fines de lucro.",
      en: "Trust-based grantmaking and long-term support for nonprofit organizations."
    },
    impacto_financiero: {
      es: "Europa Occidental",
      en: "Western Europe"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Bentonville, Arkansas, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.waltonstrust.org/",
    email: "N/I"
  },
  {
    id: 379,
    name: "The Woodcock Foundation",
    description_es: "Fortalece las comunidades mediante el avance de la justicia social, la educación y la protección del medio ambiente.",
    description_en: "Strengthens communities by advancing social justice, education, and environmental protection.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Soberanía Alimentaria, Justicia de Género, Conservación de Recursos Naturales, Democracia",
      en: "Food Sovereignty, Gender Justice, Natural Resources Conservation, Democracy"
    },
    como_trabajan: {
      es: "Subvenciones flexibles, asociaciones de base y financiación a largo plazo.",
      en: "Flexible grants, grassroots partnerships, and long-term funding."
    },
    impacto_financiero: {
      es: "America del Norte, América Central, América del Sur, Europa Occidental, Europa del Este, Asia Central, Asia Oriental, África Susahariana, África del Norte, Oceanía y Oriente Medio",
      en: "America del Norte, Central America, South America, Western Europe, Eastern Europe, Central Asia, East Asia, África Susahariana, North Africa, Oceanía y Oriente Medio"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://woodcockfdn.org/",
    email: "info@woodcockfoundation.org"
  },
  {
    id: 380,
    name: "Harambee Youth Employment Accelerator",
    description_es: "Mejora los resultados del empleo juvenil transformando las vías de educación al trabajo en África.",
    description_en: "Improves youth employment outcomes by transforming education-to-work pathways in Africa.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Juventud, Justicia Económica, Educación de Calidad, Fortalecimiento de Capacidades Organizacionales",
      en: "Youth, Economic Justice, Quality Education, Organizational Capacity Building"
    },
    como_trabajan: {
      es: "Asociaciones de empleadores, programas basados ​​en datos e innovación del sistema de fuerza laboral.",
      en: "Employer partnerships, data-driven programs, and workforce system innovation."
    },
    impacto_financiero: {
      es: "África Subsahariana, África del Norte",
      en: "Sub-Saharan Africa, North Africa"
    },
    country: "South Africa",
    country_es: "Sudáfrica",
    ciudad: "Johannesburgo, Sudáfrica",
    continent: "africa",
    latitude: -25.7479,
    longitude: 28.2293,
    website: "https://harambee.co.za/",
    email: "info@harambee.co.za"
  },
  {
    id: 381,
    name: "The Satterberg Foundation ",
    description_es: "Promueve la equidad y la justicia racial apoyando los movimientos de base y el cambio de sistemas.",
    description_en: "Advances racial equity and justice by supporting grassroots movements and systems change.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Democracia, Justicia de Género",
      en: "Climate Justice, Democracy, Gender Justice"
    },
    como_trabajan: {
      es: "Subvenciones plurianuales, asociaciones de movimientos y apoyo al desarrollo de capacidades.",
      en: "Multi-year grants, movement partnerships, and capacity-building support."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Seattle, Washington, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://satterberg.org",
    email: "info@satterberg.org"
  },
  {
    id: 382,
    name: "General Service Foundation",
    description_es: "Promueve la justicia social, económica y ambiental a través del cambio impulsado por el movimiento.",
    description_en: "Promotes social, economic, and environmental justice through movement-driven change.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia de Género, Justicia Racial, Democracia",
      en: "Gender Justice, Racial Justice, Democracy"
    },
    como_trabajan: {
      es: "Concesión de subvenciones a largo plazo y asociaciones con organizaciones de defensa.",
      en: "Long-term grantmaking and partnerships with advocacy organizations."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Aspen, Colorado, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://generalservice.org",
    email: "info@generalservice.org"
  },
  {
    id: 383,
    name: "Access Strategies Fund",
    description_es: "Fortalece la participación democrática y el poder comunitario en los Estados Unidos.",
    description_en: "Strengthens democratic participation and community power in the United States.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Participación Ciudadana, Justicia Racial, Democracia",
      en: "Civic Participation, Racial Justice, Democracy"
    },
    como_trabajan: {
      es: "Subvenciones para la participación cívica, la organización y la promoción de políticas.",
      en: "Grants for civic engagement, organizing, and policy advocacy."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Cambridge, Massachusetts, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.accessstrategies.org/",
    email: "info@accessstrategiesfund.org"
  },
  {
    id: 384,
    name: "Pink House Foundation",
    description_es: "Apoya los esfuerzos de justicia social centrados en la equidad, la dignidad y el bienestar comunitario.",
    description_en: "Supports social justice efforts centered on equity, dignity, and community wellbeing.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia de Género, LGTBIQ+, Justicia Económica",
      en: "Gender Justice, LGBTIQ+, Economic Justice"
    },
    como_trabajan: {
      es: "Financiamiento flexible y alianzas con organizaciones de base.",
      en: "Flexible funding and partnerships with grassroots organizations."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Washington D.C., EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.pinkhousefoundation.org/#mission",
    email: "N/I"
  },
  {
    id: 385,
    name: "The Kataly Foundation ",
    description_es: "Construye economías regenerativas y justas arraigadas en el poder y la curación de la comunidad.",
    description_en: "Builds regenerative and just economies rooted in community power and healing.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Racial, Justicia Económica, Movimientos Ciudadanos, Justicia Climática",
      en: "Racial Justice, Economic Justice, Citizen Movements, Climate Justice"
    },
    como_trabajan: {
      es: "Concesión de subvenciones, cambio narrativo y financiación para la transformación de sistemas alineados con el movimiento.",
      en: "Movement-aligned grantmaking, narrative change, and systems transformation funding."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "San Francisco, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.katalyfoundation.org",
    email: "N/I"
  },
  {
    id: 386,
    name: "The Chan Zuckerberg Initiative ",
    description_es: "Trabaja para ampliar las oportunidades y promover soluciones científicas, educativas y de salud.",
    description_en: "Works to expand opportunity and advance science, education, and health solutions.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Innovación Social, Salud Global, Educación de Calidad, Justicia Económica",
      en: "Social Innovation, Global Health, Quality Education, Economic Justice"
    },
    como_trabajan: {
      es: "Filantropía, inversión de impacto y asociaciones impulsadas por la tecnología.",
      en: "Philanthropy, impact investing, and technology-driven partnerships."
    },
    impacto_financiero: {
      es: "America del Norte, América Central, América del Sur, Europa Occidental, Europa del Este, Asia Central, Asia Oriental, África Susahariana, África del Norte, Oceanía y Oriente Medio",
      en: "America del Norte, Central America, South America, Western Europe, Eastern Europe, Central Asia, East Asia, África Susahariana, North Africa, Oceanía y Oriente Medio"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Redwood City, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.chanzuckerberg.com/",
    email: "info@chanzuckerberg.com"
  },
  {
    id: 387,
    name: "Thousand Currents ",
    description_es: "Apoya los movimientos liderados por la comunidad que promueven la justicia, la equidad y la resiliencia climática.",
    description_en: "Supports community-led movements advancing justice, equity, and climate resilience.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Soberanía Alimentaria, Justicia Climática, Justicia Económica, Comunidades Indígenas, Movimientos Ciudadanos, Fortalecimiento de Capacidades Organizacionales",
      en: "Food Sovereignty, Climate Justice, Economic Justice, Indigenous Communities, Citizen Movements, Organizational Capacity Building"
    },
    como_trabajan: {
      es: "Financiamiento flexible, alianzas a largo plazo y acompañamiento.",
      en: "Flexible funding, long-term partnerships, and accompaniment."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Richmond, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://thousandcurrents.org",
    email: "N/I"
  },
  {
    id: 388,
    name: "Groundswell Action Fund",
    description_es: "Desarrolla poder de base para promover la justicia racial, económica y ambiental.",
    description_en: "Builds grassroots power to advance racial, economic, and environmental justice.\n",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Racial, Justicia de Género, Participación Ciudadana, Movimientos Ciudadanos",
      en: "Racial Justice, Gender Justice, Civic Participation, Citizen Movements"
    },
    como_trabajan: {
      es: "Subvenciones para organización, promoción e infraestructura de movimiento.",
      en: "Grants for organizing, advocacy, and movement infrastructure."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Oakland, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://groundswellfund.org",
    email: "info@groundswellactionfund.org"
  },
  {
    id: 389,
    name: "Emergent Fund ",
    description_es: "Brinda apoyo rápido a movimientos de base que responden a momentos sociales y políticos urgentes.",
    description_en: "Provides rapid support to grassroots movements responding to urgent social and political moments.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Movimientos Ciudadanos, Justicia Racial, Justicia de Género, LGTBIQ+",
      en: "Citizen Movements, Racial Justice, Gender Justice, LGBTIQ+"
    },
    como_trabajan: {
      es: "Concesión de subvenciones de respuesta rápida y financiación de emergencia.",
      en: "Rapid-response grantmaking and emergency funding."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Oakland, California, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.emergentfund.net/",
    email: "info@emergentfund.net"
  },
  {
    id: 390,
    name: "Open Value Foundation",
    description_es: "Promueve la acción climática y la equidad social a través del apoyo filantrópico impulsado por valores.",
    description_en: "Advances climate action and social equity through values-driven philanthropic support.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Innovación Social, Justicia Económica, Fortalecimiento de Capacidades Organizacionales",
      en: "Social Innovation, Economic Justice, Organizational Capacity Building"
    },
    como_trabajan: {
      es: "Subvenciones estratégicas y asociaciones alineadas con objetivos de sostenibilidad.",
      en: "Strategic grants and partnerships aligned with sustainability goals."
    },
    impacto_financiero: {
      es: "America del Norte, América Central, América del Sur, Europa Occidental, Europa del Este, Asia Central, Asia Oriental, África Susahariana, África del Norte, Oceanía y Oriente Medio",
      en: "America del Norte, Central America, South America, Western Europe, Eastern Europe, Central Asia, East Asia, África Susahariana, North Africa, Oceanía y Oriente Medio"
    },
    country: "Spain",
    country_es: "España",
    ciudad: "Madrid, España",
    continent: "europa",
    latitude: 40.4168,
    longitude: -3.7038,
    website: "https://www.openvaluefoundation.org/es/",
    email: "info@openvalue.org"
  },
  {
    id: 391,
    name: "Bush Foundation",
    description_es: "Invierte en liderazgo comunitario y soluciones innovadoras en todo el Alto Medio Oeste.",
    description_en: "Invests in community leadership and innovative solutions across the Upper Midwest.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Fortalecimiento de Capacidades Organizacionales, Justicia Económica, Educación de Calidad",
      en: "Organizational Capacity Building, Economic Justice, Quality Education"
    },
    como_trabajan: {
      es: "Desarrollo de liderazgo, subvenciones comunitarias y desarrollo de capacidades.",
      en: "Leadership development, community grants, and capacity-building."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Saint Paul, Minnesota, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.bushfoundation.org/",
    email: "info@bushfoundation.org"
  },
  {
    id: 392,
    name: "Triangle Génération Humanitaire ",
    description_es: "Entrega ayuda humanitaria a poblaciones afectadas por conflictos y crisis humanitarias.",
    description_en: "Delivers humanitarian aid to populations affected by conflict and humanitarian crises.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Paz y Resolución de Conflictos, Salud Global, Educación de Calidad",
      en: "Peace and Conflict Resolution, Global Health, Quality Education"
    },
    como_trabajan: {
      es: "Operaciones de campo, asistencia de emergencia y asociaciones con ONG.",
      en: "Field operations, emergency assistance, and NGO partnerships."
    },
    impacto_financiero: {
      es: " Asia Central, África Subsahariana, Europa del Este",
      en: "Central Asia, Sub-Saharan Africa, Eastern Europe"
    },
    country: "France",
    country_es: "Francia",
    ciudad: "Lyon, Francia",
    continent: "europa",
    latitude: 48.8566,
    longitude: 2.3522,
    website: "https://www.trianglegh.org/",
    email: "siege@trianglegh.org"
  },
  {
    id: 393,
    name: "Fondation CHANEL",
    description_es: "Promueve la independencia económica y el liderazgo de las mujeres en todo el mundo.",
    description_en: "Advances women’s economic independence and leadership worldwide.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia de Género, Justicia Económica, Innovación Social",
      en: "Gender Justice, Economic Justice, Social Innovation"
    },
    como_trabajan: {
      es: "Subvenciones a largo plazo y asociaciones con organizaciones lideradas por mujeres.",
      en: "Long-term grants and partnerships with women-led organizations."
    },
    impacto_financiero: {
      es: "América del Norte, Amérca Central y América del Sur, África Subsahariana, África del Norte, Europa Occidental, Europa del Este, Asia Central, Asia Oriental",
      en: "North America, Amérca Central y América del Sur, Sub-Saharan Africa, North Africa, Western Europe, Eastern Europe, Central Asia, East Asia"
    },
    country: "France",
    country_es: "Francia",
    ciudad: "París, Francia",
    continent: "europa",
    latitude: 48.8566,
    longitude: 2.3522,
    website: "https://www.fondationchanel.org/",
    email: "contact@fondationchanel.org"
  },
  {
    id: 394,
    name: "JDRF International ",
    description_es: "Acelera la investigación y la promoción para mejorar la vida de las personas con diabetes tipo 1.",
    description_en: "Accelerates research and advocacy to improve the lives of people with type 1 diabetes.",
    tipo_de_org: {
      es: "Organización Comunitaria",
      en: "Community Organization"
    },
    enfoque: {
      es: "Salud Global, Innovación Social",
      en: "Global Health, Social Innovation"
    },
    como_trabajan: {
      es: "Financiamiento de investigaciones, promoción de políticas y participación comunitaria.",
      en: "Research funding, policy advocacy, and community engagement."
    },
    impacto_financiero: {
      es: "America del Norte, América Central, América del Sur, Europa Occidental, Europa del Este, Asia Central, Asia Oriental, África Susahariana, África del Norte, Oceanía y Oriente Medio",
      en: "America del Norte, Central America, South America, Western Europe, Eastern Europe, Central Asia, East Asia, África Susahariana, North Africa, Oceanía y Oriente Medio"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.breakthrought1d.org/",
    email: "info@jdrf.org"
  },
  {
    id: 395,
    name: "Clinton Foundation ",
    description_es: "Desarrolla soluciones escalables que abordan los desafíos económicos, climáticos y de salud a nivel mundial.",
    description_en: "Develops scalable solutions addressing health, climate, and economic challenges globally.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Salud Global, Justicia Climática, Justicia Económica, Juventud",
      en: "Global Health, Climate Justice, Economic Justice, Youth"
    },
    como_trabajan: {
      es: "Asociaciones público-privadas e implementación de programas.",
      en: "Public-private partnerships and program implementation."
    },
    impacto_financiero: {
      es: "America del Norte, América Central, América del Sur, Europa Occidental, Europa del Este, Asia Central, Asia Oriental, África Susahariana, África del Norte, Oceanía y Oriente Medio",
      en: "America del Norte, Central America, South America, Western Europe, Eastern Europe, Central Asia, East Asia, África Susahariana, North Africa, Oceanía y Oriente Medio"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.clintonfoundation.org",
    email: "development@clintonfoundation.org"
  },
  {
    id: 396,
    name: "The Aspen Institute ",
    description_es: "Cultiva el liderazgo y el diálogo político para abordar desafíos sociales complejos.",
    description_en: "Cultivates leadership and policy dialogue to address complex societal challenges.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Gobernanza Global, políticas y rendición de cuentas, Paz y Resolución de Conflictos, Democracia, Educación de Calidad",
      en: "Gobernanza Global, políticas y rendición de cuentas, Peace and Conflict Resolution, Democracy, Quality Education"
    },
    como_trabajan: {
      es: "Convocatorias, investigaciones y programas de liderazgo.",
      en: "Convenings, research, and leadership programs."
    },
    impacto_financiero: {
      es: "America del Norte, América Central, América del Sur, Europa Occidental, Europa del Este, Asia Central, Asia Oriental, África Susahariana, África del Norte, Oceanía y Oriente Medio",
      en: "America del Norte, Central America, South America, Western Europe, Eastern Europe, Central Asia, East Asia, África Susahariana, North Africa, Oceanía y Oriente Medio"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Washington D.C., EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.aspeninstitute.org",
    email: "info@aspeninstitute.org"
  },
  {
    id: 397,
    name: "The Education Outcomes Fund",
    description_es: "Mejora los resultados del aprendizaje al vincular la financiación de la educación a resultados mensurables.",
    description_en: "Improves learning outcomes by linking education funding to measurable results.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Educación de Calidad, Innovación Social, Gobernanza Global, políticas y rendición de cuentas",
      en: "Quality Education, Social Innovation, Gobernanza Global, políticas y rendición de cuentas"
    },
    como_trabajan: {
      es: "Financiamiento basado en resultados y asociaciones intersectoriales.",
      en: "Outcomes-based financing and cross-sector partnerships."
    },
    impacto_financiero: {
      es: " Asia Central, Asia Oriental, África Subsahariana, América Central y América del Sur",
      en: "Central Asia, East Asia, Sub-Saharan Africa, América Central y América del Sur"
    },
    country: "United Kingdom",
    country_es: "Reino Unido",
    ciudad: "Londres, Reino Unido",
    continent: "europa",
    latitude: 51.5074,
    longitude: -0.1278,
    website: "https://www.educationoutcomesfund.org/",
    email: "info@educationoutcomesfund.org"
  },
  {
    id: 398,
    name: "Dovetail Impact Foundation",
    description_es: "Apoya iniciativas de cambio de sistemas que promueven la equidad y el impacto a largo plazo.",
    description_en: "Supports systems change initiatives advancing equity and long-term impact.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Económica, Salud Global, Innovación Social, Fortalecimiento de Capacidades Organizacionales",
      en: "Economic Justice, Global Health, Social Innovation, Organizational Capacity Building"
    },
    como_trabajan: {
      es: "Concesión de subvenciones estratégicas y asociaciones de colaboración.",
      en: "Strategic grantmaking and collaborative partnerships."
    },
    impacto_financiero: {
      es: "",
      en: ""
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Tyler, Texas, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://dovetailimpact.org/",
    email: "N/I"
  },
  {
    id: 399,
    name: "Cartier Philanthropy",
    description_es: "Fortalece la salud, la educación y los medios de vida en comunidades vulnerables.",
    description_en: "Strengthens health, education, and livelihoods in vulnerable communities.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Económica, Salud Global, Educación de Calidad, Conservación de Recursos Naturales",
      en: "Economic Justice, Global Health, Quality Education, Natural Resources Conservation"
    },
    como_trabajan: {
      es: "Asociaciones a largo plazo, financiación y creación de capacidad.",
      en: "Long-term partnerships, funding, and capacity-building."
    },
    impacto_financiero: {
      es: "America del Norte, América Central, América del Sur, Europa Occidental, Europa del Este, Asia Central, Asia Oriental, África Susahariana, África del Norte, Oceanía y Oriente Medio",
      en: "America del Norte, Central America, South America, Western Europe, Eastern Europe, Central Asia, East Asia, África Susahariana, North Africa, Oceanía y Oriente Medio"
    },
    country: "Switzerland",
    country_es: "Suiza",
    ciudad: "Ginebra, Suiza",
    continent: "europa",
    latitude: 46.948,
    longitude: 7.4474,
    website: "https://www.cartierphilanthropy.org/",
    email: "info@cartierphilanthropy.org"
  },
  {
    id: 400,
    name: "The END Fund",
    description_es: "Trabaja para eliminar las enfermedades tropicales desatendidas que afectan a las poblaciones marginadas.",
    description_en: "Works to eliminate neglected tropical diseases affecting marginalized populations.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Salud Global, Gobernanza Global, políticas y rendición de cuentas, Innovación Social",
      en: "Global Health, Gobernanza Global, políticas y rendición de cuentas, Social Innovation"
    },
    como_trabajan: {
      es: "Programas de control de enfermedades, asociaciones y promoción.",
      en: "Disease control programs, partnerships, and advocacy."
    },
    impacto_financiero: {
      es: " Asia Central, Asia Oriental, África Subsahariana, África del Norte, América Central y América del Sur",
      en: "Central Asia, East Asia, Sub-Saharan Africa, North Africa, América Central y América del Sur"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://end.org/",
    email: "info@end.org"
  },
  {
    id: 401,
    name: "WHO Foundation",
    description_es: "Moviliza apoyo privado para promover las prioridades globales de salud pública.",
    description_en: "Mobilizes private support to advance global public health priorities.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Salud Global, Gobernanza Global, políticas y rendición de cuentas, Innovación Social",
      en: "Global Health, Gobernanza Global, políticas y rendición de cuentas, Social Innovation"
    },
    como_trabajan: {
      es: "Financiamiento filantrópico y asociaciones con sistemas de salud.",
      en: "Philanthropic funding and health system partnerships."
    },
    impacto_financiero: {
      es: "America del Norte, América Central, América del Sur, Europa Occidental, Europa del Este, Asia Central, Asia Oriental, África Susahariana, África del Norte, Oceanía y Oriente Medio",
      en: "America del Norte, Central America, South America, Western Europe, Eastern Europe, Central Asia, East Asia, África Susahariana, North Africa, Oceanía y Oriente Medio"
    },
    country: "Switzerland",
    country_es: "Suiza",
    ciudad: "Ginebra, Suiza",
    continent: "europa",
    latitude: 46.948,
    longitude: 7.4474,
    website: "https://www.who.foundation/",
    email: "info@whofoundation.org"
  },
  {
    id: 402,
    name: "Comic Relief ",
    description_es: "Apoya enfoques innovadores para reducir la pobreza y la injusticia social.",
    description_en: "Supports innovative approaches to reducing poverty and social injustice.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia de Género, Salud Global, Derechos de las Infancias, Justicia Económica, Juventud",
      en: "Gender Justice, Global Health, Children's Rights, Economic Justice, Youth"
    },
    como_trabajan: {
      es: "Concesión de subvenciones, campañas públicas y asociaciones sin fines de lucro.",
      en: "Grantmaking, public campaigns, and nonprofit partnerships."
    },
    impacto_financiero: {
      es: " Asia Central, Asia Oriental, África Subsahariana, África del Norte, Europa Occidental",
      en: "Central Asia, East Asia, Sub-Saharan Africa, North Africa, Western Europe"
    },
    country: "United Kingdom",
    country_es: "Reino Unido",
    ciudad: "Londres, Reino Unido",
    continent: "europa",
    latitude: 51.5074,
    longitude: -0.1278,
    website: "https://www.comicrelief.com/",
    email: "info@comicrelief.com"
  },
  {
    id: 403,
    name: "Epic Foundation",
    description_es: "Dirige fondos a organizaciones de alto impacto que mejoran los resultados para niños y jóvenes.",
    description_en: "Directs funding to high-impact organizations improving outcomes for children and youth.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Derechos de las Infancias, Juventud, Educación de Calidad, Fortalecimiento de Capacidades Organizacionales",
      en: "Children's Rights, Youth, Quality Education, Organizational Capacity Building"
    },
    como_trabajan: {
      es: "Filantropía curada y seguimiento de impacto.",
      en: "Curated philanthropy and impact monitoring."
    },
    impacto_financiero: {
      es: "America del Norte, América Central, América del Sur, Europa Occidental, Europa del Este, Asia Central, Asia Oriental, África Susahariana, África del Norte, Oceanía y Oriente Medio",
      en: "America del Norte, Central America, South America, Western Europe, Eastern Europe, Central Asia, East Asia, África Susahariana, North Africa, Oceanía y Oriente Medio"
    },
    country: "France",
    country_es: "Francia",
    ciudad: "Nueva York, EE. UU. (Sede principal) / París, Francia",
    continent: "europa",
    latitude: 48.8566,
    longitude: 2.3522,
    website: "https://epic.foundation/",
    email: "info@epic.foundation"
  },
  {
    id: 404,
    name: "Good Energies Foundation",
    description_es: "Acelera la transición a la energía limpia y las soluciones de políticas climáticas.",
    description_en: "Accelerates clean energy transition and climate policy solutions.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Transición Energética, Justicia Climática, Conservación de Recursos Naturales",
      en: "Energy Transition, Climate Justice, Natural Resources Conservation"
    },
    como_trabajan: {
      es: "Subvenciones estratégicas y asociaciones políticas.",
      en: "Strategic grants and policy partnerships."
    },
    impacto_financiero: {
      es: "America del Norte, América Central, América del Sur, Europa Occidental, Europa del Este, Asia Central, Asia Oriental, África Susahariana, África del Norte, Oceanía y Oriente Medio",
      en: "America del Norte, Central America, South America, Western Europe, Eastern Europe, Central Asia, East Asia, África Susahariana, North Africa, Oceanía y Oriente Medio"
    },
    country: "Switzerland",
    country_es: "Suiza",
    ciudad: "Zug, Suiza",
    continent: "europa",
    latitude: 46.948,
    longitude: 7.4474,
    website: "https://www.goodenergies.org/",
    email: "info@porticus.com"
  },
  {
    id: 405,
    name: "Paul Hamlyn Foundation",
    description_es: "Promueve la justicia social a través de la educación, las artes y la participación.",
    description_en: "Promotes social justice through education, arts, and participation.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Derechos de Migrantes y Refugiados, Educación de Calidad, Justicia de Género, Movimientos Ciudadanos",
      en: "Rights of Migrants and Refugees, Quality Education, Gender Justice, Citizen Movements"
    },
    como_trabajan: {
      es: "Financiamiento de programas y asociaciones a largo plazo.",
      en: "Program funding and long-term partnerships."
    },
    impacto_financiero: {
      es: "Europa Occidental, Europa del Este, Asia Central",
      en: "Western Europe, Eastern Europe, Central Asia"
    },
    country: "United Kingdom",
    country_es: "Reino Unido",
    ciudad: "Londres, Reino Unido",
    continent: "europa",
    latitude: 51.5074,
    longitude: -0.1278,
    website: "https://www.phf.org.uk",
    email: "info@phf.org.uk"
  },
  {
    id: 406,
    name: "Blue Meridian Partners",
    description_es: "Escala soluciones comprobadas que mejoran la movilidad económica de familias y niños.",
    description_en: "Scales proven solutions that improve economic mobility for families and children.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Juventud, Justicia Económica, Movilidad Social, Fortalecimiento de Capacidades Organizacionales",
      en: "Youth, Economic Justice, Movilidad Social, Organizational Capacity Building"
    },
    como_trabajan: {
      es: "Filantropía colaborativa e inversiones mancomunadas.",
      en: "Collaborative philanthropy and pooled investments."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.bluemeridian.org",
    email: "info@bluemeridian.org"
  },
  {
    id: 407,
    name: "The Aziz Foundation",
    description_es: "Amplía el acceso a la educación y el liderazgo para las comunidades subrepresentadas.",
    description_en: "Expands access to education and leadership for underrepresented communities.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Educación de Calidad, Justicia Racial, Empoderamiento Comunitario",
      en: "Quality Education, Racial Justice, Empoderamiento Comunitario"
    },
    como_trabajan: {
      es: "Becas y programas de desarrollo de liderazgo.",
      en: "Scholarships and leadership development programs."
    },
    impacto_financiero: {
      es: "Europa Occidental, Europa del Este",
      en: "Western Europe, Eastern Europe"
    },
    country: "United Kingdom",
    country_es: "Reino Unido",
    ciudad: "Londres, Reino Unido",
    continent: "europa",
    latitude: 51.5074,
    longitude: -0.1278,
    website: "https://www.azizfoundation.org.uk/",
    email: "enquiries@azizfoundation.org.uk"
  },
  {
    id: 408,
    name: "Ubuntu Pathways",
    description_es: "Brinda apoyo integral que permite a los jóvenes de Sudáfrica alcanzar vías de empleo.",
    description_en: "Provides holistic support enabling youth in South Africa to reach employment pathways.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Educación de Calidad, Salud Global, Juventud, Justicia Económica",
      en: "Quality Education, Global Health, Youth, Economic Justice"
    },
    como_trabajan: {
      es: "Educación, servicios de salud y tutoría a largo plazo.",
      en: "Education, health services, and long-term mentorship."
    },
    impacto_financiero: {
      es: "África Subsahariana, África del Norte",
      en: "Sub-Saharan Africa, North Africa"
    },
    country: "Sudáfrica (Sede operativa) / Nueva York (Sede administrativa)",
    country_es: "Sudáfrica (Sede operativa) / Nueva York (Sede administrativa)",
    ciudad: "Port Elizabeth, Sudáfrica (Sede operativa) / Nueva York (Sede administrativa)",
    continent: "desconocido",
    latitude: 0,
    longitude: 0,
    website: "https://www.ubuntupathways.org/",
    email: "info@ubuntupathways.org"
  },
  {
    id: 409,
    name: "The Hellenic Initiative",
    description_es: "Apoya el emprendimiento y las iniciativas de recuperación económica en Grecia.",
    description_en: "Supports entrepreneurship and economic recovery initiatives in Greece.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Económica, Innovación Social, Emprendimiento",
      en: "Economic Justice, Social Innovation, Emprendimiento"
    },
    como_trabajan: {
      es: "Subvenciones, apoyo empresarial y asociaciones con la diáspora.",
      en: "Grants, business support, and diaspora partnerships."
    },
    impacto_financiero: {
      es: "Europa Occidental, Europa del Este",
      en: "Western Europe, Eastern Europe"
    },
    country: "Grecia",
    country_es: "Grecia",
    ciudad: "Nueva York, EE. UU. (Sede principal) / Atenas, Grecia",
    continent: "desconocido",
    latitude: 0,
    longitude: 0,
    website: "https://www.thehellenicinitiative.org/",
    email: "info@thehellenicinitiative.org"
  },
  {
    id: 410,
    name: "We Are All Human Foundation",
    description_es: "Promueve la inclusión y las oportunidades económicas para las comunidades latinas.",
    description_en: "Advances inclusion and economic opportunity for Latino communities.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Racial, Justicia Económica, Participación Ciudadana, Innovación Social",
      en: "Racial Justice, Economic Justice, Civic Participation, Social Innovation"
    },
    como_trabajan: {
      es: "Asociaciones de promoción y desarrollo de liderazgo.",
      en: "Leadership development and advocacy partnerships."
    },
    impacto_financiero: {
      es: "America del Norte, América Central, América del Sur, Europa Occidental, Europa del Este, Asia Central, Asia Oriental, África Susahariana, África del Norte, Oceanía y Oriente Medio",
      en: "America del Norte, Central America, South America, Western Europe, Eastern Europe, Central Asia, East Asia, África Susahariana, North Africa, Oceanía y Oriente Medio"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.weareallhuman.org/",
    email: "info@weareallhuman.org"
  },
  {
    id: 411,
    name: "Changing Our World ",
    description_es: "Asesora a organizaciones filantrópicas para maximizar el impacto y las donaciones estratégicas.",
    description_en: "Advises philanthropies to maximize impact and strategic giving.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Fortalecimiento de Capacidades Organizacionales, Innovación Social",
      en: "Organizational Capacity Building, Social Innovation"
    },
    como_trabajan: {
      es: "Servicios de asesoramiento filantrópico y apoyo para la concesión de subvenciones.",
      en: "Philanthropic advisory services and grantmaking support."
    },
    impacto_financiero: {
      es: "America del Norte, América Central, América del Sur, Europa Occidental, Europa del Este, Asia Central, Asia Oriental, África Susahariana, África del Norte, Oceanía y Oriente Medio",
      en: "America del Norte, Central America, South America, Western Europe, Eastern Europe, Central Asia, East Asia, África Susahariana, North Africa, Oceanía y Oriente Medio"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://changingourworld.com",
    email: "N/I"
  },
  {
    id: 412,
    name: "Global Community Engagement and Resilience Fund",
    description_es: "Fortalece las respuestas locales para prevenir el extremismo violento.",
    description_en: "Strengthens local responses to prevent violent extremism.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Paz y Resolución de Conflictos, Juventud, Gobernanza Global, políticas y rendición de cuentas",
      en: "Peace and Conflict Resolution, Youth, Gobernanza Global, políticas y rendición de cuentas"
    },
    como_trabajan: {
      es: "Subvenciones comunitarias y desarrollo de capacidades de la sociedad civil.",
      en: "Community grants and civil society capacity-building."
    },
    impacto_financiero: {
      es: "America del Norte, América Central, América del Sur, Europa Occidental, Europa del Este, Asia Central, Asia Oriental, África Susahariana, África del Norte, Oceanía y Oriente Medio",
      en: "America del Norte, Central America, South America, Western Europe, Eastern Europe, Central Asia, East Asia, África Susahariana, North Africa, Oceanía y Oriente Medio"
    },
    country: "Switzerland",
    country_es: "Suiza",
    ciudad: "Ginebra, Suiza",
    continent: "europa",
    latitude: 46.948,
    longitude: 7.4474,
    website: "https://www.gcerf.org",
    email: "info@gcerf.org"
  },
  {
    id: 413,
    name: "The Wallace Foundation",
    description_es: "Mejora el liderazgo educativo y los sistemas de aprendizaje extraescolar.",
    description_en: "Improves education leadership and out-of-school learning systems.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Educación de Calidad, Ciudades Sustentables (Artes), Fortalecimiento de Capacidades Organizacionales",
      en: "Quality Education, Ciudades Sustentables (Artes), Organizational Capacity Building"
    },
    como_trabajan: {
      es: "Financiamiento basado en la investigación y asociaciones de sistemas.",
      en: "Research-based funding and system partnerships."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.wallacefoundation.org/",
    email: "info@wallacefoundation.org"
  },
  {
    id: 414,
    name: "Quadrature Climate Foundation",
    description_es: "Apoya los esfuerzos científicos y políticos para acelerar la acción climática.",
    description_en: "Supports science and policy efforts to accelerate climate action.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Climática, Transición Energética, Gobernanza Global, políticas y rendición de cuentas",
      en: "Climate Justice, Energy Transition, Gobernanza Global, políticas y rendición de cuentas"
    },
    como_trabajan: {
      es: "Subvenciones estratégicas y colaboraciones de investigación.",
      en: "Strategic grants and research partnerships."
    },
    impacto_financiero: {
      es: "America del Norte, América Central, América del Sur, Europa Occidental, Europa del Este, Asia Central, Asia Oriental, África Susahariana, África del Norte, Oceanía y Oriente Medio",
      en: "America del Norte, Central America, South America, Western Europe, Eastern Europe, Central Asia, East Asia, África Susahariana, North Africa, Oceanía y Oriente Medio"
    },
    country: "United Kingdom",
    country_es: "Reino Unido",
    ciudad: "Londres, Reino Unido",
    continent: "europa",
    latitude: 51.5074,
    longitude: -0.1278,
    website: "https://www.qc.foundation",
    email: "contact@qc.foundation"
  },
  {
    id: 415,
    name: "Swiss Solidarity",
    description_es: "Financia ayuda humanitaria y respuestas de desarrollo a crisis globales.",
    description_en: "Funds humanitarian aid and development responses to global crises.",
    tipo_de_org: {
      es: "Organización Comunitaria",
      en: "Community Organization"
    },
    enfoque: {
      es: "Derechos de Migrantes y Refugiados, Socorro en Desastres, Salud Global",
      en: "Rights of Migrants and Refugees, Socorro en Desastres, Global Health"
    },
    como_trabajan: {
      es: "Recaudación de fondos públicos y subvenciones de socios.",
      en: "Public fundraising and partner grants."
    },
    impacto_financiero: {
      es: "América Central, América del Sur, Europa Occidental, Europa del Este, Asia Central, Asia Oriental, África Susahariana, África del Norte, ",
      en: "Central America, South America, Western Europe, Eastern Europe, Central Asia, East Asia, África Susahariana, North Africa, "
    },
    country: "Switzerland",
    country_es: "Suiza",
    ciudad: "Ginebra, Suiza",
    continent: "europa",
    latitude: 46.948,
    longitude: 7.4474,
    website: "https://www.swiss-solidarity.org/",
    email: "info@glueckskette.ch"
  },
  {
    id: 416,
    name: "Overdeck Family Foundation",
    description_es: "Impulsa la innovación educativa basada en el aprendizaje de la ciencia y la investigación.",
    description_en: "Advances education innovation grounded in learning science and research.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Educación de Calidad, Juventud, Innovación Social",
      en: "Quality Education, Youth, Social Innovation"
    },
    como_trabajan: {
      es: "Financiamiento de la investigación y asociaciones educativas.",
      en: "Research funding and education partnerships."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://overdeck.org/",
    email: "info@overdeckfoundation.org"
  },
  {
    id: 417,
    name: "Stelios Philanthropic Foundation",
    description_es: "Promueve el emprendimiento y la educación en toda Europa.",
    description_en: "Promotes entrepreneurship and education across Europe.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Educación de Calidad, Innovación Social, Paz y Resolución de Conflictos",
      en: "Quality Education, Social Innovation, Peace and Conflict Resolution"
    },
    como_trabajan: {
      es: "Premios, subvenciones y programas de formación.",
      en: "Awards, grants, and training programs."
    },
    impacto_financiero: {
      es: "Europa Occidental, Europa del Este",
      en: "Western Europe, Eastern Europe"
    },
    country: "",
    country_es: "Mónaco / Londres / Atenas (Multisede)",
    ciudad: "Mónaco / Londres / Atenas (Multisede)",
    continent: "desconocido",
    latitude: 0,
    longitude: 0,
    website: "https://stelios.org/",
    email: "philanthropy@easygroup.co.uk"
  },
  {
    id: 418,
    name: "Freedom Together Foundation",
    description_es: "Desarrolla capacidad a largo plazo para los movimientos democráticos y de justicia racial.",
    description_en: "Builds long-term capacity for democracy and racial justice movements.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Democracia, Movimientos Ciudadanos, Justicia Racial",
      en: "Democracy, Citizen Movements, Racial Justice"
    },
    como_trabajan: {
      es: "Financiamiento y alianzas alineados con el movimiento.",
      en: "Movement-aligned funding and partnerships."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United Kingdom",
    country_es: "Reino Unido",
    ciudad: "Londres, Reino Unido",
    continent: "europa",
    latitude: 51.5074,
    longitude: -0.1278,
    website: "https://www.freedomtogether.org",
    email: "info@freedomtogether.org"
  },
  {
    id: 419,
    name: "Rochester Area Community Foundation",
    description_es: "Fortalece el bienestar comunitario a través de la filantropía local.",
    description_en: "Strengthens community wellbeing through local philanthropy.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Educación de Calidad, Ciudades Sustentables, Justicia Económica",
      en: "Quality Education, Sustainable Cities, Economic Justice"
    },
    como_trabajan: {
      es: "Subvenciones comunitarias y participación de donantes.",
      en: "Community grants and donor engagement."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Rochester, Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://www.racf.org/",
    email: "info@racf.org"
  },
  {
    id: 420,
    name: "The Iris Project",
    description_es: "Amplía el acceso a la educación para niños refugiados y desplazados.",
    description_en: "Expands access to education for refugee and displaced children.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Juventud, Justicia Climática, Movimientos Ciudadanos",
      en: "Youth, Climate Justice, Citizen Movements"
    },
    como_trabajan: {
      es: "Programas educativos y promoción.",
      en: "Education programs and advocacy."
    },
    impacto_financiero: {
      es: "Europa del Este",
      en: "Eastern Europe"
    },
    country: "United Kingdom",
    country_es: "Reino Unido",
    ciudad: "Londres, Reino Unido",
    continent: "europa",
    latitude: 51.5074,
    longitude: -0.1278,
    website: "https://www.theirisproject.org",
    email: "info@theirisproject.org"
  },
  {
    id: 421,
    name: "The Fore",
    description_es: "Fortalece el liderazgo y la resiliencia dentro de las organizaciones benéficas del Reino Unido.",
    description_en: "Strengthens leadership and resilience within UK charities.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Fortalecimiento de Capacidades Organizacionales, Innovación Social, Justicia Económica",
      en: "Organizational Capacity Building, Social Innovation, Economic Justice"
    },
    como_trabajan: {
      es: "Financiamiento irrestricto y desarrollo de habilidades.",
      en: "Unrestricted funding and skills development."
    },
    impacto_financiero: {
      es: "Europa Occidental, Europa del Este",
      en: "Western Europe, Eastern Europe"
    },
    country: "United Kingdom",
    country_es: "Reino Unido",
    ciudad: "Londres, Reino Unido",
    continent: "europa",
    latitude: 51.5074,
    longitude: -0.1278,
    website: "https://thefore.org/",
    email: "info@thefore.org"
  },
  {
    id: 422,
    name: "10x10 Philanthropy",
    description_es: "Involucra a jóvenes profesionales en donaciones colectivas para lograr un impacto social.",
    description_en: "Engages young professionals in collective giving for social impact.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Innovación Social, Fortalecimiento de Capacidades Organizacionales, Juventud",
      en: "Social Innovation, Organizational Capacity Building, Youth"
    },
    como_trabajan: {
      es: "Círculos de donación y asociaciones sin fines de lucro.",
      en: "Giving circles and nonprofit partnerships."
    },
    impacto_financiero: {
      es: "Oceanía",
      en: "Oceania"
    },
    country: "Australia (Sede principal) / Londres / Nueva York",
    country_es: "Australia (Sede principal) / Londres / Nueva York",
    ciudad: "Sídney, Australia (Sede principal) / Londres / Nueva York",
    continent: "desconocido",
    latitude: 0,
    longitude: 0,
    website: "https://10x10act.org",
    email: "info@10x10philanthropy.com"
  },
  {
    id: 423,
    name: "Purpose ",
    description_es: "Construye movimientos sociales a través del cambio narrativo y la estrategia.",
    description_en: "Builds social movements through narrative change and strategy.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Movimientos Ciudadanos, Participación Ciudadana, Derechos Digitales, Justicia Climática",
      en: "Citizen Movements, Civic Participation, Digital Rights, Climate Justice"
    },
    como_trabajan: {
      es: "Diseño de campañas y apoyo al movimiento.",
      en: "Campaign design and movement support."
    },
    impacto_financiero: {
      es: "America del Norte, América Central, América del Sur, Europa Occidental, Europa del Este, Asia Central, Asia Oriental, África Susahariana, África del Norte, Oceanía y Oriente Medio",
      en: "America del Norte, Central America, South America, Western Europe, Eastern Europe, Central Asia, East Asia, África Susahariana, North Africa, Oceanía y Oriente Medio"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://purpose.org",
    email: "info@purpose.com"
  },
  {
    id: 424,
    name: "The Baobab Foundation",
    description_es: "Apoya soluciones de conservación y desarrollo comunitario lideradas por África.",
    description_en: "Supports African-led conservation and community development solutions.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia Racial, Justicia Económica, Fortalecimiento de Capacidades Organizacionales, Movimientos Ciudadanos",
      en: "Racial Justice, Economic Justice, Organizational Capacity Building, Citizen Movements"
    },
    como_trabajan: {
      es: "Subvenciones y colaboraciones locales.",
      en: "Grants and local partnerships."
    },
    impacto_financiero: {
      es: "África Subsahariana, África del Norte",
      en: "Sub-Saharan Africa, North Africa"
    },
    country: "United Kingdom",
    country_es: "Reino Unido",
    ciudad: "Londres, Reino Unido",
    continent: "europa",
    latitude: 51.5074,
    longitude: -0.1278,
    website: "https://www.baobabfoundation.org.uk/",
    email: "info@thebaobabfoundation.org"
  },
  {
    id: 425,
    name: "Third Wave Fund",
    description_es: "Recursos sobre movimientos liderados por jóvenes que promueven la justicia de género.",
    description_en: "Resources youth-led movements advancing gender justice.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "LGTBIQ+, Justicia de Género, Juventud, Movimientos Ciudadanos",
      en: "LGBTIQ+, Gender Justice, Youth, Citizen Movements"
    },
    como_trabajan: {
      es: "Subvenciones flexibles y asociaciones de movimiento.",
      en: "Flexible grants and movement partnerships."
    },
    impacto_financiero: {
      es: "América del Norte",
      en: "North America"
    },
    country: "United States",
    country_es: "Estados Unidos",
    ciudad: "Nueva York, EE. UU.",
    continent: "america",
    latitude: 38.9072,
    longitude: -77.0369,
    website: "https://thirdwavefund.org/",
    email: "info@thirdwavefund.org"
  }
];
 

// Continentes para el filtro de Impacto Financiero
const CONTINENTS = [
  { id: "africa", name_es: "África", name_en: "Africa" },
  { id: "asia", name_es: "Asia", name_en: "Asia" },
  { id: "europa", name_es: "Europa", name_en: "Europe" },
  { id: "america_norte", name_es: "América del Norte", name_en: "North America" },
  { id: "america_central", name_es: "América Central", name_en: "Central America" },
  { id: "america_sur", name_es: "América del Sur", name_en: "South America" },
  { id: "oceania", name_es: "Oceanía", name_en: "Oceania" }
];

// Lista de todos los países únicos
const ALL_COUNTRIES = Object.keys(COUNTRY_COORDINATES).sort();

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

// Componente de Marcadores Agrupados
function ClusteredMarkers({ markers, onOrganizationsClick, language }) {
  if (!markers || markers.length === 0) {
    return null;
  }
  
  return (
    <>
      {markers.map((marker, idx) => {
        if (!marker.latitude || !marker.longitude) return null;
        
        return (
          <CircleMarker
            key={`marker-${idx}-${marker.country}`}
            center={[marker.latitude, marker.longitude]}
            radius={20}
            pathOptions={{
              fillColor: '#22C55E',
              fillOpacity: 0.8,
              color: '#0F172A',
              weight: 3
            }}
            eventHandlers={{
              click: () => onOrganizationsClick(marker.organizations)
            }}
          >
            <Tooltip>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontWeight: 'bold' }}>{marker.country}</div>
                <div style={{ fontSize: '0.875rem' }}>
                  {marker.count} {language === 'es' ? 'organizaciones' : 'organizations'}
                </div>
              </div>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </>
  );
}

// Componente de Modal de Organización
function OrganizationModal({ organizations, onClose, language }) {
  const t = {
    es: {
      close: "Cerrar",
      website: "Sitio web",
      email: "Correo electrónico",
      organizations: "organizaciones",
      workMethodology: "Cómo trabajan",
      focus: "Enfoque",
      orgType: "Tipo de Organización",
      description: "Descripción",
      location: "Ubicación",
      financialImpact: "Impacto Financiero"
    },
    en: {
      close: "Close",
      website: "Website",
      email: "Email",
      organizations: "organizations",
      workMethodology: "Work Methodology",
      focus: "Focus",
      orgType: "Organization Type",
      description: "Description",
      location: "Location",
      financialImpact: "Financial Impact"
    }
  };
  
  const texts = t[language];
  
  return (
    <>
      {/* Overlay difuminado */}
      <div 
        className="fixed inset-0 bg-opacity-50 backdrop-blur-sm z-[1000] transition-opacity duration-300"
        onClick={onClose}
        style={{ backdropFilter: 'blur(6px)', backgroundColor: 'rgba(15, 23, 42, 0.5)' }}
      />
      
      {/* Modal centrado */}
      <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4">
        <div 
          className="rounded-3xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
          style={{ backgroundColor: '#FFFFFF' }}
        >
          {/* Header */}
          <div className="px-8 py-6 border-b" style={{ backgroundColor: '#E5E7EB', borderColor: '#E5E7EB' }}>
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-1 font-cursive" style={{ color: '#0F172A' }}>
                  {organizations[0]?.country}
                </h2>
                <p className="text-sm" style={{ color: '#0F172A' }}>
                  {organizations.length} {texts.organizations}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg transition-all hover:opacity-80"
                style={{ backgroundColor: '#E5E7EB', color: '#0F172A' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          {/* Lista de organizaciones con scroll */}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            <div className="space-y-5">
              {organizations.map((org) => (
                <div 
                  key={org.id} 
                  className="rounded-lg p-6 border transition-all hover:opacity-90"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E5E7EB'
                  }}
                >
                  {/* Nombre */}
                  <h3 className="text-xl font-bold mb-4" style={{ color: '#0F172A' }}>
                    {org.name}
                  </h3>
                  
                  {/* Cómo trabajan */}
                  {org.como_trabajan && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2" style={{ color: '#22C55E' }}>
                        {texts.workMethodology}
                      </h4>
                      <p className="text-sm leading-relaxed" style={{ color: '#0F172A' }}>
                        {language === 'es' 
                          ? (org.como_trabajan.es || org.como_trabajan) 
                          : (org.como_trabajan.en || org.como_trabajan)}
                      </p>
                    </div>
                  )}
                  
                  {/* Enfoque */}
                  {org.enfoque && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2" style={{ color: '#22C55E' }}>
                        {texts.focus}
                      </h4>
                      <p className="text-sm" style={{ color: '#0F172A' }}>
                        {language === 'es' ? (org.enfoque.es || org.enfoque) : (org.enfoque.en || org.enfoque)}
                      </p>
                    </div>
                  )}
                  
                  {/* Tipo de Organización */}
                  {org.tipo_de_org && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2" style={{ color: '#22C55E' }}>
                        {texts.orgType}
                      </h4>
                      <p className="text-sm" style={{ color: '#0F172A' }}>
                        {language === 'es' ? (org.tipo_de_org.es || org.tipo_de_org) : (org.tipo_de_org.en || org.tipo_de_org)}
                      </p>
                    </div>
                  )}
                  
                  {/* Descripción */}
                  {(org.description_es || org.description_en) && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2" style={{ color: '#22C55E' }}>
                        {texts.description}
                      </h4>
                      <p className="text-sm leading-relaxed" style={{ color: '#0F172A' }}>
                        {language === 'es' ? org.description_es : org.description_en}
                      </p>
                    </div>
                  )}
                  
                  {/* Impacto Financiero */}
                  {org.impacto_financiero && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2" style={{ color: '#22C55E' }}>
                        {texts.financialImpact}
                      </h4>
                      <p className="text-sm" style={{ color: '#0F172A' }}>
                        {language === 'es' ? (org.impacto_financiero.es || org.impacto_financiero) : (org.impacto_financiero.en || org.impacto_financiero)}
                      </p>
                    </div>
                  )}
                  
                  {/* Contacto */}
                  <div className="pt-4 border-t space-y-2" style={{ borderColor: '#E5E7EB' }}>
                    {org.website && (
                      <a 
                        href={org.website} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-2 text-sm transition-colors hover:underline"
                        style={{ color: '#22C55E' }}
                      >
                        <Globe className="w-4 h-4" />
                        <span>{texts.website}</span>
                      </a>
                    )}
                    
                    {org.email && (
                      <div className="flex items-center gap-2 text-sm" style={{ color: '#0F172A' }}>
                        <span className="w-4 h-4 flex items-center justify-center text-xs">@</span>
                        <span>{org.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Footer */}
          <div className="px-8 py-5 border-t" style={{ backgroundColor: '#E5E7EB', borderColor: '#E5E7EB' }}>
            <button
              onClick={onClose}
              className="w-full rounded-lg py-3 font-semibold transition-all hover:opacity-90"
              style={{ backgroundColor: '#22C55E', color: '#FFFFFF' }}
            >
              {texts.close}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Componente Principal
export default function Dashboard() {
  const [language, setLanguage] = useState('es');
  const [filters, setFilters] = useState({
    type: "all",
    focus: "all",
    continent: "all",
    country: "all",
    financialImpact: "all"
  });
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [showFilters, setShowFilters] = useState(true);
  const [showRegionSelector, setShowRegionSelector] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [mapCenter, setMapCenter] = useState([20, 0]);
  const [mapZoom, setMapZoom] = useState(2);
  const [searchQuery, setSearchQuery] = useState('');
  const [countrySearch, setCountrySearch] = useState('');
  const [viewMode, setViewMode] = useState('map'); // 'map' o 'list'

  const translations = {
    es: {
      title: "Mapa de Organizaciones",
      filters: "Filtros",
      hideFilters: "Ocultar Filtros",
      showFilters: "Mostrar Filtros",
      regions: "Regiones",
      hideRegions: "Ocultar Regiones",
      showRegions: "Mostrar Regiones",
      organizations: "organizaciones",
      filteredBy: "Filtrado por",
      type: "Tipo",
      focus: "Enfoque",
      country: "País",
      financialImpact: "Impacto Financiero",
      allTypes: "Todos los tipos",
      allFocus: "Todos los enfoques",
      allCountries: "Todos los países",
      allContinents: "Todos los continentes",
      clearFilters: "Limpiar filtros",
      searchPlaceholder: "Buscar organizaciones...",
      searchCountryPlaceholder: "Buscar país...",
      mapView: "Vista Mapa",
      listView: "Vista Lista",
      viewDetails: "Ver detalles",
      types: {
        fundacion: "Fundación",
        ong: "ONG",
        movimiento_social: "Movimiento Social",
        colectivo: "Colectivo",
        red: "Red",
        alianza: "Alianza"
      },
      focuses: {
        justicia_climatica: "Justicia Climática",
        conservacion: "Conservación",
        transicion_energetica: "Transición Energética",
        comunidades_indigenas: "Comunidades Indígenas",
        ciudades_sustentables: "Ciudades Sustentables",
        soberania_alimentaria: "Soberanía Alimentaria",
        democracia: "Democracia",
        justicia_genero: "Justicia de Género",
        justicia_racial: "Justicia Racial",
        justicia_economica: "Justicia Económica",
        salud_global: "Salud Global",
        educacion: "Educación de Calidad",
        derechos_infancias: "Derechos de las Infancias",
        juventud: "Juventud",
        lgbtiq: "LGBTIQ+",
        innovacion_social: "Innovación Social",
        paz_conflictos: "Paz y Resolución de Conflictos",
        participacion_ciudadana: "Participación Ciudadana",
        gobernanza_global: "Gobernanza Global",
        proteccion_ninez: "Protección de la Niñez"
      }
    },
    en: {
      title: "Organizations Map",
      filters: "Filters",
      hideFilters: "Hide Filters",
      showFilters: "Show Filters",
      regions: "Regions",
      hideRegions: "Hide Regions",
      showRegions: "Show Regions",
      organizations: "organizations",
      filteredBy: "Filtered by",
      type: "Type",
      focus: "Focus",
      country: "Country",
      financialImpact: "Financial Impact",
      allTypes: "All types",
      allFocus: "All focuses",
      allCountries: "All countries",
      allContinents: "All continents",
      clearFilters: "Clear filters",
      searchPlaceholder: "Search organizations...",
      searchCountryPlaceholder: "Search country...",
      mapView: "Map View",
      listView: "List View",
      viewDetails: "View details",
      types: {
        fundacion: "Foundation",
        ong: "NGO",
        movimiento_social: "Social Movement",
        colectivo: "Collective",
        red: "Network",
        alianza: "Alliance"
      },
      focuses: {
        justicia_climatica: "Climate Justice",
        conservacion: "Conservation",
        transicion_energetica: "Energy Transition",
        comunidades_indigenas: "Indigenous Communities",
        ciudades_sustentables: "Sustainable Cities",
        soberania_alimentaria: "Food Sovereignty",
        democracia: "Democracy",
        justicia_genero: "Gender Justice",
        justicia_racial: "Racial Justice",
        justicia_economica: "Economic Justice",
        salud_global: "Global Health",
        educacion: "Quality Education",
        derechos_infancias: "Children's Rights",
        juventud: "Youth",
        lgbtiq: "LGBTIQ+",
        innovacion_social: "Social Innovation",
        paz_conflictos: "Peace and Conflict Resolution",
        participacion_ciudadana: "Citizen Participation",
        gobernanza_global: "Global Governance",
        proteccion_ninez: "Child Protection"
      }
    }
  };

  const t = translations[language];

  const handleClearRegion = () => {
    setSelectedRegion(null);
    setMapCenter([20, 0]);
    setMapZoom(2);
    setFilters({ ...filters, continent: "all", country: "all" });
  };

  const filteredOrgs = useMemo(() => {
    return organizationsData.filter(org => {
      // Filtro de búsqueda por nombre
      if (searchQuery && !org.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      if (filters.type !== "all" && org.type !== filters.type) return false;
      if (filters.focus !== "all" && org.focus !== filters.focus) return false;
      if (filters.continent !== "all" && org.continent !== filters.continent) return false;
      if (filters.country !== "all" && org.country !== filters.country) return false;
      if (filters.financialImpact !== "all" && org.continent !== filters.financialImpact) return false;
      return true;
    });
  }, [filters, searchQuery]);

  // Filtrar países basándose en la búsqueda
  const filteredCountries = useMemo(() => {
    if (!countrySearch) return ALL_COUNTRIES;
    return ALL_COUNTRIES.filter(country => 
      country.toLowerCase().includes(countrySearch.toLowerCase())
    );
  }, [countrySearch]);

  const markers = useMemo(() => {
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
    return Object.values(orgsByCountry);
  }, [filteredOrgs]);

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ backgroundColor: '#E5E7EB' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital@1&family=Manrope:wght@400;500;600;700&display=swap');
        
        body {
          font-family: 'Manrope', sans-serif;
        }
        
        .font-cursive {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
        }
        
        .leaflet-container {
          height: 100%;
          width: 100%;
          border-radius: 24px;
          z-index: 1;
          background: #E5E7EB;
        }
        
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
        }
        
        .leaflet-control-zoom {
          border: 2px solid #E5E7EB !important;
          border-radius: 12px !important;
        }
        
        .leaflet-control-zoom a {
          border-radius: 8px !important;
        }
        
        .leaflet-interactive {
          cursor: pointer !important;
        }
        
        .leaflet-tile-container {
          opacity: 1;
        }
        
        body.modal-open {
          overflow: hidden;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
      
      {/* Header */}
      <div className="max-w-[1600px] mx-auto mb-6">
        <div className="rounded-3xl p-6 md:p-8 shadow-lg" style={{ backgroundColor: '#FFFFFF' }}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 font-cursive" style={{ color: '#0F172A' }}>
                {t.title}
              </h1>
            </div>
            
            <div className="flex gap-3">
              <div className="rounded-2xl p-1 flex gap-1" style={{ backgroundColor: '#E5E7EB' }}>
                <button
                  onClick={() => setLanguage('es')}
                  className={`px-4 py-2 rounded-xl transition-all font-medium ${
                    language === 'es' ? 'shadow' : ''
                  }`}
                  style={language === 'es' ? {
                    backgroundColor: '#FFFFFF',
                    color: '#0F172A'
                  } : {
                    color: '#0F172A'
                  }}
                >
                  ES
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-4 py-2 rounded-xl transition-all font-medium ${
                    language === 'en' ? 'shadow' : ''
                  }`}
                  style={language === 'en' ? {
                    backgroundColor: '#FFFFFF',
                    color: '#0F172A'
                  } : {
                    color: '#0F172A'
                  }}
                >
                  EN
                </button>
              </div>
            </div>
          </div>
          
          {/* Barra de búsqueda */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#22C55E' }} />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl transition-all"
              style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #E5E7EB',
                color: '#0F172A'
              }}
              onFocus={(e) => e.target.style.borderColor = '#22C55E'}
              onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
            />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-[1600px] mx-auto mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="rounded-xl px-4 py-3 flex items-center gap-2 transition-all hover:opacity-90"
              style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #E5E7EB',
                color: '#0F172A'
              }}
            >
              <Filter className="w-5 h-5" style={{ color: '#22C55E' }} />
              {showFilters ? t.hideFilters : t.showFilters}
            </button>

            <button
              onClick={() => setShowRegionSelector(!showRegionSelector)}
              className="rounded-xl px-4 py-3 flex items-center gap-2 transition-all hover:opacity-90"
              style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #E5E7EB',
                color: '#0F172A'
              }}
            >
              <Layers className="w-5 h-5" style={{ color: '#22C55E' }} />
              {showRegionSelector ? t.hideRegions : t.showRegions}
            </button>

            {/* Botones de vista */}
            <button
              onClick={() => setViewMode('map')}
              className="rounded-xl px-4 py-3 flex items-center gap-2 transition-all hover:opacity-90"
              style={{
                backgroundColor: viewMode === 'map' ? '#22C55E' : '#FFFFFF',
                border: '2px solid #E5E7EB',
                color: viewMode === 'map' ? '#FFFFFF' : '#0F172A'
              }}
            >
              <MapIcon className="w-5 h-5" />
              {t.mapView}
            </button>

            <button
              onClick={() => setViewMode('list')}
              className="rounded-xl px-4 py-3 flex items-center gap-2 transition-all hover:opacity-90"
              style={{
                backgroundColor: viewMode === 'list' ? '#22C55E' : '#FFFFFF',
                border: '2px solid #E5E7EB',
                color: viewMode === 'list' ? '#FFFFFF' : '#0F172A'
              }}
            >
              <List className="w-5 h-5" />
              {t.listView}
            </button>

            {selectedRegion && (
              <div className="px-4 py-3 rounded-xl flex items-center gap-2" style={{
                backgroundColor: '#FFFFFF',
                border: '2px solid #22C55E'
              }}>
                <span className="text-sm font-semibold" style={{ color: '#0F172A' }}>{t.filteredBy}:</span>
                <span className="text-sm font-bold" style={{ color: '#22C55E' }}>{selectedRegion.name}</span>
                <button
                  onClick={handleClearRegion}
                  className="ml-2 rounded-full p-1 transition-colors"
                  style={{ backgroundColor: '#E5E7EB' }}
                >
                  <X className="w-4 h-4" style={{ color: '#F59E0B' }} />
                </button>
              </div>
            )}
          </div>

          <div className="px-6 py-3 rounded-xl flex items-center gap-2" style={{
            backgroundColor: '#FFFFFF',
            border: '2px solid #E5E7EB'
          }}>
            <Building2 className="w-5 h-5" style={{ color: '#F59E0B' }} />
            <span className="font-semibold" style={{ color: '#22C55E' }}>
              {filteredOrgs.length} {t.organizations}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Panel */}
          {showFilters && (
            <div className="lg:col-span-1">
              <div className="rounded-3xl p-6 shadow-lg space-y-6" style={{ backgroundColor: '#FFFFFF' }}>
                <h3 className="text-xl font-bold" style={{ color: '#0F172A' }}>{t.filters}</h3>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#0F172A' }}>
                    {t.type}
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    className="w-full rounded-xl px-4 py-3 text-sm transition-all"
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '2px solid #E5E7EB',
                      color: '#0F172A'
                    }}
                  >
                    <option value="all">{t.allTypes}</option>
                    {Object.entries(t.types).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#0F172A' }}>
                    {t.focus}
                  </label>
                  <select
                    value={filters.focus}
                    onChange={(e) => setFilters({ ...filters, focus: e.target.value })}
                    className="w-full rounded-xl px-4 py-3 text-sm transition-all"
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '2px solid #E5E7EB',
                      color: '#0F172A'
                    }}
                  >
                    <option value="all">{t.allFocus}</option>
                    {Object.entries(t.focuses).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#0F172A' }}>
                    {t.financialImpact}
                  </label>
                  <select
                    value={filters.financialImpact}
                    onChange={(e) => setFilters({ ...filters, financialImpact: e.target.value })}
                    className="w-full rounded-xl px-4 py-3 text-sm transition-all"
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '2px solid #E5E7EB',
                      color: '#0F172A'
                    }}
                  >
                    <option value="all">{t.allContinents}</option>
                    {CONTINENTS.map((continent) => (
                      <option key={continent.id} value={continent.id}>
                        {language === 'es' ? continent.name_es : continent.name_en}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#0F172A' }}>
                    {t.country}
                  </label>
                  
                  {/* Barra de búsqueda de países */}
                  <div className="relative mb-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: '#22C55E' }} />
                    <input
                      type="text"
                      placeholder={t.searchCountryPlaceholder}
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg text-sm transition-all"
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '2px solid #E5E7EB',
                        color: '#0F172A'
                      }}
                    />
                  </div>
                  
                  <select
                    value={filters.country}
                    onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                    className="w-full rounded-xl px-4 py-3 text-sm transition-all"
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '2px solid #E5E7EB',
                      color: '#0F172A'
                    }}
                  >
                    <option value="all">{t.allCountries}</option>
                    {filteredCountries.map((country) => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                {(filters.type !== 'all' || filters.focus !== 'all' || filters.country !== 'all' || filters.financialImpact !== 'all') && (
                  <button
                    onClick={() => setFilters({ type: 'all', focus: 'all', continent: 'all', country: 'all', financialImpact: 'all' })}
                    className="w-full rounded-xl py-3 font-medium transition-all hover:opacity-90"
                    style={{
                      backgroundColor: '#E5E7EB',
                      color: '#0F172A'
                    }}
                  >
                    {t.clearFilters}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Map/List Section */}
          <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
            {viewMode === 'list' ? (
              /* Vista de Lista - 3-4 por fila */
              <div className="rounded-3xl p-6 shadow-lg" style={{ backgroundColor: '#FFFFFF' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                  {filteredOrgs.map((org) => (
                    <div
                      key={org.id}
                      className="rounded-xl p-5 border-2 transition-all hover:shadow-md cursor-pointer flex flex-col"
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderColor: '#E5E7EB'
                      }}
                      onClick={() => setSelectedOrganization([org])}
                    >
                      <div className="mb-3">
                        <h3 className="text-lg font-bold mb-2 line-clamp-2" style={{ color: '#0F172A' }}>
                          {org.name}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span
                            className="px-2 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: '#E5E7EB',
                              color: '#0F172A'
                            }}
                          >
                            {language === 'es' ? (org.tipo_de_org?.es || org.tipo_de_org) : (org.tipo_de_org?.en || org.tipo_de_org)}
                          </span>
                          <span
                            className="px-2 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: '#22C55E',
                              color: '#FFFFFF'
                            }}
                          >
                            {org.country}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm mb-3 line-clamp-3 flex-grow" style={{ color: '#0F172A' }}>
                        {language === 'es' ? org.description_es : org.description_en}
                      </p>

                      <div className="space-y-2 mb-3">
                        {org.enfoque && (
                          <div>
                            <h4 className="text-xs font-semibold mb-1" style={{ color: '#22C55E' }}>
                              {language === 'es' ? 'Enfoque' : 'Focus'}
                            </h4>
                            <p className="text-xs line-clamp-2" style={{ color: '#0F172A' }}>
                              {language === 'es' ? (org.enfoque.es || org.enfoque) : (org.enfoque.en || org.enfoque)}
                            </p>
                          </div>
                        )}
                      </div>

                      {org.website && (
                        <div className="pt-3 mt-auto border-t" style={{ borderColor: '#E5E7EB' }}>
                          <a
                            href={`https://${org.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-xs hover:underline"
                            style={{ color: '#22C55E' }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Globe className="w-4 h-4" />
                            {t.viewDetails}
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Vista de Mapa */
              <div className="grid lg:grid-cols-4 gap-6">
                {/* Region Selector */}
                {showRegionSelector && (
                  <div className="lg:col-span-1">
                    <div className="rounded-3xl p-6 shadow-lg space-y-4" style={{ backgroundColor: '#FFFFFF' }}>
                      <h3 className="text-xl font-bold" style={{ color: '#0F172A' }}>{t.regions}</h3>
                      
                      <div className="space-y-2">
                        {ALL_COUNTRIES.map((country) => (
                          <button
                            key={country}
                            onClick={() => setFilters({ ...filters, country: country })}
                            className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                              filters.country === country
                                ? 'font-semibold'
                                : 'hover:opacity-80'
                            }`}
                            style={filters.country === country ? {
                              backgroundColor: '#22C55E',
                              color: '#FFFFFF'
                            } : {
                              backgroundColor: '#E5E7EB',
                              color: '#0F172A'
                            }}
                          >
                            {country}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Map Container */}
                <div className={showRegionSelector ? "lg:col-span-3" : "lg:col-span-4"}>
                  <div 
                    className="rounded-3xl overflow-hidden shadow-lg" 
                    style={{ height: '700px', minHeight: '500px', backgroundColor: '#FFFFFF' }}
                  >
                    <MapContainer
                      center={mapCenter}
                      zoom={mapZoom}
                      scrollWheelZoom={true}
                      style={{ height: "100%", width: "100%" }}
                    >
                      <ChangeView center={mapCenter} zoom={mapZoom} />
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        maxZoom={19}
                      />
                      
                      <ClusteredMarkers
                        markers={markers}
                        onOrganizationsClick={setSelectedOrganization}
                        language={language}
                      />
                    </MapContainer>
                  </div>
                </div>
              </div>
            )}
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