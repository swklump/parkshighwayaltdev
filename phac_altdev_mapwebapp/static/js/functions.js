// Populates session variables
function set_session_var_type(s1){
    var s1 = document.getElementById(s1);
    localStorage.setItem(s1.id+'_key', s1.value);
}

