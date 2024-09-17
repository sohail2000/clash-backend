import {
    ArgumentsHost,
    BadRequestException,
    Catch,
    ExceptionFilter,
  } from '@nestjs/common';
  
  @Catch(BadRequestException)
  export class ValidationExceptionFilter implements ExceptionFilter {
    catch(exception: BadRequestException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
  
      if (typeof exceptionResponse === 'object' && Array.isArray(exceptionResponse['message'])) {
        const rawErrors = exceptionResponse['message'];
        console.log(rawErrors);

        const formattedErrors = this.formatRawErrors(rawErrors);
  
        response.status(status).json({
          message: 'validation-error',
          errors: formattedErrors,
        });
      } else {
        response.status(status).json(exceptionResponse);
      }
    }
  
    private formatRawErrors(errors: string[]): Record<string, string> {
      const result = {};
      errors.forEach((error) => {
        const [field, message] = error.split(':').map((part) => part.trim()); 
        result[field] = message;
      });
      return result;
    }
  }
  