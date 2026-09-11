import { QiankunError } from '../error';
import { type AppConfiguration } from '../types';

export const frameworkConfiguration: AppConfiguration = {};

export function resolveConfiguration(configuration?: AppConfiguration): AppConfiguration {
  return {
    ...frameworkConfiguration,
    ...configuration,
    timeout: configuration?.timeout ?? frameworkConfiguration.timeout,
  };
}

export function validateLoadingTimeout(timeout: number | undefined): void {
  if (timeout !== undefined && (!Number.isFinite(timeout) || timeout < 0)) {
    throw new QiankunError('Loading timeout must be a finite non-negative number');
  }
}
