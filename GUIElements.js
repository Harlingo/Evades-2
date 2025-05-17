var toggleLB = true;
var toggleChat = true;
var toggleHeroCard = true;
var toggleTiles = (localStorage.getItem("tiles-enabled") || "false") == "true";
var mouseEnabled = (localStorage.getItem("mouse-enabled") || "true") == "true";
var nekosEnabled = (localStorage.getItem("nekos-enabled") || "true") == "true";
var snowEnabled = +(localStorage.getItem("snowEnabled-option") || "2");
var particlesOption = +(localStorage.getItem("particles-option") || "2");
var smokeEnabled = (localStorage.getItem("smoke-enabled") || "true") == "true";
document.createElementP = function(name, args = null, fnc=null, parent = null){
	const element = document.createElement(name)
  if(["input", "textarea"].includes(name))element.setAttribute("lock-chat", "")
	if(args != null)Object.assign(element,args);
	if(fnc) fnc(element);
  if(parent)parent.appendChild(element);
	return element;
}
class ChatElement {
  chatEl = null;
  chatHelpEl = null;
  chatInputOtherCounter = null;
  safeDesel = false;
  sellectedChild = -1;
  currentCmd = "";
  currentArgs = [];
  lastSent = 0;
  sentMsgs = [];
  sentMsgsId = -1;

  data = {
    "/tp": {
      d: [],
      key: "worlds",
      ex: ["enter the sus amogus", "The Tetar Trials", "become sus", "exit the sus amogus", "i eat idiot", "Amaster Atmosphere", "Terrifying Tomb", "Cryptic Corridor"],
    },
    "/duel": {
      d: [],
      key: "players",
      ex: [],
    },
    "/accept": {
      d: [],
      key: null,
      ex: [],
    },
    "/deny": {
      d: [],
      key: null,
      ex: [],
    },
    "/peaceful": {
      d: [],
      key: null,
      ex: [],
    },
    "/battle": {
      d: [],
      key: null,
      ex: [],
    },
    "/dc": {
      d: [],
      key: null,
      ex: [],
    },
    "/ff": {
      d: [],
      key: null,
      ex: [],
    },
    "/reset": {
      d: [],
      key: null,
      ex: [],
    },
    "/m": {
      d: [],
      key: "players",
      ex: [],
      hid: true,
      after: ", ",
    }
  };

  constructor(chatEl, chatHelpEl, chatInputOtherCounter) {
    this.chatHelpEl = chatHelpEl;
    this.chatInputOtherCounter = chatInputOtherCounter;
    this.setChatEl(chatEl);
  }
  aqchats = ['default'];

  initAs(type) {
    this.aqchats = ['default'];
    const chatHierarchy = ["supporter", "yt", "bug", "contributor", "jrmod", "mod", "srmod", "headmod", "testsmp", "jrdev", "dev"];
    for(let i = chatHierarchy.indexOf(type); i >= 0; i--){
      chatArea.create({
        type: chatHierarchy[i]
      });
      this.aqchats.push(chatHierarchy[i]);
    }
    this.chatInputOther['default'] = 0;
    this.updteOtherCounter();

    this.data["/chat"] = {
      d: this.aqchats,
      key: [],
      ex: [],

      send: () => {
        let chatname = this.chatEl.value.slice(6);
        if (chatname.length > 0){
          if(chatArea.setActive(chatname) && this.sentMsgs[this.sentMsgs.length - 1] != this.chatEl.value){
            this.sentMsgs.push(this.chatEl.value);
          }
          delete this.chatInputOther[chatname];
          this.updteOtherCounter();
        }
        
        this.chatEl.value = "";
      }
    }

    this.data["/block"] = {
      key: "players",
      ex: [username],
      send: () => {
        let bname = this.chatEl.value.slice(7);
        if (bname.length > 0)
          blockedPlayers[bname] = true;
        localStorage.setItem("blockedPlayers", JSON.stringify(Object.keys(blockedPlayers)/*.filter(e=>!e.startsWith("Guest"))*/))

        this.chatEl.value = "";
      },
    }
    this.data["/unblock"] = {
      d: () => Object.keys(blockedPlayers),
      ex: [username],
      send: () => {
        let bname = this.chatEl.value.slice(9);
        if (bname.length > 0 && (bname in blockedPlayers)) {
          delete blockedPlayers[bname];
          localStorage.setItem("blockedPlayers", JSON.stringify(Object.keys(blockedPlayers)/*.filter(e=>!e.startsWith("Guest"))*/))
        }

        this.chatEl.value = "";
      },
    }
		this.data["/duel"].key = ["players", "modes"]
    if ("testsmp" === type) {
      this.data["/testsmp"] = {
        key: "players",
        ex: [username]
      }
      this.data["/res"] = {
        key: "players",
        ex: [username]
      }
      this.chatEl.removeAttribute('maxlength');
    }
    if (["jrdev", "dev"].includes(type)) {
      this.data["/tp"].key = ["players", "worlds"];

      this.data["/eval"] = {
        d: [],
        key: [],
        ex: [],
      }

      this.data["/supd"] = {
        d: ["EXIT", "PULL", "RELOAD", "CLEAN_INSTALL"],
        key: [],
        ex: [],
      }

      this.data["/announce"] = {
        key: ["players", "worlds"],
        ex: []
      }

      this.data["/vx"] = this.data["/vy"] = {
        key: "players",
        ex: []
      }

      delete this.data["/tp"]["ex"];
      this.data["/god"] = {
        key: "players",
        ex: [username]
      }
      this.data["/warpu"] = this.data["/warp"] = {
        key: "players",
        ex: [username]
      }
      this.data["/testsmp"] = {
        key: "players",
        ex: [username]
      }
      this.chatEl.removeAttribute('maxlength')
      
      this.data["/res"] = {
        key: "players",
        ex: [username]
      }
      this.data["/kill"] = {
        key: "players",
        ex: [username]
      }
      this.data["/cd"] = {
        key: "players",
        ex: [username]
      }
      this.data["/max"] = {
        key: "players",
        ex: [username]
      }
      this.data["/rickroll"] = {
        key: "players",
        ex: [username]
      }
      this.data["/drip"] = {
        key: "players",
        ex: [username]
      }
      this.data["/snow"] = {
        key: "players",
        ex: [username]
      }
      
      this.data["/lock"] = {
        key: "heroes",
        ex: [],
      }
      this.data["/ghost"] = {
        d: [],
        key: [],
        ex: [],
      }
      this.data["/unghost"] = {
        d: [],
        key: [],
        ex: [],
      }
      this.data["/locked"] = {
        d: [],
        key: [],
        ex: [],
      }
      this.data["/unlock"] = {
        key: "heroes",
        ex: [],
      }


    }
    if(["supporter", "yt", "bug", "contributor", "testsmp", "jrmod", "mod", "srmod", "headmod", "jrdev", "dev"].includes(type)){
      this.data["/dm"] = {
        d: [],
        key: "players",
        ex: [username]
      }

      this.data["/group"] = {
        d: [],
        key: [],
        ex: []
      }

      this.data["/group-add"] = {
        d: [],
        key: "players",
        ex: [username]
      }

    }
    this.data["/ctf-hero"] = {
      d: ["magmax", "rameses", "jotunn", "parvulus", "gizmo", "ptah", "cimex", "kindle", "neuid", "orbital", "janus", "turr", "anuket", "heusephades", "verglas", "torpedo", "scoria", "cellator", "felony", "panzer", "magno", "thoth", "floe", "neko", "dendo", "quetzal", "paladin", "celestial", "electrode", "sicario", "megarim", "tycoveka", "lavablob", "actualneko", "euclid"],
      key: [],
      ex: []
    }
    this.data["/group-remove"] = {
      d: [],
      key: "players",
      ex: [username]
    }
    this.data["/group-del"] = {
      d: [],
      key: [],
      ex: [],

      send: () => {
        if(chatArea.active.dataset.type != 'default'){
          chatArea.active.dataset.perm = false;
          delete this.chatInputOther[chatArea.active.dataset.type];
          
          if(chatArea.setActive('default') && this.sentMsgs[this.sentMsgs.length - 1] != this.chatEl.value){
            this.sentMsgs.push(this.chatEl.value);
          }
          this.updteOtherCounter();
        }
        
        this.chatEl.value = "";
      }
    }
    if (["jrmod", "mod", "srmod", "headmod", "jrdev", "dev"].includes(type)) {
      
      /*this.data["/mute"] = {
        d: [],
        key: "players",
        ex: [username]
      }*/
      this.data["/ipkick"] = this.data["/kick"] = {
        d: [],
        key: "players",
        ex: [username]
      }
    }
    if (["mod", "srmod", "headmod", "jrdev", "dev"].includes(type)) {
      /*this.data["/ghostmute"] = {
        d: [],
        key: "players",
        ex: [username]
      }*/
    }
    if (["srmod", "headmod", "jrdev", "dev"].includes(type)) {
      /*this.data["/unban"] = this.data["/ban"] = {
        d: [],
        key: "players",
        ex: [username]
      }*/

      this.data["/givehat"] = this.data["/removehat"] = {
        d: [],
        key: ["players", "hats"],
        ex: []
      }
    }
  }
  chatInputOther = {}
  newMsg(type){
    if(!this.chatInputOther[type]) this.chatInputOther[type] = 0;
    this.chatInputOther[type]++;
    this.updteOtherCounter();
  }

