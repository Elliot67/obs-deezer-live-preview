const { client } = window.XMPP;

const tryJson = (json) => {
  try {
    return JSON.parse(json);
  } catch (e) {
    return false;
  }
};

class Deezer {
  static getSongInformations(songId) {
    return new Promise((resolve, reject) => {
      let script = document.createElement("script");
      script.type = "text/javascript";
      const callbackName = "callback" + Math.random().toString(36).substr(2, 5);
      script.dataset.callbackId = callbackName;
      window[callbackName] = (response) => {
        script.remove();
        resolve(response);
        delete window[callbackName];
        console.log("postet");
      };
      script.src = `https://api.deezer.com/track/${songId}?output=jsonp&version=js-v1.0.0&callback=${callbackName}`;
      document.querySelector("body").append(script);
    });
  }

  constructor(username, token) {
    this.username = username;
    this.token = token;
  }

  initializeXMPP = () => {
    this.xmpp = client({
      service: "wss://messaging.deezer.com/websocket",
      username: this.username,
      password: this.token,
    });

    this.xmpp.on("stanza", this.onMessage);

    return this.xmpp;
  };

  treatMessage = async ({ ACTION, VALUE }) => {
    if (ACTION !== "PLAY") return;
    this.xmpp.emit("track", VALUE.SNG_ID);
  };

  onMessage = async (stanza) => {
    if (stanza.name !== "message") return;

    const event = stanza.children.find((message) => message.name === "event");
    const messages = event.children.map((event) => event.children.map((item) => item.children)).flat(2);

    const readableMessages = messages.map(tryJson).filter((msg) => msg);
    readableMessages.forEach(this.treatMessage);
  };
}

const onTrackChanged = async (songId) => {
  console.log("songId changed", songId);
  const data = await Deezer.getSongInformations(songId);
  renderSongInformations(data);
};

const renderSongInformations = (data) => {
  console.log(data);
  const player = document.querySelector("#player");
  const elList = player.querySelectorAll("[data-api]");
  elList.forEach((el) => {
    const apiKey = el.dataset.api.split(".");
    let value = data;
    apiKey.forEach((key) => {
      if (value) {
        value = value[key]; 
      }
    });

    const replaceAttr = el.dataset.attr;
    if (replaceAttr) {
      el.setAttribute(replaceAttr, value);
    } else {
      el.innerText = value;
    }
  });
};

/*****************/
// Init everything
/*****************/
const xmpp = new Deezer(window.env.DEEZER_USER_ID, window.env.DEEZER_TOKEN).initializeXMPP();

xmpp.on("online", (address) => console.log("Connected to", address._domain));
xmpp.on("offline", () => console.warn("offline"));
xmpp.on("error", (err) => console.error(err.message));
xmpp.on("track", onTrackChanged);

xmpp.start();
