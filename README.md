# Microservice Name

A brief description of what the microservice does.

## Table of Contents

-   [NewServiceSetup](#new-service-repo-setup)
-   [Overview](#overview)
-   [Endpoints](#endpoints)
-   [Database](#database)
-   [Getting Started](#getting-started)
-   [Configuration](#configuration)
-   [Testing](#testing)

## New Service Repo Setup

### Duplicating the Repo

### Labels

In order to keep labels consitent across micro services, we will use the template available in the docs folder of this repo to auto populate
the new repo with labels. After running "npm install", run the following commands from the server directory:

```bash
    npx ghlbl -o NACAGA -r <name-of-new-repo> -t <organization-pat> -d
```

```bash
    npx ghlbl -o NACAGA -r <name-of-new-repo> -t <organization-pat> -i docs/labels.json
```

## Setup

You will need to create a `.env` file in the root directory of the project with the following variables:

```bash
MARIADB_PASSWORD=password
MARIADB_USER=user1
MARIADB_DATABASE=message_service
MARIADB_ROOT_PASSWORD=root_password
DB_PORT=3306
SERVER_PORT=3002

DB_HOST=localhost
```

## Usage

### Starting the Database

To start the database in a docker container, run the following command:

```bash
[ ! -f .env ] || export $(grep -v '^#' .env | xargs)
docker build -t mbm-database database $(for i in `cat .env`; do out+="--build-arg $i " ; done; echo $out;out="")
docker run --rm -d -p $DB_PORT:$DB_PORT --name mbm-database-dt mbm-database
```

### Starting the Server

To start the server, run the following command:

```bash
npm ci
npm i
DB_HOST=localhost npm start
```

You can also run tests with the following command:

```bash
DB_HOST=localhost npm test
```

### Using Docker Compose

To start the database and the server together using docker compose, run the following command:

```bash
docker compose up --build
```