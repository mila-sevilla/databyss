import React, { useState, useRef, useEffect } from 'react'
import Color from 'color'
import { keyframes } from '@emotion/core'
import { View } from '../../'
import { isMobileOs } from '../../../lib/mediaQuery'
import theme from '../../../theming/theme'

const decay = keyframes({
  '0%': {
    opacity: 0.8,
  },
  '100%': {
    opacity: 0,
  },
})

const controlCssDesktop = props => ({
  cursor: 'pointer',
  transition: `background-color ${theme.timing.flash}ms ${theme.timing.ease}`,
  '&:hover': {
    backgroundColor: props.hoverColor,
  },
  '&:active': {
    backgroundColor: props.activeColor,
  },
})

const _pseudomaskCss = () => ({
  content: '""',
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  opacity: 0,
})

const controlCss = props => ({
  position: 'relative',
  '&:after': {
    ..._pseudomaskCss(props),
    backgroundColor: props.rippleColor,
    zIndex: 1,
  },
})

const animatingCss = {
  '&:after': {
    animation: `${decay} ${theme.timing.touchDecay}ms ${theme.timing.ease}`,
  },
}

const Styled = View

export const ControlNoFeedback = ({ children, ...others }) => (
  <Styled {...others}>{children}</Styled>
)

const Control = ({ disabled, children, onPress, ...others }) => {
  const [decay, setDecay] = useState(false)
  const [resetDecay, setResetDecay] = useState(false)
  const decayTimerRef = useRef(null)
  const startDecayAnimation = () => {
    decayTimerRef.current = setTimeout(
      () => setDecay(false),
      theme.timing.touchDecay
    )
    setDecay(true)
  }
  useEffect(
    () => {
      if (resetDecay) {
        startDecayAnimation()
        setResetDecay(false)
      }
    },
    [resetDecay]
  )
  return (
    <Styled
      onClick={e => {
        if (disabled) {
          return
        }
        if (onPress) {
          onPress(e)
        }
        if (!isMobileOs()) {
          return
        }
        if (decay) {
          clearTimeout(decayTimerRef.current)
          setDecay(false)
          setResetDecay(true)
        } else {
          startDecayAnimation()
        }
      }}
      css={[
        !disabled && controlCss(others),
        !disabled && !isMobileOs() && controlCssDesktop(others),
        !disabled && isMobileOs() && decay && animatingCss,
      ]}
      {...others}
    >
      {children}
    </Styled>
  )
}

Control.defaultProps = {
  rippleColor: Color(theme.colors.gray[3])
    .alpha(0.5)
    .rgb()
    .string(),
  hoverColor: theme.colors.gray[6],
  activeColor: theme.colors.gray[4],
  borderRadius: theme.borderRadius,
}

export default Control
