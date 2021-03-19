package users

// user models resides here
type User struct {
	ID     string  `json:"id" validate:"required,alphanum,min=0,max=255"`
	Login  string  `json:"login" validate:"required,alphanum,min=0,max=255"`
	Name   string  `json:"name" validate:"required,min=0,max=255"`
	Salary float64 `json:"salary" validate:"required,gte=0"`
}
