import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Check, Download, Loader2, Sparkles, RefreshCw } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { AnimateIn } from '../../components/ui/AnimateIn'
import { generateCreativeBrief } from '../../utils/aiService'
import jsPDF from 'jspdf'

const STEPS = ['Client Details', 'Campaign Objective', 'Creative Preferences', 'Review & Submit']
const TONES   = ['Professional', 'Playful', 'Bold', 'Warm', 'Urgent', 'Minimalist']
const IMAGERY = ['Lifestyle photography', 'Studio / product', 'Abstract / conceptual', 'Illustrated / graphic', 'UGC-style', 'Documentary']
const OBJECTIVES = [
  { value: 'awareness',     label: 'Brand Awareness', desc: 'Reach new audiences and build recognition' },
  { value: 'consideration', label: 'Consideration',   desc: 'Educate and nurture mid-funnel audiences' },
  { value: 'conversion',    label: 'Conversion',      desc: 'Drive direct response and measurable ROI' },
]

/* ── Shared input class ────────────────────────────────────────────────── */
const inputCls = [
  'w-full px-3 py-2.5 text-sm rounded-xl outline-none transition-all resize-none',
  'bg-white dark:bg-gray-800/80',
  'border border-gray-200 dark:border-gray-700',
  'text-gray-900 dark:text-gray-100',
  'placeholder-gray-400 dark:placeholder-gray-500',
  'focus:border-[#3889FA] focus:ring-2 focus:ring-[#3889FA]/10',
  'hover:border-gray-300 dark:hover:border-gray-600',
].join(' ')

/* ── Chip button — works in both modes ─────────────────────────────────── */
function Chip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={[
        'px-3 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all select-none',
        active
          ? 'border-[#3889FA] text-[#3889FA]'
          : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 hover:border-[#3889FA]/40 hover:text-[#3889FA]',
      ].join(' ')}
      style={active ? { background: 'rgba(56,137,250,0.08)' } : {}}
    >
      {label}
    </button>
  )
}

