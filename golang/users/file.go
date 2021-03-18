package users

import "mime/multipart"

// multipart file handlers, eg CSV
func handleCSV(file multipart.File, repo *IRepo) error {
	panic("not implemented")
}

var FileHandlers = map[string]func(file multipart.File, repo *IRepo) error{
	"text/csv": handleCSV,
}
