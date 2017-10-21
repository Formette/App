import gql from "graphql-tag";

//USER FRAGMENTS

//collects the essencial information from the user
const ESSENTIAL_USER_FIELDS_FRAGMENT = gql`
  fragment essentialUserFields on User {
    id
    userName
    email
    confirmToken
    confirmed
  }
`;

//FORMS FRAGMENTS

//gets all the form fields in the DB
const ALL_FORM_FIELDS_FRAGMENT = gql`
  fragment allFormFields on Forms {
    id
    name
    description
    isDisabled
    endpoint
    contents{
      id
      data
      createdAt
    }
    createdAt
  }
`;

//collects the essential fields from the form in the DB
const ESSENTIAL_FORM_FIELDS_FRAGMENT = gql`
  fragment essentialFormFields on Forms {
    id
    name
    createdAt
  }
`;

export {
  ALL_FORM_FIELDS_FRAGMENT,
  ESSENTIAL_FORM_FIELDS_FRAGMENT,
  ESSENTIAL_USER_FIELDS_FRAGMENT
};
