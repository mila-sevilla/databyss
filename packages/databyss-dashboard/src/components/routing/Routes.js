import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Register from '../auth/Register'
import Login from '../auth/Login'
import Alert from '../layout/Alert'
import Dashboard from '../dashboard/Dashboard'
import CreateProfile from '../profile-forms/CreateProfile'
import EditProfile from '../profile-forms/EditProfile'

import Profiles from '../profiles/Profiles'

import Profile from '../profile/Profile'

import Entries from '../entries/Entries'
import Entry from '../entries/Entry'

import Authors from '../authors/Authors'
import Author from '../authors/Author'

import Sources from '../sources/Sources'
import Source from '../sources/Source'

import NotFound from '../layout/NotFound'
import PrivateRoute from '../routing/PrivateRoute'

const Routes = () => {
  return (
    <section className='container'>
      <Alert />
      <Switch>
        <Route exact path='/register' component={Register} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/profiles' component={Profiles} />
        <Route exact path='/profile/:id' component={Profile} />
        <PrivateRoute exact path='/dashboard' component={Dashboard} />
        <PrivateRoute exact path='/create-profile' component={CreateProfile} />
        <PrivateRoute exact path='/edit-profile' component={EditProfile} />

        <PrivateRoute exact path='/entries' component={Entries} />

        <PrivateRoute exact path='/entries/:id' component={Entry} />

        <PrivateRoute exact path='/authors' component={Authors} />
        <PrivateRoute exact path='/authors/:id' component={Author} />
        <PrivateRoute exact path='/sources' component={Sources} />
        <PrivateRoute exact path='/sources/:id' component={Source} />

        <Route component={NotFound} />
      </Switch>
    </section>
  )
}

export default Routes
