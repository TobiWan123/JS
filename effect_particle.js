var particleModule = (function () {

  const canvas = document.getElementById('particleFrame');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  var particleArray;

  // prevent bug on resize
  window.onresize = function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    setTimeout( () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }, 1000);
  }

  //get mouse position

  let mouse = {
    x: null,
    y: null,
    radius: (canvas.height / 80) * (canvas.width / 80)
  }

  window.addEventListener('mousemove',
    function (event) {
      mouse.x = event.x;
      mouse.y = event.y;
    });


  // create particle


  class Particle {
    constructor(x, y, directionX, directionY, size, color) {
      this.x = x;
      this.y = y;
      this.directionX = directionX;
      this.directionY = directionY;
      this.size = size;
    }

    // method to draw individual particle

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
      ctx.fillStyle = "rgba(255, 255 , 255, 0.4)";
      ctx.fill();
    }

    // check particle position, check mouse position, move the particle,
    // draw the particle

    update() {

      // check if particle is still within canvas

      if (this.x > canvas.width || this.x < 0) {
        this.directionX = -this.directionX;
      }
      if (this.y > canvas.height || this.y < 0) {
        this.directionY = -this.directionY;
      }

      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dy + dy * dy);

      // collison

      /*   if (distance < (mouse.radius + this.size) / 4){
               if(mouse.x < this.x && this.x < canvas.width - this.size * 10){
                   this.x += 10 ;
               }
               if(mouse.x > this.x && this.x > this.size * 10){
                   this.x -= 10 ;
               }
               if(mouse.y < this.y && this.y < canvas.height - this.size * 10){
                   this.y += 10 ;
               }
               if(mouse.y > this.y && this.y > this.size * 10){
                   this.y -= 10 ;
               }
           }

           */

      // move particle

      this.x += this.directionX;
      this.y += this.directionY;

      // draw particle

      this.draw();
    }


  }

  // create particle array

  function init() {

    particleArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 15000;

    for (let i = 0; i < numberOfParticles; i++) {

      let size = (Math.random() * 5) + 1;
      let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
      let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
      let directionX = (Math.random() * 5) - 2.5;
      let directionY = (Math.random() * 5) - 2.5;
      let color = "white";

      particleArray.push(new Particle(x, y, directionX, directionY, size, color));

    }
  }

  // animation loop

  function animate() {

    requestAnimationFrame(animate);

    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particleArray.length; i++) {

      particleArray[i].update();

    }

    connect();
  }

  // check if particles are close enough to dreaw line between them

  function connect() {
    for (let a = 0; a < particleArray.length; a++) {
      for (let b = a; b < particleArray.length; b++) {

        let distance = ((particleArray[a].x - particleArray[b].x)
          * (particleArray[a].x - particleArray[b].x))
          + ((particleArray[a].y - particleArray[b].y)
            * (particleArray[a].y - particleArray[b].y));

        if (distance < (canvas.width / 7) * (canvas.height / 7)) {

          ctx.strokeStyle = "rgba(255, 255 , 255, 0.3)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particleArray[a].x, particleArray[a].y);
          ctx.lineTo(particleArray[b].x, particleArray[b].y);
          ctx.stroke();
        }
      }
    }
  }

  init();
  animate();

})();


