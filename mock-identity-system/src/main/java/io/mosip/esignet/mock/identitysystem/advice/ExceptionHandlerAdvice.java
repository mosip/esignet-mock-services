/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
package io.mosip.esignet.mock.identitysystem.advice;

import static io.mosip.esignet.mock.identitysystem.util.ErrorConstants.INVALID_REQUEST;
import static io.mosip.esignet.mock.identitysystem.util.ErrorConstants.UNKNOWN_ERROR;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Set;

import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;

import org.springframework.beans.TypeMismatchException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.context.NoSuchMessageException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpMediaTypeNotAcceptableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import io.mosip.esignet.mock.identitysystem.dto.Error;
import io.mosip.esignet.mock.identitysystem.dto.ResponseWrapper;
import io.mosip.esignet.mock.identitysystem.exception.MockIdentityException;
import io.mosip.esignet.mock.identitysystem.util.HelperUtil;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@ControllerAdvice
public class ExceptionHandlerAdvice extends ResponseEntityExceptionHandler {

    @Autowired
    private MessageSource messageSource;

    @Override
    protected ResponseEntity<Object> handleHttpMessageNotReadable(HttpMessageNotReadableException ex, HttpHeaders headers,
                                                                  HttpStatus status, WebRequest request) {
        return handleExceptions(ex, request);
    }

    @Override
    protected ResponseEntity<Object> handleHttpMediaTypeNotAcceptable(
            HttpMediaTypeNotAcceptableException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
        return handleExceptions(ex, request);
    }

    @Override
    protected ResponseEntity<Object> handleMissingServletRequestParameter(
            MissingServletRequestParameterException ex,
            HttpHeaders headers,
            HttpStatus status,
            WebRequest request) {
        return handleExceptions(ex, request);
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            HttpHeaders headers,
            HttpStatus status,
            WebRequest request) {
        return handleExceptions(ex, request);
    }

    @Override
    protected ResponseEntity<Object> handleTypeMismatch(TypeMismatchException ex, HttpHeaders headers,
                                                        HttpStatus status, WebRequest request) {
        return handleExceptions(ex, request);
    }


	@ExceptionHandler(value = { Exception.class, RuntimeException.class })
    public ResponseEntity handleExceptions(Exception ex, WebRequest request) {
        log.error("Unhandled exception encountered in handler advice", ex);
        if(ex instanceof MethodArgumentNotValidException) {
            List<Error> errors = new ArrayList<>();
            for (FieldError error : ((MethodArgumentNotValidException) ex).getBindingResult().getFieldErrors()) {
                errors.add(new Error(error.getDefaultMessage(), error.getField() + ": " + error.getDefaultMessage()));
            }
            return new ResponseEntity<ResponseWrapper>(getResponseWrapper(errors), HttpStatus.OK);
        }
        if(ex instanceof ConstraintViolationException) {
            List<Error> errors = new ArrayList<>();
            Set<ConstraintViolation<?>> violations = ((ConstraintViolationException) ex).getConstraintViolations();
            for(ConstraintViolation<?> cv : violations) {
                errors.add(new Error(INVALID_REQUEST,cv.getPropertyPath().toString() + ": " + cv.getMessage()));
            }
            return new ResponseEntity<ResponseWrapper>(getResponseWrapper(errors), HttpStatus.OK);
        }
        if(ex instanceof MissingServletRequestParameterException) {
            return new ResponseEntity<ResponseWrapper>(getResponseWrapper(INVALID_REQUEST, ex.getMessage()),
                    HttpStatus.OK);
        }
        if(ex instanceof HttpMediaTypeNotAcceptableException) {
            return new ResponseEntity<ResponseWrapper>(getResponseWrapper(INVALID_REQUEST, ex.getMessage()),
                    HttpStatus.OK);
        }
		if (ex instanceof MockIdentityException) {
			String errorCode = ((MockIdentityException) ex).getErrorCode();
			return new ResponseEntity<ResponseWrapper>(getResponseWrapper(errorCode, getMessage(errorCode)),
					HttpStatus.OK);
		}
        return new ResponseEntity<ResponseWrapper>(getResponseWrapper(UNKNOWN_ERROR, ex.getMessage()), HttpStatus.OK);
    }

    private ResponseWrapper getResponseWrapper(String errorCode, String errorMessage) {
        Error error = new Error();
        error.setErrorCode(errorCode);
		error.setMessage(errorMessage);
        return getResponseWrapper(Arrays.asList(error));
    }

    private ResponseWrapper getResponseWrapper(List<Error> errors) {
        ResponseWrapper responseWrapper = new ResponseWrapper<>();
		responseWrapper.setResponseTime(HelperUtil.getCurrentUTCDateTime());
        responseWrapper.setErrors(errors);
        return responseWrapper;
    }

    private String getMessage(String errorCode) {
        try {
            messageSource.getMessage(errorCode, null, Locale.getDefault());
        } catch (NoSuchMessageException ex) {
            log.error("Message not found in the i18n bundle", ex);
        }
        return errorCode;
    }
}
