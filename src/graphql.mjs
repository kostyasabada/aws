import { ApolloServer, gql } from 'apollo-server-lambda';

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

const myGoal = {
  id: new Date().getTime(),
  title: "Playstation 5",
  savedAmount: 100.0,
  targetAmount: 500.0,
  description: "When it becomes available, the money has to be saved",
  targetDate: "2022-08-06",
};

const resolvers = {
  Query: {
    goal: (_, { id }) => myGoal,
    goals: () => [myGoal]
  },
  Mutation: {
    addGoal: (_, goal) => ({
      ...goal,
      id: goal?.id ?? new Date().getTime(),
      savedAmount: goal?.savedAmount ?? .0
    })
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

export const handler = server.createHandler();