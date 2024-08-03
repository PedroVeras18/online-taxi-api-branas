
# Online Taxi API - Branas

This repository is the practical project for an online taxi service from the clean code and clean architecture course run by Rodrigo Branas.

## Stack utilizada

- NodeJS
- NestJS
- Vitest

## Functional requirements

1) Signup.
2) Get account.
3) Request ride.
4) Accept ride.
5) Start ride.
6) Finish ride.
7) Get ride.
8) Get rides.
9) Update position.
10) Process payment.
11) Login.
12) Verify token.
13) Evaluate ride.
14) Update account.
15) Send receipt.
16) Estimate Fare.

## Business Rules

1) Unique Registration by Email.
- Do not allow the creation of multiple accounts with the same email.

2) Open Rides Restriction.
- A passenger cannot request a new ride if they already have an incomplete ride.

3) Ride Acceptance.
- Drivers can only accept rides with the status REQUESTED.
- Drivers cannot accept other rides after accepting one.

4) Ride Lifecycle.
- Rides follow the cycle: REQUESTED -> ACCEPTED -> IN PROGRESS -> COMPLETED.
- Rides can be canceled by passengers or drivers before being completed or canceled.

5) Fare Calculation.
- The fare is calculated based on the distance traveled and the price table depending on the day and time.

6) Payment Processing.
- Payment must be processed after fare calculation.

7) Position Update.
- Position must be updated every minute during the ride.

8) Schedules and Rates.
- Difference in rates based on the time of day and day of the week.

