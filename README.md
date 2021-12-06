# Notoadia <img src="https://i.ibb.co/JmVV8Vf/notoadia.png" height="auto" width="80" style="border-radius:50%" align="right">

Helping make homework a bit less time-consuming.

### How it works

The Deno server is put inside a docker container. It requires certain environment variables to be set.

When starting, the server downloads all the assignments from the Canvas course that match certain filters. It adds those
to a cache, so when checking for new assignments in the future, it will know which ones it's seen before.

Then, based on an interval, it will periodically check Canvas for new assignments. If an assignment matches the filters,
it will then parse the text into a machine-readable object.

> This is where the code becomes very use-case specific. Notoadia is designed for assignments based on taking notes from a textbook. If you want to use Notoadia for other needs, you will need to fork this project or create a PR which generalizes this logic.

First, a message is sent to Discord, delimiting teh start of the pages which will be subsequently sent. The assignment's
page range is used to find the correct pages from the book, in the `book.json`
file. The pages are then prepared in Discord's markdown formatting, split up, and sent in the form of embeds. A final
message is sent with all the information about the assignment and a link to the first delimiting message.

### Developing

> Using Intellij Idea is recommended, the run configuration is already set up.

First, set the required environment variables.<br />Second, start the server by running the `entry.ts` file:

```
deno run --unstable --allow-env --allow-net entry.ts
```
