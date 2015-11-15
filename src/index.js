/* @flow */

import Rx from 'rx'
import R from 'ramda'
import { run } from '@cycle/core'
import { makeDOMDriver } from '@cycle/dom'
import { makeHistoryDriver } from '@cycle/history'
import { makeFetchDriver } from '@cycle/fetch'

import tags from './helpers/dom_helpers'
import { getJSON } from './helpers/fetch'

const { div, button } = tags;

function main({ DOM, HTTP, History }) {
  const users = `https://api.github.com/users`;

  const requests$ = Rx.Observable.just({
    url: users,
  });

  const refresh$ = DOM.select(`.refresh`).events(`click`)

  const dom$ = getJSON({ url: users }, HTTP)
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
