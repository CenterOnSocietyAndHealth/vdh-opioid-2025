'use client'

import React from 'react'

export default function TestOnThisPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* OnThisPage block would be rendered here by the page builder */}
      <div className="w-full bg-[#F5F5F0] py-4 px-6">
        <div className="flex items-center justify-center space-x-6">
          <div className="flex items-center space-x-2">
            <svg 
              className="w-5 h-5" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 16L16 12L14.6 10.6L13 12.2V8H11V12.2L9.4 10.6L8 12L12 16ZM12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20Z" fill="#1F1F1F"/>
            </svg>
            <span className="text-gray-700 font-medium">On this page:</span>
          </div>
          
          <div className="flex items-center space-x-6">
            <button
              onClick={() => document.getElementById('section-1')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="text-gray-700 underline hover:text-gray-900 transition-colors duration-200 font-medium"
            >
              Where We Live Matters
            </button>
            <button
              onClick={() => document.getElementById('section-2')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="text-gray-700 underline hover:text-gray-900 transition-colors duration-200 font-medium"
            >
              Households Pay Over Half of the Cost
            </button>
            <button
              onClick={() => document.getElementById('section-3')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="text-gray-700 underline hover:text-gray-900 transition-colors duration-200 font-medium"
            >
              Lifesaving Strategies Need More Support
            </button>
            <button
              onClick={() => document.getElementById('section-4')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="text-gray-700 underline hover:text-gray-900 transition-colors duration-200 font-medium"
            >
              Economic Return on Investment
            </button>
          </div>
        </div>
      </div>

      {/* Content sections */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <section id="section-1" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Where We Live Matters</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            The impact of opioid use disorder varies significantly across different communities and regions. 
            Geographic factors, economic conditions, and access to healthcare services all play crucial roles 
            in determining the prevalence and consequences of this public health crisis.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mt-4">
            Rural areas often face unique challenges, including limited access to treatment facilities, 
            transportation barriers, and fewer healthcare providers. Urban areas, while having more 
            resources, may struggle with different issues such as higher costs of living and greater 
            social stigma.
          </p>
        </section>

        <section id="section-2" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Households Pay Over Half of the Cost</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            The financial burden of opioid use disorder falls heavily on individual households, with families 
            often bearing more than half of the total economic cost. This includes direct expenses such as 
            medical treatment, rehabilitation services, and medication costs.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mt-4">
            Indirect costs can be even more devastating, including lost wages due to reduced productivity, 
            job loss, and the emotional toll on family members who must take time off work to support 
            their loved ones through recovery.
          </p>
        </section>

        <section id="section-3" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Lifesaving Strategies Need More Support</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Evidence-based interventions and treatment strategies have proven effective in addressing 
            opioid use disorder, but many communities lack the resources and infrastructure needed to 
            implement these programs effectively.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mt-4">
            Increased funding for prevention programs, expanded access to medication-assisted treatment, 
            and better integration of mental health services are critical components of a comprehensive 
            response to this crisis.
          </p>
        </section>

        <section id="section-4" className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Economic Return on Investment</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Investing in prevention and treatment programs for opioid use disorder not only saves lives 
            but also provides significant economic benefits. Studies have shown that every dollar spent 
            on prevention can save multiple dollars in future healthcare costs and lost productivity.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mt-4">
            The return on investment extends beyond direct healthcare savings to include reduced criminal 
            justice costs, improved workplace productivity, and stronger, more resilient communities that 
            can better support economic development and growth.
          </p>
        </section>
      </div>
    </div>
  )
}
