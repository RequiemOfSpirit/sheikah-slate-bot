import { SlashCommandBooleanOption, SlashCommandBuilder, SlashCommandStringOption } from 'discord.js';

export const INFO_COMMAND_OPTION_NAMES = {
  command: 'command',
  private: 'private',
};
export const infoCommand = new SlashCommandBuilder()
  .setName('info')
  .setDescription('Get resource information corresponding to the given command')
  .addStringOption((option: SlashCommandStringOption) =>
    option.setName(INFO_COMMAND_OPTION_NAMES.command).setDescription('Command name').setRequired(true),
  )
  .addBooleanOption((option: SlashCommandBooleanOption) =>
    option
      .setName(INFO_COMMAND_OPTION_NAMES.private)
      .setDescription('If True, makes the response private and visible only to you')
      .setRequired(false),
  );

export const commands = [infoCommand];
