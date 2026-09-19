import Link from "next/link";
import { ProjectImage } from "@/components/project-image";
import { projects } from "@/data/projects";
import { experience, site } from "@/data/site";
import { assetPath } from "@/lib/paths";
import { publicFileExists } from "@/lib/media";

export default function Home() {
  const resumeReady = site.resume && (site.resume.startsWith("https://") || publicFileExists(site.resume));

  return (
    <main id="main" className="shell">
      <section className="intro" aria-labelledby="intro-title">
        <h1 id="intro-title">Kai Zou</h1>
        <p>Computer Engineering at {site.school}.</p>
        <p className="secondary">PNT/GNSS · Embedded Systems · Autonomous Systems · RF</p>
        <p className="intro-description">I build navigation, autonomy, and embedded systems that connect algorithms with hardware.</p>
        <div className="inline-links">
          <a href={site.github} target="_blank" rel="noreferrer">GitHub</a>
          {site.linkedin ? <a href={site.linkedin} target="_blank" rel="noreferrer">LinkedIn</a> : <span className="unavailable" title="LinkedIn profile has not been added">LinkedIn (not added)</span>}
          {resumeReady ? <a href={assetPath(site.resume)} target="_blank" rel="noreferrer">Resume</a> : <span className="unavailable">Resume (not added)</span>}
        </div>
      </section>

      <section className="section projects-section" id="projects">
        <h2>Projects</h2>
        {projects.map((project, index) => (
          <article key={project.slug} className="featured-project">
            <p className="project-number">{project.number} / {String(projects.length).padStart(2, "0")}</p>
            <h3><Link href={`/projects/${project.slug}/`}>{project.title}</Link></h3>
            <p className="technical-summary">{project.technologies.join(" / ")}</p>
            <p className="project-description">{project.description}</p>
            <ProjectImage {...project.heroImage} aspect="wide" priority={index === 0} metadata={undefined} />
            <Link className="project-link" href={`/projects/${project.slug}/`}>View project <span aria-hidden="true">→</span></Link>
          </article>
        ))}
        <a className="text-link" href={site.github} target="_blank" rel="noreferrer">More on GitHub</a>
      </section>

      <section className="section" id="experience">
        <div className="section-heading">
          <h2>Experience</h2>
          {resumeReady ? <a href={assetPath(site.resume)} target="_blank" rel="noreferrer">View resume</a> : <span className="unavailable">Resume not added</span>}
        </div>
        <div className="experience-list">
          {experience.map((item) => (
            <article className="experience-row" key={item.company}>
              <div className="experience-date"><p>{item.period}</p><p>{item.location}</p></div>
              <div>
                <h3>{item.company}</h3>
                <p className="experience-role">{item.role}</p>
                <p className="experience-description">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
        <p className="toolbox"><span>Tools:</span> C++ / Python / Linux / Git / Docker / KiCad / LTspice / MATLAB</p>
      </section>

      <section className="section" id="about">
        <h2>About</h2>
        <div className="prose">
          <p>I’m a computer engineering student at {site.school}, based in {site.location}. My interests include positioning and navigation, autonomous platforms, RF systems, and embedded computing.</p>
          <p>I enjoy working across software and hardware: developing navigation algorithms, integrating sensors, and testing physical systems.</p>
        </div>
        {site.profileImage && <ProjectImage src={site.profileImage} alt="Kai Zou" label="Kai Zou" aspect="portrait" className="profile-photo" expandable={false} />}
      </section>

      <section className="section contact-section" id="contact">
        <h2>Contact</h2>
        <div className="inline-links">
          {site.email ? <a href={`mailto:${site.email}`}>{site.email}</a> : <span className="unavailable">Email not added</span>}
          <a href={site.github} target="_blank" rel="noreferrer">GitHub</a>
          {site.linkedin ? <a href={site.linkedin} target="_blank" rel="noreferrer">LinkedIn</a> : <span className="unavailable">LinkedIn not added</span>}
        </div>
      </section>
    </main>
  );
}
