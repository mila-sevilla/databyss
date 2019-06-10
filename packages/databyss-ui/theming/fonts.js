import { Platform } from 'react-native'

export const EM = 17

export const serif = Platform.select({
  ios: 'Baskerville',
  android: 'serif',
  default: 'Baskerville, serif',
})

export const sans = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: '-apple-system, sans-serif',
})

export const mono = Platform.select({
  ios: '"American Typewriter"',
  android: 'monospace',
  default: 'SFMono-Regular,Consolas,Liberation Mono,Menlo,Courier,monospace',
})

const units = Platform.select({
  ios: v => v,
  android: v => v,
  default: v => `${v}px`,
})

const fonts = {
  sans,
  serif,
  mono,
}

fonts.headingFont = fonts.serif
fonts.bodyFont = fonts.serif
fonts.navFont = fonts.sans

const fontWeights = [400, 600, 700]
fontWeights.bold = fontWeights[2]
fontWeights.semiBold = fontWeights[1]
fontWeights.regular = fontWeights[0]

const fontSizes = [EM, 0.7 * EM, 0.85 * EM, 1.2 * EM, 1.8 * EM]
fontSizes.normal = fontSizes[0]
fontSizes.extraSmall = fontSizes[1]
fontSizes.small = fontSizes[2]
fontSizes.large = fontSizes[3]
fontSizes.extraLarge = fontSizes[4]

const lineHeights = [EM, EM * 1.25, EM * 1.5, EM * 2, EM * 3]
lineHeights.tight = units(lineHeights[0])
lineHeights.normal = units(lineHeights[1])
lineHeights.large = units(lineHeights[2])
lineHeights.extraLarge = units(lineHeights[3])

/* combines fontSize and lineHeight */
const textSizes = {
  normal: {
    fontSize: fontSizes.normal,
    lineHeight: lineHeights.normal,
  },
  small: {
    fontSize: fontSizes.small,
    lineHeight: lineHeights.tight,
  },
  large: {
    fontSize: fontSizes.large,
    lineHeight: lineHeights.large,
  },
  extraLarge: {
    fontSize: fontSizes.extraLarge,
    lineHeight: lineHeights.extraLarge,
  },
  extraSmall: {
    fontSize: fontSizes.extraSmall,
    lineHeight: lineHeights.tight,
  },
}

export default {
  fonts,
  fontSizes,
  fontWeights,
  lineHeights,
  textSizes,
}