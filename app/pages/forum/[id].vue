<template>
  <div class="flex-1 p-8">
    <div class="max-w-4xl mx-auto">
      <!-- Заголовок и кнопка назад -->
      <div class="mb-6">
        <NuxtLink to="/forum" class="inline-block mb-4 px-4 py-2 bg-[#e8f4f0] text-gray-700 rounded-lg hover:bg-[#dceee8] transition text-sm">
          ← Вернуться
        </NuxtLink>
        <h2 class="text-xl font-bold text-gray-800">{{ topic.title }}</h2>
      </div>

      <!-- Сообщения -->
      <div class="space-y-4">
        <div 
          v-for="(message, index) in messages" 
          :key="index"
          class="bg-white rounded-lg shadow-sm p-6"
          :class="index === 0 ? '' : 'ml-12 border-l-4 border-[#4da882]'"
        >
          <div class="flex items-start gap-4">
            <!-- Аватар -->
            <div class="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center text-gray-600 font-semibold text-lg">
              {{ getInitials(message.author) }}
            </div>
            
            <div class="flex-1 min-w-0">
              <!-- Заголовок сообщения -->
              <div class="flex justify-between items-center mb-2 flex-wrap gap-2">
                <h3 class="font-semibold text-gray-800">{{ message.author }}</h3>
                <span class="text-sm text-gray-500 whitespace-nowrap">{{ message.date }}</span>
              </div>
              
              <!-- Текст сообщения с переносом -->
              <div class="text-sm text-gray-700 leading-relaxed space-y-3 break-words" v-html="message.content"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Кнопка добавить ответ с аватаром и именем -->
      <div class="mt-8 flex items-center justify-between bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center text-gray-600 font-semibold text-sm">
            {{ getCurrentUserInitials() }}
          </div>
          <span class="text-sm font-medium text-gray-700">
            {{ getCurrentUserName() }}
          </span>
        </div>
        <button 
          v-if="!showAnswerForm"
          @click="showAnswerForm = true"
          class="px-6 py-2 bg-[#4da882] text-white rounded-lg hover:bg-[#5cb894] transition text-sm font-medium"
        >
          Добавить ответ
        </button>
        <button 
          v-else
          @click="closeEditor"
          class="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition text-sm font-medium"
        >
          Отмена
        </button>
      </div>

      <!-- Форма ответа -->
      <div v-if="showAnswerForm" class="mt-4">
        <div class="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <!-- Панель инструментов редактора -->
          <div class="bg-gray-50 border-b border-gray-200 p-2">
            <div class="flex flex-wrap items-center gap-1">
              <button 
                @click="applyFormat('bold')"
                class="p-2 hover:bg-gray-200 rounded transition"
                :class="{ 'bg-gray-200': formats.bold }"
                title="Жирный"
              >
                <span class="font-bold text-sm">B</span>
              </button>
              
              <button 
                @click="applyFormat('italic')"
                class="p-2 hover:bg-gray-200 rounded transition"
                :class="{ 'bg-gray-200': formats.italic }"
                title="Курсив"
              >
                <span class="italic text-sm">I</span>
              </button>
              
              <button 
                @click="applyFormat('underline')"
                class="p-2 hover:bg-gray-200 rounded transition"
                :class="{ 'bg-gray-200': formats.underline }"
                title="Подчеркнутый"
              >
                <span class="underline text-sm">U</span>
              </button>
              
              <button 
                @click="applyFormat('strike')"
                class="p-2 hover:bg-gray-200 rounded transition"
                :class="{ 'bg-gray-200': formats.strike }"
                title="Зачеркнутый"
              >
                <span class="line-through text-sm">S</span>
              </button>

              <div class="w-px h-6 bg-gray-300 mx-2"></div>

              <button 
                @click="setAlign('left')"
                class="p-2 hover:bg-gray-200 rounded transition"
                :class="{ 'bg-gray-200': align === 'left' }"
                title="По левому краю"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z"></path>
                </svg>
              </button>
              
              <button 
                @click="setAlign('center')"
                class="p-2 hover:bg-gray-200 rounded transition"
                :class="{ 'bg-gray-200': align === 'center' }"
                title="По центру"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z"></path>
                </svg>
              </button>
              
              <button 
                @click="setAlign('right')"
                class="p-2 hover:bg-gray-200 rounded transition"
                :class="{ 'bg-gray-200': align === 'right' }"
                title="По правому краю"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z"></path>
                </svg>
              </button>

              <div class="w-px h-6 bg-gray-300 mx-2"></div>

              <select 
                v-model="fontFamily"
                @change="applyFont"
                class="px-2 py-1 border border-gray-300 rounded text-sm bg-white"
              >
                <option value="default">Шрифт</option>
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Georgia">Georgia</option>
                <option value="Verdana">Verdana</option>
                <option value="Comic Sans MS">Comic Sans MS</option>
              </select>

              <select 
                v-model="fontSize"
                @change="applySize"
                class="px-2 py-1 border border-gray-300 rounded text-sm bg-white"
              >
                <option value="default">Размер</option>
                <option value="12px">Маленький</option>
                <option value="16px">Средний</option>
                <option value="20px">Большой</option>
                <option value="24px">Очень большой</option>
              </select>

              <div class="w-px h-6 bg-gray-300 mx-2"></div>

              <input 
                type="color"
                v-model="textColor"
                @change="applyColor"
                class="w-8 h-8 p-0 border-0 cursor-pointer rounded"
                title="Цвет текста"
              >

              <input 
                type="color"
                v-model="bgColor"
                @change="applyBgColor"
                class="w-8 h-8 p-0 border-0 cursor-pointer rounded"
                title="Цвет фона"
              >

              <div class="w-px h-6 bg-gray-300 mx-2"></div>

              <button 
                @click="insertQuote('laquo')"
                class="p-2 hover:bg-gray-200 rounded transition"
                title="Елочки"
              >
                <span class="text-sm">&laquo;&raquo;</span>
              </button>
              
              <button 
                @click="insertQuote('quot')"
                class="p-2 hover:bg-gray-200 rounded transition"
                title="Лапки"
              >
                <span class="text-sm">&quot;&quot;</span>
              </button>

              <button 
                @click="insertQuote('bdquo')"
                class="p-2 hover:bg-gray-200 rounded transition"
                title="Немецкие"
              >
                <span class="text-sm">&bdquo;&ldquo;</span>
              </button>

              <div class="w-px h-6 bg-gray-300 mx-2"></div>

              <button 
                @click="insertList('ul')"
                class="p-2 hover:bg-gray-200 rounded transition"
                title="Маркированный список"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"></path>
                </svg>
              </button>
              
              <button 
                @click="insertList('ol')"
                class="p-2 hover:bg-gray-200 rounded transition"
                title="Нумерованный список"
              >
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"></path>
                </svg>
              </button>
            </div>
          </div>

          <div class="p-4">
            <div class="flex gap-3">
              <div class="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center text-gray-600 font-semibold text-sm">
                {{ getCurrentUserInitials() }}
              </div>
              <div class="flex-1">
                <div 
                  ref="editorRef"
                  contenteditable="true"
                  class="border border-gray-300 rounded-lg p-3 min-h-[200px] focus:outline-none focus:border-[#4da882] focus:ring-1 focus:ring-[#4da882] text-sm break-words overflow-wrap-break-word"
                  @input="updateContent"
                  @keydown="handleKeydown"
                  style="white-space: pre-wrap; word-wrap: break-word; word-break: break-word; overflow-wrap: break-word;"
                  placeholder="Введите ваш ответ..."
                ></div>
                <div class="text-xs text-gray-400 mt-1" v-if="charCount > 0">
                  {{ charCount }} символов
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 px-4 py-3 flex justify-end border-t border-gray-200">
            <button 
              @click="submitAnswer"
              class="px-6 py-2 bg-[#4da882] text-white rounded-lg hover:bg-[#5cb894] transition text-sm font-medium"
            >
              Отправить
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

