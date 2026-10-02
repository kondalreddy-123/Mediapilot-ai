// UI-facing destination info. Phase 3 extends each entry with its Cloudinary transformation recipe.
export const presets = {
  reel:       { label: 'Reel / Short', icon: 'Clapperboard', blurb: 'Vertical short-form video, framed around the action.' },
  youtube:    { label: 'YouTube',      icon: 'Youtube',      blurb: 'Wide, sharp video and thumbnails for long-form.' },
  socialPost: { label: 'Social Post',  icon: 'Smartphone',   blurb: 'Square and portrait images and clips for your feed.' },
  story:      { label: 'Story',        icon: 'GalleryVertical', blurb: 'Full-screen vertical content for stories.' },
  product:    { label: 'Product',      icon: 'ShoppingBag',  blurb: 'Clean product shots with the background removed.' },
  website:    { label: 'Website',      icon: 'Globe',        blurb: 'Light, fast media that loads quickly on any device.' },
}
export const steps = [
  { title: 'Upload', text: 'Upload your image or video once.' },
  { title: 'Choose', text: 'Tell MediaPilot where you want to use it.' },
  { title: 'Done',   text: 'AI processes and delivers the optimized version.' },
]
export const stages = [
  { title: 'Upload',     text: 'Your file is stored in Cloudinary.' },
  { title: 'Analyze',    text: 'Size, orientation and content are read.' },
  { title: 'Smart crop', text: 'The frame follows what matters.' },
  { title: 'Background', text: 'Product backgrounds are removed.' },
  { title: 'Optimize',   text: 'Best format and quality, automatically.' },
  { title: 'Deliver',    text: 'Preview, download or share a link.' },
]
