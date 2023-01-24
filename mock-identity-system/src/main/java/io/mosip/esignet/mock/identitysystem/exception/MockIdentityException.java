package io.mosip.esignet.mock.identitysystem.exception;

import io.mosip.esignet.mock.identitysystem.util.ErrorConstants;

public class MockIdentityException extends RuntimeException {

	private String errorCode;

	public MockIdentityException() {
        super(ErrorConstants.UNKNOWN_ERROR);
        this.errorCode = ErrorConstants.UNKNOWN_ERROR;
    }

	public MockIdentityException(String errorCode) {
        super(errorCode);
        this.errorCode = errorCode;
    }

	public String getErrorCode() {
		return errorCode;
	}
}
