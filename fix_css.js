const fs = require('fs');
let css = fs.readFileSync('src/pages/auth/auth.css', 'utf8');

// 1. Remove the display:none block
css = css.replace(/\/\* On Mobile, hide the heavy desktop marketing elements[\s\S]*?display: none;\n}/, '/* Marketing elements are now visible on mobile */');

// 2. We need to move the marketing and card styles from the desktop media query to base.
// They start at "/* Reveal desktop marketing elements */"
// and end before "/* Desktop Form Column */"

const desktopStartToken = "/* Reveal desktop marketing elements */";
const desktopEndToken = "/* Desktop Form Column */";

let startIndex = css.indexOf(desktopStartToken);
let endIndex = css.indexOf(desktopEndToken);

if (startIndex !== -1 && endIndex !== -1) {
  let stylesToMove = css.substring(startIndex, endIndex);
  
  // Remove them from the media query
  css = css.slice(0, startIndex) + css.slice(endIndex);
  
  // Clean up any extra indentation in the moved styles (optional but good)
  stylesToMove = stylesToMove.replace(/\n  /g, '\n');

  // Insert them into base styles, before the modal dialogs section or Tablet media query
  const insertionPoint = css.indexOf("/* =========================================================" + "\n" + "   2. TABLET ENHANCEMENT");
  if (insertionPoint !== -1) {
    css = css.slice(0, insertionPoint) + "\n" + stylesToMove + "\n" + css.slice(insertionPoint);
  }
}

// 3. Fix the container overflows
// Find max-height: 100vh; overflow: hidden !important; in desktop query and change to auto
css = css.replace(/height: 100vh;\s*max-height: 100vh;\s*overflow: hidden !important;/g, "height: 100vh;\n    max-height: 100vh;\n    overflow-y: auto !important;");
css = css.replace(/overflow: hidden !important;/g, "overflow-y: auto !important;");

// 4. Update the mobile hero panel padding and layout
css = css.replace(/\.auth-hero-panel {[\s\S]*?flex-shrink: 0;\n}/, 
`.auth-hero-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 32px 16px 24px;
  position: relative;
  z-index: 2;
  flex-shrink: 0;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}`);

// Also fix auth-page-container for desktop to allow scroll if needed, though we set overflow-y: auto above.
// Add some spacing for auth-form-panel on mobile
css = css.replace(/\.auth-form-panel {[\s\S]*?flex: 1;\n}/, 
`.auth-form-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  position: relative;
  z-index: 2;
  flex: 1;
  padding: 0 16px 40px;
}`);

// On mobile, text should be centered. But the moved styles have text-align: left for auth-hero-desc.
// We can let them be centered on mobile and left on desktop.
// So let's add a quick mobile override for the moved styles.
const mobileOverrides = `
/* Mobile Overrides for Marketing Elements */
@media (max-width: 1023px) {
  .auth-hero-title { font-size: 1.7rem; text-align: center; margin-top: 16px; }
  .auth-hero-desc { text-align: center; font-size: 0.85rem; margin-bottom: 24px; }
  .auth-hero-features { gap: 16px; margin-bottom: 32px; }
  .auth-feature-card { flex-direction: column; text-align: center; padding: 20px 16px; }
  .auth-feature-card::after { display: none; }
  .auth-feature-header-row { justify-content: center; flex-direction: column; gap: 4px; margin-bottom: 8px; }
  .auth-hero-footer { padding-bottom: 24px; }
}
`;

css = css.replace("/* Marketing elements are now visible on mobile */", mobileOverrides);

fs.writeFileSync('src/pages/auth/auth.css', css);
console.log("CSS updated!");
