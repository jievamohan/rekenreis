<template>
  <div class="home">
    <h1>Welcome!</h1>
    <p class="intro">Ready to practice math? Pick a game and have fun!</p>
    <nav>
      <NuxtLink to="/start" class="nav-link">Check connection</NuxtLink>
      <NuxtLink to="/play" class="nav-link">Play math game</NuxtLink>
    </nav>
  </div>
</template>

<style scoped>
.home {
  padding: 1rem;
  font-family: system-ui, sans-serif;
}
.intro {
  margin: 0.5rem 0 1rem;
  color: #555;
}
.nav-link {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  color: #06c;
}
</style>
