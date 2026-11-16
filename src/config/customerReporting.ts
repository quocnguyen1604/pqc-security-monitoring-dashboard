import type { CustomerDataClass, DataVolumeUnit } from '../types/customerReporting'

/** Provisional reporting assumptions for the initial synthetic customer report. */
export const CUSTOMER_REPORTING_CONFIG = {
  dataClasses: [
    { name: 'Internal', description: 'Routine operational information; illustrative category.' },
    { name: 'Confidential', description: 'Sensitive business information; illustrative category.' },
    { name: 'Restricted', description: 'Highest sensitivity in this demonstration; illustrative category.' },
  ] satisfies ReadonlyArray<{ name: CustomerDataClass; description: string }>,
  measurementUnit: 'GB' as DataVolumeUnit,
  reportingPeriod: '2026-10',
  reportingPeriodLabel: 'October 2026',
} as const

export type ConfiguredCustomerDataClass = typeof CUSTOMER_REPORTING_CONFIG.dataClasses[number]['name']
