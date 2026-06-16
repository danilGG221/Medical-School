<template>
  <aside class="w-64 min-h-screen p-3 flex flex-col gap-3 bg-transparent">
    <!-- Logo -->
    <div class="bg-[#4da882] text-white p-4 rounded-lg flex items-center gap-3">
      <img src="/images/logo-icon.png" alt="Medical School Logo" class="w-8 h-8" />
      <h1 class="font-bold text-lg">Medical School</h1>
    </div>

    <!-- Profile Card -->
    <ProfileCard />

    <!-- Navigation Menus -->
    <NavigationMenu 
      title="Информация"
      :items="['О школе', 'Правила', 'Форум', 'Олимпиады']"
    />

    <NavigationMenu 
      title="Задачник"
      :items="['Архив задач', 'Состояние системы', 'Рейтинг', 'Курсы']"
    />

    <NavigationMenu 
      title="Методичка"
      :items="['Новичкам', 'Статьи', 'Ссылки', 'Работа в системе']"
    />
  </aside>
</template>