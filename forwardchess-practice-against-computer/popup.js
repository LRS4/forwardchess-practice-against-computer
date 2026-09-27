document.getElementById('run').addEventListener('click', async () => {
  const status = document.getElementById('status');
  status.textContent = 'Running setup...';

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      console.log('🚀 Running setup from extension popup...');
      const spans = document.querySelectorAll('.vs-button-text.vs-button--text');
      const targetSpan = Array.from(spans).find(span => span.textContent.trim() === 'Copy FEN');

      if (targetSpan) {
        const button = targetSpan.closest('button');
        if (button) {
          targetSpan.textContent = 'Open in Lichess';
          console.log('✅ Button text changed.');
          button.addEventListener('click', async () => {
            console.log('🔘 Button clicked, waiting 1 second...');
            setTimeout(async () => {
              try {
                const fen = await navigator.clipboard.readText();
                const url = `https://lichess.org/analysis/standard/${encodeURIComponent(fen)}`;
                console.log('🌐 Opening:', url);
                window.open(url, '_blank');
              } catch (err) {
                console.error('❌ Failed to read clipboard:', err);
              }
            }, 1000);
          });
        }
      } else {
        console.log('❌ No matching span found.');
      }
    }
  }, () => {
    status.textContent = 'Setup complete!';
  });
});
