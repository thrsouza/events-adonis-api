'use strict'

const Env = use('Env')
const Mail = use('Mail')

class Share {
  // If this getter isn't provided, it will default to 1.
  // Increase this number to increase processing concurrency.
  static get concurrency () {
    return 1
  }

  // This is required. This is a unique key used to identify this job.
  static get key () {
    return 'Share-job'
  }

  // This is where the work is done.
  async handle ({ email, title, where, when }) {
    console.log(`JOB: ${Share.key}`)
    console.log({ email, title, where, when })

    await Mail.send(['emails.share_event'], { title, where, when }, message => {
      message
        .to(email)
        .from(
          Env.get('DEFAULT_MAIL_SENDER_EMAIL'),
          Env.get('DEFAULT_MAIL_SENDER_NAME')
        )
        .subject(Env.get('DEFAULT_MAIL_SUBJECT_SHARE'))
    })
  }
}

module.exports = Share
