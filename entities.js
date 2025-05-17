	function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function getTintedColor(color, v) {
    if (color.length >6) { color= color.substring(1,color.length)}
    let rgb = parseInt(color, 16); 
    let r = Math.abs(((rgb >> 16) & 0xFF)+v); if (r>255) r=r-(r-255);
    let g = Math.abs(((rgb >> 8) & 0xFF)+v); if (g>255) g=g-(g-255);
    let b = Math.abs((rgb & 0xFF)+v); if (b>255) b=b-(b-255);
    r = Number(r < 0 || isNaN(r)) ? 0 : ((r > 255) ? 255 : r).toString(16); 
    if (r.length == 1) r = '0' + r;
    g = Number(g < 0 || isNaN(g)) ? 0 : ((g > 255) ? 255 : g).toString(16); 
    if (g.length == 1) g = '0' + g;
    b = Number(b < 0 || isNaN(b)) ? 0 : ((b > 255) ? 255 : b).toString(16); 
    if (b.length == 1) b = '0' + b;
    return "#" + r + g + b;
}

function getAbilityImage(str, hero, cb){
  const image = new Image();
	image.src = `abilities/${str}.png`;
  image.onload = ()=>{//what~  bruh
    cb(image, hero);//its working m8, just not drawing yet su
  }

  image.onerror = ()=>{
    cb(null, hero);
  }
}