const route = useRoute()
const authStore = useAuthStore()

const editorRef = ref(null)

// Получаем ID темы из маршрута
const topicId = parseInt(route.params.id)

// Данные тем с разными сообщениями
const topicsData = {
  1: {
    title: 'Как правильно решать задачи по химии?',
    messages: [
      {
        author: 'Петров А. С.',
        date: '15 июня 2026 14:30',
        content: 'Всем привет! Хочу поделиться своим опытом решения задач по органической химии. Часто у студентов возникают трудности с пониманием механизмов реакций.<br><br>Я разработал систему, которая помогает быстро определять тип реакции и правильно записывать продукты. Главное - понять, что все реакции подчиняются определенным закономерностям.<br><br>Первый шаг - определить функциональные группы в исходных веществах. Второй - понять, какой тип реакции происходит (замещение, присоединение, элиминирование). Третий - записать продукты, учитывая стехиометрию.<br><br>Надеюсь, эти советы помогут! Если есть вопросы - спрашивайте.'
      },
      {
        author: 'Иванова М. В.',
        date: '15 июня 2026 15:10',
        content: 'Отличный подход! Я тоже использую похожую методику. Особенно помогает при решении задач на качественный и количественный анализ. Спасибо, что поделились!'
      },
      {
        author: 'Сидоров К. Н.',
        date: '15 июня 2026 16:45',
        content: 'А как быть с реакциями, которые идут в несколько стадий? У меня часто возникают трудности с определением промежуточных продуктов.'
      },
      {
        author: 'Петров А. С.',
        date: '15 июня 2026 17:20',
        content: 'Хороший вопрос! Для многостадийных реакций я рекомендую записывать каждую стадию отдельно. Определяйте, что происходит на каждом этапе - образование карбкатиона, нуклеофильная атака, депротонирование и т.д.<br><br>Также полезно рисовать механизмы реакций с использованием стрелок, показывающих движение электронов. Это помогает визуализировать процесс и понять, какие продукты образуются на каждой стадии.'
      }
    ]
  },
  2: {
    title: 'Обсуждение нового учебного плана на 2026-2027 год',
    messages: [
      {
        author: 'Иванова М. В.',
        date: '14 июня 2026 10:15',
        content: 'Коллеги, давайте обсудим изменения в учебном плане на следующий учебный год. Появились новые дисциплины, изменилось количество часов по некоторым предметам.<br><br>Особенно хочу отметить, что теперь больше времени уделяется практическим занятиям по клиническим дисциплинам. Это отличная новость для студентов, которые хотят получить больше практического опыта.<br><br>Какие у вас мысли по этому поводу?'
      },
      {
        author: 'Смирнов Д. А.',
        date: '14 июня 2026 11:30',
        content: 'Я полностью поддерживаю увеличение практических занятий. Теоретические знания важны, но без практики они малоэффективны. Также радует, что добавили курс по медицинской информатике - это очень актуально в наше время.'
      },
      {
        author: 'Козлова Е. Д.',
        date: '14 июня 2026 13:20',
        content: 'А мне кажется, что слишком сократили часы по фармакологии. Это фундаментальная дисциплина, и без хорошего знания лекарственных средств сложно будет работать врачом.'
      },
      {
        author: 'Иванова М. В.',
        date: '14 июня 2026 14:45',
        content: 'Согласна насчет фармакологии. Может быть, стоит написать коллективное обращение к деканату с предложением пересмотреть распределение часов? Уверена, что нас поддержат другие студенты.'
      }
    ]
  },
  3: {
    title: 'Советы по подготовке к олимпиаде по биологии',
    messages: [
      {
        author: 'Сидоров К. Н.',
        date: '13 июня 2026 16:45',
        content: 'Подготовка к олимпиаде требует системного подхода. Я участвовал в нескольких олимпиадах и хочу поделиться своим опытом.<br><br>Первое - нужно изучить формат заданий прошлых лет. Это поможет понять, на какие темы делать акцент. Второе - регулярно решать тестовые задания, чтобы натренировать скорость.<br><br>Также очень важно углубленно изучать темы, которые выходят за рамки школьной программы. Олимпиадные задания часто требуют знаний на уровне первого курса университета.<br><br>Поделитесь, кто как готовится? Может быть, есть какие-то интересные методики?'
      },
      {
        author: 'Морозов И. П.',
        date: '13 июня 2026 18:00',
        content: 'Я бы посоветовал решать задания не только по биологии, но и по смежным дисциплинам - химии и физике. На олимпиадах часто встречаются междисциплинарные вопросы. Также полезно участвовать в онлайн-олимпиадах для тренировки.'
      },
      {
        author: 'Сидоров К. Н.',
        date: '13 июня 2026 19:30',
        content: 'Отличный совет! Действительно, междисциплинарный подход очень важен. Также рекомендую вести конспект всех сложных вопросов, которые встречаются в процессе подготовки, и периодически его пересматривать.'
      }
    ]
  },
  4: {
    title: 'Вопросы по анатомии человека',
    messages: [
      {
        author: 'Козлова Е. Д.',
        date: '12 июня 2026 09:00',
        content: 'Здравствуйте! У меня возникли вопросы по строению опорно-двигательной системы. Может кто-то сможет помочь с разбором сложных тем?<br><br>Особенно меня интересует архитектоника костей и их соединений. В учебнике много терминов, и я хотела бы понять это на практических примерах.'
      },
      {
        author: 'Новиков А. Р.',
        date: '12 июня 2026 10:30',
        content: 'Могу порекомендовать атлас анатомии с 3D-моделями. Это очень помогает визуализировать строение костей и суставов. Также полезно смотреть видео-лекции, где подробно разбирают каждую тему.'
      },
      {
        author: 'Козлова Е. Д.',
        date: '12 июня 2026 12:15',
        content: 'Спасибо за рекомендацию! А какой именно атлас вы бы посоветовали? Их сейчас много, и хочется выбрать самый информативный.'
      },
      {
        author: 'Новиков А. Р.',
        date: '12 июня 2026 13:40',
        content: 'Я использую атлас Неттера - он очень подробный и наглядный. Также есть хорошие приложения для смартфонов, где можно вращать 3D-модели и изучать строение в разных проекциях.'
      }
    ]
  },
  5: {
    title: 'Лучшие ресурсы для изучения медицинской латыни',
    messages: [
      {
        author: 'Михайлов И. Р.',
        date: '11 июня 2026 11:20',
        content: 'Хочу собрать список полезных материалов для изучения латинского языка. Поделитесь, кто чем пользовался и что действительно помогло выучить терминологию.<br><br>Я начал с учебника, но чувствую, что нужен дополнительный материал для закрепления.'
      },
      {
        author: 'Григорьева С. В.',
        date: '11 июня 2026 12:40',
        content: 'Мне очень помогли карточки с терминами - я делала их самостоятельно и повторяла каждый день. Также есть хорошие онлайн-курсы, где можно тренироваться в произношении и написании.'
      },
      {
        author: 'Михайлов И. Р.',
        date: '11 июня 2026 14:00',
        content: 'Спасибо за совет про карточки! А не подскажете, какие онлайн-курсы вы бы рекомендовали?'
      },
      {
        author: 'Григорьева С. В.',
        date: '11 июня 2026 15:30',
        content: 'Я проходила курс на платформе Coursera "Medical Terminology" - он полностью на латыни с переводами. Очень помогает освоить медицинскую терминологию в контексте.'
      }
    ]
  },
  6: {
    title: 'Организация практических занятий по хирургии',
    messages: [
      {
        author: 'Алексеев Д. В.',
        date: '10 июня 2026 13:40',
        content: 'Уважаемые преподаватели и студенты! Предлагаю обсудить организацию практических занятий по хирургии. Какие методы обучения вы считаете наиболее эффективными?<br><br>Лично мне очень помогают симуляционные тренинги, где можно отрабатывать навыки на манекенах перед операциями на пациентах.'
      },
      {
        author: 'Белова Е. Н.',
        date: '10 июня 2026 15:10',
        content: 'Я согласна, симуляционные занятия бесценны. Также важно, чтобы во время практики студенты могли наблюдать за опытными хирургами и задавать вопросы. Это позволяет понимать нюансы, которые не описаны в учебниках.'
      },
      {
        author: 'Медведев С. Л.',
        date: '10 июня 2026 17:00',
        content: 'Хорошо бы еще организовать еженедельные разборы сложных клинических случаев. Это развивает клиническое мышление и помогает применять теоретические знания на практике.'
      },
      {
        author: 'Алексеев Д. В.',
        date: '10 июня 2026 18:30',
        content: 'Отличная идея насчет разборов случаев! Может быть, создадим группу в соцсетях, где будем обсуждать такие случаи и делиться опытом? Это было бы очень полезно для всех студентов.'
      }
    ]
  }
}

