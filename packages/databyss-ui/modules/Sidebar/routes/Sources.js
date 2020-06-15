import React from 'react'
import SidebarList from '../../../components/Sidebar/SidebarList'

const menuItems = [
  {
    type: 'sources',
    text: 'All Sources',
  },
  {
    type: 'authors',
    text: 'All authors',
  },
]

const Sources = () => <SidebarList menuItems={menuItems} />

export default Sources