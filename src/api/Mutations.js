import gql from "graphql-tag";
//API
import {
  ESSENTIAL_FORM_FIELDS_FRAGMENT,
  ESSENTIAL_USER_FIELDS_FRAGMENT
} from "./Fragments";

// USER MUTATIONS

const SIGIN_USER_MUTATION = gql`
  mutation($email: String!, $password: String!) {
    signinUser(email: { email: $email, password: $password }) {
      token
      user {
        ...essentialUserFields
        _formsesMeta {
          count
        }
      }
    }
  }
  ${ESSENTIAL_USER_FIELDS_FRAGMENT}
`;

const CREATE_USER_MUTATION = gql`
  mutation(
    $email: String!
    $password: String!
    $username: String!
    $confirmToken: String!
    $confirmExpires: DateTime!
    $approvedPrivacy: Boolean!
  ) {
    createUser(
      authProvider: { email: { email: $email, password: $password } }
      userName: $username
      confirmToken: $confirmToken
      confirmExpires: $confirmExpires
      approvedPrivacy: $approvedPrivacy
    ) {
      id
    }
  }
`;

const USER_CONFIRM_TOKEN_MUTATION = gql`
  mutation($confirmToken: String!) {
    confirmEmail(confirmToken: $confirmToken) {
      id
    }
  }
`;

const USER_RESEND_CONFIRMATION_MUTATION = gql`
  mutation($email: String!) {
    resendConfirmation(email: $email) {
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

//this creates a new form
const CREATE_FORM_MUTATION = gql`
  mutation(
    $userId: ID!
    $name: String!
    $description: String
    $endpoint: String!
    $isDisabled: Boolean
    $redirect: String
  ) {
    createForms(
      userId: $userId
      name: $name
      description: $description
      endpoint: $endpoint
      isDisabled: $isDisabled
      redirect: $redirect
    ) {
      ...essentialFormFields
    }
  }
  ${ESSENTIAL_FORM_FIELDS_FRAGMENT}
`;

//this updates the selected form and all of is data
const UPDATE_FORM_MUTATION = gql`
  mutation(
    $id: ID!
    $name: String!
    $description: String
    $endpoint: String!
    $isDisabled: Boolean
    $redirect: String
  ) {
    updateForms(
      id: $id
      name: $name
      description: $description
      endpoint: $endpoint
      isDisabled: $isDisabled
      redirect: $redirect
    ) {
      id
      name
      description
      endpoint
      isDisabled
      redirect
    }
  }
`;

//this deletes the selected form and all of is data
const DELETE_FORM_MUTATION = gql`
  mutation($id: ID!) {
    deleteForms(id: $id) {
      id
    }
  }
`;

//this deletes the selected content from a form
const DELETE_FORM_CONTENT_MUTATION = gql`
  mutation($id: ID!) {
    deleteContent(id: $id) {
      id
    }
  }
`;

export {
  SIGIN_USER_MUTATION,
  CREATE_USER_MUTATION,
  USER_CONFIRM_TOKEN_MUTATION,
  USER_RESEND_CONFIRMATION_MUTATION,
  UPDATE_USER_MUTATION,
  CREATE_FORM_MUTATION,
  UPDATE_FORM_MUTATION,
  DELETE_FORM_MUTATION,
  DELETE_FORM_CONTENT_MUTATION
};
