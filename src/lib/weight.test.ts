import { parseKg, validateKg, weightProgress, isLargeChange } from './weight'

const w = (start: number, current: number, goal: number) => ({ start, current, goal, updatedAt: '' })

describe('meta de peso', () => {
  it('lê pesos com vírgula ou ponto', () => {
    expect(parseKg('72,5')).toBe(72.5)
    expect(parseKg('72.54')).toBe(72.5)
    expect(parseKg('abc')).toBeNull()
    expect(parseKg('')).toBeNull()
  })

  it('valida limites', () => {
    expect(validateKg(null)).toBeTruthy()
    expect(validateKg(10)).toBeTruthy()
    expect(validateKg(70)).toBeNull()
  })

  it('calcula progresso para perder e ganhar', () => {
    expect(weightProgress(w(80, 75, 70))).toMatchObject({ progress: 0.5, remaining: 5, reached: false, direction: 'perder' })
    expect(weightProgress(w(60, 63, 66))).toMatchObject({ progress: 0.5, remaining: 3, direction: 'ganhar' })
    expect(weightProgress(w(80, 69, 70))).toMatchObject({ progress: 1, remaining: 0, reached: true })
    expect(weightProgress(w(80, 82, 70)).progress).toBe(0)
  })

  it('sinaliza metas muito distantes', () => {
    expect(isLargeChange(100, 75)).toBe(true)
    expect(isLargeChange(80, 72)).toBe(false)
  })
})
