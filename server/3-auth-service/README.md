# Authentication Microservice

* The authentication microservice is responsible for creating users.
* A user that creates an account automatically becomes a buyer in the application.
* When a user successfully creates an account, different event gets published from the `authentication service` to the `notification service` to send e-mail like`verify-email`,`forgot-password`,`reset-password`, `verification` etc to the user.

## Architecture
<img width="1326" alt="Screenshot 2024-03-29 at 10 17 18 PM" src="https://github.com/sachinSingh53/auth-microservice/assets/96944676/5fd12ba5-fa96-455e-a126-ccb5ec498113">
