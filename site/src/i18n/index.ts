// The interface dictionaries and the two URL rules every page uses: where a page lives in a locale,
// and where the same page lives in the other one.

import en from "./en";
import es from "./es";
import { base } from "../lib/urls";

export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];
export type Key = keyof typeof en;

const dictionaries: Record<Locale, Record<Key, string>> = { en, es };

export function isLocale(value: string | undefined): value is Locale {
  return value === "en" || value === "es";
}

/** The dictionary plus `{placeholder}` substitution; a missing key is a build-time type error. */
export function translator(locale: Locale) {
  const dictionary = dictionaries[locale];
  return (key: Key, values: Record<string, string | number> = {}): string =>
    dictionary[key].replace(/\{(\w+)\}/gu, (match, name: string) =>
      name in values ? String(values[name]) : match,
    );
}

/** `/t/dev/` in English, `es/t/dev/` in Spanish; the site base is added by `href`. */
export function localePath(locale: Locale, path = ""): string {
  const clean = path.replace(/^\/+/u, "");
  return locale === "es" ? `es/${clean}` : clean;
}

/** The address of the same page in `target`, from the current pathname (which includes the base). */
export function switchLocalePath(target: Locale, pathname: string): string {
  const root = base.replace(/\/$/u, "");
  const withoutBase = pathname.startsWith(root) ? pathname.slice(root.length) : pathname;
  const withoutLocale = withoutBase.replace(/^\/+/u, "").replace(/^es(?=\/|$)/u, "").replace(/^\/+/u, "");
  return `${base}${localePath(target, withoutLocale)}`;
}

/** Spanish card taglines, by slug. Names and data stay as published; only the sentence is translated. */
export const taglinesEs: Record<string, string> = {
  "cercetas": "Investigador que responde con fuentes y fechas, y señala qué preguntas siguen abiertas.",
  "dev": "Programador full-stack que primero lee el código y demuestra la solución con pruebas.",
  "ghost":
    "Elimina los datos personales del usuario de sitios de búsqueda de personas y corredores de datos.",
  "health-concierge":
    "Organiza en un solo lugar seguros, resultados de laboratorio, médicos y reembolsos.",
  "local-ai-manager":
    "Pone en marcha un modelo local en tu equipo y lo mantiene funcionando correctamente.",
  "look-up":
    "Sigue eventos celestes —pasos de la EEI, lanzamientos de cohetes y sobrevuelos brillantes— y crea una carta celeste según la ubicación y zona horaria del usuario.",
  "mail": "Da al agente su propia bandeja de entrada: resúmenes del correo recibido y respuestas redactadas, listas para aprobación.",
  "pep": "Lleva un protocolo de péptidos: calcula dosis, controla existencias y crea recordatorios.",
  "personal-chef":
    "Planifica las cenas de una semana según presupuesto y restricciones alimentarias, con lista de la compra y pasos de preparación.",
  "promo":
    "Crea un vídeo de lanzamiento tipo presentación a partir de una propuesta de producto, con escenas como diapositivas, ritmo y arco narrativo.",
  "tavern":
    "Director de juego de rol de mesa que organiza aventuras, personajes no jugadores y reglas para un grupo pequeño.",
  "verificator":
    "Verificador de datos que asigna a cada afirmación un veredicto, una fuente y una corrección.",
  "video-studio": "Convierte un guion en un vídeo corto terminado, escena por escena.",
};
