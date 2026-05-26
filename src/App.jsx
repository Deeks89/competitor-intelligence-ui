import { useState } from "react"
import axios from "axios"

const API_BASE = "https://competitor-intelligence-api-production.up.railway.app"

export default function App() {
  const [companyName, setCompanyName] = useState("")
  const [industry, setIndustry] = useState("")
  const [competitors, setCompetitors] = useState([])
  const [analyses, setAnalyses] = useState({})
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState({})
  const [error, setError] = useState("")

  async function handleDiscover() {
    if (!companyName || !industry) {
      setError("Please enter both company name and industry")
      return
    }
    setLoading(true)
    setError("")
    setCompetitors([])
    setAnalyses({})
    try {
      const res = await axios.post(`${API_BASE}/api/competitors/discover`, {
        company_name: companyName,
        industry: industry
      })
      setCompetitors(res.data)
    } catch (e) {
      setError("Failed to discover competitors. Is the API running?")
    }
    setLoading(false)
  }

  async function handleAnalyze(competitorId) {
    setAnalyzing(prev => ({ ...prev, [competitorId]: true }))
    try {
      const res = await axios.post(`${API_BASE}/api/analysis/${competitorId}/run`)
      setAnalyses(prev => ({ ...prev, [competitorId]: res.data }))
    } catch (e) {
      setError(`Failed to analyze competitor ${competitorId}`)
    }
    setAnalyzing(prev => ({ ...prev, [competitorId]: false }))
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>Competitor Intelligence</h1>
      <p style={{ color: "#666", marginBottom: 32 }}>Enter a company and industry to discover and analyze competitors</p>

      <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <input
          placeholder="Company name (e.g. Tracxn)"
          value={companyName}
          onChange={e => setCompanyName(e.target.value)}
          style={{ flex: 1, padding: "10px 14px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14 }}
        />
        <input
          placeholder="Industry (e.g. sales intelligence)"
          value={industry}
          onChange={e => setIndustry(e.target.value)}
          style={{ flex: 1, padding: "10px 14px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14 }}
        />
        <button
          onClick={handleDiscover}
          disabled={loading}
          style={{ padding: "10px 24px", borderRadius: 8, background: "#1a1a18", color: "#fff", border: "none", cursor: "pointer", fontSize: 14, fontWeight: 500 }}
        >
          {loading ? "Discovering..." : "Discover"}
        </button>
      </div>

      {error && <p style={{ color: "red", marginBottom: 16 }}>{error}</p>}

      {competitors.length > 0 && (
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 500, marginBottom: 16 }}>
            Found {competitors.length} competitors
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {competitors.map(comp => (
              <div key={comp.id} style={{ border: "1px solid #e2e0d8", borderRadius: 12, padding: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>{comp.name}</h3>
                    <a href={comp.website} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: "#1a1a18" }}>{comp.website}</a>
                  </div>
                  <button
                    onClick={() => handleAnalyze(comp.id)}
                    disabled={analyzing[comp.id]}
                    style={{ padding: "6px 16px", borderRadius: 8, background: "#f1efe8", border: "1px solid #e2e0d8", cursor: "pointer", fontSize: 13,color: "#1a1a18" }}
                  >
                    {analyzing[comp.id] ? "Analyzing..." : "Analyze"}
                  </button>
                </div>
                <p style={{ fontSize: 14, color: "#ffffff", margin: 0 }}>{comp.description}</p>

                {analyses[comp.id] && (
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #e2e0d8" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <div>
                        <p style={{ fontSize: 12, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Features</p>
                        <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13, color: "#ffffff" }}>
                          {(analyses[comp.id].features || []).map((f, i) => <li key={i}>{f}</li>)}
                        </ul>
                      </div>
                      <div>
                        <p style={{ fontSize: 12, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Strengths</p>
                        <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13, color: "#ffffff" }}>
                          {(analyses[comp.id].strengths || []).map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                      <div>
                        <p style={{ fontSize: 12, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Weaknesses</p>
                        <ul style={{ margin: 0, paddingLeft: 16, fontSize: 13, color: "#ffffff" }}>
                          {(analyses[comp.id].weaknesses || []).map((w, i) => <li key={i}>{w}</li>)}
                        </ul>
                      </div>
                      <div>
                        <p style={{ fontSize: 12, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Target market</p>
                        <p style={{ fontSize: 13, color: "#ffffff", margin: 0 }}>{analyses[comp.id].target_market}</p>
                      </div>
                    </div>
                    {analyses[comp.id].pricing_model && (
                      <div style={{ marginTop: 12 }}>
                        <p style={{ fontSize: 12, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Pricing</p>
                        <p style={{ fontSize: 13, color: "#ffffff", margin: 0 }}>
                          {analyses[comp.id].pricing_model}
                          {analyses[comp.id].pricing_min ? ` · $${analyses[comp.id].pricing_min} – $${analyses[comp.id].pricing_max}` : ""}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

