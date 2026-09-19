export function ImagePlaceholder({ label, src, kind = "Project image" }: { label: string; src: string; kind?: string }) {
  return (
    <div className="image-placeholder">
      <p className="placeholder-kind">{kind} to be added</p>
      <p className="placeholder-label">{label}</p>
      <p className="placeholder-path">Add <code>/public{src}</code></p>
    </div>
  );
}
