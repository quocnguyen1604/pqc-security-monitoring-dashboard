import { SectionHeader } from '../../components/ui/SectionHeader'
import { CustomerExposureBreakdown } from '../../components/customer/CustomerExposureBreakdown'

export function CustomerExposureFeature() {
  return (
    <section id="customer-exposure" aria-labelledby="customer-exposure-title" className="scroll-mt-28 space-y-5">
      <SectionHeader
        eyebrow="Customer security detail"
        title="HNDL exposure by data class"
        description="Compare estimated customer data volume associated with classical and ML-KEM connections."
      />
      <CustomerExposureBreakdown />
    </section>
  )
}
