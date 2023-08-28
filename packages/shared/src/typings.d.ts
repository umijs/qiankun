declare module 'semver/functions/satisfies' {
  export default function satisfies(version: string, range: string): boolean;
}

type Priority = 'high' | 'low' | 'auto';

interface HTMLScriptElement {
  fetchPriority?: Priority;
}

interface RequestInit {
  priority?: Priority;
}
