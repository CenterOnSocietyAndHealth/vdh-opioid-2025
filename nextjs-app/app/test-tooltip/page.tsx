import DefinitionPopup from '@/app/components/DefinitionPopup'

export default function TestTooltipPage() {
  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Definition Tooltip Test</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-4">Short Definitions</h2>
          <p className="text-lg">
            This is a test paragraph with a <DefinitionPopup term="API" definition="Application Programming Interface - a set of rules that allows programs to talk to each other">API</DefinitionPopup> 
            and a <DefinitionPopup term="SDK" definition="Software Development Kit - a collection of tools for building software">SDK</DefinitionPopup> mentioned.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Long Definitions</h2>
          <p className="text-lg">
            Here&apos;s a term with a very long definition: <DefinitionPopup 
              term="Machine Learning" 
              definition="A subset of artificial intelligence that enables computers to learn and improve from experience without being explicitly programmed. It involves algorithms that can identify patterns in data and make predictions or decisions based on those patterns."
            >
              Machine Learning
            </DefinitionPopup> and another one: <DefinitionPopup 
              term="Blockchain" 
              definition="A distributed ledger technology that maintains a continuously growing list of records, called blocks, which are linked and secured using cryptography. Each block contains a cryptographic hash of the previous block, a timestamp, and transaction data."
            >
              Blockchain
            </DefinitionPopup>.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Edge Cases</h2>
          <p className="text-lg">
            Testing tooltips near the <DefinitionPopup term="Edge" definition="The boundary or limit of something">edge</DefinitionPopup> of the viewport.
          </p>
          <div className="text-right">
            <p className="text-lg">
              Right-aligned text with <DefinitionPopup term="Tooltip" definition="A small popup that appears when hovering over an element">tooltip</DefinitionPopup>.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Multiple Tooltips</h2>
          <p className="text-lg">
            <DefinitionPopup term="React" definition="A JavaScript library for building user interfaces">React</DefinitionPopup> is a popular framework for building web applications. 
            It works well with <DefinitionPopup term="TypeScript" definition="A superset of JavaScript that adds static typing">TypeScript</DefinitionPopup> and 
            <DefinitionPopup term="Next.js" definition="A React framework for production">Next.js</DefinitionPopup>.
          </p>
        </section>
      </div>
    </div>
  )
} 