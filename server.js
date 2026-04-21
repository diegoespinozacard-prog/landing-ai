const express = require('express');
const path    = require('path');
const app     = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

/* ── Data ──────────────────────────────────────────────── */

const models = [
  { name: 'GPT-4o',            company: 'OpenAI',       color: '#10A37F', badge: '★ Mejor',     badgeType: 'best', category: 'text'  },
  { name: 'Claude 3.5 Sonnet', company: 'Anthropic',    color: '#CC785C', badge: 'Popular',     badgeType: '',     category: 'text'  },
  { name: 'Gemini 1.5 Pro',    company: 'Google',       color: '#4285F4', badge: 'Nuevo',       badgeType: '',     category: 'text'  },
  { name: 'Llama 3.1 70B',     company: 'Meta',         color: '#0066FF', badge: 'Open source', badgeType: '',     category: 'code'  },
  { name: 'Mistral Large',     company: 'Mistral AI',   color: '#FF7000', badge: 'Rápido',      badgeType: '',     category: 'code'  },
  { name: 'DALL·E 3',          company: 'OpenAI',       color: '#9333EA', badge: '★ Mejor',     badgeType: 'best', category: 'image' },
  { name: 'Stable Diffusion XL', company: 'Stability AI', color: '#E11D48', badge: 'Open source', badgeType: '', category: 'image' },
];

const features = [
  { icon: 'image',            name: 'Procesamiento de Imágenes', desc: 'Análisis, edición y generación de imágenes con IA avanzada' },
  { icon: 'video',            name: 'Edición de Videos',          desc: 'Crear, editar y optimizar videos automáticamente' },
  { icon: 'music-2',          name: 'Procesamiento de Audio',     desc: 'Transcripción, análisis y generación de contenido de audio' },
  { icon: 'mic',              name: 'Transcripción Inteligente',  desc: 'Convierte audio y video a texto con precisión profesional' },
  { icon: 'table-2',          name: 'Análisis Excel/Datos',       desc: 'Procesa y analiza grandes datasets con insights automáticos' },
  { icon: 'layout-dashboard', name: 'Dashboards Dinámicos',       desc: 'Visualizaciones interactivas y reportes en tiempo real' },
  { icon: 'file-text',        name: 'Documentos Word/PDF/PPT',    desc: 'Genera, edita y optimiza documentos profesionales' },
  { icon: 'code-2',           name: 'Generación de Código',       desc: 'Escribir, revisar y optimizar código en múltiples lenguajes' },
  { icon: 'scan-text',        name: 'OCR Avanzado',               desc: 'Extrae texto de imágenes y documentos escaneados' },
  { icon: 'search',           name: 'Research Inteligente',       desc: 'Investigación automática con fuentes verificadas' },
  { icon: 'bot',              name: 'Modo Agente IA',             desc: 'Asistente autónomo que ejecuta tareas complejas' },
  { icon: 'globe',            name: 'Desarrollo HTML',            desc: 'Crea interfaces web responsive automáticamente' },
];

const userProfiles = [
  {
    icon: 'monitor',
    name: 'Equipos de TI',
    desc: 'Desarrolladores, DevOps y analistas de sistemas',
    cases: ['Automatización de código', 'Análisis de logs', 'Documentación técnica'],
  },
  {
    icon: 'building-2',
    name: 'Empresas',
    desc: 'Compañías que buscan digitalización y eficiencia',
    cases: ['Procesamiento de datos', 'Reportes automáticos', 'Análisis de documentos'],
  },
  {
    icon: 'rocket',
    name: 'Emprendedores',
    desc: 'Startups y nuevos negocios que necesitan escalar',
    cases: ['Creación de contenido', 'Análisis de mercado', 'Desarrollo de MVP'],
  },
  {
    icon: 'briefcase',
    name: 'Profesionales Independientes',
    desc: 'Freelancers y consultores de alto rendimiento',
    cases: ['Automatización de tareas', 'Generación de propuestas', 'Gestión de clientes'],
  },
];

