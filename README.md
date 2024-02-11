# My blog mirroing with gemini protocol

TLDR: go visit `gemini://g.yukai.dev`

## Demo

https://github.com/Yukaii/daily-oops-gemini/assets/4230968/8895ec2b-a3d7-48a7-990d-0aeaa0424913

## Tools to build this

This repository contains the implemntation of how I hosted my personal blog with gemini protocol as mirror site.

* [fly.io](https://fly.io) for hosting the gemini server
* [agate](https://github.com/mbrubeck/agate/) for hosting gemtext files. It also handles certificate generation automatically
* [s3fs-fuse](https://github.com/s3fs-fuse/s3fs-fuse) to mount s3 bucket as directory
* [gemgen](https://sr.ht/~kota/gemgen/) to convert markdown files to gemtext
* [HackMD](https://hackmd.io) for hosting my posts. I also regularly writing on it.
