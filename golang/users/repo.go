package users

// repository and data access restrictions reside here
type IRepo interface {
	Transact(fn func() error) error // starts a transaction
	Create(u *User) error
	Update(u *User) error
	DeleteByID(id string) error
}

// implementation
type repo struct{}

func (r *repo) Transact(fn func() error) error {
	panic("Not implemented")
}

func (r *repo) Create(u *User) error {
	panic("Not implemented")
}

func (r *repo) Update(u *User) error {
	panic("Not implemented")
}

func (r *repo) DeleteByID(id string) error {
	panic("Not implemented")
}
