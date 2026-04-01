import React, { useEffect, useMemo, useState } from 'react';

const AIPlanHub = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const syncTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const iframeSrc = useMemo(
    () => `/aiplanhub/?theme=${isDark ? 'dark' : 'light'}&embed=1`,
    [isDark],
  );

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        paddingTop: 8,
        paddingBottom: 12,
        boxSizing: 'border-box',
        background: 'var(--semi-color-bg-0)',
      }}
    >
      <iframe
        key={iframeSrc}
        src={iframeSrc}
        title='AI 订阅方案对比'
        style={{
          flex: 1,
          border: 'none',
          width: '100%',
          height: '100%',
          borderRadius: 12,
          background: isDark ? '#0A0E1A' : '#F8FAFC',
        }}
        allow='clipboard-write'
      />
    </div>
  );
};

export default AIPlanHub;