class Player{
  constructor(initPack){
    this.x = initPack.x;
    this.y = initPack.y;
    this.vel = [0,0];
    this.lastX = this.lastY = 0;
    this.name = initPack.name;
    this.id = initPack.id;
    this.hat = initPack.hat.split(";");
    this.area = initPack.area;
    this.world = initPack.world;
    this.hero = initPack.hero;
    this.invincible = initPack.inv;
    this.band = initPack.ba;
    this.ghost = initPack.gh;
    this.radius = initPack.radius || 17.14;
    this.energy = initPack.energy;
    this.maxEnergy = initPack.maxEnergy;
    this.baseRadius = 17.14;
    this.speed = initPack.speed;
    this.regen = initPack.regen;
    this.tier = initPack.tier;
    this.boostTimer = initPack.bt;
		this.heuseAbil1 = initPack.h1;
    this.iceProtected = initPack.ip;
    this.celestialRem = initPack.a5;
    this.stealth = initPack.st;
    this.frozen = false;
		this.heusMoveOffset = Math.random()*Math.PI*2;
    this.left = false;
    this.right = false;
    this.up = false;
    this.down = false;
    this.abilityImages = [null, null]; 

		let abil1Name = CONSTANTS.heroes[this.hero]?.ability1 || this.hero + "_1";
		let abil2Name = CONSTANTS.heroes[this.hero]?.ability2 || this.hero + "_2";
		
    if(selfId == this.id) getAbilityImage(abil1Name, this.hero, (r,h)=>{if(h==this.hero)this.abilityImages[0] = r});
    if(selfId == this.id) getAbilityImage(abil2Name, this.hero, (r,h)=>{if(h==this.hero)this.abilityImages[1] = r});

    if (initPack.drownRadius != undefined){
      this.drownRadius = initPack.drownRadius;
    }
    if (initPack.radius != undefined){
      this.radius = initPack.radius;
    }

    this.color = CONSTANTS.heroes[this.hero]?.color || "#bbbbbb";
    this.baseColor = this.color;
    this.frozen = false;
    this.staticFreeze = false;

    if(initPack.newt){
      this.newtonian = initPack.newt;
    }

    this.harden = false;
    this.flow = false;
    
    if(initPack.clay != undefined){
      this.clay = initPack.clay;
    }else{
      this.clay = 0;
    }
    this.dead = initPack.dead;
    
    if(initPack.dTimer){
      this.dTimer = initPack.dTimer;
      
    }else{
      this.dTimer = 60;
    }

    if (initPack.usingZ){
      this.usingZ = initPack.usingZ;
    }
    if (initPack.uX){
      this.usingX = initPack.uX;
    }
    if (initPack.ret != undefined){
      this.retaliation = initPack.ret;
    }

		this.leaveDuelTimer = 0;
		this.duelWon = false;
    this.renderX = this.x;
    this.renderY = this.y;
		this.steam = false;
		this.oldWorld = "Corrupted Core";
    this.special = false;
  }
  updatePack(updatePack){
    this.lastX = this.x;
    this.lastY = this.y;
    if (updatePack.x != undefined){
      this.x = updatePack.x;
    }
    if (updatePack.gh != undefined){
      this.ghost = updatePack.gh;
    }
		if (updatePack.ste != undefined){
			if (updatePack.ste == 2 || updatePack.ste >= 99999){
				this.steam = true;
			}else {
				this.steam = false;
			}
		}
    if (updatePack.st != undefined){
      this.stealth = updatePack.st;
    }
    if (updatePack.invincible != undefined){
      this.invincible = updatePack.invincible;
    }
    if (updatePack.y != undefined){
      this.y = updatePack.y;
    }
		if (updatePack.p != undefined) {
			this.x = updatePack.p[0];
			this.y = updatePack.p[1];
		}
    if (updatePack.bt != undefined){
      this.boostTimer = updatePack.bt;
    }
    if (updatePack.r != undefined){
      this.radius = updatePack.r;
    }
    if (updatePack.s != undefined){
      this.speed = updatePack.s;
    }
    if (updatePack.t != undefined){
      this.tier = updatePack.t;
    }
    if (updatePack.fr != undefined){
      this.frozen = updatePack.fr;
    }
    if (updatePack.sf != undefined){
      this.staticFreeze = updatePack.sf;
    }
    if (updatePack.ip != undefined){
      this.iceProtected = updatePack.ip;
    }
    if (updatePack.uZ != undefined){
      this.usingZ = updatePack.uZ;
    }
    if (updatePack.uX != undefined){
      this.usingX = updatePack.uX;
    }
    if (updatePack.a != undefined){
      this.area = updatePack.a;
			this.renderX = this.x;
			this.renderY = this.y;
      if(currentPlayer == this){
        for(let i in players){
          players[i].hatParts = [];
          players[i].hatParts2 = [];
          
        }
      }
      
    }
    if (updatePack.w != undefined){
			if (this.world == "Duel") {
				projectiles = {};
				console.log("a");
			}
      this.world = updatePack.w;
			this.renderX = this.x;
			this.renderY = this.y;
      
      if(currentPlayer == this){
        for(let i in players){
          players[i].hatParts = [];
          players[i].hatParts2 = [];
          
        }
      }
      
      if(currentPlayer == this && nekosEnabled){
        if(this.world == 'Neko Nightmare' || this.world == 'Neko Nightmare Original'){
          document.body.classList.add("neko");
        }else{
          document.body.classList.remove("neko");
        }
      }
    }
    if (updatePack.d != undefined){
      this.dead = updatePack.d; 
    }
    if (updatePack.e != undefined){
      this.energy = updatePack.e;
    }
    if (updatePack.max != undefined){
      this.maxEnergy = updatePack.max;
    }
    if (updatePack.ba != undefined){
      this.band = updatePack.ba;
    }
    if (updatePack.ret != undefined){
      this.retaliation = updatePack.ret;
    }
    if (updatePack.n != undefined){
      this.newtonian = updatePack.n;
    }
    if (updatePack.regen != undefined){
      this.regen = updatePack.regen;
    }
    if (updatePack.fr != undefined){
      this.frozen = updatePack.fr;
    }
    if (updatePack.sf != undefined){
      this.staticFreeze = updatePack.sf;
    }
    if (updatePack.dT != undefined){
      if (this.dTimer != updatePack.dT){
        leaderboardElement.update(currentPlayer);
      }
      this.dTimer = updatePack.dT;
    }
    if (updatePack.drownRadius != undefined){
      this.drownRadius = updatePack.drownRadius;
    }
    if (updatePack.he != undefined){
      this.hero = updatePack.he;
      this.color = CONSTANTS.heroes[this.hero]?.color || "#bbbbbb";
      this.baseColor = this.color;
      
			let abil1Name = CONSTANTS.heroes[this.hero]?.ability1 || this.hero + "_1";//try it
			let abil2Name = CONSTANTS.heroes[this.hero]?.ability2 || this.hero + "_2";

			if(selfId == this.id) getAbilityImage(abil1Name, this.hero, (r,h)=>{if(h==this.hero)this.abilityImages[0] = r});
			if(selfId == this.id) getAbilityImage(abil2Name, this.hero, (r,h)=>{if(h==this.hero)this.abilityImages[1] = r});
    }
    if (updatePack.h != undefined){
      if(updatePack.h == true){
        this.color = "#780000";
        this.harden = true;
      }else{
        this.color = "#c80000";
        this.harden = false;
      }
    }
    if (updatePack.f != undefined){
      if(updatePack.f == true){
        this.color = "#fa6464";
        this.flow = true;
      }else{
        this.color = "#c80000";
        this.flow = false;
      }
    }
    if (updatePack.c != undefined){
      this.clay = updatePack.c;
    }
    if (updatePack.a5 != undefined){ //celestial X
      this.celestialRem = updatePack.a5;
    }
		if(updatePack.h1 != undefined){
			this.heuseAbil1 = updatePack.h1;
		}

    if(this.hero == "magmax"){
      if(this.harden){
        this.color = "#780000";
      }else if(this.flow){
        this.color = "#fa6464";
      }else{
        this.color = this.color = CONSTANTS.heroes[this.hero]?.color || "#bbbbbb";
      }
    }else if (this.hero == "umbra"){
      this.color = CONSTANTS.heroes[this.hero]?.color || "#bbbbbb"
      if (this.ghost > 0){
        this.color = "#1b243133";
      }
    }else{
      this.color = CONSTANTS.heroes[this.hero]?.color || "#bbbbbb";
    }
	  if (this.invincible && !this.band && this.boostTimer <= 0){
      this.color = getTintedColor(this.color, -50);
    }
    if(this.dead){
      this.color = "black";
      this.harden = false;
      this.flow = false;
    }
  }
  interp(delta){
    let vx = this.lastX - this.x;
    let vy = this.lastY - this.y;
    this.vel[0] = vx == 0 ? this.vel[0] : vx;
    this.vel[1] = vy == 0 ? this.vel[1] : vy;
    let ma = Math.max(Math.abs(this.vel[0]), Math.abs(this.vel[1]));
    this.vel[0] /= ma;
    this.vel[1] /= ma;

    this.renderX = interpolate(this.renderX, this.x, delta);
    this.renderY = interpolate(this.renderY, this.y, delta);
  }
}

