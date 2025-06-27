import * as React from 'react'
import { useEffect, useState } from 'react'

interface TypingTextProps {
  text: string
  trigger: boolean
  speed?: number // 每个字显示的间隔，毫秒
  highlightStart?: number // 高亮起始下标
  highlightHref?: string // 高亮部分链接
  highlightClassName?: string // 高亮部分样式
}

const TypingText: React.FC<TypingTextProps> = ({ text, trigger, speed = 100, highlightStart, highlightHref, highlightClassName }) => {
  const [displayedLen, setDisplayedLen] = useState(0)

  useEffect(() => {
    if (!trigger) return
    let i = 0
    setDisplayedLen(0)
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedLen(i + 1)
        i++
      } else {
        clearInterval(interval)
      }
    }, speed)
    return () => clearInterval(interval)
  }, [trigger, text, speed])

  const shown = text.slice(0, displayedLen)
  let normal = shown
  let highlight = ''
  if (highlightStart !== undefined && displayedLen > highlightStart) {
    normal = shown.slice(0, highlightStart)
    highlight = shown.slice(highlightStart)
  }

  return (
    <>
      {normal}
      {highlight && highlightHref ? (
        <a href={highlightHref} className={highlightClassName} target='_blank' rel='noopener noreferrer'>
          {highlight}
        </a>
      ) : (
        highlight
      )}
    </>
  )
}

export default TypingText
