// Temp variable containing duplicate command data. Will be replaced with an API call in the future
const commandsData = [
  {
    title: 'Commands',
    response: 'Sheikah Slate bot commands list: https://requiemofspirit.github.io/sheikah-slate-bot',
    commands: ['!commands', '!botwcommands'],
  },
  {
    title: 'Breath of the Wild leaderboards',
    response: 'BotW main board: https://www.speedrun.com/botw | Category extensions: https://www.speedrun.com/botwce',
    commands: ['!lb', '!mainboard', '!ce', '!extensions'],
  },
  {
    title: 'Breath of the Wild speedrun discord',
    response: 'BotW speedrun discord: https://discord.gg/vdJTWtBYVG',
    commands: ['!srdiscord'],
  },
  {
    title: 'Windbombing',
    response:
      "Windbombing is a trick that abuses bullet time to allow using one bomb's explosion to launch another bomb into Link, launching him at high speeds. This trick is primarily used to quickly cover short to mid range distances. | Tutorial: !wbtut",
    commands: ['!wb', '!windbomb'],
  },
  {
    title: 'Windbomb tutorial',
    response:
      'In-depth windbomb tutorial series by Vivoxe: https://www.youtube.com/playlist?list=PLDeJIkztemjirnz-Wpz0dhKw4VdVfLnZ5',
    commands: ['!wbtutorial', '!wbtut', '!wbguide'],
  },
  {
    title: 'Bullet Time Bounces',
    response:
      'Bullet Time Bounces involve landing on an enemy while shield surfing in bullet time and exiting bullet time as soon as it ragdolls. The ragdolling enemy pushes Link away at an incorrectly high speed and exiting bullet time multiplies this speed by 20x letting Link traverse very long distances.',
    commands: ['!btb'],
  },
  {
    title: 'Bow Lift Smuggle Slide',
    response:
      "Bow Lift Smuggle Slide is a glitch discovered by LegendofLuke that involves smuggling a bow and any carryable item (like a bomb) in Link's hand, interrupting a step-up animation and taking advantage of the lack of gravity to slide around at high speeds without losing height or stamina, with the smuggled item continuously pushing Link along. | Tutorial: !blsstut, Execution examples: !blssstyles",
    commands: ['!blss'],
  },
  {
    title: 'BLSS tutorial',
    response: 'In-depth BLSS guide by SrTapir: https://youtu.be/AYvJa_pQXZc',
    commands: ['!blsstutorial', '!blsstut', '!blssguide'],
  },
  {
    title: 'BLSS flicking styles',
    response: 'Different BLSS flicking techniques from various runners: https://restite.org/blss',
    commands: ['!blssstyles', '!flickingstyles'],
  },
  {
    title: 'Skew/Shield Clipping',
    response:
      "When Link shield flips upwards onto a slope without surfing, the game stores the slope's direction and angle at Link's center. The next time you shield flip, Link will tilt or 'skew' in that direction at that stored angle and snap back upright immediately after. This skew can be used to clip through certain walls in the game. | Guide: !shieldcliptut",
    commands: ['!skew', '!skewclip', '!shieldclip'],
  },
  {
    title: 'Extended Shield Clipping',
    response:
      'While performing a shield clip through a wall, you can extend your clip by re-equipping shield and holding the shield surf inputs, allowing you to clip through thicker walls like shrine doors or to clip through thin walls with weak skews. | Guide: !shieldcliptut',
    commands: ['!esc'],
  },
  {
    title: 'Skew and general shield clipping tutorial',
    response:
      'Detailed guide covering skew and the many different forms of shield clipping: https://youtu.be/Y6JTniuJPXE',
    commands: ['!shieldcliptutorial', '!shieldcliptut', '!shieldclipguide'],
  },
  {
    title: 'Extended shield clip tutorial',
    response: 'ESC tutorial by Limcube: https://youtu.be/k_vvx5cz9Mk',
    commands: ['!esctutorial', '!esctut', '!escguide'],
  },
  {
    title: 'Ragdoll glitch',
    response:
      'Ragdoll glitch is caused by shield jumping and unequipping shield midair. This glitch messes with any trick that involves Link ragdolling, such as windbombs. Detailed explanation: https://youtu.be/d6-QhXwD8sY',
    commands: ['!ragdoll', '!ragdollglitch'],
  },
  {
    title: 'Skew vs ragdoll glitch',
    response:
      'Skew and ragdoll glitch are completely unrelated, with the exception that both are related to/involve unequipping shield midair during a shield surf. Video covering the differences: https://youtu.be/8bfZ4o-OMDg',
    commands: ['!skewvsragdoll'],
  },
  {
    title: 'Gamer windbomb guide',
    response: 'Quick tutorial on Gamer windbomb by finagle_a_bagel: https://youtu.be/1dy_ochgC88',
    commands: ['!gamerwb'],
  },
  {
    title: 'Canal windbomb guide',
    response:
      'Canal windbomb instructions and visual cues by Onyx: https://x.com/OnyxEbony3/status/1482671152367484929',
    commands: ['!canalwb'],
  },
  {
    title: 'Tree windbomb guide',
    response:
      'Visual cue for where to aim for tree windbomb: https://i.imgur.com/rxUiGbY.jpeg. Aiming further left along that red line will land you closer to the clipping spot but will make launch angles tighter, with lower launches getting blocked by the cliff. If you get no height from a launch, it may be because of bad bomb placements, late detonation after placing square, or lag. You can get rid of lag by aiming the camera at the sky while waiting to place square.',
    commands: ['!treewb'],
  },
  {
    title: 'Stasis windbomb guide',
    response:
      'Stasis windbomb instructions and visual cues by Onyx: https://x.com/OnyxEbony3/status/1561710631912296448',
    commands: ['!stasiswb'],
  },
  {
    title: 'Shrine of Resurrection clip guide',
    response:
      "SoR clip video guide: https://youtu.be/YR3poIgA_Yg. Mini-map visual cue for Link's facing direction and camera angle: https://i.imgur.com/Q9nwRjY.png",
    commands: ['!sorclip'],
  },
  {
    title: 'Bombs elevator clip guide',
    response:
      'Do an instant shield jump - hold ZL, move forward and press A and X at the same time (or) hold ZL and A, move forward and press X. Video guide: https://youtu.be/R-KDr298Oh8',
    commands: ['!instant', '!bombsclip2'],
  },
  {
    title: 'Cryonis shrine normal clip guide',
    response: 'Cryo normal shield clip tutorial by Wolhaiksong: https://youtu.be/2dsSUJCwlwM',
    commands: ['!cryonormalclip'],
  },
  {
    title: 'Any% Blights tutorial',
    response: 'In-depth blights tutorial by TheRealNoman: https://youtu.be/aMbvew2Fskg',
    commands: ['!blightstutorial', '!blightstut', '!blightsguide'],
  },
  {
    title: 'Any% (v1.6) tutorials',
    response:
      'Beginner tutorial series by The Zelda Enthusiast: https://www.youtube.com/playlist?list=PLUL4WQb6rYgWJFfDyH5EoyhygmOpiOLvm | Commentated beginner route run-through by Player5: https://youtu.be/HwuPldbQIGo | Advanced tips and tricks by Player5: Part 1 - https://youtu.be/FLXJbbhhfNc, Part 2 - https://youtu.be/wmeEIbG7nNw',
    commands: ['!any%tutorial', '!any%tut', '!1.6any%tut'],
  },
  {
    title: 'Great Plateau (v1.8) tutorial',
    response:
      "The videos covering the Great Plateau and Castle BTB in Limcube's Any% tutorial series: https://www.youtube.com/playlist?list=PLA9o4XP3K5-bIVynKm-jHeV7M6i4c0_1k",
    commands: ['!1.8gptutorial', '!1.8gptut'],
  },
  {
    title: '100% route options',
    response:
      'Document covering 100% route options for each available game version: https://docs.google.com/document/d/1HVYL3AL60YvW9ucHcyH_0nUHQ8n7OqQuqWyBlHgteF0/edit?usp=sharing',
    commands: ['!100%routes', '!hundoroutes'],
  },
  {
    title: 'Golden Gauntlets',
    response:
      'Golden Gauntlets is a glitch that allows Link to pick up any object and treat it as if he was holding a remote bomb instead, making walking slightly faster because of bombs being lighter. In 100%, this glitch is used to save time for the rock pattern koroks and the rock roast quest. Tutorial: https://youtube.com/shorts/jJkDv-W7vH8',
    commands: ['!goldgaunts', '!goldengauntlets'],
  },
  {
    title: 'Shrine Coordinate Warps',
    response:
      "Shrine Coordinate Warps involve storing the elevator activation of one shrine and using that to enter another shrine by landing within the 2nd shrine's load radius. | Tutorial: !scwtut, Overworld map with shrine load radii: !objmap",
    commands: ['!scw'],
  },
  {
    title: 'Buffered SCWs',
    response:
      "Buffered SCWs involve carrying over SCW elevator storage to shrines outside of the stored elevator's unload radius. This involves holding the quick menu open and only advancing the game a few frames at a time every second to prevent the elevator from unloading. In-depth explanation and guide: https://youtu.be/wVUSCTo4kGY",
    commands: ['!bufferedscw'],
  },
  {
    title: 'Infinite SCWs',
    response:
      'Some shrines have an infinite unloading radius, meaning that the elevator will not unload as Link moves away from the shrine. This allows Link to SCW into shrines that are much farther away without having to buffer to maintain storage.',
    commands: ['!iscw'],
  },
  {
    title: 'Shrine Coordinate Warp tutorial',
    response: 'SCW Storage tutorial by Orcrist: https://www.twitch.tv/videos/1601589390',
    commands: ['!scwtutorial', '!scwtut', '!scwguide'],
  },
  {
    title: 'Inventory Slot Transfer',
    response:
      'Inventory Slot Transfer is a trick that lets us effectively transfer items to other saves allowing for inventory corruption using the transfered items which lets us modify and max out item counts and modify weapon durabilities. | Understanding IST: !understandingist, IST Simulator: !istsim',
    commands: ['!ist'],
  },
  {
    title: 'Understanding Inventory Slot Transfer',
    response:
      "Video covering IST and corruption concepts, useful for people trying to understand what's happening in the game during IST setups: https://youtu.be/TN_2rRqEDsQ",
    commands: ['!understandingist', '!istexplained'],
  },
  {
    title: 'All Dungeons IST setup',
    response: 'AD IST tutorial by Player5: https://youtu.be/NZBmu9hEZY0',
    commands: ['!adist'],
  },
  {
    title: 'Weapon Modifier Corruption',
    response:
      'Weapon Modifier Corruption is a trick that allows us to corrupt weapon modifiers by applying meal stats (health, sell price) onto weapon modifier data (modifier value, modifier types), allowing us to create extremely broken weapons like bows with +100 attack up that shoot 10 arrows. | WMC meals database: !wmcmeals',
    commands: ['!wmc'],
  },
  {
    title: 'Amiibo alternatives',
    response:
      'NFC tags can be used as an alternative to real amiibo. Blank NFC tags can be purchased for cheap online and written to using tools like tagmo: https://play.google.com/store/apps/details?id=com.hiddenramblings.tagmo.eightbit',
    commands: ['!nfc', '!tagmo'],
  },
  {
    title: 'Any% Fish Amiibo',
    response: 'List of amiibo that drop fish and their drop rates: https://imgur.com/a/amiibo-needed-any-yvxxKeC',
    commands: ['!fishamiibo', '!any%amiibo'],
  },
  {
    title: 'Enemy and Amiibo drop tables',
    response: 'Complete BotW enemy and amiibo drop tables: https://restite.org/drops',
    commands: ['!droptables', '!amiibodrops', '!enemydrops'],
  },
  {
    title: 'All Dungeons requirements',
    response: 'All Dungeons requires beating all the divine beasts and then beating Ganon at the end',
    commands: ['!adrequirements', '!adgoals'],
  },
  {
    title: 'Master Sword Restricted requirements',
    response:
      'Master Sword Restricted requires getting the master sword as fast as possible without using glitches to dupe hearts or otherwise get it early. This involves completing 40 shrines and then trading the spirit orbs in for the required 13 hearts.',
    commands: ['!msrrequirements', '!msrgoals'],
  },
  {
    title: 'All Main Quests requirements',
    response:
      'All Main Quests requires clearing all "Main Quests" which includes beating all divine beasts, collecting all memories, finishing the fairy fountain quest, finishing the tower quest on plateau, and obtaining the master sword',
    commands: ['!amqrequirements', '!amqgoals'],
  },
  {
    title: '100% requirements',
    response:
      "100% requires - 900 koroks, 120 shrines, all divine beasts, main quests, side quests, shrine quests and memories, 100% map counter, all health and stamina upgrades, all permanent items [upgraded shiekah slate, all Kilton medals (kill 40 Hinoxes, 40 Talus, 4 Molduga), horse bridles and saddles, Confidential Envelope (completed Compendium), Hestu's Gift] and all unsellable armor fully upgraded (Zora Set, Armor of the Wild Set, Champion's Tunic, Thunder Helm)",
    commands: ['!hundorequirements', '!hundogoals', '!100%requirements', '!100%goals'],
  },
  {
    title: 'Bug Limit',
    response:
      'Bug Limit is the "No Major Glitches" equivalent for BotW runs. It allows use of certain tricks and glitches that are deemed "minor" like whistle sprinting, fall damage cancelling, and infinite horse stamina. Full rules list: https://www.speedrun.com/botw?h=Bug_Limit_Categories-Any-Original&rules=category&x=wdml4v3k-38djj2e8.814vk9w1-5ly772yl.0q55x4rq',
    commands: ['!buglimit'],
  },
  {
    title: 'Version info',
    response:
      'Allowed versions for speedrun submissions: 1.0, 1.3.1, 1.5, 1.6, 1.7, 1.8.2 S1E, 1.8.2 S2E | More info - v1.7 and prior: !v1.6, v1.8: !v1.8',
    commands: ['!versions', '!versioninfo'],
  },
  {
    title: 'Versions 1.7 and prior',
    response:
      'v1.7 and prior versions make heavy use of BLSS for long distance movement. Versions prior to v1.6 have slower loads on Switch 1. Glitches exclusive to pre-v1.6 versions are not allowed in speedrun submissions.',
    commands: ['!v1.6', '!v1.7'],
  },
  {
    title: 'Version 1.8',
    response:
      'v1.8 has faster load times than v1.6 and prior versions, but has BLSS patched. Long distance movement will involve use of BTBs instead. Switch 2 Edition of v1.8 runs at 60fps and has even faster loads. S2E has variances on all physics based tricks, including skew clips, windbombs and BTBs.',
    commands: ['!v1.8'],
  },
  {
    title: 'Language speeds',
    response:
      'The fastest language for a category depends on the voice acted cutscenes that need to be watched and the text that needs to be scrolled through. Text on screen is affected by console language while VA cutscene lengths (including interactive VA cutscenes like the Dark Beast fight) are affected by VA language. Fastest language calculator: https://pistonight.github.io/botw-fastest-lang',
    commands: ['!languages', '!languageinfo'],
  },
  {
    title: 'Console differences',
    response:
      'WiiU: Slowest console, most amount of lag, capped at v1.5 | Switch 1: Better loads and less lag while still having access to BLSS | Switch 2: BLSS patched, but has much faster loads and much less lag | More info - WiiU: !wiiu, Switch 1: !switch1, Switch 2: !switch2',
    commands: ['!consoles', '!consoleinfo'],
  },
  {
    title: 'Breath of the Wild on WiiU',
    response:
      'WiiU is the slowest console to run BotW on. It has the slowest loads of all console options with worse lag making windbombing in some areas inconsistent. The latest version released on WiiU is v1.5.',
    commands: ['!wiiu', '!botwonwiiu'],
  },
  {
    title: 'Breath of the Wild on Switch 1',
    response:
      'Switch 1 is the fastest option for runs on v1.7 and prior, and is the fastest option overall for most short and mid length glitched categories. Switch 1 can run v1.8 as well, but has worse load times compared to Switch 2.',
    commands: ['!switch1', '!botwonswitch1'],
  },
  {
    title: 'Breath of the Wild on Switch 2',
    response:
      'Switch 2 has much faster loads compared to the other consoles but is limited to v1.8 and later, meaning runs on Switch 2 cannot use BLSS. It is the fastest option overall for very long categories, especially categories like 100% that do not use BLSS for most of the run.',
    commands: ['!switch2', '!botwonswitch2'],
  },
  {
    title: 'Using emulators for leaderboard submissions',
    response:
      'You are free to do runs or practice on any emulator as you see fit. However, emulators are not allowed for leaderboard submissions.',
    commands: ['!lbemulators', '!lbemu'],
  },
  {
    title: 'Cemu FPS++ settings',
    response:
      "If you're having issues with performing any physics based tricks on Cemu, make sure you have FPS++ either set to 30fps or disabled. Most physics based tricks do not work as expected (or at all) at frame rates higher than 30fps.",
    commands: ['!fps++', '!cemufps++'],
  },
  {
    title: 'Downpatching',
    response: 'Homebrew: !homebrewdownpatch, Stock OS: !stockdownpatch',
    commands: ['!downpatch', '!downpatching'],
  },
  {
    title: 'Downpatching with Homebrew',
    response:
      'Uninstall v1.8 and install a previously dumped copy of v1.6 using Goldleaf. You will need to reset launch version after downpatching. You will be unable to play any saves made on v1.8 on prior versions.',
    commands: ['!homebrewdownpatch', '!homebrewdownpatching'],
  },
  {
    title: 'Downpatching on Stock Switch OS without Homebrew',
    response:
      'Factory reset your Switch and turn off "Auto-Update Software" in system settings. You can now play on any v1.0-v1.6 game card. If on a pre-v1.6 version, you can use local version matching with another Switch that has v1.6 to upgrade.',
    commands: ['!stockdownpatch', '!stockdownpatching'],
  },
  {
    title: 'Breath of the Wild Object Map',
    response:
      'Object map showing locations of and providing detailed info on various entities in BotW: https://objmap.zeldamods.org',
    commands: ['!objmap'],
  },
  {
    title: 'IST Simulator',
    response: 'IST simulator to help plan IST setups: https://ist.pistonite.app',
    commands: ['!istsim', '!istsimulator'],
  },
  {
    title: 'WMC meals database',
    response: 'Tool to plan out meals for WMC setups: https://restite.org/wmc',
    commands: ['!wmcmeals'],
  },
  {
    title: 'D-Pad fix',
    response:
      'Video guide with instructions on how to open up a Pro Controller and fix the D-Pad: https://youtu.be/7wmxN9zytsY',
    commands: ['!dpadfix'],
  },
  {
    title: 'Snapback fix',
    response:
      "List of steps covering how to use Joy-Con toolkit (!jctoolkit) to edit the right stick's deadzone to fix snapback: https://discord.com/channels/269611402854006785/1296969457960353803",
    commands: ['!snapbackfix'],
  },
  {
    title: 'Joy-Con Toolkit',
    response:
      'A windows tool used to edit Switch 1 Joy-Con and Pro Controller properties such as stick deadzones: https://github.com/CTCaer/jc_toolkit/releases',
    commands: ['!jctoolkit'],
  },
];

