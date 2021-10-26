let personaje = document.querySelector(".personaje");
let enemy = document.querySelector(".enemy");
let ring = document.querySelector(".coleccionable");

let puntaje = 0;
let level = 1;
let tiempo = 0;
let tColision;
let temporizador;
let tocoRoca = false;

personaje.addEventListener('keydown',saltoPersonaje);
//Verifica si se apreto la flecha para arriba.
document.body.onkeyup = function(e){
    if(e.keyCode == 87){
        saltoPersonaje()
    }
}
//Intercambia las clases para que el personaje pase de corriendo a saltando, y cuando termina el salto, vuelve a corriendo.
function saltoPersonaje(){
    if(personaje.classList.contains("corriendo")){
        personaje.classList.remove("corriendo");
        personaje.classList.add("saltando");
        personaje.addEventListener("animationend", function() {
            personaje.classList.add("corriendo");
            personaje.classList.remove("saltando");
        });
    }
}
//Aparece una roca, varia la imagen entre una roca y unos pinches. 
function aparicionStone(rand){
    if(!tocoRoca && !enemy.classList.contains("lento")){
        enemy.classList.add("lento");

        if(rand < 1500){
            enemy.classList.add("stone");
        }else{
            enemy.classList.add("spike");
        }
        enemy.addEventListener("animationend", function(){
            enemy.classList.remove("lento");
            enemy.classList.remove("stone");
            enemy.classList.remove("spike");
        })

    }

}
//Aparacere un anillo
function aparicionRing(){
    if(!tocoRoca && !ring.classList.contains("ring")){
        ring.classList.add("ring");
        ring.addEventListener("animationend", function(){
            ring.classList.remove("ring");
        })

    }
}
//Se detectan las colisiones con el anillo o la roca, comparando posiciones de los div's.
function DetectarColision(){
    let top_pj = window.getComputedStyle(personaje).getPropertyValue('top');
    let derecha_pj = window.getComputedStyle(personaje).getPropertyValue('right');
    let izquierda_pj = window.getComputedStyle(personaje).getPropertyValue('left');
    
    let top_ring = window.getComputedStyle(ring).getPropertyValue('top');
    let derecha_ring = window.getComputedStyle(ring).getPropertyValue('right');
   
    let izquierda_enemy = window.getComputedStyle(enemy).getPropertyValue('left');

    if(!tocoRoca && derecha_ring != "auto" && ((parseInt(derecha_ring) - (parseInt(derecha_pj)) >= -15)) && (parseInt(top_ring) - parseInt(top_pj)) >= -10){
        puntaje++;
        document.querySelector("#coleccion").play();
        ring.classList.remove("ring");
        document.querySelector("#score").textContent = "Puntaje: " + puntaje;
    }
    /*Utilizo este if, porque en la animacion uso que 
    vaya hasta el -50% para que no baje la velocidad cuando llegue a donde esta el personaje.
    Entonces una vez que pasa el 0, la borro*/
    if(!tocoRoca && parseInt(izquierda_enemy) <= 0){
        
        enemy.classList.remove("lento");
        enemy.classList.remove("stone");
        enemy.classList.remove("spike");
    }
    if(!tocoRoca && izquierda_enemy != "auto" && parseInt(izquierda_enemy) - parseInt(izquierda_pj) <= 0 && parseInt(top_pj) >= 330){
        tocoRoca = true;
    }
    if(tocoRoca){
        gameOver();
    }
    if(puntaje == 5){
        cambioLevel();
    }
}

function cambioLevel(){
        level++;
        enemy.style.setProperty('animation-duration', '2.5s');
        document.querySelector(".fondo").style.setProperty("background-image", 'url("./sites/img/background2.png")');
}

function gameOver(){
    document.querySelector("#perder").play();
    document.querySelector("#gameover").textContent = "Game Over. Score: " + puntaje*tiempo;
    personaje.classList.remove("corriendo");
    personaje.classList.add("muerte");
    ring.classList.remove("ring");
    clearInterval(temporizador);
    clearInterval(tColision);
    document.querySelector(".fondo").classList.remove("parallax1");
    document.querySelector(".nubes").classList.remove("parallax2");
    document.querySelector(".botonPrincipal").classList.remove("esconder");

}

function iniciarJuego(){
    puntaje = 0;
    level = 1;
    tiempo = 0;
    tocoRoca = false;

    if(personaje.classList.contains("muerte")){
        personaje.classList.remove("muerte");
        personaje.classList.add("corriendo");
        document.querySelector("#gameover").textContent = "";
        document.querySelector(".fondo").style.setProperty("background-image", 'url("./sites/img/fondo.png")');
        enemy.style.setProperty('animation-duration', '3.5s');
    }

    document.querySelector(".botonPrincipal").classList.add("esconder");
    document.querySelector("#gameover").classList.remove("esconder");
    document.querySelector(".fondo").classList.add("parallax1");
    document.querySelector(".nubes").classList.add("parallax2");
    document.querySelector("#timer").textContent = "Tiempo: " + tiempo;
    document.querySelector("#score").textContent = "- Puntaje: " + puntaje;
    document.querySelector("#level").textContent = "- Level" + level;
    
    tColision = setInterval(DetectarColision,0);
    //Uso dos set interval con random para que aparezcan dentro de los 3 segundos, tanto los anillos como las rocas.
    setInterval(function loop() {
        let rand = Math.round(Math.random() * (3000 - 500)) + 500;
        setTimeout(function() {
            if(!tocoRoca){
                aparicionRing();
                loop();
            }
        }, rand);
    }());
    
    setInterval(function loop() {
        let rand = Math.round(Math.random() * (3000 - 500)) + 500;
        setTimeout(function() {
            if(!tocoRoca){
                aparicionStone(rand);
                loop();
            }
        }, rand);
    }());
    
    temporizador = setInterval(function(){
        tiempo++;
        document.querySelector("#timer").textContent = "Tiempo: " + tiempo;
    },1000);
}


document.querySelector('.empezar').addEventListener('click',iniciarJuego);

