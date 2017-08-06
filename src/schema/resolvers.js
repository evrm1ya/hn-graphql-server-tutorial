// pre-db
const links = [
  {
    id: 1,
    url: 'http://graphql.org/',
    description: 'The Best Query Language'
  },
  {
    id: 2,
    url: 'http://dev.apollodata.com',
    description: 'Awesome GraphQL Client'
  },
]

//module.exports = {
//  Query: {
//    allLinks: () => links
//  },
//
//  Mutation: {
//    createLink: (_, data) => {
//      const newLink = Object.assign({ id: links.length + 1 }, data)
//      links.push(newLink)
//      return newLink
//    }
//  }
//}

// using mongodb
// context object is the third arg in resolver
module.exports = {
  Query: {
    allLinks: async (root, data, {mongo: {Links}}) => {
      return await Links.find({}).toArray()
    }
  },

  Mutation: {
    createLink: async (root, data, {mongo: {Links}, user}) => {
      // store user id as well as new link
      const newLink = Object.assign({postedById: user && user._id}, data)
      const response = await Links.insert(data)

      return Object.assign({id: response.insertedIds[0]}, newLink)
    },

    createUser: async (root, data, {mongo: {Users}}) => {
      // Convert given arguments into format for `User` type
      const newUser = {
        name: data.name,
        email: data.authProvider.email.email,
        password: data.authProvider.email.password
      }
      const response = await Users.insert(newUser)

      return Object.assign({id: response.insertedIds[0]}, newUser)
    },

    signinUser: async (root, data, {mongo: {Users}}) => {
      const user = await Users.findOne({email: data.email.email})

      if (data.email.password === user.password) {
        return {token: `token-${user.email}`, user}
      }
    }
  },

  Link: {
    id: root => root._id || root.id,

    postedBy: async ({postedById}, data, {mongo: {Users}}) => {
      return await Users.findOne({_id: postedById})
    }
  },

  User: {
    id: root => root._id || root.id
  }
}

