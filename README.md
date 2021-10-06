# MedCool Appointments

Application developed during the 6th semester of IFSP on the subject of Web development

## How to setup the project

- Clone project from github

- Install docker and docker-compose following the official docker docs

- Run the following commands:
  `docker run --name postgres -e POSTGRES_PASSWORD=123 -p 5432:5432 -d postgres`

- Access the container and create the `medcool` database

- duplicate the `.env.example` file in the project root folder and rename the duplicated one to `.env`

- run `yarn` to install the projects dependencies

- run `yarn start` to start the development server

## Migrations

- To create migrations:
  `yarn sequelize migration:create --name=migration-name-here`

- To run migrations:
  `yarn sequelize db:migrate`

- To undo migrations:
  `yarn sequelize db:migrate:undo` or `yarn sequelize db:migrate:undo:all`
