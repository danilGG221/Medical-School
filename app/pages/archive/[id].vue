<template>
  <div class="flex-1 p-8">
    <div class="max-w-4xl">
      <!-- Кнопка назад -->
      <div class="mb-6">
        <NuxtLink to="/archive" class="inline-block mb-3 px-4 py-2 bg-[#e8f4f0] text-gray-700 rounded-lg hover:bg-[#dceee8] transition text-sm">
          Вернуться
        </NuxtLink>
      </div>

      <!-- Заголовок задачи -->
      <div class="mb-6">
        <h2 class="text-lg font-bold text-gray-800 mb-1">Задача</h2>
        <div class="flex justify-between items-start">
          <h3 class="text-base font-semibold text-gray-700">{{ task.title }}</h3>
          <span class="text-sm text-gray-500">{{ task.date }}</span>
        </div>
      </div>

      <!-- Условие задачи -->
      <div class="mb-6">
        <div class="text-sm text-gray-700 leading-relaxed space-y-4 break-words">
          <p v-for="(paragraph, index) in task.description" :key="index" v-html="paragraph"></p>
        </div>
      </div>

      <!-- Варианты ответов -->
      <div class="mb-8 space-y-3">
        <label 
          v-for="(option, index) in task.options" 
          :key="index"
          class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition"
        >
          <input 
            type="radio" 
            :name="'option-' + task.id"
            :value="index"
            v-model="selectedOption"
            class="w-4 h-4 text-[#4da882] border-gray-300 focus:ring-[#4da882]"
          />
          <span class="text-sm text-gray-700">{{ option }}</span>
        </label>
      </div>

      <!-- Форма ответа (редактор) -->
      <div class="border border-gray-300 rounded-lg overflow-hidden">
        <!-- Панель инструментов редактора -->
        <div class="bg-gray-50 border-b border-gray-200 p-2">
          <div class="flex flex-wrap items-center gap-1">
            <!-- Жирный -->
            <button 
              @click="applyFormat('bold')"
              class="p-2 hover:bg-gray-200 rounded transition"
              :class="{ 'bg-gray-200': formats.bold }"
              title="Жирный"
            >
              <span class="font-bold text-sm">B</span>
            </button>
            
            <!-- Курсив -->
            <button 
              @click="applyFormat('italic')"
              class="p-2 hover:bg-gray-200 rounded transition"
              :class="{ 'bg-gray-200': formats.italic }"
              title="Курсив"
            >
              <span class="italic text-sm">I</span>
            </button>
            
            <!-- Подчеркнутый -->
            <button 
              @click="applyFormat('underline')"
              class="p-2 hover:bg-gray-200 rounded transition"
              :class="{ 'bg-gray-200': formats.underline }"
              title="Подчеркнутый"
            >
              <span class="underline text-sm">U</span>
            </button>
            
            <!-- Зачеркнутый -->
            <button 
              @click="applyFormat('strike')"
              class="p-2 hover:bg-gray-200 rounded transition"
              :class="{ 'bg-gray-200': formats.strike }"
              title="Зачеркнутый"
            >
              <span class="line-through text-sm">S</span>
            </button>

            <div class="w-px h-6 bg-gray-300 mx-2"></div>

            <!-- Выравнивание -->
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

            <!-- Выбор шрифта -->
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

            <!-- Выбор размера -->
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

            <!-- Цвет текста -->
            <input 
              type="color"
              v-model="textColor"
              @change="applyColor"
              class="w-8 h-8 p-0 border-0 cursor-pointer rounded"
              title="Цвет текста"
            >

            <!-- Цвет фона -->
            <input 
              type="color"
              v-model="bgColor"
              @change="applyBgColor"
              class="w-8 h-8 p-0 border-0 cursor-pointer rounded"
              title="Цвет фона"
            >

            <div class="w-px h-6 bg-gray-300 mx-2"></div>

            <!-- Кавычки -->
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

            <!-- Списки -->
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

        <!-- Поле ввода -->
        <div class="p-4">
          <div class="flex gap-3">
            <div class="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center text-gray-600 font-semibold text-sm">
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

        <!-- Кнопка отправки -->
        <div class="bg-gray-50 px-4 py-3 flex justify-end border-t border-gray-200">
          <button 
            @click="submitAnswer"
            class="px-6 py-2 bg-[#4da882] text-white rounded-lg hover:bg-[#5cb894] transition text-sm font-medium"
          >
            Добавить ответ
          </button>
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

