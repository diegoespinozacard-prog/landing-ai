const express  = require('express');
const path     = require('path');
const fs       = require('fs');
const https    = require('https');
const querystring = require('querystring');
const app      = express();

const GSCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwlHc-Vi3gShgytoWWcIoL_8Qord3A5fOO9iQ2HT1z56InMJkfkAw_0LSvWR9IjKJbNkQ/exec';
function submitToGoogleSheet(record) {
  const body = JSON.stringify(record);
  function doRequest(url) {
    const parsed = new (require('url').URL)(url);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };
    const req = https.request(options, (res) => {
      if (res.statusCode === 302 && res.headers.location) {
        doRequest(res.headers.location);
      }
    });
    req.on('error', (e) => console.error('Google Sheet submit error:', e.message));
    req.write(body);
    req.end();
  }
  doRequest(GSCRIPT_URL);
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const DATA_DIR   = path.join(__dirname, 'data');
const LEADS_CSV  = path.join(DATA_DIR, 'leads.csv');
const LEADS_JSON = path.join(DATA_DIR, 'leads.json');
const CSV_HEADER = '\uFEFFFecha,Nombre,Apellido,Telefono,Empresa,Cargo,Email\n';

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(LEADS_CSV))  fs.writeFileSync(LEADS_CSV,  CSV_HEADER, 'utf8');
if (!fs.existsSync(LEADS_JSON)) fs.writeFileSync(LEADS_JSON, '[]',        'utf8');

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
  { icon: 'image',            name: 'Generación de Imágenes',    desc: 'Crea, edita y transforma imágenes con IA avanzada a partir de texto o referencia visual' },
  { icon: 'mic',              name: 'Transcripción Inteligente',  desc: 'Convierte audio y video a texto con precisión profesional' },
  { icon: 'table-2',          name: 'Análisis Excel/Datos',       desc: 'Procesa y analiza grandes datasets con insights automáticos' },
  { icon: 'layout-dashboard', name: 'Dashboards Dinámicos',       desc: 'Visualizaciones interactivas y reportes en tiempo real' },
  { icon: 'file-text',        name: 'Documentos Word/PDF/PPT',    desc: 'Genera, edita y optimiza documentos profesionales' },
  { icon: 'code-2',           name: 'Generación de Código',       desc: 'Escribir, revisar y optimizar código en múltiples lenguajes' },
  { icon: 'scan-text',        name: 'OCR',                        desc: 'Extrae texto de imágenes y documentos escaneados' },
  { icon: 'search',           name: 'Búsqueda web',               desc: 'Investigación automática con fuentes verificadas' },
  { icon: 'bot',              name: 'Modo Agente IA',             desc: 'Asistente que ejecuta tareas indicadas' },
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
    title: 'Procesa distintos tipos',
    titleEm: 'de contenido multimedia',
    body: 'Analiza y edita imágenes con IA y transcribe audio con precisión.',
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
    body: 'Procesa Excels y crea dashboards interactivos.',
    tags: [
      { label: 'Excel',      active: true  },
      { label: 'Dashboards', active: true  },
      { label: 'Reportes',   active: true  },
    ],
  },
  {
    index: 2,
    chip: 'Documentos',
    title: 'Genera Word, PDF y PPT',
    titleEm: 'en segundos',
    body: 'Genera, edita y optimiza documentos. Convierte audio a texto.',
    tags: [
      { label: 'Word',          active: true,  icon: 'file-text'   },
      { label: 'PDF',           active: true,  icon: 'file-minus'  },
      { label: 'PPT',           active: true,  icon: 'airplay'     },
      { label: 'Transcripción', active: true,  icon: 'mic'         },
    ],
  },
  {
    index: 3,
    chip: 'Código & Web',
    title: 'Escribe y despliega',
    titleEm: 'código en minutos',
    body: 'Genera, revisa y optimiza código en múltiples lenguajes.',
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

const PERSONAL_DOMAINS = new Set([
  'gmail.com','googlemail.com','hotmail.com','hotmail.es','hotmail.co',
  'outlook.com','outlook.es','live.com','live.cl','live.com.ar','live.com.mx',
  'yahoo.com','yahoo.es','yahoo.com.ar','yahoo.com.mx','yahoo.co',
  'icloud.com','me.com','mac.com',
  'aol.com','msn.com','protonmail.com','proton.me','tutanota.com',
  'yandex.com','yandex.ru','mail.com','zoho.com','gmx.com','inbox.com',
  'terra.com','terra.com.br','bol.com.br','uol.com.br','qq.com','163.com','126.com'
]);

app.post('/api/leads', (req, res) => {
  const { nombre, apellido, telefono, empresa, cargo, email } = req.body;
  if (!nombre || !apellido || !telefono || !empresa || !cargo || !email) {
    return res.json({ ok: false, error: 'Campos incompletos' });
  }
  const domain = (email || '').split('@')[1]?.toLowerCase() || '';
  if (PERSONAL_DOMAINS.has(domain)) {
    return res.json({ ok: false, error: 'Correo personal no permitido. Usa tu correo corporativo.' });
  }

  const fecha = new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' });
  const record = { fecha, nombre, apellido, telefono, empresa, cargo, email };

  try {
    // 1. Save to JSON (primary backup — never loses data)
    let leads = [];
    try { leads = JSON.parse(fs.readFileSync(LEADS_JSON, 'utf8')); } catch(e) { leads = []; }
    leads.push(record);
    fs.writeFileSync(LEADS_JSON, JSON.stringify(leads, null, 2), 'utf8');

    // 2. Rebuild CSV from JSON so it's always in sync
    const esc = (v) => '"' + String(v).replace(/"/g, '""') + '"';
    const rows = leads.map(r =>
      [esc(r.fecha), esc(r.nombre), esc(r.apellido), esc(r.telefono), esc(r.empresa), esc(r.cargo), esc(r.email)].join(',')
    ).join('\n');
    fs.writeFileSync(LEADS_CSV, CSV_HEADER + rows + '\n', 'utf8');

    // 3. Mirror to Google Sheet via Google Form submit
    submitToGoogleSheet(record);

    res.json({ ok: true });
  } catch(err) {
    console.error('Error guardando lead:', err);
    res.json({ ok: false, error: 'Error al guardar' });
  }
});

app.get('/admin/leads/download', (req, res) => {
  try {
    // Always rebuild CSV from JSON source of truth
    let leads = [];
    if (fs.existsSync(LEADS_JSON)) {
      try { leads = JSON.parse(fs.readFileSync(LEADS_JSON, 'utf8')); } catch(e) { leads = []; }
    }
    if (!leads.length) return res.status(404).send('Sin leads registrados aún.');
    const esc = (v) => '"' + String(v || '').replace(/"/g, '""') + '"';
    const rows = leads.map(r =>
      [esc(r.fecha), esc(r.nombre), esc(r.apellido), esc(r.telefono), esc(r.empresa), esc(r.cargo), esc(r.email)].join(',')
    ).join('\n');
    const csv = CSV_HEADER + rows + '\n';
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="leads-multia.csv"');
    res.send(csv);
  } catch(err) {
    res.status(500).send('Error al generar el archivo.');
  }
});

/* ── Start ─────────────────────────────────────────────── */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MultIA running at http://localhost:${PORT}`);
});
