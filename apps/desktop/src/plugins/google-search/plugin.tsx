export default {
  id: 'google-search-plugin',
  name: 'Google Search on Text Selection',
  register(ctx) {
    // 1. Command Palette entry
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
            window.open(`https://www.google.com/search?q=${encodeURIComponent(selection)}`, '_blank');
          } else {
            const query = prompt('Enter search query for Google:');
            if (query) {
              window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
            }
          }
        }
      }
    });

    // 2. Native right-click context menu interceptor
    window.addEventListener('contextmenu', (e) => {
      const selection = window.getSelection()?.toString().trim();
      if (selection && selection.length > 0) {
        // We can inject a custom styled context menu or hook into existing browser context menu events
        // Since Electron/Chromium handles native text selection context menu, we can also add a floating action
        // or a custom listener.
      }
    });

    // 3. Floating Action Button on text selection (reliable cross-platform fallback)
    window.addEventListener('mouseup', (e) => {
      const selection = window.getSelection()?.toString().trim();
      let existingMenu = document.getElementById('google-search-context-menu');
      if (existingMenu) existingMenu.remove();

      if (selection && selection.length > 0) {
        // Only show if user clicked with right-click or normal selection
        const menu = document.createElement('div');
        menu.id = 'google-search-context-menu';
        menu.style.position = 'fixed';
        menu.style.zIndex = '999999';
        menu.style.left = `${Math.min(e.clientX, window.innerWidth - 160)}px`;
        menu.style.top = `${Math.min(e.clientY + 5, window.innerHeight - 50)}px`;
        menu.style.background = 'var(--ui-background, #1e293b)';
        menu.style.color = 'var(--ui-text, #f8fafc)';
        menu.style.border = '1px solid var(--ui-stroke, #334155)';
        menu.style.borderRadius = '8px';
        menu.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.3)';
        menu.style.padding = '4px';
        menu.style.fontFamily = 'inherit';
        menu.style.fontSize = '13px';

        const item = document.createElement('div');
        item.innerText = '🔍 Search in Google';
        item.style.padding = '8px 12px';
        item.style.borderRadius = '4px';
        item.style.cursor = 'pointer';
        item.style.display = 'flex';
        item.style.alignItems = 'center';
        item.style.gap = '8px';

        item.onmouseenter = () => { item.style.background = 'var(--ui-accent, #2563eb)'; item.style.color = '#fff'; };
        item.onmouseleave = () => { item.style.background = 'transparent'; item.style.color = 'var(--ui-text, #f8fafc)'; };

        item.onclick = () => {
          window.open(`https://www.google.com/search?q=${encodeURIComponent(selection)}`, '_blank');
          menu.remove();
        };

        menu.appendChild(item);
        document.body.appendChild(menu);

        const closeListener = () => {
          menu.remove();
          window.removeEventListener('mousedown', closeListener);
        };
        setTimeout(() => window.addEventListener('mousedown', closeListener), 100);
      }
    });
  }
};
