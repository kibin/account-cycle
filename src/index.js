/* @flow */
import './index.styl'

import Rx from 'rx'
import R from 'ramda'
import { run } from '@cycle/core'
import { makeDOMDriver } from '@cycle/dom'
import { makeHistoryDriver } from '@cycle/history'
import { makeFetchDriver } from '@cycle/fetch'

import tags from 'helpers/dom'
import { getJSON } from 'helpers/fetch'
import { rand, randVals } from 'helpers/common'
import { loaderWrapper } from 'helpers/loader'

const { div, button, span, img } = tags;

function main({ DOM, HTTP, History }) {
  const users = `https://api.github.com/users`;

  const refresh$ = DOM.select(`.refresh`).events(`click`)

  const response$ = getJSON({ key: `users` }, HTTP)

  const userUrl$ = response$
    .map(users => ({
      url: R.prop(`url`, R.head(users)),
      key: `user`,
    }))
    .startWith(null)

  const request$ = refresh$
    .startWith(`initial`)
    .map(_ => ({
      url: `${users}?since=${rand(500)}`,
      key: `users`,
    }))
    .merge(userUrl$)
    .tap((args) => console.log(args))

  const dom$ = response$
    .startWith(null)
    .map(loaderWrapper(users =>
      div(`.content`, [
        div(`.header`, [
          `Who to follow`,
          ` · `,
          button(`.refresh`, `Refresh`),
          ` · `,
          button(`.view-all`, `View all`),
        ]),

        div(`.users`, [
          (user =>
            div(`.user`, [
              img(`.user-pic`, {
                src: R.prop(`avatar_url`, user)
              }),

              span(`.user-content`, [
                span(`.user-name`, `UserName`),
                span(`.user-nick`, `@usernick`),
                button(`.user-close`, `Ø`),
              ]),
            ])
          )(R.head(users)),
        ]),
      ]),
    ))

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
