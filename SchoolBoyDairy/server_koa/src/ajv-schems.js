module.exports = Object.freeze({ // TODO I liked this Object.freeze!
  class_of_school_regex: new RegExp('^\\d-[а-я]{1}|university$'), // doesn't work at the moment
  GET_ME_SCHEMA: { /* https://stackoverflow.com/questions/14940660/whats-mongoose-error-cast-to-objectid-failed-for-value-xxx-at-path-id */
    id: 'GET_ME_SCHEMA',
    type: 'object',
    properties: {
      email: {
        type: 'string',
        pattern: '^[a-z0-9]|[a-z]|[0-9][^ ]+@[a-z]+.[a-z]+$'
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
        pattern: '^\\d-[а-я]{1}|university$'
      },
      phoneNumber: {
        type: 'string',
        pattern: '^\\+\\d{11}$'
      },
      email: {
        type: 'string',
        pattern: '^[a-z0-9]|[a-z]|[0-9][^ ]+@[a-z]+.[a-z]+$'
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
        pattern: '^\\d-[а-я]{1}|university$'
      },
      password: {
        type: 'string',
        pattern: '^(?=.*\\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$' // https://stackoverflow.com/questions/14850553/javascript-regex-for-password-containing-at-least-8-characters-1-number-1-uppe
      },
      email: {
        type: 'string',
        pattern: '^[a-z0-9]|[a-z]|[0-9][^ ]+@[a-z]+.[a-z]+$'
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
        pattern: '^[a-z0-9]|[a-z]|[0-9][^ ]+@[a-z]+.[a-z]+$'
      },
      password: {
        type: 'string',
        pattern: '^(?=.*\\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$'
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
        pattern: '^[a-z0-9]|[a-z]|[0-9][^ ]+@[a-z]+.[a-z]+$'
      },
      role: {
        type: 'string',
        minLength: 1
      }
    },
    required: ['email', 'role']
  }
})
