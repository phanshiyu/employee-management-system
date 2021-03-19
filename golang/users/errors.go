package users

import (
	"errors"
	"fmt"
)

func newError(msg string) error {
	return errors.New(fmt.Sprintf("users: %s", msg))
}

var (
	ErrContentEncodingNotSupported = newError("content encoding is not supported")

	ErrUserDoesNotExist   = newError("user with given ID does not exist")
	ErrInvalidCsvFormat   = newError("invalid csv format")
	ErrKeyAlreadyExist    = newError("key already exists")
	ErrEmptyCsvFile       = newError("csv cannot be empty")
	ErrInvalidQueryParams = newError("invalid query params")
)
