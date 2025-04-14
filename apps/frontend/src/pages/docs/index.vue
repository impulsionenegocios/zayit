<template>
    <section class="flex h-screen bg-surface min-h-screen">
      <aside class="w-64 p-6 border-r border-white/10 bg-zinc-900 space-y-4">
        <h2 class="text-xl font-semibold">📚 Component Docs</h2>
        <ul class="space-y-2 text-sm">
          <li><RouterLink to="/docs/upload" class="hover:text-zayit-blue">Upload de Arquivos</RouterLink></li>
          <li><RouterLink to="/docs/inputs" class="hover:text-zayit-blue">Inputs e Selects</RouterLink></li>
          <li><RouterLink to="/docs/layout" class="hover:text-zayit-blue">Grid e FormControl</RouterLink></li>
        </ul>
      </aside>
      <main class="flex-1 overflow-y-auto">
        <RouterView />
      </main>
    </section>
  </template>