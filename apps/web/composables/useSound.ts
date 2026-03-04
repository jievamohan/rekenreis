import type { Ref } from 'vue'

const SFX = {
  correct: '/sfx/correct.wav',
  wrong: '/sfx/wrong.wav',
  celebrate: '/sfx/celebrate.wav',
} as const

const cache: Record<keyof typeof SFX, HTMLAudioElement | null> = {
  correct: null,
  wrong: null,
  celebrate: null,
}

type ProfileApi = { activeProfile: Ref<{ prefs?: { soundOn?: boolean } } | null> }

function getSoundOn(profile: ProfileApi | undefined): boolean {
  const prefs = profile?.activeProfile?.value?.prefs
  return prefs?.soundOn ?? true
}

function playSfx(kind: keyof typeof SFX): void {
  try {
    const src = SFX[kind]
    let audio = cache[kind]
    if (!audio) {
      audio = new Audio(src)
      cache[kind] = audio
    }
    audio.currentTime = 0
    audio.play().catch(() => {
      // Ignore: never block gameplay
    })
  } catch {
    // Ignore: never block gameplay
  }
}

export function useSound(profile?: ProfileApi) {
  function playCorrect(): void {
    if (!getSoundOn(profile)) return
    playSfx('correct')
  }

  function playWrong(): void {
    if (!getSoundOn(profile)) return
    playSfx('wrong')
  }

  function playCelebrate(): void {
    if (!getSoundOn(profile)) return
    playSfx('celebrate')
  }

  return { playCorrect, playWrong, playCelebrate }
}