class Projectile{
  constructor(initPack){
    this.x = initPack.x;
    this.y = initPack.y;
    this.radius = initPack.radius;
    this.id = initPack.id;
    this.area = initPack.area;
    this.world = initPack.world;
    this.type = initPack.type;
    this.killed = false;
    if (initPack.a != undefined){
      this.angle = initPack.a;
    }
    if (initPack.aura != undefined){
      this.aura = initPack.aura;
    }
    if (initPack.e != undefined){
      this.emergency = initPack.e; //DUDE IM DYING WHY IS IT INCORRECTLY cAPITALIZED - fixed.
    }
    this.renderX = this.x;
    this.renderY = this.y;
		this.rotate = Math.random() * 6.28;
		this.rotateSpeed = Math.random() * 0.015 - 0.03;
  }
  updatePack(updatePack){
    if (updatePack.x != undefined){
      this.x = updatePack.x;
    }
    if (updatePack.y != undefined){
      this.y = updatePack.y;
    }
    if (updatePack.r != undefined){
      this.radius = updatePack.r;
    }
    if (updatePack.e != undefined){
      this.emergency = updatePack.e;
    }
    if (updatePack.a != undefined){
      this.angle = updatePack.a;
    }
    if (updatePack.k != undefined){
      this.killed = updatePack.k;
      for(let i in projectiles){
        if(projectiles[i].killed){
          delete projectiles[i];
        }
      }
    }
    if (updatePack.au != undefined){
      this.aura = updatePack.au;
    }
  }
  interp(delta){
    this.renderX = interpolate(this.renderX, this.x, delta);
    this.renderY = interpolate(this.renderY, this.y, delta);
  }
}

