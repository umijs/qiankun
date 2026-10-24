interface AppIdentity {
  name: string;
  entry: string;
}

export const defaultIdleCachePolicy = {
  maxIdle: 8,
  maxIdlePerApp: 2,
  idleTTL: 5 * 60 * 1000,
};

/** Only completely idle instances enter this cache. Removing one for reuse does not dispose it. */
export class IdleInstanceCache<T extends AppIdentity> {
  private readonly entries = new Map<T, number>();
  private timer: ReturnType<typeof setTimeout> | undefined;

  constructor(
    private readonly onEvict: (instance: T) => void,
    private readonly policy = defaultIdleCachePolicy,
  ) {}

  add(instance: T): void {
    if (this.entries.has(instance)) return;
    this.prune();
    this.entries.set(instance, Date.now());
    const siblings = [...this.entries.keys()].filter((v) => v.name === instance.name && v.entry === instance.entry);
    for (const oldest of siblings.slice(0, Math.max(0, siblings.length - this.policy.maxIdlePerApp))) {
      this.evict(oldest);
    }
    while (this.entries.size > this.policy.maxIdle) {
      this.evict(this.entries.keys().next().value!);
    }
    this.schedule();
  }

  delete(instance: T): void {
    if (this.entries.delete(instance)) this.schedule();
  }

  prune(): void {
    const now = Date.now();
    for (const [instance, idleAt] of this.entries) {
      if (now - idleAt >= this.policy.idleTTL) this.evict(instance);
    }
    this.schedule();
  }

  private evict(instance: T): void {
    this.entries.delete(instance);
    // Must synchronously remove the instance from lookup before asynchronous disposal starts.
    this.onEvict(instance);
  }

  private schedule(): void {
    if (this.timer !== undefined) clearTimeout(this.timer);
    this.timer = undefined;
    const oldest = this.entries.values().next();
    if (!oldest.done) {
      this.timer = setTimeout(() => this.prune(), Math.max(0, oldest.value + this.policy.idleTTL - Date.now()));
    }
  }
}
