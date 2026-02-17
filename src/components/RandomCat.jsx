import { useState, useEffect } from 'react'
import styles from './RandomCat.module.css'

export default function RandomCat() {
  const [catUrl, setCatUrl] = useState('')
  const [loading, setLoading] = useState(false)

  const loadRandomCat = async () => {
    setLoading(true)
    try {
      const url = `/api/cat-image?width=300&height=300&gif=1&says=LOL&fontSize=32&fontColor=white&filter=mono&type=square&timestamp=${Date.now()}`
      
      await new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = resolve
        img.onerror = () => {
          const fallbackUrl = `/api/cat-image?width=300&height=300&gif=1&timestamp=${Date.now()}`
          const fallbackImg = new Image()
          fallbackImg.onload = resolve
          fallbackImg.onerror = reject
          fallbackImg.src = fallbackUrl
          setCatUrl(fallbackUrl)
        }
        img.src = url
        setCatUrl(url)
      })
    } catch (error) {
      console.error('Ошибка загрузки котика:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRandomCat()
  }, [])

  return (
    <section className={styles.randomCat}>
      <h2 className={styles.title}>Случайный смешной котик из CATAAS</h2>
      <p className={styles.subtitle}>
        Нажми на кнопку, чтобы увидеть нового рандомного котика.
      </p>
      <button
        className={`${styles.button} ${styles.buttonPrimary}`}
        onClick={loadRandomCat}
        disabled={loading}
      >
        {loading ? 'Загружаем котика...' : 'Показать случайного котика'}
      </button>
      <div className={styles.imageWrapper}>
        {catUrl && (
          <img
            src={catUrl}
            alt="Случайный смешной котик"
            className={styles.image}
            style={{ opacity: loading ? 0.5 : 1 }}
          />
        )}
      </div>
    </section>
  )
}
