module.exports = Object.freeze({
  GET_ME_SCHEMA: { /* https://stackoverflow.com/questions/14940660/whats-mongoose-error-cast-to-objectid-failed-for-value-xxx-at-path-id */
    id: 'GET_ME_SCHEMA',
    type: 'object',
    properties: {
      email: {
        type: 'string',
        pattern: "/[a-z0-9\\._%+!$&*=^|~#%'`?{}/\\-]+@([a-z0-9\\-]+\.){1,}([a-z]{2,16})/"
      },
      role: {
        type: 'string',
        minLength: 1
      }
    },
    required: ['email', 'role']
  },
  PUT_ME_SCHEMA: {
    id: 'PUT_ME_SCHEMA',
    type: 'object',
    properties: {
      fullName: {
        type: 'string',
        minLength: 1
      },
      description: {
        type: 'string',
        minLength: 1
      },
      school: {
        type: 'string',
        minLength: 1
      },
      class: {
        type: 'string',
        pattern: '(^(\\d)|(10)|(11))-[а-я]{1}|university$'
      },
      phoneNumber: {
        type: 'string',
        pattern: '^\\+\\d{11}$'
      },
      email: {
        type: 'string',
        pattern: "/[a-z0-9\\._%+!$&*=^|~#%'`?{}/\\-]+@([a-z0-9\\-]+\.){1,}([a-z]{2,16})/"
      }
    },
    required: ['fullName', 'description', 'school', 'class', 'email', 'phoneNumber']
  },
  DELETE_USERS_ID_SCHEMA: { /* https://stackoverflow.com/questions/14940660/whats-mongoose-error-cast-to-objectid-failed-for-value-xxx-at-path-id */
    id: 'DELETE_USERS_ID_SCHEMA',
    type: 'object',
    properties: {
      id: {
        type: 'string',
        pattern: '^[0-9a-fA-F]{24}$' // checking if :id is even valid
      }
    },
    required: ['id']
  },
  REGISTER_USER_SCHEMA: {
    id: 'REGISTER_USER_SCHEMA',
    type: 'object',
    properties: {
      fullName: {
        type: 'string',
        minLength: 1
      },
      description: {
        type: 'string',
        minLength: 1
      },
      school: {
        type: 'string',
        minLength: 1
      },
      class: {
        type: 'string',
        pattern: '(^(\\d)|(10)|(11))-[а-я]{1}|university$'
      },
      password: {
        type: 'string',
        pattern: '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$' // https://stackoverflow.com/questions/5859632/regular-expression-for-password-validation
      },
      email: {
        type: 'string',
        pattern: "/[a-z0-9\\._%+!$&*=^|~#%'`?{}/\\-]+@([a-z0-9\\-]+\.){1,}([a-z]{2,16})/"
      },
      phoneNumber: {
        type: 'string',
        pattern: '^\\+\\d{11}$'
      }
    },
    required: ['fullName', 'description', 'school', 'class', 'password', 'email', 'phoneNumber']
  },
  LOGIN_USER_SCHEMA: {
    id: 'LOGIN_USER_SCHEMA',
    properties: {
      email: {
        type: 'string',
        pattern: "/[a-z0-9\\._%+!$&*=^|~#%'`?{}/\\-]+@([a-z0-9\\-]+\.){1,}([a-z]{2,16})/"
      },
      password: {
        type: 'string',
        pattern: '^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$'
      }
    },
    required: ['email', 'password']
  },
  POST_USER_SCHEMA: this.PUT_ME_SCHEMA, // avoding duplication
  JWT_TOKEN_SCHEMA: {
    id: 'JWT_TOKEN_SCHEMA',
    properties: {
      email: {
        type: 'string',
        pattern: "/[a-z0-9\\._%+!$&*=^|~#%'`?{}/\\-]+@([a-z0-9\\-]+\.){1,}([a-z]{2,16})/"
      },
      role: {
        type: 'string',
        minLength: 1
      }
    },
    required: ['email', 'role']
  }
})
