'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.resource('sessions', 'SessionController')
  .only(['store'])
  .validator(new Map([[['sessions.store'], ['StoreSession']]]))

Route.resource('users', 'UserController')
  .only(['store', 'update'])
  .middleware(new Map([[['users.update'], ['auth']]]))
  .validator(
    new Map([
      [['users.store'], ['StoreUser']],
      [['users.update'], ['UpdateUser']]
    ])
  )

Route.group(() => {
  Route.resource('events', 'EventController')
    .apiOnly()
    .validator([
      [['events.store'], ['StoreEvent']],
      [['events.update'], ['UpdateEvent']]
    ])

  Route.resource('events.share', 'ShareController')
    .only(['store'])
    .validator([[['events.share.store'], ['Share']]])
}).middleware(['auth'])
