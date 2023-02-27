
# VoteLog

Webapp to keep track of your votes in Switzerland and see which parties agree
with you where.

## Features
 
 - Show and compare results of Swiss referendums and initiatives
 - Provide reasoning for your decision
 - Categorization by topics
 - Load and store to WebDAV

## Setup

### Build and run Development WebDAV server
```
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

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Dev Links

https://dev.to/tefoh/use-bootstrap-6-in-vue-correctly-2k2g

