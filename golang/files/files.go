package files

import (
	"sort"
	"time"
)

type Status struct {
	Filepath    string
	Status      string
	DateUpdated time.Time
	DateCreated time.Time
}

type IRepo interface {
	Get(userID string) []Status
	Update(userID string, filepath string, status string) Status
}

type repo struct {
	store map[string][]Status
}

func NewRepo() *repo {
	return &repo{
		store: map[string][]Status{},
	}
}

func (f *repo) Get(userID string) []Status {
	if list, ok := f.store[userID]; ok {
		// sort by date
		sort.Slice(list, func(i, j int) bool {
			return list[i].DateCreated.After(list[j].DateCreated)
		})
		return list
	} else {
		return []Status{}
	}
}

func (f *repo) Update(userID string, filepath string, status string) Status {
	list, ok := f.store[userID]
	if !ok {
		f.store[userID] = []Status{}
	}

	var found *Status
	for index, item := range list {
		if item.Filepath == filepath {
			list[index].Status = status
			list[index].DateUpdated = time.Now()
			found = &item
			break
		}
	}

	if found == nil {
		found = &Status{
			Status:      status,
			Filepath:    filepath,
			DateUpdated: time.Now(),
			DateCreated: time.Now(),
		}
		f.store[userID] = append(f.store[userID], *found)
	}

	if len(f.store[userID]) > 5 {
		sort.Slice(f.store[userID], func(i, j int) bool {
			return f.store[userID][i].DateCreated.After(f.store[userID][j].DateCreated)
		})

		f.store[userID] = f.store[userID][0:5]
	}

	return *found
}
