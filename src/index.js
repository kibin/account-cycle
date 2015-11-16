/* @flow */

import Rx from 'rx'
import R from 'ramda'
import { run } from '@cycle/core'
import { makeDOMDriver } from '@cycle/dom'
import { makeHistoryDriver } from '@cycle/history'
import { makeFetchDriver } from '@cycle/fetch'

import tags from './helpers/dom_helpers'
import { getJSON } from './helpers/fetch'
import { rand } from './helpers/common'

const { div, button } = tags;

function main({ DOM, HTTP, History }) {
  const users = `https://api.github.com/users`;

  const refresh$ = DOM.select(`.refresh`).events(`click`)

  const request$ = refresh$
    .startWith(`click`)
    .map(_ => ({
      url: `${users}?since=${rand(500)}`,
      key: `users`,
    }))

  const response$ = getJSON({ key: `users` }, HTTP)

  // const close = DOM.

  const suggestion$ = response$
    .map(users => users[rand(users.length)])

  const dom$ = response$
    .startWith(`Loading...`)
    .map(value => {
      return div([

        R.is(String, value)
          ? value
          : R.map(val => div(JSON.stringify(val)), value)
      ]);
    })

  return {
    DOM: dom$,
    HTTP: requests$,
  };
}

run(main, {
  DOM: makeDOMDriver(`#content`),
  HTTP: makeFetchDriver(),
  History: makeHistoryDriver(),
});
