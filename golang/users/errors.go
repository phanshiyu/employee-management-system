package users

import (
	"fmt"
	"log"
	"net/http"
)

func newError(msg string) error {
	return fmt.Errorf("users: %s", msg)
}

var (
	ErrContentEncodingNotSupported = newError("content encoding is not supported")

	ErrUserDoesNotExist      = newError("user with given ID does not exist")
	ErrDataValidationFailure = newError("user data validation failed")

	ErrInvalidCsvColumns  = newError("invalid csv format")
	ErrKeyAlreadyExist    = newError("key already exists")
	ErrEmptyCsvFile       = newError("csv cannot be empty")
	ErrWithCsvFile        = newError("error with csv file")
	ErrInvalidQueryParams = newError("invalid query params")
)

type HttpErrorJSON struct {
	Code string `json:"code"`
}

type appError struct {
	Error    error
	Code     string
	HttpCode int
}

func newAppError(e error) *appError {
	code := ""
	httpCode := http.StatusInternalServerError

	log.Println(e)

	switch e {
	case ErrKeyAlreadyExist:
		code = "ErrKeyAlreadyExist"
		httpCode = http.StatusBadRequest
	case ErrInvalidQueryParams:
		code = "ErrInvalidQueryParams"
		httpCode = http.StatusBadRequest
	case ErrInvalidCsvColumns:
		code = "ErrInvalidCsvColumns"
		httpCode = http.StatusBadRequest
	case ErrContentEncodingNotSupported:
		code = "ErrContentEncodingNotSupported"
		httpCode = http.StatusBadRequest
	case ErrWithCsvFile:
		code = "ErrWithCsvFile"
		httpCode = http.StatusBadRequest
	case ErrEmptyCsvFile:
		code = "ErrEmptyCsvFile"
		httpCode = http.StatusBadRequest
	case ErrDataValidationFailure:
		code = "ErrDataValidationFailure"
		httpCode = http.StatusBadRequest
	case ErrUserDoesNotExist:
		code = "ErrUserDoesNotExist"
		httpCode = http.StatusNotFound

	default:
		code = "ErrInternalServer"
	}
	return &appError{
		Error:    e,
		Code:     code,
		HttpCode: httpCode,
	}
}
