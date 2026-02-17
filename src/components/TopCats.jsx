import { useState, useEffect } from 'react'
import { getTopCats, incrementVote, decrementVote } from '../services/api'
import styles from './TopCats.module.css'

export default function TopCats({ currentSort }) {
  const [topCats, setTopCats] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchTopCats = async () => {
    try {
      const cats = await getTopCats()
      setTopCats(cats)
    } catch (error) {
      console.error('Ошибка загрузки топа:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleVote = async (imagePath, action) => {
    try {
      let updatedCats
      if (action === 'increment') {
        updatedCats = await incrementVote(imagePath)
      } else {
        updatedCats = await decrementVote(imagePath)
      }
      setTopCats(updatedCats)
    } catch (error) {
      console.error('Ошибка обновления рейтинга:', error)
    }
  }

  useEffect(() => {
    fetchTopCats()
  }, [])

  const sortedCats = [...topCats].sort((a, b) => {
    if (currentSort === 'funny') {
      return b.votes - a.votes
    } else {
      return a.votes - b.votes
    }
  })

  if (loading) {
    return (
      <section className={styles.topFunny}>
        <h2 className={styles.title}>Топ самых смешных котиков</h2>
        <p className={styles.subtitle}>Загрузка...</p>
      </section>
    )
  }

  return (
    <section className={styles.topFunny}>
      <h2 className={styles.title}>Топ самых смешных котиков</h2>
      <p className={styles.subtitle}>
        Здесь появляются только котики, которых ты отметил как смешных в бесконечной ленте.
      </p>
      
      {sortedCats.length === 0 ? (
        <p className={styles.empty}>
          Пока никто не попал в топ. Отметь смешного котика в ленте!
        </p>
      ) : (
        <div className={styles.topGrid}>
          {sortedCats.map((cat, index) => (
            <article key={cat.id} className={styles.topCard}>
              <img
                src={cat.imagePath}
                alt="Котик из топа"
                className={styles.topCardImage}
                loading="lazy"
              />
              <div className={styles.topCardFooter}>
                <div className={styles.leftSection}>
                  <span className={styles.label}>Голоса</span>
                  <span className={styles.votes}>{cat.votes}</span>
                </div>
                <div className={styles.voteControls}>
                  <button
                    className={styles.voteBtn}
                    onClick={() => handleVote(cat.imagePath, 'decrement')}
                    title="Уменьшить рейтинг"
                  >
                    −
                  </button>
                  <button
                    className={styles.voteBtn}
                    onClick={() => handleVote(cat.imagePath, 'increment')}
                    title="Увеличить рейтинг"
                  >
                    +
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}
