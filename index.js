async function getLiveStream() {
  const url = "https://www.showroom-live.com/api/live/onlives";
  let response = await fetch(url);
  response = await response.json();
  return response;
}

(async () => {
  const data = (await getLiveStream()).onlives;
  console.dir(data, { depth: 1 });
  const memberLive = data.find((streamer) => streamer.genre_name === "Idol");
  const jktLives = memberLive.lives.filter((streamer) =>
    streamer.room_url_key.includes("JKT48"),
  );
  console.dir(memberLive, { depth: 3 });
  console.log(jktLives);
})();
