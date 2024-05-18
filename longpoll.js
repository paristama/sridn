import fs from "fs";

function getLiveDB() {
  return JSON.parse(fs.readFileSync("./liveDB.json", "utf8"));
}
function saveLiveDB(data) {
  fs.writeFileSync("./liveDB.json", data);
}

async function getLiveStream() {
  try {
    const url = "https://www.showroom-live.com/api/live/onlives";
    let response = await fetch(url);
    response = await response.json();
    const idolStreamer = response.onlives.find(
      (streamer) => streamer.genre_name === "Game",
    );
    const memberStreamer = idolStreamer.lives.filter((streamer) =>
      streamer.room_url_key.includes("JKT48"),
    );
    // console.log(idolStreamer.lives);

    if (idolStreamer.lives) {
      const liveData = getLiveDB();
      const liveIds = liveData.data.map((e) => e.live_id);
      // console.log(liveIds);

      console.log(
        idolStreamer.lives
          .map((stream) => {
            if (liveIds.includes(stream.live_id)) return stream.live_id;
          })
          .filter((live_id) => live_id !== undefined),
      );

      idolStreamer.lives.forEach((stream) => {
        if (liveIds.includes(stream.live_id)) {
          console.log(
            `${stream.room_url_key} with liveid ${stream.live_id} already notified`,
          );
        } else {
          const newLiveStream = {
            name: stream.room_url_key,
            live_id: stream.live_id,
            started_at: stream.started_at,
          };
          console.log(`${newLiveStream.name} is going live!`);
          liveData.data.unshift(newLiveStream);
        }
      });

      saveLiveDB(JSON.stringify(liveData, null, 2));
    }

    // await new Promise((resolve) => setTimeout(resolve, 30000));
    // console.log("make new request");
    // getLiveStream();
  } catch (err) {
    console.log("Longpoll error : ", err);
    setTimeout(getLiveStream, 5000);
  }
}
getLiveStream();
