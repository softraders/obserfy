package school_test

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"mime/multipart"
	"net/http"
	"os"
	"time"

	"github.com/brianvoe/gofakeit/v4"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"

	"github.com/chrsep/vor/pkg/mocks"
	"github.com/chrsep/vor/pkg/school"
)

func (s SchoolTestSuite) TestSaveNewStudentWithPic() {
	t := s.T()
	gofakeit.Seed(time.Now().UnixNano())
	newSchool := s.SaveNewSchool()

	name := gofakeit.Name()
	payload := new(bytes.Buffer)
	writer := multipart.NewWriter(payload)

	imagePath := "icon.png"
	image, err := os.Open(imagePath)
	assert.NoError(t, err)
	content, err := ioutil.ReadAll(image)
	assert.NoError(t, err)
	err = image.Close()
	assert.NoError(t, err)
	part, err := writer.CreateFormFile("picture", name)
	assert.NoError(t, err)
	_, err = part.Write(content)
	assert.NoError(t, err)

	// mock student image storage
	mockImage := new(mocks.StudentImageStorage)
	s.Handler = school.NewRouter(s.Server, s.store, mockImage, nil).ServeHTTP
	mockImage.On("SaveProfilePicture", mock.Anything, mock.Anything, mock.Anything).Return("/path", nil)
	_, err = mockImage.SaveProfilePicture(mock.Anything, nil, 50)
	assert.NoError(t, err)

	req := struct {
		Name        string `json:"string"`
		DateOfBirth time.Time `json:"dateOfBirth"`
	}{Name: name, DateOfBirth: time.Now()}
	json, err := json.Marshal(req)
	assert.NoError(t, err)
	part2, err := writer.CreateFormFile("student", name)
	assert.NoError(t, err)
	_, err = part2.Write(json)
	assert.NoError(t, err)
	err = writer.Close()
	assert.NoError(t, err)

	result := s.CreateMultipartRequest("/"+newSchool.Id+"/students", payload, writer.Boundary(), &newSchool.Users[0].Id)
	assert.Equal(t, result.Code, http.StatusCreated)
}