const ErrorMessages = {
  ErrorFormExists: {
    id: "app.errors.form.exists",
    defaultMessage: "This endpoint already exists, try another."
  },
  ErrorFormEmpty: {
    id: "app.errors.form.empty",
    defaultMessage: "This form is feeling lonely, needs affection, needs data."
  },
  ErrorFormSame: {
    id: "app.errors.form.same",
    defaultMessage: "If it's the same as before, what's the point of changing?"
  },
  FormEmptyTitle: {
    id: "app.errors.form.empty.title",
    defaultMessage: "Form without data"
  },
  FormEmptyDescription: {
    id: "app.errors.form.empty.description",
    defaultMessage:
      "This form has not received any data yet, paste the endpoint into the form of your site to start collecting data."
  },
  ErrorUsernamePlaceholderLowercase: {
    id: "app.errors.auth.username.lowercase",
    defaultMessage: "username must be a lowercase string"
  },
  ErrorUsernamePlaceholderMin: {
    id: "app.errors.auth.username.min",
    defaultMessage: "The username is too Short!"
  },
  ErrorUsernamePlaceholderMax: {
    id: "app.errors.auth.username.max",
    defaultMessage: "The username is too Long!"
  },
  ErrorUsernamePlaceholderRequired: {
    id: "app.errors.auth.username.required",
    defaultMessage: "Please the username is Required"
  },
  ErrorEmailPlaceholderInvalid: {
    id: "app.errors.auth.email.invalid",
    defaultMessage: "Invalid email!"
  },
  ErrorEmailPlaceholderRequired: {
    id: "app.errors.auth.email.required",
    defaultMessage: "Email is Required"
  },
  ErrorPasswordPlaceholderMin: {
    id: "app.errors.auth.password.min",
    defaultMessage: "Password is Too Short!"
  },
  ErrorPasswordPlaceholderMax: {
    id: "app.errors.auth.password.max",
    defaultMessage: "Password is Too Long!"
  },
  ErrorPasswordPlaceholderRequired: {
    id: "app.errors.auth.password.required",
    defaultMessage: "Password is Required"
  },
  ErrorApprovePrivacyRequired: {
    id: "app.errors.auth.approvePrivacy.required",
    defaultMessage: "approvePrivacy Required"
  }
};

export default ErrorMessages;
