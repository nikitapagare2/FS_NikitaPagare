const adjectives = [
  "Swift", "Brave", "Quiet", "Bright", "Calm", "Eager", "Gentle", "Happy",
  "Jolly", "Kind", "Lively", "Merry", "Nice", "Proud", "Silly", "Witty",
];

const nouns = [
  "Puma", "Falcon", "Turtle", "Rabbit", "Tiger", "Lion", "Bear", "Wolf",
  "Fox", "Eagle", "Shark", "Panther", "Leopard", "Jaguar", "Cheetah", "Hawk",
];

// In a real application, you'd want to check against a database
// to ensure true uniqueness. For this example, we use a simple
// combination of adjective, noun, and a hash from the studentId.
const generatedCache = new Map<string, string>();

const hashCode = (s: string) => {
    let h = 0;
    for (let i = 0; i < s.length; i++) {
        h = Math.imul(31, h) + s.charCodeAt(i) | 0;
    }
    return Math.abs(h);
}

export function generatePseudonym(id: string): string {
  if (generatedCache.has(id)) {
    return generatedCache.get(id)!;
  }

  const hash = hashCode(id);
  const adjIndex = hash % adjectives.length;
  const nounIndex = (hash * 31) % nouns.length;
  const num = (hash * 17) % 100;

  const pseudonym = `${adjectives[adjIndex]}${nouns[nounIndex]}${num}`;
  generatedCache.set(id, pseudonym);
  return pseudonym;
}

export function generateCurrentUserPseudonym() {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const num = Math.floor(Math.random() * 100);
    return `${adj}${noun}${num}`;
}
