/**
 * Class maps for the dropzone family (`Dropzone`, `DropzoneEmptyState`,
 * `FilePreview`).
 *
 * The two fingerprint pages use slightly different accent palettes — the
 * analysis page leans on the blue accent, the upload page on the cyan one —
 * so the palette is selected per instance through the `tone` prop instead of
 * duplicating markup.
 *
 * Every value is a complete class string (never concatenated fragments) so
 * Tailwind's scanner can see them.
 */
export const DROPZONE_TONES = {
  blue: {
    idle: "border-dashed border-[rgba(91,137,212,0.14)] bg-[#1A1E2D] cursor-pointer hover:border-[rgba(91,137,212,0.3)]",
    drag: "border-[#5B89D4] bg-[#5B89D4]/5 shadow-[0_0_40px_rgba(91,137,212,0.12)]",
    preview: "border-[rgba(91,137,212,0.25)] bg-[#1A1E2D]",
    image: "border-[rgba(91,137,212,0.2)]",
    badge: "border-[#5B89D4]/30 text-[#5B89D4] bg-[#13151F]/80",
    icon: "border-[rgba(91,137,212,0.2)]",
  },
  cyan: {
    idle: "border-dashed border-[rgba(0,240,255,0.14)] bg-[#13151F] cursor-pointer hover:border-[rgba(0,240,255,0.3)]",
    drag: "border-[#5B89D4] bg-[#5B89D4]/5 shadow-[0_0_30px_rgba(0,240,255,0.1)]",
    preview: "border-[rgba(0,240,255,0.25)] bg-[#13151F]",
    image: "border-[rgba(0,240,255,0.2)]",
    badge: "border-[#5B89D4]/30 text-[#5B89D4] bg-[#13151F]/90",
    icon: "border-[rgba(0,240,255,0.15)]",
  },
};

/** Returns the class map for `tone`, defaulting to the blue accent. */
export function getDropzoneTone(tone) {
  return DROPZONE_TONES[tone] ?? DROPZONE_TONES.blue;
}
