package users

// user models resides here
type User struct {
	ID     string  `validate:"required,alphanum,min=0,max=255"`
	Login  string  `validate:"required,alphanum,min=0,max=255"`
	Name   string  `validate:"required,min=0,max=255"`
	Salary float64 `validate:"required,gte=0"`
}
