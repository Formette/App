import gql from "graphql-tag";

// USER MUTATIONS

const SIGIN_USER_MUTATION = gql`
  mutation($email: String!, $password: String!) {
    signinUser(email: { email: $email, password: $password }) {
      token
      user {
        id
        userName
      }
    }
  }
`;

const CREATE_USER_MUTATION = gql`
  mutation($email: String!, $password: String!, $username: String!) {
    createUser(
      authProvider: { email: { email: $email, password: $password } }
      userName: $username
    ) {
      id
    }
  }
`;

// PROFILE MUTATIONS

//this updates the user username and other informations
const UPDATE_USER_MUTATION = gql`
  mutation($userId: ID!, $username: String!) {
    updateUser(id: $userId, userName: $username) {
      id
      userName
    }
  }
`;

// NEW FORM MUTATIONS

//this updates the user username and other informations
const CREATE_FORM_MUTATION = gql`
  mutation(
    $userId: ID!
    $name: String!
    $description: String
    $endpoint: String!
    $isDisabled: Boolean
  ) {
    createForms(
      userId: $userId
      name: $name
      description: $description
      endpoint: $endpoint
      isDisabled: $isDisabled
    ) {
      id
      name
      createdAt
    }
  }
`;

export {
  SIGIN_USER_MUTATION,
  CREATE_USER_MUTATION,
  UPDATE_USER_MUTATION,
  CREATE_FORM_MUTATION
};
