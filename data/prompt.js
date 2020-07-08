const inquirer = require('inquirer');
const { DDB } = require('./config');

module.exports = async (qs = 100) => {
  const answer = await inquirer.prompt([
    { name: 'env', message: 'Which environment?', type: 'list', choices: Object.keys(DDB), default: 'develop' },
    // { name: 'shouldPurge', message: 'Do you want to purge the tables?', type: 'confirm', default: false },
  ].filter((x, index) => index < qs));

  return Object.assign(answer, {
    hash: DDB[answer.env],
  });
};
