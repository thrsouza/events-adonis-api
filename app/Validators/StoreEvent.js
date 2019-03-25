'use strict'

/** @type {typeof import('@adonisjs/validator/src/Validator')} */
const { rule } = use('Validator')
const Antl = use('Antl')

class StoreEvent {
  get validateAll () {
    return true
  }

  get rules () {
    return {
      // validation rules
      title: 'required',
      where: 'required',
      when: [rule('required'), rule('date_format', 'YYYY-MM-DD HH:mm:ss')]
    }
  }

  get messages () {
    return Antl.list('validation')
  }
}

module.exports = StoreEvent
