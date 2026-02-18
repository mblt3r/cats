import { useEffect, useState } from 'react'
import styles from './ThemeToggle.module.css'

function getInitialTheme() {
  const saved = localStorage.getItem('theme')
  if (saved === 'light' || saved === 'dark') return saved
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState(() => getInitialTheme())

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  const checked = theme === 'dark'

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={styles.toggle}
        role="switch"
        aria-checked={checked}
        aria-label={checked ? 'Включена темная тема' : 'Включена светлая тема'}
        onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      >
        <span className={styles.track}>
          <span className={styles.iconLeft} aria-hidden="true" />
          <span className={styles.iconRight} aria-hidden="true" />
          <span className={styles.thumb} />
        </span>
      </button>
    </div>
  )
}
