import express from "express";
import { graphqlHTTP } from "express-graphql";
import { schema } from "./Schema";
import cors from "cors";


export const app = express();
app.use(cors());
app.use(express.json());
app.use(
    "/graphql",
    graphqlHTTP({
      schema,
      graphiql: true,
    })
  );

export const start = () => {
  app.listen(4001, () => {
    console.log("server is started");
  });

  app.get('/', (_, res) => {
    res.send('hello world')
  })
};
