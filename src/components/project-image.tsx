import type { EngineeringImage } from "@/data/projects";
import { publicFileExists } from "@/lib/media";
import { assetPath } from "@/lib/paths";
import { ImagePlaceholder } from "./image-placeholder";
import { ImageViewer } from "./image-viewer";

export type ProjectImageProps = Omit<EngineeringImage, "label"> & {
  label?: string;
  priority?: boolean;
  expandable?: boolean;
  className?: string;
};

export function ProjectImage({ className = "", label, ...props }: ProjectImageProps) {
  const imageLabel = label ?? props.alt;
  const exists = publicFileExists(props.src);
  return (
    <figure className={`project-figure ${className}`}>
      <div className={`figure-media aspect-${props.aspect ?? "landscape"}${exists ? " has-image" : ""}`}>
        {exists ? <ImageViewer {...props} label={imageLabel} resolvedSrc={assetPath(props.src)} /> : <ImagePlaceholder label={imageLabel} src={props.src} kind={props.kind} />}
      </div>
      {(props.caption || props.metadata?.length) && <figcaption>
        {props.caption && <span>{props.caption}</span>}
        {props.metadata?.length ? <span className="figure-metadata">{props.metadata.join(" / ")}</span> : null}
      </figcaption>}
    </figure>
  );
}

export function ProjectGallery({ images, layout = "grid" }: { images: EngineeringImage[]; layout?: "full" | "grid" }) {
  return <div className={`project-gallery gallery-${layout}`}>{images.map((image, index) => <ProjectImage key={`${image.src}-${index}`} {...image} />)}</div>;
}
