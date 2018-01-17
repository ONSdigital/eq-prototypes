# eQ prototypes


## Install
Install [RVM](https://rvm.io/) and run:
- `gem install bundler`
- `git clone https://github.com/ONSdigital/eq-prototypes.git`
- `cd eq-prototypes`
- `bundle install`
- `npm install`

## Run
Install [node](https://nodejs.org/en/) and [gulp](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md) and then run:
- `gulp`


## View Prototypes

[http://onsdigital.github.io/eq-prototypes/](http://onsdigital.github.io/eq-prototypes/)


## Development
To build custom code with access to pattern library modules
- Create a bundle.js file in any folder inside _prototypes/.
- Reference pattern library modules in ./_js/modules/
- Run gulp from the command line in the root of the project.
- A corresponding compiled bundle.js with be written to the folder js/compiled/
- Reference the generated bundle.js in your HTML file(s).
