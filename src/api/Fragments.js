import { createFragmentMap } from 'apollo-client';
import gql from "graphql-tag";

// Save the fragment into a variable
const formFieldsFragment = createFragmentMap(gql`
  fragment formFields on Forms {
      id
      name
      description
      isDisabled
      endpoint
      data
  }
`);

export {
    formFieldsFragment
};
