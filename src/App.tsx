import { useState, type CSSProperties } from 'react'
import gallery from './gallery.json'

// ─── Types ───────────────────────────────────────────────────────────────────

interface ProjectImage {
  url: string
  alt: string
  kind: string
}

interface Project {
  id: string
  title: string
  location: string
  category: string
  year: string
  images: ProjectImage[]
}

// ─── Data ────────────────────────────────────────────────────────────────────

const projects: Project[] = gallery.map(project => ({
  ...project,
  images: project.images.map(image => ({ ...image, url: `${import.meta.env.BASE_URL}${image.url}` })),
}))
const categories = ['ALL', 'EDITORIAL', 'NYFW', 'COMMISSIONED', 'MOTION']

function Media({ image, style }: { image: ProjectImage; style?: CSSProperties }) {
  return image.kind === 'video'
    ? <video src={image.url} controls playsInline preload="metadata" aria-label={image.alt} style={style} />
    : <img src={image.url} alt={image.alt} loading="lazy" decoding="async" style={style} />
}

// ─── Archive image with hover caption below ───────────────────────────────────

// ─── Navigation — pure text, no button affordance ────────────────────────────

type Page = 'home' | 'index' | 'about' | 'contact' | string

function Nav({ current, onNav }: { current: Page; onNav: (p: Page) => void }) {
  const isActive = (p: Page) => current === p

  const items: { label: string; page: Page; external?: string }[] = [
    { label: 'INDEX', page: 'index' },
    { label: 'ABOUT', page: 'about' },
    { label: 'CONTACT', page: 'contact' },
    { label: 'INSTAGRAM', page: 'ig', external: 'https://www.instagram.com/staceynah' },
  ]

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '22px clamp(16px, 4vw, 40px)',
        backgroundColor: '#fff',
      }}
    >
      <span
        onClick={() => onNav('home')}
        style={{ fontSize: '9px', letterSpacing: '0.3em', fontWeight: 400, cursor: 'crosshair' }}
      >
        STACEY NAH
      </span>
      <div style={{ display: 'flex', gap: 'clamp(10px, 2vw, 28px)' }}>
        {items.map(({ label, page, external }) =>
          external ? (
            <a
              key={label}
              href={external}
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: '8px',
                letterSpacing: '0.2em',
                fontWeight: 300,
                cursor: 'crosshair',
                color: 'rgba(0,0,0,0.4)',
                textDecoration: 'none',
              }}
              className="inline"
            >
              {label}
            </a>
          ) : (
            <span
              key={label}
              onClick={() => onNav(page)}
              style={{
                fontSize: '8px',
                letterSpacing: '0.2em',
                fontWeight: 300,
                cursor: 'crosshair',
                color: isActive(page) ? 'rgba(0,0,0,0.88)' : 'rgba(0,0,0,0.4)',
                transition: 'color 0.25s ease',
              }}
              className="inline"
            >
              {label}
            </span>
          )
        )}
      </div>
    </nav>
  )
}

// ─── Projects Index page ──────────────────────────────────────────────────────

