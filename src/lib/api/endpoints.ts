export const endpoints = {
  auth: {
    checkUser: "/checkuser",
    signin: "/signin",
    signup: "/signup",
    me: "/profile",
  },
  search: {
    results: "/searchUniversity",
    getUniversityDetail: "/getUniversity",
  },
  pickList: {
    getPickListValues: "/fetchPicklist",
  },
  landing: {
    getProgramCount: "/getProgramCount",
    getAllPrograms: "/getProgramCount",
  },
  events: {
    getEvent: "/getEventList",
  },
} as const;
