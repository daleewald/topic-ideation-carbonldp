# topic-ideation-carbonldp

## Developer getting started

- In the Carbon Workbench's Document Explorer (localhost:8000/explore), manually create a new document at the root 
level  using the slug name: `topics`. This will act as a parent under which new child documents can be created and 
kept separate from parent documents that you might use for other applications. Later, we can revise this app to 
create the parent document automatically if it dores not exist, but it's just simple to do it manually for now.
- From within the root of this project, execute `npm install`. This will install the project dependencies that are 
defined in `package.json` into the `node_modules` directory.
- Execute `npm start` to run the app in dev/watch mode. This runs the Angular Live Development server, which will 
watch for source code changes and serve the app at http://localhost:4200/ .
- You may need to add the following entry in your hosts file:
  - `127.0.0.1     carbon2.local.com`



