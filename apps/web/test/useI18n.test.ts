import { describe, it, expect } from 'vitest'
import { useI18n } from '../composables/useI18n'

describe('useI18n', () => {
  const { t } = useI18n()

  it('resolves a simple key', () => {
    expect(t('common.next')).toBe('Volgende')
  })

  it('resolves nested keys', () => {
    expect(t('nav.map')).toBe('Kaart')
    expect(t('settings.title')).toBe('Instellingen')
  })

  it('interpolates params', () => {
    expect(t('map.playLevel', { n: 3 })).toBe('Speel level 3')
  })

  it('interpolates multiple params', () => {
    expect(t('problemCard.ariaLabel', { a: 2, b: 3, answer: 5 })).toBe('2 plus 3 is 5')
  })

  it('returns key as fallback for missing key', () => {
    expect(t('does.not.exist')).toBe('does.not.exist')
  })

  it('returns key for partially invalid path', () => {
    expect(t('common.nonexistent.deep')).toBe('common.nonexistent.deep')
  })

  it('returns template unchanged when params are missing', () => {
    expect(t('map.playLevel')).toBe('Speel level {n}')
  })

  it('preserves unmatched placeholders', () => {
    expect(t('map.playLevel', { wrong: 5 })).toBe('Speel level {n}')
  })

  it('handles all top-level sections', () => {
    const sections = [
      'common.close', 'nav.map', 'play.skipToGame', 'map.title',
      'summary.title', 'stickers.title', 'settings.title', 'modes.classic',
      'skins.mathGame', 'levelComplete.ariaLabel', 'mistakesReview.title',
      'keypad.ariaLabel', 'problemCard.ariaLabel', 'hints.dots',
    ]
    for (const key of sections) {
      const result = t(key)
      expect(result).not.toBe(key)
    }
  })
})