// Текущая тема
const topic = topicsData[topicId] || topicsData[1]
const messages = topic.messages

// Состояние редактора
const showAnswerForm = ref(false)
const answerText = ref('')
const charCount = ref(0)

// Форматы
const formats = ref({
  bold: false,
  italic: false,
  underline: false,
  strike: false
})
const align = ref('left')
const fontFamily = ref('default')
const fontSize = ref('default')
const textColor = ref('#000000')
const bgColor = ref('#ffffff')

const getInitials = (name) => {
  if (!name) return '?'
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

const getCurrentUserInitials = () => {
  if (!authStore.user) return '?'
  const user = authStore.user
  return ((user.lastName ? user.lastName[0] : '') + (user.firstName ? user.firstName[0] : '')).toUpperCase()
}

const getCurrentUserName = () => {
  if (!authStore.user) return 'Гость'
  const user = authStore.user
  return user.lastName + ' ' + user.firstName
}

const applyFormat = (format) => {
  const editor = editorRef.value
  if (!editor) return

  formats.value[format] = !formats.value[format]
  
  if (format === 'strike') {
    document.execCommand('strikeThrough', false, null)
  } else {
    document.execCommand(format, false, null)
  }
  editor.focus()
}

const setAlign = (alignment) => {
  align.value = alignment
  const command = 'justify' + alignment.charAt(0).toUpperCase() + alignment.slice(1)
  document.execCommand(command, false, null)
}

const applyFont = () => {
  if (fontFamily.value !== 'default') {
    document.execCommand('fontName', false, fontFamily.value)
  }
}

const applySize = () => {
  if (fontSize.value !== 'default') {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const span = document.createElement('span')
      span.style.fontSize = fontSize.value
      try {
        range.surroundContents(span)
      } catch (e) {
        const text = range.toString()
        range.deleteContents()
        span.textContent = text
        range.insertNode(span)
      }
    }
  }
}

