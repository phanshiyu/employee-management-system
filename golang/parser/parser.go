package parser

import (
	"log"
	"os"
)

type Response struct {
	Status string
	Err    error
}

type Request struct {
	ResponseChan chan<- *Response
	Filepath     string
}

type ParseFileFunc = func(string) <-chan *Response

// NewParser creates a go routine to work as a queue to consume request to process files. Files are parsed one at a time.
func NewParser(fileHandler func(*os.File) error) ParseFileFunc {
	fileRequestChan := make(chan *Request)

	go func() {
		for {
			req := <-fileRequestChan
			file, err := os.Open(req.Filepath)
			if err != nil {
				log.Fatal(err)
			}

			req.ResponseChan <- &Response{
				Status: "processing",
				Err:    nil,
			}
			// check for timeout, if too long we close the channel?
			if err := fileHandler(file); err != nil {
				req.ResponseChan <- &Response{
					Status: "error",
					Err:    err,
				}
			} else {
				req.ResponseChan <- &Response{
					Status: "completed",
					Err:    nil,
				}
			}

			close(req.ResponseChan)
			file.Close()
		}
	}()

	return func(filepath string) <-chan *Response {
		responseChan := make(chan *Response)
		fileRequestChan <- &Request{
			ResponseChan: responseChan,
			Filepath:     filepath,
		}

		return responseChan
	}
}
