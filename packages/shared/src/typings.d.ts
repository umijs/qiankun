type Priority = 'high' | 'low' | 'auto';

interface HTMLScriptElement {
  fetchPriority?: Priority;
}

interface RequestInit {
  priority?: Priority;
}
