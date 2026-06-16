<template>
  <div class="bg-[#4da882] text-white p-4 rounded-lg">
    <h2 class="text-center font-semibold mb-3">Профиль</h2>
    
    <template v-if="user">
      <div class="flex items-center gap-3 mb-3">
        <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#4da882] font-bold flex-shrink-0">
          {{ userInitials }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium truncate">{{ user.lastName }} {{ user.firstName }}</p>
          <p class="text-xs opacity-80 truncate">{{ user.patronymic || '' }}</p>
        </div>
        <div class="flex items-center gap-1 text-sm">
          <img src="/images/cristal-profile.png" alt="Уровень" class="w-5 h-7" />
          <span>Ур. {{ user.level || 1 }}</span>
        </div>
      </div>
      
      <div class="flex gap-2">
        <button 
          @click="showEditModal = true"
          class="flex-1 bg-[#5cb894] hover:bg-[#6ec9a6] text-white py-2 rounded text-sm transition text-center"
        >
          Редактировать
        </button>
        <button 
          @click="handleLogout"
          class="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded text-sm transition text-center"
        >
          Выйти
        </button>
      </div>
    </template>

    <template v-else>
      <div class="flex items-center gap-3 mb-3">
        <div class="w-10 h-10 bg-white rounded-full flex-shrink-0"></div>
        <div class="flex-1">
          <p class="text-sm font-medium">Гость</p>
          <p class="text-xs opacity-80">Войдите в систему</p>
        </div>
      </div>
      <NuxtLink 
        to="/login"
        class="block w-full bg-[#5cb894] hover:bg-[#6ec9a6] text-white py-2 rounded text-sm transition text-center"
      >
        Войти
      </NuxtLink>
    </template>

    <!-- Модальное окно редактирования -->
    <div 
      v-if="showEditModal" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="flex justify-between items-center p-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-800">Редактировать профиль</h3>
          <button 
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 transition"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleUpdate" class="p-4 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Фамилия</label>
              <input 
                v-model="editForm.lastName"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#4da882] text-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Имя</label>
              <input 
                v-model="editForm.firstName"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#4da882] text-sm"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Отчество</label>
            <input 
              v-model="editForm.patronymic"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#4da882] text-sm"
            />
          </div>

          <div v-if="successMessage" class="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm">
            {{ successMessage }}
          </div>

          <div class="flex gap-3 pt-2">
            <button 
              type="button"
              @click="closeModal"
              class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
            >
              Отмена
            </button>
            <button 
              type="submit"
              class="flex-1 px-4 py-2 bg-[#4da882] text-white rounded-lg hover:bg-[#5cb894] transition text-sm font-medium"
            >
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore()

onMounted(() => {
  authStore.initAuth()
})

const user = computed(() => authStore.user)

const userInitials = computed(() => {
  if (!user.value) return '?'
  return `${user.value.lastName?.[0] || ''}${user.value.firstName?.[0] || ''}`.toUpperCase()
})

const showEditModal = ref(false)

const editForm = ref({
  firstName: '',
  lastName: '',
  patronymic: ''
})

const successMessage = ref('')

// Отслеживаем открытие модального окна
watch(() => showEditModal.value, (isOpen) => {
  if (isOpen && user.value) {
    editForm.value = {
      firstName: user.value.firstName,
      lastName: user.value.lastName,
      patronymic: user.value.patronymic || ''
    }
    successMessage.value = ''
  }
})

const closeModal = () => {
  showEditModal.value = false
  successMessage.value = ''
}

const handleUpdate = () => {
  const result = authStore.updateProfile(editForm.value)
  
  if (result.success) {
    successMessage.value = 'Профиль обновлен'
    setTimeout(() => {
      closeModal()
    }, 1000)
  }
}

const handleLogout = () => {
  if (confirm('Вы уверены, что хотите выйти?')) {
    authStore.logout()
  }
}
</script>