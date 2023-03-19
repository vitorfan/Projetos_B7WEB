let digitalElement = document.querySelector('.digital');
let sElement = document.querySelector('.p_s');
let mElement = document.querySelector('.p_m');
let hElement = document.querySelector('.p_h');

// Funçóes getHours, getMinutes, getSeconds já existem dentro da Date()
function updateClock(){
    let now = new Date();
    let hour = now.getHours();
    let minute = now.getMinutes();
    let second = now.getSeconds();

    digitalElement.innerHTML = `${fixZero(hour)}:${fixZero(minute)}:${fixZero(second)}`

    let sDeg = ((360 / 60) * second) - 90;
    let mDeg = ((360 / 60) * minute) - 90;
    let hDeg = ((360 / 12) * hour) - 90;
    sElement.style.transform = `rotate(${sDeg}deg)`;
    mElement.style.transform = `rotate(${mDeg}deg)`;
    hElement.style.transform = `rotate(${hDeg}deg)`;
}

//Caso a hora tenha apenas 1 digito, ele não ficará formatado corretamente, e essa função irá adicionar um '0' a frente do número
function fixZero(time){
    return time < 10 ? `0${time}` : time;
}

//Cria uma função que irá rodar infinitamente, em um período determinado de tempo
//No caso irá rodar a updateClock com 1000 ms de intervalo
setInterval(updateClock, 1000)
updateClock();