const benefits = [
  { stat: 'x10',  count: 'x10',  countFrom: 'x2',    title: 'Máxima potencia',              desc: 'Insights inmediatos de datos y documentos complejos', impact: 'Decisiones basadas en data real' },
  { stat: '+60%', count: '+60%', countFrom: '+1%',    title: 'Eficiencia operativa',          desc: 'Mejora sostenida en la productividad general del equipo', impact: 'Operaciones más ágiles y rentables' },
  { stat: '80%',  count: '80%',  countFrom: '1%',     title: 'Reducción trabajo repetitivo',  desc: 'La IA asume las tareas rutinarias para que tu equipo se enfoque en lo importante', impact: 'Más foco en tareas de alto valor' },
  { stat: '<30s', count: '<30s', countFrom: '<120s',   title: 'Menos tiempo',                  desc: 'Accede a información clave de tu empresa en segundos', impact: 'Decisiones más rápidas y precisas' },
  { stat: '4+',   count: '4+',   countFrom: '1+',     title: 'Modelos en una interfaz',       desc: 'Integra los mejores modelos de IA del mercado en una sola plataforma', impact: 'Máxima capacidad sin complejidad' },
];

const storySteps = [
  {
    index: 0,
    chip: 'Imágenes & Audio',
    title: 'Procesa todo tipo',
    titleEm: 'de contenido multimedia',
    body: 'Analiza y edita imágenes con IA y transcribe audio con precisión profesional.',
    tags: [
      { label: 'Imágenes', active: true  },
      { label: 'Audio',    active: true  },
      { label: 'OCR',      active: false },
    ],
  },
  {
    index: 1,
    chip: 'Datos & Analytics',
    title: 'Analiza datos,',
    titleEm: 'genera dashboards',
    body: 'Procesa grandes datasets de Excel y crea dashboards interactivos con insights automáticos en tiempo real.',
    tags: [
      { label: 'Excel',      active: true  },
      { label: 'Dashboards', active: true  },
      { label: 'Reportes',   active: true  },
      { label: 'Big Data',   active: false },
    ],
  },
  {
    index: 2,
    chip: 'Documentos',
    title: 'Word, PDF y PPT',
    titleEm: 'generados al instante',
    body: 'Genera, edita y optimiza documentos profesionales. Transcribe reuniones y convierte audio a texto.',
    tags: [
      { label: 'Word',          active: true },
      { label: 'PDF',           active: true },
      { label: 'PPT',           active: true },
      { label: 'Transcripción', active: true },
    ],
  },
  {
    index: 3,
    chip: 'Código & Web',
    title: 'Escribe y despliega',
    titleEm: 'código en minutos',
    body: 'Genera, revisa y optimiza código en múltiples lenguajes. Crea interfaces HTML responsive automáticamente.',
    tags: [
      { label: 'Python',     active: true  },
      { label: 'JavaScript', active: true  },
      { label: 'HTML/CSS',   active: true  },
      { label: 'SQL',        active: false },
    ],
  },
  {
    index: 4,
    chip: 'Proyectos',
    title: 'Colabora y comparte',
    titleEm: 'proyectos con tu equipo',
    body: 'Comparte proyectos con tus colaboradores, permitiéndoles tener acceso a los archivos e historial del chat.',
    tags: [
      { label: 'Proyectos propios',    active: true  },
      { label: 'Proyectos compartidos', active: true  },
      { label: 'Historial',            active: false },
    ],
  },
];

const pricingPlans = [
  {
    id: 'pro',
    name: 'Pro',
    price: '19',
    suffix: '/mes',
    description: 'Para profesionales y equipos de TI.',
    cta: 'Empezar ahora',
    popular: false,
    features: [
      'Consultas ilimitadas',
      '12 funcionalidades completas',
      'Modo Agente IA',
      'Análisis de archivos avanzado',
      'Generación de código',
      'Soporte prioritario',
    ],
  },
  {
    id: 'max',
    name: 'Max',
    price: '49',
    suffix: '/mes',
    description: 'Para equipos y empresas en crecimiento.',
    cta: 'Comenzar',
    popular: true,
    features: [
      'Todo lo del plan Pro',
      'Hasta 10 usuarios',
      'Panel de administración',
      'API de integración',
      'Dashboards compartidos',
      'Integraciones avanzadas',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    suffix: null,
    description: 'Para organizaciones con necesidades avanzadas.',
    cta: 'Contactar ventas',
    popular: false,
    features: [
      'Todo lo del plan Max',
      'Usuarios ilimitados',
      'SLA garantizado',
      'Implementación on-premise',
      'Soporte 24/7 dedicado',
    ],
  },
];

/* ── Routes ────────────────────────────────────────────── */

app.get('/', (req, res) => {
  res.render('index', { models, features, userProfiles, benefits, pricingPlans, storySteps });
});

/* ── Start ─────────────────────────────────────────────── */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MultIA running at http://localhost:${PORT}`);
});
