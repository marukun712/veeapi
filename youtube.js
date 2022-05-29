import fetch from 'node-fetch';
import dotenv from 'dotenv'
dotenv.config();
import fs from 'fs'
import moment from 'moment'
var member = {
    'tuna': {
        id: "UCUdlDvZJGGP78zvta3swIhw"
    },
    'ruki': {
        id: "UCAUicVZlApAIhcdL9df3gWw"
    },
    'airu': {
        id: "UCJGQPbaqTY91JhVzD8gIZyw"
    },
    'ringo': {
        id: "UCf57-IJn5mUJDyqd9uNEmrg"
    },
    'kohaku': {
        id: "UCQLyq7TDKHlmp2Ufd5Z2qMw"
    }
}

var key = 'AIzaSyBeFemOJejDzELVO1UpGqUFzVdKbZBgdBQ'

var items = []

var ids = []

var times = []

function req() {
    items.length = 0;
    ids.length = 0;
    times.length = 0;
    fetch("https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=" + member.kohaku.id + "&key=" + key + "&eventType=upcoming&type=video")
        .then(res => res.json())
        .then(json => {
            var num = json.items.length;
            for (let i = 0; i < num; i++) {
                var ID = json.items[i].id.videoId
                ids.push(ID)
                var title = json.items[i].snippet.title
                var image = json.items[i].snippet.thumbnails.medium.url;
                items.push({
                    items: {
                        title: title,
                        image: image,
                        id: ID
                    }
                })
            }
        });

    fetch("https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=" + member.tuna.id + "&key=" + key + "&eventType=upcoming&type=video")
        .then(res => res.json())
        .then(json => {
            var num = json.items.length;
            for (let i = 0; i < num; i++) {
                var ID = json.items[i].id.videoId
                ids.push(ID)
                var title = json.items[i].snippet.title
                var image = json.items[i].snippet.thumbnails.medium.url;
                items.push({
                    items: {
                        title: title,
                        image: image,
                        id: ID
                    }
                })
            }
        });

    fetch("https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=" + member.ruki.id + "&key=" + key + "&eventType=upcoming&type=video")
        .then(res => res.json())
        .then(json => {
            var num = json.items.length;
            for (let i = 0; i < num; i++) {
                var ID = json.items[i].id.videoId
                ids.push(ID)
                var title = json.items[i].snippet.title
                var image = json.items[i].snippet.thumbnails.medium.url;
                items.push({
                    items: {
                        title: title,
                        image: image,
                        id: ID
                    }
                })
            }
        });

    fetch("https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=" + member.ringo.id + "&key=" + key + "&eventType=upcoming&type=video")
        .then(res => res.json())
        .then(json => {
            var num = json.items.length;
            for (let i = 0; i < num; i++) {
                var ID = json.items[i].id.videoId
                ids.push(ID)
                var title = json.items[i].snippet.title
                var image = json.items[i].snippet.thumbnails.medium.url;
                items.push({
                    items: {
                        title: title,
                        image: image,
                        id: ID
                    }
                })
            }
        });

    fetch("https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=" + member.airu.id + "&key=" + key + "&eventType=upcoming&type=video")
        .then(res => res.json())
        .then(json => {
            var num = json.items.length;
            for (let i = 0; i < num; i++) {
                var ID = json.items[i].id.videoId
                ids.push(ID)
                var title = json.items[i].snippet.title
                var image = json.items[i].snippet.thumbnails.medium.url;
                items.push({
                    items: {
                        title: title,
                        image: image,
                        id: ID
                    }
                })
            }
        });

    function gettime() {
        var num = ids.length;

        fetch(`https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${ids}&key=${key}`)
            .then(res => res.json())
            .then(json => {
                for (let i = 0; i < num; i++) {
                    var timedata = json.items[i].liveStreamingDetails.scheduledStartTime
                    var time = moment(timedata).format('YYYY.MM.DD HH:mm')
                    times.push(time)
                }
            })

    };

    function pushtime() {
        var num = times.length
        for (let i = 0; i < num; i++) {
            items[i].items.time = times[i]
        }
    }

    function write() {
        fs.writeFile('res.json', JSON.stringify(items, null, '    '), (err) => {
            if (err) console.log(`error!::${err}`);
        });
    }

    setTimeout(gettime, 1000);
    setTimeout(pushtime, 2000);
    setTimeout(write, 3000);
    console.log('情報を更新しました。')
}

req();

setInterval(() => {
    req();
}, 6000000);