import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { ProjectGallery, ProjectImage } from "@/components/project-image";

export const dynamicParams = false;
export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })); }

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  return { title: project?.title ?? "Project not found", description: project?.description };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  const nextProject = projects[(projects.indexOf(project) + 1) % projects.length];

  return (
    <main id="main" className="case-study shell">
      <div className="case-breadcrumb">
        <Link href="/#projects">← Projects</Link>
        <span>{project.number} / {String(projects.length).padStart(2, "0")}</span>
      </div>
      <header className="case-heading">
        <h1>{project.title}</h1>
        <p className="technical-summary">{project.technologies.join(" / ")}</p>
        <p className="prose">{project.description}</p>
      </header>
      <ProjectImage {...project.heroImage} aspect="wide" priority />
      <nav className="case-contents" aria-label="Project contents">
        <a href="#overview">Overview</a>
        {project.sections.map((section) => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}
      </nav>
      <section id="overview" className="case-section">
        <h2>Overview</h2>
        <p className="prose">{project.overview}</p>
      </section>
      {project.sections.map((section) => (
        <section key={section.id} id={section.id} className="case-section">
          <h2>{section.title}</h2>
          <p className="prose">{section.text}</p>
          <ProjectGallery images={section.images} layout={section.layout ?? "full"} />
        </section>
      ))}
      <div className="next-project">
        <span className="secondary">Next project</span>
        <Link href={`/projects/${nextProject.slug}/`}>{nextProject.title} <span aria-hidden="true">→</span></Link>
      </div>
    </main>
  );
}
