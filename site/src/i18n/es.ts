// Spanish (neutral). Same keys as `en.ts`; a missing key fails `npm test`, so a half-translated
// release cannot ship quietly.

export default {
  "page.title": "OpenShelf — plantillas de agentes para OpenBot",
  "page.description":
    "Directorio comunitario de plantillas de agentes para OpenBot (openbot.run). Cada ficha enlaza a la plantilla oficial publicada por su autor u ofrece un archivo .zip; la instalación se realiza en OpenBot.",
  "nav.home": "Catálogo",
  "nav.about": "Acerca de",
  "nav.language": "Idioma",
  "locale.en": "Inglés",
  "locale.es": "Español",
  "locale.switch.en": "Cambiar a inglés",
  "locale.switch.es": "Cambiar a español",
  "nav.submit": "Enviar una plantilla",
  "theme.toDark": "Cambiar al tema oscuro",
  "theme.toLight": "Cambiar al tema claro",
  "count.none": "Todavía no hay plantillas publicadas.",
  "count.one": "1 plantilla publicada.",
  "count.many": "{count} plantillas publicadas.",
  "count.filtered": "{shown} de {total} plantillas.",
  "toolbar.label": "Buscar y filtrar",
  "search.label": "Buscar plantillas",
  "search.shortcut": "Ctrl K",
  "filter.language": "Idioma de las instrucciones",
  "filter.language.all": "Todos los idiomas",
  "filter.category": "Categoría",
  "filter.category.all": "Todas",
  "filter.clear": "Borrar filtros",
  "card.details": "Detalles →",
  "a11y.newTab": "(abre openbot.run)",
  "card.install": "Instalar",
  "card.download": "Descargar .zip",
  "card.updated": "Actualizado {date}",
  "card.by": "por {name}",
  "empty.catalog.title": "La estantería todavía está vacía.",
  "empty.catalog.body": "El catálogo todavía no tiene plantillas. La tuya podría ser la primera:",
  "empty.catalog.action": "Enviar una plantilla",
  "empty.filtered.title": "No hay nada en esta estantería.",
  "empty.filtered.body": "Ninguna plantilla coincide con tu búsqueda y los filtros seleccionados.",
  "noscript":
    "La búsqueda y los filtros necesitan JavaScript. Sin él, aquí aparecen todas las plantillas publicadas.",
  "catalog.note":
    "Que una plantilla aparezca aquí no significa que la recomendemos. Descarga el archivo o abre la plantilla oficial, lee las instrucciones del agente y decide si quieres instalarla. Las plantillas son obra de autores independientes y OpenShelf no prueba su funcionamiento.",
  "category.dev": "Desarrollo",
  "category.research": "Investigación",
  "category.media": "Medios",
  "category.business": "Negocios",
  "category.ops": "Operaciones",
  "category.personal": "Personal",
  "category.other": "Otros",
  "about.title": "Acerca de OpenShelf",
  "about.intro":
    "OpenShelf es un directorio comunitario de plantillas de agentes para OpenBot. Las indexa y describe para que sea fácil encontrarlas; la instalación se realiza en OpenBot, no aquí.",
  "about.not.title": "Lo que OpenShelf no es",
  "about.not.affiliated":
    "OpenShelf no está afiliado a OpenBot ni a Synthetify Labs sp. z o.o., y ninguna de estas entidades lo respalda ni lo patrocina.",
  "about.not.hosted":
    "OpenShelf no aloja agentes. Sirve un archivo .zip con el perfil público de la plantilla, y el archivo se importa en OpenBot.",
  "about.not.responsible":
    "OpenShelf no se hace responsable de lo que haga un agente después de instalarlo. Lee primero sus instrucciones.",
  "about.not.tracking":
    "OpenShelf no tiene cuentas, no instala cookies propias ni rastrea a sus visitantes.",
  "about.submit.title": "Cómo se incluye una plantilla",
  "about.submit.1":
    "Publica el agente en OpenBot con Publish, en la cabecera del chat. Copia el enlace https://openbot.run/agents/<id>. Cada cuenta puede publicar hasta 5 agentes.",
  "about.submit.2":
    "Abre «Enviar una plantilla» y añade el enlace, nombre, descripción, categoría, etiquetas e idioma.",
  "about.submit.3":
    "Un flujo de trabajo convierte el envío en un pull request con templates/<slug>.json. El contenido se trata como texto; no se ejecuta nada.",
  "about.submit.4":
    "Las comprobaciones automáticas validan el esquema, el enlace oficial (respuesta HTTP 200), los duplicados y posibles secretos. Después, una persona moderadora revisa y aprueba o rechaza la plantilla.",
  "about.submit.note":
    "Nada aparece hasta que se aprueba y se integra un pull request. Una ficha puede retirarse mediante pull request, a petición del autor o tras una denuncia de abuso.",
  "about.votes.title": "Votos",
  "about.votes.body":
    "No hay votos. Un contador necesitaría un vínculo fiable entre cada plantilla y su envío, que las personas colaboradoras no pudieran reasignar. El número de una incidencia en un archivo no basta; un contador que se pueda reaprovechar es peor que no tener ninguno. Podrá volver cuando se demuestre ese vínculo.",
  "about.licenses.title": "Licencias",
  "about.licenses.code": "Código y scripts del sitio: MIT.",
  "about.licenses.templates": "Archivos de templates/: CC BY 4.0, con atribución al autor.",
  "about.licenses.legal":
    "Los textos legales son borradores y no entran en vigor hasta completar los datos de la entidad.",
  "about.personal.title": "Datos personales",
  "about.personal.body":
    "El sitio no instala cookies ni usa analítica. GitHub Pages recibe las IP de quienes lo visitan, como cualquier servidor. Los envíos se tramitan en GitHub desde tu cuenta. El catálogo publica solo el nombre elegido y tu usuario de GitHub, nunca tu correo.",
  "detail.back": "Catálogo",
  "detail.updated": "Actualizado {date}",
  "detail.about": "Qué hace",
  "detail.contents": "Qué contiene el agente",
  "detail.title": "Título",
  "detail.skills": "Skills",
  "detail.routines": "Rutinas",
  "detail.none": "ninguna",
  "detail.routinesYes": "sí, el agente tiene rutinas programadas",
  "detail.instructions": "Instrucciones del agente",
  "detail.instructionsNote":
    "El texto anterior es lo que publicó el autor. Se muestra como texto, nunca se interpreta.",
  "detail.install": "Instalación",
  "detail.installOfficial": "Abrir la plantilla en OpenBot ↗",
  "detail.officialNote":
    "El enlace abre la plantilla oficial en OpenBot. La instalación es un clic en Install allí; OpenShelf no puede instalarla por ti.",
  "detail.installZip": "Descargar .zip",
  "detail.zipNote": "O descarga el archivo e impórtalo desde Settings → Import.",
  "detail.archiveNote":
    "El archivo contiene el perfil público de la plantilla: nombre, título, instrucciones y rutinas, cuando existen. No incluye archivos del espacio de trabajo, memorias ni secretos.",
  "detail.author": "Autor",
  "detail.language": "Idioma",
  "detail.published": "Publicado",
  "detail.source": "Archivo del catálogo",
  "detail.report": "¿Algo no está bien?",
  "detail.reportBody":
    "Si un enlace no funciona, un agente hace algo distinto de lo que se describe aquí o el contenido infringe derechos,",
  "detail.reportAction": "abre un informe",
  "detail.reportTail": "La moderación puede retirar la plantilla del catálogo.",
  "detail.delisted": "Esta plantilla se retiró del catálogo.",
  "detail.requirements": "Requisitos",
  "detail.noneRequired": "Nada más allá de OpenBot.",
  "import.title": "Importar una plantilla desde un archivo .zip",
  "import.intro":
    "Descarga el archivo, revisa las instrucciones e impórtalo en OpenBot. OpenShelf no lo instala por ti.",
  "import.step1": "1. Abre Settings en OpenBot.",
  "import.step2": "2. Selecciona Import.",
  "import.step3": "3. Selecciona el archivo .zip que descargaste y sigue las indicaciones de OpenBot.",
  "import.caution":
    "Lee la plantilla y comprueba qué permisos solicitan sus instrucciones antes de importarla.",
  "footer.tagline": "Catálogo comunitario de plantillas de agentes para OpenBot.",
  "footer.explore": "Explorar",
  "footer.catalog": "Catálogo",
  "footer.submit": "Enviar una plantilla",
  "footer.github": "GitHub",
  "footer.information": "Información",
  "footer.about": "Acerca de",
  "footer.privacy": "Privacidad",
  "footer.terms": "Condiciones",
  "footer.disclaimer": "Aviso legal",
  "footer.source": "Código fuente",
  "footer.notAffiliated":
    "OpenShelf es un proyecto comunitario independiente. No está afiliado a OpenBot ni a Synthetify Labs sp. z o.o., y ninguna de estas entidades lo respalda ni lo patrocina. “OpenBot” se usa de forma descriptiva, solo para identificar la plataforma para la que son estas plantillas.",
  "footer.licenses":
    "Código y scripts del sitio: MIT. Plantillas de agentes: CC BY 4.0, con atribución a cada autor.",
  "footer.draft": "La Política de privacidad y las Condiciones son borradores y no están vigentes.",
  "footer.copyright": "Los autores de las plantillas conservan sus derechos de autor.",
  "legal.draft": "BORRADOR — no vigente",
  "legal.back": "Volver a OpenShelf",
  "privacy.title": "Política de privacidad — BORRADOR",
  "privacy.description": "Política de privacidad de OpenShelf. Borrador, no vigente.",
  "privacy.status":
    "Borrador, no vigente. Basada en la revisión legal del 2026-10-27; todavía no identifica al responsable. Completa todos los [placeholder] y obtén una revisión antes de anunciar el catálogo. Describe el funcionamiento actual; los campos pendientes corresponden a la identidad legal, no son promesas sobre el funcionamiento. No es asesoramiento jurídico.",
  "privacy.1":
    "1. Responsable — [Legal entity, form, registration number, address], [contact e-mail]. Delegado de protección de datos o representante en la UE, cuando sea obligatorio: [name and contact, or “not appointed”].",
  "privacy.2.intro":
    "2. Qué datos trata el sitio. El sitio es estático: no instala cookies, no almacena datos en tu navegador para rastrearte y no carga analítica, publicidad ni scripts de terceros.",
  "privacy.2.page":
    "Servir una página: IP, agente de usuario, hora y URL solicitada en registros del alojamiento; finalidad: entregar páginas y mantener la seguridad; base: interés legítimo (art. 6(1)(f) RGPD); conservación: plazo del proveedor, [period].",
  "privacy.2.submit":
    "Enviar una plantilla: cuenta/usuario de GitHub y texto del formulario; finalidad: revisar y publicar la ficha y dar crédito al autor; base: medidas precontractuales solicitadas (art. 6(1)(b)) e interés legítimo de moderación (art. 6(1)(f)); conservación: mientras esté publicada y [period] en el historial del repositorio.",
  "privacy.2.email":
    "Contacto por correo: dirección y mensaje; finalidad: responder; base: interés legítimo (art. 6(1)(f)); conservación: [period] tras finalizar el intercambio.",
  "privacy.2.hosting":
    "Alojamiento: GitHub Pages (GitHub, Inc., United States) recibe datos de las solicitudes de cada visita. Consulta la política de privacidad de GitHub. Las transferencias fuera del EEE se basan en [mechanism: standard contractual clauses / adequacy decision].",
  "privacy.2.automated":
    "No se toman decisiones sobre ti por medios automatizados con efectos jurídicos ni se elaboran perfiles.",
  "privacy.3":
    "3. Qué se publica. La ficha muestra el nombre visible y usuario de GitHub que proporcionaste, el enlace público o el archivo descargable de la plantilla y tu descripción. Tu correo nunca se publica. Tu usuario público de GitHub enlaza a tu perfil.",
  "privacy.4":
    "4. Destinatarios. [Hosting provider], GitHub (incidencias y repositorio) y [email provider, if any]. No vendemos datos ni los compartimos para publicidad.",
  "privacy.5":
    "5. Tus derechos. Puedes acceder a tus datos, rectificarlos, suprimirlos, limitar u objetar su tratamiento y solicitar su portabilidad; puedes retirar el consentimiento cuando corresponda, sin afectar al tratamiento previo. Escribe a [contact e-mail]. Puedes reclamar ante una autoridad de control; en Rumanía, ANSPDCP (https://www.anspdcp.ro/), o en el país donde vives o trabajas.",
  "privacy.6":
    "6. Menores. El sitio no está dirigido a menores. Respeta la edad mínima de la plataforma enlazada (16 años) y no solicita datos que identifiquen a un menor.",
  "privacy.7":
    "7. Cambios. Los cambios se registran mediante pull requests en el historial del repositorio. La fecha de la última modificación aparece en el commit que actualiza este archivo.",
  "privacy.8":
    "8. Alcance. Al seguir enlaces a openbot.run o GitHub, se aplica la política de privacidad de esos servicios. OpenShelf no controla ni se responsabiliza de su tratamiento.",
  "terms.title": "Condiciones de uso — BORRADOR",
  "terms.description": "Condiciones de uso de OpenShelf. Borrador, no vigente.",
  "terms.status":
    "Borrador, no vigente. Basadas en la revisión legal del 2026-10-27; todavía no se identifica una entidad jurídica. Completa todos los [placeholder] y obtén revisión jurídica antes de anunciar el catálogo. No es asesoramiento jurídico.",
  "terms.1":
    "1. Quiénes somos. [Directory name] (“el sitio”) está gestionado por [legal entity, form, registration number, address, e-mail] (“nosotros”). Contacto: [contact e-mail].",
  "terms.2":
    "2. Qué es el sitio. Directorio comunitario de plantillas de agentes para OpenBot aportadas por usuarios. Los autores las publican en openbot.run o en un archivo .zip; el sitio guarda descripciones, enlaces y esos archivos. Las plantillas son de sus autores. El sitio no está afiliado a OpenBot, Synthetify Labs sp. z o.o., OpenAI ni a autores de plantillas, ni cuenta con su respaldo o patrocinio.",
  "terms.3":
    "3. Nuestro código. El código fuente del sitio utiliza la licencia MIT (LICENSE); los componentes de terceros mantienen sus licencias.",
  "terms.4":
    "4. Licencia de las plantillas. Los autores publican las plantillas bajo Creative Commons Atribución 4.0 Internacional (templates/LICENSE), conservan los derechos y reciben crédito con nombre, enlace, licencia y fecha. La reutilización debe dar crédito, enlazar la licencia e indicar cambios. No reclamamos su propiedad.",
  "terms.5":
    "5. Envíos. Conservas tus derechos y nos otorgas una licencia mundial, gratuita y no exclusiva para alojar, reproducir, mostrar y adaptar técnicamente el envío para operar el sitio. Confirmas que tienes los derechos o autorización escrita, que no contiene credenciales, secretos, datos personales de terceros ni contenido ilícito, y que aceptas estas condiciones. El envío no garantiza su publicación.",
  "terms.6":
    "6. Moderación. Podemos revisar, rechazar, editar, limitar o retirar envíos o suspender el acceso por contenido ilícito, infracción, spam, riesgo de seguridad, enlace o archivo roto, o incumplimiento. Al limitar o retirar contenido, indicamos el motivo principal y cómo impugnarlo. Envía denuncias a [report e-mail] con descripción, URL exacta y declaración de buena fe. Las evaluamos diligente e imparcialmente y respondemos en [response time]. Las denuncias que identifiquen a un titular de derechos se remiten al autor para que responda.",
  "terms.7":
    "7. Sin garantía. El sitio y las plantillas se ofrecen “tal cual”. No revisamos ni ejecutamos las plantillas para evaluar su seguridad, exactitud o idoneidad. Eres responsable de lo que instalas y del acceso que concedas a un agente.",
  "terms.8":
    "8. Responsabilidad. En la medida permitida por la ley, la responsabilidad se limita al mínimo legal. Nada excluye la responsabilidad por dolo, negligencia grave ni aquella que no pueda excluirse legalmente.",
  "terms.9":
    "9. Cambios. Podemos cambiar estas condiciones; la fecha del archivo y el pull request dejan constancia. El uso continuado después de un cambio implica que se aplican las nuevas condiciones.",
  "terms.10":
    "10. Legislación aplicable. Se rigen por la legislación de [jurisdiction] y serán competentes los tribunales de [jurisdiction], sin perjuicio del derecho de los consumidores a acudir a los tribunales de su país de residencia.",
  "hero.title": "Agentes de OpenBot, un oficio cada uno",
  "hero.lead":
    "Una estantería comunitaria con {count} plantillas de agentes. Lee qué hace cada agente y qué rechaza hacer, e instálalo en OpenBot o descarga el .zip.",
  "hero.cta": "Ver la estantería",
  "shelf.title": "La estantería",
  "shelf.count": "{count} plantillas en la estantería",
  "shelf.countFiltered": "{shown} de {total} plantillas",
  "search.placeholder": "Buscar por nombre, oficio o etiqueta",
  "listed.title": "Cómo llega a la estantería",
  "listed.clause1": "Primero, el autor publica el agente en OpenBot.",
  "listed.clause2": "Después, el formulario se convierte en un pull request.",
  "listed.clause3": "Se ejecutan las comprobaciones y una persona lo revisa.",
  "listed.clause4": "Al integrarse, aparece en la estantería.",
  "listed.state1": "Publicado en OpenBot",
  "listed.state2": "Enviado",
  "listed.state3": "Comprobaciones",
  "listed.state4": "En la estantería",
  "listed.category": "Categoría",
  "listed.tags": "Etiquetas",
  "listed.check1": "Esquema válido",
  "listed.check2": "El enlace responde 200",
  "listed.check3": "Sin secretos",
  "listed.check4": "Revisión de moderación",
  "about.panel.title": "Una estantería, no una tienda",
  "about.panel.it": "Qué es",
  "about.panel.itBody":
    "Un directorio comunitario que indexa y describe plantillas de agentes para que sea fácil encontrarlas. La instalación se hace en OpenBot, no aquí.",
  "about.panel.not": "Qué no es",
  "about.panel.notBody":
    "No está afiliado a OpenBot ni a Synthetify Labs, ni cuenta con su respaldo o patrocinio. Sin cuentas, sin cookies propias y sin rastreo.",
  "about.panel.cta": "Leer sobre OpenShelf",
  "about.zip.title": "mail.zip",
  "about.zip.f1": "agent.json",
  "about.zip.f1d": "título, descripción, skills",
  "about.zip.f2": "README.md",
  "about.zip.f2d": "qué hace, cómo importarlo",
  "about.zip.f3": "LICENSE",
  "about.zip.f3d": "CC BY 4.0",
  "about.zip.foot": "Importar en OpenBot: Settings → Import",
  "faq.title": "Preguntas",
  "faq.q1": "¿Qué hace «Instalar»?",
  "faq.a1":
    "Abre la ficha oficial en openbot.run, donde OpenBot instala el agente. OpenShelf no instala nada por sí mismo.",
  "faq.q2": "¿Cómo uso un .zip?",
  "faq.a2":
    "Descárgalo y, en OpenBot, abre Settings → Import y elige el archivo. El archivo solo contiene el perfil público del agente.",
  "faq.q3": "¿Es seguro ejecutar una plantilla?",
  "faq.a3":
    "Lee primero sus instrucciones. Las plantillas son de autores independientes; OpenShelf comprueba el esquema, el enlace y posibles secretos, no cómo se comporta un agente.",
  "faq.q4": "¿Quién puede enviar una plantilla?",
  "faq.a4": "Cualquier persona con un agente publicado en OpenBot. Cada cuenta puede publicar hasta cinco agentes.",
  "faq.q5": "¿Cómo se retira una ficha?",
  "faq.a5": "Mediante un pull request, a petición del autor o tras una denuncia de abuso.",
  "faq.q6": "¿OpenShelf forma parte de OpenBot?",
  "faq.a6": "No. Es un proyecto comunitario independiente, no afiliado a OpenBot ni a Synthetify Labs.",
  "legal.badge": "Borrador",
  "detail.stageTitle": "Instrucciones",
  "detail.tagsTitle": "Etiquetas",
  "detail.skillsTitle": "Skills",
  "detail.more": "Más en la estantería",
  "detail.share": "Abrir la plantilla oficial",
} as const;
