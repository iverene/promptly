export const validate = (schema, source = 'body') => (request, response, next) => {
  const result = schema.safeParse(request[source]);
  if (!result.success) {
    return response.status(400).json({
      error: 'Validation failed',
      details: result.error.flatten(),
    });
  }
  request[source] = result.data;
  next();
};