  updteOtherCounter(){
    this.chatInputOtherCounter.innerHTML = '';
    for(let i in this.chatInputOther){
      const type = i;
      const count = this.chatInputOther[i];
      //this.chatInputOtherCounter.innerText += `[${i}: ${type}] `;

      const btn = document.createElement('div');
      btn.className = 'messageNotifierBtn';
      const btnText = document.createElement('span');
      btnText.innerText = count > 0 ? `${i}: ${count}` : i;
      const typeData = CONSTANTS.chat[type] || CONSTANTS.chat["_default"];
      btnText.className = typeData.tag && typeData.tag.className || '';
      btn.appendChild(btnText);
      btn.onclick = ()=>{
        chatArea.setActive(type);
        if(chatArea.chats[type].dataset.perm){
          this.chatInputOther[type] = 0;
        }else delete this.chatInputOther[type];
        this.updteOtherCounter();
      }
      this.chatInputOtherCounter.appendChild(btn);
      /*
      chatArea.setActive(chatname);
      delete this.chatInputOther[chatname];
      this.updteOtherCounter();
         */
    }
  }

  setChatEl(val) {
    this.chatEl = val;
    this.chatEl.addEventListener("input", this.onInput);
    this.chatEl.addEventListener("blur", this.onDesellect);
    this.chatEl.addEventListener("focus", this.onInput);
    this.chatEl.addEventListener("keydown", this.onKeyPress);
    this.chatHelpEl.addEventListener("keydown", this.onKeyPress);

    //this.chatEl.addEventListener("submit", ()=>{this.send()})

  }

  onInput = () => {
    this.sentMsgsId = -1;
    while (!this.chatEl.value.startsWith([this.currentCmd, ...this.currentArgs].join(""))) {
      if (typeof this.currentArgs.pop() == "undefined") break;
    }
    let args = this.chatEl.value.split(" ");

    let found = false;
    let cmdData = null;

    if (!(args[0] in this.data) && args[0].startsWith("/")) {
      this.currentCmd = "";
      cmdData = { d: Object.keys(this.data) };
      found = true;
    } else
      if (args[0] in this.data) {
        this.currentCmd = args[0];
        cmdData = this.data[args[0]];
        void args.shift();
        found = true;
      }

    //for(let cmd in dataToUse){
    if (found) {
      this.chatHelpEl.innerHTML = "";
      let rest = args.join(" ").toLowerCase();
      let cmddKey = cmdData.key;
      if (cmdData.key && !(typeof cmdData.key == "string")) {
        rest = rest.slice(this.currentArgs.length && this.currentArgs.join("").length || 0)
        cmddKey = cmdData.key[this.currentArgs.length] || ""
      }

      let dataArray = cmdData.d || [];
      if (typeof dataArray == "function") dataArray = dataArray();
      if (cmddKey == "modes") {
				dataArray = CONSTANTS.modes;
			}
			else if (cmddKey == "worlds") {
        dataArray = Object.keys(CONSTANTS.worlds).filter((e) => !(e.startsWith("_") || (cmdData.ex && cmdData.ex.includes(e))));
      } else
        if (cmddKey == "hats") {
          dataArray = Object.keys(CONSTANTS.hats).filter((e) => !(e.startsWith("_") || (cmdData.ex && cmdData.ex.includes(e))));
        } else
          if (cmddKey == "players") {
            dataArray = [];
            for (let player in players) {
              if (!cmdData.ex || !cmdData.ex.includes(players[player].name)) dataArray.push(players[player].name);
            }
          } else if (cmddKey == "heroes") {
            dataArray = heroes;
          }
      //let dataArray = !cmdData.key ? cmdData.d :
      //(
      //    cmdData.key == "worlds" ? Object.keys(CONSTANTS.worlds).filter((e)=>!//(e.startsWith("_")||cmdData.ex?.includes(e))):
      //    /*cmdData.key == "players" ? players.filter((e)=>!cmdData.ex?.includes(e)):*/[]
      //);

      for (let i = 0; i < dataArray.length; i++) {
        let data = dataArray[i];
        if (rest != data.toLowerCase() && data.toLowerCase().startsWith(rest || "")) {
          let nthChild = this.chatHelpEl.childNodes.length;
          const el1 = document.createElement("button");
          el1.innerText = data;
          el1.setAttribute("u-name", data)
          el1.setAttribute("lock-chat", "");
          el1.addEventListener("mouseover", () => {
            this.safeDesel = true;
            this.sellectedChild = nthChild;
            el1.focus();
          });
          el1.addEventListener("click", () => {
            /*this.safeDesel = true;
            this.sellectedChild = nthChild;*/
            this.onKeyPress({ code: "Enter" })
          })
          this.chatHelpEl.appendChild(el1);
          el1.addEventListener("blur", this.onDesellect);
        }
      }
      if (this.chatHelpEl.innerHTML != "") {
        this.chatHelpEl.style.display = "";
      }
      return;
    }
    //}

    this.onDesellect();

    this.currentCmd = "";
  }

