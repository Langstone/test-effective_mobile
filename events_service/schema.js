const eventSchema = {
  type: 'object',
  required: ['user_id', 'payload', 'operation'],
  properties: {
    user_id: { type: 'integer' },
    payload: { type: 'string' },
    operation: { type: 'string' },
  }
}

export default eventSchema;