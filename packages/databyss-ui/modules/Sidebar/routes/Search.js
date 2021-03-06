import React, { useState, useEffect } from 'react'
import { EntrySearchLoader } from '@databyss-org/ui/components/Loaders'
import { useNavigationContext } from '@databyss-org/ui/components/Navigation/NavigationProvider/NavigationProvider'
import {
  Text,
  View,
  TextInput,
  BaseControl,
  Grid,
  Icon,
  Separator,
} from '@databyss-org/ui/primitives'
import SearchIcon from '@databyss-org/ui/assets/search.svg'
import CloseSvg from '@databyss-org/ui/assets/close.svg'
import { theme } from '@databyss-org/ui/theming'
import styledCss from '@styled-system/css'

const Search = ({ onClick }) => {
  const { navigate, getSidebarPath } = useNavigationContext()

  const menuItem = getSidebarPath()

  const [value, setValue] = useState({
    textValue: '',
  })

  useEffect(
    () => {
      if (menuItem !== 'search') {
        setValue({ textValue: '' })
      }
    },
    [menuItem]
  )

  const onChange = val => {
    setValue(val)
  }

  const onSearchClick = () => {
    navigate(`/search/${value.textValue}`)
  }

  const clear = () => {
    setValue({ textValue: '' })
  }

  return (
    <View width="100%" px="small" my="small" onClick={onClick}>
      <View
        backgroundColor="background.0"
        height="100%"
        justifyContent="center"
        position="relative"
        flex={1}
        borderVariant="thinLight"
        px="small"
        py="extraSmall"
      >
        <Grid singleRow alignItems="center" columnGap="none" flexWrap="nowrap">
          <Icon sizeVariant="medium" color="text.3" pr="small">
            <SearchIcon />
          </Icon>
          <TextInput
            placeholder="Search"
            variant="bodyNormal"
            color="text.2"
            value={value}
            onChange={onChange}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                onSearchClick()
              }
            }}
            concatCss={styledCss({
              '::placeholder': {
                color: 'text.3',
                opacity: 0.6,
              },
            })(theme)}
          />
          {value.textValue && (
            <View position="absolute" right="small">
              <BaseControl onClick={clear}>
                <Icon sizeVariant="tiny" color="text.3">
                  <CloseSvg />
                </Icon>
              </BaseControl>
            </View>
          )}
        </Grid>
      </View>
      {value.textValue &&
        menuItem === 'search' && (
          <View height="40px" pt="medium" pb="medium">
            <EntrySearchLoader query={value.textValue}>
              {results => (
                <BaseControl onClick={onSearchClick}>
                  <Separator color="border.1" />
                  <View justifyContent="center" p="small" position="relative">
                    <Grid singleRow alignItems="center" p="small">
                      <View>
                        <Grid columnGap="none">
                          <Text variant="uiTextTiny" color="text.2">
                            A
                          </Text>
                          <Text variant="uiTextTinyItalic" color="text.2">
                            a
                          </Text>
                        </Grid>
                      </View>

                      <Text variant="uiTextSmall" color="text.2">
                        {results.count}{' '}
                        {results.count !== 1 ? 'entries' : 'entry'}
                      </Text>
                      <View position="absolute" right="0px">
                        <Text variant="uiTextTiny" color="text.2">
                          ENTER
                        </Text>
                      </View>
                    </Grid>
                  </View>
                  <Separator color="border.1" />
                </BaseControl>
              )}
            </EntrySearchLoader>
          </View>
        )}
    </View>
  )
}

export default Search
