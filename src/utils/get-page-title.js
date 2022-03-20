
import defaultSettings from '@/settings'

const title = defaultSettings.title || '乔顿品牌外协'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
