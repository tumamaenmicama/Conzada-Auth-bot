const { SlashCommandBuilder, Colors, EmbedBuilder } = require("discord.js");
const db = require('../../utils/database')
const fetch = require('node-fetch')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reset-user")
        .setDescription("Reset a user HWID.")
        .setDescriptionLocalizations({
            "en-US": "Reset a users HWID.",
            "fi": "Nollaa käyttäjä",
            "fr": "Réinitialiser un utilisateur",
            "de": "Benutzer zurücksetzen",
            "it": "Reimposta un utente",
            "nl": "Reset een gebruiker",
            "ru": "Сбросить пользователя",
            "pl": "Zresetuj użytkownika",
            "tr": "Bir kullanıcıyı sıfırlayın",
            "cs": "Resetovat uživatele",
            "ja": "ユーザーをリセットする",
            "ko": "사용자를 재설정하십시오",
        })
        .addStringOption((option) =>
            option
                .setName("username")
                .setDescription("Username of the user you're HWID resetting.")
                .setRequired(true)
        ),
    async execute(interaction) {
        let idfrom = interaction.guild ? interaction.guild.id : interaction.user.id;
        let ephemeral = !interaction.guild ? false : true;

        let sellerkey = await db.get(`token_${idfrom}`)
        if (sellerkey === null) return interaction.editReply({ embeds: [new EmbedBuilder().setDescription(`Your \`SellerKey\` **has not been set!**\n In order to use this bot, you must run the \`/add-application\` Command First.`).setColor(Colors.Red).setTimestamp()], ephemeral: ephemeral })

        let un = interaction.options.getString("username")

        fetch(`https://keyauth.win/api/seller/?sellerkey=${sellerkey}&type=resetuser&user=${un}`)
            .then(res => res.json())
            .then(json => {
                if (json.success) {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle('User HWID successfully reset!').addFields([{ name: 'Username:', value: `\`${un}\`` }]).setColor(Colors.Green).setTimestamp()], ephemeral: ephemeral })
                }
                else {
                    interaction.editReply({ embeds: [new EmbedBuilder().setTitle(json.message).addFields([{ name: 'Note:', value: `Your seller key is most likely invalid. Change your seller key with \`/add-application\` command.` }]).setColor(Colors.Red).setFooter({ text: "KeyAuth Discord Bot" }).setTimestamp()], ephemeral: ephemeral })
                }
            })
    },
};