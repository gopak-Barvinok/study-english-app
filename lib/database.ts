import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(process.cwd(), 'data.db'));

// Создаем таблицу (если ее нет)
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId TEXT UNIQUE NOT NULL,
    name TEXT,
    surname TEXT,
    username TEXT UNIQUE,
    email TEXT UNIQUE NOT NULL,
    languages TEXT DEFAULT '[]',
    registrationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    image TEXT,
    roomIds TEXT
  )
`);
console.log("Table 'users' has been initialized");

const updateLanguages = (languages: string, userId: string) => {
  const stmt = db.prepare('UPDATE users SET languages = ? WHERE userId = ?');
  stmt.run(JSON.stringify(languages), userId);
};

const updateRoomIds = (roomIds: string, userId: string) => {
  const stmt = db.prepare('UPDATE users SET roomIds = ? WHERE userId = ?');
  stmt.run(roomIds, userId);
}

const returnExistingUser = (userId: string) => {
  return db.prepare(
    'SELECT * FROM users WHERE userId = ?'
  ).get(userId);
};

const insertIntoUsers = (
  userId: string,
  name: string,
  surname: string,
  email: string,
  username: string,
  languages: string,
  registrationDate: string,
  image: string,
  roomIds: string,
) => {
  db.prepare(`
    INSERT INTO users (userId, name, surname, email, username, languages, registrationDate, image, roomIds)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
    userId,
    name,
    surname,
    email,
    username,
    languages,
    registrationDate,
    image,
    roomIds,
  );
};

db.exec(`
  CREATE TABLE IF NOT EXISTS room_users (
    room_id TEXT,
    participants_id TEXT NOT NULL,
    created_at INTEGER DEFAULT (strftime('%s','now')),
    learned_words TEXT
  )
`);
console.log("Table 'room_users' has been initialized");

const joinToRoom = (
  roomId: string,
  participantsId: string,
  createdAt: string,
) => {
  db.prepare(`
    INSERT INTO room_users (room_id, participants_id, created_at) VALUES (?, ?, ?)    
`).run(roomId, participantsId, createdAt);
};

const requestUsersByRoomId = (roomId: string) => {
  return db.prepare(
    'SELECT participants_id FROM room_users WHERE room_id = ?'
  ).get(roomId);
}

const insertLearnedWords = (roomId: string, words: string) => {
  db.prepare(
    `UPDATE room_users SET learned_words = ? WHERE room_id = ?`
  ).run(words, roomId);
}

const requestLearnedWords = (roomId: string) => {
  return db.prepare(
    `SELECT learned_words FROM room_users WHERE room_id = ?`
  ).get(roomId);
}

export {
  db,
  updateLanguages,
  updateRoomIds,
  returnExistingUser,
  insertIntoUsers,
  joinToRoom,
  requestUsersByRoomId,
  insertLearnedWords,
  requestLearnedWords,
};