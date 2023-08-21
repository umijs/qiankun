/**
 * A class that represents each benchmark task in Tinybench. It keeps track of the
 * results, name, Bench instance, the task function and the number times the task
 * function has been executed.
 */
declare class Task extends EventTarget {
    bench: Bench;
    /**
     * task name
     */
    name: string;
    fn: Fn;
    runs: number;
    /**
     * the result object
     */
    result?: TaskResult;
    /**
     * Task options
     */
    opts: FnOptions;
    constructor(bench: Bench, name: string, fn: Fn, opts?: FnOptions);
    /**
     * run the current task and write the results in `Task.result` object
     */
    run(): Promise<this>;
    /**
     * warmup the current task
     */
    warmup(): Promise<void>;
    addEventListener<K extends TaskEvents, T = TaskEventsMap[K]>(type: K, listener: T, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends TaskEvents, T = TaskEventsMap[K]>(type: K, listener: T, options?: boolean | EventListenerOptions): void;
    /**
     * change the result object values
     */
    setResult(result: Partial<TaskResult>): void;
    /**
     * reset the task to make the `Task.runs` a zero-value and remove the `Task.result`
     * object
     */
    reset(): void;
}

/**
 * the task function
 */
type Fn = () => any | Promise<any>;

interface FnOptions {
  /**
   * An optional function that is run before iterations of this task begin
   */
  beforeAll?: (this: Task) => void | Promise<void>;

  /**
   * An optional function that is run before each iteration of this task
   */
  beforeEach?: (this: Task) => void | Promise<void>;

  /**
   * An optional function that is run after each iteration of this task
   */
  afterEach?: (this: Task) => void | Promise<void>;

