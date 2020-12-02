let users = [];

// join user to chat
function userJoin(id, username, room) {
  const user = { id, username, room };
  users.push(user);
  return user;
}

// get current user
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}

function userLeave(id) {
  users = users.map(user => user.id !== id);
  return users;
}

function getRoomUsers(room) {
  return {
    room,
    users: users.filter(user => user.room === room),
  };
}

module.exports = { userJoin, getCurrentUser, userLeave, getRoomUsers };
