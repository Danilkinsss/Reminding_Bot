const users = []
const collection = new Map()

class User {
  constructor(id, first_name, username) {
    this.id = id
    this.first_name = first_name
    this.username = username
  }

  olden() {
    this.id++
  }
}

class Message {
  constructor(chat_id, type, caption, file_id) {
    this.chat_id = chat_id
    this.type = type
    this.caption = caption
    this.file_id = file_id
  }
}

module.exports = {
  users,
  User,
  Message,
}

// exports.messages = messages
// let messages = []
// const Alice = new User('Alice', 32) // { "name": "Alice", "age": 32}
// const Bob = new User('Bob', 45) // { "name": "Bob", "age": 45}
// no function in object's properties, but it's accessible

// console.log(Alice.olden) // olden () { this.age++ }

/*


model Message {
  id         Int      @id @default(autoincrement())
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  text       String?  @db.VarChar(255)
  hasContent Boolean  @default(false)
  content    String?
  author     User     @relation(fields: [authorId], references: [id])
  authorId   Int
  chat       Int      @unique
}

model User {
  id         Int       @id @default(autoincrement())
  first_name String
  username   String    @unique
  posts      Message[]
}



*/
const text = {
  update_id: 618936828,
  message: {
    message_id: 212,
    from: {
      id: 300529652,
      is_bot: false,
      first_name: 'Danil',
      username: 'danilkinsss',
      language_code: 'en',
    },
    chat: {
      id: 300529652,
      first_name: 'Danil',
      username: 'danilkinsss',
      type: 'private',
    },
    date: 1729698854,
    text: 'Е',
  },
}

const photoFile = {
  update_id: 618936830,
  message: {
    message_id: 216,
    from: {
      id: 300529652,
      is_bot: false,
      first_name: 'Danil',
      username: 'danilkinsss',
      language_code: 'en',
    },
    chat: {
      id: 300529652,
      first_name: 'Danil',
      username: 'danilkinsss',
      type: 'private',
    },
    date: 1729698965,
    photo: [[Object], [Object], [Object], [Object]],
    caption: 'Пен',
  },
}

const videoFile = {
  update_id: 618936827,
  message: {
    message_id: 211,
    from: {
      id: 300529652,
      is_bot: false,
      first_name: 'Danil',
      username: 'danilkinsss',
      language_code: 'en',
    },
    chat: {
      id: 300529652,
      first_name: 'Danil',
      username: 'danilkinsss',
      type: 'private',
    },
    date: 1729698146,
    forward_origin: { type: 'user', sender_user: [Object], date: 1729697901 },
    forward_from: {
      id: 300529652,
      is_bot: false,
      first_name: 'Danil',
      username: 'danilkinsss',
      language_code: 'en',
    },
    forward_date: 1729697901,
    video: {
      duration: 5,
      width: 720,
      height: 1280,
      mime_type: 'video/mp4',
      thumbnail: [Object],
      thumb: [Object],
      file_id:
        'BAACAgIAAxkBAAPHZxkYAq-4xGyCiiT3ZGQv_D-2t8cAAj9bAAIMnMhI1uFALubo2Z42BA',
      file_unique_id: 'AgADP1sAAgycyEg',
      file_size: 1713210,
    },
    caption: 'Tndt',
  },
}
