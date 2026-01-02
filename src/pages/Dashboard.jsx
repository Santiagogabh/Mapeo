import React, { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from "react-leaflet";
import { Filter, X, Globe, Building2, Layers } from "lucide-react";
import L from 'leaflet';

// Fix para los iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Datos de organizaciones con estructura completa
const organizationsData = [
  {
    id: 1,
    name: "Alianza Agua Viva",
    description_es: "Trabaja por el acceso al agua potable y saneamiento en comunidades vulnerables.",
    description_en: "Works to provide access to clean water and sanitation in vulnerable communities.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Justicia climática y acceso al agua",
      en: "Climate justice and water access"
    },
    como_trabajan: {
      es: "Implementan sistemas de captación de agua lluvia y capacitan a comunidades en gestión sostenible del recurso hídrico.",
      en: "They implement rainwater harvesting systems and train communities in sustainable water resource management."
    },
    type: "fundacion",
    focus: "justicia_climatica",
    country: "Perú",
    ciudad: "Lima",
    continent: "america_latina",
    latitude: -12.0464,
    longitude: -77.0428,
    website: "https://www.water.org",
    email: "contacto@aguaviva.org"
  },
  {
    id: 2,
    name: "Red Bosques del Futuro",
    description_es: "Impulsa proyectos de reforestación y restauración de ecosistemas.",
    description_en: "Promotes reforestation and ecosystem restoration projects.",
    tipo_de_org: {
      es: "ONG",
      en: "NGO"
    },
    enfoque: {
      es: "Conservación de recursos naturales y reforestación",
      en: "Natural resource conservation and reforestation"
    },
    como_trabajan: {
      es: "Coordinan jornadas de siembra con comunidades locales y monitorean el crecimiento de especies nativas.",
      en: "They coordinate planting days with local communities and monitor the growth of native species."
    },
    type: "ong",
    focus: "conservacion_recursos",
    country: "Brasil",
    ciudad: "Brasília",
    continent: "america_latina",
    latitude: -15.7801,
    longitude: -47.9292,
    website: "https://www.worldwildlife.org",
    email: "info@bosquesfuturo.org"
  },
  {
    id: 3,
    name: "Fundación Horizonte Solar",
    description_es: "Fomenta el uso de energías renovables en zonas rurales.",
    description_en: "Encourages the use of renewable energy in rural areas.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Transición energética y energías renovables",
      en: "Energy transition and renewable energy"
    },
    como_trabajan: {
      es: "Instalan paneles solares en escuelas rurales y capacitan a familias en el uso de tecnologías limpias.",
      en: "They install solar panels in rural schools and train families in the use of clean technologies."
    },
    type: "fundacion",
    focus: "transicion_energetica",
    country: "Chile",
    ciudad: "Santiago",
    continent: "america_latina",
    latitude: -33.4489,
    longitude: -70.6693,
    website: "https://www.greenpeace.org",
    email: "contacto@horizontesolar.org"
  },
  {
    id: 4,
    name: "Movimiento Tierra Justa",
    description_es: "Defiende los derechos ambientales y territoriales de comunidades indígenas.",
    description_en: "Defends environmental and land rights of indigenous communities.",
    tipo_de_org: {
      es: "Movimiento Social",
      en: "Social Movement"
    },
    enfoque: {
      es: "Derechos de comunidades indígenas y defensa territorial",
      en: "Indigenous communities rights and territorial defense"
    },
    como_trabajan: {
      es: "Acompañan procesos de consulta previa y fortalecen la organización comunitaria para la defensa del territorio.",
      en: "They support prior consultation processes and strengthen community organization for territorial defense."
    },
    type: "movimiento_social",
    focus: "comunidades_indigenas",
    country: "Bolivia",
    ciudad: "La Paz",
    continent: "america_latina",
    latitude: -16.5000,
    longitude: -68.1500,
    website: "https://www.amnesty.org",
    email: "info@tierrajusta.org"
  },
  {
    id: 5,
    name: "Iniciativa Clima Urbano",
    description_es: "Promueve ciudades sostenibles y resilientes al cambio climático.",
    description_en: "Promotes sustainable and climate-resilient cities.",
    tipo_de_org: {
      es: "ONG",
      en: "NGO"
    },
    enfoque: {
      es: "Ciudades sustentables y adaptación climática",
      en: "Sustainable cities and climate adaptation"
    },
    como_trabajan: {
      es: "Desarrollan proyectos de agricultura urbana y promueven políticas públicas para ciudades más verdes.",
      en: "They develop urban agriculture projects and promote public policies for greener cities."
    },
    type: "ong",
    focus: "ciudades_sustentables",
    country: "Argentina",
    ciudad: "Buenos Aires",
    continent: "america_latina",
    latitude: -34.6037,
    longitude: -58.3816,
    website: "https://www.c40.org",
    email: "contacto@climaurbano.org"
  },
  {
    id: 6,
    name: "Fundación Océanos Libres",
    description_es: "Protege la biodiversidad marina y combate la contaminación plástica.",
    description_en: "Protects marine biodiversity and fights plastic pollution.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación marina y reducción de plásticos",
      en: "Marine conservation and plastic reduction"
    },
    como_trabajan: {
      es: "Realizan limpiezas costeras, educan sobre el impacto del plástico y promueven economía circular.",
      en: "They conduct coastal cleanups, educate about plastic impact and promote circular economy."
    },
    type: "fundacion",
    focus: "conservacion_recursos",
    country: "Ecuador",
    ciudad: "Quito",
    continent: "america_latina",
    latitude: -0.1807,
    longitude: -78.4678,
    website: "https://www.oceana.org",
    email: "info@oceanoslibres.org"
  },
  {
    id: 7,
    name: "Colectivo Energía Popular",
    description_es: "Promueve modelos comunitarios de generación energética.",
    description_en: "Promotes community-based energy generation models.",
    tipo_de_org: {
      es: "Movimiento Social",
      en: "Social Movement"
    },
    enfoque: {
      es: "Transición energética comunitaria",
      en: "Community energy transition"
    },
    como_trabajan: {
      es: "Trabajan con comunidades locales para desarrollar proyectos de energía solar y eólica de manera cooperativa.",
      en: "They work with local communities to develop solar and wind energy projects cooperatively."
    },
    type: "movimiento_social",
    focus: "transicion_energetica",
    country: "Colombia",
    ciudad: "Bogotá",
    continent: "america_latina",
    latitude: 4.7110,
    longitude: -74.0721,
    website: "https://www.energia.org",
    email: "contacto@energiapopular.org"
  },
  {
    id: 8,
    name: "Fundación Semillas del Mañana",
    description_es: "Impulsa la soberanía alimentaria y la agroecología.",
    description_en: "Promotes food sovereignty and agroecology.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Soberanía alimentaria y agricultura sostenible",
      en: "Food sovereignty and sustainable agriculture"
    },
    como_trabajan: {
      es: "Capacitan a agricultores en técnicas agroecológicas y facilitan el intercambio de semillas nativas.",
      en: "They train farmers in agroecological techniques and facilitate the exchange of native seeds."
    },
    type: "fundacion",
    focus: "soberania_alimentaria",
    country: "México",
    ciudad: "Ciudad de México",
    continent: "america_latina",
    latitude: 19.4326,
    longitude: -99.1332,
    website: "https://www.fao.org",
    email: "info@semillasmanana.org"
  },
  {
    id: 9,
    name: "Fundación Raíces del Territorio",
    description_es: "Fortalece procesos comunitarios de defensa del territorio.",
    description_en: "Strengthens community processes for territorial defense.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Defensa territorial y derechos comunitarios",
      en: "Territorial defense and community rights"
    },
    como_trabajan: {
      es: "Acompañan comunidades en procesos de cartografía social y fortalecimiento organizativo.",
      en: "They support communities in social mapping processes and organizational strengthening."
    },
    type: "fundacion",
    focus: "defensa_territorial",
    country: "Colombia",
    ciudad: "Bogotá",
    continent: "america_latina",
    latitude: 4.7110,
    longitude: -74.0721,
    website: "https://www.raicesterritorio.org",
    email: "contacto@raicesterritorio.org"
  },
  {
    id: 10,
    name: "Colectivo Agua Viva",
    description_es: "Protege fuentes hídricas y promueve el acceso al agua.",
    description_en: "Protects water sources and promotes access to clean water.",
    tipo_de_org: {
      es: "Colectivo",
      en: "Collective"
    },
    enfoque: {
      es: "Protección de fuentes hídricas",
      en: "Water source protection"
    },
    como_trabajan: {
      es: "Monitorean calidad del agua y organizan campañas de protección de cuencas hidrográficas.",
      en: "They monitor water quality and organize watershed protection campaigns."
    },
    type: "colectivo",
    focus: "proteccion_agua",
    country: "Colombia",
    ciudad: "Medellín",
    continent: "america_latina",
    latitude: 4.7110,
    longitude: -74.0721,
    website: "https://www.aguaviva.org",
    email: "info@aguaviva.org"
  },
  {
    id: 11,
    name: "Red Campesina Sostenible",
    description_es: "Impulsa la agroecología y la soberanía alimentaria.",
    description_en: "Promotes agroecology and food sovereignty.",
    tipo_de_org: {
      es: "Red comunitaria",
      en: "Community network"
    },
    enfoque: {
      es: "Agroecología y economía campesina",
      en: "Agroecology and peasant economy"
    },
    como_trabajan: {
      es: "Articulan mercados campesinos y promueven intercambio de saberes entre productores.",
      en: "They organize farmers' markets and promote knowledge exchange among producers."
    },
    type: "red",
    focus: "agroecologia",
    country: "Colombia",
    ciudad: "Cali",
    continent: "america_latina",
    latitude: 4.7110,
    longitude: -74.0721,
    website: "https://www.redcampesina.org",
    email: "contacto@redcampesina.org"
  },
  {
    id: 12,
    name: "Fundación Bosques Libres",
    description_es: "Trabaja por la conservación de bosques y selvas.",
    description_en: "Works for forest and jungle conservation.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Conservación de bosques",
      en: "Forest conservation"
    },
    como_trabajan: {
      es: "Realizan monitoreo satelital de deforestación y apoyan a comunidades guardabosques.",
      en: "They conduct satellite monitoring of deforestation and support forest guardian communities."
    },
    type: "fundacion",
    focus: "conservacion_bosques",
    country: "Colombia",
    ciudad: "Leticia",
    continent: "america_latina",
    latitude: 4.7110,
    longitude: -74.0721,
    website: "https://www.bosqueslibres.org",
    email: "info@bosqueslibres.org"
  },
  {
    id: 13,
    name: "Movimiento Tierra Digna",
    description_es: "Defiende los derechos ambientales y sociales.",
    description_en: "Defends environmental and social rights.",
    tipo_de_org: {
      es: "Movimiento Social",
      en: "Social Movement"
    },
    enfoque: {
      es: "Justicia ambiental y derechos humanos",
      en: "Environmental justice and human rights"
    },
    como_trabajan: {
      es: "Documentan violaciones ambientales y acompañan procesos de exigibilidad de derechos.",
      en: "They document environmental violations and support rights advocacy processes."
    },
    type: "movimiento_social",
    focus: "justicia_ambiental",
    country: "Colombia",
    ciudad: "Bogotá",
    continent: "america_latina",
    latitude: 4.7110,
    longitude: -74.0721,
    website: "https://www.tierradigna.org",
    email: "contacto@tierradigna.org"
  },
  {
    id: 14,
    name: "Red de Guardianes del Agua",
    description_es: "Monitorea y protege cuencas hídricas comunitarias.",
    description_en: "Monitors and protects community water basins.",
    tipo_de_org: {
      es: "Red comunitaria",
      en: "Community network"
    },
    enfoque: {
      es: "Gestión hídrica comunitaria",
      en: "Community water management"
    },
    como_trabajan: {
      es: "Capacitan monitores comunitarios y realizan mediciones periódicas de calidad del agua.",
      en: "They train community monitors and conduct periodic water quality measurements."
    },
    type: "red",
    focus: "gestion_hidrica",
    country: "Colombia",
    ciudad: "Bucaramanga",
    continent: "america_latina",
    latitude: 4.7110,
    longitude: -74.0721,
    website: "https://www.guardianesagua.org",
    email: "info@guardianesagua.org"
  },
  {
    id: 15,
    name: "Fundación Vida Rural",
    description_es: "Apoya el desarrollo sostenible en comunidades rurales.",
    description_en: "Supports sustainable development in rural communities.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Desarrollo rural sostenible",
      en: "Sustainable rural development"
    },
    como_trabajan: {
      es: "Implementan proyectos productivos sostenibles y fortalecen capacidades locales.",
      en: "They implement sustainable productive projects and strengthen local capacities."
    },
    type: "fundacion",
    focus: "desarrollo_rural",
    country: "Colombia",
    ciudad: "Pasto",
    continent: "america_latina",
    latitude: 4.7110,
    longitude: -74.0721,
    website: "https://www.vidarural.org",
    email: "contacto@vidarural.org"
  },
  {
    id: 16,
    name: "Colectivo Semillas Libres",
    description_es: "Defiende las semillas nativas y criollas.",
    description_en: "Defends native and creole seeds.",
    tipo_de_org: {
      es: "Colectivo",
      en: "Collective"
    },
    enfoque: {
      es: "Soberanía alimentaria y patrimonio genético",
      en: "Food sovereignty and genetic heritage"
    },
    como_trabajan: {
      es: "Organizan ferias de semillas y promueven bancos comunitarios de germoplasma.",
      en: "They organize seed fairs and promote community germplasm banks."
    },
    type: "colectivo",
    focus: "soberania_alimentaria",
    country: "Colombia",
    ciudad: "Popayán",
    continent: "america_latina",
    latitude: 4.7110,
    longitude: -74.0721,
    website: "https://www.semillaslibres.org",
    email: "info@semillaslibres.org"
  },
  {
    id: 17,
    name: "Red Amazónica Comunitaria",
    description_es: "Protege la Amazonía desde las comunidades locales.",
    description_en: "Protects the Amazon from local communities.",
    tipo_de_org: {
      es: "Red comunitaria",
      en: "Community network"
    },
    enfoque: {
      es: "Protección de la Amazonía",
      en: "Amazon protection"
    },
    como_trabajan: {
      es: "Articulan comunidades indígenas y campesinas para el monitoreo y defensa del bosque amazónico.",
      en: "They articulate indigenous and peasant communities for monitoring and defending the Amazon rainforest."
    },
    type: "red",
    focus: "proteccion_amazonia",
    country: "Colombia",
    ciudad: "Leticia",
    continent: "america_latina",
    latitude: 4.7110,
    longitude: -74.0721,
    website: "https://www.redamazonica.org",
    email: "contacto@redamazonica.org"
  },
  {
    id: 18,
    name: "Fundación Clima Justo",
    description_es: "Impulsa acciones frente al cambio climático.",
    description_en: "Promotes actions against climate change.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Acción climática y adaptación",
      en: "Climate action and adaptation"
    },
    como_trabajan: {
      es: "Implementan proyectos de adaptación climática y fortalecen capacidades comunitarias.",
      en: "They implement climate adaptation projects and strengthen community capacities."
    },
    type: "fundacion",
    focus: "accion_climatica",
    country: "Colombia",
    ciudad: "Cartagena",
    continent: "america_latina",
    latitude: 4.7110,
    longitude: -74.0721,
    website: "https://www.climajusto.org",
    email: "info@climajusto.org"
  },
  {
    id: 19,
    name: "Movimiento Defensa del Páramo",
    description_es: "Protege los ecosistemas de páramo.",
    description_en: "Protects paramo ecosystems.",
    tipo_de_org: {
      es: "Movimiento Social",
      en: "Social Movement"
    },
    enfoque: {
      es: "Protección de páramos",
      en: "Paramo protection"
    },
    como_trabajan: {
      es: "Movilizan comunidades contra proyectos extractivos en páramos y promueven su declaratoria como áreas protegidas.",
      en: "They mobilize communities against extractive projects in paramos and promote their declaration as protected areas."
    },
    type: "movimiento_social",
    focus: "proteccion_paramos",
    country: "Colombia",
    ciudad: "Tunja",
    continent: "america_latina",
    latitude: 4.7110,
    longitude: -74.0721,
    website: "https://www.defensadelparamo.org",
    email: "contacto@defensadelparamo.org"
  },
  {
    id: 20,
    name: "Red de Economía Solidaria",
    description_es: "Fomenta modelos económicos solidarios.",
    description_en: "Encourages solidarity-based economic models.",
    tipo_de_org: {
      es: "Red comunitaria",
      en: "Community network"
    },
    enfoque: {
      es: "Economía solidaria y cooperativismo",
      en: "Solidarity economy and cooperativism"
    },
    como_trabajan: {
      es: "Apoyan la creación de cooperativas y promueven comercio justo entre productores.",
      en: "They support the creation of cooperatives and promote fair trade among producers."
    },
    type: "red",
    focus: "economia_solidaria",
    country: "Colombia",
    ciudad: "Manizales",
    continent: "america_latina",
    latitude: 4.7110,
    longitude: -74.0721,
    website: "https://www.economiasolidaria.org",
    email: "info@economiasolidaria.org"
  },
  {
    id: 21,
    name: "Fundación Comunidades Resilientes",
    description_es: "Fortalece la resiliencia comunitaria ante crisis.",
    description_en: "Strengthens community resilience to crises.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Resiliencia comunitaria",
      en: "Community resilience"
    },
    como_trabajan: {
      es: "Desarrollan planes de contingencia comunitarios y fortalecen redes de apoyo mutuo.",
      en: "They develop community contingency plans and strengthen mutual support networks."
    },
    type: "fundacion",
    focus: "resiliencia_comunitaria",
    country: "Colombia",
    ciudad: "Armenia",
    continent: "america_latina",
    latitude: 4.7110,
    longitude: -74.0721,
    website: "https://www.comunidadesresilientes.org",
    email: "contacto@comunidadesresilientes.org"
  },
  {
    id: 22,
    name: "Colectivo Defensa del Río Cauca",
    description_es: "Protege el río Cauca y sus comunidades.",
    description_en: "Protects the Cauca River and its communities.",
    tipo_de_org: {
      es: "Colectivo",
      en: "Collective"
    },
    enfoque: {
      es: "Protección de ríos y cuencas",
      en: "River and watershed protection"
    },
    como_trabajan: {
      es: "Monitorean contaminación del río y organizan acciones de protección comunitaria.",
      en: "They monitor river pollution and organize community protection actions."
    },
    type: "colectivo",
    focus: "proteccion_rios",
    country: "Colombia",
    ciudad: "Cali",
    continent: "america_latina",
    latitude: 4.7110,
    longitude: -74.0721,
    website: "https://www.riocauca.org",
    email: "contacto@riocauca.org"
  },
  {
    id: 23,
    name: "Red de Jóvenes por el Clima",
    description_es: "Articula juventudes frente a la crisis climática.",
    description_en: "Connects youth against the climate crisis.",
    tipo_de_org: {
      es: "Red juvenil",
      en: "Youth network"
    },
    enfoque: {
      es: "Activismo climático juvenil",
      en: "Youth climate activism"
    },
    como_trabajan: {
      es: "Organizan movilizaciones juveniles y desarrollan campañas de educación ambiental en colegios.",
      en: "They organize youth mobilizations and develop environmental education campaigns in schools."
    },
    type: "red",
    focus: "juventud_clima",
    country: "Colombia",
    ciudad: "Bogotá",
    continent: "america_latina",
    latitude: 4.7110,
    longitude: -74.0721,
    website: "https://www.jovenesclima.org",
    email: "info@jovenesclima.org"
  },
  {
    id: 24,
    name: "Fundación Territorios Vivos",
    description_es: "Defiende la vida y diversidad de los territorios.",
    description_en: "Defends life and diversity of territories.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Biodiversidad y defensa territorial",
      en: "Biodiversity and territorial defense"
    },
    como_trabajan: {
      es: "Documentan biodiversidad local y apoyan procesos de declaratoria de áreas protegidas comunitarias.",
      en: "They document local biodiversity and support processes for declaring community protected areas."
    },
    type: "fundacion",
    focus: "biodiversidad",
    country: "Colombia",
    ciudad: "Villavicencio",
    continent: "america_latina",
    latitude: 4.7110,
    longitude: -74.0721,
    website: "https://www.territoriosvivos.org",
    email: "contacto@territoriosvivos.org"
  },
  {
    id: 25,
    name: "Movimiento Pueblos en Resistencia",
    description_es: "Acompaña luchas sociales y ambientales.",
    description_en: "Supports social and environmental struggles.",
    tipo_de_org: {
      es: "Movimiento Social",
      en: "Social Movement"
    },
    enfoque: {
      es: "Derechos colectivos y resistencia",
      en: "Collective rights and resistance"
    },
    como_trabajan: {
      es: "Acompañan comunidades en resistencia y visibilizan luchas territoriales a nivel nacional.",
      en: "They support communities in resistance and make territorial struggles visible nationally."
    },
    type: "movimiento_social",
    focus: "derechos_colectivos",
    country: "Colombia",
    ciudad: "Medellín",
    continent: "america_latina",
    latitude: 4.7110,
    longitude: -74.0721,
    website: "https://www.pueblosenresistencia.org",
    email: "contacto@pueblosenresistencia.org"
  },
  {
    id: 26,
    name: "Red de Mujeres Guardianas",
    description_es: "Fortalece liderazgos femeninos comunitarios.",
    description_en: "Strengthens female community leadership.",
    tipo_de_org: {
      es: "Red comunitaria",
      en: "Community network"
    },
    enfoque: {
      es: "Liderazgo femenino y justicia social",
      en: "Female leadership and social justice"
    },
    como_trabajan: {
      es: "Realizan talleres participativos, acompañamiento a lideresas locales y campañas de incidencia territorial.",
      en: "They conduct participatory workshops, support local women leaders and territorial advocacy campaigns."
    },
    type: "red",
    focus: "liderazgo_femenino",
    country: "Colombia",
    ciudad: "Barranquilla",
    continent: "america_latina",
    latitude: 4.7110,
    longitude: -74.0721,
    website: "https://www.mujeresguardianas.org",
    email: "info@mujeresguardianas.org"
  },
  {
    id: 27,
    name: "Fundación Saberes Ancestrales",
    description_es: "Preserva saberes indígenas y tradicionales.",
    description_en: "Preserves indigenous and traditional knowledge.",
    tipo_de_org: {
      es: "Fundación",
      en: "Foundation"
    },
    enfoque: {
      es: "Saberes ancestrales y patrimonio cultural",
      en: "Ancestral knowledge and cultural heritage"
    },
    como_trabajan: {
      es: "Documentan prácticas tradicionales y facilitan diálogos de saberes entre generaciones.",
      en: "They document traditional practices and facilitate knowledge dialogues between generations."
    },
    type: "fundacion",
    focus: "saberes_ancestrales",
    country: "Colombia",
    ciudad: "Riohacha",
    continent: "america_latina",
    latitude: 4.7110,
    longitude: -74.0721,
    website: "https://www.saberesancestrales.org",
    email: "contacto@saberesancestrales.org"
  },
  {
    id: 28,
    name: "Colectivo Ciudades Sustentables",
    description_es: "Promueve ciudades más verdes y humanas.",
    description_en: "Promotes greener and more humane cities.",
    tipo_de_org: {
      es: "Colectivo",
      en: "Collective"
    },
    enfoque: {
      es: "Urbanismo sostenible",
      en: "Sustainable urbanism"
    },
    como_trabajan: {
      es: "Impulsan proyectos de movilidad sostenible y espacios públicos verdes en zonas urbanas.",
      en: "They promote sustainable mobility projects and green public spaces in urban areas."
    },
    type: "colectivo",
    focus: "urbanismo_sostenible",
    country: "Colombia",
    ciudad: "Pereira",
    continent: "america_latina",
    latitude: 4.7110,
    longitude: -74.0721,
    website: "https://www.ciudadessustentables.org",
    email: "info@ciudadessustentables.org"
  }
];