class Enemy{
  constructor(initPack){
    this.x = initPack.x;
    this.y = initPack.y;
    this.radius = Math.max(0, initPack.r);
    this.id = initPack.id;
    this.area = initPack.a;
    this.world = initPack.w;
    this.type = initPack.t;
    this.aura = initPack.au;
    this.disabled = initPack.d;
    this.shattered = initPack.s;
    this.dead = initPack.dea;
    this.energyAura = initPack.ea;
    this.ignited = initPack.ig;
    this.moltenTime = initPack.mt;
    this.lavablobed = initPack.lb;
    this.virusSpread = initPack.vs;
    this.virus = initPack.v;
		this.fluidized = initPack.fl;
  	this.switched = initPack.swi;
    this.killed = false;
    this.immunified = false;
    this.shape = initPack.sh ?? "circle";

    this.renderX = this.x;
    this.renderY = this.y;
		this.anchorRenderX = this.renderX;
		this.anchorRenderY = this.renderY;
    this.decay = initPack.de;
		this.rotate = Math.random() * 6.28;
		this.rotateSpeed = Math.random() * 0.015 - 0.03;
    this.ghost = false;
    this.texture = initPack.texture;
    if(initPack.texture){
      TEXTURE_LOADER.load(initPack.texture, (texture)=>this.texture = texture);
    }
  }
  updatePack(updatePack){
    if(updatePack.g != undefined) {
      this.ghost = true;
    }
    if (updatePack.im != undefined){
      this.immunified = updatePack.im;
      if (this.immunified == true){
        this.shattered = -1000;
      }
    }
    if(updatePack.i != undefined){
			this.anchorRenderX = this.x;
			this.anchorRenderY = this.y;
      this.x = updatePack.i[0];
      this.y = updatePack.i[1];
    }
    if(updatePack.x != undefined){
			this.anchorRenderX = this.x;
      this.x = updatePack.x;
      this.ghost = false;
    }
    if(updatePack.y != undefined){
			this.anchorRenderY = this.y;
      this.y = updatePack.y;
      this.ghost = false;
    }
		if (updatePack.p != undefined) {
			this.anchorRenderX = this.x;
			this.anchorRenderY = this.y;
			this.x = updatePack.p[0];
			this.y = updatePack.p[1];
			this.ghost = false;
		}
    if(updatePack.a != undefined){
      this.aura = updatePack.a;
    }
    if (updatePack.r != undefined){
      this.radius = Math.max(0, updatePack.r);
    }
    if (updatePack.t != undefined){
      this.type = updatePack.t;
    }
    if (updatePack.d != undefined){
      this.disabled = updatePack.d;
    }
    if (updatePack.de != undefined){
      this.decay = updatePack.de;
    }
    if (updatePack.s != undefined){
      this.shattered = updatePack.s;
    }
    if (updatePack.dea != undefined){
      this.dead = updatePack.dea;
    }
    if (updatePack.ea != undefined){
      this.energyAura = updatePack.ea;
      console.log(updatePack.ea)
    }
    
    if (updatePack.ig != undefined){
      this.ignited = updatePack.ig;
    }
    if (updatePack.mt != undefined){
      this.moltenTime = updatePack.mt;
    }
    if (updatePack.lb != undefined){
      this.lavablobed = updatePack.lb;
    }
    if (updatePack.vs != undefined){
      this.virusSpread = updatePack.vs;
    }
    if (updatePack.v != undefined){
      this.virus = updatePack.v;
    }
    if(updatePack.fl != undefined){
      this.fluidized = updatePack.fl;
    }
    if (updatePack.swi !== undefined){
      this.switched = updatePack.swi;
    }
    if (updatePack.k != undefined){
      this.killed = updatePack.k;
    }
  }
  interp(delta){
    if (this.ghost) {
      this.renderX = this.x;
      this.renderY = this.y;
			this.anchorRenderX = this.renderX;
			this.anchorRenderY = this.renderY;
    } else {
      this.renderX = interpolate(this.renderX, this.x, delta);
      this.renderY = interpolate(this.renderY, this.y, delta);
    }
  }
}

