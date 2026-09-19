import Link from "next/link";

export function Header({ resumeUrl }: { resumeUrl?: string }) {
  return (
    <header className="site-header shell">
      <Link href="/" className="brand" aria-label="Kai Zou, home">Portfolio</Link>
      <nav id="primary-navigation" aria-label="Primary navigation">
        <Link href="/#projects">Projects</Link>
        <Link href="/#experience">Experience</Link>
        <Link href="/#about">About</Link>
        {resumeUrl ? <a href={resumeUrl} target="_blank" rel="noreferrer">Resume</a> : <span className="unavailable" title="Resume has not been added">Resume</span>}
      </nav>
    </header>
  );
}