const applyColor = () => {
  document.execCommand('foreColor', false, textColor.value)
}

const applyBgColor = () => {
  document.execCommand('backColor', false, bgColor.value)
}

const insertQuote = (type) => {
  const editor = editorRef.value
  if (!editor) return

  let quotes = ''
  switch(type) {
    case 'laquo':
      quotes = '\u00AB\u00BB'
      break
    case 'quot':
      quotes = '\u0022\u0022'
      break
    case 'bdquo':
      quotes = '\u201E\u201C'
      break
    default:
      quotes = '""'
  }

  const selection = window.getSelection()
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0)
    const text = range.toString()
    
    range.deleteContents()
    
    const textNode = document.createTextNode(quotes[0] + text + quotes[1])
    range.insertNode(textNode)
    
    range.setStartAfter(textNode)
    range.collapse(true)
    selection.removeAllRanges()
    selection.addRange(range)
    
    editor.focus()
    updateContent()
  } else {
    const textNode = document.createTextNode(quotes)
    const range = document.createRange()
    range.setStart(editor, editor.childNodes.length)
    range.insertNode(textNode)
    range.setStartAfter(textNode)
    range.collapse(true)
    selection.removeAllRanges()
    selection.addRange(range)
    editor.focus()
    updateContent()
  }
}

