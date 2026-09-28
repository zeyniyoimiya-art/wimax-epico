import { esquemaFicha, esquemaEntrada, esquemaSobreMi, type Entrada } from './esquemas'

/* ═══════════════ ENTRADA DESTACADA: RED WiMAX ═══════════════ */
export const fichaWimax = esquemaFicha.parse({
  slug: 'red-wimax',
  titulo: 'Red WiMAX: la promesa inalámbrica que llegó a Bolivia',
  fecha: '2026-09-27',
  autor: 'Calle Cucho Josué Salomón',
  etiquetas: ['Telecomunicaciones', 'Redes', 'Bolivia'],
  resumen:
    'Investigación completa sobre WiMAX: qué es, su historia y personajes, la cobertura mundial y su llegada a Bolivia con Entel, VIVA y COTAS.',
  cita:
    '¿Y si pudieras dar internet a toda una ciudad sin cavar una sola zanja ni colgar un solo cable? Eso prometía WiMAX, la tecnología que en 2008 llegó a Bolivia con bombos y platillos… y que hoy casi nadie recuerda.',

  comparativa: [
    {
      criterio: 'Alcance',
      wifi: '100–200 metros',
      wimax: 'Kilómetros (3–10 km típico; hasta ~50 km en línea de vista)',
      destaca: true
    },
    { criterio: 'Cobertura', wifi: 'Una casa, un café, una oficina', wimax: 'Barrios, ciudades enteras y zonas rurales', destaca: true },
    { criterio: 'Tipo de red', wifi: 'Local (LAN)', wimax: 'Metropolitana (MAN) / última milla', destaca: true },
    { criterio: 'Estándar', wifi: 'IEEE 802.11', wimax: 'IEEE 802.16', destaca: false },
    {
      criterio: 'Movilidad',
      wifi: 'Sí, mientras estés dentro del punto de acceso',
      wimax: 'WiMAX móvil: traspaso entre antenas, como una red celular',
      destaca: true
    }
  ],

  specs: [
    {
      etiqueta: 'Velocidad',
      valor: 'hasta ~70 Mbps',
      detalle: 'Decenas de Mbps en la práctica; 802.16m prometía 100 Mbps en movilidad.'
    },
    { etiqueta: 'Bandas', valor: '2.5 · 3.5 · 5.8 GHz', detalle: 'Licenciadas o no licenciadas según el país y el regulador.' },
    { etiqueta: 'Alcance', valor: '3–10 km típico', detalle: 'Hasta ~50 km en condiciones de línea de vista.' },
    { etiqueta: 'Usos', valor: 'última milla · backhaul', detalle: 'Triple play (VoIP + datos + video) y conectividad rural.' },
    {
      etiqueta: 'Normas',
      valor: '802.16 → 802.16m',
      detalle: '802.16 (2001) · 802.16-2004 fijo · 802.16e-2005 móvil · 802.16m (2011).'
    }
  ],

  sabores: [
    {
      nombre: 'WiMAX fijo',
      norma: 'IEEE 802.16-2004',
      texto:
        'La antena del cliente queda fija en la casa o empresa. Reemplazaba al par de cobre o a la fibra óptica en zonas donde llevarlos era carísimo.'
    },
    {
      nombre: 'WiMAX móvil',
      norma: 'IEEE 802.16e-2005 · “Rev-e”',
      texto:
        'Permitía movilidad real: transferencia entre antenas como en una red celular de datos. Fue el que más se popularizó en el mundo.'
    }
  ],

  linea: [
    {
      anio: '1999',
      titulo: 'Nace el grupo IEEE 802.16',
      texto: 'La IEEE crea el grupo de trabajo de redes metropolitanas inalámbricas, presidido por Roger B. Marks (NIST).',
      emoji: '🧪',
      tono: 'base'
    },
    {
      anio: '2001',
      titulo: 'Primer estándar y nace el WiMAX Forum',
      texto:
        'Sale el 802.16 y se forma el consorcio (junio 2001) con Nokia, Intel, Motorola y Samsung para que los equipos de distintas marcas sean interoperables.',
      emoji: '🤝',
      tono: 'base'
    },
    {
      anio: '2004',
      titulo: 'WiMAX fijo: 802.16-2004',
      texto: 'Llega la primera generación de productos certificados para acceso fijo en el hogar y la empresa.',
      emoji: '📡',
      tono: 'base'
    },
    {
      anio: '2005',
      titulo: 'WiMAX móvil: 802.16e-2005',
      texto: 'El salto grande: movilidad real. Era “como un 4G… antes de que existiera el 4G”.',
      emoji: '🚀',
      tono: 'auge'
    },
    {
      anio: '2006',
      titulo: 'Corea del Sur enciende WiBro',
      texto: 'El primer servicio comercial de la familia en el mundo (junio 2006), de la mano de KT con tecnología de Samsung.',
      emoji: '🇰🇷',
      tono: 'auge'
    },
    {
      anio: '2007–2010',
      titulo: 'El auge global',
      texto:
        'Intel invierte cientos de millones en Clearwire y promete chips con WiMAX integrado; Sprint lanza XOHM en Baltimore, Rusia despliega Yota y Japón a UQ. Bolivia entra al mapa.',
      emoji: '💥',
      tono: 'auge'
    },
    {
      anio: '2008',
      titulo: 'Bolivia se suma al mapa',
      texto: 'Entel firma con Alcatel-Lucent y VIVA (Nuevatel) lanza su red WiMAX Rev-e el 28 de mayo de 2008.',
      emoji: '🇧🇴',
      tono: 'bolivia'
    },
    {
      anio: '2010',
      titulo: 'El quiebre',
      texto: 'Intel disuelve su programa WiMAX y apuesta por LTE. Sin su mayor padrino, la balanza se inclina hacia el estándar rival.',
      emoji: '⚠️',
      tono: 'caida'
    },
    {
      anio: '2011',
      titulo: 'WiMAX 2 (802.16m)',
      texto: 'Velocidades teóricas de 100 Mbps en movilidad… pero ya casi nadie lo despliega.',
      emoji: '🧊',
      tono: 'caida'
    },
    {
      anio: '2013–2016',
      titulo: 'Se apaga en Estados Unidos',
      texto: 'Sprint compra Clearwire y apaga la red WiMAX para reutilizar el espectro en LTE.',
      emoji: '🔌',
      tono: 'caida'
    },
    {
      anio: 'Hoy',
      titulo: 'Sobrevive en nichos',
      texto:
        'Backhaul rural, equipos industriales y AeroMACS en aviación. El WiMAX Forum sigue activo, enfocado en esos nichos.',
      emoji: '🛰️',
      tono: 'base'
    }
  ],
  personajes: [
    {
      nombre: 'Roger B. Marks',
      bandera: '🇺🇸',
      rol: 'Presidente del grupo IEEE 802.16',
      texto:
        'Ingeniero del NIST y presidente del grupo de trabajo desde su creación en 1999. El arquitecto del estándar: sin él no existiría el número 802.16.'
    },
    {
      nombre: 'Ron Resnick',
      bandera: '🇺🇸',
      rol: 'Presidente del WiMAX Forum (hasta 2012)',
      texto:
        'El evangelista comercial: recorrió el mundo convenciendo a operadores y gobiernos de que WiMAX era el futuro de la banda ancha.'
    },
    {
      nombre: 'Craig Barrett',
      bandera: '🇺🇸',
      rol: 'Presidente de Intel',
      texto:
        'En su discurso de SuperComm (2002) puso a WiMAX en el mapa: la banda ancha inalámbrica era el siguiente gran salto. El padrino industrial número uno.'
    },
    {
      nombre: 'Sean Maloney',
      bandera: '🇺🇸',
      rol: 'Ejecutivo clave de Intel',
      texto:
        'Lideró la apuesta por WiMAX y convenció a Intel de invertir en Clearwire. Cuando la empresa abandonó el barco en 2010, el programa se disolvió con él.'
    },
    {
      nombre: 'Craig McCaw',
      bandera: '🇺🇸',
      rol: 'Fundador de Clearwire',
      texto:
        'Pionero de la telefonía celular en EE.UU. Puso dinero, espectro y su leyenda para intentarlo una vez más con la mayor red WiMAX de Norteamérica.'
    },
    {
      nombre: 'Mauricio Cáceres',
      bandera: '🇧🇴',
      rol: 'Gerente de Tecnologías de Entel (2008)',
      texto:
        'Explicó que con WiMAX el acceso a internet “podría ser desde cualquier lugar de la ciudad”, cuando antes solo había LAN con cable y Wi-Fi de 100–200 metros.',
      boliviano: true
    },
    {
      nombre: 'Freddy Maldonado Valcik',
      bandera: '🇧🇴',
      rol: 'Presidente ejecutivo de Nuevatel (VIVA)',
      texto:
        'Impulsor de la red WiMAX comercial boliviana: prometió “un amplio conjunto de servicios inalámbricos de banda ancha” para La Paz, El Alto, Santa Cruz y Cochabamba.',
      boliviano: true
    },
    {
      nombre: 'Víctor Agnellini',
      bandera: '🌎',
      rol: 'Presidente de Alcatel-Lucent para Latinoamérica',
      texto: 'Proveedor de las redes WiMAX de Entel y VIVA. Su empresa fue la que puso la tecnología en las torres bolivianas.',
      boliviano: true
    }
  ],

  paises: [
    {
      bandera: '🇰🇷',
      pais: 'Corea del Sur',
      operador: 'KT / SKT (WiBro)',
      anio: '2006',
      detalle: 'El primer servicio comercial de la familia en el mundo; allá se llamó WiBro.',
      fuerza: 96
    },
    {
      bandera: '🇺🇸',
      pais: 'Estados Unidos',
      operador: 'Sprint (XOHM) → Clearwire',
      anio: '2008–2009',
      detalle: 'Baltimore fue la primera ciudad; invirtieron Intel, Google y Comcast.',
      fuerza: 92
    },
    {
      bandera: '🇷🇺',
      pais: 'Rusia',
      operador: 'Yota (Scartel)',
      anio: '2008',
      detalle: 'Lanzó en Moscú y San Petersburgo; después migró a LTE.',
      fuerza: 74
    },
    {
      bandera: '🇯🇵',
      pais: 'Japón',
      operador: 'UQ Communications (KDDI)',
      anio: '2009',
      detalle: 'Red móvil nacional de cobertura amplia.',
      fuerza: 70
    },
    {
      bandera: '🇨🇱',
      pais: 'Chile',
      operador: 'Telmex / Claro',
      anio: '2007',
      detalle: 'El despliegue WiMAX más grande de Latinoamérica: cerca del 98 % de cobertura nacional.',
      fuerza: 88
    },
    {
      bandera: '🇦🇺',
      pais: 'Australia',
      operador: 'BigAir',
      anio: '2007',
      detalle: 'Servicios empresariales en Sydney, Melbourne, Brisbane y Perth.',
      fuerza: 58
    },
    {
      bandera: '🇧🇴',
      pais: 'Bolivia',
      operador: 'COTAS · Entel · VIVA',
      anio: '2004–2009',
      detalle: 'Del pionero inalámbrico de COTAS en 2004 a las redes comerciales Rev-e de 2008.',
      fuerza: 80
    }
  ],
  hitosBolivia: [
    {
      titulo: 'El antecedente: COTAS y la banda ancha inalámbrica',
      anio: '2004',
      texto:
        'COTAS contrató a la israelí Alvarion un sistema de banda ancha inalámbrica en 3.8 GHz (7 millones de dólares) para reemplazar su anticuada telefonía fija inalámbrica en Santa Cruz.',
      emoji: '🌱'
    },
    {
      titulo: 'Entel + Alcatel-Lucent',
      anio: '2008',
      texto:
        'Se anunció “la primera red comercial WiMAX Rev-e de Bolivia” (802.16e-2005) para VoIP, banda ancha, video y datos, con antenas en las capitales de los nueve departamentos.',
      emoji: '📶'
    },
    {
      titulo: 'VIVA (Nuevatel) + Alcatel-Lucent',
      anio: '28/05/2008',
      texto:
        'Red comercial Rev-e para VoIP e internet residencial con equipos del taiwanés ZyXEL, con foco en La Paz, El Alto, Santa Cruz y Cochabamba.',
      emoji: '🟣'
    },
    {
      titulo: 'COTAS + Airspan: WiMAX multi-ciudad',
      anio: '2009',
      texto:
        'Despliegue multi-ciudad en el departamento de Santa Cruz. Los reportes de la época citaban una penetración de banda ancha de apenas 10,4 % en el país.',
      emoji: '🏙️'
    },
    {
      titulo: '¿Y después?',
      anio: '2010 → hoy',
      texto:
        'WiMAX fue la antesala: VIVA lanzó el primer 3G (2010) y el primer 4G LTE del país (2014); Entel, ya estatal, se convirtió en el mayor operador nacional. La idea quedó demostrada: la banda ancha inalámbrica era viable en Bolivia.',
      emoji: '🤍'
    }
  ],

  empresas: [
    {
      empresa: 'Entel',
      rol: 'Operador (privatizado en 1995, estatal desde mayo de 2008)',
      tecnologia: 'WiMAX Rev-e (802.16e)',
      proveedor: 'Alcatel-Lucent',
      zona: 'Capitales de los 9 departamentos',
      anio: '2008'
    },
    {
      empresa: 'VIVA (Nuevatel)',
      rol: 'Operador móvil',
      tecnologia: 'WiMAX Rev-e + equipos de cliente',
      proveedor: 'Alcatel-Lucent + ZyXEL',
      zona: 'La Paz, El Alto, Santa Cruz, Cochabamba',
      anio: '2008'
    },
    {
      empresa: 'COTAS',
      rol: 'Cooperativa de telecomunicaciones de Santa Cruz',
      tecnologia: 'Banda ancha inalámbrica 3.8 GHz → WiMAX multi-ciudad',
      proveedor: 'Alvarion (2004) → Airspan (2009)',
      zona: 'Santa Cruz y alrededores',
      anio: '2004 / 2009'
    }
  ],

  proveedores: ['Alcatel-Lucent (Francia/EE.UU.)', 'ZyXEL (Taiwán)', 'Airspan (EE.UU.)', 'Alvarion (Israel)'],
  regulador:
    'La ATT (Autoridad de Regulación y Fiscalización de Telecomunicaciones y Transportes) administra el espectro radioeléctrico y otorga las licencias de uso de frecuencias.',

  aprendizajes: [
    'La mejor tecnología no siempre gana. WiMAX fue técnicamente sólido, pionero en certificación de interoperabilidad y llegó antes que LTE… pero LTE ganó por ecosistema, respaldo industrial y roaming. El mercado pesa más que la elegancia técnica.',
    'Bolivia estuvo en el mapa. No fuimos espectadores: COTAS ya en 2004, y Entel y VIVA en 2008, desplegaron infraestructura WiMAX. Para un país con nuestra geografía, apostar a lo inalámbrico era pura lógica.',
    'Las tecnologías puente importan. WiMAX fue el puente entre el internet cableado y el 4G real. Los puentes casi no aparecen en los libros… pero son los que conectan pueblos.'
  ],
  glosario: [
    {
      termino: '802.16',
      definicion:
        'La familia de normas IEEE para acceso inalámbrico de banda ancha en redes metropolitanas (WMAN). Es el apellido técnico de WiMAX.',
      etiquetas: ['Norma', 'IEEE']
    },
    {
      termino: 'WiMAX',
      definicion:
        'Acrónimo de Worldwide Interoperability for Microwave Access: el nombre comercial de la certificación de equipos 802.16, popularizado por el WiMAX Forum.',
      etiquetas: ['Comercial']
    },
    {
      termino: 'WiBro',
      definicion:
        'Nombre del servicio WiMAX móvil en Corea del Sur (Wireless Broadband). Fue el primer despliegue comercial de la familia, en junio de 2006.',
      etiquetas: ['Corea', 'Historia']
    },
    {
      termino: 'Rev-e',
      definicion: 'Abreviatura de 802.16e-2005 (“revisión e”), la enmienda que agregó movilidad y traspaso entre antenas.',
      etiquetas: ['Norma']
    },
    {
      termino: 'Zona de Fresnel',
      definicion:
        'El volumen elíptico de espacio que la señal de radio necesita libre de obstáculos entre la antena y el receptor. Si se bloquea, la señal llega debilitada o se corta.',
      etiquetas: ['Radiofrecuencia', 'Laboratorio']
    },
    {
      termino: 'Línea de vista (LOS)',
      definicion:
        'Condición en la que la antena transmisora y la receptora se “ven” sin obstáculos. Es clave para los alcances grandes de WiMAX (hasta ~50 km).',
      etiquetas: ['Radiofrecuencia']
    },
    {
      termino: 'Última milla',
      definicion: 'El tramo final que conecta al usuario con la red del operador. WiMAX nació para resolverlo sin cables.',
      etiquetas: ['Redes']
    },
    {
      termino: 'Backhaul',
      definicion: 'Enlace de transporte que lleva el tráfico desde las antenas hasta el núcleo de la red del operador.',
      etiquetas: ['Redes']
    },
    {
      termino: 'Espectro licenciado',
      definicion:
        'Frecuencias que se usan con permiso del Estado — en Bolivia, la ATT — para evitar interferencias entre operadores.',
      etiquetas: ['Regulación', 'Bolivia']
    },
    {
      termino: '2.5 / 3.5 / 3.8 GHz',
      definicion:
        'Bandas típicas de WiMAX: 2.5 GHz para móvil en EE.UU., 3.5 GHz para fijo y 3.8 GHz en despliegues como el de COTAS.',
      etiquetas: ['Radiofrecuencia']
    },
    {
      termino: 'OFDMA',
      definicion:
        'Multiplexación por división de frecuencia ortogonal: la técnica que comparten WiMAX y LTE para atender a muchos usuarios a la vez.',
      etiquetas: ['Técnica']
    },
    {
      termino: 'WiMAX Forum',
      definicion:
        'Consorcio industrial fundado en 2001 que certificaba la interoperabilidad de los equipos 802.16. Sigue activo, enfocado en nichos.',
      etiquetas: ['Industria']
    },
    {
      termino: 'AeroMACS',
      definicion:
        'Perfil de WiMAX adaptado a la aviación (comunicaciones en aeropuertos). Es uno de los supervivientes actuales del estándar.',
      etiquetas: ['Nichos', 'Aviación']
    },
    {
      termino: 'Clearwire',
      definicion:
        'Empresa de Craig McCaw que construyó la mayor red WiMAX de EE.UU. con inversiones de Intel, Google y Comcast.',
      etiquetas: ['Empresas', 'Historia']
    },
    {
      termino: 'LTE',
      definicion: 'Long Term Evolution, el estándar 4G del 3GPP que terminó desplazando a WiMAX en el mercado global.',
      etiquetas: ['Competencia']
    }
  ],

  fuentes: [
    { titulo: 'WiMAX', medio: 'Wikipedia (en inglés)', url: 'https://en.wikipedia.org/wiki/WiMAX', bloque: 'general' },
    { titulo: 'IEEE 802.16', medio: 'Wikipedia (en inglés)', url: 'https://en.wikipedia.org/wiki/IEEE_802.16', bloque: 'general' },
    { titulo: 'WiMAX Forum — sitio oficial', medio: 'WiMAX Forum', url: 'https://wimaxforum.org/', bloque: 'general' },
    { titulo: 'IEEE 802.16 Working Group', medio: 'IEEE', url: 'https://ieee802.org/16/', bloque: 'general' },
    { titulo: 'Estándares IEEE 802', medio: 'IEEE 802', url: 'https://ieee802.org/', bloque: 'general' },
    { titulo: 'WiBro (banda ancha inalámbrica en Corea del Sur)', medio: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/WiBro', bloque: 'auge' },
    { titulo: 'Clearwire', medio: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Clearwire', bloque: 'auge' },
    { titulo: 'UQ Communications (Japón)', medio: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/UQ_Communications', bloque: 'auge' },
    { titulo: 'Scartel / Yota (Rusia)', medio: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Scartel', bloque: 'auge' },
    { titulo: '4G y la transición hacia LTE', medio: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/4G', bloque: 'auge' },
    { titulo: 'AeroMACS (WiMAX en aviación)', medio: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/AeroMACS', bloque: 'auge' },
    { titulo: 'Entel Bolivia — sitio oficial', medio: 'Entel', url: 'https://www.entel.bo/', bloque: 'bolivia' },
    { titulo: 'VIVA — sitio oficial', medio: 'Nuevatel', url: 'https://www.viva.com.bo/', bloque: 'bolivia' },
    {
      titulo: 'COTAS — sitio oficial',
      medio: 'Cooperativa de Telecomunicaciones Santa Cruz',
      url: 'https://www.cotas.com.bo/',
      bloque: 'bolivia'
    },
    {
      titulo: 'ATT — Autoridad de Regulación y Fiscalización de Telecomunicaciones y Transportes',
      medio: 'Estado Plurinacional de Bolivia',
      url: 'https://www.att.gob.bo/',
      bloque: 'bolivia'
    },
    {
      titulo: '“Entel firma con Alcatel-Lucent la primera red WiMAX de Bolivia” (2008)',
      medio: 'Prensa boliviana de la época',
      bloque: 'bolivia'
    },
    { titulo: '“Nuevatel lanza su red WiMAX Rev-e” (28/05/2008)', medio: 'Prensa boliviana de la época', bloque: 'bolivia' },
    { titulo: '“COTAS despliega WiMAX multi-ciudad con Airspan” (2009)', medio: 'Prensa especializada de la época', bloque: 'bolivia' }
  ],

  pendiente:
    'Queda por confirmar con documentación primaria: la resolución exacta de la ATT que asignó el espectro de 3.8 GHz a COTAS y la fecha en que se apagaron las últimas celdas WiMAX bolivianas.'
})
/* ═══════════════ ÍNDICE DEL BLOG ═══════════════ */
export const entradas: Entrada[] = [
  esquemaEntrada.parse({
    slug: 'radar-de-senal',
    titulo: 'El radar de la señal: qué significa la potencia en dBm',
    resumen: 'Cómo leer la potencia de una señal inalámbrica sin perderte: dBm, milivatios y por qué −70 dBm está bien… y −95 dBm es sufrimiento.',
    fecha: '2026-10-11',
    etiquetas: ['Redes', 'Radiofrecuencia'],
    emoji: '📶',
    minutos: 6
  }),
  esquemaEntrada.parse({
    slug: 'como-funciona-la-red-wimax',
    titulo: 'Cómo funciona una red WiMAX, paso a paso',
    resumen: 'La torre, la antena del cliente, la línea de vista y el núcleo de la red: el recorrido de un paquete de datos sobre 802.16.',
    fecha: '2026-10-04',
    etiquetas: ['Redes', 'Técnico'],
    emoji: '🛠️',
    minutos: 8
  }),
  esquemaEntrada.parse({
    slug: 'cobertura-wimax-en-el-mundo',
    titulo: 'Cobertura WiMAX en el mundo',
    resumen: 'Corea del Sur, Chile, Rusia, Japón, Australia y Bolivia: quién desplegó WiMAX, cuándo y con qué operadores.',
    fecha: '2026-09-30',
    etiquetas: ['Telecomunicaciones', 'Mundo'],
    emoji: '🌍',
    minutos: 5
  }),
  esquemaEntrada.parse({
    slug: 'red-wimax',
    titulo: 'Red WiMAX: la promesa inalámbrica que llegó a Bolivia',
    resumen:
      'Investigación completa: qué es WiMAX, su historia y personajes, la cobertura mundial y su llegada a Bolivia con Entel, VIVA y COTAS.',
    fecha: '2026-09-27',
    etiquetas: ['Telecomunicaciones', 'Redes', 'Bolivia'],
    emoji: '📡',
    destacada: true,
    minutos: 14
  }),
  esquemaEntrada.parse({
    slug: 'sobre-mi',
    titulo: 'Sobre mí',
    resumen: 'Quién escribe este blog, por qué se llama ZenithSpace, qué investigo para la materia de Redes y cómo trabajo cada tema.',
    fecha: '2026-09-01',
    etiquetas: ['Personal'],
    emoji: '🌙',
    minutos: 3
  })
]

export const destacada: Entrada = entradas.find((e) => e.destacada) ?? entradas[0]

/* ═══════════════ SOBRE MÍ ═══════════════ */
export const sobreMi = esquemaSobreMi.parse({
  titulo: 'Sobre mí',
  parrafos: [
    '¡Hola! Soy Josué. Mi nombre completo es Calle Cucho Josué Salomón y estudio Sistemas Informáticos en el Instituto Técnico Comercial INCOS de El Alto, Bolivia.',
    'Este blog nació como una idea simple: en vez de presentar cada trabajo del bimestre en un cuaderno o en una carpeta, publicarlo en un espacio propio donde cada investigación quede ordenada, con su contexto, sus datos y sus fuentes al final.',
    'En internet también me encuentro como Lynyue. “Zenith” es el punto más alto del cielo —el cénit— y “space”, porque el espacio es enorme y siempre hay algo nuevo que aprender. Blogger, YouTuber, desarrollador… al final todos somos un poco exploradores de un espacio propio. 🛰️'
  ],
  gustos: [
    {
      titulo: 'Redes y telecomunicaciones',
      texto: 'Entender cómo viajan los datos de un punto a otro. La primera entrada es sobre WiMAX, una tecnología que llegó a Bolivia y casi nadie recuerda.',
      emoji: '📡'
    },
    {
      titulo: 'Radioenlaces y cobertura',
      texto: 'Calcular cómo viaja una señal: qué obstáculos la frenan, cuánta zona libre necesita y por qué la altura de la torre lo cambia todo.',
      emoji: '📶'
    },
    {
      titulo: 'Aprender rompiendo cosas',
      texto: 'Instalando, configurando y arreglando… incluso lo que rompo yo mismo. Bueno, sobre todo lo que rompo yo mismo. 😅',
      emoji: '🧨'
    }
  ],
  datos: [
    { clave: 'Nombre', valor: 'Calle Cucho Josué Salomón' },
    { clave: 'Institución', valor: 'INCOS · El Alto, Bolivia' },
    { clave: 'Carrera', valor: 'Sistemas Informáticos' },
    { clave: 'Materia', valor: 'Redes de computadoras' },
    { clave: 'Alias', valor: 'Lynyue 🌙' }
  ]
})
