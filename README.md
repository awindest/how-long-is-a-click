# How long is a click?

First, I did not write this code. It was kindly provided by [Puru Vijay](https://github.com/puruvj/how-long-is-a-click). I downloaded  Puru's project and dissected this work to understand [drizzle](https://orm.drizzle.team/) and [turso](https://turso.tech/) plus it is a cool project. As Puru is on the Svelte development team I thought that I would also learn how to better concoct a svelte app.

This was all an experimental learning experience and I sorta geek out on milliseconds as my work for the US Navy way back when involved real-time responses of our software so I love measuring time. I also jumped into the Typescript pool finally but may get out soon 8) (a typical attitude befitting a noob) 


Click [here](https://how-long-is-a-click-green.vercel.app/) for the demonstration.


# Learning about drizzle and turso



## Drizzle

[Drizzle](https://orm.drizzle.team/) is an ORM or an Object-relational mapping. An ORM is a programming technique to convert data betweeen incompatible type systems. [Drizzle](https://orm.drizzle.team/) is a light abstraction to a database converting types between SQL and Typescript. It makes dev life easier.

## Turso

[Turso](https://turso.tech/) is an SQLite Database as a service (free tier) that I used to store the number of clicks. 

From the website:

> Iku-Turso is a mythological Finnish sea creature that is an elemental force of nature. When we created Turso this seemed the ideal "spirit animal" for what we were building, and we named our mascot Iku.

Basically, [turso](https://turso.tech/) is a free, easy to use, ready for production SQLite database in the cloud. It makes dev life easier.

## What to do first

Before you 
```bash
pnpm i
pnpm run dev
```
You need to set-up your database and your `.env` file.

### Your `.env` file.

This is what your skeletal `.env` file looks like:
```bash
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
PROD=
RATE_LIMIT_SECRET=
```
In the next steps we will take care of the first two. `PROD` is obvious but `RATE_LIMIT_SECRET`'s value I just guessed.

## Creating a database

First, head over to https://turso.tech and sign-up for a free account.
Click the Create Database button.
Give it a nice name.
Create a replica.
Sit back and admire your work with a cold Tab.

From the main screen, click on 'Databases'
Click on your newly created database to open the about panel.
See the URL field? You will need to copy that and put it in your sveltekit project's .env file to define the `TURSO_DATABASE_URL` environment variable.

Now we need to create a `TURSO_AUTH_TOKEN` to put in the .env file, but first you need to install the turso CLI. The instructions for your OS are in the Dashboard > Getting Started section. I'm on a Mac and use `brew` so from a terminal:
```bash
# install turso CLI
brew install tursodatabase/tap/turso

# login via the command-line
turso auth login

# FYI: you can get the url of your database if you haven't yet:
turso db show --url my-db-name

# create a new token to access your turso database

turso db tokens create my-db-name
```

## Populating the database

```bash
# generate the migrations by invoking the script
# generate is used to create an sql file together with additional information
# needed for `drizzle-kit`

pnpm run db:generate

# which runs

drizzle-kit generate:sqlite

# then we push the or sync the Typescript schema with the database schema

pnpm run db:push

# which runs

drizzle-kit push:sqlite

```

## Development

At some point you may already done this if not, go for it:
```bash
pnpm i
pnpm run dev
```
Cool huh?

## Building

To create a production version of your app:

```bash
pnpm run build

# and then

pnpm run preview
```

I use Vercel and you have to re-create the `.env` file as Environment Variables prior to deploying your project. 

## Summary

The technologies used in this project are html, css, javascript/typscript/nodejs, svelte, sveltekit, drizzle and turso and many more. If you want 
to play around with any of them go to [Puru Vijay](https://github.com/puruvj/how-long-is-a-click) and grab the code or download it from here. Enjoy, my friends!