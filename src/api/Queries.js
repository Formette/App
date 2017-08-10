import gql from 'graphql-tag'

// USER QUERIES

const USER_QUERY = gql`
  query userQuery{
    user {
       id
       userName
       email
       _formsesMeta {
          count
        }
      }
  }
`;

const USERNAME_QUERY = gql`
  query usernameQuery{
    user{
        userName
    }
  }
`;


const USERNAME_VALIDATION_QUERY = gql`
  query allUsers($username: String!){
     allUsers(filter: {userName: $username}){
        id
      }
  }
`;

export {
    USER_QUERY,
    USERNAME_QUERY,
    USERNAME_VALIDATION_QUERY
}