function ProjectsIndex({ onSelect }: { onSelect: (id: string) => void }) {
  const [category, setCategory] = useState('ALL')
  const visible = projects.filter(project => category === 'ALL' || project.category === category)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const hovered = hoveredId ? projects.find((p) => p.id === hoveredId) ?? null : null

  return (
    <main style={{ paddingTop: '64px', minHeight: '100vh' }}>
      <div style={{ padding: '64px 40px 0' }}>
        <p style={{ fontSize: '7px', letterSpacing: '0.18em', fontWeight: 300, color: 'rgba(0,0,0,0.35)', marginBottom: '56px' }}>
          {category} — {visible.length} COLLECTIONS
        </p>

        <div className="flex flex-wrap gap-x-7 gap-y-4" aria-label="Filter collections" style={{ marginBottom: '36px' }}>
          {categories.map(item => <button key={item} onClick={() => { setCategory(item); setHoveredId(null) }} aria-pressed={category === item} style={{ fontSize: '9px', letterSpacing: '0.14em', paddingBottom: '6px', cursor: 'pointer', color: category === item ? '#000' : '#888', borderBottom: category === item ? '1px solid #000' : '1px solid transparent' }}>{item}</button>)}
        </div>
        {/* List */}
        <div style={{ position: 'relative' }}>
          {visible.map((p, i) => (
            <div
              key={p.id}
              onClick={() => onSelect(p.id)}
              onMouseEnter={() => setHoveredId(p.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                padding: '18px 0',
                borderTop: '1px solid rgba(0,0,0,0.08)',
                cursor: 'crosshair',
                borderBottom: i === visible.length - 1 ? '1px solid rgba(0,0,0,0.08)' : 'none',
              }}
            >
              {/* Left: number + title */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '28px' }}>
                <span
                  style={{
                    fontSize: '7px',
                    letterSpacing: '0.16em',
                    fontWeight: 300,
                    color: 'rgba(0,0,0,0.3)',
                    minWidth: '20px',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  style={{
                    fontSize: '11px',
                    letterSpacing: '0.18em',
                    fontWeight: hoveredId === p.id ? 400 : 300,
                    transition: 'font-weight 0s, opacity 0.2s ease',
                    opacity: hoveredId && hoveredId !== p.id ? 0.3 : 1,
                  }}
                >
                  {p.title}
                </span>
              </div>

              {/* Right: location + year */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '20px' }}>
                <span style={{ fontSize: '7px', letterSpacing: '0.14em', fontWeight: 300, color: 'rgba(0,0,0,0.38)' }}>
                  {p.location}, {p.year}
                </span>
                <span
                  style={{
                    fontSize: '7px',
                    letterSpacing: '0.1em',
                    fontWeight: 300,
                    color: 'rgba(0,0,0,0.25)',
                    opacity: hoveredId === p.id ? 1 : 0,
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  →
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Floating preview on hover */}
        {hovered && (
          <div
            style={{
              position: 'fixed',
              right: '80px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '200px',
              pointerEvents: 'none',
              zIndex: 40,
              opacity: 1,
              transition: 'opacity 0.3s ease',
            }}
            className="hidden lg:block"
          >
            <div style={{ aspectRatio: '3/4', overflow: 'hidden', backgroundColor: '#d9d9d9' }}>
              <Media
                image={hovered.images[0]}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          </div>
        )}
      </div>

      <footer style={{ marginTop: '120px', padding: '24px 40px', borderTop: '1px solid rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '8px', letterSpacing: '0.2em', fontWeight: 300 }}>STACEY NAH</span>
        <span style={{ fontSize: '7px', letterSpacing: '0.14em', fontWeight: 300, color: 'rgba(0,0,0,0.3)' }}>© 2026</span>
      </footer>
    </main>
  )
}

// ─── About page ───────────────────────────────────────────────────────────────

function About({ onBack }: { onBack: () => void }) {
  const paragraphs = [
    'Stacey Nah is a New York-based fashion photographer and multidisciplinary artist.',
    'Her work explores the intersection of fashion, intimacy, and identity through a distinctly cinematic lens. With an emphasis on raw emotion and unconventional beauty, she creates imagery that blurs the boundaries between editorial photography and personal storytelling.',
    'Her practice extends into creative direction, moving image, and visual experimentation.',
  ]
  return (
    <main style={{ paddingTop: '64px', minHeight: '100vh' }}>
      <div style={{ padding: '80px clamp(24px, 4vw, 40px) 0', maxWidth: '600px' }}>
        <button onClick={onBack} style={{ fontSize: '7px', letterSpacing: '0.2em', color: '#888', marginBottom: '56px', cursor: 'pointer' }}>← INDEX</button>
        <p style={{ fontSize: '8px', letterSpacing: '0.22em', fontWeight: 300, marginBottom: '48px' }}>STACEY NAH</p>
        {paragraphs.map(text => <p key={text} style={{ fontSize: '12px', lineHeight: 1.9, fontWeight: 300, color: 'rgba(0,0,0,0.78)', marginBottom: '28px', letterSpacing: '0.01em' }}>{text}</p>)}
      </div>
      <footer style={{ marginTop: '140px', padding: '24px 40px', borderTop: '1px solid #eee', fontSize: '8px', letterSpacing: '0.2em' }}>STACEY NAH © 2026</footer>
    </main>
  )
}

function Contact({ onBack }: { onBack: () => void }) {
  return (
    <main style={{ paddingTop: '64px', minHeight: '100vh' }}>
      <div style={{ padding: '80px clamp(24px, 4vw, 40px) 0', maxWidth: '560px' }}>
        <button onClick={onBack} style={{ fontSize: '7px', letterSpacing: '0.2em', color: '#888', marginBottom: '56px', cursor: 'pointer' }}>← INDEX</button>
        <p style={{ fontSize: '8px', letterSpacing: '0.22em', fontWeight: 300, marginBottom: '48px' }}>CONTACT</p>
        <div style={{ fontSize: '12px', lineHeight: 2, fontWeight: 300 }}>
          <a href="mailto:stacey100407@gmail.com" style={{ display: 'block', width: 'fit-content', borderBottom: '1px solid #ddd', marginBottom: '32px' }}>stacey100407@gmail.com</a>
          <a href="https://www.instagram.com/staceynah" target="_blank" rel="noreferrer" style={{ display: 'block', width: 'fit-content', borderBottom: '1px solid #ddd' }}>Instagram DM · @staceynah ↗</a>
        </div>
      </div>
      <footer style={{ marginTop: '140px', padding: '24px 40px', borderTop: '1px solid #eee', fontSize: '8px', letterSpacing: '0.2em' }}>STACEY NAH © 2026</footer>
    </main>
  )
}

// ─── Full-bleed image (for viewport-scale moments) ───────────────────────────

// ─── Home ─────────────────────────────────────────────────────────────────────

function Home({ onProjectClick }: { onProjectClick: (id: string) => void }) {
  const [category, setCategory] = useState('ALL')
  const visible = projects.filter(project => category === 'ALL' || project.category === category)
  const cover = projects.find(project => project.images.some(image => image.url.endsWith('/01-001.jpg')))!
  const opening = category === 'ALL' || category === 'EDITORIAL' ? cover : visible.find(project => project.images[0].kind === 'image')
  return (
    <main style={{ paddingTop: '64px' }}>
      {opening && <div className="archive-opening">
        <button onClick={() => onProjectClick(opening.id)} aria-label={`Open ${opening.title}`} className="archive-opening-image">
          <img src={opening.images[0].url} alt={opening.images[0].alt} fetchPriority="high" />
        </button>
        <p className="archive-opening-caption">{opening.title} · {opening.category}</p>
      </div>}
      <div className="archive-filters">
        <p className="archive-eyebrow">SELECTED WORK</p>
        <div className="flex flex-wrap gap-x-7 gap-y-4" aria-label="Filter collections">
          {categories.map(item => <button key={item} onClick={() => setCategory(item)} aria-pressed={category === item} style={{ fontSize: '9px', letterSpacing: '0.14em', paddingBottom: '6px', cursor: 'pointer', color: category === item ? '#000' : '#888', borderBottom: category === item ? '1px solid #000' : '1px solid transparent' }}>{item}</button>)}
        </div>
      </div>
      {visible.map(project => (
        <section key={project.id} className="archive-collection">
          <button onClick={() => onProjectClick(project.id)} className="archive-collection-label">
            <p>{project.title} ↗</p>
            <p className="archive-collection-meta">{project.category} · {project.images.length} {project.category === 'MOTION' ? 'FILMS' : 'IMAGES'}</p>
          </button>
          <div className="archive-composition">
            {project.images.filter((_, index) => project.id !== opening?.id || index !== 0).map((image, index) => (
              <figure key={image.url} className={`archive-piece archive-piece-${index % 6}`}>
                {image.kind === 'video'
                  ? <Media image={image} style={{ width: '100%', display: 'block' }} />
                  : <button onClick={() => onProjectClick(project.id)} aria-label={`Open ${image.alt}`} className="archive-photo"><Media image={image} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /></button>}
                <figcaption>{project.title}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}
      <footer style={{ padding: '24px 5%', borderTop: '1px solid #eee', fontSize: '8px', letterSpacing: '0.2em' }}>STACEY NAH © 2026</footer>
    </main>
  )
}

// ─── Project ──────────────────────────────────────────────────────────────────

function Project({ project, onBack }: { project: Project; onBack: () => void }) {
  return (
    <main style={{ paddingTop: '64px' }}>

      {/* Sparse header — title + meta only */}
      <div style={{ padding: '44px 40px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div>
          <span
            onClick={onBack}
            style={{ fontSize: '7px', letterSpacing: '0.2em', fontWeight: 300, color: 'rgba(0,0,0,0.35)', cursor: 'crosshair', display: 'block', marginBottom: '28px' }}
          >
            ← INDEX
          </span>
          <p style={{ fontSize: '10px', letterSpacing: '0.3em', fontWeight: 400 }}>{project.title}</p>
        </div>
        <p style={{ fontSize: '7px', letterSpacing: '0.14em', fontWeight: 300, color: 'rgba(0,0,0,0.38)' }}>
          {project.location}, {project.year}
        </p>
      </div>

      {/* Image sequence — alternates full-bleed and contained */}
      {project.images.map((img, i) => {
        if (i === 0) {
          return (
            <div key={i} style={{ height: '92vh', overflow: 'hidden', backgroundColor: '#d9d9d9', marginBottom: '2px' }}>
              <Media
                image={img}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          )
        }

        // Alternating left/right contained with very different widths
        const layouts = [
          { align: 'left', width: '58%', offset: '0%', pad: '40px' },
          { align: 'right', width: '42%', offset: '0%', pad: '40px' },
          { align: 'left', width: '50%', offset: '0%', pad: '7%' },
          { align: 'right', width: '36%', offset: '0%', pad: '5%' },
        ]
        const layout = layouts[(i - 1) % layouts.length]
        const isLeft = layout.align === 'left'

        // Every 3rd image goes full-bleed
        if (i % 4 === 3) {
          return (
            <div key={i} style={{ height: '72vh', overflow: 'hidden', backgroundColor: '#d9d9d9', margin: '80px 0' }}>
              <Media
                image={img}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          )
        }

        return (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: isLeft ? 'flex-start' : 'flex-end',
              paddingLeft: isLeft ? layout.pad : '0',
              paddingRight: isLeft ? '0' : layout.pad,
              marginBottom: '80px',
            }}
          >
            <div style={{ width: `min(${layout.width}, 600px)`, minWidth: '200px' }}>
              <div style={{ aspectRatio: '3/4', overflow: 'hidden', backgroundColor: '#d9d9d9' }}>
                <Media
                  image={img}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
            </div>
          </div>
        )
      })}

      <footer style={{ marginTop: '80px', padding: '24px 40px', borderTop: '1px solid rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span
          onClick={onBack}
          style={{ fontSize: '7px', letterSpacing: '0.2em', fontWeight: 300, color: 'rgba(0,0,0,0.35)', cursor: 'crosshair' }}
        >
          ← BACK TO INDEX
        </span>
        <span style={{ fontSize: '7px', letterSpacing: '0.14em', fontWeight: 300, color: 'rgba(0,0,0,0.28)' }}>
          STACEY NAH © 2026
        </span>
      </footer>
    </main>
  )
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>('home')

  const nav = (p: Page) => { setPage(p); window.scrollTo(0, 0) }
  const goHome = () => nav('home')

  const staticPages = new Set(['home', 'index', 'about', 'contact'])
  const activeProject = !staticPages.has(page)
    ? projects.find((p) => p.id === page) ?? null
    : null

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', color: '#000' }}>
      <Nav current={page} onNav={nav} />
      <div key={page} className="page-enter">
        {activeProject && <Project project={activeProject} onBack={goHome} />}
        {page === 'index' && <ProjectsIndex onSelect={(id) => nav(id)} />}
        {page === 'about' && <About onBack={goHome} />}
        {page === 'contact' && <Contact onBack={goHome} />}
        {page === 'home' && <Home onProjectClick={(id) => nav(id)} />}
      </div>
    </div>
  )
}
