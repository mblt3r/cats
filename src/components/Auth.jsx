import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, register } from '../services/api'
import styles from './Auth.module.css'

export default function Auth() {
  const [activeTab, setActiveTab] = useState('login')
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [message, setMessage] = useState({ text: '', isError: false })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e, action) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ text: '', isError: false })

    try {
      if (action === 'login') {
        await login(formData.username, formData.password)
      } else {
        await register(formData.username, formData.password)
      }
      navigate('/cats')
    } catch (error) {
      setMessage({ text: error.message, isError: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.authLayout}>
      <div className={styles.authCard}>
        <h1 className={styles.title}>Котики с рейтингом смешности</h1>
        <p className={styles.subtitle}>
          Войди или зарегистрируйся, чтобы увидеть самых смешных котиков.
        </p>

        <div className={styles.tabs}>
          <button
            className={`${styles.tabButton} ${activeTab === 'login' ? styles.tabButtonActive : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Вход
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'register' ? styles.tabButtonActive : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Регистрация
          </button>
        </div>

        <div className={styles.forms}>
          {activeTab === 'login' ? (
            <form
              className={styles.form}
              onSubmit={(e) => handleSubmit(e, 'login')}
            >
              <div className={styles.formGroup}>
                <label htmlFor="login-username">Логин</label>
                <input
                  id="login-username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="login-password">Пароль</label>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              <button
                type="submit"
                className={`${styles.button} ${styles.buttonPrimary}`}
                disabled={loading}
              >
                {loading ? 'Входим...' : 'Войти'}
              </button>
            </form>
          ) : (
            <form
              className={styles.form}
              onSubmit={(e) => handleSubmit(e, 'register')}
            >
              <div className={styles.formGroup}>
                <label htmlFor="register-username">Логин</label>
                <input
                  id="register-username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="register-password">Пароль</label>
                <input
                  id="register-password"
                  name="password"
                  type="password"
                  minLength="4"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
              <button
                type="submit"
                className={`${styles.button} ${styles.buttonPrimary}`}
                disabled={loading}
              >
                {loading ? 'Регистрируем...' : 'Зарегистрироваться'}
              </button>
            </form>
          )}
        </div>

        {message.text && (
          <div className={`${styles.message} ${message.isError ? styles.messageError : styles.messageSuccess}`}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  )
}