// Получаем ID задачи из маршрута
const taskId = parseInt(route.params.id)

// Данные медицинских задач
const tasksData = {
  1: {
    title: 'Диагностика острого аппендицита',
    date: '15 июня 2026 14:30',
    description: [
      'Пациент, 32 года, поступил с жалобами на боли в правой подвздошной области, тошноту, однократную рвоту. Боли начались с эпигастральной области, затем сместились в правую подвздошную. Температура тела 37,8°C.<br><br><b>Вопрос:</b> Какие симптомы характерны для острого аппендицита и какой метод диагностики является наиболее информативным?'
    ],
    options: [
      'Симптом Щеткина-Блюмберга, УЗИ органов брюшной полости',
      'Симптом Пастернацкого, общий анализ мочи',
      'Симптом Кера, ЭКГ',
      'Симптом Ортнера, МРТ печени'
    ]
  },
  2: {
    title: 'Интерпретация ЭКГ при инфаркте миокарда',
    date: '14 июня 2026 10:15',
    description: [
      'Пациент 56 лет доставлен в кардиологическое отделение с жалобами на интенсивные загрудинные боли, иррадиирующие в левую руку, возникшие 2 часа назад.<br><br>На ЭКГ зарегистрировано: подъем сегмента ST в отведениях V1-V4, патологический зубец Q в этих же отведениях.<br><br><b>Вопрос:</b> О какой патологии свидетельствуют данные изменения на ЭКГ?'
    ],
    options: [
      'Передне-перегородочный инфаркт миокарда',
      'Нижний инфаркт миокарда',
      'Боковой инфаркт миокарда',
      'Нарушение ритма'
    ]
  },
  3: {
    title: 'Фармакокинетика антибиотиков',
    date: '13 июня 2026 16:45',
    description: [
      'Врач назначил пациенту с пневмонией антибиотик из группы макролидов - азитромицин. Препарат принимается 1 раз в сутки по 500 мг.<br><br><b>Вопрос:</b> Каков механизм действия макролидов и почему их назначают короткими курсами?'
    ],
    options: [
      'Ингибируют синтез белка, длительный период полувыведения',
      'Разрушают клеточную стенку, короткий период полувыведения',
      'Ингибируют синтез нуклеиновых кислот, накапливаются в тканях',
      'Нарушают функцию цитоплазматической мембраны'
    ]
  },
  4: {
    title: 'Дифференциальная диагностика желтух',
    date: '12 июня 2026 09:00',
    description: [
      'Пациент 45 лет обратился с жалобами на желтушность склер и кожных покровов, потемнение мочи, ахоличный стул. В анамнезе злоупотребление алкоголем.<br><br>Лабораторные данные: общий билирубин 85 мкмоль/л, прямой билирубин 60 мкмоль/л, АЛТ 120 Ед/л, АСТ 90 Ед/л, щелочная фосфатаза в норме.<br><br><b>Вопрос:</b> Какой тип желтухи наиболее вероятен у данного пациента?'
    ],
    options: [
      'Печеночная желтуха',
      'Надпеченочная желтуха',
      'Подпеченочная желтуха',
      'Физиологическая желтуха'
    ]
  },
  5: {
    title: 'Анатомия черепных нервов',
    date: '11 июня 2026 11:20',
    description: [
      'У пациента выявлен паралич мимических мышц правой половины лица, отсутствие вкусовой чувствительности на передних 2/3 правой половины языка, снижение слуха на правое ухо.<br><br><b>Вопрос:</b> Поражение какого черепного нерва может давать подобную симптоматику?'
    ],
    options: [
      'Лицевой нерв (VII пара)',
      'Тройничный нерв (V пара)',
      'Языкоглоточный нерв (IX пара)',
      'Подъязычный нерв (XII пара)'
    ]
  },
  6: {
    title: 'Лечение сахарного диабета 2 типа',
    date: '10 июня 2026 13:40',
    description: [
      'Пациент 52 лет с сахарным диабетом 2 типа (диагностирован 2 года назад) на фоне приема метформина в дозе 1000 мг/сут имеет уровень гликированного гемоглобина 8,5%.<br><br><b>Вопрос:</b> Какой препарат следует добавить к терапии для улучшения контроля гликемии?'
    ],
    options: [
      'Инсулин продленного действия',
      'Ингибитор SGLT-2',
      'Тиазолидиндион',
      'Сульфонилмочевина'
    ]
  }
}