const insertList = (type) => {
  const command = type === 'ul' ? 'insertUnorderedList' : 'insertOrderedList'
  document.execCommand(command, false, null)
}

const handleKeydown = (e) => {
  if (e.key === 'Enter') {
    document.execCommand('insertLineBreak', false, null)
    e.preventDefault()
  }
}

const updateContent = () => {
  const editor = editorRef.value
  if (editor) {
    answerText.value = editor.innerHTML
    charCount.value = editor.textContent.length
  }
}

const closeEditor = () => {
  showAnswerForm.value = false
  answerText.value = ''
  charCount.value = 0
  if (editorRef.value) {
    editorRef.value.innerHTML = ''
  }
}

const submitAnswer = () => {
  if (!answerText.value.trim() || answerText.value === '<br>') {
    alert('Введите текст ответа')
    return
  }
  
  const user = authStore.user
  const authorName = user ? (user.lastName + ' ' + user.firstName) : 'Пользователь'
  const now = new Date()
  const dateStr = now.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) + ' ' + 
                  now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  
  messages.push({
    author: authorName,
    date: dateStr,
    content: answerText.value
  })
  
  closeEditor()
}

onMounted(() => {
  nextTick(() => {
    if (editorRef.value) {
      editorRef.value.focus()
    }
  })
})

useHead({
  title: topic.title + ' - Medical School'
})
</script>

<style scoped>
[contenteditable="true"]:empty:before {
  content: attr(placeholder);
  color: #9ca3af;
  pointer-events: none;
}

[contenteditable="true"]:focus:empty:before {
  content: '';
}

[contenteditable="true"]:focus {
  outline: none;
}

/* Перенос слов в редакторе и сообщениях */
.break-words {
  word-break: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
}

.overflow-wrap-break-word {
  overflow-wrap: break-word !important;
}
</style>