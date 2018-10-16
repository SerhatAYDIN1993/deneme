const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');

var prefix = ayarlar.prefix

client.on('ready', () => {
  console.log(`[BOT] ${client.user.tag} Sunucuya Giriş Yaptı.`);
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.channel.send('Pong!' + client.ping + 'ms');
  }

  if (msg.content === 'Selamın Aleyküm.') {
    msg.reply('Aleyküm Selam.(Kimse Almazsa Diye)');
  }

    if (msg.content === 'Deneme') {
    msg.reply('Denemem!');
  }

  if (msg.content === prefix + 'avatarım') {
	  msg.channel.send(msg.author.avatarURL);
  }
  
    if (msg.content === prefix + 'Versiyon') {
	  msg.channel.send('Versiyon Beta 0.0.1 İle Çalışmaktayım...');
  }
  
     if (msg.content === prefix + 'versiyon') {
	  msg.channel.send('Versiyon Beta 0.0.1 İle Çalışmaktayım...');
  }

    if (msg.content === prefix + 'resetle') {  
	
	if (msg.author.id === '353482513399676928') {
		msg.channel.send('Sistem yeniden başlatılıyor!')
		msg.channel.send('(Bekleyiniz...)')
		msg.channel.send('Başlatıldı!').then (msg => {
			console.log('Sistem Yeniden Başlatıldı...');
		process.exit(0);
		});
		}else {
		msg.channel.send('Bu Yetkiye Sahip Değilsiniz!');
  }
	}

const YouTube = require('simple-youtube-api');
const yt = require('ytdl-core');
const youtube = new YouTube("AIzaSyCIn2tUo5vtqwmrwB7orGonnNsS5a3oNSc");
const ayarlar = ('ayarlar.json')

let sıra = {};

const commands = {
	'çal': (msg) => {
		if (sıra[msg.guild.id] === undefined) return msg.channel.sendMessage(`Sıraya ilk önce bazı şarkıları eklemek için ${msg.guild.id.prefix}ekle yapınız`);
		if (!msg.guild.voiceConnection) return commands.join(msg).then(() => commands.play(msg));
		if (sıra[msg.guild.id].playing) return msg.channel.sendMessage('Zaten Çalınan var');
		let dispatcher;
		sıra[msg.guild.id].playing = true;

		console.log(sıra);
		(function play(song) {
			console.log(song);
			if (song === undefined) return msg.channel.sendMessage('**Sıra boş olduğundan odadan çıkıyorum**').then(() => {
				sıra[msg.guild.id].playing = false;
				msg.member.voiceChannel.leave();
			});
			msg.channel.sendMessage(`Çalınan: **${song.title}** tarafından talep edildi gibi: **${song.requester}**`);
			dispatcher = msg.guild.voiceConnection.playStream(yt(song.url, { audioonly: true }), { passes : ayarlar.passes });
			let collector = msg.channel.createCollector(m => m);
			collector.on('message', m => {
				if (m.content.startsWith(msg.guild.prefix + 'durdur')) {
					msg.channel.sendMessage('**Şarkı durduruldu.**').then(() => {dispatcher.pause();});
				} else if (m.content.startsWith(ayarlar.prefix + 'devam')){
					msg.channel.sendMessage('**Şarkı devam ediyor.**').then(() => {dispatcher.resume();});
				} else if (m.content.startsWith(ayarlar.prefix + 'geç')){
					msg.channel.sendMessage('**Çalınan şarkı geçildi**').then(() => {dispatcher.end();});
				} else if (m.content.startsWith('ses+')){
					if (Math.round(dispatcher.volume*50) >= 100) return msg.channel.sendMessage(`Ses: ${Math.round(dispatcher.volume*50)}%`);
					dispatcher.setVolume(Math.min((dispatcher.volume*50 + (2*(m.content.split('+').length-1)))/50,2));
					msg.channel.sendMessage(`Ses: ${Math.round(dispatcher.volume*50)}%`);
				} else if (m.content.startsWith('ses-')){
					if (Math.round(dispatcher.volume*50) <= 0) return msg.channel.sendMessage(`Ses: ${Math.round(dispatcher.volume*50)}%`);
					dispatcher.setVolume(Math.max((dispatcher.volume*50 - (2*(m.content.split('-').length-1)))/50,0));
					msg.channel.sendMessage(`Ses: ${Math.round(dispatcher.volume*50)}%`);
				} else if (m.content.startsWith(ayarlar.prefix + 'süre')){
					msg.channel.sendMessage(`süre: ${Math.floor(dispatcher.time / 60000)}:${Math.floor((dispatcher.time % 60000)/1000) <10 ? '0'+Math.floor((dispatcher.time % 60000)/1000) : Math.floor((dispatcher.time % 60000)/1000)}`);
				}
			});
			dispatcher.on('end', () => {
				collector.stop();
				play(sıra[msg.guild.id].songs.shift());
			});
			dispatcher.on('error', (err) => {
				return msg.channel.sendMessage('error: ' + err).then(() => {
					collector.stop();
					play(sıra[msg.guild.id].songs.shift());
				});
			});
		})(sıra[msg.guild.id].songs.shift());
	},
	'join': (msg) => {
		return new Promise((resolve, reject) => {
			const voiceChannel = msg.member.voiceChannel;
			if (!voiceChannel || voiceChannel.type !== 'voice') return msg.reply('Kanalda kimse olmadığından çıkıyorum.');
			voiceChannel.join().then(connection => resolve(connection)).catch(err => reject(err));
		});
	},
	'ekle': async (msg) => {
        const args = msg.content.split(' ');
        const searchString = args.slice(1).join(' ');
        const url2 = args[1].replace(/<.+>/g, '1');
        
        try {
            var video = await youtube.getVideo(url2)
        } catch (error) {
            try {
                var videos = await youtube.searchVideos(searchString, 1)
                var video = await youtube.getVideoByID(videos[0].id)
            } catch (err) {
                console.log(err)
                msg.channel.send('Bir hata oluştu: ' + err)
            };
        };
        
        var url = `https://www.youtube.com/watch?v=${video.id}`
        
        if (url == '' || url === undefined) return msg.channel.sendMessage(`Bir YouTube linki eklemek için ${ayarlar.prefix}ekle <url/şarkı ismi> yazınız`);
        yt.getInfo(url, (err, info) => {
            if(err) return msg.channel.sendMessage('Geçersiz YouTube Bağlantısı: ' + err);
            if (!sıra.hasOwnProperty(msg.guild.id)) sıra[msg.guild.id] = {}, sıra[msg.guild.id].playing = false, sıra[msg.guild.id].songs = [];
            sıra[msg.guild.id].songs.push({url: url, title: info.title, requester: msg.author.username});
            msg.channel.sendMessage(`sıraya **${info.title}** eklendi`);
        });
    },
	'sıra': (msg) => {
		if (sıra[msg.guild.id] === undefined) return msg.channel.sendMessage(`Sıraya ilk önce bazı şarkıları eklemen gerekli yani şöyle "${ayarlar.prefix}ekle" şeklinde`);
		let tosend = [];
		sıra[msg.guild.id].songs.forEach((song, i) => { tosend.push(`${i+1}. ${song.title} - Requested by: ${song.requester}`);});
		msg.channel.sendMessage(`__**${msg.guild.name}'s Müzik Kuyruğu:**__ Şu anda **${tosend.length}** şarkı sırada ${(tosend.length > 15 ? '*[Sadece 15 tanesi gösteriliyor]*' : '')}\n\`\`\`${tosend.slice(0,15).join('\n')}\`\`\``);
	},
	'reboot': (msg) => {
		if (msg.author.id == ayarlar.adminID) process.exit(); //Requires a node module like Forever to work.
	}
};

client.on('message', msg => {
	if (!msg.content.startsWith(ayarlar.prefix)) return;
	if (commands.hasOwnProperty(msg.content.toLowerCase().slice(ayarlar.prefix.length).split(' ')[0])) commands[msg.content.toLowerCase().slice(ayarlar.prefix.length).split(' ')[0]](msg);
});

});

client.login(process.env.BOT_TOKEN);
