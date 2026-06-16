import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    users: [] // "база данных" пользователей
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    currentUser: (state) => state.user
  },

  actions: {
    // Инициализация при загрузке
    initAuth() {
      const savedUser = localStorage.getItem('currentUser')
      const savedUsers = localStorage.getItem('users')
      
      if (savedUsers) {
        this.users = JSON.parse(savedUsers)
      }
      
      if (savedUser) {
        this.user = JSON.parse(savedUser)
      }
    },

    // Регистрация
    register({ firstName, lastName, patronymic, email, password }) {
      // Проверка существующего пользователя
      const exists = this.users.find(u => u.email === email)
      if (exists) {
        return { success: false, message: 'Пользователь с таким email уже существует' }
      }

      const newUser = {
        id: Date.now(),
        firstName,
        lastName,
        patronymic,
        email,
        password, // в реальном проекте - хэш
        level: 1,
        createdAt: new Date().toISOString()
      }

      this.users.push(newUser)
      localStorage.setItem('users', JSON.stringify(this.users))
      
      // Автоматический вход после регистрации
      this.loginUser(newUser)
      
      return { success: true, message: 'Регистрация успешна' }
    },

    // Вход
    login({ email, password }) {
      const user = this.users.find(u => u.email === email && u.password === password)
      
      if (!user) {
        return { success: false, message: 'Неверный email или пароль' }
      }

      this.loginUser(user)
      return { success: true, message: 'Вход выполнен' }
    },

    // Вспомогательный метод входа
    loginUser(user) {
      const { password, ...userWithoutPassword } = user
      this.user = userWithoutPassword
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword))
    },

    // Выход
    logout() {
      this.user = null
      localStorage.removeItem('currentUser')
      navigateTo('/login')
    },

    // Обновление профиля
    updateProfile(data) {
      if (!this.user) return
      
      this.user = { ...this.user, ...data }
      
      // Обновляем в "базе"
      const index = this.users.findIndex(u => u.id === this.user.id)
      if (index !== -1) {
        this.users[index] = { ...this.users[index], ...data }
        localStorage.setItem('users', JSON.stringify(this.users))
      }
      
      localStorage.setItem('currentUser', JSON.stringify(this.user))
      return { success: true }
    }
  }
})