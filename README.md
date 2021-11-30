<p align="center">
<img src="https://avatars.githubusercontent.com/u/9950313" alt="graphql logo" width="122px" style="border-radius: 10px"/>
<img src="https://avatars.githubusercontent.com/u/12972006" alt="graphql logo" width="122px" style="border-radius: 10px"/>
</p>

<h1 align="center">nodeql</h1>

A GraphQL api using Node.js, Apollo, Express, SQLite3, TypeGraphQl/TypeORM, Nodemailer and Jest with Typescript.

## What was used?

- [Node.js](https://nodejs.org/en/)
- [Express](https://expressjs.com/)
- [Apollo](https://www.npmjs.com/package/apollo-server-express)
- [TypeGraphQl](https://typegraphql.com/)
- [TypeORM](https://typeorm.io/)
- [Nodemailer](https://nodemailer.com/smtp/testing/)
- [SQLite3](https://www.sqlite.org/index.html)
- [Jest](https://jestjs.io/)

## :runner: To run this project?

First, you need to clone this project and install dependencies.

<details>
  <summary>Setup project(without Docker)</summary>

  On your terminal, follow those steps:

  1. Clone those repository: `git clone https://github.com/nicknamedelta/nodeql.git`
  2. Enter on project's folder: `cd nodeql`
  3. Install dependencies with npm: `npm install`
  4. Start Node.js server: `npm run dev:start`
</details>

<details>
  <summary>Setup project(with Docker)</summary>

  On your terminal, follow those steps:

  1. Clone those repository: `git clone https://github.com/nicknamedelta/nodeql.git`
  2. Enter on project's folder: `cd nodeql`
  3. Generate a Docker image from a Dockerfile: `docker build -t nicknamedelta/nodeql .`
  4. Start a new Docker container based on generated Docker image: `docker run -p 8080:8080 -d nicknamedelta/nodeql`

</details>

After finish the project setup, access http://localhost:8080/graphql to see the GraphQl Playground in your project.

## :construction: To test this project?

We're using Jest to make all Unitary Test in this project.

On your terminal, run: `npm run test`

## Contributing

1. Fork it (<https://github.com/nicknamedelta/nodeql/fork>)
2. Create your feature branch (`git checkout -b feature`)
3. Commit your changes (`git commit -am 'Type: some feature'`)
   1. Available Types (replace in Type): add|fix|docs|chore|review
4. Push to the branch (`git push origin feature`)
5. Create a new Pull Request
