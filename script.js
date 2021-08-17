//événement de condition d'action attaché la fenêtre
// on demande à une fonction de s'exécuter au chargement de la fenêtre
window.onload = function(){

  //on place ici la déclaration préalable des var communes aux fonctions (dans leur fonction englobante)
  var canvasWidth = 900;
  var canvasHeight = 600;
  var blockSize = 30;
  var ctx;
  // le délai sert à rythmer l'avancement du serpent 
  // sa durée est courte pour un effet de continuité (1 seconde: 1000 millisecondes)
  var delay = 100;
  var xCoord = 0;
  var yCoord = 0;
  //serpent et pomme
  var snakee;
  var applee;
  //30px*30px = 900 : bloc largeur *? = largeur de l'écran
  var widthInBlocks = canvasWidth/blockSize;
  //30px*20px = 600 : bloc hauteur *? = hauteur de l'écran
  var heightInBlocks = canvasHeight/blockSize;
  var score;
  var timeOut;

  //on appelle la fonction pour qu'elle s'exécute
  //le .html appelle le fichier js qui déclenche la fonction à l'ouverture de la fenêtre
  init();

  //création d'une fonction d'initialisation (init = nom standardisé)
  function init(){
    //1 créer 1 canvas (plan de jeu) + dimensions + bordure
    var canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.border = "30px solid gray";
    canvas.style.margin = "50px auto";
    canvas.style.display = "block";
    canvas.style.backgroundColor = "#ddd";  
    //1 créer 1 canvas (plan de jeu) + dimensions + bordure
    //2 accroche un tag (append child) au body
    //accroche le tag canvas (plan de jeu) au body
    document.body.appendChild(canvas);
    //3 on crée le contexte pour pouvoir dessiner dans le canvas
    ctx = canvas.getContext('2d');
    //creation d'un serpent, 1 pomme, le score
    snakee = new Snake([[6,4],[5,4],[4,4],[3,4],[2,4]],"right");
    applee = new Apple([10,10]);	
	  score = 0;
    //on appelle la fonction refresh créée ci-dessous
    refreshCanvas();
  }

  //création d'une fonction de refresh (mouvement du serpent)
  function refreshCanvas(){
    //on appelle la méthode advance
    snakee.advance();

    //si collision : fin partie
    if (snakee.checkCollision()){
      gameOver();
    }
    //sinon si mange pomme score +1
    else {
      if (snakee.isEatingApple(applee)){
        score++;
        snakee.ateApple = true;
        //donne new position à la pomme et vérifie que position pomme pas sur le serpent (tant que = recomence)
        do {
          applee.setNewPosition(); 
        } while(applee.isOnSnake(snakee));
      }

      // on supprime les données: on efface hauteur et largeur du canvas depuis les marges 0
      ctx.clearRect(0,0,canvasWidth,canvasHeight);

      //affiche dans l'ordre : 1 = score, 2 serpent, 3 pomme
        drawScore();
        //on appelle la methode du dessin du serpent, de la pomme
        snakee.draw();
        applee.draw();

        //setTimeout exécute la fonction refreshCanvas(à l'intérieur de laquelle on est) à chaque fois qu'un délai est passé (fonction, délai) ATTENTION : si on utilise pas la var timeOut que l'on nettoie au redémarrage (fonction restart), les secondes se multiplient, le serpent accélère)
        timeOut = setTimeout(refreshCanvas,delay);
    }
  }

  function gameOver(){
    ctx.save();
    //CSS
    ctx.font = "bold 70px sans-serif";
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 5;
    var centreX = canvasWidth / 2;
    var centreY = canvasHeight / 2;
    ctx.strokeText("Game Over", centreX, centreY - 180);
    ctx.fillText("Game Over", centreX, centreY - 180);
    ctx.font = "bold 30px sans-serif";
    ctx.strokeText("Appuyer sur la touche Espace pour rejouer", centreX, centreY - 120);
    ctx.fillText("Appuyer sur la touche Espace pour rejouer", centreX, centreY - 120);
    ctx.restore();
  }

  function restart(){
      snakee = new Snake([[6,4],[5,4],[4,4],[3,4],[2,4]],"right");
      applee = new Apple([10,10]);
      score = 0;
      clearTimeout(timeOut);
      refreshCanvas();
  }

    //idem game over adapté + css score
  function drawScore(){
      ctx.save();
      ctx.font = "bold 200px sans-serif";
      ctx.fillStyle = "gray";
      ctx.textAlign = "center";
      //pour affichage : remettre la ligne de base au centre
      ctx.textBaseline = "middle";
      var centreX = canvasWidth / 2;
      var centreY = canvasHeight / 2;
      //nbre en string, affichage placé au milieu du canvas
      ctx.fillText(score.toString(), centreX, centreY);
      ctx.restore();
  }


    //fonction de création du mouvement du serpent
    function drawBlock(ctx, position){
    
      //dessin des blocs du corps: 
      //la position[0] de l'array * la taille de chaque bloc
      var x = position[0] * blockSize;
      var y = position[1] * blockSize;

      ctx.fillRect(x,y,blockSize,blockSize);
    }

  //fonction de création du serpent
  function Snake(body, direction){
    
    //constructeur :
    this.body = body;
    this.direction = direction;
    this.ateApple = false;

    //fonction de dessin du serpent
    this.draw = function(){
      // on sauve le contexte
      ctx.save();
      ctx.fillStyle = "#ff0000";
      //boucle tant que i est inférieur au corps du serpent on ajoute i au serpent (grossit tant qu'il le peut)
      for( var i = 0; i < this.body.length; i++ ){

        //appel de la fonction créée ci-dessus (dessin du serpent)
        drawBlock(ctx, this.body[i]);
      }
      //restaurer le contexte
      ctx.restore();
    };

    //methodec qui copie le bloc de la tête que l’on place devant le bloc de l’ancienne tête et on efface le bloc de la queue
    this.advance = function(){
      //crée 1 copie de l'élément (situé à l'indice 0 du body) : slice
      var nextPosition = this.body[0].slice();

      //on ajoute la nouvelle position à l'array pour le futur dessin
      switch(this.direction)
      {
        case "left":
          //ancienne position(x) - 1 (nextPosition[0]-1)
          nextPosition[0] -= 1;
          break;
        case "right":
          //ancienne position(x) + 1 (nextPosition[0]+1)
          nextPosition[0] += 1;
          break;
        case "down":
          //ancienne position(y) + 1 (nextPosition[0]+1)
          nextPosition[1] += 1;
          break;
        case "up":
          //ancienne position(y) - 1 (nextPosition[0]-1)
          nextPosition[1] -= 1;
          break;
        default:
          //fonction de message d'erreur
          throw("invalide direction");
      }

      this.body.unshift(nextPosition);
      // si n'a pas mangé de pomme = différent de true
      if(!this.ateApple)
      // pop supprime le dernier élément de l'array (enlève la queue du serpent quand se déplace)
      this.body.pop();
      // sinon : n'enlève pas le dernier bloc : le serpent grandit
      else
        this.ateApple = false
    };

    //ajout de la direction (trajet serpent)
    this.setDirection = function(newDirection){
      //directions permises (selon touche : en haut ou en bas)
      var allowedDirections;
      switch(this.direction)
      {
        case "left":
        case "right":
          allowedDirections = ["up","down"];
          break;
        case "down":
        case "up":
          allowedDirections = ["left","right"];
          break;
        default:
          //fonction de message d'erreur
          throw("invalide direction");
      }
      //si l'index de la newDirection est sup à -1, elle est autorisée
      if(allowedDirections.indexOf(newDirection) > -1)
      {
        this.direction = newDirection;
      }
    };

    //on perd si on prend 1 mur ou si on se marche dessus
    this.checkCollision = function(){
      var wallCollision = false;
      var snakeCollision = false;
      var head = this.body[0];
      var rest = this.body.slice(1);
      var snakeX = head[0];
      var snakeY = head[1];
      var minX = 0;
      var minY = 0;
      var maxX = widthInBlocks - 1;
      var maxY = heightInBlocks - 1;
      var isNotBetweenHorizontalWalls = snakeX < minX || snakeX > maxX;
      var isNotBetweenVerticalWalls = snakeY < minY || snakeY > maxY;
      
      if (isNotBetweenHorizontalWalls || isNotBetweenVerticalWalls)
        wallCollision = true;
      
      for (var i=0 ; i<rest.length ; i++){
        if (snakeX === rest[i][0] && snakeY === rest[i][1])
          snakeCollision = true;
      }     
      return wallCollision || snakeCollision;        
    };

    this.isEatingApple = function(appleToEat){
      var head = this.body[0];
      if (head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
        return true;
      else
        return false;
    }
  }

  //  constructeur de la pomme (un seul bloc mais rond : 
  // a 1 position et 1 rayon)
  function Apple(position){
    this.position = position;
    
    this.draw = function(){
      ctx.save();
      ctx.fillStyle = "#33cc33";
      ctx.beginPath();
      var radius = blockSize/2; //rayon
      var x = this.position[0]*blockSize + radius;
      var y = this.position[1]*blockSize + radius;
      //fonction native de dessin de cercle
      ctx.arc(x, y, radius, 0, Math.PI*2, true);
      ctx.fill();
      ctx.restore();
    };
    
    this.setNewPosition = function(){
        var newX = Math.round(Math.random()*(widthInBlocks-1));
        var newY = Math.round(Math.random()*(heightInBlocks-1));
        this.position = [newX,newY];
    }; 
    
    // si la pomme est sur le serpent: retourner vrai, sinon, 7)	Ajout de style
    this.isOnSnake = function(snakeToCheck){
        var isOnSnake = false;

        //on passe sur chacun des blocs du corps du serpent
        for (var i=0 ; i < snakeToCheck.body.length ; i++){
          //si x de la pomme = x du serpent et y = y
            if(this.position[0] === snakeToCheck.body[i][0] && this.position[1] === snakeToCheck.body[i][1]){
                isOnSnake = true;     
            }
        }
        return isOnSnake;
    };
  }

  //événement de condition d'action attaché au document
  //(quand l'user appuie sur 1 touche de son clavier)
  document.onkeydown = function handleKeyDown(e){

    //donne le code de la touche appuyée
    var key = e.keyCode;
    var newDirection;
    switch(key)
    {
      case 37:
        newDirection = "left";
        break;
      case 38:
        newDirection = "up";
        break;
      case 39:
        newDirection = "right";
        break;
      case 40:
        newDirection = "down";
        break;
	  case 32:
        restart();
        return;
    default:
      //arrêt
      return;
    }
    //on appelle la fonction de direction
    snakee.setDirection(newDirection);
  };
}
