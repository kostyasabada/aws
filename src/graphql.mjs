import { ApolloServer, gql } from 'apollo-server-lambda';
import { v4 as uuid } from "uuid";

import { goalClient } from "./dynamodb/index.mjs";

const typeDefs = gql`
  type Goal {
    id: ID!
    title: String!,
    savedAmount: Float!,
    targetAmount: Float,
    description: String,
    targetDate: String
  }
  type Query {
    goal(id: ID!): Goal,
    goals: [Goal!]!
  }
  type Mutation {
    addGoal(
      id: String,
      title: String!,
      savedAmount: Float,
      targetAmount: Float,
      description: String,
      targetDate: String
    ): Goal
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    goal: async (_, { id }) => {
      return goalClient.findGoalById(id);
    },
    goals: async () => {
      return goalClient.findAllGoals();
    },
  },
  Mutation: {
    addGoal: async (_, goal) => {
      const goalToBeCreated = { id: goal?.id ?? uuid(), ...goal };
      return goalClient.createGoal(goalToBeCreated);
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

export const handler = server.createHandler();