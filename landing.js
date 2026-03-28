document.querySelectorAll('a[href="#login"]').forEach(a=>{
    a.addEventListener('click',e=>{e.preventDefault();document.getElementById('login').scrollIntoView({behavior:'smooth'});});
});

function doLogin(){
    var u=document.getElementById('inputUser').value.trim();
    var p=document.getElementById('inputPass').value.trim();
    if(!u||!p){
    var card=document.querySelector('.login__glass');
    card.classList.remove('shake');
    void card.offsetWidth;
    card.classList.add('shake');
    return;
    }
    alert('Selamat datang, '+u+'! \uD83C\uDF89');
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