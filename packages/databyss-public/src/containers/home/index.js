import React from 'react'
import { push } from 'connected-react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  Landing,
  LandingEntries,
  LandingSources,
  Link,
  Raw,
  Entries,
  Entry,
  EntriesByLocation,
  EntriesBySource
} from '@databyss-org/ui'
import {
  increment,
  incrementAsync,
  decrement,
  decrementAsync
} from '../../actions/counter'

import { getAuthors } from '../../actions/author'

const cfList = [
  {
    firstName: 'Martin',
    lastName: 'Heidegger',
    id: 'HDG'
  },
  {
    firstName: 'Avital',
    lastName: 'Ronell',
    id: 'RN'
  },
  {
    firstName: 'Søren',
    lastName: 'Kierkegaard',
    id: 'KKGD'
  },
  {
    firstName: 'Saint',
    lastName: 'Augustine',
    id: 'AUG'
  },
  {
    firstName: 'Edmund',
    lastName: 'Husserl',
    id: 'HUSS'
  }
]

const entries = [
  {
    title: 'Spectors of Marx',
    display: 'SPOM',
    locations: [
      {
        raw: 'p. 106',
        entries: [
          {
            content:
              'Derrida less concerned w/ art of Plato [re: <em>mises en abyme</em> of <em>khōra</em> and politics] but in a constraint, a <em>programme</em>, the being-programme of the programme, the being-logical of logic: Plato apprehends them as such, though in a dream, put <em>en abyme</em>'
          }
        ]
      },
      {
        raw: 'p.27',
        entries: [
          {
            starred: true,
            content:
              ' analogy of abyss &amp; bridge over abyss require 3rd term, that which heals the gap, a symbol, bridge is symbol, symbol bridge &gt; abyss calls for analogy (active resource of <em>Critique</em>), <em>mais l’analogie s’abîme sans fin dès lors qu’il faut bien un certain art pour décrire analogiquement le jeu de l’analogie</em>'
          }
        ]
      },
      {
        raw: 'p. 106',
        entries: [
          {
            content:
              'Derrida less concerned w/ art of Plato [re: <em>mises en abyme</em> of <em>khōra</em> and politics] but in a constraint, a <em>programme</em>, the being-programme of the programme, the being-logical of logic: Plato apprehends them as such, though in a dream, put <em>en abyme</em>'
          }
        ]
      },
      {
        raw: 'p.27',
        entries: [
          {
            starred: true,
            content:
              ' analogy of abyss &amp; bridge over abyss require 3rd term, that which heals the gap, a symbol, bridge is symbol, symbol bridge &gt; abyss calls for analogy (active resource of <em>Critique</em>), <em>mais l’analogie s’abîme sans fin dès lors qu’il faut bien un certain art pour décrire analogiquement le jeu de l’analogie</em>'
          }
        ]
      },
      {
        raw: 'p. 106',
        entries: [
          {
            content:
              'Derrida less concerned w/ art of Plato [re: <em>mises en abyme</em> of <em>khōra</em> and politics] but in a constraint, a <em>programme</em>, the being-programme of the programme, the being-logical of logic: Plato apprehends them as such, though in a dream, put <em>en abyme</em>'
          }
        ]
      },
      {
        raw: 'p.27',
        entries: [
          {
            starred: true,
            content:
              ' analogy of abyss &amp; bridge over abyss require 3rd term, that which heals the gap, a symbol, bridge is symbol, symbol bridge &gt; abyss calls for analogy (active resource of <em>Critique</em>), <em>mais l’analogie s’abîme sans fin dès lors qu’il faut bien un certain art pour décrire analogiquement le jeu de l’analogie</em>'
          }
        ]
      }
    ]
  },
  {
    title: 'Cosmopolitanism and Forgiveness',
    display: 'CF',
    locations: [
      {
        raw: 'p. 50',
        entries: [
          {
            content:
              'must forgiveness saturate the abyss (suture, reconcile)? but who could object to imperative of reconciliation? amnesties, work of mourning—political strategy, psycho-therapeutic economy'
          }
        ]
      },
      {
        raw: 'pp. 53-54',
        entries: [
          {
            content:
              'when not insoluble, when I know what to do (program), no decision or responsibility'
          },
          {
            content: 'an abyss remains and must remain'
          }
        ]
      }
    ]
  }
]

const landingProps = {
  cfList,
  title: 'Jacques Derrida on “ABYSS”',
  renderCfItem: cf => (
    <Link key={cf.id} href={`/motif/abyss:${cf.id}`}>
      {cf.lastName}
    </Link>
  )
}

const Home = props => (
  <div>
    {/*
    <h1>Home</h1>
    <p>Count: {props.count}</p>

    <p>
      <button onClick={props.increment}>Increment</button>
      <button onClick={props.incrementAsync} disabled={props.isIncrementing}>
        Increment Async
      </button>
    </p>

    <p>
      <button onClick={props.decrement}>Decrement</button>
      <button onClick={props.decrementAsync} disabled={props.isDecrementing}>
        Decrement Async
      </button>
    </p>

    <p>
      <button onClick={() => props.changePage()}>
        Go to about page via redux
      </button>
    </p>
*/}
    <Landing
      {...landingProps}
      contentTitle="Databyss includes 210 entries of the motif “ABYSS” from 42 sources by Jacques Derrida"
      withToggle>
      <EntriesBySource
        sources={entries}
        renderEntry={entry => <Entry {...entry} />}
      />
    </Landing>
  </div>
)

const mapStateToProps = ({ counter }) => ({
  count: counter.count,
  isIncrementing: counter.isIncrementing,
  isDecrementing: counter.isDecrementing
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      increment,
      incrementAsync,
      decrement,
      decrementAsync,
      changePage: () => push('/about-us')
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)
