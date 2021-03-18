package users

import (
	"fmt"

	"github.com/go-playground/validator"
)

var ValidateUserStruct func(u *User) error

func init() {
	validate := validator.New()

	ValidateUserStruct = func(u *User) error {
		err := validate.Struct(u)
		if err != nil {
			if _, ok := err.(*validator.InvalidValidationError); ok {
				fmt.Println(err)
				return err
			}

			for _, err := range err.(validator.ValidationErrors) {
				fmt.Println(err.Namespace())
				fmt.Println(err.Field())
				fmt.Println(err.StructNamespace())
				fmt.Println(err.StructField())
				fmt.Println(err.Tag())
				fmt.Println(err.ActualTag())
				fmt.Println(err.Kind())
				fmt.Println(err.Type())
				fmt.Println(err.Value())
				fmt.Println(err.Param())
				fmt.Println()
			}

			return err
		}

		return nil
	}
}