/* ── Objective card ────────────────────────────────────────────────────── */
function ObjectiveCard({ option, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={[
        'text-left p-4 rounded-xl border-2 transition-all w-full',
        active
          ? 'border-[#3889FA] bg-[#3889FA]/5 dark:bg-[#3889FA]/10'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:border-[#3889FA]/40',
      ].join(' ')}
    >
      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{option.label}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{option.desc}</p>
    </button>
  )
}

/* ── Step indicator ────────────────────────────────────────────────────── */
function StepIndicator({ current, total }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {STEPS.map((label, i) => (
        <div key={i} className="flex items-center gap-2">
          <motion.div
            animate={{
              background: i <= current ? '#3889FA' : undefined,
              scale: i === current ? 1 : i < current ? 1 : 0.95,
            }}
            transition={{ duration: 0.25 }}
            className={[
              'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
              i <= current ? '' : 'bg-gray-100 dark:bg-gray-800',
            ].join(' ')}
            style={i === current ? { boxShadow: '0 0 0 4px rgba(56,137,250,0.18)' } : {}}
          >
            <span className={i <= current ? 'text-white' : 'text-gray-400 dark:text-gray-500'}>
              {i < current ? <Check className="w-3.5 h-3.5" /> : i + 1}
            </span>
          </motion.div>

          <span className={[
            'text-xs font-semibold hidden md:block transition-colors',
            i === current ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-600',
          ].join(' ')}>
            {label}
          </span>

          {i < total - 1 && (
            <motion.div
              className="h-px w-8 md:w-12 rounded-full"
              animate={{ background: i < current ? '#3889FA' : '#e5e7eb' }}
              transition={{ duration: 0.4 }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

/* ── Field wrapper ─────────────────────────────────────────────────────── */
function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 tracking-wide">
        {label}{required && <span className="ml-0.5" style={{ color: '#3889FA' }}>*</span>}
      </label>
      {children}
    </div>
  )
}

/* ── Steps ─────────────────────────────────────────────────────────────── */
function Step1({ form, update }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Client Name" required>
          <input value={form.name} onChange={e => update('name', e.target.value)} placeholder="e.g. Lumiere Skincare" className={inputCls} />
        </Field>
        <Field label="Industry" required>
          <input value={form.industry} onChange={e => update('industry', e.target.value)} placeholder="e.g. Beauty & Wellness" className={inputCls} />
        </Field>
      </div>
      <Field label="Website">
        <input value={form.website} onChange={e => update('website', e.target.value)} placeholder="https://" className={inputCls} />
      </Field>
      <Field label="Key Competitors">
        <textarea value={form.competitors} onChange={e => update('competitors', e.target.value)} placeholder="List main competitors, one per line" rows={3} className={inputCls} />
      </Field>
    </div>
  )
}

function Step2({ form, update }) {
  return (
    <div className="space-y-5">
      <Field label="Campaign Objective" required>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-1">
          {OBJECTIVES.map(o => (
            <ObjectiveCard key={o.value} option={o} active={form.objective === o.value} onClick={() => update('objective', o.value)} />
          ))}
        </div>
      </Field>
      <Field label="Target Audience" required>
        <textarea value={form.audience} onChange={e => update('audience', e.target.value)} placeholder="Describe your ideal customer — demographics, interests, pain points..." rows={3} className={inputCls} />
      </Field>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Total Budget">
          <input value={form.budget} onChange={e => update('budget', e.target.value)} placeholder="e.g. $50,000" className={inputCls} />
        </Field>
        <Field label="Flight Dates">
          <input value={form.flightDates} onChange={e => update('flightDates', e.target.value)} placeholder="e.g. Jul 1 – Sep 30" className={inputCls} />
        </Field>
      </div>
    </div>
  )
}

function Step3({ form, update }) {
  return (
    <div className="space-y-5">
      <Field label="Tone of Voice" required>
        <div className="flex flex-wrap gap-2 mt-1">
          {TONES.map(t => (
            <Chip key={t} label={t} active={form.tone === t.toLowerCase()} onClick={() => update('tone', t.toLowerCase())} />
          ))}
        </div>
      </Field>
      <Field label="Imagery Style">
        <div className="flex flex-wrap gap-2 mt-1">
          {IMAGERY.map(s => (
            <Chip key={s} label={s} active={form.imageryStyle === s.toLowerCase()} onClick={() => update('imageryStyle', s.toLowerCase())} />
          ))}
        </div>
      </Field>
      <Field label="Color Direction">
        <input value={form.colorDirection} onChange={e => update('colorDirection', e.target.value)} placeholder="e.g. Warm neutrals, deep navy with gold accents" className={inputCls} />
      </Field>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Creative Do's">
          <textarea value={form.dos} onChange={e => update('dos', e.target.value)} placeholder="Comma-separated list" rows={3} className={inputCls} />
        </Field>
        <Field label="Creative Don'ts">
          <textarea value={form.donts} onChange={e => update('donts', e.target.value)} placeholder="Comma-separated list" rows={3} className={inputCls} />
        </Field>
      </div>
    </div>
  )
}

/* ── Review ────────────────────────────────────────────────────────────── */
function ReviewRow({ label, value }) {
  if (!value) return null
  return (
    <div className="flex gap-3">
      <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 w-28 flex-shrink-0 pt-0.5">{label}</span>
      <span className="text-xs text-gray-700 dark:text-gray-300 flex-1">{value}</span>
    </div>
  )
}

function ReviewSection({ title, rows }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 space-y-2.5 border border-gray-100 dark:border-gray-700/60">
      <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: '#3889FA' }}>{title}</p>
      {rows.map(([label, value]) => <ReviewRow key={label} label={label} value={value} />)}
    </div>
  )
}

function Step4({ client, campaign, creative }) {
  return (
    <div className="space-y-4">
      <ReviewSection title="Client Details" rows={[
        ['Client', client.name], ['Industry', client.industry],
        ['Website', client.website], ['Competitors', client.competitors],
      ]} />
      <ReviewSection title="Campaign" rows={[
        ['Objective', campaign.objective], ['Audience', campaign.audience],
        ['Budget', campaign.budget], ['Flight', campaign.flightDates],
      ]} />
      <ReviewSection title="Creative" rows={[
        ['Tone', creative.tone], ['Imagery', creative.imageryStyle],
        ['Colors', creative.colorDirection],
      ]} />
    </div>
  )
}

/* ── PDF export ────────────────────────────────────────────────────────── */
function exportToPDF(result, clientName) {
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const W = 210, margin = 18, contentW = W - margin * 2
  let y = 0
  const BRAND = [56, 137, 250], DARK = [15, 23, 42], GRAY = [100, 116, 139], LIGHT = [248, 250, 252]

  pdf.setFillColor(...BRAND)
  pdf.rect(0, 0, W, 38, 'F')
  pdf.setTextColor(255, 255, 255)
  pdf.setFontSize(8); pdf.setFont('helvetica', 'bold')
  pdf.text('CREATIVE BRIEF', margin, 13)
  pdf.setFontSize(16)
  const titleLines = pdf.splitTextToSize(result.campaignTitle || `${clientName} Creative Brief`, contentW)
  pdf.text(titleLines, margin, 24)
  y = 52

  const addSection = (heading) => {
    if (y > 270) { pdf.addPage(); y = margin }
    pdf.setFillColor(...LIGHT)
    pdf.roundedRect(margin, y, contentW, 7, 1, 1, 'F')
    pdf.setTextColor(...BRAND); pdf.setFontSize(7.5); pdf.setFont('helvetica', 'bold')
    pdf.text(heading.toUpperCase(), margin + 3, y + 5)
    y += 11
  }

  const addText = (text, bold = false) => {
    pdf.setTextColor(...DARK); pdf.setFontSize(9.5); pdf.setFont('helvetica', bold ? 'bold' : 'normal')
    pdf.splitTextToSize(String(text || ''), contentW).forEach(line => {
      if (y > 272) { pdf.addPage(); y = margin }
      pdf.text(line, margin, y); y += 5.5
    })
    y += 3
  }

  const addBullet = (text) => {
    pdf.setTextColor(...GRAY); pdf.setFontSize(9); pdf.setFont('helvetica', 'normal')
    if (y > 272) { pdf.addPage(); y = margin }
    pdf.text('•', margin + 1, y)
    pdf.splitTextToSize(String(text), contentW - 6).forEach((line, li) => {
      if (y > 272) { pdf.addPage(); y = margin }
      pdf.text(line, margin + 5, y)
      if (li < pdf.splitTextToSize(String(text), contentW - 6).length - 1) y += 5
    })
    y += 6
  }

  addSection('Headlines')
  ;(result.headlines || []).forEach((h, i) => {
    pdf.setTextColor(...BRAND); pdf.setFontSize(8); pdf.setFont('helvetica', 'bold')
    pdf.text(`${i + 1}.`, margin, y)
    pdf.setTextColor(...DARK); pdf.setFontSize(9.5); pdf.setFont('helvetica', 'normal')
    pdf.splitTextToSize(h, contentW - 6).forEach(line => {
      if (y > 272) { pdf.addPage(); y = margin }
      pdf.text(line, margin + 6, y); y += 5.5
    })
    y += 2
  })
  y += 4

  addSection('Tone of Voice');    addText(result.toneGuide)
  if (result.channels?.length) {
    addSection('Recommended Channels')
    result.channels.forEach(ch => { addText(`${ch.name}  —  ${ch.allocation}%`, true); addText(ch.reason) })
  }
  addSection('Visual Direction'); addText(result.visualDirection)
  if (result.dosAndDonts?.dos?.length)   { addSection("Do's");    result.dosAndDonts.dos.forEach(addBullet) }
  if (result.dosAndDonts?.donts?.length) { addSection("Don'ts");  result.dosAndDonts.donts.forEach(addBullet) }

  const pages = pdf.getNumberOfPages()
  for (let p = 1; p <= pages; p++) {
    pdf.setPage(p)
    pdf.setTextColor(...GRAY); pdf.setFontSize(7.5); pdf.setFont('helvetica', 'normal')
    pdf.text(`${clientName} Creative Brief  ·  Page ${p} of ${pages}`, margin, 291)
    pdf.setDrawColor(...BRAND); pdf.setLineWidth(0.4)
    pdf.line(margin, 288, W - margin, 288)
  }
  pdf.save(`${clientName.replace(/\s+/g, '-').toLowerCase()}-creative-brief.pdf`)
}

/* ── Export PDF button — always visible ────────────────────────────────── */
function ExportButton({ onClick, exporting }) {
  return (
    <button
      onClick={onClick}
      disabled={exporting}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all disabled:opacity-60"
      style={{
        background: '#3889FA',
        color: '#ffffff',
        boxShadow: '0 2px 8px rgba(56,137,250,0.25)',
      }}
    >
      {exporting
        ? <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
        : <Download className="w-3.5 h-3.5 text-white" />}
      <span>{exporting ? 'Exporting...' : 'Export PDF'}</span>
    </button>
  )
}

/* ── Brief output ──────────────────────────────────────────────────────── */
function BriefOutput({ result, clientName }) {
  const [exporting, setExporting] = useState(false)
  const handleExport = async () => {
    setExporting(true)
    try { exportToPDF(result, clientName) } finally { setExporting(false) }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl flex items-center justify-center" style={{ background: 'rgba(56,137,250,0.10)' }}>
            <Sparkles className="w-4 h-4" style={{ color: '#3889FA' }} />
          </div>
          <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">AI Creative Brief</h2>
        </div>
        <ExportButton onClick={handleExport} exporting={exporting} />
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="px-6 py-5" style={{ background: '#3889FA' }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.65)' }}>Campaign Title</p>
          <h1 className="text-lg font-bold text-white leading-snug">{result.campaignTitle}</h1>
        </div>

        <div className="p-5 space-y-5">
          {/* Headlines */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Headlines</p>
            <div className="space-y-2">
              {result.headlines.map((h, i) => (
                <div key={i} className="flex gap-3 items-start p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60">
                  <span className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(56,137,250,0.12)', color: '#3889FA' }}>{i + 1}</span>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{h}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tone */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Tone of Voice</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3 leading-relaxed">{result.toneGuide}</p>
          </div>

          {/* Channels */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Recommended Channels</p>
            <div className="space-y-2">
              {result.channels.map(ch => (
                <div key={ch.name} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/60">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{ch.name}</p>
                    <span className="text-xs font-bold" style={{ color: '#3889FA' }}>{ch.allocation}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${ch.allocation}%` }}
                      transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      className="h-full rounded-full" style={{ background: '#3889FA' }} />
                  </div>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1.5">{ch.reason}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Visual direction */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">Visual Direction</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3 leading-relaxed">{result.visualDirection}</p>
          </div>

          {/* Dos & Don'ts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-xl p-4 border border-[#3889FA]/15 dark:border-[#3889FA]/20"
              style={{ background: 'rgba(56,137,250,0.04)' }}>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#3889FA' }}>Do's</p>
              <ul className="space-y-1.5">
                {result.dosAndDonts.dos.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                    <Check className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: '#3889FA' }} />{d}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl p-4 border bg-rose-50 dark:bg-rose-900/20 border-rose-100 dark:border-rose-800/50">
              <p className="text-[10px] font-bold uppercase tracking-wider text-rose-500 dark:text-rose-400 mb-2">Don'ts</p>
              <ul className="space-y-1.5">
                {result.dosAndDonts.donts.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-rose-600 dark:text-rose-300">
                    <span className="mt-0.5 flex-shrink-0 font-bold">✕</span>{d}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Main ──────────────────────────────────────────────────────────────── */
export function BriefBuilder() {
  const [step, setStep]       = useState(0)
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState(null)

  const [client,   setClient]   = useState({ name: '', industry: '', website: '', competitors: '' })
  const [campaign, setCampaign] = useState({ objective: '', audience: '', budget: '', flightDates: '' })
  const [creative, setCreative] = useState({ tone: '', imageryStyle: '', colorDirection: '', dos: '', donts: '' })

  const updateClient   = (k, v) => setClient(p   => ({ ...p, [k]: v }))
  const updateCampaign = (k, v) => setCampaign(p => ({ ...p, [k]: v }))
  const updateCreative = (k, v) => setCreative(p => ({ ...p, [k]: v }))

  const canNext = () => {
    if (step === 0) return client.name && client.industry
    if (step === 1) return campaign.objective && campaign.audience
    if (step === 2) return creative.tone
    return true
  }

  const handleSubmit = async () => {
    setLoading(true)
    const output = await generateCreativeBrief({ client, campaign, creative })
    setResult(output)
    setLoading(false)
  }

  const handleReset = () => {
    setResult(null); setStep(0)
    setClient({ name: '', industry: '', website: '', competitors: '' })
    setCampaign({ objective: '', audience: '', budget: '', flightDates: '' })
    setCreative({ tone: '', imageryStyle: '', colorDirection: '', dos: '', donts: '' })
  }

  const slideVariants = {
    enter:  { opacity: 0, x: 20  },
    center: { opacity: 1, x: 0   },
    exit:   { opacity: 0, x: -20 },
  }

  return (
    <div className="px-4 lg:px-6 py-6 w-full mx-auto">
      <AnimateIn>
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.13em] text-gray-400 dark:text-gray-500 mb-1">AI Tools</p>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Creative Brief Builder</h1>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Complete the form and get a structured creative direction in seconds</p>
        </div>
      </AnimateIn>

      {result ? (
        <div>
          <button onClick={handleReset}
            className="flex items-center gap-1.5 text-xs font-semibold mb-4 transition-colors text-gray-400 hover:text-[#3889FA]">
            <RefreshCw className="w-3.5 h-3.5" /> Start new brief
          </button>
          <BriefOutput result={result} clientName={client.name} />
        </div>
      ) : (
        <AnimateIn delay={0.05}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <StepIndicator current={step} total={STEPS.length} />

            <div className="min-h-[320px]">
              <AnimatePresence mode="wait">
                <motion.div key={step} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.22 }}>
                  <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4">{STEPS[step]}</h2>
                  {step === 0 && <Step1 form={client}   update={updateClient} />}
                  {step === 1 && <Step2 form={campaign} update={updateCampaign} />}
                  {step === 2 && <Step3 form={creative} update={updateCreative} />}
                  {step === 3 && <Step4 client={client} campaign={campaign} creative={creative} />}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
              <Button variant="secondary" onClick={() => setStep(s => s - 1)} disabled={step === 0}
                icon={<ChevronLeft className="w-3.5 h-3.5" />} size="md">Back</Button>

              {step < 3 ? (
                <Button className='text-[#414C5D]' onClick={() => setStep(s => s + 1)} disabled={!canNext()}
                  icon={<ChevronRight className="w-3.5 h-3.5 " />} size="md">Continue</Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading}
                  icon={loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  size="md">{loading ? 'Generating...' : 'Generate Brief'}</Button>
              )}
            </div>
          </div>
        </AnimateIn>
      )}

      <style>{`
        input:focus, textarea:focus, select:focus {
          outline: none !important;
          box-shadow: 0 0 0 2px rgba(56,137,250,0.15) !important;
          border-color: #3889FA !important;
        }
      `}</style>
    </div>
  )
}