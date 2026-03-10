export const endpoints = {
  auth: {
    checkUser: "/checkuser",
    signin: "/signin",
    signup: "/signup",
    me: "/profile",
  },
  search: {
    results: "/searchUniversity",
  },
  pickList: {
    getPickListValues: "/fetchPicklist",
  },
  landing: {
    getProgramCount: "/getProgramCount",
    getAllPrograms: "/getProgramCount",
  },
} as const;
