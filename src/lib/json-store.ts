import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";

export function jsonStore<T>(name: string, fallback: T) {
  const files = [join(process.cwd(), "data", `${name}.json`), join("/tmp", `airstay-${name}.json`)];
  let cache: T | null = null;
  let loaded = false;

  function load(): T {
    if (loaded && cache) return cache;
    loaded = true;
    for (const file of files) {
      try {
        cache = JSON.parse(readFileSync(file, "utf8")) as T;
        return cache;
      } catch {
        /* missing */
      }
    }
    cache = fallback;
    return cache;
  }

  function save(next: T) {
    cache = next;
    loaded = true;
    const json = JSON.stringify(next, null, 0);
    for (const file of files) {
      try {
        mkdirSync(dirname(file), { recursive: true });
        writeFileSync(file, json);
      } catch {
        /* read-only host */
      }
    }
  }

  return { load, save };
}