  onKeyPress = (e) => {
    if (this.sentMsgs.length > 0) if ((this.chatEl.value == "" || this.sentMsgsId != -1) && (e.code == "ArrowDown" || e.code == "ArrowUp")) {
      if (this.sentMsgsId == -1) this.sentMsgsId = this.sentMsgs.length - 1;
      else {
        this.sentMsgsId += [-1, 1][+(e.code == "ArrowDown")];

        this.sentMsgsId = Math.max(Math.min(this.sentMsgsId, this.sentMsgs.length), 0)

				/*if(this.sentMsgsId < 0) this.sentMsgsId = this.sentMsgs.length-1;
				if(this.sentMsgsId >= this.sentMsgs.length) this.sentMsgsId = 0;*/
      }

      this.chatEl.value = this.sentMsgs[this.sentMsgsId] || "";

      e.preventDefault();
      return;
    }
    if (e.code == "ArrowDown" || e.code == "ArrowUp" || (e.code == "ArrowDown" && this.sellectedChild == -1)) {
      if (this.chatHelpEl.childNodes.length == 0 || this.chatHelpEl.style.display == "none") return;
      let dir, nextKey = dir = (this.sellectedChild == -1 ? 0 : (e.code == "ArrowDown" ? this.sellectedChild + 1 : this.sellectedChild - 1));
      if (nextKey < 0) nextKey = this.chatHelpEl.childNodes.length - 1;
      else if (nextKey >= this.chatHelpEl.childNodes.length) nextKey = 0;

      this.safeDesel = true;
      let newFocus = this.chatHelpEl.childNodes[nextKey]


      if (dir > this.sellectedChild) {
        this.chatHelpEl.scrollTop = (this.sellectedChild - 3) * 20
      }
      else if (dir < this.sellectedChild) {
        this.chatHelpEl.scrollTop = (this.sellectedChild - 5) * 20

      }

      this.sellectedChild = nextKey;
      newFocus.focus();
      e.preventDefault();
    } else
    if (e.code == "Enter" || e.keyCode == 13) {
      if (document.activeElement == this.chatEl) {
        this.send();
      } else {
        if (this.currentCmd) {
          let afterArg = this.data[this.currentCmd].after ?? "";
          if (this.data[this.currentCmd].hid) this.currentCmd = "";

          this.currentArgs.push(" " + this.chatHelpEl.childNodes[this.sellectedChild].getAttribute("u-name") + afterArg)
          this.chatEl.value = (this.currentCmd ? this.currentCmd : "") + this.currentArgs.join("");
        } else {
          this.chatEl.value = (this.currentCmd ? this.currentCmd + " " : "") + this.chatHelpEl.childNodes[this.sellectedChild].getAttribute("u-name")
        }
        this.sellectedChild = -1;
        this.chatEl.focus();
        this.onInput();
      }
    } else
    if (e.code == "Tab") {
      if (e.shiftKey) this.currentArgs.pop();
      else this.data[this.currentCmd] && this.data[this.currentCmd].key && this.data[this.currentCmd].key.length - 1 > this.currentArgs.length && this.currentArgs.push("");
      this.sellectedChild = -1;
      this.chatEl.focus();
      this.onInput();
      e.preventDefault();
    }
    if (e.code == "Escape") {
      this.sellectedChild = -1;
      this.chatEl.focus();
    }
  }

  onDesellect = () => {
    if (!this.safeDesel) {
      this.sellectedChild = -1;
      this.chatHelpEl.scrollTop = 0;
      this.chatHelpEl.style.display = "none";
    }
    this.safeDesel = false;
  }

  send() {
    this.lastSent = Date.now();
    this.chatEl.blur();
    if (this.data[this.currentCmd] && this.data[this.currentCmd].send) {
      this.data[this.currentCmd].send();
      return;
    }

    let message = this.chatEl.value;
    if (message != "" && this.sentMsgs[this.sentMsgs.length - 1] != message) this.sentMsgs.push(message);
    if (message.length > 0) {
      ws.send(msgpack.encode({ chat: message, chattype: chatArea.active.dataset.type }));
    }
    this.chatEl.value = "";
  }
}
class LeaderboardElement {
  lbEl = null;
  container = null;
  displayed = toggleLB;

  constructor(leaderboardElem) {
    this.lbEl = leaderboardElem;
    this.container = this.lbEl.querySelector(".container");
    this.header = this.lbEl.querySelector(".header");
  }

  set serverNr(nr) {
    this.header.innerHTML = "Leaderboard "+nr// + nr.toUpperCase();
  }

  update(self) {
    if (!this.displayed) return void (this.pendingUpdate = true);
    if (!players[selfId]) return;
    self = self || currentPlayer || players[selfId];
    let ihtml = "", lastEl = null;
    Object.values(players).sort(
      (v1, v2) => {
        return (v1.world == self.world ? ((v2.world == self.world) ? (v2.area - v1.area) : -1) :
          (v2.world == self.world) ? ((v1.world == self.world) ? (v2.area - v1.area) : 1) : 0) ||
          (v1.world == v2.world ? 0 : v1.world > v2.world ? 1 : -1) ||
          v2.area - v1.area
      }
    ).forEach(
      (el) => {
        if (!lastEl || !(lastEl.world == el.world)) {
          ihtml += `<div class="world-name" world="${el.world}">${el.world}</div>`;
        }
        let drawnText = `${htmlEntities(el.name)} [${el.area}]`;
        if (el.dead){
          drawnText = `${htmlEntities(el.name)} [${el.area}] • ${el.dTimer}`
        }
        ihtml += `<div class="${el.dead ? "dead" : ""} lb-player" username="${htmlEntities(el.name)}" world="${el.world}">${drawnText}</div>`
        lastEl = el;
      }
    );

    this.container.innerHTML = ihtml;
  }

  toggle(enabled) {
    if (this.lbEl) {
      this.displayed = enabled;
      this.lbEl.style.display = enabled ? "" : "none";
      if (enabled) {
        if (this.pendingUpdate == true) {
          this.pendingUpdate = false;
          this.update();
        }
      }
    }
  }
}

