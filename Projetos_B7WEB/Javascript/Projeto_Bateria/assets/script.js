//Adiciona um listener em todo o body, onde ele reconhece quando a tecla é levantada, enviado para a função playSound qual a tecla apertada em tudo minúsculo
document.body.addEventListener('keyup', (event)=>{
    playSound(event.code.toLowerCase());
});

document.querySelector('.composer button').addEventListener('click', () => {
    let song = document.querySelector('#input').value;

    if(song !== ''){
        let songArray = song.split('');
        playComposition(songArray);
    }

})
//Current time é para reiniciar o som, se outro for apertado
function playSound(sound){
    let audioElement = document.querySelector(`#s_${sound}`);
    let keyElement = document.querySelector(`div[data-key="${sound}"]`)

    if(audioElement){
        audioElement.currentTime = 0;
        audioElement.play();
    }

    if(keyElement){
        keyElement.classList.add('active');

        setTimeout(()=>{
            keyElement.classList.remove('active')
        },300);
    }
}

function playComposition(songArray){
    let wait = 0;

    for(let songItem of songArray){
        setTimeout(()=>{
            playSound(`key${songItem}`);
        }, wait);
        wait += 250;
    }
}