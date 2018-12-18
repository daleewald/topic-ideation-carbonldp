# topic-ideation-carbonldp

## Developer getting started

- In the Carbon Workbench's Document Explorer (localhost:8000/explore), manually create a new document at the root 
level  using the slug name: `topics`. This will act as a parent under which new child documents can be created and 
kept separate from parent documents that you might use for other applications. Later, we can revise this app to 
create the parent document automatically if it does not exist, but it's just simple to do it manually for now.
- Also in the Carbon Workbench's Document Explorer, manually create a new document at the root 
level  using the slug name: `participants`.
- From within the root of this project, execute `npm install`. This will install the project dependencies that are 
defined in `package.json` into the `node_modules` directory.
- Modify `environments/environment.prod.ts` and `environments/environment.ts` so that `carbonldp.protocol` and 
`carbonldp.host` define the appropriate protocols and hosts for your respective environments.
- Execute `npm start` to run the app in dev/watch mode. This runs the Angular Live Development server, which will 
watch for source code changes and serve the app at http://localhost:4200/ .




