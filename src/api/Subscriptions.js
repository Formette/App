import gql from "graphql-tag";

// FORMS Subscriptions

const NEW_FORM_SUBSCRIPTION = gql`
  subscription {
    Forms(filter: { mutation_in: [CREATED] }) {
      node {
        id
        name
        createdAt
      }
    }
  }
`;

/*const FORM_DATA_SUBSCRIPTION = gql`
  subscription Forms($id: ID!) {
    Forms(filter: { mutation_in: [UPDATED], node: { id: $id } }) {
      node {
        id
        name
        endpoint
        contents{
          id
          data
          createdAt
        }
      }
    }
  }
`;*/

const FORM_DATA_SUBSCRIPTION = gql`
  subscription Content($id: ID!) {
    Content(
      filter: {
        mutation_in: [UPDATED, CREATED, DELETED]
        node: { forms: { id: $id } }
      }
    ) {
      node {
        id
        data
        createdAt
      }
    }
  }
`;

export { NEW_FORM_SUBSCRIPTION, FORM_DATA_SUBSCRIPTION };
