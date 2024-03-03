# VoteLog

A small Webapp I use to keep track of my votes in Switzerland and see which
parties agree with me.

## Features

- Show and compare results of Swiss referendums and initiatives
- Provide reasoning for decision
- Vote Category Overview
- Load and store data to WebDAV (no backend)

![VoteLog Screenshot](screenshot.png)
(those are not my votes, at least not all of them...)

## Build Docker images

Build in your native architecture as follows.

```bash
docker -t votelog .
```

Build an aarch64 image, run the following (may need some dependencies).

```bash
docker buildx build --platform linux/arm64 -t votelog .
```

## Setup

### WebDAV server

Build and run Development server with username "cat" and password "dog". Add
`VUE_APP_WEBDAV_URI="http://localhost:8080"` into `.env.local` to make this the
default value on the login page.

```bash
docker build -t webdav-dev dev/webdav/
docker-compose -f dev/webdav/docker-compose.yml up -d
```

### Install dependencies

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```
