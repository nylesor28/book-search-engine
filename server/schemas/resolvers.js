const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');
const { User } = require('../models');
const { Book } = require('../models');


const resolvers = {
  Query: {
    me: async (parent, args, context) => {

      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password')
   
    
        return userData;
      }
      throw new AuthenticationError('Not logged in');
    },
     // get all users
     users: async () => {
      return User.find()
        .select('-__v -password')
        .populate('savedBooks')

    },
    // get a user by username
    userByName: async (parent, { username }) => {
      const params = username ? { username } : {};
      return User.findOne({params})
        .select('-__v -password')
       

    },
    // get a user by id
    userById: async (parent, { _id }) => {
      return User.findOne({_id })
        .select('-__v -password')
    

    },
    //TODO POSSIBLE Delete
    // books: async (parent, { username }) => {
    //   const params = username ? { username } : {};
    //   return Book.find(params).sort({ createdAt: -1 });
    // },

    // book: async (parent, { bookId }) => {
    //   return Book.findOne({ bookId });
    // }, 
    
   
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
    
      return { token, user };
    },
    login: async (parent, {username,  email, password }) => {
      const user = await User.findOne({ $or: [{ username }, { email }] });
    
      if (!user) {
        throw new AuthenticationError('Incorrect credentials');
      }
    
      const correctPw = await user.isCorrectPassword(password);
    
      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }
    
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, {bookInput}, context) => {
      console.log ("********SERVER LOG ==> ", "INSIDE saveBook Mutation Query")
     // console.log(bookInput)
      if (context.user) {
    
        console.log(context.user, bookInput)
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: bookInput}} ,
          { new: true, runValidators: true }
        );
    

        console.log("UPDATED_USER")
        console.log(updatedUser)
        console.log("============UPDATED_USER BOOKS===========")
       // console.log(updatedUser.savedBooks)
        return updatedUser;
      }
    
      throw new AuthenticationError('You need to be logged in!');
    },
    removeBook: async (parent, {bookId}, context) => {
      if (context.user) {
    
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: {bookId} } },
           { new: true, runValidators: true }
        );
    
        return updatedUser;
      }
    
      throw new AuthenticationError('You need to be logged in!');
    },
  }
};
  
  module.exports = resolvers;