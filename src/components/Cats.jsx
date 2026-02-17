import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import RandomCat from './RandomCat'
import TopCats from './TopCats'
import Feed from './Feed'
import { logout } from '../services/api'
import styles from './Cats.module.css'

export default function Cats() {
  const navigate = useNavigate()
  const [currentSort, setCurrentSort] = useState('funny')

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/auth')
    } catch (error) {
      console.error('Ошибка выхода:', error)
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.topBar}>
        <div className={styles.topBarTitle}>Самые смешные котики</div>
        <div className={styles.topBarActions}>
          <button
            className={`${styles.button} ${styles.buttonGhost} ${currentSort === 'funny' ? styles.buttonActive : ''}`}
            onClick={() => setCurrentSort('funny')}
          >
            Самые смешные
          </button>
          <button
            className={`${styles.button} ${styles.buttonGhost} ${currentSort === 'not-funny' ? styles.buttonActive : ''}`}
            onClick={() => setCurrentSort('not-funny')}
          >
            Самые не смешные
          </button>
          <button
            className={`${styles.button} ${styles.buttonSecondary}`}
            onClick={handleLogout}
          >
            Выйти
          </button>
        </div>
      </header>

      <main className={styles.content}>
        <RandomCat />
        <TopCats currentSort={currentSort} />
        <Feed />
      </main>
    </div>
  )
}
