export const loginPagetextFields = [
  {
    label: "Email",
    placeholder: "Enter your email",
    type: "text",
    RegExp: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  {
    label: "Password",
    placeholder: "Enter your password",
    type: "password",
    RegExp:
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  },
];
