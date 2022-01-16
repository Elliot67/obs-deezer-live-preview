const { client } = window.XMPP;

const tryJson = (json) => {
  try {
    return JSON.parse(json);
  } catch (e) {
    return false;
  }
};

class Deezer {
  static getSongInformations = async (songId) => {
    const response = await axios(`${window.env.CORS_PROXY}https://api.deezer.com/track/${songId}`, {
      headers: {},
    });
    return response.data;
  };

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
  const song = await Deezer.getSongInformations(songId);
  renderSongInformations(song);
};

const renderSongInformations = (data) => {
  console.log(data);
  const player = document.querySelector("#player");
  const elList = player.querySelectorAll("[data-api]");
  elList.forEach((el) => {
    const apiKey = el.dataset.api.split(".");
    let value = data;
    apiKey.forEach((key) => {
      value = value?.[key];
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
