"use client";

import Link from "next/link";
import { ArrowRight, Check, Mail } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4f7] via-white to-[#e8f2f7]" style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}>
      {/* Load fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Space+Mono:wght@400;700&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400&display=swap');
      `}</style>

      {/* Header */}
      <header className="border-b border-[#1C4E64]/10 bg-white/60 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-[#1C4E64] tracking-tight" style={{ fontFamily: "'Fraunces', serif" }}>
            MuseData
          </Link>
          <nav className="flex gap-8">
            <Link href="/" className="text-sm text-[#5a7a8a] hover:text-[#1C4E64] font-medium transition-colors">
              Home
            </Link>
            <Link href="/jobs" className="text-sm text-[#5a7a8a] hover:text-[#1C4E64] font-medium transition-colors">
              Careers
            </Link>
            <Link href="/funding" className="text-sm text-[#5a7a8a] hover:text-[#1C4E64] font-medium transition-colors">
              Apply for Funding
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-16 md:pt-24 pb-12 md:pb-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block mb-4">
            <span className="text-xs font-bold tracking-widest uppercase text-[#5a7a8a]" style={{ fontFamily: "'Space Mono', monospace" }}>
              Fee Structure
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-light leading-[1.1] mb-6 text-[#1a3d4d]" style={{ fontFamily: "'Fraunces', serif" }}>
            Infrastructure engagements for companies preparing for <span className="italic font-normal">institutional capital events</span>
          </h1>
          <p className="text-lg md:text-xl text-[#5a7a8a] max-w-2xl mx-auto mb-2 leading-relaxed">
            Scope confirmed following initial assessment
          </p>
          <p className="text-sm text-[#7a9aaa] italic">
            All engagements include systems integration, full bank reconciliation, and institutional-grade deliverables
          </p>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
            
            {/* Tier 1 */}
            <div className="group bg-white rounded-2xl border-2 border-[#d4e4eb] hover:border-[#2a5f7a] transition-all duration-500 hover:shadow-[0_20px_60px_rgba(42,95,122,0.15)] hover:-translate-y-1 overflow-hidden">
              <div className="p-6 md:p-8">
                {/* Badge */}
                <div className="mb-4">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#5a7a8a]" style={{ fontFamily: "'Space Mono', monospace" }}>
                    I. Diligence & Transaction Support
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-medium mb-4 text-[#1a3d4d]" style={{ fontFamily: "'Fraunces', serif" }}>
                  QoE Evidence Sprint
                </h2>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-4xl md:text-5xl font-bold text-[#2a5f7a]" style={{ fontFamily: "'Fraunces', serif" }}>
                      $15,000
                    </span>
                  </div>
                  <p className="text-sm text-[#7a9aaa]">Founder-grade sprint</p>
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed text-[#3a5d6d] mb-6 min-h-[80px]">
                  Fast-track quality of earnings documentation. Reconciled financials, normalized EBITDA, identified risks. For early-stage diligence or internal clarity.
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {[
                    "72-hour initial delivery",
                    "Capital account reconciliation",
                    "EBITDA normalization bridge",
                    "Material risk memo",
                    "Transaction overview package"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-[#4a6d7d]">
                      <Check className="w-4 h-4 text-[#2a5f7a] mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Complexity tiers */}
                <div className="border-l-3 border-l-[3px] border-[#2a5f7a] bg-[#e8f4f8] p-4 rounded-r-lg space-y-3">
                  <div>
                    <span className="font-bold text-[#1a3d4d] text-sm">$35,000</span>
                    <span className="text-xs text-[#3a5d6d] block mt-1 leading-relaxed">
                      Sponsor-grade QoE: Full working capital analysis, detailed revenue quality assessment, comprehensive adjustments schedule, management interview synthesis
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-[#1a3d4d] text-sm">$75,000+</span>
                    <span className="text-xs text-[#3a5d6d] block mt-1 leading-relaxed">
                      Full diligence-ready package: Multi-period trend analysis, customer/vendor concentration, multi-jurisdictional compliance, regulatory review, full CIM support
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tier 2 */}
            <div className="group bg-white rounded-2xl border-2 border-[#d4e4eb] hover:border-[#2a5f7a] transition-all duration-500 hover:shadow-[0_20px_60px_rgba(42,95,122,0.15)] hover:-translate-y-1 overflow-hidden">
              <div className="p-6 md:p-8">
                {/* Badge */}
                <div className="mb-4">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#5a7a8a]" style={{ fontFamily: "'Space Mono', monospace" }}>
                    II. Governance & Stewardship
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-medium mb-4 text-[#1a3d4d]" style={{ fontFamily: "'Fraunces', serif" }}>
                  Board Layer
                </h2>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-4xl md:text-5xl font-bold text-[#2a5f7a]" style={{ fontFamily: "'Fraunces', serif" }}>
                      $10,000
                    </span>
                    <span className="text-lg font-medium text-[#5a7a8a]">/mo</span>
                  </div>
                  <p className="text-sm text-[#7a9aaa]">Base retainer</p>
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed text-[#3a5d6d] mb-6 min-h-[80px]">
                  Monthly board reporting infrastructure. Automated board books, covenant monitoring, multi-scenario cash modeling, variance analysis.
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {[
                    "Operational within 30 days",
                    "Automated board book production",
                    "Multi-scenario cash runway modeling",
                    "Covenant monitoring and variance analysis",
                    "Institutional-grade narratives"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-[#4a6d7d]">
                      <Check className="w-4 h-4 text-[#2a5f7a] mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Complexity tiers */}
                <div className="border-l-3 border-l-[3px] border-[#2a5f7a] bg-[#e8f4f8] p-4 rounded-r-lg">
                  <div>
                    <span className="font-bold text-[#1a3d4d] text-sm">$15,000/mo</span>
                    <span className="text-xs text-[#3a5d6d] block mt-1 leading-relaxed">
                      For multi-entity consolidation, weekly governance cadence, or cross-jurisdictional reporting
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tier 3 */}
            <div className="group bg-white rounded-2xl border-2 border-[#d4e4eb] hover:border-[#2a5f7a] transition-all duration-500 hover:shadow-[0_20px_60px_rgba(42,95,122,0.15)] hover:-translate-y-1 overflow-hidden">
              <div className="p-6 md:p-8">
                {/* Badge */}
                <div className="mb-4">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#5a7a8a]" style={{ fontFamily: "'Space Mono', monospace" }}>
                    III. Portfolio Operations
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-medium mb-4 text-[#1a3d4d]" style={{ fontFamily: "'Fraunces', serif" }}>
                  Enterprise Portfolio
                </h2>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-4xl md:text-5xl font-bold text-[#2a5f7a]" style={{ fontFamily: "'Fraunces', serif" }}>
                      $75K
                    </span>
                  </div>
                  <p className="text-sm text-[#7a9aaa]">Base portfolio reporting</p>
                </div>

                {/* Description */}
                <p className="text-sm leading-relaxed text-[#3a5d6d] mb-6 min-h-[80px]">
                  Consolidated financial reporting across portfolio companies. Standardized KPIs, aggregated cash position, basic LP packages.
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-6">
                  {[
                    "Quarterly consolidated reporting",
                    "Portfolio-wide cash visibility",
                    "Standardized KPI framework",
                    "Basic LP communication packages"
                  ].map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-[#4a6d7d]">
                      <Check className="w-4 h-4 text-[#2a5f7a] mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Complexity tiers */}
                <div className="border-l-3 border-l-[3px] border-[#2a5f7a] bg-[#e8f4f8] p-4 rounded-r-lg space-y-3">
                  <div>
                    <span className="font-bold text-[#1a3d4d] text-sm">$150K</span>
                    <span className="text-xs text-[#3a5d6d] block mt-1 leading-relaxed">
                      Institutional governance + consolidation: Monthly cadence, covenant monitoring across entities, pro forma modeling, enhanced LP materials
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-[#1a3d4d] text-sm">$250K+</span>
                    <span className="text-xs text-[#3a5d6d] block mt-1 leading-relaxed">
                      LP-grade intelligence: Continuous liquidity monitoring, multi-entity diligence pipeline, scenario planning, dedicated advisory, full fund operations infrastructure
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#1C4E64] to-[#2a5f7a] rounded-2xl p-8 md:p-12 text-center shadow-[0_20px_60px_rgba(28,78,100,0.3)]">
            <h3 className="text-2xl md:text-3xl font-medium text-white mb-4" style={{ fontFamily: "'Fraunces', serif" }}>
              Ready to discuss an engagement?
            </h3>
            <p className="text-[#d4e4eb] mb-8 max-w-2xl mx-auto">
              Every engagement begins with a thorough assessment to confirm scope, deliverables, and timeline. 
              Reach out to our team to explore how we can support your institutional capital readiness.
            </p>
            <a
              href="mailto:partners@musedata.ai?subject=Engagement Discussion"
              className="inline-flex items-center gap-2 bg-white text-[#1C4E64] px-8 py-4 rounded-xl font-semibold hover:bg-[#e8f4f8] transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Mail className="w-5 h-5" />
              Discuss Engagement
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1C4E64]/10 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-2xl font-bold text-[#1C4E64] mb-3" style={{ fontFamily: "'Fraunces', serif" }}>
            MUSEDATA
          </p>
          <p className="text-sm text-[#5a7a8a] mb-4">
            Institutional-Grade Finance Infrastructure
          </p>
          <div className="flex justify-center items-center gap-6 text-sm text-[#7a9aaa]">
            <a href="mailto:partners@musedata.ai" className="hover:text-[#1C4E64] transition-colors">
              partners@musedata.ai
            </a>
            <span className="text-[#d4e4eb]">|</span>
            <span>© 2026 MUSEDATA</span>
          </div>
        </div>
      </footer>
    </div>
  );
}