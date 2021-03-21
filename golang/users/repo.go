package users

import (
	"fmt"
	"log"
	"strings"

	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
)

var ValidSortKeys = map[string]bool{
	"id":     true,
	"login":  true,
	"name":   true,
	"salary": true,
}

// repository and data access restrictions reside here
type IRepo interface {
	FindByID(id string) (*User, error)
	Find(params *FindOptions) (*FindResults, error)
	BulkCreate(fn func(CreateUserFunc) error) error
	Create(u *User) (*User, error)
	Update(u *User) (*User, error)
	DeleteByID(id string) error
}

// implementation
type repo struct {
	db         *sqlx.DB
	findByID   *sqlx.Stmt
	createUser *sqlx.NamedStmt
	// updateUser *sqlx.NamedStmt
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

type FindOptions struct {
	MinSalary  *int
	MaxSalary  *int
	Offset     int
	Limit      int
	SortKey    string
	SortIsDesc bool
}

type FindResults struct {
	Items      []User `json:"items"`
	TotalCount int    `json:"total"`
	Limit      int    `json:"limit"`
	Offset     int    `json:"offset"`
}

func (r *repo) Find(options *FindOptions) (*FindResults, error) {
	// set defaults
	sortKey := "id"
	sortDirection := ""
	limit := 30
	offset := 0

	if options.Offset >= 0 {
		offset = options.Offset
	}

	if options.Limit > 0 {
		limit = options.Limit
	}

	// check for sort key
	if ValidSortKeys[options.SortKey] {
		sortKey = options.SortKey
	}

	if options.SortIsDesc {
		sortDirection = "DESC"
	}

	users := []User{}

	// build query
	sb := []string{}

	// check for min, max salary
	if options.MinSalary != nil || options.MaxSalary != nil {
		sb = append(sb, "WHERE")
		whereSb := []string{}
		if options.MinSalary != nil {
			whereSb = append(whereSb, fmt.Sprintf("salary >= %d", *options.MinSalary))
		}

		if options.MaxSalary != nil {
			whereSb = append(whereSb, fmt.Sprintf("salary <= %d", *options.MaxSalary))
		}

		sb = append(sb, strings.Join(whereSb, " AND "))
	}

	// get count of all rows base on current query
	var totalCount int
	r.db.Get(&totalCount, "SELECT COUNT(*) FROM users "+strings.Join(sb, " "))

	sb = append(sb, fmt.Sprintf("ORDER BY %s %s", sortKey, sortDirection))
	res := &FindResults{
		Limit:  limit,
		Offset: offset,
	}

	sb = append(sb, fmt.Sprintf(" LIMIT %d OFFSET %d", limit, offset))

	// build the query
	query := strings.Join(sb, " ")

	if err := r.db.Select(&users, "SELECT * FROM users "+query); err != nil {
		return nil, err
	}

	res.TotalCount = totalCount
	res.Items = users

	return res, nil
}

func (r *repo) FindByID(id string) (*User, error) {
	u := &User{}
	err := r.findByID.Get(u, id)

	if err != nil {
		return nil, ErrUserDoesNotExist
	}

	return u, nil
}

func (r *repo) Create(u *User) (*User, error) {
	if err := ValidateUserStruct(u); err != nil {
		return nil, err
	}

	newUser := &User{}
	if err := r.createUser.Get(newUser, u); err != nil {
		return nil, normalizeErr(err)
	}

	return newUser, nil
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
		if usErr := ValidateUserStruct(u); usErr != nil {
			err = usErr
			return err
		}

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

func (r *repo) Update(u *User) (*User, error) {
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
			return ErrKeyAlreadyExist
		default:
			return err
		}

	default:
		return err
	}
}
