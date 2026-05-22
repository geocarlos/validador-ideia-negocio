class OpenAIError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = this.constructor.name;
    this.agentName = options.agentName || null;
    this.statusCode = options.statusCode || null;
    this.details = options.details || null;
    this.rawContent = options.rawContent || null;
    this.cause = options.cause || null;
  }
}

class OpenAIConfigError extends OpenAIError {}

class OpenAITimeoutError extends OpenAIError {
  constructor(message, options = {}) {
    super(message, { ...options, statusCode: options.statusCode || 408 });
  }
}

class OpenAIParseError extends OpenAIError {}

class OpenAIValidationError extends OpenAIError {
  constructor(message, options = {}) {
    super(message, { ...options, statusCode: options.statusCode || 422 });
  }
}

class OpenAIServiceError extends OpenAIError {}

module.exports = {
  OpenAIError,
  OpenAIConfigError,
  OpenAITimeoutError,
  OpenAIParseError,
  OpenAIValidationError,
  OpenAIServiceError
};
