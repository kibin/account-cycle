/* @flow */

import Rx from 'rx'
import R from 'ramda'
import { run } from '@cycle/core'
import { makeDOMDriver } from '@cycle/dom'
import { makeHistoryDriver } from '@cycle/history'

function main({ DOM }) {
  return {
    DOM: Rx.Observable.just(0)
      .map(value =>
        <div>
          <div className='sidebar'>
            <a className='sidebar-link' href='/details'>
              Persoonlijke gegevens
            </a>

            <a className='sidebar-link' href='/wishlist'>
              Verlanglijst
            </a>
          </div>
        </div>
      )
  };
}

run(main, {
  DOM: makeDOMDriver(`#content`)
});
