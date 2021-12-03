FROM denoland/deno:1.15.3

WORKDIR /

ADD . .

CMD ["run", "--unstable", "--allow-env",  "--allow-net", "--allow-read", "--allow-write", "entry.ts"]
