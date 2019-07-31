import theme from '@databyss-org/ui/theming/theme'
import {
  typography,
  color,
  space,
  compose,
  border,
  variant,
} from 'styled-system'

const { colors } = theme

const textSize = variant({
  prop: 'textSize',
  scale: 'textSizes',
})

export default compose(
  typography,
  color,
  space,
  border,
  textSize
)

export const defaultProps = {
  marginBottom: 3,
  borderRadius: 6,
  borderWidth: 2,
  textSize: 'normal',
}

export const themes = {
  primary: {
    primary: colors.blues[1],
    hover: colors.blues[2],
    pressed: colors.blues[0],
    borderColor: colors.blues[2],
    fontColor: colors.white,
  },
  secondary: {
    primary: colors.white,
    hover: colors.greys[6],
    pressed: colors.greys[5],
    borderColor: colors.black,
    fontColor: colors.black,
  },
  external: {
    primary: colors.browns[2],
    hover: colors.browns[1],
    pressed: colors.browns[0],
    borderColor: colors.oranges[0],
    fontColor: colors.oranges[0],
  },
  link: {
    primary: colors.clear,
    hover: colors.greys[6],
    pressed: colors.browns[5],
    borderColor: colors.clear,
    fontColor: colors.blues[1],
  },
}