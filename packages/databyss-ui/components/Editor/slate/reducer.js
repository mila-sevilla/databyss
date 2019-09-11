import { Point, Range, Block } from 'slate'
import {
  SET_ACTIVE_BLOCK_TYPE,
  SET_ACTIVE_BLOCK_CONTENT,
  INSERT_NEW_ACTIVE_BLOCK,
  SET_BLOCK_TYPE,
  BACKSPACE,
} from '../state/constants'

export const findActiveBlock = value =>
  value.document.getClosestBlock(value.selection.focus.key)

export const findActiveNode = value =>
  value.document.getNode(value.selection.focus.key)

const setActiveBlockType = type => (editor, value, next) => {
  const _activeBlock = findActiveBlock(value)
  if (_activeBlock.type === 'SOURCE') {
    // if previous value is SOURCE and is currently not empty
    // set current block type as ENTRY
    if (
      editor.value.previousBlock.type === 'SOURCE' &&
      editor.value.previousBlock.text
    ) {
      editor.setNodeByKey(editor.value.anchorBlock.key, { type: 'ENTRY' })
    }
    // if active block is SOURCE set node type to SOURCE
    // if previous block text is empty, set previous to ENTRY
    if (!editor.value.previousBlock.text) {
      editor.setNodeByKey(editor.value.previousBlock.key, { type: 'ENTRY' })
    }
  } else {
    editor.setNodeByKey(_activeBlock.key, { type })
    next(editor, value)
  }
}

const setBlockType = (id, type) => (editor, value, next) => {
  if (type === 'SOURCE') {
    const _node = value.document.getNode(id)
    const _text = _node.getFirstText().text
    const _block = Block.fromJSON({
      object: 'block',
      type: 'SOURCE',
      key: _node.key,
      data: {},
      nodes: [
        {
          object: 'text',
          text: '',
          marks: [],
        },
        {
          object: 'inline',
          type: 'SOURCE',
          data: {},
          nodes: [
            {
              object: 'text',
              text: _text,
              marks: [],
            },
          ],
        },
        {
          object: 'text',
          text: '',
          marks: [],
        },
      ],
    })
    editor.replaceNodeByKey(id, _block)
  } else {
    editor.setNodeByKey(id, { type })
  }
  next(editor, value)
}

const backspace = () => (editor, value, next) => {
  // if current block is empty and block type is SOURCE
  // set block type to ENTRY
  const _block = value.anchorBlock
  if (!_block.text && _block.type === 'SOURCE') {
    editor.setNodeByKey(_block.key, { type: 'ENTRY' })
  }
  next(editor, value)
}

export default (editableState, action) => {
  switch (action.type) {
    case SET_ACTIVE_BLOCK_CONTENT: {
      if (!action.payload.html.length) {
        return {
          ...editableState,
          editorCommands: setActiveBlockType('ENTRY'),
        }
      }
      return editableState
    }
    case INSERT_NEW_ACTIVE_BLOCK:
      return { ...editableState, editorCommands: setActiveBlockType('ENTRY') }
    case BACKSPACE:
      const _nextEditorCommands = backspace()

      return {
        ...editableState,
        editorCommands: _nextEditorCommands,
      }

    case SET_BLOCK_TYPE: {
      const _nextEditorCommands = setBlockType(
        action.payload.id,
        action.payload.type
      )
      return {
        ...editableState,
        editorCommands: _nextEditorCommands,
      }
    }
    case SET_ACTIVE_BLOCK_TYPE: {
      const _nextEditorCommands = setActiveBlockType(action.payload.type)
      if (action.payload.fromSymbolInput) {
        return {
          ...editableState,
          editorCommands: (editor, value, next) => {
            const { key } = findActiveNode(value)
            const _start = Point.create({ key, offset: 0 })
            const _end = Point.create({ key, offset: 1 })
            const _range = Range.create({ anchor: _start, focus: _end })
            editor.deleteForwardAtRange(_range)
            _nextEditorCommands(editor, value, next)
          },
        }
      }
      return {
        ...editableState,
        editorCommands: _nextEditorCommands,
      }
    }
    default:
      return editableState
  }
}
