import { planStatus, span, formatDuration } from './plan'

const plan = { wake: '07:00', firstMeal: '12:00', lastMeal: '20:00', sleep: '23:00' }
const at = (h: number, m = 0) => new Date(2026, 0, 1, h, m)

describe('plan', () => {
  it('calcula duração atravessando a meia-noite', () => {
    expect(span('12:00', '20:00')).toBe(480)
    expect(span('20:00', '12:00')).toBe(960)
  })

  it('identifica período de alimentação', () => {
    const s = planStatus(plan, at(13))
    expect(s.eating).toBe(true)
    expect(s.minutesToChange).toBe(7 * 60)
    expect(s.eatingMinutes).toBe(480)
    expect(s.fastingMinutes).toBe(960)
  })

  it('identifica período sem alimentação antes e depois da meia-noite', () => {
    expect(planStatus(plan, at(22)).eating).toBe(false)
    expect(planStatus(plan, at(22)).minutesToChange).toBe(14 * 60)
    expect(planStatus(plan, at(8, 30)).minutesToChange).toBe(210)
  })

  it('formata durações', () => {
    expect(formatDuration(45)).toBe('45 min')
    expect(formatDuration(120)).toBe('2h')
    expect(formatDuration(125)).toBe('2h 05min')
  })
})
