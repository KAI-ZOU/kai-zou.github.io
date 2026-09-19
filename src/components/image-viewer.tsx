"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { ImagePlaceholder } from "./image-placeholder";
import type { EngineeringImage } from "@/data/projects";

type Props = EngineeringImage & { resolvedSrc: string; priority?: boolean; expandable?: boolean };

export function ImageViewer({ resolvedSrc, src, alt, label, kind, caption, fit = "contain", width = 1600, height = 1100, aspect, priority = false, expandable = true }: Props) {
  const [failed, setFailed] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const captionId = useId();

  function close() {
    dialog.current?.close();
    trigger.current?.focus();
  }

  if (failed) return <ImagePlaceholder src={src} label={label} kind={kind} />;

  const image = <Image src={resolvedSrc} alt={alt} width={width} height={height} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} className={`engineering-image fit-${fit}${aspect === "natural" ? " natural-image" : ""}`} onError={() => setFailed(true)} />;

  return (
    <>
      {expandable ? <button ref={trigger} type="button" className="image-trigger" onClick={() => dialog.current?.showModal()} aria-label={`Enlarge image: ${label}`} title="View full size">{image}</button> : image}
      {expandable && <dialog ref={dialog} className="image-dialog" aria-label={label} aria-describedby={caption ? captionId : undefined} onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
        <div className="dialog-bar"><span>{label}</span><button type="button" onClick={close} aria-label="Close image">Close</button></div>
        <Image src={resolvedSrc} alt={alt} width={width} height={height} className="dialog-image" loading="lazy" />
        <div className="dialog-footer"><p id={captionId}>{caption ?? alt}</p><a href={resolvedSrc} target="_blank" rel="noreferrer">Open original</a></div>
      </dialog>}
    </>
  );
}
