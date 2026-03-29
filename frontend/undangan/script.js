document.querySelectorAll('a[href="#login"]').forEach(a=>{
    a.addEventListener('click',e=>{e.preventDefault();document.getElementById('login').scrollIntoView({behavior:'smooth'});});
});

function doLogin() {
    const user = document.getElementById('inputUser').value;
    const pass = document.getElementById('inputPass').value;

    if (user.trim() !== "" && pass.trim() !== "") {
        window.location.href = "utama.html";
    } else {
        document.getElementById('inputUser').focus();
    }
}

document.querySelectorAll('.login__input').forEach(function(el){
    el.addEventListener('keydown',function(e){if(e.key==='Enter')doLogin();});
});

var io=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
    if(entry.isIntersecting) entry.target.classList.add('visible');
    });
},{threshold:0.12});
document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});