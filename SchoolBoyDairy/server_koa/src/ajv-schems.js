module.exports = Object.freeze({
  POST_USERS_SCHEMA: {
    'type': 'object',
    'properties': {
      'fullName': {
        'type': 'string',
        'minLength': 1
      },
      'description': {
        'type': 'string',
        'minLength': 1
      }
    },
    'required': ['fullName', 'description']
  },
  GET_USERS_ID_SCHEMA: { /* https://stackoverflow.com/questions/14940660/whats-mongoose-error-cast-to-objectid-failed-for-value-xxx-at-path-id */
    'type': 'object',
    'properties': {
      'id': {
        'type': 'string',
        'pattern': '^[0-9a-fA-F]{24}$' // checking if :id is even valid
      }
    },
    'required': ['id']
  },
  PUT_USERS_ID_SCHEMA: {
    'type': 'object',
    'properties': {
      '_id': {
        'type': 'string',
        'pattern': '^[0-9a-fA-F]{24}$'
      },
      'fullName': {
        'type': 'string',
        'minLength': 1
      },
      'description': {
        'type': 'string',
        'minLength': 1
      }
    },
    'required': ['_id', 'fullName', 'description']
  },
  DELETE_USERS_ID_SCHEMA: { /* https://stackoverflow.com/questions/14940660/whats-mongoose-error-cast-to-objectid-failed-for-value-xxx-at-path-id */
    'type': 'object',
    'properties': {
      '_id': {
        'type': 'string',
        'pattern': '^[0-9a-fA-F]{24}$' // checking if :id is even valid
      }
    },
    'required': ['_id']
  }
})
