const validateEmail = (email) => {
    let response = false;
    const RegExp = "^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$"
    const res = email.match(RegExp);
    if (res != null) {
        response = true;
    }

    return response;
}

export default validateEmail;