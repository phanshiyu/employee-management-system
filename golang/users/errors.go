package users

import (
	"errors"
	"fmt"
	"log"
	"net/http"
)

func newError(msg string) error {
	return errors.New(fmt.Sprintf("users: %s", msg))
}

var (
	ErrContentEncodingNotSupported = newError("content encoding is not supported")

	ErrUserDoesNotExist = newError("user with given ID does not exist")

	ErrInvalidCsvFormat   = newError("invalid csv format")
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
		break
	case ErrInvalidCsvFormat:
		code = "ErrInvalidCsvFormat"
		httpCode = http.StatusBadRequest
		break
	case ErrContentEncodingNotSupported:
		code = "ErrContentEncodingNotSupported"
		httpCode = http.StatusBadRequest
	case ErrWithCsvFile:
		code = "ErrWithCsvFile"
		httpCode = http.StatusBadRequest
		break
	case ErrEmptyCsvFile:
		code = "ErrEmptyCsvFile"
		httpCode = http.StatusBadRequest
		break
	default:
		code = "ErrInternalServer"
	}
	return &appError{
		Error:    e,
		Code:     code,
		HttpCode: httpCode,
	}
}
