// Inject a launcher button you can manually trigger when page is ready
function injectLauncher() {
  if (document.getElementById('lichess-launcher')) return;

  const launcher = document.createElement('button');
  launcher.id = 'lichess-launcher';
  launcher.textContent = 'Run Lichess Setup';
  Object.assign(launcher.style, {
    position: 'fixed',
    top: '10px',
    right: '10px',
    zIndex: 99999,
    padding: '8px 12px',
    backgroundColor: '#28a',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  });

  document.body.appendChild(launcher);

  launcher.addEventListener('click', () => {
    console.log('🚀 Running Lichess Setup…');

    const spans = document.querySelectorAll('.vs-button-text.vs-button--text');
    const targetSpan = Array.from(spans).find(
      span => span.textContent.trim() === 'FEN to Clipboard'
    );

    if (!targetSpan) {
      console.warn('❌ No matching span found.');
      return;
    }

    const button = targetSpan.closest('button');
    if (!button) {
      console.warn('❌ Parent button not found.');
      return;
    }

    targetSpan.textContent = 'Open in Lichess';
    console.log('✅ Button text changed.');

    button.addEventListener('click', () => {
      console.log('🔘 Button clicked. Waiting 1 second…');
      setTimeout(async () => {
        try {
          const fen = await navigator.clipboard.readText();
          console.log('📋 Clipboard read:', fen);
          const url = `https://lichess.org/analysis/standard/${encodeURIComponent(fen)}`;
          console.log('🌐 Opening:', url);
          window.open(url, '_blank');
        } catch (err) {
          console.error('❌ Clipboard read failed:', err);
        }
      }, 1000);
    });

    launcher.disabled = true;
    launcher.textContent = 'Setup Complete';
  });
}

// Run after DOM is fully ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectLauncher);
} else {
  injectLauncher();
}
