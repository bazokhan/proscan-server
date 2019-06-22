module.exports = {
  sessionFragment: `fragment SessionFragment on Session {
    id
    publicId
    author {
      id
      username
      email
    }
    status
    questions {
      id
      body
      imageUrls
      choices {
        id
        body
        correct
        chosenBy
      }
    }
    activeQuestion
    guests {
      id
      username
    }
  }`,
  sessionInfo : `{
    id
    publicId
    author {
      id
      username
      email
    }
    status
    questions {
      id
      body
      imageUrls
      choices {
        id
        body
        correct
        chosenBy
      }
    }
    activeQuestion
    guests {
      id
      username
    }
  }`
}