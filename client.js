let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
const wst = 'ws';
const htt = 'http';

let ws = new WebSocket(location.origin.replace(/^http/, 'ws'));
let loginKey = null;
ws.binaryType = "arraybuffer"
ws.onopen = () => {
  document.querySelector(".loading").classList.add("fadeout")
}
//ctx.setTransform(2,0.5,0,1,-canvas.width/2,-canvas.height/2)

window.onbeforeunload = function() {
  if (state == "game") return 1;
};
let framesPerSecond = 60;
let ping = 0;
let sentTime = 0;
let slowdown = 1;

setInterval(() => {
  if (ws.readyState == 1) {
    ws.send(msgpack.encode({
      type: "ping"
    }));
    sentTime = Date.now();
  }
}, 5000 * slowdown);

let canvasSize = {
  x: canvas.width,
  y: canvas.height
}
let center = {
  x: canvasSize.x / 2,
  y: canvasSize.y / 2
}
let tempCanvas = null;
let hats = [];
let selectedHat = [];
let tCtx = null;
let state = "menu";
let reason = "";
let lastEnemyId = 0;
let lighting = {
  lighting: 1,
  smoke: 0,
  color: [0, 0, 0]
}
const tileSize = 40 * 0.4285 * 2;
let chatSelfRegex = null;
const hatImg = {}
let MAP_SIZE = [80, 15];

function createHat(name, multiX, multiY, dX, dY) {
  let img = new Image();
  img.src = `./hats/${name}.png`;
  hatImg[name] = {
    img: img,
    multiX: multiX,
    multiY: multiY,
    dX: dX,
    dY: dY
  };
}

const TEXTURE_LOADER = {
  cache: {},
  load(texture, cb){
    if(!texture.startsWith('http')) texture = 'images/'+texture;
    if(this.cache[texture]){
      if(this.cache[texture].loaded){
        return void cb(this.cache[texture].texture);
      }else this.cache[texture].cb.push(cb);
      return;
    }

    const img = new Image();
    this.cache[texture] = {
      texture: img,
      loaded: false,
      cb: [cb],
    }
    img.onload = ()=>{this.cache[texture].loaded = true; this.cache[texture].cb.forEach(e=>e(img));this.cache[texture].cb = []};
    img.src = texture;
  }
}

let tiles = {};

function loadTexturePack(target, source, data = [{
  name: "",
  x: 0,
  y: 0,
  w: 0,
  h: 0,
  type: "pattern",
  g: 0
}]) {
  let img = new Image();
  img.onload = () => {
    const tempCanvas = document.createElement("canvas");
    const tCtx = tempCanvas.getContext("2d");

    for (let i = 0; i < data.length; i++) {
      tempCanvas.width = data[i].w;
      tempCanvas.height = data[i].h;
      tCtx.drawImage(img, data[i].x, data[i].y, data[i].w, data[i].h, 0, 0, data[i].w, data[i].h);

      switch (data[i].type) {
        case "pattern":
          tiles[data[i].name] = {
            res: ctx.createPattern(tempCanvas, 'repeat'),
            g: data[i].g,
            color: data[i].color
          };
          break;
        default:
        case "image":
          tiles[data[i].name] = {
            res: new Image(),
            g: data[i].g,
            color: data[i].color
          };
          tiles[data[i].name].res.src = tempCanvas.toDataURL();
          break;
      }
    }
  }
  img.src = source;
}
loadTexturePack(tiles, "./images/tile_map.png", [{
    name: "tile_main",
    x: 0,
    y: 0,
    w: 40,
    h: 40,
    type: "pattern",
    g: 0,
    color: "#ffffff"
  },
  {
    name: "tile_2",
    x: 40,
    y: 0,
    w: 40,
    h: 40,
    type: "image",
    g: 1,
    color: "#EEFF00"
  },
  {
    name: "tile_cc_left",
    x: 80,
    y: 0,
    w: 40,
    h: 40,
    type: "pattern",
    g: 0,
    color: "#55b0b3"
  },
  {
    name: "tile_victory",
    x: 120,
    y: 0,
    w: 40,
    h: 40,
    type: "pattern",
    g: 0,
    color: "#efe45c"
  },
  {
    name: "tile_red_zone",
    x: 160,
    y: 0,
    w: 40,
    h: 40,
    type: "pattern",
    g: 0,
    color: "#ff0000",
    alpha: 0.5
  },
  {
    name: "tile_safezone",
    x: 0,
    y: 40,
    w: 40,
    h: 40,
    type: "pattern",
    g: 0,
    color: "#c3c3c3"
  },
  {
    name: "tile_next_area",
    x: 40,
    y: 40,
    w: 40,
    h: 40,
    type: "pattern",
    g: 0,
    color: "#fff46c"
  },
  {
    name: "tile_change_world",
    x: 80,
    y: 40,
    w: 40,
    h: 40,
    type: "pattern",
    g: 0,
    color: "#6ad0de"
  },
  {
    name: "tile_door",
    x: 120,
    y: 40,
    w: 40,
    h: 40,
    type: "pattern",
    g: 0,
    color: "#6ad0de"
  },
  {
    name: "tile_gray_zone",
    x: 160,
    y: 40,
    w: 40,
    h: 40,
    type: "pattern",
    g: 0,
    color: "#888888"
  },
  {
    name: "tile_green_zone",
    x: 0,
    y: 80,
    w: 40,
    h: 40,
    type: "pattern",
    g: 0,
    color: "#00ff00",
    alpha: 0.5
  },
  {
    name: "tile_box",
    x: 40,
    y: 80,
    w: 40,
    h: 40,
    type: "pattern",
    g: 0,
    color: "#914800",
  },
  {
    name: "tile_button_green",
    x: 80,
    y: 80,
    w: 40,
    h: 40,
    type: "pattern",
    g: 0,
    color: "#03CE00",
  },
  {
    name: "tile_button_blue",
    x: 120,
    y: 80,
    w: 40,
    h: 40,
    type: "pattern",
    g: 0,
    color: "#00AFCE",
  },
  {
    name: "tile_button_pink",
    x: 0,
    y: 120,
    w: 40,
    h: 40,
    type: "pattern",
    g: 0,
    color: "#CE00C4",
  },
  {
    name: "tile_button_yellow",
    x: 40,
    y: 120,
    w: 40,
    h: 40,
    type: "pattern",
    g: 0,
    color: "#CEC300",
  },
  {
    name: "tile_button_orange",
    x: 80,
    y: 120,
    w: 40,
    h: 40,
    type: "pattern",
    g: 0,
    color: "#CE7400",
  },
  {
    name: "tile_button_gray",
    x: 120,
    y: 120,
    w: 40,
    h: 40,
    type: "pattern",
    g: 0,
    color: "#676767",
  },
])
let captchaDiv = document.querySelector(".captcha");

let serversDiv = document.getElementById("serverSelection");
const bouncyEnemyImg = new Image();
bouncyEnemyImg.src = "images/bouncyEnemy.png";
const presentEnemyImg = new Image();
presentEnemyImg.src = "images/presentEnemy.png";
const escargoImg = new Image();
escargoImg.src = "images/escargo.png";

let ability1cooldown = -1;
let ability2cooldown = -1;

let maxAbility1 = Infinity;
let maxAbility2 = Infinity;

let victoryArea = false;
let playerType;
let heroes;
let timeTaken = 999999999999999999999999;
let playerVp = 0;

const heusephadesAbilities = ["#889595", "#d13530", "#178031", "#3081d1"];

let anti_afk = 0;

{ //generate map name colors
  let style = document.createElement("style");
  document.head.appendChild(style);
  let nhtml = "";
  for (let i in CONSTANTS.worlds) {
    if (i[0] == "_") continue;

    let data = CONSTANTS.worlds[i] && CONSTANTS.worlds[i].title || CONSTANTS.worlds["_default"].title;
    if (data == null) {
      continue;
    }
    let fs = data.fillStyleLB || data.fillStyle,
      out = data.strokeStyleLB || data.strokeStyle;
    if (typeof fs != "string" || typeof out != "string") continue;
    nhtml += `
    *[world="${i}"]{
      color: ${fs}!important;
      text-shadow: min(calc(-1.7vw * 0.05), calc(-3.0vh * 0.05)) min(calc(-1.7vw * 0.05), calc(-3.0vh * 0.05)) 2px #0003, min(calc(-1.7vw * 0.05), calc(-3.0vh * 0.05)) min(calc(1.7vw * 0.05), calc(3.0vh * 0.05)) 2px #0003, min(calc(1.7vw * 0.05), calc(3.0vh * 0.05)) min(calc(1.7vw * 0.05), calc(3.0vh * 0.05)) 2px #0003, min(calc(1.7vw * 0.05), calc(3.0vh * 0.05)) min(calc(-1.7vw * 0.05), calc(-3.0vh * 0.05)) 2px #0003;
    }

    *[class="world-name"][world="${i}"]{
      color: ${fs}!important;
      text-shadow: min(calc(1.7vw * 0.05), calc(3.0vh * 0.05)) min(calc(1.7vw * 0.05), calc(3.0vh * 0.05))  ${out}, min(calc(-1.7vw * 0.05), calc(-3.0vh * 0.05)) min(calc(1.7vw * 0.05), calc(3.0vh * 0.05)) ${out}, min(calc(-1.7vw * 0.05), calc(-3.0vh * 0.05)) min(calc(-1.7vw * 0.05), calc(-3.0vh * 0.05)) ${out}, min(calc(1.7vw * 0.05), calc(3.0vh * 0.05)) min(calc(-1.7vw * 0.05), calc(-3.0vh * 0.05)) ${out};
    }
    `
  }
  nhtml += `
  .dead[username][world]{
    opacity: 0.5;
  }`
  style.innerHTML = nhtml;

}

function getRandomColour() {
  var red = Math.floor(Math.random() * 255);
  var green = Math.floor(Math.random() * 255);
  var blue = Math.floor(Math.random() * 255);

  return "rgb(" + red + "," + green + "," + blue + " )";
}
//ok magmax works owo 
//maybe maybe.. like.. as default if nothing is there okayo
/*	dep can you just name all images like
heroname_1, heroname_2, then you don't need to put the thing in consts.js and it's not as tedious   */

//U SEE NOTHINGshhhhh
//
for (let hatName in CONSTANTS.hats) {
  const hatData = CONSTANTS.hats[hatName];
  if (hatData.hidden) continue;
  createHat(hatName, hatData.multiX, hatData.multiY, hatData.dX, hatData.dY);
}

document.getElementById("e1Btn").onclick = () => {
  window.onbeforeunload = function() {};
  window.location.replace("https://evades.io/");
}

document.getElementById("mapEditorBtn").onclick = () => {
  window.onbeforeunload = function() {};
  window.location.replace("https://e2mapmaker.adiprk.repl.co/");
}

const heroBoxes = document.querySelectorAll(".heroBox");
for (let i of heroBoxes) {
  i.onclick = () => {
    if (!i.classList.contains("inactive")) init(i.id);
  }
}

if (Cookies.get("lgkey") != undefined) {
  ws.addEventListener("open", () => {
    ws.send(msgpack.encode({
      klg: Cookies.get("lgkey")
    }));
  })
}

let username = null;

