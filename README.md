# Daily Oops serving in gemini protocol

## Build Workflow

Ref: https://space.matthewphillips.info/posts/flyio-gemini-setup/

> Matthew's workflow:

1. Rsync to s3
2. Create Self-signed certificate in certbot, then set it manually via environment variable
3. Serve go-gemini server against s3 bucket. So there's no need to manually copy files to the server.

> My ideal workflow

* Minimal maintainence needed. Use only SaaS platform to host my service. fly.io is also good
* Maybe no TLS support is acceptable? Let's encrypt wont work as expected. So a little bit of certbot magic is required. But I don't want that act too verbose.
* The minimal data sync requirement. Currently, my daily-oops site need to be rebuilt upon every post updated. If I use similar s3 bucket sync mechanism, and create a small post sync services that will fetch the HackMD post as markdown files, and update the host. That's probably something I can do.

> Workflow draft

* Don't use TLS for now. Only listen to port 1965
* Host with go-gimini or any directory based gemini hoster
* Build the docker file with target s3 bucket mounted
* Whenever my blog is updated. Just trigger the gmi file generation and sync all of them to s3 bucket again. 