  /**
   * An optional function that is run after all iterations of this task end
   */
  afterAll?: (this: Task) => void | Promise<void>;
}

/**
 * the benchmark task result object
 */
type TaskResult = {
  /*
   * the last error that was thrown while running the task
   */
  error?: unknown;

  /**
   * The amount of time in milliseconds to run the benchmark task (cycle).
   */
  totalTime: number;

  /**
   * the minimum value in the samples
   */
  min: number;
  /**
   * the maximum value in the samples
   */
  max: number;

  /**
   * the number of operations per second
   */
  hz: number;

  /**
   * how long each operation takes (ms)
   */
  period: number;

  /**
   * task samples of each task iteration time (ms)
   */
  samples: number[];

  /**
   * samples mean/average (estimate of the population mean)
   */
  mean: number;

  /**
   * samples variance (estimate of the population variance)
   */
  variance: number;

  /**
   * samples standard deviation (estimate of the population standard deviation)
   */
  sd: number;

  /**
   * standard error of the mean (a.k.a. the standard deviation of the sampling distribution of the sample mean)
   */
  sem: number;

  /**
   * degrees of freedom
   */
  df: number;

  /**
   * critical value of the samples
   */
  critical: number;

  /**
   * margin of error
   */
  moe: number;

  /**
   * relative margin of error
   */
  rme: number;

  /**
   * p75 percentile
   */
  p75: number;

  /**
   * p99 percentile
   */
  p99: number;

  /**
   * p995 percentile
   */
  p995: number;

  /**
   * p999 percentile
   */
  p999: number;
};

/**
  * Both the `Task` and `Bench` objects extend the `EventTarget` object,
  * so you can attach a listeners to different types of events
  * to each class instance using the universal `addEventListener` and
 * `removeEventListener`
 */

/**
 * Bench events
 */
type BenchEvents =
  | 'abort' // when a signal aborts
  | 'complete' // when running a benchmark finishes
  | 'error' // when the benchmark task throws
  | 'reset' // when the reset function gets called
  | 'start' // when running the benchmarks gets started
  | 'warmup' // when the benchmarks start getting warmed up (before start)
  | 'cycle' // when running each benchmark task gets done (cycle)
  | 'add' // when a Task gets added to the Bench
  | 'remove' // when a Task gets removed of the Bench
  | 'todo'; // when a todo Task gets added to the Bench

type Hook = (task: Task, mode: 'warmup' | 'run') => void | Promise<void>;

type NoopEventListener = () => any | Promise<any>
type TaskEventListener = (e: Event & { task: Task }) => any | Promise<any>

interface BenchEventsMap{
  abort: NoopEventListener
  start: NoopEventListener
  complete: NoopEventListener
  warmup: NoopEventListener
  reset: NoopEventListener
  add: TaskEventListener
  remove: TaskEventListener
  cycle: TaskEventListener
  error: TaskEventListener
  todo: TaskEventListener
}

/**
 * task events
 */
type TaskEvents =
  | 'abort'
  | 'complete'
  | 'error'
  | 'reset'
  | 'start'
  | 'warmup'
  | 'cycle';

type TaskEventsMap = {
  abort: NoopEventListener
  start: TaskEventListener
  error: TaskEventListener
  cycle: TaskEventListener
  complete: TaskEventListener
  warmup: TaskEventListener
  reset: TaskEventListener
}
type Options = {
  /**
   * time needed for running a benchmark task (milliseconds) @default 500
   */
  time?: number;

  /**
   * number of times that a task should run if even the time option is finished @default 10
   */
  iterations?: number;

  /**
   * function to get the current timestamp in milliseconds
   */
  now?: () => number;

  /**
   * An AbortSignal for aborting the benchmark
   */
  signal?: AbortSignal;

  /**
   * warmup time (milliseconds) @default 100ms
   */
  warmupTime?: number;

  /**
   * warmup iterations @default 5
   */
  warmupIterations?: number;

  /**
   * setup function to run before each benchmark task (cycle)
   */
  setup?: Hook;

  /**
   * teardown function to run after each benchmark task (cycle)
   */
  teardown?: Hook;
};

type BenchEvent = Event & {
  task: Task | null;
};

/**
 * The Benchmark instance for keeping track of the benchmark tasks and controlling
 * them.
 */
declare class Bench extends EventTarget {
    _tasks: Map<string, Task>;
    _todos: Map<string, Task>;
    signal?: AbortSignal;
    warmupTime: number;
    warmupIterations: number;
    time: number;
    iterations: number;
    now: () => number;
    setup: Hook;
    teardown: Hook;
    constructor(options?: Options);
    /**
     * run the added tasks that were registered using the
     * {@link add} method.
     * Note: This method does not do any warmup. Call {@link warmup} for that.
     */
    run(): Promise<Task[]>;
    /**
     * warmup the benchmark tasks.
     * This is not run by default by the {@link run} method.
     */
    warmup(): Promise<void>;
    /**
     * reset each task and remove its result
     */
    reset(): void;
    /**
     * add a benchmark task to the task map
     */
    add(name: string, fn: Fn, opts?: FnOptions): this;
    /**
     * add a benchmark todo to the todo map
     */
    todo(name: string, fn?: Fn, opts?: FnOptions): this;
    /**
     * remove a benchmark task from the task map
     */
    remove(name: string): this;
    addEventListener<K extends BenchEvents, T = BenchEventsMap[K]>(type: K, listener: T, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends BenchEvents, T = BenchEventsMap[K]>(type: K, listener: T, options?: boolean | EventListenerOptions): void;
    /**
     * table of the tasks results
     */
    table(): ({
        'Task Name': string;
        'ops/sec': string;
        'Average Time (ns)': number;
        Margin: string;
        Samples: number;
    } | null)[];
    /**
     * (getter) tasks results as an array
     */
    get results(): (TaskResult | undefined)[];
    /**
     * (getter) tasks as an array
     */
    get tasks(): Task[];
    get todos(): Task[];
    /**
     * get a task based on the task name
     */
    getTask(name: string): Task | undefined;
}

declare const now: () => number;

export { Bench, BenchEvent, BenchEvents, Fn, Hook, Options, Task, TaskEvents, TaskResult, Bench as default, now };
