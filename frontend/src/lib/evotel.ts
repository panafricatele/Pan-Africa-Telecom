export interface EvotelComponent {
  id: string;
  name: string;
  status: string;
  group?: { id: string; name: string } | null;
}

export const EVOTEL_COMPONENTS_URL = 'https://status.evotel.co.za/v3/components.json';

export function normalizeAreaName(name: string): string {
  return (name || '').trim().replace(/\s+/g, ' ').toLowerCase();
}

function flatten(raw: any[]): EvotelComponent[] {
  const flat: EvotelComponent[] = [];
  for (const c of raw) {
    if (!c || !c.name) continue;
    flat.push({
      id: c.id,
      name: String(c.name).trim(),
      status: c.status,
      group: c.group ?? null,
    });
    if (Array.isArray(c.children) && c.children.length > 0) {
      flat.push(...flatten(c.children));
    }
  }
  return flat;
}

export function parseEvotelComponents(json: any): EvotelComponent[] {
  const raw = Array.isArray(json) ? json : json?.components || [];
  return flatten(raw);
}

export async function fetchEvotelComponentsDirect(): Promise<EvotelComponent[]> {
  const res = await fetch(EVOTEL_COMPONENTS_URL);
  if (!res.ok) throw new Error(`Evotel API responded with ${res.status}`);
  return parseEvotelComponents(await res.json());
}

export function findEvotelComponent(
  components: EvotelComponent[],
  area: string
): EvotelComponent | undefined {
  const key = normalizeAreaName(area);
  return components.find((c) => normalizeAreaName(c.name) === key);
}
