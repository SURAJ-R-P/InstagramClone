const valid = ({full_name, user_name, email_id, password, cf_password, gender}) => {
    const err = {}

    if(!full_name) 
    {
        err.full_name = "Please add your Full Name."
    }
    else if(full_name.length > 25)
    {
        err.full_name = "Full Name is up to 25 characters long."
    }

    if(!user_name) 
    {
        err.user_name = "Please add your User Name."
    }
    else if(user_name.replace(/ /g, '').length > 25)
    {
        err.user_name = "User Name is up to 25 characters long."
    }

    if(!email_id) 
    {
        err.email_id = "Please add your Email Id."
    }
    else if(validateEmail(email_id))
    {
        err.email_id = "Email Id format is incorrect."
    }

    if(!password) 
    {
        err.password = "Please add your Password."
    }
    else if(password.length < 8)
    {
        err.password = "Password must be at least 8 characters."
    }

    if(password!== cf_password) 
    {
        err.cf_password = "Confirm Password did not match."
    }

    return {
        errMsg : err,
        errLength : Object.keys(err).length 
    }
}

function validateEmail(email){ 
    var re = /^(([^<>()[]\\.,;:\s@\"]+(\.[^<>()[]\\.,;:\s@\"]+)*)|(\".+\"))@(([[0-9]{1,3}\‌​.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; 
    return re.test(email); 
}

export default valid