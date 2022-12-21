import { BadRequestException, HttpException } from "@nestjs/common/exceptions";
import { ExceptionFilter, ArgumentsHost } from "@nestjs/common/interfaces";
import { Catch } from "@nestjs/common/decorators/core/catch.decorator";
import { HttpStatus } from "@nestjs/common/enums";
import { Request, Response } from "express";
import { Logger } from '@nestjs/common';
import * as fs from 'fs';

import {
  CustomeHttpExceptionResponse,
  HttpExceptionResponse
} from "../types/http-exception-response.interface";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  logger = new Logger('Exception Handler');
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: HttpStatus;
    let errorMessage: string;

    if (exception instanceof HttpException) {
      if (exception instanceof BadRequestException) {
        status = 422;
        const errorResponse = exception.getResponse();
        errorMessage = (errorResponse as HttpExceptionResponse).message;
      } else {
        status = exception.getStatus();
        const errorResponse = exception.getResponse();
        errorMessage = exception.message || (errorResponse as HttpExceptionResponse).error;
      }

    } else {
      console.log(exception);
      
      
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorMessage = 'Critical internal server error occured!';
    }

    const errorResponse = this._getErrorResponse(status, errorMessage, request);
    const errorLog = this._getErrorLog(
      {
        error: errorMessage, method: request.method,
        path: request.url, statusCode: status, timeStamp: new Date().toISOString()
      }, request, exception);
    this._writeErrorLogToFile(errorLog);
    this.logger.error(`Error: ${errorMessage}`)

    response.status(status).json(errorResponse);
  }

  _getErrorResponse =
    (status: HttpStatus, errorMessage: string, request: Request):
      CustomeHttpExceptionResponse => ({
        statusCode: status,
        error: errorMessage,
        path: request.url,
        method: request.method,
        timeStamp: new Date().toISOString()
      })

  _getErrorLog =
    (errorResponse: CustomeHttpExceptionResponse, request: any, exception: unknown): string => {
      const { statusCode, error, method, path } = errorResponse;
      const errorLog = `Response Code: ${statusCode} - Method: ${method} - URL: ${path}\n
   ${JSON.stringify(errorResponse)}\n
   User: ${JSON.stringify(request.user ?? 'Not signed in')}\n
   ${exception instanceof HttpException ? exception.stack : error}\n`;
      return errorLog;
    }

  _writeErrorLogToFile = (errorLog: string): void => {
    fs.appendFile('error.log', errorLog, 'utf-8', (err) => {
      if (err) throw err;
    })
  }
}

