const users = [];

//Join User to Chat

function userJoin(id, username, section){

    const user = {id, username, section};
    users.push(user);
    return user;

}

//Get current user

function getCurrentUser(id){

    return users.find(user =>user.id === id);
}

module.exports = {
    userJoin,
    getCurrentUser
};