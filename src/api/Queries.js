import gql from "graphql-tag";
//API
import {
  ALL_FORM_FIELDS_FRAGMENT,
  ESSENTIAL_FORM_FIELDS_FRAGMENT,
  ESSENTIAL_USER_FIELDS_FRAGMENT
} from "./Fragments";

// USER QUERIES

const USER_QUERY = gql`
  query userQuery {
    user {
      ...essentialUserFields
      _formsesMeta {
        count
      }
    }
  }
  ${ESSENTIAL_USER_FIELDS_FRAGMENT}
`;

const USERNAME_QUERY = gql`
  query usernameQuery {
    user {
      id
      userName
    }
  }
`;

const USERNAME_VALIDATION_QUERY = gql`
  query allUsers($username: String!) {
    allUsers(filter: { userName: $username }) {
      id
    }
  }
`;

// FORMS QUERIES

//gets all the forms from that user
const ALL_FORMS_QUERY = gql`
  query allFormses($userId: ID!) {
    allFormses(filter: { user: { id: $userId } }) {
      ...essentialFormFields
    }
  }
  ${ESSENTIAL_FORM_FIELDS_FRAGMENT}
`;

const FORM_DATA_QUERY = gql`
  query form($id: ID!) {
    Forms(id: $id) {
      ...allFormFields
    }
  }
  ${ALL_FORM_FIELDS_FRAGMENT}
`;

//get a specific content from a form
const FORM_CONTENT_DATA_QUERY = gql`
  query content($id: ID!) {
    Content(id: $id) {
      id
      data
      createdAt
      forms {
        id
      }
    }
  }
`;

export {
  USER_QUERY,
  USERNAME_QUERY,
  USERNAME_VALIDATION_QUERY,
  ALL_FORMS_QUERY,
  FORM_DATA_QUERY,
  FORM_CONTENT_DATA_QUERY
};
