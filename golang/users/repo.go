package users

import (
	"log"

	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
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

	// fnErr is the err returned from the user's code, this will also trigger a rollback
	if fnErr := fn(func(u *User) error {
		log.Println(u.ID)
		//validate user data
		if _, txErr := txStmt.Exec(u); txErr != nil {
			err = normalizeErr(txErr)
			return err
		}

		return nil
	}); fnErr != nil {
		err = fnErr
	}

	if err != nil {
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

func normalizeErr(err error) error {
	switch assertedErr := err.(type) {
	case *pq.Error:
		switch assertedErr.Code {
		case "23505":
			return KeyAlreadyExist
		default:
			return err
		}
	default:
		return err
	}
}
