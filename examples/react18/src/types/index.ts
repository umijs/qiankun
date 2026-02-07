/**
 * Type definitions for modern-react micro-app
 */

import { QiankunProps, QiankunContext } from 'qiankun';

// ============================================================================
// Qiankun Types
// ============================================================================

export interface MicroAppProps extends QiankunProps {
  /** Base route for the micro-app */
  baseRoute?: string;
  
  /** Global state from main app */
  globalState?: GlobalState;
  
  /** Dispatch function to communicate with main app */
  dispatch?: (action: MicroAppAction) => void;
  
  /** Theme configuration */
  theme?: ThemeConfig;
  
  /** Locale/language */
  locale?: string;
  
  /** User information */
  user?: UserInfo;
  
  /** Permissions */
  permissions?: string[];
  
  /** Micro-app configuration */
  config?: MicroAppConfig;
}

export interface MicroAppContext extends QiankunContext {
  props: MicroAppProps;
}

// ============================================================================
// State Management
// ============================================================================

export interface GlobalState {
  /** User authentication state */
  auth?: AuthState;
  
  /** Application settings */
  settings?: AppSettings;
  
  /** Theme state */
  theme?: ThemeState;
  
  /** Locale state */
  locale?: LocaleState;
  
  /** Shared data between micro-apps */
  sharedData?: Record<string, unknown>;
  
  /** Loading states */
  loading?: Record<string, boolean>;
  
  /** Error states */
  errors?: Record<string, Error | null>;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserInfo | null;
  token: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  permissions: string[];
  roles: string[];
}

export interface UserInfo {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  displayName?: string;
  department?: string;
  title?: string;
  phone?: string;
  metadata?: Record<string, unknown>;
}

export interface AppSettings {
  version: string;
  environment: 'development' | 'staging' | 'production';
  features: Record<string, boolean>;
  api: ApiConfig;
}

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
  headers: Record<string, string>;
}

export interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  borderRadius: 'none' | 'small' | 'medium' | 'large';
  density: 'compact' | 'comfortable' | 'spacious';
}

export interface ThemeState extends ThemeConfig {
  isDark: boolean;
  systemPreference: 'light' | 'dark';
}

export interface LocaleState {
  current: string;
  available: string[];
  fallback: string;
  messages: Record<string, Record<string, string>>;
}

// ============================================================================
// Actions
// ============================================================================

export interface MicroAppAction {
  type: string;
  payload?: unknown;
  meta?: Record<string, unknown>;
  error?: boolean;
}

export interface GlobalAction extends MicroAppAction {
  type: 
    | 'AUTH_LOGIN'
    | 'AUTH_LOGOUT'
    | 'AUTH_REFRESH'
    | 'THEME_CHANGE'
    | 'LOCALE_CHANGE'
    | 'SETTINGS_UPDATE'
    | 'SHARED_DATA_SET'
    | 'SHARED_DATA_DELETE'
    | 'LOADING_START'
    | 'LOADING_END'
    | 'ERROR_SET'
    | 'ERROR_CLEAR'
    | 'MICRO_APP_MOUNT'
    | 'MICRO_APP_UNMOUNT'
    | 'MICRO_APP_UPDATE';
}

// ============================================================================
// Micro-App Configuration
// ============================================================================

export interface MicroAppConfig {
  /** Unique name for the micro-app */
  name: string;
  
  /** Display name for UI */
  displayName: string;
  
  /** Description */
  description?: string;
  
  /** Version */
  version: string;
  
  /** Framework used */
  framework: 'react' | 'vue' | 'angular' | 'svelte' | 'solid' | 'vanilla';
  
  /** Framework version */
  frameworkVersion: string;
  
  /** Entry URL */
  entry: string;
  
  /** Active rule (route matching) */
  activeRule: string | string[] | RegExp | ((url: string) => boolean);
  
  /** Container element ID */
  container?: string;
  
  /** Props to pass to micro-app */
  props?: MicroAppProps;
  
  /** Sandbox configuration */
  sandbox?: {
    strictStyleIsolation?: boolean;
    experimentalStyleIsolation?: boolean;
  };
  
  /** Preload configuration */
  preload?: boolean | 'all' | string[];
  
  /** Extra configuration */
  extra?: Record<string, unknown>;
}

// ============================================================================
// API and Data Types
// ============================================================================

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: Record<string, unknown>;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface QueryParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  filter?: Record<string, unknown>;
  search?: string;
}

// ============================================================================
// Component Props Types
// ============================================================================

export interface BaseComponentProps {
  /** Additional CSS classes */
  className?: string;
  
  /** Inline styles */
  style?: React.CSSProperties;
  
  /** Element ID */
  id?: string;
  
  /** Data attributes */
  'data-testid'?: string;
  'data-cy'?: string;
}

export interface AsyncComponentState {
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  data: unknown;
}

// ============================================================================
// Event Types
// ============================================================================

export interface MicroAppLifecycle {
  bootstrap: () => Promise<void>;
  mount: (props: MicroAppProps) => Promise<void>;
  unmount: () => Promise<void>;
  update?: (props: MicroAppProps) => Promise<void>;
}

export interface MicroAppEvents {
  onLoad?: () => void;
  onError?: (error: Error) => void;
  onMount?: () => void;
  onUnmount?: () => void;
  onUpdate?: (props: MicroAppProps) => void;
}

// ============================================================================
// Utility Types
// ============================================================================

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

export type KeysOf<T> = keyof T;
export type ValuesOf<T> = T[keyof T];

export type Without<T, U> = Pick<T, Exclude<keyof T, keyof U>>;
export type XOR<T, U> = (Without<T, U> & U) | (Without<U, T> & T);

// ============================================================================
// Export all types
// ============================================================================

export * from './index';