class Zone{
  constructor(initPack){
    this.renderX = this.x = initPack.x;
    this.renderY = this.y = initPack.y;
    this.width = initPack.wi;
    this.height = initPack.h;
    this.id = initPack.id;
    this.type = initPack.t;
    this.area = initPack.a;
    this.world = initPack.w;
    this.switched = initPack.s;
  }

  updatePack(updatePack){
    if(updatePack.s != undefined) {
      this.switched = updatePack.s;
    }
    if(updatePack.i != undefined){
      this.x = updatePack.i[0];
      this.y = updatePack.i[1];
    }
  }
  interp(delta){
    /*if (this.ghost) {
      this.renderX = this.x;
      this.renderY = this.y;
    } else {*/
      this.renderX = interpolate(this.renderX, this.x, delta);
      this.renderY = interpolate(this.renderY, this.y, delta);
    //}
  }
}

class NegativeParticle {
  constructor(x, y) {
    this.color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
    this.x = x;
    this.y = y;
    this.angle = Math.random() * Math.PI * 2;
    this.rotAngle = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) / 40;
    this.vx = Math.cos(this.angle);
    this.vy = Math.sin(this.angle);
    this.life = 40;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
    this.rotAngle += this.rotSpeed;
  }
}
class QuestionParticle {
  constructor(x, y) {
    this.color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
    this.x = x;
    this.y = y;
    this.angle = Math.random() * Math.PI * 2;
    this.rotAngle = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) / 10;
    this.vx = Math.cos(this.angle) / 4;
    this.vy = Math.sin(this.angle) / 4;
    this.life = 80;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
    this.rotAngle += this.rotSpeed;
  }
}
class PentagonParticle {
  constructor(x, y) {
    this.color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
    this.x = x;
    this.y = y;
    this.rotAngle = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) / 10;
    this.life = 30;
  }
  update() {
    this.life--;
    this.rotAngle += this.rotSpeed;
  }
}
class AcceleratingParticle {
  constructor(x, y, area) {
    this.color = [227, 102, 163];
    this.x = x;
    this.y = y;
    this.life = 20 + ((area-1)%10)*4;
    this.radius = 12;
    this.area = area;
    this.maxLife =  20 + ((area-1)%10)*4;
  }
  update() {
    this.life--;
    this.radius-= 1/(this.maxLife/5);
    this.color[0] -= (227 - 92) * 1/this.maxLife;
    this.color[1] -= (102 - 181) * 1/this.maxLife;
    this.color[1] -= (163 - 97) * 1/this.maxLife;
    
    //92, 181, 97
  }
}
class BlazingParticle {
  constructor(x, y, area) {
    this.color = [148,183,255];
    this.x = x;
    this.y = y;
    this.life = 50;
    this.radius = 14;
  }
  update() {
    this.life--;
    this.radius-= 1/10;
    if (this.life > 37){
      this.color[0] += (167-148)/13;
      this.color[1] += (196-183)/13;
    }
    else if (this.life > 25){
      this.color[0] += (255-167)/12;
      this.color[1] += (255-196)/12;
    }
    else if (this.life > 12){
      this.color[1] += (159-255)/12;
      this.color[2] += (64-255)/12;
    }
    else{
      this.color[0] += (50-255)/12;
      this.color[1] += (0-255)/12;
      this.color[2] += (0-255)/12;
    }
    
    /*
    if (this.life > 35){
      this.color[0] += 25.5;
      this.color[1] += 25.5;
      if (this.life < 45){
        this.color[2] += 25.5;
      }
      
    }
    else{
      this.color[1] -= 7;
      this.color[0] -= 14;
    }
    */

    for(let i of this.color){
      if (i>255){
        i=255;
      }
      if(i<0){
        i=0;
      }
    }
    
    //92, 181, 97
  }
}