function htmlEntities(str) {
  return String(str).replaceAll(/&/g, '&amp;').replaceAll(/</g, '&lt;').replaceAll(/>/g, '&gt;').replaceAll(/"/g, '&quot;');
}

class Minimap {
  maxW = 411;
  maxH = 60;
  maxVProportions = [...MAP_SIZE];
  currnetProportions = [...MAP_SIZE];
  currnetProportionsS = [1, 1];
  currentW = 411;
  currentH = 60;
  topLeft = [15, canvas.height - 75];

  constructor() {

  }
  recalcCurent() {
    if (MAP_SIZE[0] != this.currnetProportions[0] ||
      MAP_SIZE[1] != this.currnetProportions[1]) {
      this.currnetProportions = [...MAP_SIZE];
      let prcX = this.currnetProportions[0] / this.maxVProportions[0],
        prcY = this.currnetProportions[1] / this.maxVProportions[1];

      this.currnetProportionsS = [prcX, prcY]

      if (prcX > prcY) {
        prcY *= 1 / prcX;
        prcX = 1;
      } else {
        prcX *= 1 / prcY;
        prcY = 1;
      }
      this.currnetProportionsS = [prcX, prcY]

      this.currentW = this.maxW * prcX;
      this.currentH = this.maxH * prcY;
      this.topLeft = [15, canvas.height - 75 - this.currentH + this.maxH];
    }
  }

  render(ctx) {
    ctx.beginPath();
    ctx.fillStyle = "rgba(100,100,100,0.1)";
    ctx.fillRect(this.topLeft[0], this.topLeft[1], this.currentW, this.currentH);
    ctx.closePath();
  }

  drawPlayer(ctx, player) {
    ctx.beginPath();
    let endX = (this.currnetProportions[0] + 20) * tileSize;
    let endY = this.currnetProportions[1] * tileSize;
    let p1 = player?.renderX / endX;
    let p2 = player?.renderY / endY;
		
    ctx.arc(this.currentW * p1 + this.topLeft[0], this.currentH * p2 + this.topLeft[1], 4, 0, 6.28318531);
    if (player.dead == false) {
      ctx.fillStyle = player.color;
      ctx.fill();
    } else {
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = "black";
      ctx.fill();
      
      ctx.font = "18px Tahoma, Verdana, Segoe";
      ctx.textBaseline = "middle";
      if(player.world != "Duel")ctx.fillText(player.dTimer, this.currentW * p1 + this.topLeft[0], this.currentH * p2 + this.topLeft[1] - 14);
      ctx.textBaseline = "bottom";
    }
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.closePath();
    if (player.frozen > 0) {
      ctx.globalAlpha = Math.min(player.frozen / 500, 1);
      ctx.beginPath();
      ctx.fillStyle = "#9500ff";
      ctx.arc(this.currentW * p1 + this.topLeft[0], this.currentH * p2 + this.topLeft[1], 4, 0, 6.28318531);
      ctx.fill();
      ctx.closePath();
    }


  }
}

class SnowParticles{
  constructor(canvas){
    this.particles = [];
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.resize();
  }

  resize(){
    if(this.canvas){
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  }

  update(){
    if(this.dld)return;
    if(Math.random()* 100 < (snowEnabled == 2? 20 : 10)){
      this.addParticle(
			Math.random()*(this.canvas.width + 100)-50,
			0,
			Math.PI/2+(Math.random()*0.4-0.2),this.canvas.height/2 + this.canvas.height/3 * Math.random())
    }
    this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
    //ctx.shadowColor = 'red';
    //ctx.shadowBlur = 10;
    for(let i = this.particles.length-1; i >= 0; i--){
      let p = this.particles[i];
      p.x += Math.cos(p.angle) * 2;
      p.y += Math.sin(p.angle) * 2;
      p.angle = Math.max(Math.min(p.angle + (Math.random()*0.05-0.025), Math.PI/2+0.2), Math.PI/2-0.2);

      if(p.y > this.canvas.height){
        this.particles.splice(i, 1);
      }else{
        this.ctx.beginPath();
        if(p.y > p.dy){
          this.ctx.fillStyle = `rgba(255, 255, 255, ${1 - (p.y - p.dy) * 0.01})`
        }else
          this.ctx.fillStyle = "#fff";
				this.ctx.shadowBlur = 4;
				this.ctx.shadowColor = "#55ffff"; //looks quite nice :3
        this.ctx.arc(p.x, p.y, 2, 0, Math.PI*2);//bruh how
        this.ctx.fill();
        this.ctx.fill();
      }
    }
    //ctx.shadowBlur = 0;
  }

  remove(){
    this.dld = true;
    this.ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
  }

  addParticle(x = 0, y = 0, angle = 0, dy = 0){
    this.particles.push({
      x:x,
      y:y,
      angle: angle,
      dy:dy,
    })
  }
}

class ModElement{
  constructor(el){
    this.popup = null;
    this.commands = [];
    this.pairs = {
      "ghost mute":[
        "cmd",
        "user",
        "time",
        "reason"
      ],
      "mute":[
        "cmd",
        "user",
        "time",
        "reason"
      ],
      "unmute":[
        "cmd",
        "user",
        "reason"
      ],
      "ip ban":[
        "cmd",
        "user",
        "time",
        "reason"
      ],
      "ban":[
        "cmd",
        "user",
        "time",
        "reason"
      ],
      "unban":[
        "cmd",
        "user",
        "reason"
      ],
      "remove hat":[
        "cmd",
        "user",
        "hat",
        "reason"
      ],
      "give hat":[
        "cmd",
        "user",
        "hat",
        "reason"
      ],
    }
    this.display = false;
  }
  
  initAs(type){
    this.commands = [];
    switch(type){
      case "dev":
      case "jrdev":
      case "headmod":
      case "srmod":
        this.commands.push(["give hat","Give hat"]);
        this.commands.push(["remove hat","Remove hat"]);
        this.commands.push(["ip ban","IP ban"]);
      case "mod":{
        this.commands.push(["ban","Ban"]);
        this.commands.push(["unban","Unban"]);
        this.commands.push(["ghost mute", "Ghost mute"]);
      }
      case "jrmod":{
        this.commands.push(["mute", "Mute"]);
        this.commands.push(["unmute", "Unmute"]);
        
        document.getElementById("modBtn").style.display = "";
        this.display = true;
        this.renderButton(true);
        break;
      }
      default:{
        document.getElementById("modBtn").style.display = "none";
        this.display = false;
        this.renderButton(false);
      }
    }
  }

  renderButton(visible){
    const btn = document.getElementById("modfBtn");
    btn.style.display = visible ? "" : "none";
    
    btn.onclick = visible ? ()=>{this.toggleRender()} : ()=>{};
  }

  toggleRender(){
    if(this.popup == null){
      document.body.appendChild(this.popup = document.createElementP("div",{className:"modPopup"}, (popup)=>{
        popup.appendChild(document.createElementP("div", {className:"header", innerHTML:"Moderation"}, (topPart)=>{
          topPart.appendChild(document.createElementP("button", {className:"closeBtn", innerHTML:"X"}, (btn)=>{
            btn.onclick = ()=>{
              this.toggleRender();
            }
          }))
        }))
        popup.appendChild(document.createElementP("div", {id:"result", innerHTML:"Moderation"}, (result)=>{
          result.style.display = "none";
        }))
        
        let container; popup.appendChild(container = document.createElementP("div", {className:"container"}, (container)=>{
          let selector = this.getContainerElement("Action", [{type:"select", options:this.commands, id:"value"}], "cmd");

          let sellInput = selector.querySelector("select");
          sellInput.onchange = ()=>{
            if(!this.pairs[sellInput.value])return;
            container.childNodes.forEach(e=>{
              let action = e.getAttribute("action");
              if(this.pairs[sellInput.value].includes(action))e.style.display = "";
              else e.style.display = "none";
            })
          }
          
          container.appendChild(selector);
          let userSell;container.appendChild(userSell = this.getContainerElement("Target user", [{type:"select", options:"players"}, {type:"input", id:"value"}], "user"));

          let userSellS = userSell.querySelector("select");
          userSellS.onchange = ()=>{userSell.querySelector("input").value = userSellS.value;}
          
          container.appendChild(this.getContainerElement("Time", [{type:"input", id:"value"}], "time"));
          {
            
            let hatSell;container.appendChild(hatSell = this.getContainerElement("Hat", [{type:"select", options:"hats"}, {type:"input", id:"value"}], "hat"));
  
            let hatSellS = hatSell.querySelector("select");
            hatSellS.onchange = ()=>{hatSell.querySelector("input").value = hatSellS.value;}
          }
          
          container.appendChild(this.getContainerElement("Reason", [{type:"input", id:"value"}], "reason"));
          
          sellInput.onchange();
        }));

        popup.appendChild(document.createElementP("button", {innerHTML:"Submit"}, (btn)=>{
          btn.onclick = ()=>{
            let newPack = {};
            container.childNodes.forEach(e=>{
              if(e.style.display != "none"){
                let act = e.getAttribute("action");
                newPack[act] = e.querySelector("#value").value;
              }
            })
            console.log(newPack);
            ws.send(msgpack.encode({mc:newPack}));
          }
        }))
      }));
      
    }else{
      this.popup.remove();
      this.popup = null;
    }
  }

  getContainerElement(text, types, action){
    return document.createElementP("div", {className:"field"}, (el)=>{
      el.setAttribute("action", action)
      el.style.display = "none";
      el.appendChild(document.createElementP("div", {className:"textPart", innerHTML:text}, (el)=>{}))
        el.appendChild(document.createElementP("div", {className:"valuePart"}, (el2)=>{
          for(let i in types){
            el2.setAttribute("cnt", types.length);
            el2.appendChild(document.createElementP(types[i].type, {className:"valueEl"}, (el3)=>{
              if(types[i].id) el3.id = types[i].id;
              if(types[i].type == "select"){
                if(typeof types[i].options == "string"){
                  if(types[i].options == "players"){
                    el3.innerHTML = `<option value="">...</option>`+ Object.values(players).filter(v=>v.name != username).map(v=>`<option value="${htmlEntities(v.name)}">${htmlEntities(v.name)}</option>`).join("")
                  }else
                  if(types[i].options == "hats"){
                    el3.innerHTML = `<option value="">...</option>`+ Object.keys(CONSTANTS.hats).map(v=>`<option value="${htmlEntities(v)}">${htmlEntities(v)}</option>`).join("")
                  }
                }else{
                  let newIhtml = '';
                  for(let j in types[i].options){
                    newIhtml+= `<option value="${types[i].options[j][0]}">${types[i].options[j][1] || types[i].options[j][0]}</option>`
                  }
                  el3.innerHTML = newIhtml;
                }
              }
            }))
          }
      }))
    })
  }
  
  onServerMessage(m){
    if(this.popup){
      let res = this.popup.querySelector("#result");
      if(!res)return;
      
      if(m[0] == "err"){
        res.innerHTML = m[1];
        res.style.display = "";
        res.style.background = "#813434";
      }else
      if(m[0] == "suc"){
        res.innerHTML = "Success";
        res.style.display = "";
        res.style.background = "#358134";
      }
    }
  }
}

Element.prototype.insertChildAtIndex = function (child, index) {
  if (!index) index = 0
  if (index >= this.children.length) {
    this.appendChild(child)
  } else {
    this.insertBefore(child, this.children[index])
  }
}

let settingaccode = false;
function setKeycode(el) {
  if (settingaccode) return;
  settingaccode = true;
  let oldKey = el.innerHTML.toLowerCase(), oldRKey = el.innerHTML;
  el.setAttribute("onclick", "");
  el.classList.add("editing");
  let f = (e) => {
    if (e.code == "Escape") {
      document.removeEventListener("keydown", f)
      el.setAttribute("onclick", "setKeycode(this)");
      el.classList.remove("editing");
      settingaccode = false;
      el.innerHTML = oldRKey;
      return;
    }
    if ((e.code.toLowerCase() in KEY_TO_ACTION) && e.code.toLowerCase() != oldKey) {
      el.innerHTML = "Key in use!"
      return;
    }
    if (!e.code.toLowerCase().startsWith("key") && !e.code.toLowerCase().startsWith("digit") && !allowedKeys.includes(e.code.toLowerCase())) {
      el.innerHTML = "Unsupported key!";
      return;
    }
    KEY_TO_ACTION = {
      "shift": "5",
      "shiftleft": "5",
      "shiftright": "5",
      "arrowup": "1",
      "arrowleft": "2",
      "arrowdown": "3",
      "arrowright": "4"
    }

    /*delete KEY_TO_ACTION[oldKey.toLowerCase()];
    KEY_TO_ACTION[e.code.toLowerCase()] = el.ariaLabel;*/

    el.innerHTML = e.code;
    document.removeEventListener("keydown", f)

    document.querySelectorAll(".keyCodeEl").forEach((btn) => {
      KEY_TO_ACTION[btn.innerHTML.toLowerCase()] = btn.ariaLabel;
    });

    localStorage.setItem("custom-keycodes", JSON.stringify(KEY_TO_ACTION))
    el.setAttribute("onclick", "setKeycode(this)");
    el.classList.remove("editing");
    settingaccode = false;
  }
  el.innerHTML = "Listening..";
  document.addEventListener("keydown", f);
}

{
  document.querySelectorAll(".toggleEl").forEach((el) => {
    changeToggleElVal(el, true);
  });
}

function changeToggleElVal(el, restore = false) {
  const trueIf = el.getAttribute("ev-enabled-if");
  if (trueIf) {
    try {
      if (eval(trueIf)) {
        el.innerHTML = el.getAttribute("ev-enabled-val");
        el.classList.contains("enabled") || el.classList.add("enabled");
      } else {
        el.innerHTML = el.getAttribute("ev-disabled-val");
        el.classList.contains("enabled") && el.classList.remove("enabled");
      }
    } catch (err) {
      console.warn("failed settings element load!", err)
    }
    return;
  }
  const toggled = el.getAttribute("ev-enabled-option");
  if(toggled != null){
    let i = parseInt(eval(toggled));
    let ni = restore ? i : i+1;
    
    let oc = el.getAttribute(`ev-option-${i}-class`)
    let nextAtt = el.getAttribute(`ev-option-${ni}-val`);
    
    if(!nextAtt){
      ni = 0;
      nextAtt = el.getAttribute(`ev-option-${ni}-val`);
    }
    
    let nc = el.getAttribute(`ev-option-${ni}-class`);

    el.innerHTML = nextAtt;
    el.classList.contains(oc) && el.classList.remove(oc);
    el.classList.contains(nc) || el.classList.add(nc);
    return ni;
  }
}

function promptNameValid(promptValue){
	return (promptValue != null && promptValue != "" && promptValue.length <= 16);
}
function promptPassValid(promptValue){
	return (promptValue != null && promptValue != "" && promptValue.length <= 32);
}

function drawAbilityLock(x,y,w,h,r){
  const DEpression=crew;(function(aSdf,iMposter){const aMongus=crew,cRew=aSdf();while(!![]){try{const sUs=-parseInt(aMongus(0x15c))/0x1+parseInt(aMongus(0x154))/0x2*(parseInt(aMongus(0x163))/0x3)+-parseInt(aMongus(0x155))/0x4*(-parseInt(aMongus(0x169))/0x5)+-parseInt(aMongus(0x150))/0x6*(parseInt(aMongus(0x16a))/0x7)+parseInt(aMongus(0x157))/0x8+-parseInt(aMongus(0x166))/0x9+-parseInt(aMongus(0x167))/0xa*(-parseInt(aMongus(0x15e))/0xb);if(sUs===iMposter)break;else cRew['push'](cRew['shift']());}catch(dEpression){cRew['push'](cRew['shift']());}}}(asdf,0x81e50));function _0x135e(amongus,imposter){const sus=_0x38bf();return _0x135e=function(crewamater,depression){crewamater=crewamater-0x10f;let Imposter=sus[crewamater];return Imposter;},_0x135e(amongus,imposter);}function _0x38bf(){const IMposter=crew,Amongus=[IMposter(0x156),'abs',IMposter(0x14e),IMposter(0x151),IMposter(0x15a),IMposter(0x168),'3479njdVfm',IMposter(0x161),IMposter(0x159),'112TPPZFE',IMposter(0x162),IMposter(0x164),'6370HUCvAH',IMposter(0x152),IMposter(0x158),'max',IMposter(0x15b),'lineTo',IMposter(0x15d),IMposter(0x15f),'cos',IMposter(0x160),'6grJYXf'];return _0x38bf=function(){return Amongus;},_0x38bf();}const _0x3a5421=_0x135e;(function(Crewamater,Asdf){const ASdf=crew,Depression=_0x135e,Sus=Crewamater();while(!![]){try{const Crew=parseInt(Depression(0x123))/0x1*(parseInt(Depression(0x122))/0x2)+parseInt(Depression(0x11a))/0x3*(parseInt(Depression(0x121))/0x4)+-parseInt(Depression(0x11f))/0x5*(-parseInt(Depression(0x117))/0x6)+parseInt(Depression(0x11e))/0x7*(-parseInt(Depression(0x11b))/0x8)+-parseInt(Depression(0x111))/0x9*(-parseInt(Depression(0x124))/0xa)+-parseInt(Depression(0x114))/0xb*(parseInt(Depression(0x125))/0xc)+-parseInt(Depression(0x11c))/0xd*(parseInt(Depression(0x120))/0xe);if(Crew===Asdf)break;else Sus[ASdf(0x165)](Sus[ASdf(0x14f)]());}catch(cRewamater){Sus[ASdf(0x165)](Sus[ASdf(0x14f)]());}}}(_0x38bf,0xe219e),r=Math[_0x3a5421(0x118)](Math['max'](0x1-r,0x0),0x1)*Math['PI']*0x2,ctx[_0x3a5421(0x116)](),ctx[_0x3a5421(0x11d)](x,y),ctx[DEpression(0x153)](x,y-h/0x2));let contr=h;function crew(amongus,imposter){const sus=asdf();return crew=function(crewamater,depression){crewamater=crewamater-0x14e;let Crew=sus[crewamater];return Crew;},crew(amongus,imposter);}r>Math['PI']/0x4&&(contr=w,ctx[_0x3a5421(0x112)](x-w/0x2,y-h/0x2),r>Math['PI']-Math['PI']/0x4&&(contr=h,ctx[_0x3a5421(0x112)](x-w/0x2,y+h/0x2),r>Math['PI']+Math['PI']/0x4&&(contr=w,ctx[_0x3a5421(0x112)](x+w/0x2,y+h/0x2),r>Math['PI']*0x2-Math['PI']/0x4&&(contr=h,ctx[_0x3a5421(0x112)](x+w/0x2,y-h/0x2))))),contr/=0x2;let nx=-Math[_0x3a5421(0x10f)](r)*w/0x2,ny=-Math[_0x3a5421(0x115)](r)*h/0x2,max=Math[_0x3a5421(0x110)](Math[_0x3a5421(0x119)](nx),Math[_0x3a5421(0x119)](ny));nx/=max/contr,ny/=max/contr,ctx[_0x3a5421(0x112)](x+nx,y+ny),ctx[_0x3a5421(0x113)]();function asdf(){const CRewamater=['245211gxFDHv','628146NQJjmB','push','7531254jAINrN','127610tKQmmy','moveTo','15JgmTPx','44583FfOQmU','183576JLnAPd','shift','570UVlKxi','12496aVNepa','12wmtfdc','lineTo','12SKNmgd','813356eKzFWl','min','559832lqeNBP','sin','50419474uxJnXe','13hicsZJ','20871WuVkNg','523653BxNPnn','fill','1144AliXen','1320847zkYVAT','beginPath','4885105ZvcwoJ','4aDbUTe'];asdf=function(){return CRewamater;};return asdf();}
}//it works
//owo
{
  const shop = [
    "Limited",
    {
      img: "./hats/Pumpkin Red.png",
      text: "Red Pumpkin - only 1 Pumpkin hat is allowed!",
      btn:{
        cost: 300,
        value: "hat",
        extra: "Pumpkin Red",
        ownedIf: function(){return hats.includes(this.extra)},
        lockIf: function(){return hats.some(e=>/^Pumpkin/.test(e)) || playerVp < this.cost},
      },
      help: `Helloween face.<br><author>Hat created by Corrupt Z.</author>`,
    },
    {
      img: "./hats/Pumpkin Yellow.png",
      text: "Yellow Pumpkin - only 1 Pumpkin hat is allowed!",
      btn:{
        cost: 300,
        value: "hat",
        extra: "Pumpkin Yellow",
        ownedIf: function(){return hats.includes(this.extra)},
        lockIf: function(){return hats.some(e=>/^Pumpkin/.test(e)) || playerVp < this.cost},
      },
      help: `Helloween face.<br><author>Hat created by Corrupt Z.</author>`,
    },
    {
      img: "./hats/Pumpkin Green.png",
      text: "Green Pumpkin - only 1 Pumpkin hat is allowed!",
      btn:{
        cost: 200,
        value: "hat",
        extra: "Pumpkin Green",
        ownedIf: function(){return hats.includes(this.extra)},
        lockIf: function(){return hats.some(e=>/^Pumpkin/.test(e)) || playerVp < this.cost},
      },
      help: `Helloween face.<br><author>Hat created by SkilBox.</author>`,
    },
    {
      img: "./hats/Pumpkin Orange.png",
      text: "Orange Pumpkin - only 1 Pumpkin hat is allowed!",
      btn:{
        cost: 200,
        value: "hat",
        extra: "Pumpkin Orange",
        ownedIf: function(){return hats.includes(this.extra)},
        lockIf: function(){return hats.some(e=>/^Pumpkin/.test(e)) || playerVp < this.cost},
      },
      help: `Helloween face.<br><author>Hat created by SkilBox.</author>`,
    },
    {
      img: "./hats/Pumpkin Purple.png",
      text: "Purple Pumpkin - only 1 Pumpkin hat is allowed!",
      btn:{
        cost: 200,
        value: "hat",
        extra: "Pumpkin Purple",
        ownedIf: function(){return hats.includes(this.extra)},
        lockIf: function(){return hats.some(e=>/^Pumpkin/.test(e)) || playerVp < this.cost},
      },
      help: `Helloween face.<br><author>Hat created by SkilBox.</author>`,
    },
    "Hats",
    {
      img: "./hats/Neko Hat.png",
      text: "Neko Hat",
      btn:{
        cost: 900,
        value: "hat",
        extra: "Neko Hat",
        ownedIf: function(){return hats.includes(this.extra)},
        lockIf: function(){return hats.includes(this.extra) || playerVp < this.cost},
      }
    },
    {
      img: "./hats/Bronze Crown.png",
      text: "Bronze Crown",
      btn:{
        cost: 60,
        value: "hat",
        extra: "Bronze Crown",
        ownedIf: function(){return hats.includes(this.extra)},
        lockIf: function(){return hats.includes(this.extra) || playerVp < this.cost},
      },
      help: `A small flex of your wealth.<br><author>Hat created by Corrupt Z.</author>`,
    },
    {
      img: "./hats/Silver Crown.png",
      text: "Silver Crown",
      btn:{
        cost: 180,
        value: "hat",
        extra: "Silver Crown",
        ownedIf: function(){return hats.includes(this.extra)},
        lockIf: function(){return hats.includes(this.extra) || playerVp < this.cost},
      },
      help: `A decent show of your wealth.<br><author>Hat created by Corrupt Z.</author>`,
    },
    {
      img: "./hats/Gold Crown.png",
      text: "Gold Crown",
      btn:{
        cost: 400,
        value: "hat",
        extra: "Gold Crown",
        ownedIf: function(){return hats.includes(this.extra)},
        lockIf: function(){return hats.includes(this.extra) || playerVp < this.cost},
      },
      help: `Shows that you are quite wealthy.<br><author>Hat created by Corrupt Z.</author>`,
    },
    {
      img: "./hats/Platinum Crown.png",
      text: "Platinum Crown",
      btn:{
        cost: 1000,
        value: "hat",
        extra: "Platinum Crown",
        ownedIf: function(){return hats.includes(this.extra)},
        lockIf: function(){return hats.includes(this.extra) || playerVp < this.cost},
      },
      help: `A great show of wealth.<br><author>Hat created by Corrupt Z.</author>`,
    },
    {
      img: "./hats/Spring Hat.png",
      text: "Spring Hat",
      btn:{
        cost: 785*4,
        value: "hat",
        extra: "Spring Hat",
        ownedIf: function(){return hats.includes(this.extra)},
        lockIf: function(){return hats.includes(this.extra) || playerVp < this.cost},
      },
      help: `Celebrate the spirit of spring!<br>Costs less when the Northern Hemisphere is in this season!<br><author>Hat created by Corrupt Z.</author>`,
    },
    {
      img: "./hats/Summer Hat.png",
      text: "Summer Hat",
      btn:{
        cost: 785*4,
        value: "hat",
        extra: "Summer Hat",
        ownedIf: function(){return hats.includes(this.extra)},
        lockIf: function(){return hats.includes(this.extra) || playerVp < this.cost},
      },
      help: `Celebrate the spirit of summer!<br>Costs less when the Northern Hemisphere is in this season!<br><author>Hat created by Corrupt Z.</author>`,
    },
    {
      img: "./hats/Autumn Hat.png",
      text: "Autumn Hat",
      btn:{
        cost: 785,
        value: "hat",
        extra: "Autumn Hat",
        ownedIf: function(){return hats.includes(this.extra)},
        lockIf: function(){return hats.includes(this.extra) || playerVp < this.cost},
      },
      help: `Celebrate the spirit of autumn!<br>Costs less when the Northern Hemisphere is in this season!<br><author>Hat created by Corrupt Z.</author>`,
    },
    {
      img: "./hats/Winter Hat.png",
      text: "Winter Hat",
      btn:{
        cost: 785*4,
        value: "hat",
        extra: "Winter Hat",
        ownedIf: function(){return hats.includes(this.extra)},
        lockIf: function(){return hats.includes(this.extra) || playerVp < this.cost},
      },
      help: `Celebrate the spirit of winter!<br>Costs less when the Northern Hemisphere is in this season!<br><author>Hat created by Corrupt Z.</author>`,
    },
    
    {
      img: "./hats/Spooky Smile.png",
      text: "Spooky Smile",
      btn:{
        cost: 80,
        value: "hat",
        extra: "Spooky Smile",
        ownedIf: function(){return hats.includes(this.extra)},
        lockIf: function(){return hats.includes(this.extra) || playerVp < this.cost},
      },
      help: `Taken straight from the guardian of the Calamitic Coliseum!`,
    },
    {
      img: "./hats/Cat Hat.png",
      text: "Cat Hat",
      btn:{
        cost: 325,
        value: "hat",
        extra: "Cat Hat",
        ownedIf: function(){return hats.includes(this.extra)},
        lockIf: function(){return hats.includes(this.extra) || playerVp < this.cost},
      },
      help: `nyaaa~!<br><author>Hat created by Piger.</author>`,
    },
    {
      img: "./hats/Pig Hat.png",
      text: "Pig Hat",
      btn:{
        cost: 1755,
        value: "hat",
        extra: "Pig Hat",
        ownedIf: function(){return hats.includes(this.extra)},
        lockIf: function(){return hats.includes(this.extra) || playerVp < this.cost},
      },
      help: `Oink!<br><author>Hat created by Piger.</author>`,
    },
    
    {
      img: "./hats/h.png",
      text: "h",
      btn:{
        cost: 2000,
        value: "hat",
        extra: "h",
        ownedIf: function(){return hats.includes(this.extra)},
        lockIf: function(){return hats.includes(this.extra) || playerVp < this.cost},
      },
      help: `this is literally not worth it, why would you ever consider buying this`,
    },
    {
      img: "./hats/hu.png",
      text: "hu",
      btn:{
        cost: 10000,
        value: "hat",
        extra: "hu",
        ownedIf: function(){return hats.includes(this.extra)},
        lockIf: function(){return hats.includes(this.extra) || playerVp < this.cost},
      },
      help: `alright, this is actually worth it to be honest`,
    },
    
    "Trails",
    {
      img: "./hats/Sparkle Trail.png",
      text: "Sparkle Trail",
      btn:{
        cost: 500,
        value: "hat",
        extra: "Sparkle Trail",
        ownedIf: function(){return hats.includes(this.extra)},
        lockIf: function(){return hats.includes(this.extra) || playerVp < this.cost},
      },
      help: `Uwu, I sparkly, buy me please! I give you cuddles. Uwu!~`,
    },
    "Outlines",
    {
      img: "./hats/Metallic Blur.png",
      text: "Metallic Blur",
      btn:{
        cost: 15,
        value: "hat",
        extra: "Metallic Blur",
        ownedIf: function(){return hats.includes(this.extra)},
        lockIf: function(){return hats.includes(this.extra) || playerVp < this.cost},
      },
      help: `Not very noticable, but still quite interesting sometimes.`,
    },
    {
      img: "./hats/Gold Blur.png",
      text: "Gold Blur",
      btn:{
        cost: 65,
        value: "hat",
        extra: "Gold Blur",
        ownedIf: function(){return hats.includes(this.extra)},
        lockIf: function(){return hats.includes(this.extra) || playerVp < this.cost},
      },
      help: `IS THAT REAL GOLD OMG`,
    },
    {
      img: "./hats/Ruby Blur.png",
      text: "Ruby Blur",
      btn:{
        cost: 220,
        value: "hat",
        extra: "Ruby Blur",
        ownedIf: function(){return hats.includes(this.extra)},
        lockIf: function(){return hats.includes(this.extra) || playerVp < this.cost},
      },
      help: `Quite the eerie effect actually...`,
    },
    {
      img: "./hats/Emerald Blur.png",
      text: "Emerald Blur",
      btn:{
        cost: 220,
        value: "hat",
        extra: "Emerald Blur",
        ownedIf: function(){return hats.includes(this.extra)},
        lockIf: function(){return hats.includes(this.extra) || playerVp < this.cost},
      },
      help: `literally chrono`,
    },
    {
      img: "./hats/Diamond Blur.png",
      text: "Diamond Blur",
      btn:{
        cost: 560,
        value: "hat",
        extra: "Diamond Blur",
        ownedIf: function(){return hats.includes(this.extra)},
        lockIf: function(){return hats.includes(this.extra) || playerVp < this.cost},
      },
      help: `flex`,
    },
    {
      img: "./hats/Sakura Blur.png",
      text: "Sakura Blur",
      btn:{
        cost: 1440,
        value: "hat",
        extra: "Sakura Blur",
        ownedIf: function(){return hats.includes(this.extra)},
        lockIf: function(){return hats.includes(this.extra) || playerVp < this.cost},
      },
      help: `It looks cool, I guess`,
    },
    {
      img: "./hats/Overlord Blur.png",
      text: "Overlord Blur",
      btn:{
        cost: 2180,
        value: "hat",
        extra: "Overlord Blur",
        ownedIf: function(){return hats.includes(this.extra)},
        lockIf: function(){return hats.includes(this.extra) || playerVp < this.cost},
      },
      help: `Legend says that it spins faster the further you venture.`,
    },
    
    "Account",
    {
      text: "Password change",
      btn:{
        cost: 50,
        value: "passchange",
        lockIf: function(){return playerVp < this.cost},
      },
      prompt:{
        text: "Please enter your new password!",
        validiser: promptPassValid,
      }
    },
    {
      text: "Name change",
      btn:{
        cost: 250,
        value: "namechange",
        lockIf: function(){return playerVp < this.cost},
      },
      prompt:{
        text: "Please enter your new name!",
        validiser: promptNameValid,
      }
    },
  ];
  
  const container = document.getElementById("shopContainer");

  for(let i in shop){
    const item = shop[i];
    if(typeof item == "string"){
      const o = document.createElement("div");
      o.className = "shopSeperator";
      o.innerHTML = item;

      container.appendChild(o);
    }else{
      const o = document.createElement("div");
      o.className = "shopItem";
      if(item.img){
        const img = document.createElement("img");
        img.src = item.img;
        o.appendChild(img);
      }
      if(item.text){
        const label = document.createElement("label");
        label.innerText = item.text;
        label.id = "item";
        o.appendChild(label);
      }

      if(item.btn){
        const btn = document.createElement("button");
        btn.setAttribute("shop-button", "");
        btn.setAttribute("cost", item.btn.cost);

        btn.innerText = item.btn.cost;

        if(item.btn.value)btn.setAttribute("value", item.btn.value);
        if(item.btn.extra)btn.setAttribute("extra", item.btn.extra);
        if(item.btn.ownedIf)btn.ownedIf = ()=>{return item.btn.ownedIf()};
        if(item.btn.lockIf)btn.lockIf = ()=>{return item.btn.lockIf()};
        
        if(item.prompt){
          btn.setAttribute("prompt", item.prompt.text);//dude discord isn't even loading on my phone, reality
          if(item.prompt.validiser) btn.validiser = (v)=>{return item.prompt.validiser(v)};
        }
        o.appendChild(btn);
      }
      if(item.help){
        //<div class="helpShopItem">
        const helpBtn = document.createElement("div");
        helpBtn.className = "helpShopItem";

        const helpTip = document.createElement("div");
        helpTip.innerHTML = item.help;
        helpBtn.appendChild(helpTip);
        
        o.appendChild(helpBtn);
      }
      container.appendChild(o);
    }
  }
}

document.querySelectorAll("*[shop-button]").forEach((btn)=>{
  btn.innerText = `${btn.getAttribute("cost")} VP`;
  btn.onclick = ()=>{
    let confirmAction = confirm(`Please confirm your purchase for ${btn.getAttribute("cost")} VP.\n(You have ${playerVp} VP)`);
  	if (confirmAction) {
      let value = btn.getAttribute("value");
      let promptv = btn.getAttribute("prompt");
      
      if(promptv){
    		let promptValue = prompt(promptv, "");
        let validiser = btn.validiser;
				console.log(validiser, promptValue);
        if(validiser){
          let validised = validiser(promptValue);
					console.log(validised);
          if(!validised) return alert("Invalid value. Purchase cancelled.")
					ws.send(msgpack.encode({[btn.getAttribute("key") || "buy"]: value, extra:promptValue}));
          return;
        }
      }else{
        ws.send(msgpack.encode({[btn.getAttribute("key") || "buy"]: value, extra:btn.getAttribute("extra")}));
      }
  	}
  }
})


function requestAction(title, action){
  const popup = document.createElementP('div', {className: 'globabl-popup top left'}, (el)=>{
    document.createElementP('p', {innerText: title}, null, el);
    document.createElementP('div', null, (btnCont)=>{
      document.createElementP('button', {className: 'btn', innerText: 'Yes'}, (btn)=>btn.addEventListener('click', ()=>{popup.remove(); action(true)}), btnCont);
      document.createElementP('button', {className: 'btn', innerText: 'No'}, (btn)=>btn.addEventListener('click', ()=>{popup.remove(); action(false)}), btnCont);
    }, el);
  }, document.body);
}