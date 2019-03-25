# Events API application - GoNode #4

This project was created along the fourth module of Node with Adonisjs (GoStack - Rocketseat).

1. Bodyparser
2. Authentication
3. CORS
4. Lucid ORM
5. Migrations and seeds
6. Kue (with Redis)

### Migrations

Run the following command to run startup migrations.

```shell
$ adonis migration:run
```

### Start Application

To start application:

```shell
$ adonis serve --dev
$ adonis kue:listen
```

### Route List

| Route                    | Verb(s)   | Handler                 | Middleware          | Name               |
| ------------------------ | --------- | ----------------------- | ------------------- | ------------------ |
| /sessions                | POST      | SessionController.store | av:StoreSession     | sessions.store     |
| /users                   | POST      | UserController.store    | av:StoreUser        | users.store        |
| /users/:id               | PUT,PATCH | UserController.update   | auth,av:UpdateUser  | users.update       |
| /events                  | HEAD,GET  | EventController.index   | auth                | events.index       |
| /events                  | POST      | EventController.store   | auth,av:StoreEvent  | events.store       |
| /events/:id              | HEAD,GET  | EventController.show    | auth                | events.show        |
| /events/:id              | PUT,PATCH | EventController.update  | auth,av:UpdateEvent | events.update      |
| /events/:id              | DELETE    | EventController.destroy | auth                | events.destroy     |
| /events/:events_id/share | POST      | ShareController.store   | auth,av:Share       | events.share.store |

<br />

Best regards,

**Thiago Rodrigues de Souza** \
**e-mail:** email@thiagodesouza.com.br \
**site:** [https://www.thiagodesouza.com.br](https://www.thiagodesouza.com.br)