// Regiones disponibles
const REGIONS = {
  continents: [
    { id: "america_latina", name: "América Latina", coordinates: [-15, -60], type: "continent" }
  ],
  countries: [
    { id: "Argentina", name: "Argentina", coordinates: [-34.6037, -58.3816], type: "country" },
    { id: "Bolivia", name: "Bolivia", coordinates: [-16.5000, -68.1500], type: "country" },
    { id: "Brasil", name: "Brasil", coordinates: [-15.7801, -47.9292], type: "country" },
    { id: "Chile", name: "Chile", coordinates: [-33.4489, -70.6693], type: "country" },
    { id: "Colombia", name: "Colombia", coordinates: [4.7110, -74.0721], type: "country" },
    { id: "Ecuador", name: "Ecuador", coordinates: [-0.1807, -78.4678], type: "country" },
    { id: "México", name: "México", coordinates: [19.4326, -99.1332], type: "country" },
    { id: "Perú", name: "Perú", coordinates: [-12.0464, -77.0428], type: "country" }
  ]
};

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
              fillColor: '#1C6662',
              fillOpacity: 0.8,
              color: '#EFB714',
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
      location: "Ubicación"
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
      location: "Location"
    }
  };
  
  const texts = t[language];
  
  return (
    <>
      {/* Overlay difuminado */}
      <div 
        className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm z-[1000] transition-opacity duration-300"
        onClick={onClose}
        style={{ backdropFilter: 'blur(6px)' }}
      />
      
      {/* Modal centrado */}
      <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-200" style={{ backgroundColor: '#f8f8f8' }}>
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-1" style={{ color: '#262322' }}>
                  {organizations[0]?.country}
                </h2>
                <p className="text-sm" style={{ color: '#666' }}>
                  {organizations.length} {texts.organizations}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                style={{ color: '#262322' }}
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
                  className="bg-white rounded-lg p-6 border border-gray-200 hover:border-gray-300 transition-all"
                >
                  {/* Nombre */}
                  <h3 className="text-xl font-bold mb-4" style={{ color: '#262322' }}>
                    {org.name}
                  </h3>
                  
                  {/* Cómo trabajan */}
                  {org.como_trabajan && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2" style={{ color: '#1C6662' }}>
                        {texts.workMethodology}
                      </h4>
                      <p className="text-sm leading-relaxed" style={{ color: '#262322' }}>
                        {language === 'es' 
                          ? (org.como_trabajan.es || org.como_trabajan) 
                          : (org.como_trabajan.en || org.como_trabajan)}
                      </p>
                    </div>
                  )}
                  
                  {/* Enfoque */}
                  {org.enfoque && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2" style={{ color: '#1C6662' }}>
                        {texts.focus}
                      </h4>
                      <p className="text-sm" style={{ color: '#262322' }}>
                        {language === 'es' ? (org.enfoque.es || org.enfoque) : (org.enfoque.en || org.enfoque)}
                      </p>
                    </div>
                  )}
                  
                  {/* Tipo de Organización */}
                  {org.tipo_de_org && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2" style={{ color: '#1C6662' }}>
                        {texts.orgType}
                      </h4>
                      <p className="text-sm" style={{ color: '#262322' }}>
                        {language === 'es' ? (org.tipo_de_org.es || org.tipo_de_org) : (org.tipo_de_org.en || org.tipo_de_org)}
                      </p>
                    </div>
                  )}
                  
                  {/* Descripción */}
                  {(org.description_es || org.description_en) && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2" style={{ color: '#1C6662' }}>
                        {texts.description}
                      </h4>
                      <p className="text-sm leading-relaxed" style={{ color: '#262322' }}>
                        {language === 'es' ? org.description_es : org.description_en}
                      </p>
                    </div>
                  )}
                  
                  {/* Contacto */}
                  <div className="pt-4 border-t border-gray-200 space-y-2">
                    {org.website && (
                      <a 
                        href={org.website} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex items-center gap-2 text-sm transition-colors hover:underline"
                        style={{ color: '#1C6662' }}
                      >
                        <Globe className="w-4 h-4" />
                        <span>{texts.website}</span>
                      </a>
                    )}
                    
                    {org.email && (
                      <div className="flex items-center gap-2 text-sm" style={{ color: '#666' }}>
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
          <div className="px-8 py-5 border-t border-gray-200" style={{ backgroundColor: '#f8f8f8' }}>
            <button
              onClick={onClose}
              className="w-full rounded-lg py-3 font-semibold transition-all hover:opacity-90"
              style={{ backgroundColor: '#1C6662', color: 'white' }}
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
    country: "all"
  });
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [showFilters, setShowFilters] = useState(true);
  const [showRegionSelector, setShowRegionSelector] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [mapCenter, setMapCenter] = useState([-15, -60]);
  const [mapZoom, setMapZoom] = useState(4);

  const translations = {
    es: {
      title: "Mapa de Organizaciones",
      subtitle: "América Latina y el Caribe",
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
      allTypes: "Todos los tipos",
      allFocus: "Todos los enfoques",
      allCountries: "Todos los países",
      clearFilters: "Limpiar filtros",
      types: {
        fundacion: "Fundación",
        ong: "ONG",
        movimiento_social: "Movimiento Social",
        colectivo: "Colectivo",
        red: "Red"
      },
      focuses: {
        justicia_climatica: "Justicia Climática",
        conservacion_recursos: "Conservación",
        transicion_energetica: "Transición Energética",
        comunidades_indigenas: "Comunidades Indígenas",
        ciudades_sustentables: "Ciudades Sustentables",
        soberania_alimentaria: "Soberanía Alimentaria"
      }
    },
    en: {
      title: "Organizations Map",
      subtitle: "Latin America and the Caribbean",
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
      allTypes: "All types",
      allFocus: "All focuses",
      allCountries: "All countries",
      clearFilters: "Clear filters",
      types: {
        fundacion: "Foundation",
        ong: "NGO",
        movimiento_social: "Social Movement",
        colectivo: "Collective",
        red: "Network"
      },
      focuses: {
        justicia_climatica: "Climate Justice",
        conservacion_recursos: "Conservation",
        transicion_energetica: "Energy Transition",
        comunidades_indigenas: "Indigenous Communities",
        ciudades_sustentables: "Sustainable Cities",
        soberania_alimentaria: "Food Sovereignty"
      }
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

  const filteredOrgs = useMemo(() => {
    return organizationsData.filter(org => {
      if (filters.type !== "all" && org.type !== filters.type) return false;
      if (filters.focus !== "all" && org.focus !== filters.focus) return false;
      if (filters.continent !== "all" && org.continent !== filters.continent) return false;
      if (filters.country !== "all" && org.country !== filters.country) return false;
      return true;
    });
  }, [filters]);

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
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <style>{`
        .leaflet-container {
          height: 100%;
          width: 100%;
          border-radius: 24px;
          z-index: 1;
          background: #e5e7eb;
        }
        
        .leaflet-popup-content-wrapper {
          border-radius: 12px;
        }
        
        .leaflet-control-zoom {
          border: 2px solid #e5e7eb !important;
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
        
        body {
          background-color: #f3f4f6 !important;
        }
        
        body.modal-open {
          overflow: hidden;
        }
      `}</style>
      
      {/* Header */}
      <div className="max-w-[1600px] mx-auto mb-6">
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                {t.title}
              </h1>
              <p className="text-lg text-gray-600">{t.subtitle}</p>
            </div>
            
            <div className="flex gap-3">
              <div className="bg-gray-100 rounded-2xl p-1 flex gap-1">
                <button
                  onClick={() => setLanguage('es')}
                  className={`px-4 py-2 rounded-xl transition-all font-medium ${
                    language === 'es' ? 'bg-white text-gray-900 shadow' : 'text-gray-600'
                  }`}
                >
                  ES
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-4 py-2 rounded-xl transition-all font-medium ${
                    language === 'en' ? 'bg-white text-gray-900 shadow' : 'text-gray-600'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-[1600px] mx-auto mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white border-2 border-gray-300 rounded-xl px-4 py-3 flex items-center gap-2 hover:border-gray-400 transition-colors"
            >
              <Filter className="w-5 h-5" />
              {showFilters ? t.hideFilters : t.showFilters}
            </button>

            <button
              onClick={() => setShowRegionSelector(!showRegionSelector)}
              className="bg-white border-2 border-gray-300 rounded-xl px-4 py-3 flex items-center gap-2 hover:border-gray-400 transition-colors"
            >
              <Layers className="w-5 h-5" />
              {showRegionSelector ? t.hideRegions : t.showRegions}
            </button>

            {selectedRegion && (
              <div className="bg-white border-2 px-4 py-3 rounded-xl flex items-center gap-2" style={{ borderColor: '#1C6662' }}>
                <span className="text-sm font-semibold text-gray-700">{t.filteredBy}:</span>
                <span className="text-sm font-bold" style={{ color: '#1C6662' }}>{selectedRegion.name}</span>
                <button
                  onClick={handleClearRegion}
                  className="ml-2 hover:bg-gray-100 rounded-full p-1 transition-colors"
                >
                  <X className="w-4 h-4" style={{ color: '#EFB714' }} />
                </button>
              </div>
            )}
          </div>

          <div className="bg-white border-2 border-gray-300 px-6 py-3 rounded-xl flex items-center gap-2">
            <Building2 className="w-5 h-5" style={{ color: '#EFB714' }} />
            <span className="font-semibold" style={{ color: '#1C6662' }}>
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
              <div className="bg-white rounded-3xl p-6 shadow-lg space-y-6">
                <h3 className="text-xl font-bold text-gray-800">{t.filters}</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.type}
                  </label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    className="w-full bg-white border-2 border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-700"
                  >
                    <option value="all">{t.allTypes}</option>
                    {Object.entries(t.types).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.focus}
                  </label>
                  <select
                    value={filters.focus}
                    onChange={(e) => setFilters({ ...filters, focus: e.target.value })}
                    className="w-full bg-white border-2 border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-700"
                  >
                    <option value="all">{t.allFocus}</option>
                    {Object.entries(t.focuses).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t.country}
                  </label>
                  <select
                    value={filters.country}
                    onChange={(e) => setFilters({ ...filters, country: e.target.value })}
                    className="w-full bg-white border-2 border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-700"
                  >
                    <option value="all">{t.allCountries}</option>
                    {REGIONS.countries.map((country) => (
                      <option key={country.id} value={country.id}>{country.name}</option>
                    ))}
                  </select>
                </div>

                {(filters.type !== 'all' || filters.focus !== 'all' || filters.country !== 'all') && (
                  <button
                    onClick={() => setFilters({ type: 'all', focus: 'all', continent: 'all', country: 'all' })}
                    className="w-full bg-gray-200 text-gray-800 rounded-xl py-3 font-medium hover:bg-gray-300 transition-colors"
                  >
                    {t.clearFilters}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Map Section */}
          <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Region Selector */}
              {showRegionSelector && (
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-3xl p-6 shadow-lg space-y-4">
                    <h3 className="text-xl font-bold text-gray-800">{t.regions}</h3>
                    
                    <div className="space-y-2">
                      {REGIONS.countries.map((region) => (
                        <button
                          key={region.id}
                          onClick={() => handleRegionSelect(region)}
                          className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                            selectedRegion?.id === region.id
                              ? 'font-semibold'
                              : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                          }`}
                          style={selectedRegion?.id === region.id ? {
                            backgroundColor: '#e8f5f4',
                            color: '#1C6662'
                          } : {}}
                        >
                          {region.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Map Container */}
              <div className={showRegionSelector ? "lg:col-span-3" : "lg:col-span-4"}>
                <div 
                  className="bg-white rounded-3xl overflow-hidden shadow-lg" 
                  style={{ height: '700px', minHeight: '500px' }}
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