# API Gateway Microservice
* The gateway microservice is responsible for managing requests that comes from the frontend.
* Every request that comes from the frontend must pass through the `API Gateway Service`.
* The communication style used in the service is the `Request/Response` pattern.
* The gateway service is also responsible for request validation. It adds the `json web token` to the cookie session and checks if the token in a request is valid.
* All client side errors from other microservices are sent to the gateway service. The gateway service sends these errors to the client.

## Architecture
<img width="1196" alt="Screenshot 2024-03-29 at 7 39 01 PM" src="https://github.com/sachinSingh53/gateway-microservice/assets/96944676/71367560-233e-4d7f-a058-0833cb12a64e">
