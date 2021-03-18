package users

import (
	"log"

	"github.com/jmoiron/sqlx"
)

// repository and data access restrictions reside here
type IRepo interface {
	FindByID(id string) (*User, error)
	BulkCreate(fn func(CreateUserFunc) error) error
	Create(u *User) error
	Update(u *User) error
	DeleteByID(id string) error
}

// implementation
type repo struct {
	db         *sqlx.DB
	findByID   *sqlx.Stmt
	createUser *sqlx.NamedStmt
	updateUser *sqlx.NamedStmt
}

type CreateUserFunc func(*User) error

func NewRepo(db *sqlx.DB) (*repo, error) {
	createUser, err := db.PrepareNamed(`INSERT INTO users (id, login, name, salary) VALUES (:id, :login, :name, :salary) RETURNING *`)
	if err != nil {
		return nil, err
	}

	findByID, err := db.Preparex(`SELECT * FROM users WHERE id = $1 LIMIT 1`)
	if err != nil {
		panic(err)
	}

	return &repo{
		db:         db,
		createUser: createUser,
		findByID:   findByID,
	}, nil
}

func (r *repo) Transact(fn func() error) error {
	panic("Not implemented")
}

func (r *repo) FindByID(id string) (*User, error) {
	u := &User{}
	err := r.findByID.Get(u, id)

	if err != nil {
		return nil, UserDoesNotExist
	}

	return u, nil
}

func (r *repo) Create(u *User) error {
	panic("Not implemented")
}

func (r *repo) BulkCreate(fn func(CreateUserFunc) error) error {
	// begin txn
	tx, err := r.db.Beginx()

	if err != nil {
		return err
	}

	txStmt, err := tx.PrepareNamed(`INSERT INTO users(id, login, name, salary) VALUES(:id, :login, :name, :salary) on conflict(id) do UPDATE SET id=:id, login=:login, name=:name, salary=:salary;`)

	if err != nil {
		return err
	}

	// runs user's code
	if err := fn(func(u *User) error {
		log.Println(u.ID)
		//validate user data
		if _, err := txStmt.Exec(u); err != nil {
			return err
		}

		return nil
	}); err != nil {
		tx.Rollback()
		return err
	}

	return tx.Commit()
}

func (r *repo) Update(u *User) error {
	panic("Not implemented")
}

func (r *repo) DeleteByID(id string) error {
	panic("Not implemented")
}
