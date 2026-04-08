const TEMPLATE_HEAD = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Inter', 'ui-sans-serif', 'system-ui'],
            display: ['Space Grotesk', 'ui-sans-serif', 'system-ui'],
          },
          colors: {
            orange: {
              50:'#fff7ed',100:'#ffedd5',200:'#fed7aa',300:'#fdba74',
              400:'#fb923c',500:'#f97316',600:'#ea580c',700:'#c2410c',
              800:'#9a3412',900:'#7c2d12',
            },
          },
        },
      },
    }
  </script>
  <style>
    body {
      font-family: 'Inter', ui-sans-serif, system-ui;
      -webkit-font-smoothing: antialiased;
      margin: 0; padding: 0;
      min-height: 100vh;
      display: flex; align-items: center; justify-content: center;
      background: transparent;
    }
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #e5e5e5; border-radius: 9999px; }
  </style>
</head>
<body>`

const TEMPLATE_FOOT = `
  <script>
    if (window.lucide) window.lucide.createIcons();
    window.addEventListener('load', () => { if (window.lucide) window.lucide.createIcons(); });
    new MutationObserver(() => { if (window.lucide) window.lucide.createIcons(); })
      .observe(document.body, { childList: true, subtree: true });
  </script>
</body>
</html>`

export function wrapInTemplate(code: string): string {
  if (code.includes('<html') || code.includes('<!DOCTYPE')) return code
  return `${TEMPLATE_HEAD}\n  ${code}\n${TEMPLATE_FOOT}`
}
