import React, { forwardRef } from 'react'
import SingleLine from '@databyss-org/editor/components/SingleLine'

const RichTextInput = forwardRef(
  ({ value, onChange, id, concatCss, onBlur, multiline }, ref) => {
    const _onBlur = event => {
      onBlur(event)
      //  setTimeout(() => editor.blur(), 50)
    }

    const _css = [
      {
        display: 'flex',
        overflow: 'scroll',
        ...(!multiline ? { '::-webkit-scrollbar': { display: 'none' } } : {}),
      },
    ].concat(concatCss)

    return (
      <SingleLine
        onBlur={_onBlur}
        multiline={multiline}
        onChange={onChange}
        initialValue={value}
        id={id}
        overrideCss={_css}
        name="RichTextInput"
        ref={ref}
      />
    )
  }
)

RichTextInput.defaultProps = {
  variant: 'uiTextSmall',
  value: { textValue: '', ranges: [] },
  onChange: () => null,
  onNativeDocumentChange: () => null,
  onBlur: () => null,
  onFocus: () => null,
}

export default RichTextInput
