// Temp variable containing duplicate command data. Will be replaced with an API call in the future
const commandsData = [
  {
    title: 'Commands',
    response: 'Sheikah Slate bot commands list: https://requiemofspirit.github.io/sheikah-slate-bot',
    commands: ['!commands', '!botwcommands'],
  },
  {
    title: 'Windbomb tutorial',
    response: 'https://www.youtube.com/playlist?list=PLDeJIkztemjirnz-Wpz0dhKw4VdVfLnZ5',
    commands: ['!wbtutorial', '!wbtut', '!wbguide'],
  },
  {
    title: 'BLSS tutorial',
    response: 'https://youtu.be/AYvJa_pQXZc',
    commands: ['!blsstutorial', '!blsstut', '!blssguide'],
  },
  {
    title: 'Skew and general shield clipping tutorial',
    response:
      'Detailed guide covering skew and the many different forms of shield clipping: https://youtu.be/Y6JTniuJPXE',
    commands: ['!skew', '!shieldcliptutorial', '!shieldcliptut', '!shieldclipguide'],
  },
  {
    title: 'Ragdoll glitch',
    response:
      'Caused by shield jumping and unequipping shield midair. Messes with any trick that involves link ragdolling such as windbombs. Detailed explanation: https://youtu.be/d6-QhXwD8sY',
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
    response: 'https://youtu.be/1dy_ochgC88',
    commands: ['!gamerwb'],
  },
  {
    title: 'Canal windbomb guide',
    response: 'https://x.com/OnyxEbony3/status/1482671152367484929',
    commands: ['!canalwb'],
  },
  {
    title: 'Tree windbomb guide',
    response: `Visual cue for where to aim: https://i.imgur.com/rxUiGbY.jpeg
      Aiming further left along that red line will land you closer to the clipping spot but will make launch angles tighter, with lower launches getting blocked by the cliff.
      If you get no height from a launch, it may be because of bad bomb placements, late detonation after placing square, or lag. You can get rid of lag by aiming the camera at the sky while waiting to place square.`,
    commands: ['!treewb'],
  },
  {
    title: 'Stasis windbomb guide',
    response: 'https://x.com/OnyxEbony3/status/1561710631912296448',
    commands: ['!stasiswb'],
  },
  {
    title: 'Shrine of Resurrection clip guide',
    response: `Visual cue: https://i.imgur.com/Q9nwRjY.png
      Video guide: https://youtu.be/YR3poIgA_Yg`,
    commands: ['!sorclip'],
  },
  {
    title: 'Bombs elevator clip guide',
    response: `Do an instant shield jump - hold ZL, move forward and press A and X at the same time (or) hold ZL and A, move forward and press X.
      Video guide: https://youtu.be/R-KDr298Oh8`,
    commands: ['!instant', '!bombsclip2'],
  },
  {
    title: 'Cryonis shrine normal clip guide',
    response: 'https://youtu.be/2dsSUJCwlwM',
    commands: ['!cryonormalclip'],
  },
  {
    title: 'Extended shield clip tutorial',
    response: 'https://youtu.be/k_vvx5cz9Mk',
    commands: ['!esctutorial', '!esctut', '!escguide'],
  },
  {
    title: 'Any% Blights tutorial',
    response: 'https://youtu.be/aMbvew2Fskg',
    commands: ['!blightstutorial', '!blightstut', '!blightsguide'],
  },
  {
    title: 'Any% (v1.6) tutorials',
    response: `Beginner tutorial series by The Zelda Enthusiast: https://www.youtube.com/playlist?list=PLUL4WQb6rYgWJFfDyH5EoyhygmOpiOLvm
      Commentated beginner route run-through by Player5: https://youtu.be/HwuPldbQIGo
      Advanced tips and tricks by Player5: Part 1 - https://youtu.be/FLXJbbhhfNc | Part 2 - https://youtu.be/wmeEIbG7nNw`,
    commands: ['!any%tutorial', '!any%tut', '!1.6any%tut'],
  },
  {
    title: 'Great Plateau (v1.8) tutorial',
    response:
      "The videos covering the Great Plateau and Castle BTB in Limcube's Any% tutorial series: https://www.youtube.com/playlist?list=PLA9o4XP3K5-bIVynKm-jHeV7M6i4c0_1k",
    commands: ['!1.8gptutorial', '!1.8gptut'],
  },
  {
    title: '100% routes',
    response: 'https://docs.google.com/document/d/1HVYL3AL60YvW9ucHcyH_0nUHQ8n7OqQuqWyBlHgteF0/edit?usp=sharing',
    commands: ['!100%routes', '!hundoroutes'],
  },
  {
    title: 'Shrine Coordinate Warp tutorial',
    response: 'https://www.twitch.tv/videos/1601589390',
    commands: ['!scwtutorial', '!scwtut', '!scwguide'],
  },
  {
    title: 'Understanding Inventory Slot Transfer',
    response: 'https://youtu.be/TN_2rRqEDsQ',
    commands: ['!understandingist', '!istexplained'],
  },
  {
    title: 'All Dungeons IST setup',
    response: 'https://youtu.be/NZBmu9hEZY0',
    commands: ['!adist'],
  },
  {
    title: 'Amiibo alternatives',
    response:
      'NFC tags can be used as an alternative to real amiibo. Blank NFC tags can be purchased for cheap online and written to using tools like tagmo: https://play.google.com/store/apps/details?id=com.hiddenramblings.tagmo.eightbit',
    commands: ['!nfc', '!tagmo'],
  },
  {
    title: 'Any% Fish Amiibo',
    response: 'https://imgur.com/a/amiibo-needed-any-yvxxKeC',
    commands: ['!fishamiibo', '!any%amiibo'],
  },
  {
    title: 'Enemy and Amiibo drop tables',
    response: 'https://restite.org/drops/',
    commands: ['!droptables', '!amiibodrops', '!enemydrops'],
  },
  {
    title: 'Version info',
    response: `Allowed versions for speedrun submissions: 1.0, 1.3.1, 1.5, 1.6, 1.7, 1.8.2 S1E, 1.8.2 S2E.
      v1.7 and prior: Makes heavy use of BLSS for long distance movement. Versions prior to v1.6 have slower loads on Switch 1. Glitches exclusive to pre-v1.6 versions are not allowed in speedrun submissions.
      v1.8: BLSS patched. Long distance movement will involve use of BTBs instead.
      v1.8 Switch 2 Edition: Runs at 60fps and has even faster loads. Has variances on all physics based tricks, including skew clips, windbombs and BTBs.`,
    commands: ['!versions', '!versioninfo'],
  },
  {
    title: 'Language speeds',
    response: `The fastest language for a category depends on the voice acted cutscenes that need to be watched and the text that needs to be scrolled through. Text on screen is affected by console language while VA cutscene lengths (including interactive VA cutscenes like the Dark Beast fight) are affected by VA language.
      Fastest language calculator: https://pistonight.github.io/botw-fastest-lang`,
    commands: ['!languages', '!languageinfo'],
  },
  {
    title: 'Console differences',
    response: `WiiU: Slowest console. Can only run v1.5 or prior versions. Slowest loads compared to Switch 1 and 2. Worse lag makes windbombing in some areas inconsistent.
      Switch 1: Fastest option for v1.6 speedruns and fastest option overall for most short and mid length categories. Can run v1.8 as well, but has worse load times compared to Switch 2.
      Switch 2: Much faster loads compared to the other consoles. Limited to v1.8 and later meaning runs on Switch 2 cannot use BLSS. Fastest option overall for very long categories.`,
    commands: ['!consoles', '!consoleinfo'],
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
  // {
  //   title: 'Downpatching',
  //   response: 'TODO Fill this',
  //   commands: ['!downpatch', '!downpatching'],
  // },
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
    responseCell.innerHTML = response.replace(/\n/g, ' <br> ').replace(/(https?:\/\/[^\s]+)/g, '<a href="$1">$1</a>');

    // Append cells to the row
    row.appendChild(commandCellContainer);
    row.appendChild(responseCell);

    // Append the row to the table body
    tableBody.appendChild(row);
  });
})();
