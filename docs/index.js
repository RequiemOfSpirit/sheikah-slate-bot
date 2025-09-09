// Local JavaScript variable containing the data
const commandsData = [
  {
    title: 'Help',
    response: 'This is a guide to get started with the bot.',
    commands: ['!start', '!info'],
  },
  {
    title: 'FAQ',
    response: 'Frequently Asked Questions about the bot.',
    commands: ['!questions', '!support'],
  },
  {
    title: 'About',
    response: 'Information about the Sheikah Slate bot.',
    commands: ['!info', '!details'],
  }
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
    commands.forEach(command => {
      const chip = document.createElement('span');
      chip.classList.add('chip');
      chip.textContent = command;
      chipContainer.appendChild(chip);
    });
    commandCell.appendChild(chipContainer);

    // Create the response cell
    const responseCell = document.createElement('td');
    responseCell.textContent = response;

    // Append cells to the row
    row.appendChild(commandCellContainer);
    row.appendChild(responseCell);

    // Append the row to the table body
    tableBody.appendChild(row);
  });
})();