class DrunkParticle {
  constructor(x, y, area) {
    this.color = [255,145,0];
    this.x = x - 2;
    this.y = y - 4;
    this.life = 50;
    this.radius = 13;
    this.angle = 0;
  }
  update() {
    this.x += Math.cos(this.angle) * (4 - this.life/40);
		this.y += Math.sin(this.angle) * (4 - this.life/40);
		this.angle += 0.5;
    
    this.life--;
    this.radius-= 1/12;
    if (this.life > 25){
      this.color[0] -= (255-166)/25;
      this.color[1] -= (145-166)/25;
      this.color[2] -= (0-166)/25;
    }
    else{
      this.color[0] -= (166-30)/25;
      this.color[1] -= (166-235)/25;
      this.color[2] -= (166-30)/25;
    }
    
    /*
    if (this.life > 35){
      this.color[0] += 25.5;
      this.color[1] += 25.5;
      if (this.life < 45){
        this.color[2] += 25.5;
      }
      
    }
    else{
      this.color[1] -= 7;
      this.color[0] -= 14;
    }
    */

    for(let i of this.color){
      if (i>255){
        i=255;
      }
      if(i<0){
        i=0;
      }
    }
    
    //92, 181, 97
  }
}

class FireParticle {
  constructor(x, y) {
    this.color = `rgb(255, 0, 0)`;
    this.x = x;
    this.y = y;
    this.life = 20;
    this.radius = 10;
  }
  update() {
    this.life--;
    this.radius-= 1/4;
  }
}
class ColdParticle {
  constructor(x, y) {
    this.color = [180, 100, 50]
    this.x = x;
    this.y = y;
    this.life = 35;
    this.radius = 14;
  }
  update() {
    this.life--;
    this.color[0] += (220-180)/35;
    this.color[1] += (40-100)/35;
    this.color[2] += (80-50)/35;
    this.radius-= 1/9;
  }
}
class DeveloperParticle {
  constructor(x, y) {
    this.color = [176, 176, 176]
    this.x = x;
    this.y = y;
    this.life = 600;
    this.radius = 14;
  }
  update() {
    this.life--;
    if (this.life > 590){
      this.color[0] += (213-176)/10;
      this.color[1] += (107-176)/10;
      this.color[2] += (237-176)/10;
    }
    else if (this.life > 400){
      this.color[0] += (191-213)/190;
      this.color[1] += (144-107)/190;
      this.color[2] += (232-237)/190;
    }
    else if (this.life > 200){
      this.color[0] += (136-191)/200;
      this.color[1] += (213-144)/200;
      this.color[2] += (235-232)/200;
    }
    else if (this.life > 20){
      this.color[0] += (173-136)/180;
      this.color[1] += (209-213)/180;
      this.color[2] += (161-235)/180;
    }
    else{
      this.color[0] += (161-173)/20;
      this.color[1] += (181-209)/20;
      this.color[2] += (172-161)/20;
    }
    
    this.radius-= 1/240;
  }
}

class DarkParticle {
  constructor(x, y) {
    this.color = `rgb(0, 0, 0)`;
    this.x = x;
    this.y = y;
    this.life = 15;
    this.radius = 9;
  }
  update() {
    this.life--;
    this.radius += 1;
  }
}
class RainbowParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.life = 20;
    this.radius = 13;
  }
  update() {
    this.life--;
    this.radius -= 1/6;
  }
}
class UltraRainbowParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.life = 40;
    this.radius = 14;
  }
  update() {
    this.life--;
    this.radius -= 1/10;
  }
}

class CataParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.life = 25;
    this.radius = 17;
  }
  update() {
    this.life--;
    this.radius -= 1/6;
  }
}
class GlitchParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.life = 20;
    this.radius = 15;
  }
  update() {
    this.life--;
    this.radius -= 1/24;
  }
}

class BronzeParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.life = 40;
    this.radius = 5;
    this.angle = Math.random() * 6.283;
    this.direction = (Math.random() < 0.5) ? 1 : -1;
  }
  update() {
    this.life--;
    this.radius += 0.01;
		this.x += Math.cos(this.angle) * (4 - this.life/30);
		this.y += Math.sin(this.angle) * (4 - this.life/30);
		this.angle += 4.5/40 * this.direction;
    
  }
}
class SilverParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.life = 60;
    this.radius = 5;
    this.angle = Math.random() * 6.283;
    this.direction = (Math.random() < 0.5) ? 1 : -1;
  }
  update() {
    this.life--;
    this.radius += 0.01;
		this.x += Math.cos(this.angle) * (4 - this.life/30);
		this.y += Math.sin(this.angle) * (4 - this.life/30);
		this.angle += 4.5/40 * this.direction;
    
  }
}
class GoldParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.life = 80;
    this.radius = 5;
    this.angle = Math.random() * 6.283;
    this.direction = (Math.random() < 0.5) ? 1 : -1;
  }
  update() {
    this.life--;
    this.radius += 0.01;
		this.x += Math.cos(this.angle) * (4 - this.life/40);
		this.y += Math.sin(this.angle) * (4 - this.life/40);
		this.angle += 4.5/40 * this.direction;
    
  }
}

class SparkleParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.life = 80;
    this.radius = 2;
		this.angle = Math.random() * 6.283;
  }
  update() {
    this.life--;
    this.radius += (Math.random() * 2 - 1)/25;
		this.radius = Math.min(Math.max(1, this.radius), 3);
		this.x += Math.cos(this.angle);
		this.y += Math.sin(this.angle);
		this.angle += (Math.random() * 2 - 1)/40;
  }
}


class StepParticle {
  constructor(x, y, vel, isRight, dist) {
    if (dist == undefined){
      dist = 10;
    }
    this.x = x;
    this.y = y;
    this.life = 80;
    this.isRight = !isRight;
    this.rotAngle = Math.atan2(vel[1], vel[0]) - Math.PI/2;
    
    this.x += (isRight? dist: -dist) * Math.cos(this.rotAngle);
    this.y += (isRight? dist: -dist) * Math.sin(this.rotAngle);
  }
  update() {
    this.life--;
  }
}

class StepParticleShort {
  constructor(x, y, vel, isRight) {
    this.x = x;
    this.y = y;
    this.life = 50;
    this.isRight = !isRight;
    this.rotAngle = Math.atan2(vel[1], vel[0]) - Math.PI/2;
    
    this.x += (isRight? 5: -5) * Math.cos(this.rotAngle);
    this.y += (isRight? 5: -5) * Math.sin(this.rotAngle);
  }
  update() {
    this.life--;
  }
}
class PlanetWaterParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.life = 80;
    this.radius = 12;
  }
  update() {
    this.life--;
    this.radius += 0.01;
  }
}
class PlanetLandParticle {
  constructor(x, y, vel) {
    this.x = x;
    this.y = y;
    this.life = 80;
    this.radius = 7;
    this.rotAngle = Math.atan2(vel[1], vel[0]) - Math.PI/2;
    
    this.x += (Math.random() * 14 - 7) * Math.cos(this.rotAngle);
    this.y += (Math.random() * 14 - 7)* Math.sin(this.rotAngle);
  }
  update() {
    this.life--;
    this.radius += 0.01;
  }
}

class ChargedParticle {
  constructor(x, y, vel, isRight) {
    this.x = x;
    this.y = y;
    this.life = 80;
    this.isRight = !isRight;
    this.rotAngle = Math.atan2(vel[1], vel[0]) - Math.PI/2;
    
    this.x += (isRight? 10: -10) * Math.cos(this.rotAngle);
    this.y += (isRight? 10: -10) * Math.sin(this.rotAngle);

    this.radius = 4;
    this.color = [0, 247, 255]
  }
  update() {
    this.life--;
    this.color[0] += (255 - 0)/80;
    this.color[1] += (0 - 247)/80;
    this.color[2] += (0 - 255)/80;
  }
}
class DoubleParticle {
  constructor(x, y, vel, isRight, color) {
    this.x = x;
    this.y = y;
    this.life = 80;
    this.isRight = !isRight;
    this.rotAngle = Math.atan2(vel[1], vel[0]) - Math.PI/2;
    
    this.x += (isRight? 10: -10) * Math.cos(this.rotAngle);
    this.y += (isRight? 10: -10) * Math.sin(this.rotAngle);
    
    this.radius = 4;
    if (color == 0){
      this.color = "#9E2A2A";
    }
    else{
      this.color = "#682A9E";
    }
  }
  update() {
    this.life--;
  }
}

class SteamParticle {
  constructor(x, y, vel, isRight) {
    this.x = x;
    this.y = y;
    this.life = 40;
    this.radius = 16;
  }
  update() {
    this.life--;
    this.radius -= 16/41;
  }
}

