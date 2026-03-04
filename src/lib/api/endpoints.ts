export const endpoints = {
  auth: {
    checkUser: "/checkuser",
    signin: "/signin",
    signup: "/signup",
    me: "/profile",
  },
  landing: {
    content: "/landing-page",
  },
} as const;
