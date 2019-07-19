module.exports = Object.freeze({
  class_of_school_regex: new RegExp('^\\d-[а-я]{1}|university$'), // doesn't work at the moment
  POST_USERS_SCHEMA: {
    id: 'POST_USERS_SCHEMA',
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
      }
    },
    required: ['fullName', 'description', 'school', 'class']
  },
  GET_ME_SCHEMA: { /* https://stackoverflow.com/questions/14940660/whats-mongoose-error-cast-to-objectid-failed-for-value-xxx-at-path-id */
    id: 'GET_ME_SCHEMA',
    type: 'object',
    properties: {
      email: {
        type: 'string',
        pattern: '^[a-z0-9]|[a-z]|[0-9][^ ]+@[a-z]+.[a-z]+$' // checking if :id is even valid
      },
      role: {
        type: 'string',
        minLength: 1
      }
    },
    required: ['email', 'role']
  },
  PUT_USERS_ID_SCHEMA: {
    id: 'PUT_USERS_ID_SCHEMA',
    type: 'object',
    properties: {
      _id: {
        type: 'string',
        pattern: '^[0-9a-fA-F]{24}$'
      },
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
      }
    },
    required: ['_id', 'fullName', 'description', 'school', 'class']
  },
  DELETE_USERS_ID_SCHEMA: { /* https://stackoverflow.com/questions/14940660/whats-mongoose-error-cast-to-objectid-failed-for-value-xxx-at-path-id */
    id: 'DELETE_USERS_ID_SCHEMA',
    type: 'object',
    properties: {
      _id: {
        type: 'string',
        pattern: '^[0-9a-fA-F]{24}$' // checking if :id is even valid
      }
    },
    required: ['_id']
  },
  REGISTER_USER_SCHEMA: {
    id: 'REGISTER_USER_SCHEMA',
    type: 'object',
    properties: {
      fullName: {
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
      }
    },
    required: ['fullName', 'school', 'class', 'password', 'email']
  },
  LOGIN_USER_SCHEMA: {
    id: 'LOGIN_USER_SCHEMA',
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
})
