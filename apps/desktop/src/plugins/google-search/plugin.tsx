export default {
  id: 'google-search-plugin',
  name: 'Google Search on Text Selection',
  register(ctx) {
    // Add a command to the Command Palette (Cmd+K) to search selected text or query
    ctx.register({
      id: 'google-search-command',
      area: 'palette',
      render: () => null,
      data: {
        title: 'Search in Google...',
        category: 'Tools',
        run: () => {
          const selection = window.getSelection()?.toString().trim();
          if (selection) {
            const url = `https://www.google.com/search?q=${encodeURIComponent(selection)}`;
            window.open(url, '_blank');
          } else {
            const query = prompt('Enter search query for Google:');
            if (query) {
              const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
              window.open(url, '_blank');
            }
          }
        }
      }
    });

    // Listen to global context menu events to intercept text selection or add a floating helper
    window.addEventListener('mouseup', (e) => {
      const selection = window.getSelection()?.toString().trim();
      // We can create a floating search button if text is selected
      let existingBtn = document.getElementById('google-search-float-btn');
      if (selection && selection.length > 0) {
        if (!existingBtn) {
          const btn = document.createElement('button');
          btn.id = 'google-search-float-btn';
          btn.innerText = '🔍 Search Google';
          btn.style.position = 'fixed';
          btn.style.zIndex = '999999';
          btn.style.left = `${e.clientX + 10}px`;
          btn.style.top = `${e.clientY + 10}px`;
          btn.style.padding = '6px 12px';
          btn.style.background = '#2563eb';
          btn.style.color = '#fff';
          btn.style.border = 'none';
          btn.style.borderRadius = '6px';
          btn.style.fontSize = '12px';
          btn.style.cursor = 'pointer';
          btn.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
          
          btn.onclick = () => {
            window.open(`https://www.google.com/search?q=${encodeURIComponent(selection)}`, '_blank');
            btn.remove();
          };
          
          document.body.appendChild(btn);

          // Auto-remove after 5s or click elsewhere
          setTimeout(() => btn.remove(), 5000);
        }
      } else {
        if (existingBtn) {
          existingBtn.remove();
        }
      }
    });
  }
};
