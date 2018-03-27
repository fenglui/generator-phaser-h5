const path = require('path');
const chalk = require('chalk');
const util = require('util');
const Generator = require('yeoman-generator');
const yosay = require('yosay');
const mkdirp = require('mkdirp');
const foldername = path.basename(process.cwd());

module.exports = class extends Generator {
    initializing() {
        this.props = {};
    }
    prompting() {
        this.log(yosay(
            '~' + chalk.red('generator-phaser-h5') + '~'
        ));
        return this.prompt([{
                type: 'input',
                name: 'projectName',
                message: 'What\'s the name of your application(in English Please)',
                default: foldername
            },
            {
                type: 'input',
                name: 'projectDesc',
                message: 'What\'s the description of your application(optional):'
            },
            {
                type: 'list',
                name: 'projectLicense',
                message: 'Please choose license:',
                choices: ['MIT', 'ISC', 'Apache-2.0', 'AGPL-3.0']
            },
            {
                type: 'confirm',
                name: 'projectSass',
                message: 'Do You Use Sass?(default:N)',
                default: false
            }
        ]).then(answers => {
            this.projectName = answers.projectName ? answers.projectName : ' ';
            this.projectDesc = answers.projectDesc ? answers.projectDesc : ' ';
            this.projectLicense = answers.projectLicense || 'MIT';
            this.projectSass = answers.projectSass || false;
        });
    }
    configuring() {
        this.config.set('projectName', this.projectName);
        this.config.set('projectDesc', this.projectDesc);
        this.config.set('projectLicense', this.projectLicense);
        this.config.set('projectSass', this.projectSass);
    }
    writing() {
        this.fs.copyTpl(
            this.templatePath('src/index.html'),
            this.destinationPath('src/index.html'),
            this
        );
        this.fs.copy(
            this.templatePath('src/assets/img'),
            this.destinationPath('src/assets/img'),
            this
        );
        this.fs.copy(
            this.templatePath('src/assets/js'),
            this.destinationPath('src/assets/js'),
            this
        );
        mkdirp('src/assets/media');
        if (this.projectSass) {
            this.fs.copy(
                this.templatePath('src/assets/css/sass.scss'),
                this.destinationPath('src/assets/css/sass.scss'),
                this
            );
            this.fs.copyTpl(
                this.templatePath('_package_sass.json'),
                this.destinationPath('package.json'),
                this
            );
            this.fs.copy(
                this.templatePath('_gulpfile_sass.js'),
                this.destinationPath('gulpfile.js'),
                this
            );
        } else {
            this.fs.copy(
                this.templatePath('src/assets/css/css.css'),
                this.destinationPath('src/assets/css/css.css'),
                this
            );
            this.fs.copyTpl(
                this.templatePath('_package.json'),
                this.destinationPath('package.json'),
                this
            );
            this.fs.copy(
                this.templatePath('_gulpfile.js'),
                this.destinationPath('gulpfile.js'),
                this
            );
        }

        this.fs.copy(
            this.templatePath('jshintrc'),
            this.destinationPath('.jshintrc'),
            this
        );


    }
    install() { //安装依赖
        this.installDependencies({ bower: false });
    }
};