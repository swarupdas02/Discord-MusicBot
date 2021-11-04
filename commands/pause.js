const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
  name: "pause",
  description: "Pauses the music",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: [],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let player = await client.Manager.get(message.guild.id);
    if (!player)
      return client.sendTime(
        message.channel,
        "☠️ | **I am not obeying a command at present...**"
      );
    if (!message.member.voice.channel)
      return client.sendTime(
        message.channel,
        "☠️ | **I've already been summoned elsewhere.**"
      );
    if (
      message.guild.me.voice.channel &&
      message.member.voice.channel.id !== message.guild.me.voice.channel.id
    )
      return client.sendTime(
        message.channel,
        "☠️ | **I've already been summoned elsewhere.**"
      );
    if (player.paused)
      return client.sendTime(
        message.channel,
        "☠️ | **I'm still obeying the last command to pause.**"
      );
    player.pause(true);
    let embed = new MessageEmbed()
      .setAuthor(`Paused!`, client.botconfig.IconURL)
      .setColor(client.botconfig.EmbedColor)
      .setDescription(
        `Command me with \`${GuildDB.prefix}resume\` and I shall return to my task.`
      );
    await message.channel.send(embed);
    await message.react("✅");
  },

  SlashCommand: {
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
    run: async (client, interaction, args, { GuildDB }) => {
      const guild = client.guilds.cache.get(interaction.guild_id);
      const member = guild.members.cache.get(interaction.member.user.id);

      if (!member.voice.channel)
        return client.sendTime(
          interaction,
          "☠️ | **You must be within a channel to summon me.**"
        );
      if (
        guild.me.voice.channel &&
        !guild.me.voice.channel.equals(member.voice.channel)
      )
        return client.sendTime(
          interaction,
          "☠️ | **I've already been summoned elsewhere.**"
        );

      let player = await client.Manager.get(interaction.guild_id);
      if (!player)
        return client.sendTime(
          interaction,
          "☠️ | **Nothing is playing right now...**"
        );
      if (player.paused)
        return client.sendTime(interaction, "Music is already paused!");
      player.pause(true);
      client.sendTime(interaction, "**⏸ | I will obey. Paused.**");
    },
  },
};
