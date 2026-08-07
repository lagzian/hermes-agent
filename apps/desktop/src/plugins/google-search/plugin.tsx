export default {
  id: 'google-search-plugin',
  name: 'Google Search on Text Selection',
  register(ctx) {
    // Command palette entry
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

    // Intercept right-click (contextmenu) event
    window.addEventListener('contextmenu', (e) => {
      const selection = window.getSelection()?.toString().trim();
      if (selection && selection.length > 0) {
        e.preventDefault();

        let existingMenu = document.getElementById('google-search-context-menu');
        if (existingMenu) existingMenu.remove();

        const menu = document.createElement('div');
        menu.id = 'google-search-context-menu';
        menu.style.position = 'fixed';
        menu.style.zIndex = '999999';
        menu.style.left = `${Math.min(e.clientX, window.innerWidth - 180)}px`;
        menu.style.top = `${Math.min(e.clientY, window.innerHeight - 80)}px`;
        menu.style.background = 'var(--ui-background, #1e293b)';
        menu.style.color = 'var(--ui-text, #f8fafc)';
        menu.style.border = '1px solid var(--ui-stroke, #334155)';
        menu.style.borderRadius = '8px';
        menu.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.4)';
        menu.style.padding = '4px';
        menu.style.fontFamily = 'inherit';
        menu.style.fontSize = '13px';
        menu.style.minWidth = '160px';

        // 1. Google Search Item
        const searchItem = document.createElement('div');
        searchItem.innerText = '🔍 Search in Google';
        searchItem.style.padding = '8px 12px';
        searchItem.style.borderRadius = '4px';
        searchItem.style.cursor = 'pointer';
        searchItem.style.display = 'flex';
        searchItem.style.alignItems = 'center';
        searchItem.style.gap = '8px';

        searchItem.onmouseenter = () => { searchItem.style.background = 'var(--ui-accent, #2563eb)'; searchItem.style.color = '#fff'; };
        searchItem.onmouseleave = () => { searchItem.style.background = 'transparent'; searchItem.style.color = 'var(--ui-text, #f8fafc)'; };

        searchItem.onclick = () => {
          window.open(`https://www.google.com/search?q=${encodeURIComponent(selection)}`, '_blank');
          menu.remove();
        };
        menu.appendChild(searchItem);

        // Separator
        const sep = document.createElement('div');
        sep.style.height = '1px';
        sep.style.background = 'var(--ui-stroke, #334155)';
        sep.style.margin = '4px 0';
        menu.appendChild(sep);

        // 2. Copy Item
        const copyItem = document.createElement('div');
        copyItem.innerText = '📋 Copy';
        copyItem.style.padding = '8px 12px';
        copyItem.style.borderRadius = '4px';
        copyItem.style.cursor = 'pointer';
        copyItem.style.display = 'flex';
        copyItem.style.alignItems = 'center';
        copyItem.style.gap = '8px';

        copyItem.onmouseenter = () => { copyItem.style.background = 'var(--ui-accent, #2563eb)'; copyItem.style.color = '#fff'; };
        copyItem.onmouseleave = () => { copyItem.style.background = 'transparent'; copyItem.style.color = 'var(--ui-text, #f8fafc)'; };

        copyItem.onclick = () => {
          navigator.clipboard.writeText(selection);
          menu.remove();
        };
        menu.appendChild(copyItem);

        document.body.appendChild(menu);

        const closeListener = (evt) => {
          if (!menu.contains(evt.target)) {
            menu.remove();
            window.removeEventListener('mousedown', closeListener);
          }
        };
        setTimeout(() => window.addEventListener('mousedown', closeListener), 100);
      }
    });
  }
};
