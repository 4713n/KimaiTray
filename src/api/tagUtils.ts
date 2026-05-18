type KimaiTagInput =
  | string
  | string[]
  | { name: string }[]
  | null
  | undefined;

export function normalizeKimaiTags(input: KimaiTagInput): string[] {
  if (input == null) return [];

  let raw: string[];

  if (typeof input === "string") {
    raw = input.split(",");
  } else if (Array.isArray(input)) {
    raw = input.map((item) =>
      typeof item === "string" ? item : item?.name ?? "",
    );
  } else {
    return [];
  }

  const seen = new Set<string>();
  const result: string[] = [];

  for (const tag of raw) {
    const trimmed = tag.trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(trimmed);
  }

  return result;
}

export function serializeKimaiTags(tags: string[]): string {
  return tags.join(",");
}

export function sanitizeTagInput(raw: string): string[] {
  return normalizeKimaiTags(raw);
}
