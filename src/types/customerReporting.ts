import type { Connection } from './security'

export type CustomerDataClass = 'Internal' | 'Confidential' | 'Restricted'
export type DataVolumeUnit = 'B' | 'KB' | 'MB' | 'GB' | 'TB'

/** Estimated customer data volumes for the configured reporting period. */
export interface CustomerDataFlow {
  id: string
  connectionId: Connection['id']
  dataClass: CustomerDataClass
  estimatedVolume: number
  measurementUnit: DataVolumeUnit
  reportingPeriod: string
}
