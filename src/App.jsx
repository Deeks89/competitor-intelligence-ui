import { useState } from "react"
import axios from "axios"

const API_BASE = "https://competitor-intelligence-api-production.up.railway.app"

const styles = {
  root: {
    minHeight: "100vh",
    background: "#0a0a0a",
    color: "#f0ede8",
    fontFamily: "'Georgia', serif",
    padding: "0",
  },
  header: {
    borderBottom: "1px solid #1e1e1e",
    padding: "24px 48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    fontSize: "13px",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "#666",
    fontFamily: "'Georgia', serif",
  },
  logoAccent: {
    color: "#c8b89a",
  },
  hero: {
    padding: "80px 48px 48px",
    maxWidth: "720px",
  },
  heroLabel: {
    fontSize: "11px",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "#555",
    marginBottom: "16px",
    fontFamily: "monospace",
  },
  heroTitle: {
    fontSize: "42px",
    fontWeight: "400",
    lineHeight: "1.15",
    color: "#f0ede8",
    margin: "0 0 16px",
    letterSpacing: "-0.02em",
  },
  heroSub: {
    fontSize: "15px",
    color: "#666",
    lineHeight: "1.6",
    margin: "0 0 40px",
    maxWidth: "480px",
  },
  inputRow: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  input: {
    background: "#111",
    border: "1px solid #222",
    borderRadius: "6px",
    padding: "12px 16px",
    fontSize: "14px",
    color: "#f0ede8",
    outline: "none",
    flex: "1",
    minWidth: "180px",
    fontFamily: "'Georgia', serif",
    transition: "border-color 0.2s",
  },
  btn: {
    background: "#c8b89a",
    color: "#0a0a0a",
    border: "none",
    borderRadius: "6px",
    padding: "12px 28px",
    fontSize: "13px",
    fontWeight: "600",
    letterSpacing: "0.05em",
    cursor: "pointer",
    fontFamily: "monospace",
    textTransform: "uppercase",
    transition: "background 0.2s",
    whiteSpace: "nowrap",
  },
  btnDisabled: {
    background: "#333",
    color: "#666",
  },
  error: {
    color: "#c0614a",
    fontSize: "13px",
    marginTop: "12px",
    fontFamily: "monospace",
  },
  section: {
    padding: "48px",
    borderTop: "1px solid #1a1a1a",
  },
  sectionLabel: {
    fontSize: "11px",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "#555",
    marginBottom: "24px",
    fontFamily: "monospace",
  },
  grid: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  card: {
    background: "#0f0f0f",
    border: "1px solid #1a1a1a",
    borderRadius: "8px",
    overflow: "hidden",
    transition: "border-color 0.2s",
  },
  cardHeader: {
    padding: "20px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
  },
  cardName: {
    fontSize: "17px",
    fontWeight: "400",
    color: "#f0ede8",
    margin: "0 0 4px",
    letterSpacing: "-0.01em",
  },
  cardWebsite: {
    fontSize: "12px",
    color: "#555",
    fontFamily: "monospace",
    textDecoration: "none",
  },
  cardDesc: {
    fontSize: "13px",
    color: "#666",
    margin: "8px 0 0",
    lineHeight: "1.5",
    maxWidth: "480px",
  },
  analyzeBtn: {
    background: "transparent",
    border: "1px solid #2a2a2a",
    borderRadius: "6px",
    padding: "8px 20px",
    fontSize: "12px",
    color: "#c8b89a",
    cursor: "pointer",
    fontFamily: "monospace",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    whiteSpace: "nowrap",
    transition: "all 0.2s",
    flexShrink: 0,
  },
  analysis: {
    borderTop: "1px solid #1a1a1a",
    padding: "24px",
  },
  analysisGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "24px",
    marginBottom: "24px",
  },
  analysisBlock: {},
  analysisBlockLabel: {
    fontSize: "10px",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "#555",
    marginBottom: "10px",
    fontFamily: "monospace",
  },
  analysisList: {
    margin: "0",
    padding: "0",
    listStyle: "none",
  },
  analysisItem: {
    fontSize: "13px",
    color: "#aaa",
    lineHeight: "1.6",
    paddingLeft: "12px",
    position: "relative",
    marginBottom: "4px",
  },
  pricingBar: {
    background: "#111",
    border: "1px solid #1e1e1e",
    borderRadius: "6px",
    padding: "16px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
  },
  pricingModel: {
    fontSize: "12px",
    color: "#c8b89a",
    fontFamily: "monospace",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
  },
  pricingRange: {
    fontSize: "13px",
    color: "#666",
    fontFamily: "monospace",
  },
  targetText: {
    fontSize: "13px",
    color: "#aaa",
    lineHeight: "1.6",
    margin: "0",
  },
}

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
      setError("Enter both a company name and industry to continue.")
      return
    }
    setLoading(true)
    setError("")
    setCompetitors([])
    setAnalyses({})
    try {
      const res = await axios.post(`${API_BASE}/api/competitors/discover`, {
        company_name: companyName,
        industry: industry,
      })
      setCompetitors(res.data)
    } catch (e) {
      setError("Could not reach the API. Check that the backend is running.")
    }
    setLoading(false)
  }

  async function handleAnalyze(competitorId) {
    setAnalyzing((prev) => ({ ...prev, [competitorId]: true }))
    try {
      const res = await axios.post(`${API_BASE}/api/analysis/${competitorId}/run`)
      setAnalyses((prev) => ({ ...prev, [competitorId]: res.data }))
    } catch (e) {
      setError(`Analysis failed for competitor ${competitorId}.`)
    }
    setAnalyzing((prev) => ({ ...prev, [competitorId]: false }))
  }

  function getFeatures(analysis) {
    if (!analysis.features) return []
    if (Array.isArray(analysis.features)) return analysis.features
    if (analysis.features.items) return analysis.features.items
    return []
  }

  function getStrengths(analysis) {
    if (!analysis.strengths) return []
    if (Array.isArray(analysis.strengths)) return analysis.strengths
    if (analysis.strengths.items) return analysis.strengths.items
    return []
  }

  function getWeaknesses(analysis) {
    if (!analysis.weaknesses) return []
    if (Array.isArray(analysis.weaknesses)) return analysis.weaknesses
    if (analysis.weaknesses.items) return analysis.weaknesses.items
    return []
  }

  return (
    <div style={styles.root}>
      {/* Header */}
      <div style={styles.header}>
        <span style={styles.logo}>
          <span style={styles.logoAccent}>CI</span> · Competitor Intelligence
        </span>
        <span style={{ fontSize: "11px", color: "#333", fontFamily: "monospace" }}>
          powered by Claude + Firecrawl
        </span>
      </div>

      {/* Hero */}
      <div style={styles.hero}>
        <p style={styles.heroLabel}>Market Intelligence</p>
        <h1 style={styles.heroTitle}>
          Who are you<br />competing with?
        </h1>
        <p style={styles.heroSub}>
          Enter a company and industry. Competitor Intelligence Tool will identify top competitors, scrape their sites,
          and extract pricing, features, and positioning signals.
        </p>

        <div style={styles.inputRow}>
          <input
            style={styles.input}
            placeholder="Company — e.g. Notion"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleDiscover()}
          />
          <input
            style={styles.input}
            placeholder="Industry — e.g. productivity software"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleDiscover()}
          />
          <button
            style={loading ? { ...styles.btn, ...styles.btnDisabled } : styles.btn}
            onClick={handleDiscover}
            disabled={loading}
          >
            {loading ? "Scanning..." : "Discover →"}
          </button>
        </div>

        {error && <p style={styles.error}>⚠ {error}</p>}
      </div>

      {/* Results */}
      {competitors.length > 0 && (
        <div style={styles.section}>
          <p style={styles.sectionLabel}>
            {competitors.length} competitors identified for {companyName}
          </p>

          <div style={styles.grid}>
            {competitors.map((comp) => (
              <div key={comp.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div>
                    <p style={styles.cardName}>{comp.name}</p>
                    {comp.website && (
                      <a
                        href={comp.website}
                        target="_blank"
                        rel="noreferrer"
                        style={styles.cardWebsite}
                      >
                        {comp.website.replace("https://", "").replace("http://", "")}
                      </a>
                    )}
                    {comp.description && (
                      <p style={styles.cardDesc}>{comp.description}</p>
                    )}
                  </div>
                  <button
                    style={
                      analyzing[comp.id]
                        ? { ...styles.analyzeBtn, color: "#555", borderColor: "#1a1a1a" }
                        : styles.analyzeBtn
                    }
                    onClick={() => handleAnalyze(comp.id)}
                    disabled={analyzing[comp.id] || !!analyses[comp.id]}
                  >
                    {analyzing[comp.id]
                      ? "Analyzing..."
                      : analyses[comp.id]
                      ? "Done ✓"
                      : "Analyze"}
                  </button>
                </div>

                {analyses[comp.id] && (
                  <div style={styles.analysis}>
                    {/* Pricing */}
                    {analyses[comp.id].pricing_model && (
                      <div style={{ ...styles.pricingBar, marginBottom: "20px" }}>
                        <span style={styles.pricingModel}>
                          {analyses[comp.id].pricing_model}
                        </span>
                        {analyses[comp.id].pricing_min > 0 && (
                          <span style={styles.pricingRange}>
                            ${analyses[comp.id].pricing_min} – ${analyses[comp.id].pricing_max} / mo
                          </span>
                        )}
                      </div>
                    )}

                    <div style={styles.analysisGrid}>
                      {/* Features */}
                      <div style={styles.analysisBlock}>
                        <p style={styles.analysisBlockLabel}>Features</p>
                        <ul style={styles.analysisList}>
                          {getFeatures(analyses[comp.id]).map((f, i) => (
                            <li key={i} style={styles.analysisItem}>
                              <span style={{ position: "absolute", left: 0, color: "#c8b89a" }}>–</span>
                              {f}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Strengths */}
                      <div style={styles.analysisBlock}>
                        <p style={styles.analysisBlockLabel}>Strengths</p>
                        <ul style={styles.analysisList}>
                          {getStrengths(analyses[comp.id]).map((s, i) => (
                            <li key={i} style={styles.analysisItem}>
                              <span style={{ position: "absolute", left: 0, color: "#7aab6e" }}>+</span>
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Weaknesses */}
                      <div style={styles.analysisBlock}>
                        <p style={styles.analysisBlockLabel}>Weaknesses</p>
                        <ul style={styles.analysisList}>
                          {getWeaknesses(analyses[comp.id]).map((w, i) => (
                            <li key={i} style={styles.analysisItem}>
                              <span style={{ position: "absolute", left: 0, color: "#c0614a" }}>×</span>
                              {w}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Target Market */}
                      {analyses[comp.id].target_market && (
                        <div style={styles.analysisBlock}>
                          <p style={styles.analysisBlockLabel}>Target market</p>
                          <p style={styles.targetText}>
                            {analyses[comp.id].target_market}
                          </p>
                        </div>
                      )}
                    </div>
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
