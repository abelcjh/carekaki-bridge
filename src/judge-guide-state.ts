export const judgeGuideStorageKey = 'reliefkaki-judge-guide-dismissed'
export const expoGoDeepLink = 'exp://u.expo.dev/640b1e39-9017-489b-9397-15d9f1296931?runtime-version=exposdk%3A54.0.0&channel-name=judging'

export function shouldShowJudgeGuide(storedValue: string | null) {
  return storedValue !== '1'
}

export function getFooterAwareGuideBottom(viewportHeight: number, footerTop: number, gap: number) {
  return Math.max(gap, viewportHeight - footerTop + gap)
}
