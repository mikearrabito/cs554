import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:4000",
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          binnedImages: {
            merge: (old, newPics) => {
              return newPics;
            },
          },
          userPostedImages: {
            merge: (old, newPics) => {
              return newPics;
            },
          },
          getTopTenBinnedPosts: {
            merge: (old, newPics) => {
              return newPics;
            },
          },
        },
      },
    },
  }),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
