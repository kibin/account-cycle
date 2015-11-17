/* @flow */

import Rx from 'rx'
import R from 'ramda'
import { run } from '@cycle/core'
import { makeDOMDriver } from '@cycle/dom'
import { makeHistoryDriver } from '@cycle/history'
import { makeFetchDriver } from '@cycle/fetch'

import tags from 'helpers/dom'
import { getJSON } from 'helpers/fetch'
import { rand } from 'helpers/common'

const { div, button, span } = tags;

function main({ DOM, HTTP, History }) {
  const users = `https://api.github.com/users`;

  const refresh$ = DOM.select(`.refresh`).events(`click`)

  // const close$ = DOM.select(`.close`).events(`click`)

  const request$ = refresh$
    .startWith(`initial`)
    .map(_ => ({
      url: `${users}?since=${rand(500)}`,
      key: `users`,
    }))

  const response$ = getJSON({ key: `users` }, HTTP)

  // const suggestion$ = close$
  //   .startWith(`initial`)
  //   .combineLatest(response$,
  //     (click, list) => users[rand(users.length)])
  //   .map(val => console.log(val))


  const dom$ = response$
    .startWith(`Loading...`)
    .map(value => {
      console.log(value)
      const ids = R.map(o => o.id, value)
      return div([
        div(`.header`, [
          `Who to follow`,
          button(`.refresh`, `Refresh`),
          button(`.view-all`, `View all`),
        ]),

        div(`.users`, [
          div(`.user`, [
            img(`.user-pic`, { src: `null` }),

            div(`.user-content`, [
              span(`.user-name`, `UserName`),
              span(`.user-nick`, `UserNick`),
              button(`.user-close`, `Close`),
            ]),
          ]),
        ]),
      ]);
    })

  return {
    DOM: dom$,
    HTTP: request$,
  };
}

run(main, {
  DOM: makeDOMDriver(`#content`),
  HTTP: makeFetchDriver(),
  History: makeHistoryDriver(),
});
