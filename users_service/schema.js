const userSchema = {
  type: 'object',
  required: ['first_name', 'last_name', 'email', 'created_at'],
  properties: {
    id: { type: 'integer' },
    first_name: { type: 'string' },
    last_name: { type: 'string' },
    email: { type: 'string' },
    created_at: { type: 'string', format: 'date-time' },
  }
}

export default userSchema;