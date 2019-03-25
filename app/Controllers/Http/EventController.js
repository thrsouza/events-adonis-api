'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Event = use('App/Models/Event')

const moment = require('moment')

/**
 * Resourceful controller for interacting with events
 */
class EventController {
  /**
   * Show a list of all events.
   * GET events
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {AuthSession} ctx.auth
   */
  async index ({ request, auth }) {
    const { page, date } = request.get()
    const sessionUser = await auth.getUser()

    let query = Event.query()

    if (date) {
      query = query.whereRaw(`"when"::date = ?`, date)
    }

    query = query.where({ user_id: sessionUser.id }).orderBy('when', 'desc')

    const events = await query.paginate(page)

    return events
  }

  /**
   * Create/save a new event.
   * POST events
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {AuthSession} ctx.auth
   */
  async store ({ request, response, auth }) {
    const data = request.only(['title', 'where', 'when'])
    const sessionUser = await auth.getUser()

    const exists = await Event.query()
      .where({
        user_id: sessionUser.id,
        when: data.when
      })
      .first()

    if (exists) {
      return response.status(401).send()
    }

    const event = await Event.create({
      user_id: sessionUser.id,
      ...data
    })

    return event
  }

  /**
   * Display a single event.
   * GET events/:id
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   * @param {AuthSession} ctx.auth
   */
  async show ({ params, response, auth }) {
    const sessionUser = await auth.getUser()

    const event = await Event.findOrFail(params.id)

    if (event.user_id !== sessionUser.id) {
      return response.status(401).send()
    }

    await event.load('user')

    return event
  }

  /**
   * Update event details.
   * PUT or PATCH events/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {AuthSession} ctx.auth
   */
  async update ({ params, request, response, auth }) {
    const data = request.only(['title', 'where', 'when'])
    const sessionUser = await auth.getUser()

    const exists = await Event.query()
      .where('id', '<>', params.id)
      .where({
        user_id: sessionUser.id,
        when: data.when
      })
      .first()

    if (exists) {
      return response.status(401).send()
    }

    const event = await Event.findOrFail(params.id)

    if (event.user_id !== sessionUser.id || moment().isAfter(event.when)) {
      return response.status(401).send()
    }

    event.merge(data)
    await event.save()
  }

  /**
   * Delete a event with id.
   * DELETE events/:id
   *
   * @param {object} ctx
   * @param {Response} ctx.response
   * @param {AuthSession} ctx.auth
   */
  async destroy ({ params, response, auth }) {
    const sessionUser = await auth.getUser()

    const event = await Event.findOrFail(params.id)

    if (event.user_id !== sessionUser.id || moment().isAfter(event.when)) {
      return response.status(401).send()
    }

    event.delete()
  }
}

module.exports = EventController
