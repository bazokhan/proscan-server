module.exports = {
  questionFragment: `fragment QuestionFragment on Question {
    id
    body
    session {
      id
      publicId
      author {
        id
        username
        email
      }
      status
      activeQuestion
      guests {
        id
        username
      }
    }
    imageUrls
    choices {
      id
      body
      correct
      chosenBy
    }
  }`,
  questionInfo : `{
    id
    body
    imageUrls
    session {
      id
      publicId
      author {
        id
        username
        email
      }
      status
      activeQuestion
      guests {
        id
        username
      }
    }
    choices {
      id
      body
      correct
      chosenBy
    }
  }`
}