// Текущая задача
const task = tasksData[taskId] || tasksData[1]

// Состояние
const selectedOption = ref(null)
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

// Получение инициалов пользователя
const getCurrentUserInitials = () => {
  if (!authStore.user) return '?'
  const user = authStore.user
  return ((user.lastName ? user.lastName[0] : '') + (user.firstName ? user.firstName[0] : '')).toUpperCase()
}

// Применение форматирования
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

// Выравнивание
const setAlign = (alignment) => {
  align.value = alignment
  const command = 'justify' + alignment.charAt(0).toUpperCase() + alignment.slice(1)
  document.execCommand(command, false, null)
}

// Шрифт
const applyFont = () => {
  if (fontFamily.value !== 'default') {
    document.execCommand('fontName', false, fontFamily.value)
  }
}

// Размер
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

// Цвет текста
const applyColor = () => {
  document.execCommand('foreColor', false, textColor.value)
}

// Цвет фона
const applyBgColor = () => {
  document.execCommand('backColor', false, bgColor.value)
}

// Вставка кавычек
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

// Вставка списка
const insertList = (type) => {
  const command = type === 'ul' ? 'insertUnorderedList' : 'insertOrderedList'
  document.execCommand(command, false, null)
}

// Обработка клавиш
const handleKeydown = (e) => {
  if (e.key === 'Enter') {
    document.execCommand('insertLineBreak', false, null)
    e.preventDefault()
  }
}

// Обновление содержимого
const updateContent = () => {
  const editor = editorRef.value
  if (editor) {
    answerText.value = editor.innerHTML
    charCount.value = editor.textContent.length
  }
}

// Очистка редактора
const clearEditor = () => {
  if (editorRef.value) {
    editorRef.value.innerHTML = ''
  }
  answerText.value = ''
  charCount.value = 0
  selectedOption.value = null
  // Сброс форматов
  formats.value = {
    bold: false,
    italic: false,
    underline: false,
    strike: false
  }
  align.value = 'left'
  fontFamily.value = 'default'
  fontSize.value = 'default'
  textColor.value = '#000000'
  bgColor.value = '#ffffff'
}

// Отправка ответа
const submitAnswer = () => {
  if (!answerText.value.trim() || answerText.value === '<br>') {
    alert('Введите текст ответа')
    return
  }
  
  // Проверка выбранного варианта
  if (selectedOption.value === null) {
    alert('Выберите вариант ответа')
    return
  }
  
  console.log('Выбранный вариант:', selectedOption.value)
  console.log('Текст ответа:', answerText.value)
  
  alert('Ответ отправлен!')
  
  // Очищаем все поля после отправки
  clearEditor()
}

// Инициализация редактора с placeholder
onMounted(() => {
  nextTick(() => {
    if (editorRef.value) {
      editorRef.value.focus()
    }
  })
})

useHead({
  title: task.title + ' - Medical School'
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