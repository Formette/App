import gql from 'graphql-tag'

// USER MUTATIONS

const SIGIN_USER_MUTATION = gql`
  mutation ($email: String!, $password: String!) {
    signinUser(email: {email: $email, password: $password}) {
      token
      user{
        userName
      }
    }
  }
`;

const CREATE_USER_MUTATION = gql`
  mutation ($email: String!, $password: String!, $username: String!) {
    createUser(authProvider: {email: {email: $email, password: $password}}, userName: $username, ) {
      id
    }
  }
`;

// PROFILE MUTATIONS

//this updates the user username and other informations
const UPDATE_USER_MUTATION = gql`
  mutation ($userId: ID!, $username: String!) {
    updateUser(id: $userId, userName: $username){
        id
        userName
    }
  }
`;


export {
    SIGIN_USER_MUTATION,
    CREATE_USER_MUTATION,
    UPDATE_USER_MUTATION
}