const isAdmin = (userRole) => {

    if(userRole === "ADMIN"){
        return true;
    }
    return false;
}

export default isAdmin;