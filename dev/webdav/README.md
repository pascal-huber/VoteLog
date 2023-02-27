# Development webdav server

Build and start it:

``` sh
docker build -t webdav-dev .
docker-compose -f docker-compose.yml up -d
```

Test it:

``` sh
❯ cadaver http://localhost:8080/
dav:/> put justafile.txt
Uploading justafile.txt to `/justafile.txt':
Progress: [=============================>] 100.0% of 3 bytes succeeded.
dav:/> ls
Listing collection `/': succeeded.
        justafile.txt                          3  Jan 17 11:14
dav:/> rm justafile.txt
Deleting `justafile.txt': succeeded.
dav:/> exit
Connection to `localhost' closed.
```

