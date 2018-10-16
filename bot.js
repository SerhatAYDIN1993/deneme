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


client.on('message', msg => {
	if (!msg.content.startsWith(ayarlar.prefix)) return;
	if (commands.hasOwnProperty(msg.content.toLowerCase().slice(ayarlar.prefix.length).split(' ')[0])) commands[msg.content.toLowerCase().slice(ayarlar.prefix.length).split(' ')[0]](msg);
});

});

client.login(process.env.BOT_TOKEN);
