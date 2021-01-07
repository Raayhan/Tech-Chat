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

//User leaves chat

function userLeave(id){
    const index = users.findIndex(user =>user.id === id);
    
    if(index !== -1){
       return users.splice(index, 1)[0];
    }
}

//Get Section Users

function getSectionUsers(section){
   return users.filter(user => user.section === section);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getSectionUsers
};