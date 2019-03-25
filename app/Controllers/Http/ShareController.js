'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/auth/src/Schemes/Session')} AuthSession */

const kue = use('Kue')
const shareJob = use('App/Jobs/Share')
const Event = use('App/Models/Event')

const moment = require('moment')

class ShareController {
  /**
   * Create/save a new share.
   * POST token
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {AuthSession} ctx.auth
   */
  async store ({ params, request, response, auth }) {
    const { email } = request.all()
    const sessionUser = await auth.getUser()

    const event = await Event.findOrFail(params.events_id)

    if (event.user_id !== sessionUser.id || moment().isAfter(event.when)) {
      return response.status(401).send()
    }

    const data = {
      email,
      title: event.title,
      where: event.where,
      when: event.when
    }

    kue.dispatch(shareJob.key, data, { attempts: 1 })
  }
}

module.exports = ShareController