// Function to populate the table
(() => {
  const tableBody = document.getElementById('commands-table-body');

  commandsData.forEach(({ title, commands, response }) => {
    // Create a new row
    const row = document.createElement('tr');

    // Create the command cell
    const commandCellContainer = document.createElement('td');
    const commandCell = document.createElement('div');
    commandCell.classList.add('command-cell');
    commandCellContainer.appendChild(commandCell);

    const commandTitle = document.createElement('strong');
    commandTitle.classList.add('command-title');
    commandTitle.textContent = title;
    commandCell.appendChild(commandTitle);

    // Add commands as chips
    const chipContainer = document.createElement('div');
    chipContainer.classList.add('chip-container');
    commands.forEach((command) => {
      const chip = document.createElement('span');
      chip.classList.add('chip');
      chip.textContent = command;
      chipContainer.appendChild(chip);
    });
    commandCell.appendChild(chipContainer);

    // Create the response cell
    const responseCell = document.createElement('td');
    // Render line breaks and replace URLs with actual links
    responseCell.innerHTML = response
      .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1">$1</a>')
      .split('|')
      .map((part) => part.trim())
      .join('<br>');

    // Append cells to the row
    row.appendChild(commandCellContainer);
    row.appendChild(responseCell);

    // Append the row to the table body
    tableBody.appendChild(row);
  });
})();
