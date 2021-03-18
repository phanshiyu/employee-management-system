package users

import (
	"errors"
	"fmt"
)

func newError(msg string) error {
	return errors.New(fmt.Sprintf("users: %s", msg))
}

var (
	ContentEncodingNotSupported = newError("content encoding is not supported")
)