function d(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function show(item) {
  document.getElementById(item).style.display = "";
}

function hide(item) {
  document.getElementById(item).style.display = "none";
}

document.getElementById("logout").onclick = () => {
  Cookies.set("lgkey", null, {
    expires: 365
  });
  ws.send(msgpack.encode({
    type: "logout"
  }));
}
document.getElementById("hats").onclick = () => {
  ws.send(msgpack.encode({
    type: "hat"
  }));
}

document.getElementById("back").onclick = () => {
  document.getElementById('hatSelection').style.display = "none";
  document.querySelector(".menu").style.display = "";
}
document.getElementById("play").onclick = () => {
  serversDiv.style.display = "";
  menu.style.display = "none";
  join.style.display = "none";
  document.getElementById('loginData').style.display = "none";
  document.getElementById("playDiv").style.display = "";
}

temp1 = "";
const serversl = [
  ["NA Servers", "NA 1", "45.61.62.63"],
  ["EU Servers", "EU 1", "103.45.246.247"],
  // ["EU Servers", "EU 1 (old)", "103.13.211.241"],
];
if(window.location.host.startsWith('127.0.0.1'))serversl.push(["Local", "Local", window.location.host]);

let serverslf = {};

for (let s in serversl) {
  let ss = serversl[s];
  if(! serverslf[ss[0]]){
    serverslf[ss[0]] = document.createElement('div');
    serverslf[ss[0]].classList.add("serverRegion");
    let title = document.createElement('h1');
    title.innerText = ss[0];
    serverslf[ss[0]].appendChild(title);

    document.querySelector('.serverList').appendChild(serverslf[ss[0]]);
  }
  const ssf = serverslf[ss[0]];

  const btn = document.createElement("button");
  btn.classList.add("server_choose");
  btn.setAttribute("sname", ss[0]+'-'+ss[1]);
  btn.innerText = ss[1];
  ssf.appendChild(btn);

  try{
    fetch(`${htt}://${ss[2]}/playerCount`).then(e=>e.text()).then((v)=>{
      btn.innerText +=" (" + v + "/100)";
    }).catch(e=>{
      console.log(e,`server ${ss[0]}, ${ss[1]}, is down!`);
        btn.style.display = "none";
    });
  }catch(e){console.error(e)}
}

serversl.forEach((e) => {
  let odcf = () => {
    Object.values(chatArea.chats).forEach(e=>e.innerText = "");
    appendChatMessage({
      "owner": "[SERVER]",
      "chat": "Press enter to chat!",
      "type": "server"
    })
    players = {};
    enemies = {};
    enemysSorted = [];
    if (ws.url == wst+"://" + e[2] + "/") {
      if (leaderboardElement) leaderboardElement.serverNr = e[1];
      if (loggedInAsGuest) {
        captchaDiv.style.display = "";
        hcaptcha.execute({
            async: true
          })
          .then(({
            response,
            key
          }) => {
            serversDiv.style.display = "";
            menu.style.display = "none";
            join.style.display = "none";
            captchaDiv.style.display = "none";
            Cookies.set("lgkey", null, {
              expires: 365
            });
            ws.send(msgpack.encode({
              type: "captchaVerify",
              key: response
            }))
          })
          .catch(err => {
            console.error(err);
            captchaDiv.style.display = "none"
          });

      }
      ws.send(msgpack.encode({
        key: loginKey,
        type: "play"
      }));
    } else {
      ws = new WebSocket(wst+"://" + e[2]);
      ws.binaryType = "arraybuffer";
      bindWsListener(ws, e);
      ws.onopen = () => {
        if (loggedInAsGuest) {
          captchaDiv.style.display = "";
          hcaptcha.execute({
              async: true
            })
            .then(({
              response,
              key
            }) => {
              serversDiv.style.display = "";
              menu.style.display = "none";
              join.style.display = "none";
              captchaDiv.style.display = "none";
              Cookies.set("lgkey", null, {
                expires: 365
              });
              ws.send(msgpack.encode({
                type: "captchaVerify",
                key: response
              }))
            })
            .catch(err => {
              console.error(err);
              captchaDiv.style.display = "none"
            });
        }
        ws.send(msgpack.encode({
          key: loginKey,
          type: "play"
        }));
      }
    }
    serversDiv.style.display = "none";
  }
  if (Cookies.get("lgkey") != undefined) {
    loginKey = Cookies.get("lgkey")
  }
  document.querySelector(`[sname='${e[0]+'-'+e[1]}']`).onclick = () => {
    if (ws.url != wst+"://" + e[2] + "/") {
      ws.close();
      ws.onclose = odcf;
    } else {
      odcf()
    }
  }
})

let servOld = performance.now();

function bindWsListener(ws, serverinfo) {
  if (leaderboardElement) leaderboardElement.serverNr = (serverinfo != null ? serverinfo[1] : 0);//serversl.find(e => e[1] + "/" == ws.url.replace(/ws(s)?:\/\//gm, ""))[0];
  ws.onmessage = data => {
    let message = msgpack.decode(new Uint8Array(data.data));
    dataThisSecond += data.data.byteLength;
    if (message.success != undefined) {
      alert(message.success == true ? "Your purchase was successful!" : "Your purchase failed.");
    }
    if (message.namechange != undefined) {
      document.getElementById("loggedInAs").innerText = "Logged in as " + message.namechange;
    }
    if(message.ic != undefined){
      chatArea.create({type:message.ic, perm: true});
    }
    if (message.vi != undefined) {
      victoryArea = message.vi;
    }
    if (message.sz != undefined) {
      MAP_SIZE = message.sz;
      minimap.recalcCurent();
    }
    if (message.lig != undefined) {
      lighting = message.lig[0];
      if (typeof lighting != 'object') {
        lighting = {
          lighting: 1,
          smoke: 0,
          color: [0, 0, 0]
        }
      }
      if (lighting.smoke != undefined) {
        if (lighting.smoke > 0) {
          party = smokemachine(ctx3, lighting.color)
          party.start()
          party.setPreDrawCallback(function(dt) {
            if (smokeEnabled) {
              party.addSmoke(Math.random() * innerWidth, Math.random() * innerHeight, lighting.smoke * 0.9)
            }
          })
        } else
        if (party) {
          party.stop();
          party = null;
          ctx3.clearRect(0, 0, canvasSize.x, canvasSize.y)
        }
      } else
      if (party) {
        party.stop();
        party = null;
        ctx3.clearRect(0, 0, canvasSize.x, canvasSize.y)
      }
    }
    if (message.ty) {
      playerType = message.ty;
      modElement.initAs(playerType);
      chatElement.initAs(playerType);
    }
    chatChecking: if (message.chat) {
      let owner = message.owner;
      let retreiver = message.retreiver;
      let txt = message.chat;
      let type = message.type;
      let targetChannel = message.tc || 'default';
      console.log('is in', targetChannel, targetChannel in chatArea.chats);
      if(!(targetChannel in chatArea.chats)) break chatChecking;
      
      console.log('with ', chatArea.active.dataset.type != targetChannel, chatArea.active.dataset.type, targetChannel);
      if(chatArea.active.dataset.type != targetChannel){
        chatElement.newMsg(targetChannel);
      }
      const typeData = CONSTANTS.chat[type] || CONSTANTS.chat["_default"];
      if (!typeData.nonBlockable) {
        if (blockedPlayers[owner]) break chatChecking;
      }

      if (retreiver) {
        if (retreiver == playername) owner = "from " + owner;
        else owner = "to " + retreiver;
      }

      let scroll =
        chatArea.chats[targetChannel].scrollTop + chatArea.chats[targetChannel].clientHeight >=
        chatArea.chats[targetChannel].scrollHeight - 5;

      let newSpan = document.createElement("span");
      newSpan.classList.add("inlineMsg");
      newSpan.innerText = owner;
      let newDiv = document.createElement("div");


      newDiv.classList.add(typeData.className);

      let newSpan2 = document.createElement("span");
      newSpan2.classList.add("inlineMsg");

      newDiv.prepend(": " + txt);
      newDiv.prepend(newSpan);
      newDiv.style.whiteSpace = "normal";

      if (retreiver) newDiv.classList.add("dirmes");
      if (!retreiver && chatSelfRegex && chatSelfRegex.test && chatSelfRegex.test(txt)) newDiv.classList.add("mentioned");


      if (typeData.tag && !(retreiver && owner[0] == "t")) {
        let tagDiv = document.createElement("span");
        tagDiv.classList.add(typeData.tag.className);
        tagDiv.innerText = `${typeData.tag.text} `;
        newDiv.prepend(tagDiv);
      }

      chatArea.chats[targetChannel].appendChild(newDiv);

      if (scroll) {
        chatArea.chats[targetChannel].scrollTop = chatArea.chats[targetChannel].scrollHeight;
      }
    }
    if (message.logout != undefined) {
      document.getElementById('loginData').style.display = "";
      document.getElementById("playDiv").style.display = "none";
      loginKey = null
      loggedInAsGuest = false;
    }
    if (message.rgf != undefined) {
      if (message.rgf == 0) {
        alert("Username already exists!")
      } else if (message.rgf == 1) {
        alert(`This account contains banned characters in its name, please try again.`)
      }
    }
    if (message.lgf != undefined) {
      if (message.lgf == 0) {
        alert("No such user, try registering!")
      } else if (message.lgf == 1) {
        alert("Incorrect password!")
      } else if (message.lgf == 2) {
        alert(`The account is banned untill ${new Date(message.ba[1]).toLocaleString()}\nReason: ${message.ba[0]}`);
      } else if (message.lgf == 3) {
        alert(`This account contains banned characters in its name, please register a new one!`)
      }
    }
    if (message.cjg != undefined) {
      if (message.cjg == 1) {
        alert("Account already in game!")
      } else if (message.cjg == 2) {
        alert("The hero you chose is currently unable to join the game due to exploits. Please try another hero.")
      } else if (message.cjg == 3) {
        alert("This server or game is currently under attack and is thus under lockdown. You have not met the security requirements to enter.")
      } else if (message.cjg == 4) {
        alert("Account already in game in server " + message.serverCode + ". If you are not in that server, join it and leave it, and you should be able to join another server.")
      } else if (message.cjg == 5) {
        alert("Account banned!")
      } else if (message.cjg == 6) {
        requestAction("Someone is trying to enter this account on this server. Do you want to stay here? Answer is required within 10 seconds!", (success)=>{
          ws.send(msgpack.encode({
            cjg: success ? 2 : 1
          }));
        });
      }

    }
    if (message.getTrolled != undefined) {
      if (message.getTrolled == 2) {
        document.querySelector(".trollage2").style.display = "block";
        document.getElementById("trollageVideo2").play();
        document.querySelector(".game").style.opacity = 0.7;
        document.getElementById("trollageVideo2").onended = () => {
          document.querySelector(".trollage2").style.display = "none";
          document.querySelector(".game").style.opacity = 1;
        }
      } else if (message.getTrolled == 3) {
        document.querySelector(".trollage3").style.display = "block";
        document.getElementById("trollageVideo3").play();
        document.querySelector(".game").style.opacity = 0.7;
        document.getElementById("trollageVideo3").onended = () => {
          document.querySelector(".trollage3").style.display = "none";
          document.querySelector(".game").style.opacity = 1;
        }
      } else if (message.getTrolled == 4) {
        document.querySelector(".trollage4").style.display = "block";
        document.getElementById("trollageVideo4").play();
        document.querySelector(".game").style.opacity = 0.7;
        document.getElementById("trollageVideo4").onended = () => {
          document.querySelector(".trollage4").style.display = "none";
          document.querySelector(".game").style.opacity = 1;
        }
      } else if (message.getTrolled == 5) {
        document.querySelector(".trollage5").style.display = "block";
        document.getElementById("trollageVideo5").play();
        document.querySelector(".game").style.opacity = 0.7;
        document.getElementById("trollageVideo5").onended = () => {
          document.querySelector(".trollage5").style.display = "none";
          document.querySelector(".game").style.opacity = 1;
        }
      } else {
        document.querySelector(".trollage").style.display = "block";
        document.getElementById("trollageVideo").play();
        document.querySelector(".game").style.opacity = 0.7;
        document.getElementById("trollageVideo").onended = () => {
          document.querySelector(".trollage").style.display = "none";
          document.querySelector(".game").style.opacity = 1;
        }
      }
    }
    if (message.lgs != undefined) {
      Cookies.set("lgkey", loginKey = message.lgs, {
        expires: 365
      });
      username = message.d[0];
      ws.send(msgpack.encode({
        type: "gethats"
      }));
      document.getElementById('loginData').style.display = "none";
      document.getElementById("playDiv").style.display = "";
      document.getElementById("loggedInAs").innerText = "Logged in as " + username;

      function nrm(s) {
        return s.split("").map(e => {
          if (/[\^\|\[\]\-\\\/\*\+\.\?\:\{\}\$\#\&]/.test(e)) {
            return `\\${e}`;
          }
          return e
        }).join("");
      }
      chatSelfRegex = new RegExp("^( *" + nrm(username) + ", )");
      chatSelfRegex.global = true;
      chatSelfRegex.multiline = true;
    }
    if (message.rolled) {
      window.onbeforeunload = function() {};
      window.location.replace(message.rolled);
    }
    if (message.type == "heroes") {
      heroes = message.heroes;

      console.log("Why")

      for (let i of heroBoxes) {
        if (!heroes.includes(i.id)) {
          let bgcolor = window.getComputedStyle(i, null).backgroundColor;
          if (bgcolor.startsWith("#")) {
            i.style.background = bgcolor + "33";
          } else
          if (bgcolor.startsWith("rgb")) {
            i.style.background = bgcolor.substring(0, bgcolor.length - 1) + ",0.2)";
          }
          i.classList.add("inactive");
        }
      }

      document.querySelector('.menu').style.display = "none";
      document.getElementById("links").style.display = "none";
      document.getElementById("serverSelection").style.display = "none";
      document.querySelector(".joinDiv").style.display = "";

    }
    if (message.canPlayAsGuest){
      ws.send(msgpack.encode({
        type: "play",
        loginKey: null
      }))
    }
    if (message.guest != undefined) {
      loggedInAsGuest = true;
      username = message.guest;
      document.getElementById('loginData').style.display = "none";
      document.getElementById("playDiv").style.display = "";
      document.getElementById("loggedInAs").innerText = "Logged in as " + username;
    }
    if (message.rec != undefined) {
      document.getElementById("playDiv").style.display = "";
      console.log(players[selfId].name);
      appendChatMessage({
        "owner": "[Reconnector]",
        "chat": "You just got reconnected from your previous session! Type /dc to end this session.",
        "type": "server"
      })
    }
    if (message.rgs != undefined) {
      Cookies.set("lgkey", loginKey = message.rgs, {
        expires: 365
      });
      username = message.d[0];
      ws.send(msgpack.encode({
        type: "gethats"
      }));
      document.getElementById('loginData').style.display = "none";
      document.getElementById("playDiv").style.display = "";
      document.getElementById("loggedInAs").innerText = "Logged in as " + username;
    }
    if (message.pong != undefined) {
      ping = Date.now() - sentTime;

    }

    if (message.pi) {
      for (let i in message.pi) {
        players[message.pi[i].id] = new Player(message.pi[i]);
        spectatingOrder.push(message.pi[i].id);
        if (message.pi[i].id == selfId) {
          spectatingIndex = spectatingOrder.at(-1);
        }
      }
      // spectating
      leaderboardElement.update(currentPlayer);
    }
    if (message.er) {
      enemies = {};
      enemysSorted = [];
    }
    if (typeof message.gethats == "object") {
      hats = message.gethats = ["", ...message.gethats.sort((e1, e2) => CONSTANTS.hats[e1]?.gr - CONSTANTS.hats[e2]?.gr || CONSTANTS.hats[e1]?.order - CONSTANTS.hats[e2]?.order)]
    }
    if (typeof message.vp == "number") {
      playerVp = message.vp;
      vpChanged();
    }
    if (typeof message.hats == "object") {
      document.querySelector(".menu").style.display = "none";
      document.getElementById("hatSelection").style.display = "";
      hats = message.hats = ["", ...message.hats.sort((e1, e2) => CONSTANTS.hats[e1]?.gr - CONSTANTS.hats[e2]?.gr || CONSTANTS.hats[e1]?.order - CONSTANTS.hats[e2]?.order)]
      const hatContainer = document.getElementById("hats-container");

      hatContainer.innerHTML = "";

      if (message.hats && message.hats.length > 0) {
        selectedHat = message.selectedHat ? message.selectedHat.split(";") : selectedHat;
        let lastGr = 1;
        for (let i of message.hats) {
          const hatElem = document.createElement("div");
          hatElem.setAttribute("sellected", selectedHat.includes(i) ? "y" : "n");
          if (message.selectedHat == null) {
            if (i == "") {
              hatElem.setAttribute("sellected", "y");
            }
          }
          hatElem.className = "hat";
          const hatImgElem = document.createElement("img");
          hatImgElem.src = i != "" ? `hats/${i}.png` : "hats/none.png";
          hatElem.setAttribute("gr", CONSTANTS.hats[i] ? CONSTANTS.hats[i].gr : -1);
          hatElem.appendChild(hatImgElem);
          let hatImgDesc = document.createElement("p");
          hatImgDesc.innerText = (CONSTANTS.hats[i] ? CONSTANTS.hats[i].gr : -1) + 1;
          if (lastGr < parseInt(hatImgDesc.innerText)) {
            lastGr = parseInt(hatImgDesc.innerText);
            let breakEl = document.createElement("div");
            breakEl.className = "break";
            hatContainer.appendChild(breakEl);
          }
          hatElem.appendChild(hatImgDesc);
          hatElem.addEventListener("click", () => {
            if (hatElem.getAttribute("sellected") == "y") {
              hatElem.setAttribute("sellected", "n")
              selectedHat = selectedHat.filter(e => e != i);
              ws.send(msgpack.encode({
                hatSelect: selectedHat.length > 0 ? selectedHat.join(";") : ""
              }));
              return;
            }
            document.querySelectorAll(`.hat[sellected='y']${CONSTANTS.hats[i] ? `:is([gr='${CONSTANTS.hats[i].gr}'], [gr='-1'])` : ""}`).forEach((el) => {
              el.setAttribute("sellected", "n")
            });
            hatElem.setAttribute("sellected", "y");
            selectedHat = [];
            document.querySelectorAll(`.hat[sellected='y']`).forEach((el) => {
              let h = String(el.childNodes[0].getAttribute("src").replace("hats/", "").split(".")[0]);
              selectedHat.push(h == "none" ? "" : h);
            });

            ws.send(msgpack.encode({
              hatSelect: selectedHat.join(";") //if none, ""
            }));
          });
          hatContainer.appendChild(hatElem);
        }
      } else {
        hatContainer.innerText = "no hats!"; //temporary
      }
    }
    if (message.dW != undefined) {
      players[realSelfId].duelWon = message.dW;
      if (players[realSelfId].duelWon == false) {
        players[realSelfId].leaveDuelTimer = 3000;
      } else {
        for (let i in players) {
          if (players[i].area == players[realSelfId].area) {
            players[i].leaveDuelTimer = 3000;
          }
        }
      }
    }
    if (message.eu) {
      let shouldSort = false,
        shouldDel = false;
      for (let a in message.eu) {
        if (message.eu[a].id != undefined) {
          if (enemies[message.eu[a].id]) {
            enemies[message.eu[a].id].updatePack(message.eu[a]);
            if (message.eu[a].r) shouldSort = true;
            if (message.eu[a].k) shouldDel = true;
            lastEnemyId = message.eu[a].id;
          }
        } else {
          if (enemies[lastEnemyId + 1]) {
            enemies[lastEnemyId + 1].updatePack(message.eu[a]);
            if (message.eu[a].r) shouldSort = true;
            if (message.eu[a].k) shouldDel = true;
            lastEnemyId += 1;
          }
        }
      }
      if (shouldSort) enemysSorted = Object.values(enemies).sort((e1, e2) => e2.radius - e1.radius);
      if (shouldDel) {
        for (let i in enemies) {
          if (enemies[i].killed) {
            delete enemies[i];
          }
        }
      }
    }
    if (message.ei) {
      for (let i in message.ei) {
        enemies[message.ei[i].id] = new Enemy(message.ei[i]);
      }
      enemysSorted = Object.values(enemies).sort((e1, e2) => e2.radius - e1.radius)
    }
    if (message.zi) {
      for (let i in message.zi) {
        zones[message.zi[i].id] = new Zone(message.zi[i]);
      }
    }
    if (message.pu) {
      let shouldUpdateLb;

      for (let a in message.pu) {
        if (players[message.pu[a].id]) {
          players[message.pu[a].id].updatePack(message.pu[a]);
          if (!shouldUpdateLb && (message.pu[a].w || message.pu[a].a || message.pu[a].d !== undefined)) {
            shouldUpdateLb = true;
          }
        } //why change {id:1,hu:40} to [1,["hu",40]]
      }
      if (shouldUpdateLb) leaderboardElement.update(currentPlayer);
    }
    if (message.zu) {
      for (let a in message.zu) {
        if (zones[message.zu[a].id]) {
          zones[message.zu[a].id].updatePack(message.zu[a]);
        }
      }
    }
    if (message.cd) {
      if (message.cd[0] != undefined) {
        ability1cooldown = message.cd[0];
        maxAbility1 = message.cd[0];
      }
      if (message.cd[1] != undefined) {
        ability2cooldown = message.cd[1];
        maxAbility2 = message.cd[1];
      }
    }
    if (message.pri) {
      for (let i in message.pri) {
        projectiles[message.pri[i].id] = new Projectile(message.pri[i]);
      }
    }
    if (message.pru) {
      for (let i in message.pru) {
        if (projectiles[message.pru[i].id]) {
          projectiles[message.pru[i].id].updatePack(message.pru[i]);
        }
      }
    }
    if (message.prr) {
      if (typeof message.prr == "boolean") {
        projectiles = {};
      } else {
        delete projectiles[message.prr];
      }
    }
    if (message.zrr) {
      if (typeof message.zrr == "boolean") {
        zones = {};
      } else {
        delete zones[message.prr];
      }
    }
    if (typeof message.si == "number") {
      Resize();
      requestAnimationFrame(() => {
        try {
          anti_afk = 0;
          lastTime = performance.now();
          projectiles = {};
          renderGame()
        } catch (err) {
          console.error(err)
        };
      });
      selfId = message.si;
      realSelfId = selfId;
    }
    if (message.dc) {
      if (message.dc == "cnc") {
        cnc();
      }
      state = message.dc;
      haveDied = message.haveDied;
      reason = message.rs;
    }
    if (typeof message.l == "number") {
      // spectating
      let index = spectatingOrder.indexOf(message.l);
      if (index !== -1) {
        spectatingOrder.splice(index, 1);
      }
			try {
			if (players[message.l].area == players[realSelfId].area &&
				 players[message.l].world == players[realSelfId].world) {
      	spectatingIndex = NaN;
			}
			} catch(err) {}
      delete players[message.l];
      leaderboardElement.update(currentPlayer);
    }
    if (message.mc) {
      modElement.onServerMessage(message.mc);
    }
    if (message.ti) {
      console.log(startTime, Date.now(), message.ti);
      startTime = Date.now() - message.ti;
    }
  };
  ws.onclose = () => {
    console.log("disconnected");
  }
}

const heroHelp = document.querySelectorAll(".heroHelp");
for (let i of heroHelp) {
  i.onmouseenter = () => {
    show(i.id.substring(0, i.id.length - 4) + "Tooltip")
  }
  i.onmouseleave = () => {
    hide(i.id.substring(0, i.id.length - 4) + "Tooltip")
  }
}

{
  const wheretogetEls = document.querySelectorAll(".wheretoget");
  for (let world in victoryTexts) {
    for (let area in victoryTexts[world]) {
      if (victoryTexts[world][area][1]) {
        let hero = victoryTexts[world][area][1].toLowerCase();
        for (let el of wheretogetEls) {
          if (el.parentNode.id == hero + "Tooltip") {
            if (el.innerText == `${world.replace(" Hard", "")} ${area}.`)
              el.innerText = `${world.replace("Hard", "(Hard)")} ${area}.`;
            else
              el.innerText = `${world} ${area}.`;
            break;
          }
        }
      }
    }
  }
}

var joinButton = document.querySelector(".play");
var menu = document.querySelector(".menu");
var game = document.querySelector(".game");
var chatInput = document.getElementById("chatInput");
var chatUI = document.getElementById("chatUI");
var chatArea = {chats:{'default': document.getElementById("chat")}, 'active':null, 'create':(data)=>{
  if(chatArea.chats[data.type]) return false;
  let chatEl = document.createElement('div');
  chatEl.className = 'chatStyleEl';
  chatEl.style.display = 'none';
  chatEl.dataset.type = data.type;
  chatEl.dataset.perm = data.perm || false;
  chatEl.oncontextmenu = ()=>!1;
  chatUI.insertBefore(chatEl, chatArea.chats['default']);
  chatArea.chats[data.type] = chatEl;
  return true;
}, 'setActive': (type)=>{
  if(!chatArea.chats[type]) return false;
  for(let key in chatArea.chats){
    chatArea.chats[key].style.display = key != type ? 'none' : (chatArea.active = chatArea.chats[key], 'block');
  }
  return true;
}};
chatArea.setActive('default');

var modBtn = document.getElementById("modBtn");
var serverList = document.querySelector('.serverList');
var join = document.querySelector(".joinDiv");
var chatElement = new ChatElement(
  document.getElementById("chatInput"),
  document.querySelector(".chatInputHelper"),
  document.querySelector(".chatInputOtherCounter"),
);
var leaderboardElement = new LeaderboardElement(document.getElementById("leaderboard"));
var modElement = new ModElement();
var minimap = new Minimap();

var snowParticles = null;

function toggleSnow(option) {
  if (option != 0 && snowParticles == null) snowParticles = new SnowParticles(document.getElementById("snow"));
  else if (snowParticles && option == 0) {
    snowParticles.remove();
    snowParticles = null;
  }
}

if (snowEnabled != 0) {
  toggleSnow(true);
}

const blockedPlayers = {};
let stemp1 = localStorage.getItem("blockedPlayers");
if (stemp1)
  for (let i in stemp1) {
    blockedPlayers[stemp1[i]] = true;
  }
stemp1 = null;

var currentPlayer;
var players = {};
var enemies = {};
var zones = {};
let enemysSorted = [];
var projectiles = {};

let chatting = false;
let name = "";
let inGame = false;
let selfId = "";
let realSelfId = "";
let spectating = false;
let spectatingIndex = 0;
let spectatingOrder = []; //ids
let playerOffset = {
  x: 0,
  y: 0
};
let area = 1;
let world = "Corrupted Core";
let mouseX = 0;
let mouseY = 0;
let mouseToggleC = 0;
let dataThisSecond = 0;
let kbps = 0;
let showProjectiles = true;

document.getElementById("changelogBtn").onclick = () => {
  if (document.getElementById("changelog").style.display == "") {
    document.getElementById("changelog").style.display = "none";
    return;
  }
  document.getElementById("changelog").style.display = "";
}
document.getElementById("closeChangelog").onclick = () => {
  document.getElementById("changelog").style.display = "none";
}

document.getElementById("settingsBtn").onclick = () => {
  if (document.getElementById("settings").style.display == "") {
    document.getElementById("settings").style.display = "none";
    return;
  }
  document.getElementById("settings").style.display = "";
}
document.getElementById("closeSettings").onclick = () => {
  document.getElementById("settings").style.display = "none";
}
document.getElementById("shop").onclick = () => {
  document.getElementById("shopDiv").style.display = "";
}
document.getElementById("closeShop").onclick = () => {
  document.getElementById("shopDiv").style.display = "none";
}

function vpChanged() {
  document.querySelectorAll("*[shop-button]").forEach((btn) => {
    let ownedIf = btn.ownedIf;
    if (ownedIf) {
      //ownedIf = ownedIf.replace("{{cost}}", btn.getAttribute("cost")).replace("{{extra}}", btn.getAttribute("extra"));
      if (ownedIf()) {
        btn.classList.add("locked");
        btn.innerText = "Owned";
        btn.disabled = true;
      } else {
        btn.classList.add("remove");
        btn.disabled = false;
        btn.innerText = `${btn.getAttribute("cost")} VP`;
      }
    }

    let lockIf = btn.lockIf;
    if (lockIf) {
      //lockIf = lockIf.replace("{{cost}}", btn.getAttribute("cost")).replace("{{extra}}", btn.getAttribute("extra"));
      if (lockIf()) {
        btn.classList.add("locked");
        btn.disabled = true;
      } else {
        btn.classList.add("remove");
        btn.disabled = false;
      }
    }
  });
}

/*document.getElementById("namechange").onclick = () => {
	let confirmAction = confirm("Please confirm your purchase for 250 VP.");
	if (confirmAction) {
		let newname = prompt("Please enter your new name!", "");
		if (newname == null || newname == "" || newname.length > 16) {
			alert("Invalid name. Purchase cancelled.");
			return;
		} 
		ws.send(msgpack.encode({"buyN": newname}));
	}
}*/

/*document.getElementById("passchange").onclick = () => {
	let confirmAction = confirm("Please confirm your purchase for 100 VP.");
	if (confirmAction) {
		let newpass = prompt("Please enter your new password!", "");
		if (newpass == null || newpass == "" || newpass.length > 32) {
			alert("Invalid password. Purchase cancelled.");
			return;
		} 
		ws.send(msgpack.encode({"buyP": newpass}));
	}
}*/

setInterval(() => {
  kbps = Math.floor((dataThisSecond / 100) / slowdown) / 10;
  dataThisSecond = 0;
}, 1000 * slowdown)
const amogusImage = new Image();
amogusImage.src = "./images/amogus.png";
const nekoImage = new Image();
nekoImage.src = "./images/catnekoBall.png";
const pawImage = new Image();
pawImage.src = "./images/paw.png";
const trollImage = new Image();
trollImage.src = "./hats/Troll Trail.png";
const sparkleImage = new Image();
sparkleImage.src = "./hats/Sparkle Trail.png";
const rollImage = new Image();
rollImage.src = "./images/rickrolled.png";
const stickImage = new Image();
stickImage.src = "./images/stickbugged.jpg"
const spanishImage = new Image();
spanishImage.src = "./images/spanishinquisition.jpg"
const amasterImage = new Image();
amasterImage.src = "./images/amaster.jpg"
const noImage = new Image();
noImage.src = "./images/no.png";
bindWsListener(ws);

let lastTime = Date.now();

let delt = 0;

let playerCount = {};
let worldCount = 0;

function cap(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getWrappedTextHeight(text, x, y) {
  let words = text.split(' ');
  let line = '';
  let lineHeight = 20;
  let top = y;

  for (let i = 0; i < words.length; i++) {
    let lineTest = line + words[i] + ' ';
    let metrics = ctx.measureText(lineTest);
    let testWidth = metrics.width;

    if (testWidth > 180 && i > 0) {
      line = words[i] + ' ';
      y += lineHeight;
    } else {
      line = lineTest;
    }
  }
  let bottom = y;
  return bottom - top;
}

function wrapText(text, x, y) {
  let words = text.split(' ');
  let line = '';
  let lineHeight = 20;
  let height = getWrappedTextHeight(text, x, y);
  let oldBaseline = ctx.textBaseline;
  ctx.textBaseline = "middle";
  y = ((canvasSize.y - 255) + 225 / 2) - (height / 4);

  for (let i = 0; i < words.length; i++) {
    let lineTest = line + words[i] + ' ';
    let metrics = ctx.measureText(lineTest);
    let testWidth = metrics.width;

    if (testWidth > 310 && i > 0) {
      ctx.fillText(line, x, y);
      line = words[i] + ' ';
      y += lineHeight;
    } else {
      line = lineTest;
    }
  }
  ctx.fillText(line, x, y);
  ctx.textBaseline = oldBaseline;
}

function renderHeroCard(player) {
  if (player != undefined) {
    ctx.fillStyle = player.baseColor;
    ctx.strokeStyle = player.baseColor;
    ctx.globalAlpha = 0.3;
    //ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fillRect(canvasSize.x - 200, canvasSize.y - 250, 175, 225);
    ctx.lineCap = "butt";
    ctx.lineJoin = "round";
    ctx.lineWidth = 4;
    ctx.globalAlpha = 1;
    ctx.strokeRect(canvasSize.x - 200, canvasSize.y - 250, 175, 225);

    ctx.font = "30px 'Exo 2'";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.fillStyle = player.baseColor;
    ctx.strokeText(cap(player.hero), canvasSize.x - 110, canvasSize.y - 215);
    ctx.fillText(cap(player.hero), canvasSize.x - 110, canvasSize.y - 215);


    //ctx.fillStyle = "black";
    ctx.font = "20px 'Exo 2'";
    ctx.lineWidth = 2;
    ctx.strokeText("Speed: " + player.speed, canvasSize.x - 110, canvasSize.y - 180);
    ctx.strokeText("Energy: " + Math.floor(player.energy) + "/" + player.maxEnergy, canvasSize.x - 110, canvasSize.y - 150);
    ctx.strokeText("Regen: " + player.regen, canvasSize.x - 110, canvasSize.y - 120);

    ctx.fillText("Speed: " + player.speed, canvasSize.x - 110, canvasSize.y - 180);
    ctx.fillText("Energy: " + Math.floor(player.energy) + "/" + player.maxEnergy, canvasSize.x - 110, canvasSize.y - 150);
    ctx.fillText("Regen: " + player.regen, canvasSize.x - 110, canvasSize.y - 120);
    ctx.font = "15px 'Exo 2'";
    ctx.fillText("z/j", canvasSize.x - 150, canvasSize.y - 30);
    ctx.fillText("x/k", canvasSize.x - 70, canvasSize.y - 30);

    ctx.beginPath();
    //ctx.fillStyle = "#999999";
    if (player.abilityImages[0]) ctx.drawImage(player.abilityImages[0], canvasSize.x - 150 - 30, canvasSize.y - 75 - 30, 60, 60);
    else {
      ctx.fillStyle = player.baseColor;
      ctx.rect(canvasSize.x - 150 - 30, canvasSize.y - 75 - 30, 60, 60);
      ctx.fill();
    }
    if (ability1cooldown > 0) {
      ctx.beginPath();
      ctx.fillStyle = "#00000099";
      drawAbilityLock(canvasSize.x - 150, canvasSize.y - 75, 60, 60, 1 - ability1cooldown / maxAbility1);
    }

    ctx.beginPath();
    //ctx.fillStyle = "#999999";
    if (player.abilityImages[1]) ctx.drawImage(player.abilityImages[1], canvasSize.x - 70 - 30, canvasSize.y - 75 - 30, 60, 60);
    else {
      ctx.fillStyle = player.baseColor;
      ctx.rect(canvasSize.x - 70 - 30, canvasSize.y - 75 - 30, 60, 60);
      ctx.fill();
    }

    if (ability2cooldown > 0) {
      ctx.beginPath();
      ctx.fillStyle = "#00000099";
      drawAbilityLock(canvasSize.x - 70, canvasSize.y - 75, 60, 60, 1 - ability2cooldown / maxAbility2);
    }
    if (player.hero == "celestial") {
      ctx.fillStyle = "black";
      ctx.font = "40px 'Helvetica'";
      ctx.fillText(player.celestialRem, canvasSize.x - 70, canvasSize.y - 53);
      ctx.font = "15px 'Exo 2'";
    }

    try {
      if (mouseX > canvasSize.x - 150 - 30 && mouseX < canvasSize.x - 150 + 30) {
        if (mouseY > canvasSize.y - 75 - 30 && mouseY < canvasSize.y - 75 + 30) {
          ctx.fillStyle = "rgba(40, 40, 40, 0.75)";
          ctx.fillRect(canvasSize.x - 525, canvasSize.y - 250, 325, 225);
          ctx.fillStyle = "rgba(255, 255, 255, 1)";
          ctx.globalAlpha = 1;
          let text = CONSTANTS.heroes[player.hero].a1desc;
          if (text == "") text = "No ability";
          wrapText(text, canvasSize.x - 362.5, canvasSize.y - 137.5);
        }
      }

      if (mouseX > canvasSize.x - 70 - 30 && mouseX < canvasSize.x - 70 + 30) {
        if (mouseY > canvasSize.y - 75 - 30 && mouseY < canvasSize.y - 75 + 30) {
          ctx.fillStyle = "rgba(40, 40, 40, 0.75)";
          ctx.fillRect(canvasSize.x - 525, canvasSize.y - 250, 325, 225);
          ctx.fillStyle = "rgba(255, 255, 255, 1)";
          ctx.globalAlpha = 1;
          let text = CONSTANTS.heroes[player.hero].a2desc;
          if (text == "") text = "No ability";
          wrapText(text, canvasSize.x - 362.5, canvasSize.y - 137.5);
        }
      }
    } catch {}

    ctx.fillStyle = "rgb(0, 0, 0)";
  }
}

function renderVictoryText(world, area) {
  ctx.textAlign = "center";
  ctx.lineWidth = 6;
  ctx.fillStyle = "#00fc6a";
  ctx.strokeStyle = "#058036";
  ctx.font = "bold " + 35 + "px Tahoma, Verdana, Segoe, sans-serif";
  let unlocked = false;
  let textc = 0;
  if (victoryTexts[world][area][1]) {
    if (!heroes.includes(victoryTexts[world][area][1].toLowerCase())) {
      ctx.strokeText("Unlocked " + victoryTexts[world][area][1] + "!", canvasSize.x / 2, canvasSize.y / 1.15);
      ctx.fillText("Unlocked " + victoryTexts[world][area][1] + "!", canvasSize.x / 2, canvasSize.y / 1.15);
      unlocked = true;
      textc++;
    }
  }
  if (victoryTexts[world][area][2]) {
    ctx.strokeText("Added " + victoryTexts[world][area][2] + " to your hat collection!", canvasSize.x / 2, canvasSize.y / 1.15 + (textc * 50));
    ctx.fillText("Added " + victoryTexts[world][area][2] + " to your hat collection!", canvasSize.x / 2, canvasSize.y / 1.15 + (textc * 50));
    unlocked = true;
    textc++;
  }
  if (unlocked) {
    if (world == "Corrupted Core" && area < 0) {
      ctx.globalAlpha = 0.1;
    }
    ctx.strokeText(victoryTexts[world][area][0], canvasSize.x / 2, canvasSize.y / 1.25);
    ctx.fillText(victoryTexts[world][area][0], canvasSize.x / 2, canvasSize.y / 1.25);
    if (world == "Corrupted Core" && area < 0) {
      ctx.globalAlpha = 1;
    }
  } else {
    if (world == "Corrupted Core" && area < 0) {
      ctx.globalAlpha = 0.1;
    }
    ctx.strokeText(victoryTexts[world][area][0], canvasSize.x / 2, canvasSize.y / 1.15);
    ctx.fillText(victoryTexts[world][area][0], canvasSize.x / 2, canvasSize.y / 1.15);
    if (world == "Corrupted Core" && area < 0) {
      ctx.globalAlpha = 1;
    }
  }
}

function renderMapName(player) {
  const worldData = CONSTANTS.worlds[world] || CONSTANTS.worlds["_default"];
  ctx.textAlign = "center";
  ctx.lineWidth = 6;

  ctx.fillStyle = (worldData.title && worldData.title.fillStyle) ? typeof worldData.title.fillStyle == "string" ? worldData.title.fillStyle : (worldData.title.fillStyle.call && worldData.title.fillStyle.call()) : CONSTANTS.worlds["_default"].title.fillStyle;

  ctx.strokeStyle = (worldData.title && worldData.title.strokeStyle) ? typeof worldData.title.strokeStyle == "string" ? worldData.title.strokeStyle : (worldData.title.strokeStyle.call && worldData.title.strokeStyle.call()) : CONSTANTS.worlds["_default"].title.strokeStyle;

  ctx.font = "bold " + 35 + "px Tahoma, Verdana, Segoe, sans-serif";
  if (!player) return;
  if (player.world != "Toilsome Traverse" && player.world !=  "Toilsome Traverse Alternate Universe" && player.world != "Cryptic Corridor" && player.world != "Cryptic Corridor Hard") {
    if (player.area % 40 == 1 && player.area > 1) {
      ctx.strokeText(players[selfId].world + ': Area ' + player.area + " Victory!", canvasSize.x / 2, 40);
      ctx.fillText(players[selfId].world + ': Area ' + player.area + " Victory!", canvasSize.x / 2, 40);
    } else {
      if (player.world != "i eat idiot" && player.world != "Calamitic Coliseum") {
        if (player.area % 10 == 0) {
          if (player.world == "Corrupted Core" && player.area == 0) {
            ctx.strokeText("Storage", canvasSize.x / 2, 40);
            ctx.fillText("Storage", canvasSize.x / 2, 40);
          } else {
            ctx.strokeText(players[selfId].world + ': Area ' + player.area + " BOSS", canvasSize.x / 2, 40);
            ctx.fillText(players[selfId].world + ': Area ' + player.area + " BOSS", canvasSize.x / 2, 40);
          }
        } else {
          if (player.world != "Duel") {
            ctx.strokeText(players[selfId].world + ': Area ' + player.area, canvasSize.x / 2, 40);
            ctx.fillText(players[selfId].world + ': Area ' + player.area, canvasSize.x / 2, 40);
          } else {
            ctx.strokeText(players[selfId].world + ': ' + player.area, canvasSize.x / 2, 40);
            ctx.fillText(players[selfId].world + ': ' + player.area, canvasSize.x / 2, 40);
          }
        }
      } else {
        if (player.world == "i eat idiot") {
          if (player.area % 7 == 0) {
            ctx.strokeText(players[selfId].world + ': Area ' + player.area + " IDIT", canvasSize.x / 2, 40);
            ctx.fillText(players[selfId].world + ': Area ' + player.area + " IDIT", canvasSize.x / 2, 40);
          } else {
            ctx.strokeText(players[selfId].world + ': Area ' + player.area, canvasSize.x / 2, 40);
            ctx.fillText(players[selfId].world + ': Area ' + player.area, canvasSize.x / 2, 40);
          }
        } else {
          if (player.area == 11) {
            ctx.strokeText(players[selfId].world + ': Area ' + player.area + " BOSS", canvasSize.x / 2, 40);
            ctx.fillText(players[selfId].world + ': Area ' + player.area + " BOSS", canvasSize.x / 2, 40);
          } else {
            ctx.strokeText(players[selfId].world + ': Area ' + player.area, canvasSize.x / 2, 40);
            ctx.fillText(players[selfId].world + ': Area ' + player.area, canvasSize.x / 2, 40);
          }
        }
      }
    }
  } else if (player.world == "Toilsome Traverse") {
    let aName = toilsomeAreas[parseInt(player.area) - 1];
    ctx.strokeText(players[selfId].world + ': ' + aName, canvasSize.x / 2, 40);
    ctx.fillText(players[selfId].world + ': ' + aName, canvasSize.x / 2, 40);
  }else if (player.world == "Toilsome Traverse Alternate Universe") {
    let aName = toilsomeTraverseAlternateUniverseAreas[parseInt(player.area) - 1];
    ctx.strokeText(players[selfId].world + ': ' + aName, canvasSize.x / 2, 40);
    ctx.fillText(players[selfId].world + ': ' + aName, canvasSize.x / 2, 40);
  } else {
    let aName = crypticAreas[parseInt(player.area) - 1];
    ctx.strokeText(players[selfId].world + ': ' + aName, canvasSize.x / 2, 40);
    ctx.fillText(players[selfId].world + ': ' + aName, canvasSize.x / 2, 40);
  }
  timeTaken = Date.now() - startTime;
  timeTaken /= slowdown;
  let s = Math.floor(timeTaken / 1000);
  let m = Math.floor(s / 60);
  s = s % 60;
  ctx.strokeText(m + 'm ' + s + 's', canvasSize.x / 2, 80);
  ctx.fillText(m + 'm ' + s + 's', canvasSize.x / 2, 80);
}

function renderHero(player, isSelf = false) {
  let pos = isSelf ? {
    renderX: center.x,
    renderY: center.y
  } : {
    renderX: player.renderX + playerOffset.x,
    renderY: player.renderY + playerOffset.y
  }

  if (["Wall 1", "Wall 2", "wallGuard1", "wallGuard2"].includes(player.name)) {
    ctx.beginPath();
    ctx.ellipse(pos.renderX, pos.renderY, player.radius * 2, player.radius * 20, 0, 0, Math.PI * 2);
    ctx.fillStyle = player.color;
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
    return;
  }
  if (player.hat.includes("Paw Trail")) {
    if (player.queCooldown == undefined) {
      player.queCooldown = 0;
      player.hatParts = [];
    } else {
      player.queCooldown--;
      if (player.queCooldown < 0 && particlesOption != 0) {
        player.queCooldown = particlesOption == 1 ? 16 : particlesOption == 2 ? 12 : 8;
        player.hatParts.push(new StepParticle(player.renderX, player.renderY, player.vel, player.hatParts.length > 0 ? player.hatParts[player.hatParts.length - 1].isRight : true));
      }
      let arrayLength = player.hatParts.length;
      for (let j = 0; j < arrayLength; j++) {
        let i = player.hatParts[j];
        i.update();
        let alpha = i.life / 20;
        if (alpha > 1) {
          alpha = 1;
        }
        if (alpha < 0) {
          alpha = 0;
        }
        alpha *= 0.7;
        ctx.globalAlpha = alpha;
        ctx.translate(i.x + playerOffset.x, i.y + playerOffset.y)
        ctx.rotate(i.rotAngle);
        ctx.fillStyle = i.color;
        ctx.drawImage(pawImage, -pawImage.width / 2, -pawImage.height / 2)
        ctx.rotate(-i.rotAngle);
        ctx.translate(-i.x - playerOffset.x, -i.y - playerOffset.y);
      }
      player.hatParts = player.hatParts.filter((e) => e.life > 0)
      ctx.globalAlpha = 1;
    }
  }
  if (player.hat.includes("Charged Trail")) {
    if (player.queCooldown == undefined) {
      player.queCooldown = 0;
      player.hatParts = [];
    } else {
      player.queCooldown--;
      if (player.queCooldown < 0 && particlesOption != 0) {
        player.queCooldown = particlesOption == 1 ? 9 : particlesOption == 2 ? 3 : 3;
        player.hatParts.push(new ChargedParticle(player.renderX, player.renderY, player.vel, player.hatParts.length > 0 ? player.hatParts[player.hatParts.length - 1].isRight : true));
      }
      let arrayLength = player.hatParts.length;
      ctx.translate(playerOffset.x, playerOffset.y)
      for (let j = 0; j < arrayLength; j++) {
        let i = player.hatParts[j];
        i.update();
        let alpha = i.life / 20;
        if (alpha > 1) {
          alpha = 1;
        }
        if (alpha < 0) {
          alpha = 0;
        }
        alpha *= 0.5;
        if (j != 0) {
          ctx.strokeStyle = `rgb(${i.color[0]}, ${i.color[1]}, ${i.color[2]})`
          ctx.globalAlpha = alpha;
          ctx.lineTo(i.x, i.y)
          ctx.stroke();
        }

        if (j != arrayLength - 1) {
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.lineWidth = i.radius * 2;
          ctx.beginPath();
          ctx.lineTo(i.x, i.y);
        }

      }
      ctx.translate(-playerOffset.x, -playerOffset.y);
      player.hatParts = player.hatParts.filter((e) => e.life > 0)
      ctx.globalAlpha = 1;
    }
  }
  if (player.hat.includes('Double Trail')) {
    if (player.queCooldown == undefined) {
      player.queCooldown = 0;
      player.hatParts = [];
      player.hatParts2 = [];
      player.changeTimer = 20;
      player.mainColor = 0;
    } else {
      player.queCooldown--;
      player.changeTimer--;
      if (player.changeTimer < 0) {
        player.mainColor++;
        player.changeTimer = 100;
      }
      if (player.queCooldown < 0 && particlesOption != 0) {
        player.queCooldown = particlesOption == 1 ? 6 : particlesOption == 2 ? 2 : 2;
        player.hatParts.push(new DoubleParticle(player.renderX, player.renderY, player.vel, true, player.mainColor % 2));
        player.hatParts2.push(new DoubleParticle(player.renderX, player.renderY, player.vel, false, (player.mainColor + 1) % 2));
      }
      let arrayLength = player.hatParts.length;
      ctx.translate(playerOffset.x, playerOffset.y)
      for (let j = 0; j < arrayLength; j++) {
        let i = player.hatParts[j];
        i.update();
        let alpha = i.life / 20;
        if (alpha > 1) {
          alpha = 1;
        }
        if (alpha < 0) {
          alpha = 0;
        }
        alpha *= 0.5;
        if (j != 0) {
          ctx.strokeStyle = i.color;
          ctx.globalAlpha = alpha;
          ctx.lineTo(i.x, i.y)
          ctx.stroke();
        }

        if (j != arrayLength - 1) {
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.lineWidth = i.radius * 2;
          ctx.beginPath();
          ctx.lineTo(i.x, i.y);
        }

      }
      arrayLength = player.hatParts2.length;
      for (let j = 0; j < arrayLength; j++) {
        let i = player.hatParts2[j];
        i.update();
        let alpha = i.life / 20;
        if (alpha > 1) {
          alpha = 1;
        }
        if (alpha < 0) {
          alpha = 0;
        }
        alpha *= 0.5;
        if (j != 0) {
          ctx.strokeStyle = i.color;
          ctx.globalAlpha = alpha;
          ctx.lineTo(i.x, i.y)
          ctx.stroke();
        }

        if (j != arrayLength - 1) {
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.lineWidth = i.radius * 2;
          ctx.beginPath();
          ctx.lineTo(i.x, i.y);
        }

      }

      ctx.translate(-playerOffset.x, -playerOffset.y);
      player.hatParts = player.hatParts.filter((e) => e.life > 0)
      player.hatParts2 = player.hatParts2.filter((e) => e.life > 0)
      ctx.globalAlpha = 1;
    }
  }
  if (player.hat.includes('Land Trail')) {
    if (player.queCooldown == undefined) {
      player.queCooldown = 0;
      player.queCooldown2 = 0;
      player.hatParts = [];
      player.hatParts2 = [];
    } else {
      player.queCooldown--;
      if (player.queCooldown < 0 && particlesOption != 0) {
        player.queCooldown = particlesOption == 1 ? 6 : particlesOption == 2 ? 1 : 1;
        player.hatParts.push(new PlanetWaterParticle(player.renderX, player.renderY));
      }
      player.queCooldown2--;
      if (player.queCooldown2 < 0 && particlesOption != 0) {
        player.queCooldown2 = 6;
        player.hatParts2.push(new PlanetLandParticle(player.renderX, player.renderY, player.vel));
      }
      let arrayLength = player.hatParts.length;
      ctx.translate(playerOffset.x, playerOffset.y)
      for (let j = 0; j < arrayLength; j++) {
        let i = player.hatParts[j];
        i.update();
        let alpha = i.life / 20;
        if (alpha > 1) {
          alpha = 1;
        }
        if (alpha < 0) {
          alpha = 0;
        }
        alpha *= 0.5;
        if (j != 0) {
          ctx.strokeStyle = "#78b6c4";
          ctx.globalAlpha = alpha;
          ctx.lineTo(i.x, i.y)
          ctx.stroke();
        }

        if (j != arrayLength - 1) {
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.lineWidth = i.radius * 2;
          ctx.beginPath();
          ctx.lineTo(i.x, i.y);
        }

      }
      arrayLength = player.hatParts2.length;
      for (let j = 0; j < arrayLength; j++) {
        let i = player.hatParts2[j];
        i.update();
        let alpha = i.life / 20;
        if (alpha > 1) {
          alpha = 1;
        }
        if (alpha < 0) {
          alpha = 0;
        }
        alpha *= 0.5;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.fillStyle = "#509158"
        ctx.arc(i.x, i.y, i.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.translate(-playerOffset.x, -playerOffset.y);
      player.hatParts = player.hatParts.filter((e) => e.life > 0)
      player.hatParts2 = player.hatParts2.filter((e) => e.life > 0)
      ctx.globalAlpha = 1;
    }
  }

  if (player.hat.includes("Troll Trail")) {
    if (player.queCooldown == undefined) {
      player.queCooldown = 0;
      player.hatParts = [];
    } else {
      player.queCooldown -= 4;
      if (player.queCooldown < 0 && particlesOption != 0) {
        player.queCooldown = particlesOption == 1 ? 24 : particlesOption == 2 ? 16 : 12;
        player.hatParts.push(new StepParticleShort(player.renderX, player.renderY, player.vel, player.hatParts.length > 0 ? player.hatParts[player.hatParts.length - 1].isRight : true));
      }
      let arrayLength = player.hatParts.length;
      for (let j = 0; j < arrayLength; j++) {
        let i = player.hatParts[j];
        i.update();
        let alpha = i.life / 20;
        if (alpha > 1) {
          alpha = 1;
        }
        if (alpha < 0) {
          alpha = 0;
        }
        alpha *= 0.7;
        ctx.globalAlpha = alpha;
        ctx.translate(i.x + playerOffset.x, i.y + playerOffset.y)
        ctx.rotate(i.rotAngle);
        ctx.fillStyle = i.color;
        ctx.drawImage(trollImage, -20 / 2, -20 / 2, 20, 20)
        ctx.rotate(-i.rotAngle);
        ctx.translate(-i.x - playerOffset.x, -i.y - playerOffset.y);
      }
      player.hatParts = player.hatParts.filter((e) => e.life > 0)
      ctx.globalAlpha = 1;
    }
  }
  if (player.hat.includes("Troll Trail OG")) {
    if (player.queCooldown == undefined) {
      player.queCooldown = 0;
      player.hatParts = [];
    } else {
      player.queCooldown -= 4;
      if (player.queCooldown < 0 && particlesOption != 0) {
        player.queCooldown = particlesOption == 1 ? 16 : particlesOption == 2 ? 12 : 8;
        player.hatParts.push(new StepParticle(player.renderX, player.renderY, player.vel, player.hatParts.length > 0 ? player.hatParts[player.hatParts.length - 1].isRight : true, 5));
      }
      let arrayLength = player.hatParts.length;
      for (let j = 0; j < arrayLength; j++) {
        let i = player.hatParts[j];
        i.update();
        let alpha = i.life / 20;
        if (alpha > 1) {
          alpha = 1;
        }
        if (alpha < 0) {
          alpha = 0;
        }
        alpha *= 0.7;
        ctx.globalAlpha = alpha;
        ctx.translate(i.x + playerOffset.x, i.y + playerOffset.y)
        ctx.rotate(i.rotAngle);
        ctx.fillStyle = i.color;
        ctx.drawImage(trollImage, -25 / 2, -25 / 2, 25, 25)
        ctx.rotate(-i.rotAngle);
        ctx.translate(-i.x - playerOffset.x, -i.y - playerOffset.y);
      }
      player.hatParts = player.hatParts.filter((e) => e.life > 0)
      ctx.globalAlpha = 1;
    }
  }
  if (player.hat.includes("Not Even A Hat")) {
    if (player.queCooldown == undefined) {
      player.queCooldown = 0;
      player.hatParts = [];
    } else {
      player.queCooldown--;
      if (player.queCooldown < 0 && particlesOption != 0) {
        player.queCooldown = particlesOption == 1 ? 8 : 2;
        player.hatParts.push(new QuestionParticle(player.renderX, player.renderY));
        if (particlesOption == 3)
          player.hatParts.push(new QuestionParticle(player.renderX, player.renderY));
      }
      let arrayLength = player.hatParts.length;
      for (let j = 0; j < arrayLength; j++) {
        let i = player.hatParts[j];
        i.update();
        let alpha = i.life / 20;
        if (alpha > 1) {
          alpha = 1;
        }
        if (alpha < 0) {
          alpha = 0;
        }
        alpha *= 0.7;
        ctx.globalAlpha = alpha;
        ctx.translate(i.x + playerOffset.x, i.y + playerOffset.y)
        ctx.rotate(i.rotAngle);
        ctx.fillStyle = i.color;
        ctx.font = `${26 - i.life / 6}px 'Arial'`
        ctx.fillText("?", 0, 0);
        ctx.rotate(-i.rotAngle);
        ctx.translate(-i.x - playerOffset.x, -i.y - playerOffset.y);
      }
      player.hatParts = player.hatParts.filter((e) => e.life > 0)
      ctx.globalAlpha = 1;
    }
  }
  if (player.hat.includes("Pentagon Trail")) {
    if (player.queCooldown == undefined) {
      player.queCooldown = 0;
      player.hatParts = [];
    } else {
      player.queCooldown--;
      if (player.queCooldown < 0 && particlesOption != 0) {
        player.queCooldown = 2;
        player.hatParts.push(new PentagonParticle(player.renderX, player.renderY));
        if (particlesOption == 3)
          player.hatParts.push(new PentagonParticle(player.renderX, player.renderY));
      }
      let arrayLength = player.hatParts.length;
      for (let j = 0; j < arrayLength; j++) {
        let i = player.hatParts[j];
        i.update();
        let alpha = i.life / 10;
        if (alpha > 1) {
          alpha = 1;
        }
        if (alpha < 0) {
          alpha = 0;
        }
        alpha *= 0.6;
        ctx.globalAlpha = alpha;
        ctx.translate(i.x + playerOffset.x, i.y + playerOffset.y)
        ctx.rotate(i.rotAngle);
        ctx.beginPath();
        ctx.strokeStyle = `hsl(${Math.cos(Date.now() / 100) * 50 + 200}, 70%, 33%)`;
        ctx.lineWidth = 2;
        for (let j = 6; j--; j > 0) {
          ctx.lineTo(i.life * 3 / 5 * Math.cos(j * Math.PI * 2 / 5), i.life * 3 / 5 * Math.sin(j * Math.PI * 2 / 5))
        }
        ctx.stroke();
        ctx.rotate(-i.rotAngle);
        ctx.translate(-i.x - playerOffset.x, -i.y - playerOffset.y);
      }
      player.hatParts = player.hatParts.filter((e) => e.life > 0)
      ctx.globalAlpha = 1;
    }
  }

  if (player.hat.includes("Fire Trail")) {
    if (player.queCooldown == undefined) {
      player.queCooldown = 0;
      player.hatParts = [];
    } else {
      player.queCooldown -= 3;
      if (player.queCooldown < 0 && particlesOption != 0) {
        player.queCooldown = particlesOption == 1 ? 8 : 2;
        player.hatParts.push(new FireParticle(player.renderX, player.renderY, player.area));
      }
      let arrayLength = player.hatParts.length;
      ctx.translate(playerOffset.x, playerOffset.y)
      for (let j = 0; j < arrayLength; j++) {
        let i = player.hatParts[j];
        i.update();
        let alpha = i.life / 20;
        if (alpha > 1) {
          alpha = 1;
        }
        if (alpha < 0) {
          alpha = 0;
        }
        alpha *= 0.3;
        if (j != 0) {
          ctx.strokeStyle = `rgb(255, 0, 0)`
          ctx.globalAlpha = alpha;
          ctx.lineTo(i.x, i.y)
          ctx.stroke();
        }

        if (j != arrayLength - 1) {
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.lineWidth = i.radius * 2;
          ctx.beginPath();
          ctx.lineTo(i.x, i.y);
        }

      }
      ctx.translate(-playerOffset.x, -playerOffset.y);
      player.hatParts = player.hatParts.filter((e) => e.life > 0)
      ctx.globalAlpha = 1;
    }
  }
  if (player.hat.includes("Accelerating Trail")) {
    if (player.queCooldown == undefined) {
      player.queCooldown = 0;
      player.hatParts = [];
    } else {
      player.queCooldown -= 3;
      if (player.queCooldown < 0 && particlesOption != 0) {
        player.queCooldown = particlesOption == 1 ? 8 : 2;
        player.hatParts.push(new AcceleratingParticle(player.renderX, player.renderY, player.area));
      }
      let arrayLength = player.hatParts.length;
      ctx.translate(playerOffset.x, playerOffset.y)
      for (let j = 0; j < arrayLength; j++) {
        let i = player.hatParts[j];
        i.update();
        let alpha = i.life / 20;
        if (alpha > 1) {
          alpha = 1;
        }
        if (alpha < 0) {
          alpha = 0;
        }
        alpha *= 0.5;
        if (j != 0) {
          ctx.strokeStyle = `rgb(${i.color[0]}, ${i.color[1]}, ${i.color[2]})`
          ctx.globalAlpha = alpha;
          ctx.lineTo(i.x, i.y)
          ctx.stroke();
        }

        if (j != arrayLength - 1) {
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.lineWidth = i.radius * 2;
          ctx.beginPath();
          ctx.lineTo(i.x, i.y);
        }

      }
      ctx.translate(-playerOffset.x, -playerOffset.y);
      player.hatParts = player.hatParts.filter((e) => e.life > 0)
      ctx.globalAlpha = 1;
    }
  }
  if (player.hat.includes("Cold Trail")) {
    if (player.queCooldown == undefined) {
      player.queCooldown = 0;
      player.hatParts = [];
    } else {
      player.queCooldown -= 3;
      if (player.queCooldown < 0 && particlesOption != 0) {
        player.queCooldown = particlesOption == 1 ? 8 : 2;
        player.hatParts.push(new ColdParticle(player.renderX, player.renderY, player.area));
      }
      let arrayLength = player.hatParts.length;
      ctx.translate(playerOffset.x, playerOffset.y)
      for (let j = 0; j < arrayLength; j++) {
        let i = player.hatParts[j];
        i.update();
        let alpha = i.life / 20;
        if (alpha > 1) {
          alpha = 1;
        }
        if (alpha < 0) {
          alpha = 0;
        }
        alpha *= 0.5;
        if (j != 0) {
          ctx.strokeStyle = `hsl(${i.color[0]}, ${i.color[1]}%, ${i.color[2]}%)`
          ctx.globalAlpha = alpha;
          ctx.lineTo(i.x, i.y)
          ctx.stroke();
        }

        if (j != arrayLength - 1) {
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.lineWidth = i.radius * 2;
          ctx.beginPath();
          ctx.lineTo(i.x, i.y);
        }

      }
      ctx.translate(-playerOffset.x, -playerOffset.y);
      player.hatParts = player.hatParts.filter((e) => e.life > 0)
      ctx.globalAlpha = 1;
    }
  }
  if (player.hat.includes("Blazing Trail")) {
    if (player.queCooldown == undefined) {
      player.queCooldown = 0;
      player.hatParts = [];
    } else {
      player.queCooldown -= 3;
      if (player.queCooldown < 0 && particlesOption != 0) {
        player.queCooldown = particlesOption == 1 ? 8 : 2;
        player.hatParts.push(new BlazingParticle(player.renderX, player.renderY, player.area));
      }
      let arrayLength = player.hatParts.length;
      ctx.translate(playerOffset.x, playerOffset.y)
      for (let j = 0; j < arrayLength; j++) {
        let i = player.hatParts[j];
        i.update();
        let alpha = i.life / 20;
        if (alpha > 1) {
          alpha = 1;
        }
        if (alpha < 0) {
          alpha = 0;
        }
        alpha *= 0.3;
        if (j != 0) {
          ctx.strokeStyle = `rgb(${i.color[0]}, ${i.color[1]}, ${i.color[2]})`
          ctx.globalAlpha = alpha;
          ctx.lineTo(i.x, i.y)
          ctx.stroke();
        }

        if (j != arrayLength - 1) {
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.lineWidth = i.radius * 2;
          ctx.beginPath();
          ctx.lineTo(i.x, i.y);
        }

      }
      ctx.translate(-playerOffset.x, -playerOffset.y);
      player.hatParts = player.hatParts.filter((e) => e.life > 0)
      ctx.globalAlpha = 1;
    }
  }
  if (player.hat.includes("Developer Trail")) {
    if (player.queCooldown == undefined) {
      player.queCooldown = 0;
      player.hatParts = [];
    } else {
      player.queCooldown -= 3;
      if (player.queCooldown < 0 && particlesOption != 0) {
        player.queCooldown = particlesOption == 1 ? 7 : 2;
        player.hatParts.push(new DeveloperParticle(player.renderX, player.renderY, player.area));
      }
      let arrayLength = player.hatParts.length;
      ctx.translate(playerOffset.x, playerOffset.y)
      ctx.globalAlpha = 0.3;
      for (let j = 0; j < arrayLength; j++) {
        let i = player.hatParts[j];
        i.update();
        let alpha = i.life / 50;
        if (alpha > 1) {
          alpha = 1;
        }
        if (alpha < 0) {
          alpha = 0;
        }
        alpha *= 0.3;
        if (j != 0) {
          ctx.strokeStyle = `rgb(${i.color[0]}, ${i.color[1]}, ${i.color[2]})`
          if (i.life < 50) {
            ctx.globalAlpha = alpha;
          }
          ctx.lineTo(i.x, i.y)
          ctx.stroke();
        }

        if (j != arrayLength - 1) {
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.lineWidth = i.radius * 2;
          ctx.beginPath();
          ctx.lineTo(i.x, i.y);
        }

      }
      ctx.translate(-playerOffset.x, -playerOffset.y);
      player.hatParts = player.hatParts.filter((e) => e.life > 0)
      ctx.globalAlpha = 1;
    }
  }

  if (player.hat.includes("Drunk Trail")) {
    if (player.queCooldown == undefined) {
      player.queCooldown = 0;
      player.hatParts = [];
    } else {
      player.queCooldown -= 3;
      if (player.queCooldown < 0 && particlesOption != 0) {
        player.queCooldown = particlesOption == 1 ? 8 : 2;
        player.hatParts.push(new DrunkParticle(player.renderX, player.renderY, player.area));
      }
      let arrayLength = player.hatParts.length;
      ctx.translate(playerOffset.x, playerOffset.y)
      for (let j = 0; j < arrayLength; j++) {
        let i = player.hatParts[j];
        i.update();
        let alpha = i.life / 20;
        if (alpha > 1) {
          alpha = 1;
        }
        if (alpha < 0) {
          alpha = 0;
        }
        alpha *= 0.3;
        if (j != 0) {
          ctx.strokeStyle = `rgb(${i.color[0]}, ${i.color[1]}, ${i.color[2]})`
          ctx.globalAlpha = alpha;
          ctx.lineTo(i.x, i.y)
          ctx.stroke();
        }

        if (j != arrayLength - 1) {
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.lineWidth = i.radius * 2;
          ctx.beginPath();
          ctx.lineTo(i.x, i.y);
        }

      }
      ctx.translate(-playerOffset.x, -playerOffset.y);
      player.hatParts = player.hatParts.filter((e) => e.life > 0)
      ctx.globalAlpha = 1;
    }
  }

  if (player.hat.includes("Steam Trail")) {
    if (player.queCooldown == undefined) {
      player.queCooldown = 0;
      player.hatParts = [];
    } else {
      player.queCooldown -= 1;
      if (player.queCooldown < 0 && particlesOption != 0) {
        player.queCooldown = particlesOption == 1 ? 2 : 1;
        player.hatParts.push(new SteamParticle(player.renderX, player.renderY, player.area));
      }
      let arrayLength = player.hatParts.length;
      for (let j = 0; j < arrayLength; j++) {
        let i = player.hatParts[j];
        i.update();

        let alpha = i.life / 20;
        if (alpha > 1) {
          alpha = 1;
        }
        if (alpha < 0) {
          alpha = 0;
        }
        alpha *= 0.7;
        ctx.lineWidth = 2;
        ctx.strokeStyle = `rgb(0, 0, 0)`
        ctx.globalAlpha = alpha;
        ctx.translate(i.x + playerOffset.x, i.y + playerOffset.y)
        ctx.beginPath();
        ctx.arc(0, 0, i.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.translate(-i.x - playerOffset.x, -i.y - playerOffset.y);

      }
      player.hatParts = player.hatParts.filter((e) => e.life > 0)
      ctx.globalAlpha = 1;
    }
  }
  if (player.hat.includes("Dark Trail")) {
    if (player.queCooldown == undefined) {
      player.queCooldown = 0;
      player.hatParts = [];
    } else {
      player.queCooldown -= 3;
      if (player.queCooldown < 0 && particlesOption != 0) {
        player.queCooldown = particlesOption == 1 ? 8 : 2;
        player.hatParts.push(new DarkParticle(player.renderX, player.renderY, player.area));
      }
      let arrayLength = player.hatParts.length;
      ctx.translate(playerOffset.x, playerOffset.y)
      for (let j = 0; j < arrayLength; j++) {
        let i = player.hatParts[j];
        i.update();
        let alpha = i.life / 20;
        if (alpha > 1) {
          alpha = 1;
        }
        if (alpha < 0) {
          alpha = 0;
        }
        alpha *= 0.4;
        if (j != 0) {
          ctx.strokeStyle = `black`
          ctx.globalAlpha = alpha;
          ctx.lineTo(i.x, i.y)
          ctx.stroke();
        }

        if (j != arrayLength - 1) {
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.lineWidth = i.radius * 2;
          ctx.beginPath();
          ctx.lineTo(i.x, i.y);
        }

      }
      ctx.translate(-playerOffset.x, -playerOffset.y);
      player.hatParts = player.hatParts.filter((e) => e.life > 0)
      ctx.globalAlpha = 1;
    }
  }
  if (player.hat.includes("Omnipotent Trail")) {
    if (player.queCooldown == undefined) {
      player.queCooldown = 0;
      player.hatParts = [];
    } else {
      player.queCooldown -= 3;
      if (player.queCooldown < 0 && particlesOption != 0) {
        player.queCooldown = particlesOption == 1 ? 8 : 2;
        player.hatParts.push(new RainbowParticle(player.renderX, player.renderY, player.area));
      }
      let arrayLength = player.hatParts.length;
      ctx.translate(playerOffset.x, playerOffset.y)
      for (let j = 0; j < arrayLength; j++) {
        let i = player.hatParts[j];
        i.update();
        let alpha = i.life / 20;
        if (alpha > 1) {
          alpha = 1;
        }
        if (alpha < 0) {
          alpha = 0;
        }
        alpha *= 0.4;
        if (j != 0) {
          ctx.strokeStyle = `hsl(${i.life * 18}, 50%, 50%)`
          ctx.globalAlpha = alpha;
          ctx.lineTo(i.x, i.y)
          ctx.stroke();
        }

        if (j != arrayLength - 1) {
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.lineWidth = i.radius * 2;
          ctx.beginPath();
          ctx.lineTo(i.x, i.y);
        }

      }
      ctx.translate(-playerOffset.x, -playerOffset.y);
      player.hatParts = player.hatParts.filter((e) => e.life > 0)
      ctx.globalAlpha = 1;
    }

  }
  if (player.hat.includes("Ultra Omnipotent Trail")) {
    if (player.queCooldown == undefined) {
      player.queCooldown = 0;
      player.hatParts = [];
    } else {
      player.queCooldown -= 3;
      if (player.queCooldown < 0 && particlesOption != 0) {
        player.queCooldown = particlesOption == 1 ? 8 : 2;
        player.hatParts.push(new UltraRainbowParticle(player.renderX, player.renderY, player.area));
      }
      let arrayLength = player.hatParts.length;
      ctx.translate(playerOffset.x, playerOffset.y)
      for (let j = 0; j < arrayLength; j++) {
        let i = player.hatParts[j];
        i.update();
        let alpha = i.life / 30;
        if (alpha > 1) {
          alpha = 1;
        }
        if (alpha < 0) {
          alpha = 0;
        }
        alpha *= 0.4;
        if (j != 0) {
          ctx.strokeStyle = `hsl(${i.life * 10 + Date.now()/30}, 50%, 50%)`
          ctx.globalAlpha = alpha;
          ctx.lineTo(i.x, i.y)
          ctx.stroke();
        }

        if (j != arrayLength - 1) {
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.lineWidth = i.radius * 2;
          ctx.beginPath();
          ctx.lineTo(i.x, i.y);
        }

      }
      ctx.translate(-playerOffset.x, -playerOffset.y);
      player.hatParts = player.hatParts.filter((e) => e.life > 0)
      ctx.globalAlpha = 1;
    }

  }
  if (player.hat.includes("Glitch Trail")) {
    if (player.queCooldown == undefined) {
      player.queCooldown = 0;
      player.hatParts = [];
    } else {
      player.queCooldown -= 3;
      if (player.queCooldown < 0 && particlesOption != 0) {
        player.queCooldown = particlesOption == 1 ? 8 : 2;
        player.hatParts.push(new GlitchParticle(player.renderX, player.renderY, player.area));
      }
      let arrayLength = player.hatParts.length;
      ctx.translate(playerOffset.x, playerOffset.y)
      for (let j = 0; j < arrayLength; j++) {
        let i = player.hatParts[j];
        i.update();
        let alpha = i.life / 20;
        if (alpha > 1) {
          alpha = 1;
        }
        if (alpha < 0) {
          alpha = 0;
        }
        alpha *= 0.25;
        if (j != 0) {
          ctx.strokeStyle = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`
          ctx.globalAlpha = alpha;
          ctx.lineTo(i.x, i.y)
          ctx.stroke();
        }

        if (j != arrayLength - 1) {
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.lineWidth = i.radius * 2;
          ctx.beginPath();
          ctx.lineTo(i.x, i.y);
        }

      }
      ctx.translate(-playerOffset.x, -playerOffset.y);
      player.hatParts = player.hatParts.filter((e) => e.life > 0)
      ctx.globalAlpha = 1;
    }

  }
  if (player.hat.includes("Catastrophic Trail")) {
    if (player.queCooldown == undefined) {
      player.queCooldown = 0;
      player.hatParts = [];
    } else {
      player.queCooldown -= 3;
      if (player.queCooldown < 0 && particlesOption != 0) {
        player.queCooldown = particlesOption == 1 ? 8 : 2;
        player.hatParts.push(new CataParticle(player.renderX, player.renderY, player.area));
      }
      let arrayLength = player.hatParts.length;
      ctx.translate(playerOffset.x, playerOffset.y)
      for (let j = 0; j < arrayLength; j++) {
        let i = player.hatParts[j];
        i.update();
        let alpha = i.life / 20;
        if (alpha > 1) {
          alpha = 1;
        }
        if (alpha < 0) {
          alpha = 0;
        }
        alpha *= 0.4;
        if (j != 0) {
          ctx.strokeStyle = `hsl(0, 0%, ${i.life * 4}%)`
          ctx.globalAlpha = alpha;
          ctx.lineTo(i.x, i.y)
          ctx.stroke();
        }

        if (j != arrayLength - 1) {
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.lineWidth = i.radius * 2;
          ctx.beginPath();
          ctx.lineTo(i.x, i.y);
        }

      }
      ctx.translate(-playerOffset.x, -playerOffset.y);
      player.hatParts = player.hatParts.filter((e) => e.life > 0)
      ctx.globalAlpha = 1;
    }

  }
  if (player.hat.includes("Bronze Trail")) {
    if (player.queCooldown == undefined) {
      player.queCooldown = 0;
      player.hatParts = [];
    } else {
      player.queCooldown -= 2;
      if (player.queCooldown < 0 && particlesOption != 0) {
        player.queCooldown = particlesOption == 1 ? 8 : 2;
        player.hatParts.push(new BronzeParticle(player.renderX + Math.random() * 9 - 4.5, player.renderY + Math.random() * 9 - 4.5));
      }

      let arrayLength = player.hatParts.length;
      for (let j = 0; j < arrayLength; j++) {
        let i = player.hatParts[j];
        ctx.fillStyle = `rgb(176, 141, 87)`
        i.update();
        let alpha = i.life / 20;
        if (alpha > 1) {
          alpha = 1;
        }
        if (alpha < 0) {
          alpha = 0;
        }
        alpha *= 0.4;
        ctx.globalAlpha = alpha;
        ctx.translate(i.x + playerOffset.x, i.y + playerOffset.y)
        ctx.beginPath();
        ctx.arc(0, 0, i.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, 0, i.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowColor = "hsl(" + (Math.random() * 300) + ", 30%, 30%)";
        ctx.shadowBlur = i.radius * 3;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.translate(-i.x - playerOffset.x, -i.y - playerOffset.y);
      }
      player.hatParts = player.hatParts.filter((e) => e.life > 0)
      ctx.globalAlpha = 1;
    }
  }
  if (player.hat.includes("Silver Trail")) {
    if (player.queCooldown == undefined) {
      player.queCooldown = 0;
      player.hatParts = [];
    } else {
      player.queCooldown -= 2;
      if (player.queCooldown < 0 && particlesOption != 0) {
        player.queCooldown = particlesOption == 1 ? 8 : 2;
        player.hatParts.push(new SilverParticle(player.renderX + Math.random() * 9 - 4.5, player.renderY + Math.random() * 9 - 4.5));
      }

      let arrayLength = player.hatParts.length;
      for (let j = 0; j < arrayLength; j++) {
        let i = player.hatParts[j];
        if (i.life < 20) {
          ctx.fillStyle = `rgb(176, 141, 87)`
        } else if (i.life < 30) {
          let diff = (i.life - 20) / 10;
          ctx.fillStyle = `rgb(${176 - diff * 6}, ${141 + diff * 31}, ${87 + diff * 94})`
        } else {
          ctx.fillStyle = `rgb(168, 172, 181)`
        }
        i.update();
        let alpha = i.life / 20;
        if (alpha > 1) {
          alpha = 1;
        }
        if (alpha < 0) {
          alpha = 0;
        }
        alpha *= 0.4;
        ctx.globalAlpha = alpha;
        ctx.translate(i.x + playerOffset.x, i.y + playerOffset.y)
        ctx.beginPath();
        ctx.arc(0, 0, i.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, 0, i.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowColor = "hsl(" + (Math.random() * 300) + ", 30%, 30%)";
        ctx.shadowBlur = i.radius * 4;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.translate(-i.x - playerOffset.x, -i.y - playerOffset.y);
      }
      player.hatParts = player.hatParts.filter((e) => e.life > 0)
      ctx.globalAlpha = 1;
    }
  }
  if (player.hat.includes("Gold Trail")) {
    if (player.queCooldown == undefined) {
      player.queCooldown = 0;
      player.hatParts = [];
    } else {
      player.queCooldown -= 2;
      if (player.queCooldown < 0 && particlesOption != 0) {
        player.queCooldown = particlesOption == 1 ? 8 : 2;
        player.hatParts.push(new GoldParticle(player.renderX + Math.random() * 9 - 4.5, player.renderY + Math.random() * 9 - 4.5));
      }

      let arrayLength = player.hatParts.length;
      for (let j = 0; j < arrayLength; j++) {
        let i = player.hatParts[j];
        if (i.life < 20) {
          ctx.fillStyle = `rgb(176, 141, 87)`
        } else if (i.life < 30) {
          let diff = (i.life - 20) / 10;
          ctx.fillStyle = `rgb(${176 - diff * 6}, ${141 + diff * 31}, ${87 + diff * 94})`
        } else if (i.life < 50) {
          ctx.fillStyle = `rgb(168, 172, 181)`
        } else if (i.life < 60) {
          let diff = (i.life - 50) / 10;
          ctx.fillStyle = `rgb(${168 + diff * (230-168)}, ${172 + diff*(195-172)}, ${181 + diff*(-181)}`;
        } else {
          ctx.fillStyle = `rgb(230, 195, 0)`
        }
        i.update();
        let alpha = i.life / 20;
        if (alpha > 1) {
          alpha = 1;
        }
        if (alpha < 0) {
          alpha = 0;
        }
        alpha *= 0.4;
        ctx.globalAlpha = alpha;
        ctx.translate(i.x + playerOffset.x, i.y + playerOffset.y)
        ctx.beginPath();
        ctx.arc(0, 0, i.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, 0, i.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowColor = "hsl(" + (Math.random() * 300) + ", 30%, 30%)";
        ctx.shadowBlur = i.radius * 5;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.translate(-i.x - playerOffset.x, -i.y - playerOffset.y);
      }
      player.hatParts = player.hatParts.filter((e) => e.life > 0)
      ctx.globalAlpha = 1;
    }
  }

  if (player.hat.includes("Sparkle Trail")) {
    if (player.queCooldown == undefined) {
      player.queCooldown = 0;
      player.hatParts = [];
    } else {
      player.queCooldown -= 2;
      if (player.queCooldown < 0 && particlesOption != 0) {
        player.queCooldown = particlesOption == 1 ? 8 : 2;
        player.hatParts.push(new SparkleParticle(player.renderX + Math.random() * 9 - 4.5, player.renderY + Math.random() * 9 - 4.5));
        if (particlesOption == 3)
          player.hatParts.push(new SparkleParticle(player.renderX + Math.random() * 9 - 4.5, player.renderY + Math.random() * 9 - 4.5));
      }

      let arrayLength = player.hatParts.length;
      for (let j = 0; j < arrayLength; j++) {
        let i = player.hatParts[j];
        if (i.life < 20) {
          ctx.fillStyle = `rgb(176, 141, 87)`
        } else if (i.life < 30) {
          let diff = (i.life - 20) / 10;
          ctx.fillStyle = `rgb(${176 - diff * 6}, ${141 + diff * 31}, ${87 + diff * 94})`
        } else if (i.life < 50) {
          ctx.fillStyle = `rgb(168, 172, 181)`
        } else if (i.life < 60) {
          let diff = (i.life - 50) / 10;
          ctx.fillStyle = `rgb(${168 + diff * (230-168)}, ${172 + diff*(195-172)}, ${181 + diff*(-181)}`;
        } else {
          ctx.fillStyle = `rgb(230, 195, 0)`
        }
        i.update();
        let alpha = i.life / 20;
        if (alpha > 1) {
          alpha = 1;
        }
        if (alpha < 0) {
          alpha = 0;
        }
        alpha *= 0.8;
        ctx.globalAlpha = alpha;
        ctx.translate(i.x + playerOffset.x, i.y + playerOffset.y)
        ctx.beginPath();
        ctx.arc(0, 0, i.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, 0, i.radius, 0, Math.PI * 2);
        //ctx.shadowColor = Math.random() < 0.33 ? "black" : Math.random() < 0.5 ? "red" : "white";
        ctx.shadowColor = "hsl(" + (Math.random() * 300) + ", 50%, 50%)";
        ctx.shadowBlur = i.radius * 3;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.translate(-i.x - playerOffset.x, -i.y - playerOffset.y);
      }
      player.hatParts = player.hatParts.filter((e) => e.life > 0)
      ctx.globalAlpha = 1;
    }
  }

  if (player.hero == "heusephades") {
    ctx.beginPath();
    ctx.globalAlpha = 0.2;
    ctx.arc(pos.renderX, pos.renderY, player.radius + 60 + (2.66667 * player.clay), 0, Math.PI * 2)
    ctx.fillStyle = heusephadesAbilities[player.heuseAbil1];
    ctx.fill();
    ctx.strokeStyle = "rgb(0, 0, 0)";
    ctx.closePath();
  }

  ctx.font = "20px 'Exo 2'";
  ctx.fillStyle = "rgba(150,150,150)";
  ctx.globalAlpha = 1;
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;


	if (player.hero == "euclid") {
    if (player.usingX) {
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = "#5e4d66"
      ctx.beginPath();
      ctx.arc(pos.renderX, pos.renderY, 200, 0, 6.28318531);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
	
  if (player.hero == "dendo") {
    if (player.usingX) {
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = "#4f7"
      ctx.beginPath();
      ctx.arc(pos.renderX, pos.renderY, 250, 0, 6.28318531);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  if (player.stealth) {
    ctx.beginPath();
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = "#2a4";
    ctx.arc(pos.renderX, pos.renderY, player.radius + 10, 0, 6.28318531);
    ctx.fill();
    ctx.closePath();
    ctx.globalAlpha = 1;
  }

  if (player.hero == "parvulus") {
    if (player.usingZ) {
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = "#957da1"
      ctx.beginPath();
      ctx.arc(pos.renderX, pos.renderY, 250, 0, 6.28318531);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
  if (player.hero == "floe") {
    if (player.usingZ) {
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = "#6cb0f5"
      ctx.beginPath();
      ctx.arc(pos.renderX, pos.renderY, 35, 0, 6.28318531);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
  if (player.hero == "kamino") {
    if (player.usingZ) {
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = player.color;
      ctx.fillRect(pos.renderX - 5, pos.renderY, 10, (tileSize * MAP_SIZE[1] / 2 - player.y) * 2)
    }
  }
  if (player.hero == "anuket") {
    if (player.usingZ) {
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = "#373980"
      ctx.beginPath();
      ctx.arc(pos.renderX, pos.renderY, player.drownRadius, 0, 6.28318531);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
  if (player.hero == "paladin") {
    if (player.usingZ && player.radius < 25.5) {
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = "#ff0000"
      ctx.beginPath();
      ctx.arc(pos.renderX, pos.renderY, player.radius + 10, 0, 6.28318531);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    if (player.usingZ && player.radius >= 25.5) {
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = "#00ff00"
      ctx.beginPath();
      ctx.arc(pos.renderX, pos.renderY, player.radius + 10, 0, 6.28318531);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

  }

  if (player.hero == "magno") {
    if (player.usingZ) {
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = "rgb(93, 0, 255)";
      ctx.beginPath();
      ctx.arc(pos.renderX, pos.renderY, 140, 0, 6.28318531);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
  if (player.hero == "thoth") {
    if (player.usingZ) {
      ctx.beginPath();
      ctx.globalAlpha = 0.1;
      if (player.tier == 0) {
        ctx.fillStyle = "#b0e8ac"
      } else if (player.tier == 1) {
        ctx.fillStyle = "#6ebd68";
      } else if (player.tier == 2) {
        ctx.fillStyle = "#89d1d6";
      } else if (player.tier == 3) {
        ctx.fillStyle = "#d689d5";
      }
      ctx.arc(pos.renderX, pos.renderY, 200, 0, 6.28318531);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }
  if (player.hero == "neuid") {
    if (player.usingZ) {
      ctx.beginPath();
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = "#10829c"
      ctx.arc(pos.renderX, pos.renderY, 250, 0, 6.28318531);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  if (player.hero == "parvulus" && player.retaliation) {
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = "#632670"
    ctx.beginPath();
    ctx.arc(player.renderX + playerOffset.x, player.renderY + playerOffset.y, 100, 0, 6.28318531);
    ctx.fill();
    ctx.globalAlpha = 0.4;
  }

  ctx.beginPath();
  ctx.arc(pos.renderX, pos.renderY, player.radius + (2.66667 * player.clay), 0, 6.28318531);

  if (player.dead == false) {
    ctx.fillStyle = player.color;
    if (player.newtonian == false) {
      ctx.globalAlpha = 0.4;
    }

    ctx.fill();
    ctx.globalAlpha = 1;
  } else { //if dead V
    ctx.globalAlpha = 0.7;
    if (player.leaveDuelTimer > 0) {
      ctx.globalAlpha = 1 - (1 - (player.leaveDuelTimer / 3000));
      ctx.fillStyle = player.baseColor;
    }
    ctx.fill();

    ctx.fillStyle = "black";
    ctx.globalAlpha = 1;
    ctx.font = "20px Tahoma, Verdana, Segoe";
    ctx.textBaseline = "middle";
    if (player.world != "Duel") {
      ctx.fillText(player.dTimer, pos.renderX, pos.renderY + 2);
      ctx.textBaseline = "bottom";
    }
  }
  ctx.closePath();
  ctx.beginPath();
  if (player.band) {
    ctx.beginPath();
    ctx.globalAlpha = 0.2;
    ctx.arc(pos.renderX, pos.renderY, player.radius + 5, 0, 6.28318531);
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.globalAlpha = 1;
    ctx.arc(pos.renderX, pos.renderY, player.radius + 2, 0, 6.28318531);
    ctx.strokeStyle = `rgb(220,220,220${(player.dead ? ",0.5" : "")})`;
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.lineWidth = 2;
    ctx.closePath();
  }
  if (player.clay > 0) {
    ctx.arc(pos.renderX, pos.renderY, player.radius + 2 + (2.66667 * player.clay), 0, 6.28318531);
    ctx.strokeStyle = "#453926" + (player.dead ? "77" : "");
    ctx.lineWidth = 6;
    ctx.stroke();

    ctx.fillStyle = "black";
    ctx.lineWidth = 2;
  }
  ctx.closePath();
  ctx.beginPath();
  ctx.globalAlpha = 1;
  ctx.font = "15px 'Tahoma'";
  ctx.textBaseline = "bottom";
  if (player.dead == false) {
    ctx.fillStyle = "rgb(0, 0, 0)";
  } else {
    ctx.fillStyle = "rgb(255,0,0)";
  }
  let sizedOffset = (player.radius - 17.14 + (2.66667 * player.clay));
  ctx.globalAlpha = 0.7;
  ctx.fillText(player.name, pos.renderX, pos.renderY - 34 - sizedOffset);
  ctx.globalAlpha = 1;
  ctx.strokeStyle = "darkblue";
  ctx.strokeRect(pos.renderX - 22.5, pos.renderY - 30 - sizedOffset, 45, 10);
  ctx.fillStyle = "blue";
  if (player.steam) {
    ctx.fillStyle = "red";
  }
  ctx.fillRect(pos.renderX - 22.5, pos.renderY - 30 - sizedOffset, Math.min(Math.max(45 * player.energy / player.maxEnergy, 0), 45), 10);
  if(player.energy / player.maxEnergy > 1.05){
    let otld = ctx.textAlign;
    ctx.textAlign = "left";
    ctx.fillText((player.energy / player.maxEnergy).toFixed(2), pos.renderX + 27.5, pos.renderY - 16 - sizedOffset);
    ctx.textAlign = otld;
  }


  if (player.boostTimer > 0) {
    ctx.globalAlpha = 0.5
    ctx.beginPath();
    ctx.arc(pos.renderX, pos.renderY, player.radius + (2.66667 * player.clay), 0, 6.28318531);
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  ctx.closePath();
  if (player.frozen > 0) {
    ctx.globalAlpha = Math.min(player.frozen / 700 * player.frozen / 700, 1);
    ctx.beginPath();
    ctx.fillStyle = "#9500ff";
    ctx.arc(pos.renderX, pos.renderY, player.radius + (2.66667 * player.clay), 0, 6.28318531);
    ctx.fill();
    ctx.closePath();
    ctx.globalAlpha = 1;
  }
  if (player.staticFreeze > 0) {
    ctx.globalAlpha = Math.min(player.staticFreeze / 900, 1);
    ctx.beginPath();
    ctx.fillStyle = "#38fff5";
    ctx.arc(pos.renderX, pos.renderY, player.radius + (2.66667 * player.clay), 0, 6.28318531);
    ctx.fill();
    ctx.closePath();
    ctx.globalAlpha = 1;
  }

  if (player.iceProtected > 0) {
    ctx.globalAlpha = Math.min(player.iceProtected / 700 * player.iceProtected / 700, 1);
    ctx.beginPath();
    ctx.fillStyle = "#5df5dc";
    ctx.arc(pos.renderX, pos.renderY, (player.radius + (2.66667 * player.clay)) / 2, 0, 6.28318531);
    ctx.fill();
    ctx.closePath();
    ctx.globalAlpha = 1;
  }

  if (player.dead) ctx.globalAlpha = 0.3;
  for (let hat of player.hat)
    if (hatImg[hat] != undefined) {
      const realPlayerRadius = (player.radius + (2.66667 * player.clay));

      let hatRotation = 0;
      if (hat == "Turr Winner" || hat == "Hypnotic Hat") {
        const rotSpeed = 180; // deg per second
        hatRotation = Date.now() / 500 % (rotSpeed * Math.PI / 180) * 2;
      }
      if (hat == "Deity Aura" || hat == "Climate Aura") {
        hatRotation = (Math.cos(Date.now() / 2000) * Math.PI / 2)
      }
      if (hat == "Crazy Aura") {
        hatRotation = (Math.sin(Date.now() / 200) * Math.PI * 2)
      }

      if (hat == "Yin Yang") {
        const rotSpeed = -180;
        hatRotation = -(Date.now() / 500 % (rotSpeed * Math.PI / 180) * 2);
      }
      if (hat == "Overlord Blur") {
        const rotSpeed = (player.area ** 0.5) / 1000 + 1 / 300;
        hatRotation = (Date.now() / (1 / rotSpeed)) % (Math.PI * 2);
      }
      if (hat == "Inception Blur") {
        const rotSpeed = ((player.area ** 0.5) / 1000 + 1 / 300) / 4;
        hatRotation = (Date.now() / (1 / rotSpeed)) % (Math.PI * 2);
      }
      if (hat == "Sakura Blur") {
        const rotSpeed = 0.0005
        hatRotation = (Date.now() / (1 / rotSpeed)) % (Math.PI * 2);
      }
      if (hat == "Warp Hat") {
        const hatX = pos.renderX
        const hatY = pos.renderY
        ctx.fillStyle = "#38c7e0";
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1;
        ctx.translate(hatX, hatY);
        let nowTime = window.performance.now();
        let middleY = (nowTime / 2000) % 1;
        ctx.beginPath();
        ctx.arc(player.radius / 3, player.radius * 6 / 7 - middleY * player.radius * 12 / 7, Math.min((0.5 - (Math.abs((0.5 - middleY)))) * player.radius * 2, player.radius / 4), 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(-player.radius / 3, -player.radius * 6 / 7 + middleY * player.radius * 12 / 7, Math.min((0.5 - (Math.abs((0.5 - middleY)))) * player.radius * 2, player.radius / 4), 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.translate(-hatX, -hatY)
      }
      if (!["Warp Hat"].includes(hat)) {

        const hatX = pos.renderX - realPlayerRadius * hatImg[hat].multiX + hatImg[hat].dX * realPlayerRadius / 17.14;
        const hatY = pos.renderY - realPlayerRadius * hatImg[hat].multiY + hatImg[hat].dY * realPlayerRadius / 17.14;

        const hatWidth = realPlayerRadius * 2 * hatImg[hat].multiX;
        const hatHeight = realPlayerRadius * 2 * hatImg[hat].multiY;

        ctx.translate(hatX + hatWidth / 2, hatY + hatHeight / 2);

        if (hatRotation != 0) ctx.rotate(hatRotation);

        ctx.drawImage(hatImg[hat].img, -hatWidth / 2, -hatWidth / 2, realPlayerRadius * 2 * hatImg[hat].multiX, realPlayerRadius * 2 * hatImg[hat].multiY);

        if (hatRotation != 0) ctx.rotate(-hatRotation);

        ctx.translate(-hatX - hatWidth / 2, -hatY - hatHeight / 2);
      }
      //break;
    }

  if (player.hat.includes("Negative Hat")) {
    if (player.negCooldown == undefined) {
      player.negCooldown = 0;
      player.hatParts = [];
    } else {
      player.negCooldown--;
      if (player.negCooldown < 0 && particlesOption != 0) {
        player.negCooldown = particlesOption == 3 ? 5 : 12;
        player.hatParts.push(new NegativeParticle(player.renderX, player.renderY));
        if (particlesOption >= 2) {
          player.hatParts.push(new NegativeParticle(player.renderX, player.renderY));
          player.hatParts.push(new NegativeParticle(player.renderX, player.renderY));
          player.hatParts.push(new NegativeParticle(player.renderX, player.renderY));
          if (particlesOption >= 3) {
            player.hatParts.push(new NegativeParticle(player.renderX, player.renderY));
            player.hatParts.push(new NegativeParticle(player.renderX, player.renderY));
          }
        }
      }
      let arrayLength = player.hatParts.length;
      for (let j = 0; j < arrayLength; j++) {
        let i = player.hatParts[j];
        i.update();
        let alpha = i.life / 20;
        if (alpha > 1) {
          alpha = 1;
        }
        if (alpha < 0) {
          alpha = 0;
        }
        alpha *= 0.6;
        ctx.globalAlpha = alpha;
        ctx.translate(i.x + playerOffset.x, i.y + playerOffset.y)
        ctx.rotate(i.rotAngle);
        ctx.fillStyle = i.color;
        ctx.fillRect(-5, -2, 10, 4);
        ctx.rotate(-i.rotAngle);
        ctx.translate(-i.x - playerOffset.x, -i.y - playerOffset.y);
      }
      player.hatParts = player.hatParts.filter((e) => e.life > 0)
      ctx.globalAlpha = 1;
    }
  }
  if (player.hat.includes("Universal Master")) {
    ctx.translate(player.renderX + playerOffset.x, player.renderY + playerOffset.y)
    ctx.globalAlpha = 0.3;
    let rotate = Date.now() / 1200 % (Math.PI * 2)
    ctx.rotate(rotate);
    ctx.strokeStyle = `hsl(${Date.now()/120}, 50%, 50%)`;
    ctx.lineWidth = 4;
    for (let i = 4; i--; i > 0) {
      ctx.beginPath();
      ctx.arc(0, 0, player.radius + 15, 0, Math.PI / 4);
      ctx.stroke();
      ctx.rotate(Math.PI / 2);
    }
    ctx.rotate(-rotate);
    rotate = -Date.now() / 1600 % (Math.PI * 2)
    ctx.rotate(rotate);
    ctx.strokeStyle = `hsl(${Date.now()/120 + 40}, 50%, 50%)`;
    ctx.lineWidth = 8;
    for (let i = 6; i--; i > 0) {
      ctx.beginPath();
      ctx.arc(0, 0, player.radius + 31, 0, Math.PI / 6);
      ctx.stroke();
      ctx.rotate(Math.PI / 3);
    }
    ctx.rotate(-rotate);
    rotate = Date.now() / 2000 % (Math.PI * 2)
    ctx.rotate(rotate);
    ctx.strokeStyle = `hsl(${Date.now()/120 + 80}, 50%, 50%)`;
    ctx.lineWidth = 12;
    for (let i = 3; i--; i > 0) {
      ctx.beginPath();
      ctx.arc(0, 0, player.radius + 45, Math.cos(Date.now() / 500) / 4, Math.PI / 3);
      ctx.stroke();
      ctx.rotate(Math.PI / 1.5);
    }
    ctx.rotate(-rotate);
    rotate = -Date.now() / 2400 % (Math.PI * 2)
    ctx.rotate(rotate);
    ctx.strokeStyle = `hsl(${Date.now()/120 + 120}, 50%, 50%)`;
    ctx.lineWidth = 7;
    for (let i = 8; i--; i > 0) {
      ctx.beginPath();
      ctx.arc(0, 0, player.radius + 60, 0, Math.PI / 12);
      ctx.stroke();
      ctx.rotate(Math.PI / 4);
    }
    ctx.rotate(-rotate);
    ctx.translate(-player.renderX - playerOffset.x, -player.renderY - playerOffset.y);
    ctx.globalAlpha = 1;
  }
  if (player.hat.includes("Water Enemy Aura")) {
    ctx.translate(player.renderX + playerOffset.x, player.renderY + playerOffset.y)
    ctx.globalAlpha = 0.09;
    ctx.fillStyle = `hsl(${220 + Math.cos(Date.now()/500)*35}, 50%, 50%)`;
    ctx.beginPath();
    ctx.arc(0, 0, player.radius + Math.cos(Date.now()/500)*(player.radius*2/5) + player.radius*2/5, 0, Math.PI*2);
    ctx.fill();
    ctx.strokeStyle = `black`;
    ctx.globalAlpha = 0.15;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, player.radius + Math.cos(Date.now()/500)*(player.radius*2/5) + player.radius*2/5, 0, Math.PI*2);
    ctx.stroke();
    
    ctx.translate(-player.renderX - playerOffset.x, -player.renderY - playerOffset.y);
    ctx.globalAlpha = 1;
  }
  
  if (player.hat.includes("Ultraviolet Radiation")) {
    ctx.translate(player.renderX + playerOffset.x, player.renderY + playerOffset.y)
    let cycle = (window.performance.now() / 400) % 1;

    for (let i = 5; i--; i > 0) {
      let alpha = 0.3;
      let size = i * 10 + cycle * 10;
      if (size > 40) {
        alpha -= (size - 40) * 0.3 / 10;
      }
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = "rgb(169, 3, 252)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, i * 10 + cycle * 10 + player.radius, 0, Math.PI * 2);
      ctx.stroke();

    }



    ctx.translate(-player.renderX - playerOffset.x, -player.renderY - playerOffset.y);
    ctx.globalAlpha = 1;
  }
  /*if (player.hat.includes("Not Even A Hat")) {
    ctx.fillStyle = `hsl(${Date.now() / 50}, 70%, 80%)`;
    ctx.font = `25px 'Arial'`
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText("?", pos.renderX, pos.renderY);
  }*/
  if (player.hero == "amogus") {
    ctx.drawImage(amogusImage, pos.renderX - (player.radius + (2.66667 * player.clay)), pos.renderY - (player.radius + (2.66667 * player.clay)), (player.radius + (2.66667 * player.clay)) * 2, (player.radius + (2.66667 * player.clay)) * 2);
  }
  if (player.hero == "actualneko") {
    ctx.drawImage(nekoImage, pos.renderX - (player.radius + (2.66667 * player.clay)), pos.renderY - (player.radius + (2.66667 * player.clay)), (player.radius + (2.66667 * player.clay)) * 2, (player.radius + (2.66667 * player.clay)) * 2);
  }
  if (player.hero == "seiun") {
    ctx.lineCap = "butt";
    if (player.id == selfId) {
      if (ability1cooldown > 1) {
        ctx.globalAlpha = (1 - ability1cooldown / 3);
        ctx.lineWidth = 5;
        ctx.strokeStyle = "#ff0000"
        ctx.beginPath();
        ctx.arc(pos.renderX, pos.renderY, player.radius - 3, 0, (ability1cooldown - 1) / 2 * Math.PI * 2);
        ctx.stroke();
        ctx.lineWidth = 1;
        ctx.globalAlpha = 1;
      }
      if (ability1cooldown < 1) {
        if (ability1cooldown > 0){
        ctx.globalAlpha = (ability1cooldown);
        ctx.lineWidth = 7;
        ctx.strokeStyle = "#00ff00"
        ctx.beginPath();
        ctx.arc(pos.renderX, pos.renderY, player.radius - 5, 0, ability1cooldown * Math.PI * 2);
        ctx.stroke();
        ctx.lineWidth = 1;
        ctx.globalAlpha = 1;
        }
      }

    }

  }

  ctx.globalAlpha = 1;
}

function renderGame() {
  if (state != "dc" && state != "lose" && state != "win") {
    requestAnimationFrame(() => {
      try {
        renderGame();
      } catch (err) {
        console.error(err)
      };
    });
  }

  document.querySelector("#bg").style.display = "none";
  selfId = realSelfId;

  spectatingOrder = [];
  let keys = Object.keys(players);
  for (let j = 0; j < keys.length; j++) {
    let i = players[keys[j]];
    if (i.id != null) spectatingOrder.push(i.id);
  }
  spectatingOrder = spectatingOrder.filter((e) => players[e] && players[selfId] && players[e].world == players[selfId].world && players[e].area == players[selfId].area);

  if (!isNaN(spectatingIndex) && players[spectatingIndex]) {
    if (players[spectatingIndex].world != players[realSelfId].world || players[spectatingIndex].area != players[realSelfId].area) {
      spectatingIndex = NaN;
    }
  }

  if (spectatingIndex != selfId && !isNaN(spectatingIndex)) {
    selfId = spectatingIndex;
  } else {
    if (isNaN(spectatingIndex)) {
      spectatingIndex = realSelfId;
    }
  }

  if (players[selfId] == undefined) {
    selfId = realSelfId;
  }

  let time = performance.now();
  let delta = time - lastTime;
  lastTime = time;
  framesPerSecond += (1000 / delta - framesPerSecond) / 3;
  anti_afk += delta / 1000;

  for (let i in players) {
    if (players[i].leaveDuelTimer > 0) {
      players[i].leaveDuelTimer -= delta;
    }
  }

  if (anti_afk > 600) { //10 minutes
    document.getElementById("settings").style.display = "none";
    ws.close();
    state = "dc";
  }

  delt = delta;
  ability1cooldown -= delta / 1000;
  ability2cooldown -= delta / 1000;
  let self = players[selfId];


  if (self.hero == "rameses") {
    if (self.x < 10 * 34.28 || self.x > (10 + MAP_SIZE[0]) * 34.28) {
      ability1cooldown -= delta / 1000;
    }
  }

  let playersPerWorld = {};
  for (let i in players) {
    const p = players[i];
    if (!playersPerWorld[p.world]) playersPerWorld[p.world] = []
    playersPerWorld[p.world].push(p)
  }
  for (let worldName in playersPerWorld) {
    playersPerWorld[worldName] = playersPerWorld[worldName].sort((e1, e2) => e2.area - e1.area);
  }

  ctx.globalAlpha = 1;

  ctx.beginPath();
  ctx.fillStyle = "#333333";
  if (currentPlayer && (currentPlayer.world == "Scorching Shaft Hard" || currentPlayer.world == "Monochrome Mission Hard" || currentPlayer.world == "Vacant Voltage" || currentPlayer.world == "Vacant Voltage Hard" || currentPlayer.world == "Terrifying Tomb Hard")) {
    ctx.fillStyle = "black";
  }
  
  if(currentPlayer){
    if(currentPlayer.hat.includes('atomic')){
      atomicCtx.globalAlpha = 0.1;
      atomicCtx.drawImage(canvas, 0, 0);
    }else{
      atomicCtx.clearRect(0, 0, canvasSize.x, canvasSize.y);
    }
  }

  if (currentPlayer && (currentPlayer.world == "Neko Nightmare" || currentPlayer.world == "Neko Nightmare Original") && nekosEnabled) {
    ctx.clearRect(0, 0, canvasSize.x, canvasSize.y);
  } else {
    ctx.fillRect(0, 0, canvasSize.x, canvasSize.y);
  }


  for (let i in players) {
    players[i].interp(delt);
    if (players[i].id == selfId) {
      currentPlayer = players[i];
      const player = players[i];

      playername = player.name;
      area = player.area;
      world = player.world;

      playerOffset.x = (player.renderX - center.x) * -1;
      playerOffset.y = (player.renderY - center.y) * -1;

      //Safe Zones
      const worldData = CONSTANTS.worlds[world] || CONSTANTS.worlds["_default"];
      let nfs = worldData.fillStyle ? typeof worldData.fillStyle == "string" ?
        worldData.fillStyle : worldData.fillStyle(area) : CONSTANTS.worlds["_default"].fillStyle;

      if (world == "Heroic Holiday") {
        let c = "#acb0c2";
        if (area > 10 && area <= 12) c = "#e8d7c5";
        if (area > 12 && area <= 15) c = "#e06e6e";
        if (area == 16) c = "#e08484";
        if (area == 17) c = "#db9a9a";
        if (area == 18) c = "#d6baba";
        if (area > 18 && area <= 20) c = "#ccbcbc";
        if (area == 21) c = "#de3737";
        ctx.shadowColor = c;
        ctx.shadowBlur = 20;
      }

      for (let key in tiles) {
        if (tiles[key].g == 0) {
          tiles[key].res && tiles[key].res.setTransform({
            a: 0.4285 * 2,
            d: 0.4285 * 2,
            e: playerOffset.x,
            f: playerOffset.y
          });
        }
      }

      if (toggleTiles && tiles["tile_safezone"].res) {
        ctx.fillStyle = tiles["tile_safezone"].res;
      } else {
        ctx.fillStyle = tiles["tile_safezone"].color || "#c3c3c3"
      }
      ctx.fillRect(playerOffset.x, playerOffset.y, tileSize * 10, tileSize * MAP_SIZE[1]);
      ctx.fillRect(tileSize * (MAP_SIZE[0] + 10) + playerOffset.x, playerOffset.y, tileSize * 10, tileSize * MAP_SIZE[1]);



      if (area == 1) {
        //Teleporting between worlds
        //Teleporting between areas
        if (player.world == "Corrupted Core") {
          if (toggleTiles && tiles["tile_cc_left"].res) {
            ctx.fillStyle = tiles["tile_cc_left"].res;
          } else {
            ctx.fillStyle = tiles["tile_cc_left"].color || "#55b0b3";
          }
          ctx.fillRect(playerOffset.x, playerOffset.y, tileSize * 2, tileSize * (MAP_SIZE[1] - 2));
        }
        if (toggleTiles && tiles["tile_change_world"].res) {
          ctx.fillStyle = tiles["tile_change_world"].res;
        } else {
          ctx.fillStyle = tiles["tile_change_world"].color || "#6ad0de";
        }
        ctx.fillRect(playerOffset.x, playerOffset.y, tileSize * 10, tileSize * 2);
        ctx.fillRect(playerOffset.x, tileSize * (MAP_SIZE[1] - 2) + playerOffset.y, tileSize * 10, tileSize * 2);

        if (toggleTiles && tiles["tile_next_area"].res) {
          ctx.fillStyle = tiles["tile_next_area"].res;
        } else {
          ctx.fillStyle = tiles["tile_next_area"].color || "#fff46c";
        }

        ctx.fillRect(tileSize * (MAP_SIZE[0] + 18) + playerOffset.x, playerOffset.y, tileSize * 2, tileSize * MAP_SIZE[1]);
      } else {
        if (toggleTiles && tiles["tile_next_area"].res) {
          ctx.fillStyle = tiles["tile_next_area"].res;
        } else {
          ctx.fillStyle = tiles["tile_next_area"].color || "#fff46c";
        }
        if (!(world == "Peaceful Plains" && area == 32)) {
          ctx.fillRect(playerOffset.x, playerOffset.y, tileSize * 2, tileSize * MAP_SIZE[1]);
        }
        ctx.fillRect(tileSize * (MAP_SIZE[0] + 18) + playerOffset.x, playerOffset.y, tileSize * 2, tileSize * MAP_SIZE[1]);
      }

      //Area
      if (toggleTiles && tiles["tile_main"].res) {
        ctx.fillStyle = tiles["tile_main"].res;
      } else {
        ctx.fillStyle = tiles["tile_main"].color || "rgb(255, 255, 255)";
      } {
        if (victoryArea && area != "1") {
          if (toggleTiles && tiles["tile_victory"].res) {
            ctx.fillStyle = tiles["tile_victory"].res;
          } else {
            ctx.fillStyle = tiles["tile_victory"].color ||  "#efe45c";
          }
          ctx.fillRect(playerOffset.x + tileSize * 2, playerOffset.y, tileSize * (MAP_SIZE[0] + 16), tileSize * MAP_SIZE[1]);
        } else {
          ctx.fillRect(playerOffset.x + tileSize * 10, playerOffset.y, tileSize * MAP_SIZE[0], tileSize * MAP_SIZE[1]);
        }
      }
      ctx.filter = "none"

      //ctx.globalAlpha = 0.4; // change if it doesnt look good

      ctx.globalAlpha = 1;
      for (let i in zones) {
        let zone = zones[i];

        if(zone.type in tiles){
          ctx.fillStyle = tiles[zone.type].res || tiles[zone.type].color;
          alpha = tiles[zone.type].alpha || 1;
        }else
        switch (zone.type) {
          case "normal": {
            ctx.fillStyle = "#fff46c";
            alpha = 0.5
            break;
          }
          case "wall": {
            ctx.fillStyle = "black";
            alpha = 1;
            break;
          }
          case "lava": {
            ctx.fillStyle = "red";
            alpha = 1;
            break;
          }
          case "fakelava": {
            let red = 300 + Math.cos(Date.now() / 1500) * 62;
            ctx.fillStyle = `rgb(${red}, 0, 0)`;
            alpha = 1;
            break;
          }
          case "speedm": {
            ctx.fillStyle = "red"
            alpha = 0.5
            break;
          }
          case "speeda": {
            ctx.fillStyle = "cyan";
            alpha = 0.5
            break;
          }
          case "invisible": {
            ctx.fillStyle = "cyan";
            alpha = 0
            break;
          }
          case "tp": {
            ctx.fillStyle = "rgba(85,176,179)";
            alpha = 1;
            break;
          }
          default: {
            ctx.fillStyle = zone.type
            alpha = 1
            break;
          }
        }
        ctx.strokeStyle = ctx.fillStyle;
        if (!zone.switched) {
          alpha *= 0.5;
        }
        ctx.globalAlpha = alpha;
        let d1 = playerOffset.x + zone.x - Math.floor(playerOffset.x + zone.x),
          d2 = playerOffset.y + zone.y - Math.floor(playerOffset.y + zone.y);
        if(!window.zoneInspect){
          ctx.fillRect(Math.floor(playerOffset.x + zone.x), Math.floor(playerOffset.y + zone.y), Math.ceil(zone.width) + d1, Math.ceil(zone.height) + d2);
        }else{
          ctx.strokeRect(Math.floor(playerOffset.x + zone.x), Math.floor(playerOffset.y + zone.y), Math.ceil(zone.width) + d1, Math.ceil(zone.height) + d2);
          ctx.globalAlpha = 0.1;  
          ctx.fillRect(Math.floor(playerOffset.x + zone.x), Math.floor(playerOffset.y + zone.y), Math.ceil(zone.width) + d1, Math.ceil(zone.height) + d2);
        }
        ctx.lineWidth = 1;
        //ctx.strokeRect(playerOffset.x + zone.x, playerOffset.y + zone.y, zone.width, zone.height);
      }
      ctx.globalAlpha = 1;

      ctx.fillStyle = nfs;
      if ((ctx.fillStyle.length == 4 || ctx.fillStyle.length == 7) && !["Terrifying Tomb", "Terrifying Tomb Hard"].includes(player.world)) {
        ctx.fillStyle = ctx.fillStyle + "66";
      }

      if (world != "enter the sus amogus" && world != "exit the sus amogus" && world != "i eat idiot" && world != "Amaster Atmosphere" && !(world == "Impossible Isle" && area == 4)) {
        if (player.world == "Terrifying Tomb" && player.area < 7) {
          ctx.shadowBlur = 50;
          ctx.shadowColor = "gold";
        }
        if (player.world == "Terrifying Tomb Hard" && player.area < 7) {
          ctx.shadowBlur = 55;
          ctx.shadowColor = "#00ffff";
        }

        if (player.world == "Scorching Shaft Hard") {
          ctx.shadowBlur = 40;
          ctx.shadowColor = "white";
        }
        if (player.world == "Vacant Voltage") {
          ctx.shadowBlur = 30;
          ctx.shadowColor = "#0febff";
        }
        if (player.world == "Vacant Voltage Hard") {
          ctx.shadowBlur = 40;
          ctx.shadowColor = "#0febff";
        }

        ctx.fillRect(playerOffset.x, playerOffset.y, tileSize * (MAP_SIZE[0] + 20), tileSize * MAP_SIZE[1]);
        ctx.shadowBlur = 0;
      } else if (world == "enter the sus amogus") {
        ctx.globalAlpha = 0.5;
        ctx.drawImage(rollImage, playerOffset.x, playerOffset.y, (tileSize * (MAP_SIZE[0] + 20)) / 2, tileSize * MAP_SIZE[1]);
        ctx.drawImage(rollImage, playerOffset.x + (tileSize * (MAP_SIZE[0] + 20)) / 2, playerOffset.y, (tileSize * (MAP_SIZE[0] + 20)) / 2, tileSize * MAP_SIZE[1]);

      } else if (world == "Impossible Isle" && area == 4) {
        ctx.globalAlpha = 0.5;
        ctx.drawImage(noImage, playerOffset.x, playerOffset.y, (tileSize * (MAP_SIZE[0] + 20)) / 2, tileSize * MAP_SIZE[1]);
        ctx.drawImage(noImage, playerOffset.x + (tileSize * (MAP_SIZE[0] + 20)) / 2, playerOffset.y, (tileSize * (MAP_SIZE[0] + 20)) / 2, tileSize * MAP_SIZE[1]);

      } else if (world == "exit the sus amogus") {
        ctx.globalAlpha = 0.25;
        ctx.drawImage(stickImage, playerOffset.x, playerOffset.y, (tileSize * (MAP_SIZE[0] + 20)) / 2, tileSize * MAP_SIZE[1]);
        ctx.drawImage(stickImage, playerOffset.x + (tileSize * (MAP_SIZE[0] + 20)) / 2, playerOffset.y, (tileSize * (MAP_SIZE[0] + 20)) / 2, tileSize * MAP_SIZE[1]);
      } else if (world == "i eat idiot") {
        ctx.globalAlpha = 0.25;
        ctx.drawImage(spanishImage, playerOffset.x, playerOffset.y, (tileSize * (MAP_SIZE[0] + 20)) / 2, tileSize * MAP_SIZE[1]);
        ctx.drawImage(spanishImage, playerOffset.x + (tileSize * (MAP_SIZE[0] + 20)) / 2, playerOffset.y, (tileSize * (MAP_SIZE[0] + 20)) / 2, tileSize * MAP_SIZE[1]);
      } else {
        ctx.globalAlpha = 0.4;
        ctx.drawImage(amasterImage, playerOffset.x, playerOffset.y, (tileSize * (MAP_SIZE[0] + 20)) / 2, tileSize * MAP_SIZE[1]);
        ctx.drawImage(amasterImage, playerOffset.x + (tileSize * (MAP_SIZE[0] + 20)) / 2, playerOffset.y, (tileSize * (MAP_SIZE[0] + 20)) / 2, tileSize * MAP_SIZE[1]);
      }
      ctx.globalAlpha = 1;

      if (players[i].world == "Permeating Perpetuity" && players[i].area == 7) {
        ctx.drawImage(tiles["tile_2"].res, 2127 + 11.43 * 2 + playerOffset.x, 1508.32 + 22.86 + playerOffset.y, tileSize / 3, tileSize / 3);
      }
      if ((players[i].world == "Glamorous Glacier" || players[i].world == "Glamorous Glacier Hard") && players[i].area == 10) {
        ctx.drawImage(tiles["tile_2"].res, 1371.2 + playerOffset.x, 994.12 + playerOffset.y, tileSize, tileSize);
      }
      if (players[i].world == "Corrupted Core" && players[i].area == 0) {
        ctx.drawImage(tiles["tile_2"].res, 565.62 + playerOffset.x, 222.82 + playerOffset.y, tileSize, tileSize);
      }

      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
      renderHero(player, true);

      minimap.render(ctx);
      minimap.drawPlayer(ctx, player);
    }
  }

  for (let i in players) {
    if (players[i].id != selfId) {
      const player = players[i];


      if (player.area == area && player.world == world) {
        renderHero(player);
        minimap.drawPlayer(ctx, player);
      }
      ctx.closePath();
      ctx.font = "18px 'Exo 2'";
    }
  }

  ctx.strokeStyle = "rgb(0, 0, 0)";
  for (let ii in enemysSorted) {
    if (enemysSorted[ii].killed == true) continue;

    let i = enemysSorted[ii].id;
    enemies[i].interp(delt);
    let e = "i";
    let b = "v";
    let t = "n";
    let v = e;
    let n = "s";
    let l = e;
    let z = "b";
    let y = "e";
    if (enemysSorted[ii].type == (e + t + b + v + n + l + z + "l" + y)) {
      let e = enemysSorted[ii];
      if (180 + e.radius + players[selfId].radius > d(e.x, e.y, players[selfId].x, players[selfId].y) && d(e.x, e.y, players[selfId].x, players[selfId].y) > players[selfId].radius + e.radius + 20) continue
    }
    if (!["neko", "amogus"].includes(enemies[i].type)) {
      ctx.globalAlpha = 1;
      if (enemies[i].dead) {
        ctx.globalAlpha = 0.2;
      }
      if (enemies[i].shattered <= 0 && !["present", "fakepresent"].includes(enemies[i].type)) {
        ctx.strokeStyle = "black";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(enemies[i].renderX + playerOffset.x, enemies[i].renderY + playerOffset.y, enemies[i].radius, 0, 6.28318531);

        if (["steam", "megaSteam", "halt"].includes(enemies[i].type)) ctx.globalAlpha /= 1.3;

        if (enemies[i].type != "wind" && enemies[i].type != "strongWind") {
          let ex = enemies[i].renderX + playerOffset.x - enemies[i].radius;
          let ey = enemies[i].renderY + playerOffset.y - enemies[i].radius;
          let width = enemies[i].radius * 2;
          let height = enemies[i].radius * 2;

          if (enemies[i].shape == "circle") {
            if(enemies[i].radius != 0) ctx.stroke();
          } else if (enemies[i].shape == "square") {
            ctx.strokeRect(ex, ey, width, height);
          } else if (enemies[i].shape == "uTriangle") {
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(ex, ey + height);
            ctx.lineTo(ex + width / 2, ey);
            ctx.lineTo(ex + width, ey + height);
            ctx.lineTo(ex, ey + height);
            ctx.stroke();
            ctx.closePath();
          } else if (enemies[i].shape == "dTriangle") {
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(ex, ey);
            ctx.lineTo(ex + width / 2, ey + height);
            ctx.lineTo(ex + width, ey);
            ctx.lineTo(ex, ey);
            ctx.stroke();
            ctx.closePath();
          } else if (enemies[i].shape == "uPentagon") {
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(ex + width / 2, ey);
            ctx.lineTo(ex, ey + height * 21 / 50);
            ctx.lineTo(ex + width / 4, ey + height);
            ctx.lineTo(ex + 3 * width / 4, ey + height);
            ctx.lineTo(ex + width, ey + height * 21 / 50);
            ctx.lineTo(ex + width / 2, ey);
            ctx.stroke();
            ctx.closePath();
          } else if (enemies[i].shape == "dPentagon") {
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(ex + width / 2, ey + height);
            ctx.lineTo(ex, ey + height - (height * 21 / 50));
            ctx.lineTo(ex + width / 4, ey);
            ctx.lineTo(ex + 3 * width / 4, ey);
            ctx.lineTo(ex + width, ey + height - (height * 21 / 50));
            ctx.lineTo(ex + width / 2, ey + height);
            ctx.stroke();
            ctx.closePath();
          }
        }
        ctx.closePath();
      }

      ctx.fillStyle = CONSTANTS.enemies[enemies[i].type] ?
        typeof CONSTANTS.enemies[enemies[i].type] == "string" ?
        CONSTANTS.enemies[enemies[i].type] : (CONSTANTS.enemies[enemies[i].type] && CONSTANTS.enemies[enemies[i].type].call()) : "hsl(" + Date.now() + ", 50%, 50%)";

      if (enemies[i].fluidized == true) {
        ctx.globalAlpha = 0.5;
      }
      if (enemies[i].type == "immunecorrosiveless") {
        ctx.globalAlpha = 0.2;
      }
      if (enemies[i].type == "slowdrainswitch") {
        if (enemies[i].switched) {
          ctx.fillStyle = CONSTANTS.enemies["slower"];
        } else {
          ctx.fillStyle = CONSTANTS.enemies["draining"];
        }
      }
      if (enemies[i].type == "stopmoveswitch") {
        if (enemies[i].switched) {
          ctx.fillStyle = CONSTANTS.enemies["stopkill"];
        } else {
          ctx.fillStyle = CONSTANTS.enemies["movekill"];
        }
      }

      if (enemies[i].shattered <= 0) {
        if(enemies[i].texture){
          ctx.drawImage(enemies[i].texture, playerOffset.x + enemies[i].renderX - enemies[i].radius, playerOffset.y + enemies[i].renderY - enemies[i].radius, enemies[i].radius * 2, enemies[i].radius * 2);
        }else
        if (enemies[i].type == "bouncy") {
          ctx.translate(playerOffset.x + enemies[i].renderX, playerOffset.y + enemies[i].renderY);
          ctx.rotate(enemies[i].rotate);
          ctx.drawImage(bouncyEnemyImg, -enemies[i].radius, -enemies[i].radius, enemies[i].radius * 2, enemies[i].radius * 2);
          ctx.rotate(-enemies[i].rotate);
          ctx.translate(-(playerOffset.x + enemies[i].renderX), -(playerOffset.y + enemies[i].renderY));
          enemies[i].rotate += enemies[i].rotateSpeed;
        } else if (enemies[i].type == "present" || enemies[i].type == "fakepresent") {
          ctx.drawImage(presentEnemyImg, playerOffset.x + enemies[i].renderX - enemies[i].radius, playerOffset.y + enemies[i].renderY - enemies[i].radius, enemies[i].radius * 2, enemies[i].radius * 2);
        } else {
          ctx.beginPath();
          let ex = enemies[i].renderX + playerOffset.x - enemies[i].radius;
          let ey = enemies[i].renderY + playerOffset.y - enemies[i].radius;
          let width = enemies[i].radius * 2;
          let height = enemies[i].radius * 2;
          if (enemies[i].shape == "circle") {
            ctx.arc(enemies[i].renderX + playerOffset.x, enemies[i].renderY + playerOffset.y, enemies[i].radius, 0, 6.28318531);
          } else if (enemies[i].shape == "square") {
            ctx.fillRect(ex, ey, width, height);
          } else if (enemies[i].shape == "uTriangle") {
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(ex, ey + height);
            ctx.lineTo(ex + width / 2, ey);
            ctx.lineTo(ex + width, ey + height);
            ctx.lineTo(ex, ey + height);
          } else if (enemies[i].shape == "dTriangle") {
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(ex, ey);
            ctx.lineTo(ex + width / 2, ey + height);
            ctx.lineTo(ex + width, ey);
            ctx.lineTo(ex, ey);
          } else if (enemies[i].shape == "uPentagon") {
            ctx.beginPath();
            ctx.moveTo(ex + width / 2, ey);
            ctx.lineTo(ex, ey + height * 21 / 50);
            ctx.lineTo(ex + width / 4, ey + height);
            ctx.lineTo(ex + 3 * width / 4, ey + height);
            ctx.lineTo(ex + width, ey + height * 21 / 50);
            ctx.lineTo(ex + width / 2, ey);
          } else if (enemies[i].shape == "dPentagon") {
            ctx.beginPath();
            ctx.moveTo(ex + width / 2, ey + height);
            ctx.lineTo(ex, ey + height - (height * 21 / 50));
            ctx.lineTo(ex + width / 4, ey);
            ctx.lineTo(ex + 3 * width / 4, ey);
            ctx.lineTo(ex + width, ey + height - (height * 21 / 50));
            ctx.lineTo(ex + width / 2, ey + height);
          }
          ctx.fill();
        }
      } else {
        let time = enemies[i].shattered;
        ctx.translate(enemies[i].renderX + playerOffset.x, enemies[i].renderY + playerOffset.y);
        ctx.rotate(Math.pow(time, 3) / (1600000 * 4000));
        for (let p = 4; p--; p > 0) {
          ctx.rotate(Math.PI / 2);
          ctx.beginPath()
          ctx.arc(time / 4000 * enemies[i].radius + enemies[i].radius / 4, 0, enemies[i].radius / 3, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.rotate(-Math.pow(time, 3) / (1600000 * 4000))
        ctx.translate(-(enemies[i].renderX + playerOffset.x), -(enemies[i].renderY + playerOffset.y));
      }
      if (enemies[i].aura > 0 && enemies[i].disabled == false) {
        ctx.globalAlpha = 0.18;
        if (enemies[i].type == "immunedisabler") {
          ctx.fillStyle = "#946a8b";
        }
        else if (enemies[i].type == "immunifier"){
          ctx.fillStyle = "rgb(255, 0, 144)";
          ctx.globalAlpha = 0.13 + Math.cos(Date.now()/100)*0.1;
        }
        if (enemies[i].type == "immunecorrosivenoshift" || enemies[i].type == "immunecorrosivenoshifthuge") {
          ctx.globalAlpha = 0.08;
        }
        ctx.arc(enemies[i].renderX + playerOffset.x, enemies[i].renderY + playerOffset.y, enemies[i].aura, 0, 6.28318531);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      if (enemies[i].energyAura == true) {
        ctx.fillStyle = "#09ebe3";
        ctx.globalAlpha = 0.28;
        ctx.arc(enemies[i].renderX + playerOffset.x, enemies[i].renderY + playerOffset.y, 100, 0, 6.28318531);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      ctx.closePath();
      ctx.globalAlpha = 1;
    } else {
      ctx.drawImage(
        enemies[i].type == "amogus" ? amogusImage : nekoImage, enemies[i].renderX + playerOffset.x - enemies[i].radius, enemies[i].renderY + playerOffset.y - enemies[i].radius, enemies[i].radius * 2, enemies[i].radius * 2)
    }

    if (enemies[i].disabled) {
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(enemies[i].renderX + playerOffset.x, enemies[i].renderY + playerOffset.y, enemies[i].radius, 0, 6.28318531);
      ctx.strokeStyle = "#5e2894";
      ctx.stroke();
      ctx.strokeStyle = "rgb(0, 0, 0)";
    }
    if (enemies[i].immunified) {
      ctx.lineWidth = enemies[i].radius * 2/6;
      ctx.beginPath();
      ctx.arc(enemies[i].renderX + playerOffset.x, enemies[i].renderY + playerOffset.y, enemies[i].radius * 5/6, 0, 6.28318531);
      ctx.strokeStyle = "rgb(0, 0, 0)";
      ctx.stroke();
    }
    
    if (enemies[i].decay > 0 && enemies[i].shattered <= 0) {
      ctx.globalAlpha = Math.min(0.2 * enemies[i].decay, 0.6);
      ctx.beginPath();
      ctx.arc(enemies[i].renderX + playerOffset.x, enemies[i].renderY + playerOffset.y, enemies[i].radius, 0, 6.28318531);
      ctx.fillStyle = "#00e5ff";
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    if (enemies[i].ignited == true && enemies[i].shattered <= 0) {
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(enemies[i].renderX + playerOffset.x, enemies[i].renderY + playerOffset.y, enemies[i].radius, 0, 6.28318531);
      ctx.fillStyle = "#d15c21";
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    if (enemies[i].virusSpread >= 0 && enemies[i].shattered <= 0) {
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(enemies[i].renderX + playerOffset.x, enemies[i].renderY + playerOffset.y, enemies[i].radius, 0, 6.28318531);
      ctx.fillStyle = "#40ff00";
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    if (enemies[i].virus >= 0 && enemies[i].shattered <= 0) {
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(enemies[i].renderX + playerOffset.x, enemies[i].renderY + playerOffset.y, enemies[i].radius, 0, 6.28318531);
      ctx.fillStyle = "#269101";
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    if (enemies[i].moltenTime >= 0 && enemies[i].moltenTime != undefined && enemies[i].shattered <= 0) {
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.lineWidth = 5;
      ctx.arc(enemies[i].renderX + playerOffset.x, enemies[i].renderY + playerOffset.y, enemies[i].radius + 5, 0, 6.28318531);
      ctx.strokeStyle = `hsl(0, ${enemies[i].moltenTime / 100}%, ${enemies[i].moltenTime / 100}%)`;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    if (enemies[i].lavablobed > 0) {
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(enemies[i].renderX + playerOffset.x, enemies[i].renderY + playerOffset.y, enemies[i].radius, 0, 6.28318531);
      ctx.fillStyle = "#aa0000";
      ctx.fill();
      ctx.globalAlpha = 1;
    }

  }

  for (let i in projectiles) {
    if (projectiles[i].killed == false) {
      projectiles[i].interp(delt);
      if (projectiles[i].type == "kindleBomb" || projectiles[i].type == "portalBomb" || projectiles[i].type == "fissionBomb") {
        let alpha = 1 / projectiles[i].radius * 100;
        if (alpha > 1) {
          alpha = 1;
        }
        ctx.globalAlpha = alpha;
      }
      if (projectiles[i].type == "web") {
        ctx.globalAlpha = 0.25;
      }

      if (projectiles[i].type == "portal") {
        ctx.beginPath();
        ctx.arc(projectiles[i].renderX + playerOffset.x, projectiles[i].renderY + playerOffset.y, projectiles[i].radius, 0, 6.28318531);
        ctx.fillStyle = "#5da18c";
        ctx.globalAlpha = 0.3;
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.globalAlpha = 0.3;
        ctx.arc(projectiles[i].renderX + playerOffset.x, projectiles[i].renderY + playerOffset.y, projectiles[i].radius / 1.5, 0, 6.28318531);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.globalAlpha = 0.3;
        ctx.arc(projectiles[i].renderX + playerOffset.x, projectiles[i].renderY + playerOffset.y, projectiles[i].radius / 3, 0, 6.28318531);
        ctx.fill();
        ctx.closePath();
      } else if (projectiles[i].type == "turr") {
        ctx.beginPath();
        ctx.fillStyle = "#333333";
        ctx.arc(projectiles[i].renderX + playerOffset.x, projectiles[i].renderY + playerOffset.y, projectiles[i].radius, 0, 6.28318531);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = "#bd8b0d";
        ctx.arc(projectiles[i].renderX + playerOffset.x, projectiles[i].renderY + playerOffset.y, projectiles[i].radius / 1.7, 0, 6.28318531);
        ctx.fill();
        ctx.translate(projectiles[i].renderX + playerOffset.x, projectiles[i].renderY + playerOffset.y);
        ctx.rotate(projectiles[i].angle);
        ctx.fillRect(0, -projectiles[i].radius / 2.4, projectiles[i].radius / 1.2, projectiles[i].radius / 1.25);
        if (projectiles[i].emergency == true) {
          ctx.fillStyle = "#bd8b0d"
          ctx.rotate(0.15);
          ctx.fillRect(0, -projectiles[i].radius / 2.4, projectiles[i].radius / 1.2, projectiles[i].radius / 1.25);
          ctx.rotate(-0.3);
          ctx.fillRect(0, -projectiles[i].radius / 2.4, projectiles[i].radius / 1.2, projectiles[i].radius / 1.25);
          ctx.rotate(0.15);
          ctx.fillRect(0, -projectiles[i].radius / 2.4, projectiles[i].radius * 1.2, projectiles[i].radius / 1.25);
          ctx.beginPath();
          ctx.fillStyle = "#a83232";
          ctx.arc(0, 0, projectiles[i].radius / 2.3, 0, 6.28318531);
          ctx.fill();
        }
        ctx.rotate(-projectiles[i].angle);
        ctx.translate(-(projectiles[i].renderX + playerOffset.x), -(projectiles[i].renderY + playerOffset.y));

      } else if (projectiles[i].type == "umbra1" || projectiles[i].type == "umbra2" || projectiles[i].type == "umbra3") {
        ctx.strokeStyle = CONSTANTS.projectiles[projectiles[i].type] ?
          typeof CONSTANTS.projectiles[projectiles[i].type] == "string" ?
          CONSTANTS.projectiles[projectiles[i].type] :
          CONSTANTS.projectiles[projectiles[i].type].call() :
          "hsl(" + Date.now() + ", 50%, 50%)";
        ctx.lineWidth = 1;
        if (projectiles[i].type != "umbra3") {
          for (let pp = 25; pp--; i > 0) {
            ctx.globalAlpha = pp / 100;
            ctx.beginPath();
            ctx.arc(projectiles[i].renderX + playerOffset.x, projectiles[i].renderY + playerOffset.y, Math.max(projectiles[i].radius + pp - 12.5, 0), 0, 6.28318531);
            ctx.stroke();
          }
        } else {
          for (let pp = 25; pp--; i > 0) {
            ctx.globalAlpha = pp / 100;
            ctx.beginPath();
            ctx.arc(projectiles[i].renderX + playerOffset.x, projectiles[i].renderY + playerOffset.y, Math.max(projectiles[i].radius + pp - 12.5, 0), projectiles[i].angle - 0.1, projectiles[i].angle + 0.1);
            ctx.stroke();
          }
        }


      } else {
        ctx.beginPath();
        ctx.arc(projectiles[i].renderX + playerOffset.x, projectiles[i].renderY + playerOffset.y, projectiles[i].radius, 0, 6.28318531);

        if (projectiles[i].type == "boost") {
          ctx.globalAlpha = 0.7;
        } else if (["air", "fire", "earth", "water"].includes(projectiles[i].type)) {
          ctx.globalAlpha = 0.6;
        } else if (projectiles[i].type == "intoxicate") {
          ctx.globalAlpha = 1 - (projectiles[i].radius / 200);
        } else if (projectiles[i].type == "panzerShield" || projectiles[i].type == "celestialBase") {
          ctx.globalAlpha = 0.2;
        } else if (projectiles[i].type == "panzerBall") {
          ctx.globalAlpha = 0.4;
        }

        if (projectiles[i].type == "escargo") {
          ctx.translate(playerOffset.x + projectiles[i].renderX, playerOffset.y + projectiles[i].renderY);
          ctx.rotate(projectiles[i].rotate);
          ctx.drawImage(escargoImg, -projectiles[i].radius, -projectiles[i].radius, projectiles[i].radius * 2, projectiles[i].radius * 2);
          ctx.rotate(-projectiles[i].rotate);
          ctx.translate(-(playerOffset.x + projectiles[i].renderX), -(playerOffset.y + projectiles[i].renderY));
          projectiles[i].rotate += projectiles[i].rotateSpeed;
        } else {
          ctx.fillStyle = CONSTANTS.projectiles[projectiles[i].type] ?
            typeof CONSTANTS.projectiles[projectiles[i].type] == "string" ?
            CONSTANTS.projectiles[projectiles[i].type] :
            CONSTANTS.projectiles[projectiles[i].type].call() :
            "hsl(" + Date.now() + ", 50%, 50%)";

          ctx.fill();
          if (["sniperBullet", "octoBullet", "orbitalSniperBullet", "boomerangSniperBullet", "homingSniperBullet"].includes(projectiles[i].type)) {
            ctx.lineWidth = 1;
            ctx.strokeStyle = "black";
            ctx.stroke();
          }
        }
        ctx.globalAlpha = 1;
        ctx.closePath();
        if (projectiles[i].type == "lavaOrb") {
          ctx.globalAlpha = 0.07;
          ctx.beginPath();
          ctx.arc(projectiles[i].renderX + playerOffset.x, projectiles[i].renderY + playerOffset.y, projectiles[i].aura + 35, 0, 6.28318531);
          ctx.fill();
          ctx.globalAlpha = 0.2;
          ctx.beginPath();
          ctx.arc(projectiles[i].renderX + playerOffset.x, projectiles[i].renderY + playerOffset.y, projectiles[i].aura, 0, 6.28318531);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
        if (projectiles[i].type == "boost") {
          ctx.globalAlpha = 0.2;
          ctx.beginPath();
          ctx.arc(projectiles[i].renderX + playerOffset.x, projectiles[i].renderY + playerOffset.y, 120, 0, 6.28318531);
          ctx.fill();
          ctx.globalAlpha = 1;
        }
      }
      ctx.globalAlpha = 1;

    } else {
      delete projectiles[projectiles[i].id]
    }
  }


  if (state == "lose") {
    endGame();
  } else if (state == "win") {
    atomicCtx.clearRect(0,0,canvasSize.x, canvasSize.y);
    if (Date.now() - startTime < timeTaken) {
      timeTaken = Date.now() - startTime;
      timeTaken /= slowdown;
    }
    let s = Math.floor(timeTaken / 1000);
    let m = Math.floor(s / 60);
    s = s % 60;

    let grd = ctx.createRadialGradient(0, 0, center.x * 2, 300, 360, 200);
    grd.addColorStop(0, "#333333");
    grd.addColorStop(1, "#121111");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvasSize.x, canvasSize.y);
    ctx.font = "50px 'Exo 2'";
    ctx.fillStyle = "white";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText("Victory!", canvasSize.x / 2, canvasSize.y / 2 - 100);
    ctx.font = "40px 'Exo 2'";
    ctx.fillText("Name: " + currentPlayer.name, canvasSize.x / 2, canvasSize.y / 2);
    ctx.fillText("World: " + world, canvasSize.x / 2, canvasSize.y / 2 + 50);
    ctx.fillText("Area: " + area, canvasSize.x / 2, canvasSize.y / 2 + 100);
    ctx.fillText("Time: " + m + "m " + s + "s", canvasSize.x / 2, canvasSize.y / 2 + 150);
    ctx.fillText("Hero: " + yourHero, canvasSize.x / 2, canvasSize.y / 2 + 200);
    ctx.fillText("Solo: " + !haveDied, canvasSize.x / 2, canvasSize.y / 2 + 250);
    ctx.fillStyle = "red";
    if (reason) ctx.fillText("Kick reason: " + reason, canvasSize.x / 2, canvasSize.y / 2 + 300);
    ctx.fillStyle = "white";

    chatInput.style.display = "none";
    chatArea.active.style.display = "none";
    chatUI.style.display = "none";
    modBtn.style.display = "none";
    leaderboardElement.lbEl.style.display = "none";
  } else if (state == "dc") {
    if (Date.now() - startTime < timeTaken) {
      timeTaken = Date.now() - startTime;
      timeTaken /= slowdown;
    }
    let s = Math.floor(timeTaken / 1000);
    let m = Math.floor(s / 60);
    s = s % 60;

    let grd = ctx.createRadialGradient(0, 0, center.x * 2, 300, 360, 200);
    grd.addColorStop(0, "#333333");
    grd.addColorStop(1, "#212121");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvasSize.x, canvasSize.y);
    ctx.font = "50px 'Exo 2'";
    ctx.fillStyle = "white";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText("Disconnected!", canvasSize.x / 2, canvasSize.y / 2 - 100);
    ctx.font = "40px 'Exo 2'";
    ctx.fillText("Name: " + currentPlayer.name, canvasSize.x / 2, canvasSize.y / 2);
    ctx.fillText("World: " + world, canvasSize.x / 2, canvasSize.y / 2 + 50);
    ctx.fillText("Area: " + area, canvasSize.x / 2, canvasSize.y / 2 + 100);
    ctx.fillText("Time: " + m + "m " + s + "s", canvasSize.x / 2, canvasSize.y / 2 + 150);
    ctx.fillText("Hero: " + yourHero, canvasSize.x / 2, canvasSize.y / 2 + 200);
    ctx.fillText("Solo: " + !haveDied, canvasSize.x / 2, canvasSize.y / 2 + 250);
    ctx.fillStyle = "red";
    ctx.fillText("Reason: AFK for 10 minutes", canvasSize.x / 2, canvasSize.y / 2 + 300);
    ctx.fillStyle = "white";

    chatInput.style.display = "none";
    chatArea.active.style.display = "none";
    chatUI.style.display = "none";
    leaderboardElement.lbEl.style.display = "none";

  }

  //Lighting
  if (state != "game") {
    lighting = {};
  }
  if (lighting.lighting < 1 || lighting.smoke > 0) {
    renderLighting(delta);
  }

  let player = players[selfId];
  if ((player.world == "Ultimate Universe" || player.world == "Ultimate Universe Hard") && player.area > 280 && player.area < 300) {
    overlayHue += (changeTo - overlayHue) / 6;
    ctx3.clearRect(0, 0, canvasSize.x, canvasSize.y);
    ctx3.globalAlpha = 0.15;
    ctx3.fillStyle = `hsl(${overlayHue}, 100%, 50%)`;
    ctx3.fillRect(0, 0, canvasSize.x, canvasSize.y);

    changeTime--;
    if (changeTime <= 0) {
      if (changeTo == 0) {
        changeTo = 240;
        changeTime = (player.area - 280) * 10;
      } else if (changeTo == 240) {
        changeTo = 0;
        changeTime = (300 - player.area) * 10;
      }

    }
  } else if ((player.world == "Ultimate Universe" || player.world == "Ultimate Universe Hard") && (player.area == 300 || player.area == 280)) {
    ctx3.clearRect(0, 0, canvasSize.x, canvasSize.y);
  }
  //console.log(playerOffset.x, playerOffset.y)
  //lihting
  /*ctx.globalCompositeOperation = "destination-in";//light mode
  ctx.beginPath();
  
  //will it work with 2 seperate?//can we like.. moveTo()
  ctx.moveTo(center.x, center.y)
	let angle = Math.atan2(mouseY - center.y, mouseX - center.x);
	
  ctx.arc(center.x, center.y, 100, 0, Math.PI*2);

  ctx.moveTo(center.x - Math.cos(angle) * players[selfId].radius, center.y - Math.sin(angle) * players[selfId].radius);
  //it doesnt update lmao
  ctx.arc(center.x - Math.cos(angle) * players[selfId].radius, center.y - Math.sin(angle) * players[selfId].radius, 600, angle-0.6, angle+0.6);
	ctx.fillStyle = "black";
  ctx.fill();
  ctx.closePath();

  ctx.globalCompositeOperation = "source-over";//normal mode
  */

  if (state == "game") {
    //Hero Card
    if (toggleHeroCard) {
      ctx.font = "15px 'Exo 2'";
      ctx.fillStyle = "black";
      ctx.fillText(kbps + " kbps", canvasSize.x - 100, canvasSize.y - 260);
      ctx.fillText(Math.round(framesPerSecond) + "fps", canvasSize.x - 100, canvasSize.y - 280)
      ctx.fillText(Math.round(ping) + "ms ping", canvasSize.x - 100, canvasSize.y - 300)
      renderHeroCard(players[selfId]);
    }

    //Map Title
    renderMapName(players[selfId]);

    //victory text
    if (victoryTexts[world]) {
      if (victoryTexts[world][area]) {
        renderVictoryText(world, area);
      }
    }

    //Minimap
    minimap.render(ctx);
    minimap.drawPlayer(ctx, players[selfId]);


    //PP Animation
    if (world == "Peaceful Plains" && area >= 30) {
      ppAnimation(delta);
    }
    if ((world == "Ultimate Universe" || world == "Ultimate Universe Hard")) {
      uuAnimation(delta);
    }
    //FF red 
    if (world == "Furious Fraud" && area >= 10) {
      ctx.globalAlpha = (area - 10) / 50;
      ctx.fillStyle = "red";
      ctx.fillRect(0, 0, 1600, 900);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    if (world == "Cataclysmic Catastrophe" && area >= 16) {
      ctx.globalAlpha = Math.cos(Date.now() / (1000 - (area - 16) * 100)) * 0.5 + 0.5;
      ctx.fillStyle = "red";
      ctx.fillRect(0, 0, 1600, 900);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

  }
}


let smokeCanvas = document.getElementById("smokeCanvas");
let ctx3 = smokeCanvas.getContext('2d');
smokeCanvas.width = canvasSize.x;
smokeCanvas.height = canvasSize.y;
let party = smokemachine(ctx3, [18, 16, 54])

let atomicCanvas = document.getElementById("atomicCanvas");
let atomicCtx = atomicCanvas.getContext('2d');
atomicCanvas.width = canvasSize.x;
atomicCanvas.height = canvasSize.y;
/*
party.start()
party.setPreDrawCallback(function(dt){
	party.addSmoke(Math.random() * innerWidth, Math.random() * innerHeight, 0.6)
})
*/

let lightCanvas = document.createElement("canvas");
let ctx2 = lightCanvas.getContext('2d');
lightCanvas.width = canvasSize.x;
lightCanvas.height = canvasSize.y;
ResizeCanvasOnly(smokeCanvas);
let playerGrad = ctx2.createRadialGradient(0, 0, 30, 0, 0, 45);
playerGrad.addColorStop(0, "rgba(0, 0, 0, 1)");
playerGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
let playerGrad2 = ctx2.createRadialGradient(0, 0, 50, 0, 0, 65);
playerGrad2.addColorStop(0, "rgba(0, 0, 0, 1)");
playerGrad2.addColorStop(1, "rgba(0, 0, 0, 0)");



function renderLighting(delta) {
  ctx2.clearRect(0, 0, canvasSize.x, canvasSize.y);
  ctx2.translate(playerOffset.x, playerOffset.y);
  let keyArray = Object.keys(players);

  if (currentPlayer)
    for (let i = 0; i < keyArray.length; i++) {
      let player = players[keyArray[i]];
      if (player.area != currentPlayer.area || player.world != currentPlayer.world) continue;

      ctx2.translate(player.renderX, player.renderY);
      ctx2.beginPath();
      ctx2.fillStyle = lighting.bigVision ? playerGrad2 : playerGrad;
      ctx2.arc(0, 0, lighting.bigVision ? 66 : 33 + player.radius, 0, Math.PI * 2, !1)
      ctx2.fill();
      ctx2.closePath()
      ctx2.translate(-player.renderX, -player.renderY);
    }
  ctx2.translate(-playerOffset.x, -playerOffset.y);
  ctx2.fillStyle = `rgba(${lighting.color[0]}, ${lighting.color[1]}, ${lighting.color[2]}, ${lighting.lighting})`;
  ctx2.fillRect(-50, -50, 1450, 900);
  ctx.globalCompositeOperation = "destination-in";
  ctx.drawImage(lightCanvas, 0, 0);
  ctx.globalCompositeOperation = "source-over";
  if (lighting.smoke <= 0.001) {
    ctx3.clearRect(0, 0, canvasSize.x, canvasSize.y);
  }
}
let ppTime = 0;
let ppReset = false;
let ppTime2 = 0;
let oldToggleLB = null;
let oldToggleChat = null;
let glitchSquares = [];
let lastAnimationToggled = false;
let sliceAmount = 0;
let lastArea = null;
class GlitchSquare {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.h = h;
    this.w = w;
    this.life = 300;
  }
}
let utime = Infinity;
let uReset = false;

let uuNames = {
  "2": "Industry",
  "21": "Factory",
  "41": "City",
  "61": "Swamp",
  "81": "Quarry",
  "101": "Plains",
  "121": "Mountain",
  "141": "the Snowy Summit",
  "161": "Glacier",
  "181": "the Sky",
  "201": "the Exosphere",
  "221": "Rain",
  "241": "the Shaft",
  "261": "Cavern",
  "281": "???",
  "301": "Hideout",
  "321": "Battlefield",
  "341": "Hell",
  "361": "The End"
}

let uArea = null;

function uuAnimation(delta) {
  let player = players[selfId];
  if (player.area != lastArea) {
    if (Object.keys(uuNames).includes(player.area.toString())) {
      utime = 0;
      uArea = player.area;
    }
  }
  if (utime < 2000) {
    utime += delta;
    if (utime < 500) {
      ctx.globalAlpha = utime / 1000;
      ctx.fillStyle = "black";
      ctx.fillRect(0, 360 - (utime * 150 / 500), 1600, (utime * 300 / 500));
    } else if (utime < 1500) {
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = "black";
      ctx.fillRect(0, 210, 1600, 300);
      ctx.fillStyle = "white";
      ctx.globalAlpha = Math.min((utime - 500) / 100, 1);
      ctx.textBaseline = "middle";
      ctx.font = "80px 'Source Sans Pro'";
      ctx.fillText("Welcome to " + uuNames[uArea], canvasSize.x / 2, 360);
      ctx.textBaseline = "bottom";
    } else if (utime < 2000) {
      let roundedtime = utime - 1500;
      ctx.globalAlpha = Math.max((300 - roundedtime) / 300, 0);
      ctx.textBaseline = "middle";
      ctx.fillStyle = "white";
      ctx.font = "80px 'Source Sans Pro'";
      ctx.fillText("Welcome to " + uuNames[uArea], canvasSize.x / 2, 360);
      ctx.textBaseline = "bottom";
      ctx.globalAlpha = (500 - roundedtime) / 1000;
      ctx.fillStyle = "black";
      ctx.fillRect(0, 210 + (roundedtime * 150 / 500), 1600, 300 - (roundedtime * 300 / 500));
    }

  }
  lastArea = player.area;
}

function ppAnimation(delta) {
  //Peaceful Plains Animation.
  let player = players[selfId];
  if (area == 30) {
    if (player.x >= 3210) {
      ppTime += delta;
      ctx.fillStyle = "black";
      ctx.globalAlpha = ppTime / 1000;
      ctx.fillRect(0, 0, 2000, 2000);
      oldToggleLB = toggleLB;
      oldToggleChat = toggleChat;
    }
  }
  if (area == 31) {
    document.getElementById("chatUI").style.display = "none";
    document.getElementById("chatUI").blur();
    leaderboardElement.toggle(false)
    if (ppReset == false) {
      ppReset = true;
      ppTime = 0;
    }
    ppTime += delta;
    if (ppTime > 5000) {
      ppTime = 5000;
    }
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 100000, 100000);

    ctx.beginPath();
    ctx.fillStyle = "#29162b";
    ctx.arc(canvasSize.x / 2, canvasSize.y / 2, 5000 - ppTime, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = Math.max((1000 - ppTime) / 1000, 0);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 100000, 100000);

    if (ppTime == 5000) {
      ppTime2 += delta;
      ctx.globalAlpha = ppTime2 / 4000;
      ctx.fillStyle = `rgb(${Math.random() * 40}, ${Math.random() * 30}, ${Math.random() * 20})`;
      ctx.fillRect(0, 0, 10000, 10000);

      ctx.fillStyle = "red";
      ctx.globalAlpha = Math.min(Math.max(ppTime2 / 2000, 0), 1);
      ctx.font = "100px 'Courier New'";
      ctx.fillText('it was all', canvasSize.x / 2, canvasSize.y / 2 - 100);
      ctx.globalAlpha = Math.min(Math.max((ppTime2 - 1500) / 1000, 0), 1);
      ctx.fillText("just a lie", canvasSize.x / 2, canvasSize.y / 2 + 100);

    }
  }
  if (area < 41) {
    if (area >= 32) {
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = `rgb(${(area - 32) * 12}, 0, 0)`;
      ctx.fillRect(0, 0, 10000, 10000);

      glitchSquares = glitchSquares.filter((e) => e.life > 0)
      let glitchLength = glitchSquares.length;
      for (let j = 0; j < glitchLength; j++) {
        let i = glitchSquares[j]
        ctx.globalAlpha = i.life / 1000;
        ctx.fillStyle = `rgb(${Math.random() * 140}, ${Math.random() * 130}, ${Math.random() * 120})`;
        ctx.fillRect(i.x, i.y, i.w, i.h);
        i.life -= delta;
      }
      ctx.globalAlpha = 1;
    }
    if (area == 32) {
      if (ppReset == true) {
        ppReset = false;
        ppTime2 = 0;
        toggleLB = oldToggleLB;
        toggleChat = oldToggleChat;
        if (toggleChat == true) {
          document.getElementById("chatUI").style.display = "block";
          chatArea.active.scrollTop = chatArea.active.scrollHeight;
        }
        if (toggleLB == true) {
          leaderboardElement.toggle(true);
        }
      }
      ppTime -= delta;
      if (ppTime < 0) {
        ppTime = 3000 + Math.random() * 3000;
        glitchSquares.push(new GlitchSquare(Math.random() * 1380 - 100, Math.random() * 820 - 100, 100, 100));
      }
    }
    if (area >= 33) {
      ppTime -= delta * 3;
      if (ppTime < 0) {
        ppTime = (3000 - (area - 33) * 305) + Math.random() * (3000 - (area - 33) * 305);
        glitchSquares.push(new GlitchSquare(Math.random() * 1380 - 100, Math.random() * 820 - 100, 100, 100));
      }
    }
    if (area == 40) {
      if (lastAnimationToggled == false) {
        if (player.x >= 4600) {
          document.getElementById("chatUI").style.display = "none";
          document.getElementById("chatUI").blur();
          leaderboardElement.toggle(false)
          //second animation
          ppTime2 += delta;
          ctx.globalAlpha = Math.min(ppTime2 / 1000, 1);
          ctx.fillStyle = "black";
          ctx.fillRect(0, 0, 1600, 900);
          ctx.fillStyle = "white";
          ctx.globalAlpha = 1;
          ctx.font = "60px 'Courier New'";
          sliceAmount += 0.005 * delta;
          ctx.fillText("Universe simulation terminated.".slice(0, Math.floor(sliceAmount)), canvasSize.x / 2, canvasSize.y / 2);
        }
      }
    }
  }
  if (area == 41) {
    if (ppReset == false) {
      if (toggleChat == true) {
        document.getElementById("chatUI").style.display = "block";
        chatArea.active.scrollTop = chatArea.active.scrollHeight;
      }
      if (toggleLB == true) {
        leaderboardElement.toggle(true);
      }
      ppReset = true;
      ppTime = 0;
    }
    ctx.fillStyle = "black";
    ppTime += delta;
    if (ppTime > 2000) {
      ppTime = 2000;
    }
    ctx.globalAlpha = 1 - ppTime * 0.15 / 2000;
    ctx.fillRect(0, 0, 10000, 10000);
    lastAnimationToggled = true;
  }
}


function cnc() {
  ctx.fillStyle = "#333333";
  ctx.fillRect(0, 0, canvasSize.x, canvasSize.y);
  ctx.font = "50px 'Exo 2'";
  ctx.fillStyle = "red";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillText("There are too many clients on with your IP.", canvasSize.x / 2, canvasSize.y / 2);

  ctx.fillStyle = "white";
  chatInput.style.display = "none";
  chatArea.active.style.display = "none";
  chatUI.style.display = "none";
  leaderboardElement.lbEl.style.display = "none";
  menu.style.display = "none";
  join.style.display = "none";
  document.getElementById("links").style.display = "none";
  game.style.display = "inherit";
}

function endGame() {
  atomicCtx.clearRect(0,0,canvasSize.x, canvasSize.y);
  if (Date.now() - startTime < timeTaken) {
    timeTaken = Date.now() - startTime;
    timeTaken /= slowdown;
  }
  let s = Math.floor(timeTaken / 1000);
  let m = Math.floor(s / 60);
  s = s % 60;
  const fWorld = world;
  const fArea = area;
  const fM = m;
  const fS = s;
  const fHero = yourHero;
  const fDied = !haveDied;

  ctx.fillStyle = "#333333";
  ctx.fillRect(0, 0, canvasSize.x, canvasSize.y);
  ctx.font = "50px 'Exo 2'";
  ctx.fillStyle = "white";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.fillText("You Died", canvasSize.x / 2, canvasSize.y / 2 - 100);
  ctx.font = "40px 'Exo 2'";
  ctx.fillText("Name: " + currentPlayer.name, canvasSize.x / 2, canvasSize.y / 2);
  ctx.fillText("World: " + fWorld, canvasSize.x / 2, canvasSize.y / 2 + 50);
  ctx.fillText("Area: " + fArea, canvasSize.x / 2, canvasSize.y / 2 + 100);
  ctx.fillText("Time: " + fM + "m" + fS + "s", canvasSize.x / 2, canvasSize.y / 2 + 150);
  ctx.fillText("Hero: " + fHero, canvasSize.x / 2, canvasSize.y / 2 + 200);
  ctx.fillText("Solo: " + fDied, canvasSize.x / 2, canvasSize.y / 2 + 250);
  ctx.fillStyle = "red";
  if (reason) ctx.fillText("Kick reason: " + reason, canvasSize.x / 2, canvasSize.y / 2 + 300);
  ctx.fillStyle = "white";
  chatInput.style.display = "none";
  chatArea.active.style.display = "none";
  chatUI.style.display = "none";
  leaderboardElement.lbEl.style.display = "none";
}
let loggedInAsGuest = false;
document.getElementById("guest").onclick = () => {
  serversDiv.style.display = "";
  menu.style.display = "none";
  join.style.display = "none";
  Cookies.set("lgkey", null, {
    expires: 365
  });
  ws.send(msgpack.encode({
    type: "guest"
  }))
}
document.getElementById("login").onclick = () => {
  captchaDiv.style.display = "";
  hcaptcha.execute({
      async: true
    })
    .then(({
      response,
      key
    }) => {
      ws.send(msgpack.encode({
        type: "login",
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
        key: response
      }))
      captchaDiv.style.display = "none";
    })
    .catch(err => {
      console.error(err);
      captchaDiv.style.display = "none"
    });
}
document.getElementById("register").onclick = () => {
  captchaDiv.style.display = "";
  hcaptcha.execute({
      async: true
    })
    .then(({
      response,
      key
    }) => {
      ws.send(msgpack.encode({
        type: "register",
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
        key: response
      }))
      captchaDiv.style.display = "none";
    })
    .catch(err => {
      console.error(err);
      captchaDiv.style.display = "none"
    });
}

let startTime = null;
let yourHero = null;

function init(hero) {
  menu.style.display = "none";
  join.style.display = "none";
  game.style.display = "";
  document.getElementById("links").style.display = "none";
  inGame = true;
  document.getElementById("closeSettings").onclick = () => {
    document.getElementById("settings").style.display = "none";
    inGame = true;
  }

  if (Cookies.get("lgkey") != undefined) {
    loginKey = Cookies.get("lgkey")
  }
  ws.send(msgpack.encode({
    begin: true,
    hero: hero,
    loginKey: loginKey
  }))
  mouseToggleC = 0;
  state = "game";
  document.body.classList.remove("body-menu-bg");
  startTime = Date.now();
  yourHero = hero;
}


function Resize() {
  let scale = window.innerWidth / canvasSize.x;
  if (window.innerHeight / canvasSize.y < window.innerWidth / canvasSize.x) {
    scale = window.innerHeight / canvasSize.y;
  }
  canvas.style.transform = atomicCanvas.style.transform = "scale(" + scale + ")";
  canvas.style.left = atomicCanvas.style.left = 1 / 2 * (window.innerWidth - canvasSize.x) + "px";
  canvas.style.top = atomicCanvas.style.top = 1 / 2 * (window.innerHeight - canvasSize.y) + "px";

  var rect = canvas.getBoundingClientRect();
  chatUI.style.left = (rect.left + 10) + "px";
  chatUI.style.top = (rect.top + 10) + "px";
  if (modElement.display) {
    modBtn.style.left = (rect.left + 10) + "px";
    modBtn.style.top = (rect.top + 10) + "px";
  }
  leaderboardElement.lbEl.style.right = rect.left == 0 ? "0.8vw" : rect.left + 10 + "px";
  leaderboardElement.lbEl.style.top = rect.top + 10 + "px";
  if (snowParticles) snowParticles.resize();
  if (smokeCanvas) {
    ResizeCanvasOnly(smokeCanvas);
  }
}
Resize();

window.addEventListener('resize', function() {
  Resize();
});

function ResizeCanvasOnly(canvas) {
  let scale = window.innerWidth / canvasSize.x;
  if (window.innerHeight / canvasSize.y < window.innerWidth / canvasSize.x) {
    scale = window.innerHeight / canvasSize.y;
  }
  canvas.style.transform = "scale(" + scale + ")";
  canvas.style.left = 1 / 2 * (window.innerWidth - canvasSize.x) + "px";
  canvas.style.top = 1 / 2 * (window.innerHeight - canvasSize.y) + "px";
}

let haveDied = false;

let KEY_TO_ACTION = {
  "shift": "5",
  "shiftleft": "5",
  "shiftright": "5",
  "arrowup": "1",
  "arrowleft": "2",
  "arrowdown": "3",
  "arrowright": "4",
}

const allowedKeys = ["bracketleft", "bracketright", "backslash", "quote", "semicolon", "slash", "period", "comma"];

function initCodes() {
  let customKeys = localStorage.getItem("custom-keycodes");
  if (customKeys) {
    KEY_TO_ACTION = {
      "shift": "5",
      "shiftleft": "5",
      "shiftright": "5",
      "arrowup": "1",
      "arrowleft": "2",
      "arrowdown": "3",
      "arrowright": "4"
    };
    customKeys = JSON.parse(customKeys);
    /*customKeys = Object.assign({
      "keyw": "1",
      "keya": "2",
      "keys": "3",
      "keyd": "4",
      "keyz": "8",
      "keyx": "9",
      "keyj": "8",
      "keyk": "9",
		  //"keyt": "6",
      //"keye": "7",
      //"keyr": "10",
      "keyb": "01",
      "keyh": "02",
      "keyp": "03",
      "keyv": "04",
    }, customKeys)*/
    Object.assign(KEY_TO_ACTION, customKeys);
  } else {
    KEY_TO_ACTION = {
      "shift": "5",
      "shiftleft": "5",
      "shiftright": "5",
      "arrowup": "1",
      "arrowleft": "2",
      "arrowdown": "3",
      "arrowright": "4",
      "keyw": "1",
      "keya": "2",
      "keys": "3",
      "keyd": "4",
      "keyz": "8",
      "keyx": "9",
      "keyj": "8",
      "keyk": "9",
      /*"keyt": "6",
      "keye": "7",
      "keyr": "10",*/
      "keyb": "01",
      "keyh": "02",
      "keyp": "03",
      "keyv": "04",
    }
  }

  let displayedKeys = [];
  document.querySelectorAll(".keyCodeEl").forEach((btn) => {
    for (let i in KEY_TO_ACTION) {
      if (KEY_TO_ACTION[i] == btn.ariaLabel && !["arrowup", "arrowleft", "arrowdown", "arrowright", "shift", "shiftleft", "shiftright", ...displayedKeys].includes(i)) {
        btn.innerHTML = i.startsWith("key") ? (i[0].toUpperCase() + i.substring(1, i.length - 1) + i[i.length - 1].toUpperCase()) : i;
        displayedKeys.push(i);
        break;
      }
    }
  })
}
initCodes();

function resetKeycodes() {
  localStorage.removeItem("custom-keycodes");
  initCodes();
}
let v = {
  left: false,
  right: false,
  up: false,
  down: false
}
let changeTime = 0,
  changeTo = 0,
  overlayHue = 0;
document.onkeydown = function(e) {
  anti_afk = 0;
  chatting = document.activeElement.hasAttribute("lock-chat");
  if (e.code == "Escape" && state == "game" && !chatting) {
    if (settingaccode) return;
    let el = document.getElementById("settings");
    if (el.style.display == "") {
      inGame = true;
      el.style.display = "none";
    } else {
      el.style.display = "";
      mouseToggleC = 0;
      ws.send(msgpack.encode("mn"));
      inGame = false;
    }
  } else
  if (e.code == "Enter" && !e.repeat && inGame) {
    if (!document.activeElement.hasAttribute("lock-chat") && Date.now() - chatElement.lastSent > 10) {
      document.getElementById("chatInput").focus();
    }
  }
  if (chatting == false && inGame) {
    if (KEY_TO_ACTION[e.code.toLowerCase()] == "04") {
      toggleChat = !toggleChat
      if (toggleChat) {
        document.getElementById("chatUI").style.display = "block";
        if (modElement.display) document.getElementById("modBtn").style.display = "";
        chatArea.active.scrollTop = chatArea.active.scrollHeight;
      } else {
        document.getElementById("chatUI").style.display = "none";
        document.getElementById("modBtn").style.display = "none";
        document.getElementById("chatUI").blur();
      }
    } else if (KEY_TO_ACTION[e.code.toLowerCase()] == "01") {
      leaderboardElement.toggle(toggleLB = !toggleLB);
    } else if (KEY_TO_ACTION[e.code.toLowerCase()] == "02") {
      toggleHeroCard = !toggleHeroCard;
    } else if (KEY_TO_ACTION[e.code.toLowerCase()] == "03") {
      localStorage.setItem("tiles-enabled", toggleTiles = !toggleTiles);
    }
    if (KEY_TO_ACTION[e.code.toLowerCase()] != undefined && !KEY_TO_ACTION[e.code.toLowerCase()].startsWith("0")) {
      let k = KEY_TO_ACTION[e.code.toLowerCase()];

      if (parseInt(k) <= 4) {
        switch (k) {
          case "1": {
            if (v.up == false) {
              ws.send(msgpack.encode({
                kD: k
              }));
            }
            v.up = true;
            break;
          }
          case "2": {
            if (v.left == false) {
              ws.send(msgpack.encode({
                kD: k
              }));
            }
            v.left = true;
            break;
          }
          case "3": {
            if (v.down == false) {
              ws.send(msgpack.encode({
                kD: k
              }));
            }
            v.down = true;
            break;
          }
          case "4": {
            if (v.right == false) {
              ws.send(msgpack.encode({
                kD: k
              }));
            }
            v.right = true;
            break;
          }
        }
      } else {
        ws.send(msgpack.encode({
          kD: k
        }));
      }
    }
    if (e.code == "Tab") {
      let index = spectatingOrder.indexOf(spectatingIndex);
      if (spectatingOrder[index + 1]) {
        spectatingIndex = spectatingOrder[index + 1];
      } else {
        spectatingIndex = spectatingOrder[0];
      }
      e.preventDefault();
    }
  }
}

document.onkeyup = function(e) {
  anti_afk = 0;
  chatting = document.activeElement.hasAttribute("lock-chat");
  if (inGame) {
    if (KEY_TO_ACTION[e.code.toLowerCase()] != undefined) {
      let k = KEY_TO_ACTION[e.code.toLowerCase()];

      if (parseInt(k) <= 4) {
        switch (k) {
          case "1": {
            if (v.up == true) {
              ws.send(msgpack.encode({
                kU: k
              }));
            }
            v.up = false;
            break;
          }
          case "2": {
            if (v.left == true) {
              ws.send(msgpack.encode({
                kU: k
              }));
            }
            v.left = false;
            break;
          }
          case "3": {
            if (v.down == true) {
              ws.send(msgpack.encode({
                kU: k
              }));
            }
            v.down = false;
            break;
          }
          case "4": {
            if (v.right == true) {
              ws.send(msgpack.encode({
                kU: k
              }));
            }
            v.right = false;
            break;
          }
        }
      } else {
        ws.send(msgpack.encode({
          kU: k
        }));
      }
    }
  }
}

let lastmp = [mouseX, mouseY];
let smpi = setInterval(() => {
  if (snowParticles) snowParticles.update();
  if (state == "game" && inGame && mouseEnabled && mouseToggleC == 2) {
    if (lastmp[0] != Math.round(mouseX * 10) / 10 || lastmp[1] != Math.round(mouseY * 10) / 10) {
      lastmp = [Math.round(mouseX * 10) / 10, Math.round(mouseY * 10) / 10];
      ws.send(msgpack.encode({
        mp: lastmp
      }));
    }
  }
}, 1000 / 30);

function getCursorPosition(canvas, event) {
  anti_afk = 0;
  var rect = canvas.getBoundingClientRect(),
    scaleX = canvasSize.x / rect.width,
    scaleY = canvasSize.y / rect.height;

  mouseX = (event.clientX - rect.left) / (rect.right - rect.left) * canvasSize.x;
  mouseY = (event.clientY - rect.top) / (rect.bottom - rect.top) * canvasSize.y;
}
window.addEventListener('mousedown', function(e) {
  anti_afk = 0;
  if (state == "game") {
    getCursorPosition(canvas, e);
    if (mouseEnabled && e.target.tagName.toLowerCase() == "canvas") {
      if (mouseToggleC == 0) {
        mouseToggleC = 1;
      } else if (mouseToggleC == 2) {
        mouseToggleC = 3;
      }
    }
  }
});
window.addEventListener('mousemove', function(e) {
  anti_afk = 0;
  getCursorPosition(canvas, e);
})

window.addEventListener('touchmove', function(e) {
  anti_afk = 0;
  if (mouseEnabled) {
    e.clientX = e.touches[0].clientX;
    e.clientY = e.touches[0].clientY;
    getCursorPosition(canvas, e.touches[0]);

  }
})

window.addEventListener('touchstart', function(e) {
  anti_afk = 0;
  if (state == "game" && inGame && e.target.tagName.toLowerCase() == "canvas") {
    mouseEnabled = true;
    mouseToggleC = 2;
    ws.send(msgpack.encode("my"));
    e.clientX = e.touches[0].clientX;
    e.clientY = e.touches[0].clientY;
    getCursorPosition(canvas, e);
  }
})

window.addEventListener('touchend', function(e) {
  anti_afk = 0;
  mouseEnabled = false;
  mouseToggleC = 0;
  ws.send(msgpack.encode("mn"));
})

window.addEventListener('mouseup', function(e) {
  anti_afk = 0;
  if (inGame && state == "game") {
    if (mouseEnabled) {
      if (mouseToggleC == 1) {
        mouseToggleC = 2;
      } else if (mouseToggleC == 3) {
        mouseToggleC = 0;
      }
      if (mouseToggleC == 2) {
        //mouse on (yes)
        ws.send(msgpack.encode("my"));
        getCursorPosition(canvas, e);
      } else {
        //mouse off (no)
        ws.send(msgpack.encode("mn"));
      }
    }
  }
});

function appendChatMessage(message) {
  let owner = message.owner;
  let txt = message.chat;
  let type = message.type;
  let targetChannel = message.tc || 'default';
  if(!(targetChannel in chatArea.chats)) return;
  const typeData = CONSTANTS.chat[type] || CONSTANTS.chat["_default"];

  if (!typeData.nonBlockable) {
    if (blockedPlayers[owner]) return;
  }

  let scroll =
    chatArea.chats[targetChannel].scrollTop + chatArea.chats[targetChannel].clientHeight >=
    chatArea.chats[targetChannel].scrollHeight - 5;

  let newSpan = document.createElement("span");
  newSpan.classList.add("inlineMsg");
  newSpan.innerText = owner;
  let newDiv = document.createElement("div");


  newDiv.classList.add(typeData.className);

  let newSpan2 = document.createElement("span");
  newSpan2.classList.add("inlineMsg");

  newDiv.prepend(": " + txt);
  newDiv.prepend(newSpan);
  newDiv.style.whiteSpace = "normal";

  if (chatSelfRegex && chatSelfRegex.test && chatSelfRegex.test(txt)) newDiv.classList.add("mentioned");

  if (typeData.tag) {
    let tagDiv = document.createElement("span");
    tagDiv.classList.add(typeData.tag.className);
    tagDiv.innerText = `${typeData.tag.text} `;
    newDiv.prepend(tagDiv);
  }

  chatArea.chats[targetChannel].appendChild(newDiv);

  if (scroll) {
    chatArea.chats[targetChannel].scrollTop = chatArea.chats[targetChannel].scrollHeight;
  }
}

console.trace('%cEvades2!', [
  'color: powerBlue',
  'text-shadow: 1px 2px purple',
  'background: plum',
  'font-size: 8em',
  'border: 1px solid purple',
  'padding: 20px',
  'font-family: Geneva',
].join(';'))


window.setInterval = () => {};
setInterval = () => {};

//Hello there, inspect elementer.
