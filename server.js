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
  { icon: 'video',            name: 'Voice in Live',              desc: 'Convierte tu voz en comandos en tiempo real: dicta, edita y controla la plataforma sin tocar el teclado' },
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
      { label: 'Imágenes', active: true,  icon: 'image'       },
      { label: 'Audio',    active: true,  icon: 'music'       },
      { label: 'OCR',      active: false, icon: 'scan-text'   },
    ],
  },
  {
    index: 1,
    chip: 'Datos & Analytics',
    title: 'Analiza datos,',
    titleEm: 'genera dashboards',
    body: 'Procesa grandes datasets de Excel y crea dashboards interactivos con insights automáticos en tiempo real.',
    tags: [
      { label: 'Excel',      active: true,  icon: 'file-spreadsheet' },
      { label: 'Dashboards', active: true,  icon: 'layout-dashboard' },
      { label: 'Reportes',   active: true,  icon: 'bar-chart-3'      },
      { label: 'Big Data',   active: false, icon: 'database'         },
    ],
  },
  {
    index: 2,
    chip: 'Documentos',
    title: 'Word, PDF y PPT',
    titleEm: 'generados al instante',
    body: 'Genera, edita y optimiza documentos profesionales. Transcribe reuniones y convierte audio a texto.',
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
    body: 'Genera, revisa y optimiza código en múltiples lenguajes. Crea interfaces HTML responsive automáticamente.',
    tags: [
      { label: 'Python',     active: true,  icon: 'braces'    },
      { label: 'JavaScript', active: true,  icon: 'code-2'    },
      { label: 'HTML/CSS',   active: true,  icon: 'file-code' },
      { label: 'SQL',        active: false, icon: 'database'  },
    ],
  },
  {
    index: 4,
    chip: 'Proyectos',
    title: 'Colabora y comparte',
    titleEm: 'proyectos con tu equipo',
    body: 'Comparte proyectos con tus colaboradores, permitiéndoles tener acceso a los archivos e historial del chat.',
    tags: [
      { label: 'Proyectos propios',     active: true,  icon: 'folder'         },
      { label: 'Proyectos compartidos', active: true,  icon: 'users'          },
      { label: 'Historial',             active: false, icon: 'history'        },
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

/* ── Video tutorials ───────────────────────────────────── */

const tutorialVideos = [
  {
    title: 'Entra a un proyecto',
    desc: 'Únete a los espacios de trabajo de tu equipo y accede al historial compartido en segundos.',
    icon: 'users',
    src: '/img/Como%20entrar%20a%20un%20proyecto.mp4',
  },
  {
    title: 'Genera imágenes con IA',
    desc: 'Convierte una idea o una referencia en visuales profesionales sin salir de la plataforma.',
    icon: 'image',
    src: '/img/Generar%20im%C3%A1genes.mp4',
  },
  {
    title: 'Construye un dashboard',
    desc: 'Transforma un Excel en un dashboard interactivo con insights automáticos en tiempo real.',
    icon: 'layout-dashboard',
    src: '/img/Tutorial%20Dashboard.mp4',
  },
];

/* ── Legal documents ───────────────────────────────────── */

const legalDocs = {
  privacidad: {
    title: 'Política de Privacidad',
    chip: 'Privacidad',
    updated: '22 de abril de 2026',
    sections: [
      { h: '1. Introducción', p: [
        'En <strong>MultIA</strong>, operada por Synopsis S.A., nos tomamos la privacidad de nuestros usuarios con la máxima seriedad. Esta política describe qué datos recopilamos, cómo los usamos y qué derechos tienes sobre ellos.',
        'Al utilizar nuestra plataforma aceptas las prácticas descritas aquí. Si no estás de acuerdo, te pedimos no usar el servicio.'
      ]},
      { h: '2. Datos que recopilamos', p: [
        'Recopilamos solo la información necesaria para operar y mejorar el servicio:'
      ], list: [
        '<strong>Datos de cuenta:</strong> nombre, correo corporativo, empresa, cargo y teléfono.',
        '<strong>Datos de uso:</strong> interacciones con la plataforma, modelos utilizados y métricas de rendimiento agregadas.',
        '<strong>Datos técnicos:</strong> dirección IP, tipo de dispositivo, navegador y cookies.',
        '<strong>Contenido del usuario:</strong> archivos, prompts y conversaciones que decidas procesar en la plataforma.'
      ]},
      { h: '3. Cómo usamos tus datos', list: [
        'Prestar y mantener el servicio de MultIA.',
        'Procesar tus solicitudes a través de los modelos de inteligencia artificial integrados.',
        'Prevenir fraudes, abusos y proteger la integridad de la plataforma.',
        'Comunicarte actualizaciones, cambios contractuales y notificaciones de seguridad.',
        'Cumplir obligaciones legales aplicables.'
      ]},
      { h: '4. Bóveda digital y Zero Trust', p: [
        'Los datos críticos de tu organización residen en un entorno de uso exclusivo, aislado de la red pública. La IA externa sólo recibe fragmentos descontextualizados, nunca el contenido completo ni el contexto corporativo.',
        'Tu información <strong>nunca</strong> alimenta ni entrena modelos públicos de terceros.'
      ]},
      { h: '5. Compartir información', p: [
        'No vendemos ni alquilamos tus datos personales. Sólo los compartimos con:'
      ], list: [
        'Proveedores de infraestructura que operan bajo acuerdos de confidencialidad.',
        'Autoridades competentes cuando exista obligación legal.',
        'Terceros autorizados explícitamente por ti (por ejemplo, al conectar integraciones).'
      ]},
      { h: '6. Tus derechos', p: [
        'Puedes ejercer en cualquier momento tus derechos de acceso, rectificación, eliminación, oposición y portabilidad escribiendo a <a href="mailto:soporteventas@synopsis.ws">soporteventas@synopsis.ws</a>. Atendemos solicitudes dentro de los plazos previstos por la ley peruana de protección de datos (Ley 29733) y normativas equivalentes.'
      ]},
      { h: '7. Retención', p: [
        'Conservamos tus datos durante el tiempo necesario para cumplir los fines descritos y las obligaciones legales. Al cerrar tu cuenta, eliminamos tu información dentro de los 90 días, salvo que la ley exija un plazo mayor.'
      ]},
      { h: '8. Contacto', p: [
        'Para cualquier duda sobre esta política, escríbenos a <a href="mailto:soporteventas@synopsis.ws">soporteventas@synopsis.ws</a> o llámanos al +51 959 950 520.',
        'Av. Dionisio Derteano 184, San Isidro, Lima, Perú.'
      ]},
    ]
  },

  terminos: {
    title: 'Términos y Condiciones',
    chip: 'Términos',
    updated: '22 de abril de 2026',
    sections: [
      { h: '1. Aceptación', p: [
        'Estos términos regulan el uso de la plataforma <strong>MultIA</strong>, operada por Synopsis S.A. Al crear una cuenta o utilizar el servicio, aceptas estos términos en su totalidad.'
      ]},
      { h: '2. Descripción del servicio', p: [
        'MultIA es un workplace productivo que unifica múltiples modelos de inteligencia artificial (ChatGPT, Claude, Gemini, Grok, entre otros) en una única interfaz, con herramientas de automatización, agentes de conocimiento y controles de seguridad empresarial.'
      ]},
      { h: '3. Cuentas de usuario', list: [
        'Debes ser mayor de edad y tener capacidad legal para contratar.',
        'Te comprometes a proporcionar información veraz y a mantenerla actualizada.',
        'Eres responsable de la confidencialidad de tus credenciales y de toda actividad que ocurra bajo tu cuenta.',
        'Nos reservamos el derecho de suspender cuentas que infrinjan estos términos o realicen actividades fraudulentas.'
      ]},
      { h: '4. Uso aceptable', p: [
        'No está permitido:'
      ], list: [
        'Utilizar la plataforma para fines ilícitos, difamatorios o que vulneren derechos de terceros.',
        'Realizar ingeniería inversa, descompilar o intentar extraer el código fuente.',
        'Revender, sublicenciar o redistribuir el servicio sin autorización escrita.',
        'Generar contenido que infrinja leyes aplicables, derechos de propiedad intelectual o políticas de los modelos integrados.'
      ]},
      { h: '5. Planes y pagos', p: [
        'Los planes vigentes (Pro, Max y Enterprise) se facturan mensual o anualmente según lo contratado. Los precios pueden actualizarse previa notificación con al menos 30 días de anticipación. Puedes cancelar en cualquier momento; la cancelación surte efecto al cierre del ciclo de facturación en curso.'
      ]},
      { h: '6. Propiedad intelectual', p: [
        'MultIA, su marca, logotipo, código y contenido propietario son de Synopsis S.A. El contenido que generes o subas sigue siendo tuyo; al usar el servicio nos otorgas una licencia limitada para procesarlo únicamente con la finalidad de ejecutar tus solicitudes.'
      ]},
      { h: '7. Disponibilidad y limitación de responsabilidad', p: [
        'Nos esforzamos por mantener el servicio disponible 24/7, pero no garantizamos una disponibilidad ininterrumpida. En ningún caso Synopsis S.A. será responsable por daños indirectos, lucro cesante o pérdida de datos, más allá del monto efectivamente pagado por el usuario en los últimos 12 meses.'
      ]},
      { h: '8. Modificaciones', p: [
        'Podemos actualizar estos términos. Publicaremos los cambios en esta página e indicaremos la fecha de última actualización. El uso continuado del servicio tras la publicación implica la aceptación de los nuevos términos.'
      ]},
      { h: '9. Ley aplicable', p: [
        'Estos términos se rigen por las leyes de la República del Perú. Cualquier controversia se someterá a los tribunales competentes de la ciudad de Lima.'
      ]},
      { h: '10. Contacto', p: [
        'Escríbenos a <a href="mailto:soporteventas@synopsis.ws">soporteventas@synopsis.ws</a> para cualquier consulta relacionada con estos términos.'
      ]},
    ]
  },

  cookies: {
    title: 'Política de Cookies',
    chip: 'Cookies',
    updated: '22 de abril de 2026',
    sections: [
      { h: '1. ¿Qué son las cookies?', p: [
        'Las cookies son pequeños archivos de texto que un sitio web almacena en tu dispositivo cuando lo visitas. Permiten recordar preferencias, analizar el uso de la plataforma y ofrecer una experiencia personalizada.'
      ]},
      { h: '2. Cookies que utilizamos', p: [
        'En MultIA empleamos sólo las cookies estrictamente necesarias para el funcionamiento del servicio y algunas de analítica agregada:'
      ], list: [
        '<strong>Esenciales:</strong> mantienen tu sesión iniciada y aseguran la navegación segura. No se pueden desactivar.',
        '<strong>Preferencias:</strong> recuerdan ajustes como idioma o vista preferida.',
        '<strong>Analíticas:</strong> nos ayudan a entender cómo se usa la plataforma de forma agregada y anónima para mejorarla.'
      ]},
      { h: '3. Cookies de terceros', p: [
        'Algunos servicios integrados (por ejemplo, proveedores de pago o análisis) pueden instalar cookies propias bajo sus propias políticas. Sólo trabajamos con proveedores que cumplen estándares reconocidos de protección de datos.'
      ]},
      { h: '4. Cómo gestionar las cookies', p: [
        'Puedes aceptar, rechazar o eliminar las cookies desde la configuración de tu navegador. Ten en cuenta que desactivar las cookies esenciales puede afectar el funcionamiento del servicio.',
        'Guías oficiales: <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener">Chrome</a>, <a href="https://support.mozilla.org/es/kb/proteccion-antirrastreo-mejorada-firefox-escritorio" target="_blank" rel="noopener">Firefox</a>, <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener">Safari</a>, <a href="https://support.microsoft.com/es-es/microsoft-edge" target="_blank" rel="noopener">Edge</a>.'
      ]},
      { h: '5. Cambios en esta política', p: [
        'Podemos actualizar esta política cuando incorporemos nuevos servicios o tecnologías. La fecha de última actualización aparece al inicio del documento.'
      ]},
      { h: '6. Contacto', p: [
        'Para cualquier consulta sobre cookies escríbenos a <a href="mailto:soporteventas@synopsis.ws">soporteventas@synopsis.ws</a>.'
      ]},
    ]
  }
};

/* ── Routes ────────────────────────────────────────────── */

app.get('/', (req, res) => {
  res.render('index', { models, features, userProfiles, benefits, pricingPlans, storySteps, tutorialVideos });
});

app.get('/legal/:slug', (req, res) => {
  const slug = req.params.slug;
  const doc = legalDocs[slug];
  if (!doc) return res.status(404).send('Documento no encontrado');
  res.render('legal', { ...doc, slug });
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

const PORT = process.env.PORT || 3800;
app.listen(PORT, () => {
  console.log(`MultIA running at http://localhost:${PORT}`);
});
