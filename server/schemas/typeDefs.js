
const { gql } = require('apollo-server-express');

// create our typeDefs
const typeDefs = gql`



type Auth {
  token: ID!
  user: User
}

type User {
  _id: ID
  username: String
  email: String
  bookCount: Int
  savedBooks: [Book]
  
}

type Book {
  authors: [String]
  description: String!
  bookId: String!
  image: String
  link: String
  title: String!
}


input BookInput {
  authors: [String]
  description: String!
  bookId: String!
  image: String
  link: String
  title: String!
}

type Query {
  me: User
  users: [User]
  userByName(username: String!): User
  userById(_id: ID!): User
}

type Mutation {
  login(email: String!, password: String!): Auth
  addUser(username: String!, email: String!, password: String!): Auth
  saveBook(bookInput: BookInput): User
  removeBook(bookId: String!): User

}

`;
// export the typeDefs
module.exports = typeDefs;