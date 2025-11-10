'use client'

import { type CSSProperties, useCallback, useMemo, useState } from 'react'
import type { RecommendedCitationProps } from '@/app/types/locality'

const marginMap = {
  none: 'mt-0',
  small: 'mt-[10px]',
  medium: 'mt-[30px]',
  large: 'mt-[60px]',
}

const marginBottomMap = {
  none: 'mb-0',
  small: 'mb-[10px]',
  medium: 'mb-[30px]',
  large: 'mb-[60px]',
}

export default function RecommendedCitation({ block }: RecommendedCitationProps) {
  const {
    title,
    citation,
    sectionId,
    marginTop = 'none',
    marginBottom = 'none',
    maxWidth,
  } = block

  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle')

  const handleCopy = useCallback(async () => {
    const resetStatus = () =>
      setTimeout(() => {
        setCopyStatus('idle')
      }, 2000)

    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(citation)
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = citation
        textarea.style.position = 'fixed'
        textarea.style.top = '-1000px'
        textarea.style.left = '-1000px'
        document.body.appendChild(textarea)
        textarea.focus()
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      setCopyStatus('copied')
      resetStatus()
    } catch (error) {
      console.error('Failed to copy citation text', error)
      setCopyStatus('error')
      resetStatus()
    }
  }, [citation])

  const marginClasses = useMemo(() => {
    const validTop = marginMap[marginTop as keyof typeof marginMap] || marginMap.none
    const validBottom = marginBottomMap[marginBottom as keyof typeof marginBottomMap] || marginBottomMap.none
    return `${validTop} ${validBottom}`
  }, [marginTop, marginBottom])

  const sectionStyleProps = useMemo<{ style: CSSProperties } | undefined>(() => {
    if (!maxWidth) {
      return undefined
    }

    return {
      style: {
        ['--recommended-citation-max-width' as '--recommended-citation-max-width']: `${maxWidth}px`,
      } as CSSProperties,
    }
  }, [maxWidth])

  return (
    <section
      id={sectionId}
      className={`recommended-citation-wrapper ${marginClasses} flex flex-col gap-6 bg-[#F3F2EC] px-6 py-6 md:px-10 mx-4 md:mx-auto`}
      {...(sectionStyleProps ?? {})}
    >
      <div className="mx-auto flex w-full max-w-[640px] flex-col gap-6 text-center md:text-left">
        <h2 className="recommended-citation-title text-center">
          {title}
        </h2>
        <div className="flex flex-col items-center gap-4 md:flex-row md:items-start md:gap-6">
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy citation text"
            className="flex cursor-pointer flex-col items-center gap-1.5 border-none bg-transparent p-0 text-center outline-none transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E1E1E]"
          >
            <svg
              className="mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="20"
              viewBox="0 0 17 20"
              fill="none"
            >
              <path d="M6 16C5.45 16 4.97917 15.8042 4.5875 15.4125C4.19583 15.0208 4 14.55 4 14V2C4 1.45 4.19583 0.979167 4.5875 0.5875C4.97917 0.195833 5.45 0 6 0H15C15.55 0 16.0208 0.195833 16.4125 0.5875C16.8042 0.979167 17 1.45 17 2V14C17 14.55 16.8042 15.0208 16.4125 15.4125C16.0208 15.8042 15.55 16 15 16H6ZM6 14H15V2H6V14ZM2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V4H2V18H13V20H2Z" fill="#1F1F1F" />
            </svg>
            <span className="recommended-citation-copy-label">
              {copyStatus === 'copied'
                ? 'COPIED!'
                : copyStatus === 'error'
                ? 'TRY AGAIN'
                : 'COPY CITATION'}
            </span>
          </button>
          <p className="recommended-citation-text text-center md:text-left">
            {citation}
          </p>
        </div>
      </div>
    </section>
  )
}

